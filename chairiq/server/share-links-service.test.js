import assert from 'node:assert/strict';
import { test } from 'node:test';
import { build } from 'esbuild';

// Bundle the real browser service for Node. Only the remote Supabase boundary
// is replaced; tests do not load environment files, credentials, or patient data.
async function service(client) {
  const bundled = await build({
    entryPoints: ['src/services/shareLinkService.js'], bundle: true,
    format: 'esm', platform: 'node', write: false,
    plugins: [{ name: 'isolated-database-boundary', setup(builder) {
      builder.onResolve({ filter: /\/lib\/supabase$/ }, () => ({ path: 'test-db', namespace: 'test' }));
      builder.onLoad({ filter: /.*/, namespace: 'test' }, () => ({ contents: 'export const supabase = globalThis.__isolatedShareLinkDb;' }));
    } }],
  });
  globalThis.__isolatedShareLinkDb = client;
  try {
    return await import(`data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString('base64')}#${Math.random()}`);
  } finally { delete globalThis.__isolatedShareLinkDb; }
}

test('legacy links bypass the newer table entirely', async () => {
  const { shareLinkService } = await service({ from() { throw Error('Unexpected legacy table lookup'); } });
  assert.deepEqual(await shareLinkService.validateShareLink('oldToken_123'), { valid: false, reason: 'legacy' });
});

test('missing or malformed tokens are rejected without a request', async () => {
  const { shareLinkService } = await service({ from() { throw Error('Unexpected malformed token lookup'); } });
  for (const token of [null, '', 'short', 'a'.repeat(49), 'bad/path']) {
    assert.deepEqual(await shareLinkService.validateShareLink(token), { valid: false, reason: 'not_found' });
  }
});

test('valid expiring links use the exact-token RPC and its database expiry decision', async () => {
  const { shareLinkService } = await service({
    async rpc(name, args) {
      assert.equal(name, 'validate_plan_share_link');
      assert.deepEqual(args, { link_token: 'A'.repeat(48) });
      return { data: { valid: false, reason: 'expired' }, error: null };
    },
  });
  assert.deepEqual(await shareLinkService.validateShareLink('A'.repeat(48)), { valid: false, reason: 'expired' });
});

test('RPC failure is an error, never a legacy-link fallback', async () => {
  const { shareLinkService } = await service({ async rpc() { return { error: { code: 'PGRST202', message: 'Missing migration' } }; } });
  const result = await shareLinkService.validateShareLink('A'.repeat(48));
  assert.equal(result.reason, 'error');
  assert.equal(result.error, 'Unable to verify this link. Please try again later.');
});

test('unavailable expiring-link creation cannot produce a legacy URL', async () => {
  const { shareLinkService } = await service({ from() { throw Error('Unavailable'); } });
  const result = await shareLinkService.getOrCreateShareLink('plan', 'patient');
  assert.equal(result.success, false);
  assert.equal(result.token, undefined);
});

test('empty tokens do not create a sendable patient URL', async () => {
  const { buildPatientPlanUrl } = await service(null);
  assert.equal(buildPatientPlanUrl(null, 'https://example.test'), '');
});

test('sharing actions fail closed when no expiring token can be created', async () => {
  const { shareLinkService } = await service({ from() { throw Error('Missing table'); } });
  await assert.rejects(shareLinkService.requireShareLink('plan', 'patient'), /Unable to retrieve/);
});

test('patient loader refuses expired, invalid, and unavailable share links without loading a plan', async () => {
  for (const response of [
    { data: { valid: false, reason: 'expired' } },
    { data: { valid: false, reason: 'not_found' } },
    { error: { code: 'PGRST202' } },
  ]) {
    const { shareLinkService } = await service({ rpc: async () => response });
    const plans = new Proxy({}, { get() { throw Error('Must not fetch patient data'); } });
    const result = await shareLinkService.loadPatientPlan('A'.repeat(48), plans);
    assert.equal(result.success, false);
    assert.equal(result.reason, response.data?.reason || 'error');
  }
});

test('patient loader preserves legacy links and never falls back after a valid share-link plan fails', async () => {
  const { shareLinkService } = await service({ rpc: async () => ({
    data: { valid: true, link: { plan_id: 'plan-1', expires_at: '2099-01-01T00:00:00Z' } },
  }) });
  const data = { success: true, patient: { firstName: 'Synthetic' }, procedures: [] };
  const legacy = await shareLinkService.loadPatientPlan('oldToken_123', {
    async getEnrichedPatientPlan(token) { assert.equal(token, 'oldToken_123'); return data; },
  });
  assert.equal(legacy.patient.firstName, 'Synthetic');
  assert.equal(legacy.linkSource, 'legacy_link');
  const failed = await shareLinkService.loadPatientPlan('A'.repeat(48), {
    async getEnrichedPatientPlan(value) { assert.equal(value, 'A'.repeat(48)); return { success: false, error: 'Unavailable' }; },
    async getEnrichedPatientPlanById() { assert.fail('Must not load public plan by ID'); },
  });
  assert.equal(failed.success, false);
});

test('patient loader displays a valid shared plan even when optional view counting fails', async () => {
  const { shareLinkService } = await service({ rpc: async name => name === 'validate_plan_share_link'
    ? { data: { valid: true, link: { plan_id: 'plan-1', expires_at: '2099-01-01T00:00:00Z' } } }
    : { error: { code: 'PGRST202' } },
  });
  const result = await shareLinkService.loadPatientPlan('A'.repeat(48), {
    async getEnrichedPatientPlan() { return { success: true, patient: { firstName: 'Synthetic' } }; },
  });
  assert.equal(result.success, true);
  assert.equal(result.linkSource, 'share_link');
});

test('dashboard view gets a fresh expiring token rather than using a revoked legacy token',async()=>{
 const {openPatientPlan}=await service({from(){return {insert(){return {select(){return {single:async()=>({data:{token:'C'.repeat(48),expires_at:'2026-09-09T00:00:00Z'}})}}}}}}});
 let saved, destination;
 globalThis.window={sessionStorage:{setItem(k,v){saved=v;}}};
 try {await openPatientPlan({id:'plan',patientId:'patient',publicToken:'revoked:old'},p=>{destination=p;});assert.equal(saved,'C'.repeat(48));assert.equal(destination,'/p');}
 finally{delete globalThis.window;}
});
test('dashboard view stays put when link creation fails',async()=>{
 const {openPatientPlan}=await service({from(){throw Error('Unavailable');}});
 let navigated=false;
 await assert.rejects(openPatientPlan({id:'plan',patientId:'patient'},()=>{navigated=true;}));
 assert.equal(navigated,false);
});

test('staff sharing replaces a revoked plan reference with a fresh expiring bearer', async () => {
 const { shareLinkService } = await service({ from(table) {
  if (table === 'treatment_plans') return { select: () => ({ eq(column,value) {
   assert.equal(column,'public_token'); assert.equal(value,'revoked:sample');
   return { maybeSingle: async () => ({data:{id:'plan',patient_id:'patient'}}) };
  } }) };
  assert.equal(table,'plan_share_links');
  return { insert(row) {
   assert.equal(row.plan_id,'plan'); assert.equal(row.patient_id,'patient');
   return { select: () => ({single:async () => ({data:{token:'D'.repeat(48)}})}) };
  } };
 } });
 assert.equal(await shareLinkService.requireShareLinkForPlanToken('revoked:sample'),'D'.repeat(48));
});
test('staff sharing cannot mint a link for an inaccessible plan reference', async () => {
 const {shareLinkService}=await service({from(table) {
  assert.equal(table,'treatment_plans');
  return {select:()=>({eq:()=>({maybeSingle:async()=>({data:null})})})};
 }});
 await assert.rejects(shareLinkService.requireShareLinkForPlanToken('other-plan'),/unavailable/i);
});

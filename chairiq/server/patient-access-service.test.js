import assert from 'node:assert/strict';
import { test } from 'node:test';
import { build } from 'esbuild';

async function moduleFor(entry, client) {
  const bundle=await build({entryPoints:[entry],bundle:true,format:'esm',platform:'node',write:false,logLevel:'silent',plugins:[{name:'offline-supabase',setup(b){
    b.onResolve({filter:/\/twilioService$/},()=>({path:'sms',namespace:'offline-sms'}));
    b.onLoad({filter:/.*/,namespace:'offline-sms'},()=>({contents:'export const twilioService = globalThis.__offlineSms;'}));
    b.onResolve({filter:/\/lib\/supabase$/},()=>({path:'db',namespace:'test'}));
    b.onLoad({filter:/.*/,namespace:'test'},()=>({contents:'export const supabase=globalThis.__patientTestDb; export const downloadPatientImage=(...args)=>globalThis.__patientTestDb.downloadPatientImage(...args);'}));
  }}]});
  globalThis.__patientTestDb=client;
  return import(`data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString('base64')}#${Math.random()}`);
}

test('patient data fetch uses the bearer token, never a public table query',async()=>{
  const token='A'.repeat(48);
  const mod=await moduleFor('src/services/patientPlanService.js',{from(){assert.fail('Public patient-table access');},async rpc(name,args){assert.equal(name,'get_patient_plan');assert.deepEqual(args,{link_token:token});return {data:{success:true,plan:{id:'synthetic',patients:{first_name:'Synthetic'},plan_procedures:[]}}};}});
  const plans=mod.patientPlanService || mod.default;
  plans._enrichPlanData=async(plan,options)=>{assert.equal(options.token,token);return {success:true,id:plan.id};};
  assert.deepEqual(await plans.getEnrichedPatientPlan(token),{success:true,id:'synthetic'});
});

test('expiry during data fetch is returned without enriching or retrying',async()=>{
  const mod=await moduleFor('src/services/patientPlanService.js',{async rpc(){return {data:{success:false,reason:'expired'}};}});
  const plans=mod.patientPlanService || mod.default;
  plans._enrichPlanData=()=>assert.fail('Expired data cannot be enriched');
  assert.deepEqual(await plans.getEnrichedPatientPlan('A'.repeat(48)),{success:false,reason:'expired'});
});

test('patient image uploads use a private bucket and save an object path, never a public URL',async()=>{
  let uploadedBucket, saved;
  const db={storage:{from(bucket){uploadedBucket=bucket;return {async upload(path){return {data:{path}};},async download(){return {data:new Blob(['synthetic'],{type:'image/png'})};},getPublicUrl(){assert.fail('Patient image made public');}};}},from(table){assert.equal(table,'patient_plan_images');return {select(){return this;},eq(){return this;},async maybeSingle(){return {data:null};},insert(row){saved=row;return this;},async single(){return {data:saved};}};}};
  const {default:storage}=await moduleFor('src/services/storageService.js',db);
  const result=await storage.uploadPatientImage('30000000-0000-0000-0000-000000000001',{name:'x.png',type:'image/png'},'Synthetic note',0);
  assert.equal(uploadedBucket,'patient-images');
  assert.match(saved.image_url,/^patient-specific\//);
  assert.equal(saved.plan_procedure_id,'30000000-0000-0000-0000-000000000001');
  assert.ok(result.record);
});

test('patient image downloads use token-scoped metadata and private bytes',async()=>{
  const db={from(){assert.fail('Patient metadata must come from protected plan response');},storage:{from(){assert.fail('Patient must not download directly from Storage');}},async downloadPatientImage(token,procedure,path){assert.equal(token,'A'.repeat(48));assert.equal(procedure,'procedure');assert.equal(path,'patient-specific/procedure/test.png');return new Blob(['synthetic'],{type:'image/png'});}};
  const {default:storage}=await moduleFor('src/services/storageService.js',db);
  const result=await storage.fetchPatientImages('procedure',{token:'A'.repeat(48),rows:[{image_url:'patient-specific/procedure/test.png',alt_text_en:'Synthetic',sort_order:0}]});
  assert.match(result[0].imageUrl,/^data:image\/png;base64,/);assert.equal(result[0].note,'Synthetic');
});

test('staff resend loads owner-only contact details and issues an expiring link',async()=>{
  let delivery;
  globalThis.window={location:{origin:'https://example.test'}};
  globalThis.__offlineSms={async sendTreatmentPlanSMS(...args){delivery=args;return {success:true,messageSid:'synthetic'};},formatPhoneNumber(x){return x;}};
  const db={from(table){return {select(){return this;},eq(){return this;},gt(){return this;},order(){return this;},limit(){return this;},insert(){return this;},async single(){return {data:{token:'D'.repeat(48),expires_at:'2099-01-01T00:00:00Z'}};},async maybeSingle(){
    if(table==='treatment_plans')return {data:{id:'plan',patient_id:'patient',practice_name:'Synthetic',patients:{phone:'555',first_name:'Synthetic'}}};
    if(table==='plan_share_links')return {data:{token:'C'.repeat(48),expires_at:new Date(Date.now()+1000).toISOString()}};
    assert.fail(table);
  }};},rpc(){assert.fail('Staff resend must not fetch public patient contact details');}};
  const {patientPlanService:plans}=await moduleFor('src/services/patientPlanService.js',db);
  assert.equal((await plans.resendTreatmentPlanLink('oldToken_123')).success,true);
  assert.equal(delivery[0],'555');assert.equal(delivery[3],'D'.repeat(48));
});

test('staff resend cannot send when owner-scoped plan is unavailable',async()=>{
  globalThis.__offlineSms={async sendTreatmentPlanSMS(){assert.fail('Unauthorized send');}};
  const db={from(){return {select(){return this;},eq(){return this;},async maybeSingle(){return {data:null};}};},rpc(){assert.fail('No public fallback');}};
  const {patientPlanService:plans}=await moduleFor('src/services/patientPlanService.js',db);
  assert.equal((await plans.resendTreatmentPlanLink('oldToken_123')).success,false);
});

test('synthetic staff previews do not query patient image UUIDs',async()=>{
  const {default:storage}=await moduleFor('src/services/storageService.js',{from(){assert.fail('Preview has no patient procedure');}});
  assert.deepEqual(await storage.fetchPatientImages('preview-crown'),[]);
});

import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { test } from 'node:test';
import { PGlite } from '@electric-sql/pglite';

const owner = '00000000-0000-0000-0000-000000000001';
const other = '00000000-0000-0000-0000-000000000002';
const patient = '10000000-0000-0000-0000-000000000001';
const plan = '20000000-0000-0000-0000-000000000001';
const token = 'A'.repeat(48);
const expired = 'B'.repeat(48);
const migrations = new URL('../supabase/migrations/', import.meta.url);

async function fixture(upgrade) {
  // In-memory PostgreSQL only. Never reads .env or connects to a server.
  const db = new PGlite();
  await db.exec(`
    CREATE ROLE anon; CREATE ROLE authenticated;
    CREATE SCHEMA auth;
    CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS
      $$ SELECT nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
    GRANT USAGE ON SCHEMA auth TO anon, authenticated;
    CREATE TABLE public.patients(id uuid PRIMARY KEY);
    CREATE TABLE public.treatment_plans (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(), patient_id uuid REFERENCES patients(id),
      public_token text UNIQUE, created_by uuid);
    ALTER TABLE public.treatment_plans ENABLE ROW LEVEL SECURITY;
    CREATE POLICY allow_all_access_treatment_plans ON public.treatment_plans
      FOR ALL TO public USING (true) WITH CHECK (true);
    GRANT ALL ON public.treatment_plans, public.patients TO anon, authenticated;
    INSERT INTO patients VALUES ('${patient}'), ('10000000-0000-0000-0000-000000000002');
    INSERT INTO treatment_plans VALUES ('${plan}', '${patient}', 'legacy_12345', '${owner}');
    INSERT INTO treatment_plans VALUES
      ('20000000-0000-0000-0000-000000000002', '${patient}', 'legacy_67890', NULL);
  `);
  if (upgrade) {
    await db.exec(readFileSync(new URL('20260304010000_plan_share_links.sql', migrations), 'utf8'));
    await db.exec('GRANT ALL ON public.plan_share_links TO anon, authenticated');
    // This token existed while PUBLIC could list links and arbitrary signed-in
    // users could create them with any expiry. It must not survive the upgrade.
    await db.query(`INSERT INTO public.plan_share_links(token, plan_id, patient_id, expires_at)
      VALUES ($1,$2,$3,now()+interval '10 years')`, ['F'.repeat(48), plan, patient]);
  }
  const correction = readdirSync(migrations).find(name => name.endsWith('_secure_plan_share_links.sql'));
  if (correction) await db.exec(readFileSync(new URL(correction, migrations), 'utf8'));
  else if (!upgrade) await db.exec(readFileSync(new URL('20260304010000_plan_share_links.sql', migrations), 'utf8'));
  await db.exec(`GRANT SELECT ON public.plan_share_links TO anon`); // RLS must still prevent enumeration.
  await db.exec(`INSERT INTO public.plan_share_links(token, plan_id, patient_id, expires_at)
    VALUES ('${token}', '${plan}', '${patient}', now() + interval '24 hours'),
           ('${expired}', '${plan}', '${patient}', now() - interval '1 second')`);
  return db;
}

async function asRole(db, role, user, callback) {
  await db.exec('BEGIN');
  try {
    await db.exec(`SET LOCAL ROLE ${role}`);
    await db.query("SELECT set_config('request.jwt.claim.sub', $1, true)", [user || '']);
    return await callback();
  } finally { await db.exec('ROLLBACK'); }
}

for (const upgrade of [false, true]) {
  test(`share-link database safeguards (${upgrade ? 'upgrade old table' : 'missing table'})`, async t => {
    const db = await fixture(upgrade);
    t.after(() => db.close());

    if (upgrade) await t.test('pre-upgrade publicly readable tokens are invalidated', () =>
      asRole(db, 'anon', null, async () => {
        const result = (await db.query('SELECT public.validate_plan_share_link($1) AS result', ['F'.repeat(48)])).rows[0].result;
        assert.deepEqual(result, { valid: false, reason: 'expired' });
      }));

    await t.test('anonymous callers cannot enumerate bearer tokens even with SELECT granted', () =>
      asRole(db, 'anon', null, async () => {
        assert.equal((await db.query('SELECT token FROM public.plan_share_links')).rows.length, 0);
      }));
    await t.test('another dentist cannot read links or insert a link for this plan', () =>
      asRole(db, 'authenticated', other, async () => {
        assert.equal((await db.query('SELECT token FROM public.plan_share_links')).rows.length, 0);
        await assert.rejects(db.query(`INSERT INTO public.plan_share_links(token, plan_id, patient_id, expires_at)
          VALUES ($1,$2,$3,now()+interval '24 hours')`, ['C'.repeat(48), plan, patient]), /permission|policy|owner/i);
      }));
    await t.test('owner can create a matching link and the database enforces a 24-hour lifetime', () =>
      asRole(db, 'authenticated', owner, async () => {
        const result = await db.query(`INSERT INTO public.plan_share_links(token, plan_id, patient_id, expires_at)
          VALUES ($1,$2,$3,now()+interval '10 years')
          RETURNING extract(epoch FROM expires_at - now())::int AS lifetime`, ['D'.repeat(48), plan, patient]);
        assert.equal(result.rows[0].lifetime, 86400);
      }));
    await t.test('owner cannot bind a link to a different patient', () =>
      asRole(db, 'authenticated', owner, async () => {
        await assert.rejects(db.query(`INSERT INTO public.plan_share_links(token, plan_id, patient_id, expires_at)
          VALUES ($1,$2,$3,now()+interval '24 hours')`,
        ['E'.repeat(48), plan, '10000000-0000-0000-0000-000000000002']), /permission|policy|patient/i);
      }));
    await t.test('anonymous exact-token lookup returns only the valid link and handles expiry', () =>
      asRole(db, 'anon', null, async () => {
        const lookup = async value => (await db.query('SELECT public.validate_plan_share_link($1) AS result', [value])).rows[0].result;
        assert.equal((await lookup(token)).link.plan_id, plan);
        assert.deepEqual(await lookup(expired), { valid: false, reason: 'expired' });
        for (const bad of [null, '', '%', 'A', 'Z'.repeat(48), `${token}' OR true--`]) {
          assert.deepEqual(await lookup(bad), { valid: false, reason: 'not_found' });
        }
      }));
    await t.test('view counter increments only an exact unexpired token', () =>
      asRole(db, 'anon', null, async () => {
        await db.query('SELECT public.increment_share_link_view($1::varchar)', [token]);
        await db.query('SELECT public.increment_share_link_view($1::varchar)', [expired]);
        await db.query('SELECT public.increment_share_link_view($1::varchar)', ['%']);
        await db.exec('RESET ROLE');
        const rows = (await db.query('SELECT token, view_count FROM public.plan_share_links WHERE token IN ($1,$2) ORDER BY token', [token, expired])).rows;
        assert.deepEqual(rows.map(row => row.view_count), [1, 0]);
      }));
    await t.test('public plan writes cannot bypass link ownership', () =>
      asRole(db, 'anon', null, async () => {
        assert.equal((await db.query('UPDATE public.treatment_plans SET created_by=$1 WHERE id=$2 RETURNING id', [other, plan])).rows.length, 0);
        await assert.rejects(db.query('INSERT INTO public.treatment_plans(patient_id, created_by) VALUES ($1,$2)', [patient, other]), /permission|policy|auth/i);
      }));
    await t.test('dentists cannot take over another plan or an unowned legacy plan', () =>
      asRole(db, 'authenticated', other, async () => {
        assert.equal((await db.query('UPDATE public.treatment_plans SET created_by=$1 RETURNING id', [other])).rows.length, 0);
      }));
    await t.test('new plans inherit the authenticated owner and ownership cannot be reassigned', () =>
      asRole(db, 'authenticated', owner, async () => {
        const row = (await db.query('INSERT INTO public.treatment_plans(patient_id) VALUES ($1) RETURNING created_by', [patient])).rows[0];
        assert.equal(row.created_by, owner);
        await assert.rejects(db.query('UPDATE public.treatment_plans SET created_by=$1 WHERE id=$2', [other, plan]), /owner|policy/i);
      }));
  });
}

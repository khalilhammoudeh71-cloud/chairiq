import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { PGlite } from '@electric-sql/pglite';

const owner = '00000000-0000-0000-0000-000000000001';
const other = '00000000-0000-0000-0000-000000000002';
const patient = '10000000-0000-0000-0000-000000000001';
const otherPatient = '10000000-0000-0000-0000-000000000002';
const plan = '20000000-0000-0000-0000-000000000001';
const otherPlan = '20000000-0000-0000-0000-000000000002';
const proc = '30000000-0000-0000-0000-000000000001';
const token = 'A'.repeat(48);
const expired = 'B'.repeat(48);
const legacy = 'oldToken_123';
const sql = name => readFileSync(new URL(`../supabase/migrations/${name}`, import.meta.url), 'utf8');
const scope = () => sql('20260908142423_scope_patient_data_access.sql');

async function fixture(apply = true) {
  const db = new PGlite(); // Synthetic, in-memory PostgreSQL; no env or network.
  await db.exec(`
    CREATE ROLE anon; CREATE ROLE authenticated;
    CREATE SCHEMA auth; CREATE SCHEMA storage;
    CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS
      $$ SELECT nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
    GRANT USAGE ON SCHEMA auth, storage TO anon, authenticated;
    CREATE FUNCTION storage.allow_any_operation(text[]) RETURNS boolean LANGUAGE sql STABLE AS
      $$ SELECT current_setting('storage.operation',true) = ANY($1) $$;
    CREATE TABLE storage.buckets(id text PRIMARY KEY, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]);
    CREATE TABLE storage.objects(id uuid DEFAULT gen_random_uuid(), bucket_id text, name text);
    CREATE TABLE patients(id uuid PRIMARY KEY DEFAULT gen_random_uuid(), first_name text, last_name text, phone text, preferred_language text);
    CREATE TABLE treatment_plans(id uuid PRIMARY KEY DEFAULT gen_random_uuid(), patient_id uuid REFERENCES patients, public_token text UNIQUE, created_by uuid, dentist_name text, practice_name text, created_at timestamptz DEFAULT now());
    CREATE TABLE plan_procedures(id uuid PRIMARY KEY, treatment_plan_id uuid REFERENCES treatment_plans, procedure_name text, procedure_slug text, display_title text, ada_code text, tooth_numbers text, canonical_slug text, priority text, est_time text, notes_for_patient text, sort_order int);
    CREATE TABLE canonical_procedures(slug text PRIMARY KEY);
    INSERT INTO canonical_procedures VALUES ('dental-crown');
    CREATE TABLE procedure_visuals(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),canonical_slug text REFERENCES canonical_procedures(slug),step_key text,image_url text,alt_text_en text,alt_text_es text,sort_order int);
    CREATE TABLE sms_messages(id uuid DEFAULT gen_random_uuid(),treatment_plan_id uuid,patient_id uuid);
    CREATE TABLE plan_reminders(id uuid DEFAULT gen_random_uuid(),plan_id uuid);
    CREATE FUNCTION public.get_sms_delivery_metrics(timestamptz DEFAULT NULL, timestamptz DEFAULT NULL) RETURNS bigint LANGUAGE sql SECURITY DEFINER AS $$ SELECT count(*) FROM public.sms_messages $$;
    INSERT INTO patients VALUES ('${patient}','Synthetic','One','555','EN'), ('${otherPatient}','Synthetic','Two','999','ES');
    INSERT INTO treatment_plans(id,patient_id,public_token,created_by) VALUES ('${plan}','${patient}','${legacy}','${owner}'), ('${otherPlan}','${otherPatient}','otherTok_123','${other}');
    INSERT INTO plan_procedures(id,treatment_plan_id,notes_for_patient) VALUES ('${proc}','${plan}','Synthetic private note');
    INSERT INTO sms_messages(treatment_plan_id,patient_id) VALUES ('${plan}','${patient}'), ('${otherPlan}','${otherPatient}');
    INSERT INTO plan_reminders(plan_id) VALUES ('${plan}'), ('${otherPlan}');
    INSERT INTO procedure_visuals(canonical_slug,image_url) VALUES ('dental-crown','https://example.test/generic.png');
    INSERT INTO storage.buckets VALUES ('treatment-images','treatment-images',true,NULL,NULL);
  `);
  const related = {
    patient_session_analytics:'treatment_plan_id', patient_engagement_events:'treatment_plan_id',
    patient_language_preferences:'treatment_plan_id', procedure_completion_tracking:'treatment_plan_id',
    sms_link_clicks:'treatment_plan_id', plan_views:'plan_id', message_logs:'plan_id',
  };
  for (const [table,fk] of Object.entries(related)) {
    await db.exec(`CREATE TABLE ${table}(id uuid DEFAULT gen_random_uuid(),${fk} uuid,patient_id uuid,procedure_id uuid);
      INSERT INTO ${table}(${fk},patient_id) VALUES ('${plan}','${patient}'),('${otherPlan}','${otherPatient}');
      ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY;
      CREATE POLICY old_public ON ${table} FOR ALL TO PUBLIC USING(true) WITH CHECK(true);
      GRANT ALL ON ${table} TO anon,authenticated;`);
  }
  for (const table of ['patients','treatment_plans','plan_procedures','procedure_visuals','sms_messages','plan_reminders','storage.objects']) {
    await db.exec(`ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY; CREATE POLICY old_public ON ${table} FOR ALL TO PUBLIC USING(true) WITH CHECK(true); GRANT ALL ON ${table} TO anon,authenticated`);
  }
  await db.exec(sql('20260908052729_secure_plan_share_links.sql'));
  if (apply) await db.exec(scope());
  if (apply && scope().trim()) {
    await db.exec(`UPDATE patients SET created_by=CASE id WHEN '${patient}' THEN '${owner}'::uuid ELSE '${other}'::uuid END`);
  }
  await db.exec(`INSERT INTO plan_share_links(token,plan_id,patient_id,expires_at) VALUES ('${token}','${plan}','${patient}',now()+interval '24 hours'), ('${expired}','${plan}','${patient}',now()-interval '1 minute')`);
  return db;
}
async function asRole(db, role, uid, callback, link = '', operation = '') {
  await db.exec('BEGIN');
  try {
    await db.exec(`SET LOCAL ROLE ${role}`);
    await db.query("SELECT set_config('request.jwt.claim.sub',$1,true),set_config('request.headers',$2,true),set_config('storage.operation',$3,true)", [uid || '',JSON.stringify({'x-chairiq-plan-token':link}),operation]);
    return await callback();
  } finally { await db.exec('ROLLBACK'); }
}
async function rowsOrDenied(db, table) {
  try { return (await db.query(`SELECT * FROM ${table}`)).rows; }
  catch(e) { if(e.code === '42501') return []; throw e; }
}

test('patient data access is scoped at the database boundary', async t => {
  const db = await fixture(); t.after(() => db.close());
  for(const table of ['patients','treatment_plans','plan_procedures','sms_messages','plan_reminders','patient_session_analytics','patient_engagement_events','patient_language_preferences','procedure_completion_tracking','sms_link_clicks','plan_views','message_logs','patient_plan_images']) {
    await t.test(`anonymous callers cannot enumerate ${table}`, () => asRole(db,'anon',null,async () => {
      assert.equal((await rowsOrDenied(db,table)).length,0);
    }));
  }
  await t.test('dentists see only their own patient, plan and messages', () => asRole(db,'authenticated',owner,async () => {
    for(const table of ['patients','treatment_plans','sms_messages','plan_reminders','patient_session_analytics','patient_engagement_events','patient_language_preferences','procedure_completion_tracking','sms_link_clicks','plan_views','message_logs']) assert.equal((await db.query(`SELECT * FROM ${table}`)).rows.length,1);
  }));
  await t.test('knowing a plan ID cannot fetch another dentist’s plan', () => asRole(db,'authenticated',other,async () => {
    assert.equal((await db.query('SELECT * FROM treatment_plans WHERE id=$1',[plan])).rows.length,0);
    assert.equal((await db.query('SELECT * FROM plan_procedures WHERE id=$1',[proc])).rows.length,0);
  }));
  await t.test('an owner can create patients and plans but cannot attach a foreign patient', () => asRole(db,'authenticated',owner,async () => {
    const p = (await db.query("INSERT INTO patients(first_name) VALUES ('New synthetic') RETURNING *")).rows[0];
    assert.equal(p.created_by,owner);
    assert.equal((await db.query('INSERT INTO treatment_plans(patient_id) VALUES ($1) RETURNING created_by',[p.id])).rows[0].created_by,owner);
    await assert.rejects(db.query('INSERT INTO treatment_plans(patient_id) VALUES ($1)',[otherPatient]),/policy|permission/i);
  }));
  await t.test('patient ownership cannot be transferred by a client', () => asRole(db,'authenticated',owner,async () => {
    await assert.rejects(db.query('UPDATE patients SET created_by=$1 WHERE id=$2',[other,patient]),/owner|policy|permission/i);
  }));
  await t.test('exact token fetch returns one plan without contact details or other bearer tokens', () => asRole(db,'anon',null,async () => {
    for (const value of [token,legacy]) {
      const result=(await db.query('SELECT public.get_patient_plan($1) AS result',[value])).rows[0].result;
      assert.equal(result.success,true); assert.equal(result.plan.id,plan);
      assert.equal(result.plan.plan_procedures[0].notes_for_patient,'Synthetic private note');
      assert.equal(result.plan.patients.phone,undefined); assert.equal(result.plan.public_token,undefined);
      assert.equal(result.plan.created_by,undefined);
    }
    for(const value of [expired,'Z'.repeat(48),null,'%',plan]) {
      const result=(await db.query('SELECT public.get_patient_plan($1) AS result',[value])).rows[0].result;
      assert.equal(result.success,false); assert.equal(result.plan,undefined);
    }
  }));
  await t.test('a valid token does not grant direct table access', () => asRole(db,'anon',null,async () => {
    assert.equal((await rowsOrDenied(db,'treatment_plans')).length,0);
  },token));
  await t.test('old metrics function respects owner RLS', () => asRole(db,'authenticated',owner,async () => {
    assert.equal(Number((await db.query('SELECT public.get_sms_delivery_metrics() AS n')).rows[0].n),1);
  }));
  await t.test('anonymous callers cannot invoke old metrics functions', () => asRole(db,'anon',null,async () => {
    await assert.rejects(db.query('SELECT public.get_sms_delivery_metrics()'),/permission/i);
  }));
  await t.test('patient image metadata is private but generic educational visuals remain public', async () => {
    await db.exec(`INSERT INTO patient_plan_images(plan_procedure_id,step_key,image_url) VALUES ('${proc}','patient_img_0','patient-specific/${proc}/patient_img_0.png')`);
    await asRole(db,'anon',null,async () => {
      assert.equal((await db.query('SELECT * FROM procedure_visuals')).rows.length,1);
      const result=(await db.query('SELECT get_patient_plan($1) AS r',[token])).rows[0].r;
      assert.equal(result.plan.plan_procedures[0].patient_images.length,1);
    });
    await asRole(db,'authenticated',other,async()=>assert.equal((await db.query('SELECT * FROM patient_plan_images')).rows.length,0));
    await asRole(db,'authenticated',owner,async()=>assert.equal((await db.query('SELECT * FROM patient_plan_images')).rows.length,1));
  });
  await t.test('private Storage denies all direct anonymous access, including valid bearer headers', async () => {
    await db.exec(`INSERT INTO storage.objects(bucket_id,name) VALUES ('patient-images','patient-specific/${proc}/patient_img_0.png')`);
    for(const [link,operation,expected] of [[token,'object.get_authenticated',0],[legacy,'object.get_authenticated',0],[expired,'object.get_authenticated',0],[token,'object.sign',0],[token,'object.list',0],['','object.get_authenticated',0]]) {
      await asRole(db,'anon',null,async () => assert.equal((await db.query('SELECT * FROM storage.objects')).rows.length,expected),link,operation);
    }
    await asRole(db,'authenticated',other,async () => assert.equal((await db.query('SELECT * FROM storage.objects')).rows.length,0));
    await asRole(db,'authenticated',owner,async () => assert.equal((await db.query('SELECT * FROM storage.objects')).rows.length,1));
    assert.equal((await db.query("SELECT public FROM storage.buckets WHERE id='patient-images'")).rows[0].public,false);
  });
  await t.test('patient uploads cannot go into the old public folder', () => asRole(db,'authenticated',owner,async () => {
    await assert.rejects(db.query("INSERT INTO storage.objects(bucket_id,name) VALUES ('treatment-images',$1)",[`patient-specific/${proc}/new.png`]),/policy|permission/i);
  }));
});

test('nullable audit references preserve owner access and reject another patient',async t=>{
  const db=await fixture();t.after(()=>db.close());
  await asRole(db,'authenticated',owner,async()=>{
    await db.query('INSERT INTO sms_messages(treatment_plan_id,patient_id) VALUES ($1,NULL)',[plan]);
    assert.equal((await db.query('SELECT * FROM sms_messages')).rows.length,2);
    await assert.rejects(db.query('INSERT INTO sms_messages(treatment_plan_id,patient_id) VALUES ($1,$2)',[plan,otherPatient]),/policy|permission/i);
  });
});

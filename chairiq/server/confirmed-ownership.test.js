import assert from 'node:assert/strict';
import { existsSync,readFileSync } from 'node:fs';
import { test } from 'node:test';
import { PGlite } from '@electric-sql/pglite';
const path=new URL('../supabase/reviewed-operations/assign-confirmed-plan-owners.sql',import.meta.url);
const operation=()=>existsSync(path)?readFileSync(path,'utf8'):'';
const owner='d9683d3c-7761-4f9b-8e07-2e0785dc28ee';
const patient='12779f7b-2366-4113-85f7-559bb084d1a9';
const plan1='a452b656-9d70-453a-8ade-42cb3b475bc5';
const plan2='d27cf683-3687-4d25-ad96-5713daccdbf8';
async function fixture(){
 const db=new PGlite();
 await db.exec(`CREATE SCHEMA auth; CREATE TABLE auth.users(id uuid PRIMARY KEY); INSERT INTO auth.users VALUES ('${owner}');
 CREATE TABLE patients(id uuid PRIMARY KEY,created_by uuid);CREATE TABLE treatment_plans(id uuid PRIMARY KEY,patient_id uuid,created_by uuid);
 INSERT INTO patients VALUES ('${patient}',NULL); INSERT INTO treatment_plans VALUES ('${plan1}','${patient}',NULL),('${plan2}','${patient}',NULL);`);
 return db;
}
test('reviewed ownership operation assigns exactly the confirmed rows',async t=>{
 const db=await fixture();t.after(()=>db.close());await db.exec(operation());
 assert.deepEqual((await db.query('SELECT created_by FROM treatment_plans')).rows.map(r=>r.created_by),[owner,owner]);
 assert.equal((await db.query('SELECT created_by FROM patients')).rows[0].created_by,owner);
});
test('reviewed operation aborts on changed ownership or extra plans for that patient',async t=>{
 for(const setup of ["UPDATE treatment_plans SET created_by='00000000-0000-0000-0000-000000000001'",`INSERT INTO treatment_plans VALUES ('20000000-0000-0000-0000-000000000003','${patient}',NULL)`,'DELETE FROM auth.users']) {
  const db=await fixture();t.after(()=>db.close());await db.exec(setup);
  await assert.rejects(db.exec(operation()),/review|confirmed|owner|account/i);
  await db.exec('ROLLBACK');
  assert.equal((await db.query('SELECT created_by FROM patients')).rows[0].created_by,null);
 }
});

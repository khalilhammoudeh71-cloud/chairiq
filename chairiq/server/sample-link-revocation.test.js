import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {test} from 'node:test';
import {PGlite} from '@electric-sql/pglite';
const path=new URL('../supabase/reviewed-operations/revoke-confirmed-sample-links.sql',import.meta.url);
const operation=()=>existsSync(path)?readFileSync(path,'utf8'):'';
const owner='d9683d3c-7761-4f9b-8e07-2e0785dc28ee', patient='12779f7b-2366-4113-85f7-559bb084d1a9';
const first='a452b656-9d70-453a-8ade-42cb3b475bc5', second='d27cf683-3687-4d25-ad96-5713daccdbf8';
async function fixture(){
 const db=new PGlite();
 await db.exec(`CREATE TABLE patients(id uuid PRIMARY KEY,created_by uuid); CREATE TABLE treatment_plans(id uuid PRIMARY KEY,patient_id uuid,created_by uuid,public_token text NOT NULL UNIQUE);
 INSERT INTO patients VALUES ('${patient}','${owner}');
 INSERT INTO treatment_plans VALUES ('${first}','${patient}','${owner}','SampleToken1'),('${second}','${patient}','${owner}','SampleToken2'),('00000000-0000-0000-0000-000000000003',NULL,NULL,'Unrelated123');`);
 return db;
}
test('sample link revocation removes old bearers without deleting plans or changing unrelated links',async t=>{
 const db=await fixture(); t.after(()=>db.close()); await db.exec(operation());
 assert.equal((await db.query("SELECT count(*)::int n FROM treatment_plans WHERE public_token IN ('SampleToken1','SampleToken2')")).rows[0].n,0);
 assert.equal((await db.query('SELECT count(*)::int n FROM treatment_plans')).rows[0].n,3);
 const rows=(await db.query('SELECT * FROM treatment_plans WHERE patient_id=$1',[patient])).rows;
 assert.equal(rows.length,2);
 for(const row of rows){assert.equal(row.created_by,owner);assert.doesNotMatch(row.public_token,/^[A-Za-z0-9_-]{12}$|^[A-Za-z0-9]{48}$/);}
 assert.equal((await db.query("SELECT public_token FROM treatment_plans WHERE patient_id IS NULL")).rows[0].public_token,'Unrelated123');
});
test('sample revocation aborts atomically if ownership, membership or sample set changed',async t=>{
 for(const setup of ["UPDATE treatment_plans SET created_by=NULL",`DELETE FROM treatment_plans WHERE id='${second}'`,`INSERT INTO treatment_plans VALUES ('00000000-0000-0000-0000-000000000004','${patient}','${owner}','NewSample123')`,"UPDATE patients SET created_by=NULL"]){
  const db=await fixture();t.after(()=>db.close());await db.exec(setup);
  await assert.rejects(db.exec(operation()),/review/i);await db.exec('ROLLBACK');
  assert.equal((await db.query('SELECT public_token FROM treatment_plans WHERE id=$1',[first])).rows[0].public_token,'SampleToken1');
 }
});

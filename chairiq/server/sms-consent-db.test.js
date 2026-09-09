import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {test} from 'node:test';
import {PGlite} from '@electric-sql/pglite';
const migrations=new URL('../supabase/migrations/',import.meta.url);
const migration=()=>readFileSync(new URL(readdirSync(migrations).find(n=>n.endsWith('_protect_sms_consent.sql')),migrations),'utf8');
async function fixture(){
 const db=new PGlite();
 await db.exec(`CREATE ROLE anon;CREATE ROLE authenticated;CREATE ROLE service_role BYPASSRLS;
 CREATE TABLE public.sms_consent(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),phone text NOT NULL,patient_name text,consent boolean NOT NULL DEFAULT true,consented_at timestamptz NOT NULL DEFAULT now(),created_at timestamptz NOT NULL DEFAULT now());
 GRANT ALL ON public.sms_consent TO anon,authenticated,service_role;
 INSERT INTO public.sms_consent(phone,patient_name,consent) VALUES ('+14085550101','Synthetic consent',false);`);
 return db;
}
async function asRole(db,role,fn){await db.exec(`BEGIN; SET LOCAL ROLE ${role}`);try{return await fn();}finally{await db.exec('ROLLBACK');}}
test('consent lockdown preserves records and denies client access',async t=>{
 const db=await fixture();t.after(()=>db.close());
 const before=(await db.query('SELECT * FROM sms_consent')).rows;
 await db.exec(migration());
 assert.deepEqual((await db.query('SELECT * FROM sms_consent')).rows,before);
 assert.equal((await db.query("SELECT relrowsecurity FROM pg_class WHERE oid='sms_consent'::regclass")).rows[0].relrowsecurity,true);
 for(const role of ['anon','authenticated'])for(const [operation,sql] of [
  ['read','SELECT * FROM sms_consent'],
  ['insert',"INSERT INTO sms_consent(phone,patient_name) VALUES ('+14085550102','Forged')"],
  ['update','UPDATE sms_consent SET consent=true'],
  ['delete','DELETE FROM sms_consent'],
  ['truncate','TRUNCATE sms_consent']
 ])await t.test(`${role} cannot ${operation} consent`,()=>asRole(db,role,async()=>await assert.rejects(db.exec(sql),/permission denied/i)));
 await t.test('trusted server keeps read and write access',()=>asRole(db,'service_role',async()=>{
   assert.equal((await db.query('SELECT consent FROM sms_consent')).rows[0].consent,false);
   await db.exec("INSERT INTO sms_consent(phone,patient_name,consent) VALUES ('+14085550103','Synthetic server record',true)");
   assert.equal((await db.query('UPDATE sms_consent SET consent=false RETURNING id')).rows.length,2);
 }));
 await t.test('RLS still denies clients after accidental permissive policy and grants',async()=>{
  await db.exec('GRANT SELECT,INSERT,UPDATE,DELETE ON sms_consent TO anon,authenticated; CREATE POLICY accidental_public_access ON sms_consent FOR ALL TO PUBLIC USING(true) WITH CHECK(true)');
  await asRole(db,'anon',async()=>{
   assert.equal((await db.query('SELECT * FROM sms_consent')).rows.length,0);
   assert.equal((await db.query('UPDATE sms_consent SET consent=true RETURNING id')).rows.length,0);
   await assert.rejects(db.exec("INSERT INTO sms_consent(phone) VALUES ('+14085550104')"),/policy/i);
  });
 });
});

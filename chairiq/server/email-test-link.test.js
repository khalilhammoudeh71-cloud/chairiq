import assert from 'node:assert/strict';
import {test} from 'node:test';
import {build} from 'esbuild';
globalThis.window={location:{origin:'https://chairiq-delta.vercel.app'}};
async function service(){
 const b=await build({entryPoints:['src/services/emailService.js'],bundle:true,format:'esm',platform:'node',write:false,plugins:[{name:'isolated-auth',setup(x){x.onResolve({filter:/\/lib\/supabase$/},()=>({path:'auth',namespace:'test'}));x.onLoad({filter:/.*/,namespace:'test'},()=>({contents:`export const supabase = { rpc:async (name,args)=>({data:args.link_token === 'A'.repeat(48) ? {valid:true,link:{plan_id:'sample',expires_at:'2099-01-01'}} : {valid:false,reason:'expired'}}) };`}));}}]});
 return (await import('data:text/javascript;base64,'+Buffer.from(b.outputFiles[0].text).toString('base64'))).emailService;
}
test('test email rejects missing or fake plan links without sending',async()=>{
 const s=await service();let sends=0;s.sendNotification=async()=>{sends++;return {success:true}};
 for(const url of [undefined,'https://chairiq-delta.vercel.app/p/sample-test-token-12345','javascript:alert(1)','https://chairiq-delta.vercel.app/p/'+'B'.repeat(48)])assert.equal((await s.sendTestEmail('test@example.invalid',url)).success,false);
 assert.equal(sends,0);
});
test('test email uses the supplied valid bearer link',async()=>{
 const s=await service();const url='https://chairiq-delta.vercel.app/p/'+'A'.repeat(48);let payload;
 s.sendNotification=async p=>{payload=p;return {success:true}};
 assert.equal((await s.sendTestEmail('test@example.invalid',url)).success,true);
 assert.equal(payload.planUrl,url);assert.equal(payload.toEmail,'test@example.invalid');
});

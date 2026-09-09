import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {test} from 'node:test';
const path=new URL('../supabase/functions/patient-plan-image/handler.js',import.meta.url);
const factory=existsSync(path)?(await import(path)).createPatientImageHandler:()=>async()=>new Response('',{status:501});
const token='A'.repeat(48),procedure='30000000-0000-0000-0000-000000000001',object=`patient-specific/${procedure}/patient_img_0.png`;
const request=(changes={})=>new Request('https://example.test/image',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({link_token:token,procedure_id:procedure,object_path:object,...changes})});
function handler(fetchImpl){return factory({supabaseUrl:'https://synthetic.supabase.co',anonKey:'synthetic-anon',serviceKey:'synthetic-service',fetchImpl});}
test('image endpoint refuses expired links before accessing Storage',async()=>{
 const h=handler(async url=>{assert.match(url,/rest\/v1\/rpc\/get_patient_plan$/);return Response.json({success:false,reason:'expired'});});
 const r=await h(request());assert.equal(r.status,403);assert.match(r.headers.get('Cache-Control'),/no-store/);
});
test('image endpoint refuses an image not in the token-authorized plan',async()=>{
 const h=handler(async()=>Response.json({success:true,plan:{plan_procedures:[{id:procedure,patient_images:[]}]}}));
 assert.equal((await h(request())).status,403);
});
test('image endpoint revalidates each request and returns uncached bytes, never a signed URL',async()=>{
 let checks=0,downloads=0;
 const h=handler(async(url,options)=>{
  if(url.includes('/rpc/')){checks++;assert.equal(options.headers.Authorization,'Bearer synthetic-anon');assert.deepEqual(JSON.parse(options.body),{link_token:token});return Response.json({success:true,plan:{plan_procedures:[{id:procedure,patient_images:[{image_url:object}]}]}});}
  downloads++;assert.match(url,/storage\/v1\/object\/authenticated\/patient-images\//);assert.equal(options.headers.Authorization,'Bearer synthetic-service');
  return new Response(new Uint8Array([1,2,3]),{headers:{'Content-Type':'image/png','Cache-Control':'public, max-age=3600'}});
 });
 for(let i=0;i<2;i++){const r=await h(request());assert.equal(r.status,200);assert.equal(r.headers.get('Cache-Control'),'private, no-store, max-age=0');assert.equal(r.headers.get('Content-Type'),'image/png');assert.deepEqual([...new Uint8Array(await r.arrayBuffer())],[1,2,3]);}
 assert.equal(checks,2);assert.equal(downloads,2);
});
test('image endpoint rejects malformed requests without network access',async()=>{
 const h=handler(()=>assert.fail('No network for invalid requests'));
 assert.equal((await h(request({link_token:'wrong'}))).status,400);
 assert.equal((await h(new Request('https://example.test/image'))).status,405);
});

test('real browser transport preserves binary image bytes and never reuses staff authentication',async()=>{
 const {build}=await import('esbuild');
 const bundle=await build({entryPoints:['src/lib/supabase.js'],bundle:true,format:'esm',platform:'node',write:false,logLevel:'silent',define:{'import.meta.env':JSON.stringify({VITE_SUPABASE_URL:'https://synthetic.supabase.co',VITE_SUPABASE_ANON_KEY:'synthetic-anon'})}});
 const module=await import(`data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString('base64')}`);
 assert.equal(typeof module.downloadPatientImage,'function');
 const original=globalThis.fetch;
 try {
  globalThis.fetch=async(url,options)=>{assert.match(url,/functions\/v1\/patient-plan-image$/);assert.equal(options.headers.Authorization,'Bearer synthetic-anon');assert.equal(options.cache,'no-store');assert.equal(options.credentials,'omit');assert.equal(JSON.parse(options.body).link_token,token);return new Response(new Uint8Array([137,80,78,71,255]),{headers:{'Content-Type':'image/png'}});};
  const blob=await module.downloadPatientImage(token,procedure,object);assert.equal(blob.type,'image/png');assert.deepEqual([...new Uint8Array(await blob.arrayBuffer())],[137,80,78,71,255]);
 } finally {globalThis.fetch=original;}
});

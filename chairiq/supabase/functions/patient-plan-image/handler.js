const HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Cache-Control': 'private, no-store, max-age=0',
  'CDN-Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
};
const MAX_IMAGE_BYTES = 10485760;
const TOKEN = /^(?:[A-Za-z0-9_-]{12}|[A-Za-z0-9]{48})$/;

// The service key exists only in the Edge runtime. Patient authorization always
// comes from an exact-token RPC followed by an exact image metadata match.
export function createPatientImageHandler({supabaseUrl, anonKey, serviceKey, fetchImpl = fetch}) {
  const failure = (status, error) => Response.json({error}, {status, headers:HEADERS});
  return async request => {
    if (request.method === 'OPTIONS') return new Response(null, {status:204,headers:HEADERS});
    if (request.method !== 'POST') return failure(405,'POST required');
    if (!supabaseUrl || !anonKey || !serviceKey) return failure(503,'Image service unavailable');
    try {
      if (Number(request.headers.get('content-length')) > 4096) return failure(400,'Invalid request');
      const raw = await request.text();
      if (raw.length > 4096) return failure(400,'Invalid request');
      let input;
      try { input = JSON.parse(raw); } catch { return failure(400,'Invalid request'); }
      const {link_token, procedure_id, object_path} = input || {};
      if (typeof link_token !== 'string' || !TOKEN.test(link_token) || typeof procedure_id !== 'string'
        || typeof object_path !== 'string' || !object_path.startsWith(`patient-specific/${procedure_id}/`)
        || object_path.includes('..') || object_path.length > 512) return failure(400,'Invalid request');
      const lookup = await fetchImpl(`${supabaseUrl}/rest/v1/rpc/get_patient_plan`, {
        method:'POST', headers:{apikey:anonKey,Authorization:`Bearer ${anonKey}`,'Content-Type':'application/json'},
        body:JSON.stringify({link_token}), cache:'no-store',
      });
      if (!lookup.ok) return failure(503,'Image service unavailable');
      const result = await lookup.json();
      if (!result.success || !result.plan?.plan_procedures?.some(p => p.id === procedure_id
        && p.patient_images?.some(image => image.image_url === object_path))) return failure(403,'Image unavailable');
      const encodedPath = object_path.split('/').map(encodeURIComponent).join('/');
      const download = await fetchImpl(`${supabaseUrl}/storage/v1/object/authenticated/patient-images/${encodedPath}`, {
        headers:{apikey:serviceKey,Authorization:`Bearer ${serviceKey}`}, cache:'no-store',
      });
      if (!download.ok) return failure(404,'Image unavailable');
      const mime = download.headers.get('Content-Type')?.split(';')[0];
      if (!['image/png','image/jpeg','image/webp','image/gif'].includes(mime)
        || Number(download.headers.get('Content-Length')) > MAX_IMAGE_BYTES) return failure(415,'Unsupported image');
      const data = await download.arrayBuffer();
      if (data.byteLength > MAX_IMAGE_BYTES) return failure(413,'Image too large');
      return new Response(data,{headers:{...HEADERS,'Content-Type':mime}});
    } catch {
      // Never log tokens, patient metadata, upstream responses or credentials.
      return failure(503,'Image service unavailable');
    }
  };
}

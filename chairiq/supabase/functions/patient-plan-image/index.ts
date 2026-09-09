import { createPatientImageHandler } from './handler.js';
Deno.serve(createPatientImageHandler({
  supabaseUrl: Deno.env.get('SUPABASE_URL'),
  anonKey: Deno.env.get('SUPABASE_ANON_KEY'),
  serviceKey: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
}));

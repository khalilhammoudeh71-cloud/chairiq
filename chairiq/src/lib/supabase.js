import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY). Authentication features will be unavailable.');
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
      }
    })
  : null;

// Fetch the binary response explicitly: functions-js parses image/* as text.
// Send only the public anon key and bearer body, never a persisted staff session.
export async function downloadPatientImage(token, procedureId, objectPath) {
  if (!supabaseUrl || !supabaseAnonKey || !/^(?:[A-Za-z0-9_-]{12}|[A-Za-z0-9]{48})$/.test(token || '')) {
    throw new Error('Patient link unavailable');
  }
  const response = await fetch(`${supabaseUrl}/functions/v1/patient-plan-image`, {
    method: 'POST',
    headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseAnonKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ link_token: token, procedure_id: procedureId, object_path: objectPath }),
    cache: 'no-store', credentials: 'omit',
  });
  if (!response.ok) throw new Error('Unable to load patient image');
  return response.blob();
}

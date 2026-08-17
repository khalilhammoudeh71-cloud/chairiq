// SMS sending via Twilio — the A2P-approved route.
// Twilio credentials live in the Supabase Edge Function `send-sms`
// (TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN / TWILIO_PHONE_NUMBER),
// so this server calls that function rather than holding credentials itself.

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

function formatPhoneE164(phone) {
  let cleaned = (phone || '').replace(/\D/g, '');
  if (cleaned.length === 10) {
    cleaned = '1' + cleaned;
  }
  if (cleaned.length < 10 || cleaned.length > 15) {
    throw new Error('Invalid phone number. Must be 10-15 digits.');
  }
  return '+' + cleaned;
}

export async function sendTreatmentPlanSMS(phone, secureLink) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('SMS is not configured: missing Supabase URL or key on the server.');
  }
  if (!phone) throw new Error('Phone number is required.');
  if (!secureLink) throw new Error('Secure link is required.');

  const to = formatPhoneE164(phone);
  // Message format matches the registered A2P campaign samples:
  // brand name first, link, opt-out language.
  const text = `Khalil Hammoudeh PLLC: Your dental treatment plan is ready. View it securely here: ${secureLink} Reply STOP to opt out.`;

  console.log('[SMS] Sending via Twilio (send-sms edge function)', { to });

  const res = await fetch(`${SUPABASE_URL}/functions/v1/send-sms`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'apikey': SUPABASE_ANON_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ to, message: text }),
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok || body?.success === false) {
    const detail = body?.message || body?.error || `HTTP ${res.status}`;
    console.error('[SMS] Twilio send failed:', { status: res.status, body });
    throw new Error(`SMS error: ${detail}`);
  }

  console.log('[SMS] Sent successfully via Twilio', { to });
  return { ok: true, to, provider: 'twilio' };
}

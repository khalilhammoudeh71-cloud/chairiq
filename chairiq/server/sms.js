const TELNYX_API_KEY = process.env.TELNYX_API_KEY;
const TELNYX_FROM_NUMBER = process.env.TELNYX_FROM_NUMBER;

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
  if (!TELNYX_API_KEY || !TELNYX_FROM_NUMBER) {
    throw new Error('Telnyx is not configured. Set TELNYX_API_KEY and TELNYX_FROM_NUMBER.');
  }

  if (!phone) throw new Error('Phone number is required.');
  if (!secureLink) throw new Error('Secure link is required.');

  const to = formatPhoneE164(phone);
  const text = `ChairIQ: Your dental treatment plan is ready. View it securely here: ${secureLink}`;

  console.log('[SMS] Sending via Telnyx', { to, from: TELNYX_FROM_NUMBER });

  const res = await fetch('https://api.telnyx.com/v2/messages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TELNYX_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: TELNYX_FROM_NUMBER,
      to,
      text,
    }),
  });

  const body = await res.json();

  if (!res.ok) {
    const errDetail = body?.errors?.[0]?.detail || body?.errors?.[0]?.title || JSON.stringify(body);
    console.error('[SMS] Telnyx API error:', { status: res.status, body });
    throw new Error(`Telnyx error (${res.status}): ${errDetail}`);
  }

  console.log('[SMS] Sent successfully', { id: body?.data?.id, to });
  return { ok: true, messageId: body?.data?.id, to };
}

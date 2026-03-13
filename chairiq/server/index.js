import express from 'express';
import { createServer as createViteServer } from 'vite';
import { createClient } from '@supabase/supabase-js';
import { sendEmail, buildTreatmentPlanEmail } from './mailer.js';
import { sendTreatmentPlanSMS } from './sms.js';

const PORT = 5000;

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_ANON_KEY;

async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ ok: false, error: 'Authentication required' });
  }

  if (!supabaseUrl || !supabaseServiceKey) {
    return res.status(500).json({ ok: false, error: 'Server auth not configured' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ ok: false, error: 'Invalid or expired session' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ ok: false, error: 'Authentication failed' });
  }
}

function smtpErrorToUserMessage(err) {
  const code = err.responseCode || err.code;
  if (code === 535 || err.message?.includes('Authentication')) {
    return 'Email service authentication failed. Please check SMTP credentials.';
  }
  if (code === 'ECONNREFUSED' || code === 'ESOCKET') {
    return 'Could not connect to email server. Please check SMTP host and port.';
  }
  if (code === 'EENVELOPE' || code === 552 || code === 553) {
    return 'Invalid recipient email address.';
  }
  if (err.message?.includes('SMTP not configured')) {
    return 'Email service is not configured. Please set SMTP environment variables.';
  }
  return 'Failed to send email. Please try again later.';
}

async function start() {
  const app = express();
  app.use(express.json());

  app.post('/api/notifications/send', requireAuth, async (req, res) => {
    try {
      const { method, toEmail, toPhone, patientName, planUrl } = req.body;

      if (!method || !['email', 'sms'].includes(method)) {
        return res.status(400).json({ ok: false, error: 'Invalid method. Use "email" or "sms".' });
      }

      if (method === 'email') {
        if (!toEmail || !planUrl) {
          return res.status(400).json({ ok: false, error: 'Missing required fields: toEmail, planUrl' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(toEmail)) {
          return res.status(400).json({ ok: false, error: 'Invalid email address' });
        }

        const { html, text } = buildTreatmentPlanEmail(planUrl, patientName);

        await sendEmail({
          to: toEmail,
          subject: 'Your ChairIQ Treatment Plan',
          html,
          text,
        });

        return res.json({ ok: true, method: 'email' });
      }

      if (method === 'sms') {
        if (!toPhone || !planUrl) {
          return res.status(400).json({ ok: false, error: 'Missing required fields: toPhone, planUrl' });
        }
        await sendTreatmentPlanSMS(toPhone, planUrl);
        return res.json({ ok: true, method: 'sms' });
      }
    } catch (err) {
      console.error('[API] Notification send error:', err.message);
      const userMessage = smtpErrorToUserMessage(err);
      res.status(500).json({ ok: false, error: userMessage });
    }
  });

  function getAuthenticatedSupabase(userToken) {
    const sb = createClient(supabaseUrl, supabaseServiceKey, {
      global: { headers: { Authorization: `Bearer ${userToken}` } },
    });
    return sb;
  }

  async function logMessageSend({ userToken, planId, patientId, method, destination, messagePreview, status, providerResponse }) {
    if (!supabaseUrl || !supabaseServiceKey || !planId) return;
    try {
      const sb = userToken
        ? getAuthenticatedSupabase(userToken)
        : createClient(supabaseUrl, supabaseServiceKey);
      await sb.from('message_logs').insert({
        plan_id: planId,
        patient_id: patientId || null,
        method,
        destination,
        message_preview: messagePreview || null,
        status,
        provider_response: providerResponse ? JSON.stringify(providerResponse) : null,
      });
    } catch (logErr) {
      console.error('[API] Failed to log message send:', logErr.message);
    }
  }

  async function verifyPlanOwnership(planId, userId) {
    if (!planId || !supabaseUrl || !supabaseServiceKey) return false;
    const sb = createClient(supabaseUrl, supabaseServiceKey);
    const { data: plan, error } = await sb
      .from('treatment_plans')
      .select('id, user_id')
      .eq('id', planId)
      .single();
    if (error || !plan) return false;
    if (plan.user_id && plan.user_id !== userId) return false;
    return true;
  }

  app.post('/api/send-treatment-plan', requireAuth, async (req, res) => {
    const { deliveryMethod, phone, email, secureLink, patientName, planId, patientId } = req.body;
    const userToken = req.headers.authorization?.split(' ')[1];

    if (!deliveryMethod || !['sms', 'email'].includes(deliveryMethod)) {
      return res.status(400).json({ ok: false, error: 'Invalid deliveryMethod. Use "sms" or "email".' });
    }

    if (!secureLink) {
      return res.status(400).json({ ok: false, error: 'secureLink is required.' });
    }

    if (planId) {
      const isOwner = await verifyPlanOwnership(planId, req.user.id);
      if (!isOwner) {
        return res.status(403).json({ ok: false, error: 'Not authorized to send for this plan.' });
      }
    }

    if (deliveryMethod === 'sms') {
      if (!phone) {
        return res.status(400).json({ ok: false, error: 'Phone number is required for SMS delivery.' });
      }
      const phoneDigits = phone.replace(/\D/g, '');
      if (phoneDigits.length < 10 || phoneDigits.length > 15) {
        return res.status(400).json({ ok: false, error: 'Invalid phone number. Please enter a valid number.' });
      }
      const smsPreview = `ChairIQ: Your dental treatment plan is ready. View it here: ${secureLink}`;
      try {
        const result = await sendTreatmentPlanSMS(phone, secureLink);
        await logMessageSend({ userToken, planId, patientId, method: 'sms', destination: phone, messagePreview: smsPreview, status: 'sent', providerResponse: result });
        return res.json({ ok: true, method: 'sms' });
      } catch (err) {
        console.error('[API] send-treatment-plan SMS error:', err.message);
        await logMessageSend({ userToken, planId, patientId, method: 'sms', destination: phone, messagePreview: smsPreview, status: 'failed', providerResponse: { error: err.message } });
        const smsMsg = err.message?.includes('Telnyx') || err.message?.includes('phone')
          ? err.message
          : 'Failed to send SMS. Please try again later.';
        return res.status(err.message?.includes('Telnyx') ? 502 : 500).json({ ok: false, error: smsMsg });
      }
    }

    if (deliveryMethod === 'email') {
      if (!email) {
        return res.status(400).json({ ok: false, error: 'Email address is required for email delivery.' });
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ ok: false, error: 'Invalid email address.' });
      }
      const emailPreview = `Subject: Your ChairIQ Treatment Plan\nYour dental treatment plan is ready for review. View it here: ${secureLink}`;
      try {
        const { html, text } = buildTreatmentPlanEmail(secureLink, patientName);
        const result = await sendEmail({
          to: email,
          subject: 'Your ChairIQ Treatment Plan',
          html,
          text,
        });
        await logMessageSend({ userToken, planId, patientId, method: 'email', destination: email, messagePreview: emailPreview, status: 'sent', providerResponse: { messageId: result?.messageId } });
        return res.json({ ok: true, method: 'email' });
      } catch (err) {
        console.error('[API] send-treatment-plan email error:', err.message);
        await logMessageSend({ userToken, planId, patientId, method: 'email', destination: email, messagePreview: emailPreview, status: 'failed', providerResponse: { error: err.message } });
        const userMessage = smtpErrorToUserMessage(err);
        return res.status(500).json({ ok: false, error: userMessage });
      }
    }
  });

  app.get('/api/message-logs/:planId', requireAuth, async (req, res) => {
    try {
      const { planId } = req.params;
      if (!planId) {
        return res.status(400).json({ ok: false, error: 'planId is required.' });
      }
      if (!supabaseUrl || !supabaseServiceKey) {
        return res.status(500).json({ ok: false, error: 'Supabase not configured.' });
      }

      const isOwner = await verifyPlanOwnership(planId, req.user.id);
      if (!isOwner) {
        return res.status(403).json({ ok: false, error: 'Not authorized to view logs for this plan.' });
      }

      const userToken = req.headers.authorization?.split(' ')[1];
      const sb = getAuthenticatedSupabase(userToken);
      const { data, error } = await sb
        .from('message_logs')
        .select('*')
        .eq('plan_id', planId)
        .order('created_at', { ascending: false });
      if (error) {
        console.error('[API] message-logs query error:', error.message);
        return res.status(500).json({ ok: false, error: 'Failed to fetch message logs.' });
      }
      return res.json({ ok: true, logs: data || [] });
    } catch (err) {
      console.error('[API] message-logs error:', err.message);
      res.status(500).json({ ok: false, error: 'Failed to fetch message logs.' });
    }
  });

  app.post('/api/test-sms', requireAuth, async (req, res) => {
    try {
      const { phone, link } = req.body;
      if (!phone) {
        return res.status(400).json({ ok: false, error: 'Phone number is required.' });
      }
      const phoneDigits = phone.replace(/\D/g, '');
      if (phoneDigits.length < 10 || phoneDigits.length > 15) {
        return res.status(400).json({ ok: false, error: 'Invalid phone number. Please enter a valid number.' });
      }
      const testLink = link || `${req.protocol}://${req.get('host')}/p/test-plan-link`;
      await sendTreatmentPlanSMS(phone, testLink);
      return res.json({ ok: true, method: 'sms', message: 'Test SMS sent successfully.' });
    } catch (err) {
      console.error('[API] test-sms error:', err.message);
      res.status(500).json({ ok: false, error: err.message });
    }
  });

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  app.use(vite.middlewares);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Running on http://0.0.0.0:${PORT}`);
  });
}

start().catch((err) => {
  console.error('[Server] Failed to start:', err);
  process.exit(1);
});

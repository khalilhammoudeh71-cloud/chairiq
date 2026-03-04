import express from 'express';
import { createServer as createViteServer } from 'vite';
import { createClient } from '@supabase/supabase-js';
import { sendEmail, buildTreatmentPlanEmail } from './mailer.js';

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

async function start() {
  const app = express();
  app.use(express.json());

  app.post('/api/notifications/email', requireAuth, async (req, res) => {
    try {
      const { to, patientName, planLink } = req.body;

      if (!to || !planLink) {
        return res.status(400).json({ ok: false, error: 'Missing required fields: to, planLink' });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(to)) {
        return res.status(400).json({ ok: false, error: 'Invalid email address' });
      }

      const { html, text } = buildTreatmentPlanEmail(planLink, patientName);

      await sendEmail({
        to,
        subject: 'Your ChairIQ treatment plan',
        html,
        text,
      });

      res.json({ ok: true });
    } catch (err) {
      console.error('[API] Email send error:', err.message);
      res.status(500).json({ ok: false, error: err.message });
    }
  });

  app.post('/api/test-email', requireAuth, async (req, res) => {
    try {
      const { to } = req.body;

      if (!to) {
        return res.status(400).json({ ok: false, error: 'Missing required field: to' });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(to)) {
        return res.status(400).json({ ok: false, error: 'Invalid email address' });
      }

      const sampleLink = 'https://chairiq.online/p/sample-test-token-12345';
      const { html, text } = buildTreatmentPlanEmail(sampleLink, 'Test Patient');

      await sendEmail({
        to,
        subject: 'ChairIQ Test Email',
        html,
        text,
      });

      res.json({ ok: true, message: `Test email sent to ${to}` });
    } catch (err) {
      console.error('[API] Test email error:', err.message);
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

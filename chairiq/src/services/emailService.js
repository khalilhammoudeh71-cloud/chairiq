import { supabase } from '../lib/supabase';

async function getAuthHeaders() {
  const headers = { 'Content-Type': 'application/json' };

  if (supabase) {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    }
  }

  return headers;
}

export const emailService = {
  async sendTreatmentPlanEmail(to, planLink, patientName) {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/notifications/email', {
        method: 'POST',
        headers,
        body: JSON.stringify({ to, planLink, patientName }),
      });

      const data = await res.json();

      if (!data.ok) {
        return { success: false, error: data.error || 'Failed to send email' };
      }

      return { success: true };
    } catch (err) {
      console.error('Email send error:', err);
      return { success: false, error: err?.message || 'Network error' };
    }
  },

  async sendTestEmail(to) {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/test-email', {
        method: 'POST',
        headers,
        body: JSON.stringify({ to }),
      });

      const data = await res.json();

      if (!data.ok) {
        return { success: false, error: data.error || 'Failed to send test email' };
      }

      return { success: true, message: data.message };
    } catch (err) {
      console.error('Test email error:', err);
      return { success: false, error: err?.message || 'Network error' };
    }
  },
};

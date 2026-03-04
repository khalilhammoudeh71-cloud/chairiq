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
  async sendNotification({ method, toEmail, toPhone, patientName, planUrl }) {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/notifications/send', {
        method: 'POST',
        headers,
        body: JSON.stringify({ method, toEmail, toPhone, patientName, planUrl }),
      });

      const data = await res.json();

      if (!data.ok) {
        return { success: false, error: data.error || 'Failed to send notification' };
      }

      return { success: true, method: data.method };
    } catch (err) {
      console.error('Notification send error:', err);
      return { success: false, error: 'Network error — could not reach the server.' };
    }
  },

  async sendTestEmail(toEmail) {
    return this.sendNotification({
      method: 'email',
      toEmail,
      patientName: 'Test Patient',
      planUrl: `${window.location.origin}/p/sample-test-token-12345`,
    });
  },
};

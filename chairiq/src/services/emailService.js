import { supabase } from '../lib/supabase';
import { shareLinkService } from './shareLinkService';

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

  async sendTestEmail(toEmail, planUrl) {
    let url;
    try { url = new URL(planUrl); } catch { return { success: false, error: 'Paste a valid sample-plan link first.' }; }
    if (url.origin !== window.location.origin || !/^\/p\/[A-Za-z0-9]{48}$/.test(url.pathname) || url.search || url.hash) {
      return { success: false, error: 'Paste a fresh sample-plan link copied from this site.' };
    }
    const validation = await shareLinkService.validateShareLink(url.pathname.slice(3));
    if (!validation.valid) return { success: false, error: 'This link is invalid or expired. Copy a fresh sample-plan link.' };
    return this.sendNotification({
      method: 'email',
      toEmail,
      patientName: 'Test Patient',
      planUrl: url.href,
    });
  },
};

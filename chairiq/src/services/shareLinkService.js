import { supabase } from '../lib/supabase';

const PATIENT_PLAN_TOKEN_STORAGE_KEY = 'chairiq_patient_plan_token';
const PATIENT_PLAN_TOKEN_COOKIE = 'chairiq_plan_token';

export function buildPatientPlanPath(token) {
  return `/p/${encodeURIComponent(token || '')}`;
}

export function buildPatientPlanUrl(token, origin = window.location?.origin) {
  return `${origin}${buildPatientPlanPath(token)}`;
}

export function storePatientPlanToken(token) {
  if (typeof window === 'undefined' || !token) return;
  window.sessionStorage?.setItem(PATIENT_PLAN_TOKEN_STORAGE_KEY, token);
}

export function consumePatientPlanToken() {
  if (typeof window === 'undefined') return null;

  const cookiePrefix = `${PATIENT_PLAN_TOKEN_COOKIE}=`;
  const tokenCookie = document.cookie
    ?.split('; ')
    ?.find((cookie) => cookie.startsWith(cookiePrefix));
  if (!tokenCookie) {
    return window.sessionStorage?.getItem(PATIENT_PLAN_TOKEN_STORAGE_KEY);
  }

  const token = decodeURIComponent(tokenCookie.slice(cookiePrefix.length));
  storePatientPlanToken(token);
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${PATIENT_PLAN_TOKEN_COOKIE}=; Max-Age=0; Path=/p; SameSite=Lax${secure}`;
  return token;
}

function generateToken(length = 48) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, b => chars[b % chars.length]).join('');
}

const LINK_EXPIRY_HOURS = 24;

export const shareLinkService = {
  async createShareLink(planId, patientId) {
    try {
      const token = generateToken(48);
      const expiresAt = new Date(Date.now() + LINK_EXPIRY_HOURS * 60 * 60 * 1000).toISOString();

      const { data, error } = await supabase
        ?.from('plan_share_links')
        ?.insert({
          token,
          plan_id: planId,
          patient_id: patientId,
          expires_at: expiresAt,
          view_count: 0
        })
        ?.select()
        ?.single();

      if (error) throw error;

      return { success: true, token: data.token, expiresAt: data.expires_at };
    } catch (err) {
      console.error('Error creating share link:', err);
      return { success: false, error: err?.message || 'Failed to create share link' };
    }
  },

  async validateShareLink(token) {
    try {
      const { data, error } = await supabase
        ?.from('plan_share_links')
        ?.select('token, plan_id, patient_id, expires_at, view_count')
        ?.eq('token', token)
        ?.maybeSingle();

      if (error) throw error;

      if (!data) {
        return { valid: false, reason: 'not_found' };
      }

      const now = new Date();
      const expiresAt = new Date(data.expires_at);
      if (now > expiresAt) {
        return { valid: false, reason: 'expired', link: data };
      }

      return { valid: true, link: data };
    } catch (err) {
      console.error('Error validating share link:', err);
      return { valid: false, reason: 'error', error: err?.message };
    }
  },

  async incrementViewCount(token) {
    try {
      await supabase?.rpc('increment_share_link_view', { link_token: token });
    } catch (err) {
      console.error('Error incrementing view count:', err);
    }
  },

  async getExistingValidLink(planId) {
    try {
      const { data, error } = await supabase
        ?.from('plan_share_links')
        ?.select('token, expires_at')
        ?.eq('plan_id', planId)
        ?.gt('expires_at', new Date().toISOString())
        ?.order('created_at', { ascending: false })
        ?.limit(1)
        ?.maybeSingle();

      if (error) throw error;
      if (!data) return null;

      return { token: data.token, expiresAt: data.expires_at };
    } catch (err) {
      console.error('Error fetching existing share link:', err);
      return null;
    }
  },

  async getOrCreateShareLink(planId, patientId) {
    const existing = await this.getExistingValidLink(planId);
    if (existing) return { success: true, ...existing };
    return await this.createShareLink(planId, patientId);
  },

  getShareUrl(token) {
    return buildPatientPlanUrl(token);
  }
};

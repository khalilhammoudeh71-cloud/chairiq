import { supabase } from '../lib/supabase';

const PATIENT_PLAN_TOKEN_STORAGE_KEY = 'chairiq_patient_plan_token';
const PATIENT_PLAN_TOKEN_COOKIE = 'chairiq_plan_token';

export function buildPatientPlanPath(token) {
  return `/p/${encodeURIComponent(token || '')}`;
}

export function buildPatientPlanUrl(token, origin = window.location?.origin) {
  if (!token) return '';
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
const LEGACY_TOKEN = /^[A-Za-z0-9_-]{12}$/;
const SHARE_TOKEN = /^[A-Za-z0-9]{48}$/;
const VERIFY_ERROR = 'Unable to verify this link. Please try again later.';

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
      // Do not log a database error object: it may include bearer tokens.
      console.error('Share-link creation failed', err?.code || 'unavailable');
      return { success: false, error: 'Unable to create a share link. Please try again later.' };
    }
  },

  async validateShareLink(token) {
    // Legacy plan tokens have a distinct format and intentionally do not expire.
    // Never reinterpret a failed/expired 48-character share token as a legacy one.
    if (typeof token === 'string' && LEGACY_TOKEN.test(token)) {
      return { valid: false, reason: 'legacy' };
    }
    if (typeof token !== 'string' || !SHARE_TOKEN.test(token)) {
      return { valid: false, reason: 'not_found' };
    }
    try {
      const { data, error } = await supabase.rpc('validate_plan_share_link', { link_token: token });
      if (error) throw error;
      if (data?.valid === true && data.link?.plan_id && data.link?.expires_at) return data;
      if (data?.valid === false && ['expired', 'not_found'].includes(data.reason)) return data;
      throw new Error('Invalid validation response');
    } catch (err) {
      console.error('Share-link validation failed', err?.code || 'unavailable');
      return { valid: false, reason: 'error', error: VERIFY_ERROR };
    }
  },

  async incrementViewCount(token) {
    if (typeof token !== 'string' || !SHARE_TOKEN.test(token)) return;
    try {
      const { error } = await supabase.rpc('increment_share_link_view', { link_token: token });
      if (error) throw error;
    } catch (err) {
      console.error('Share-link view count failed', err?.code || 'unavailable');
    }
  },

  async loadPatientPlan(token, plans) {
    const validation = await this.validateShareLink(token);
    if (validation.reason === 'legacy') {
      const data = await plans.getEnrichedPatientPlan(token);
      return { ...data, linkSource: 'legacy_link' };
    }
    if (!validation.valid) return { success: false, ...validation };
    const data = await plans.getEnrichedPatientPlan(token);
    if (data?.success) await this.incrementViewCount(token);
    return { ...data, linkSource: 'share_link' };
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
      console.error('Share-link lookup failed', err?.code || 'unavailable');
      throw new Error('Unable to retrieve a share link. Please try again later.');
    }
  },

  async getOrCreateShareLink(planId, patientId) {
    try {
      const existing = await this.getExistingValidLink(planId);
      if (existing) return { success: true, ...existing };
      return await this.createShareLink(planId, patientId);
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async requireShareLink(planId, patientId, { fresh = false } = {}) {
    const result = fresh
      ? await this.createShareLink(planId, patientId)
      : await this.getOrCreateShareLink(planId, patientId);
    if (!result?.success || !SHARE_TOKEN.test(result.token || '')) {
      throw new Error(result?.error || 'Unable to create a share link. Please try again later.');
    }
    return result.token;
  },

  async requireShareLinkForPlanToken(reference) {
    if (!reference) throw new Error('Treatment plan unavailable');
    const { data: plan, error } = await supabase.from('treatment_plans')
      .select('id,patient_id').eq('public_token', reference).maybeSingle();
    if (error || !plan) throw new Error('Treatment plan unavailable');
    return this.requireShareLink(plan.id, plan.patient_id, { fresh: true });
  },

  getShareUrl(token) {
    return buildPatientPlanUrl(token);
  }
};

export async function openPatientPlan(plan, navigate) {
  if (!plan?.id || !plan?.patientId) throw new Error('Unable to identify this plan. Refresh and try again.');
  const token = await shareLinkService.requireShareLink(plan.id, plan.patientId, { fresh: true });
  storePatientPlanToken(token);
  navigate('/p');
}

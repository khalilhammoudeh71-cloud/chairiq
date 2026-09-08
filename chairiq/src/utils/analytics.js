const EVENT_SCHEMAS = {
  language_changed: {
    language: ['en', 'es', 'EN', 'ES'],
    location: ['global_toggle', 'patient_preview'],
  },
  plan_created: {
    language: ['EN', 'ES'],
    procedure_count: 'number',
    image_upload_failures: 'number',
  },
  plan_delivery: {
    channel: ['sms', 'email'],
    outcome: ['success', 'failed'],
    location: ['plan_page', 'retry', 'resend', 'send_modal'],
  },
  patient_preview_opened: {
    location: ['procedure_library'],
  },
  patient_preview_loaded: {
    outcome: ['success'],
  },
  shared_plan_opened: {
    language: ['EN', 'ES'],
    procedure_count: 'number',
    source: ['share_link', 'legacy_link'],
  },
  procedure_details_opened: {
    language: ['EN', 'ES'],
    preview: 'boolean',
  },
  procedure_visual_viewed: {
    step_number: 'number',
    direction: ['initial', 'next', 'previous', 'direct'],
  },
  procedure_publish_changed: {
    published: 'boolean',
    location: ['procedure_library', 'content_editor'],
  },
  procedure_saved: {
    mode: ['create', 'edit'],
    published: 'boolean',
  },
  step_image_uploaded: {
    step_key: /^(hero|step_[1-9][0-9]?)$/,
    location: ['ada_visual_upload', 'content_editor'],
  },
};

/**
 * Privacy-safe wrapper for Replit's published-app analytics.
 *
 * Replit injects the Umami tracker after analytics is enabled in Publishing.
 * Each event has an explicit property schema so names, contact details, IDs,
 * share tokens, URLs, and free-form patient/clinical content cannot be sent.
 */
export function trackEvent(name, data = {}, options = {}) {
  if (typeof window === 'undefined') return;
  const schema = EVENT_SCHEMAS[name];
  if (!schema) return;

  const safeData = {};
  for (const [key, rule] of Object.entries(schema)) {
    const value = data[key];
    const valid = Array.isArray(rule)
      ? rule.includes(value)
      : rule instanceof RegExp
        ? typeof value === 'string' && rule.test(value)
        : typeof value === rule && (rule !== 'number' || Number.isFinite(value));
    if (valid) safeData[key] = value;
  }

  try {
    if (options?.routeAlias === '/p/shared') {
      window.umami?.track((properties) => ({
        ...properties,
        url: '/p/shared',
        referrer: '',
        title: 'ChairIQ Patient Plan',
        name,
        data: safeData,
      }));
      return;
    }
    window.umami?.track(name, safeData);
  } catch {
    // Analytics must never interrupt the ChairIQ experience.
  }
}
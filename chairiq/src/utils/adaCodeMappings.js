/**
 * ADA Code to Canonical Procedure Mapping
 * Maps multiple ADA codes to their canonical procedure slugs
 */

export const adaToCanonicalMapping = {
  // Oral Evaluations
  'D0120': 'periodic-oral-exam',
  'D0150': 'comprehensive-oral-exam',
  'D0140': 'limited-oral-exam',
  
  // Dentures
  'D5110': 'complete-denture',
  'D5120': 'complete-denture',
  'D5130': 'immediate-complete-denture',
  'D5140': 'immediate-complete-denture',
  'D5211': 'resin-partial-denture',
  'D5212': 'resin-partial-denture',
  
  // Scaling and Root Planing
  'D4341': 'scaling-and-root-planing',
  'D4342': 'scaling-and-root-planing',
  
  // Extractions
  'D7140': 'tooth-extraction',
  'D7210': 'tooth-extraction',
  'D7220': 'tooth-extraction',
  'D7230': 'tooth-extraction',
  'D7240': 'tooth-extraction',
  
  // Crowns (comprehensive list)
  'D2740': 'dental-crown',
  'D2750': 'dental-crown',
  'D2751': 'dental-crown',
  'D2752': 'dental-crown',
  'D2790': 'dental-crown',
  'D2791': 'dental-crown',
  'D2792': 'dental-crown',
  'D2794': 'dental-crown',
  
  // Root Canal
  'D3310': 'root-canal',
  'D3320': 'root-canal',
  'D3330': 'root-canal',
};

/**
 * Get canonical slug for an ADA code
 * @param {string} adaCode - ADA code (e.g., "D0120")
 * @returns {string|null} Canonical slug or null if not mapped
 */
export const getCanonicalSlugFromAdaCode = (adaCode) => {
  return adaToCanonicalMapping?.[adaCode] || null;
};

/**
 * Get display name for canonical slug (for user-facing text)
 * @param {string} canonicalSlug - Canonical procedure slug
 * @returns {string} Human-readable procedure name
 */
export const getDisplayNameForCanonicalSlug = (canonicalSlug) => {
  const displayNames = {
    'periodic-oral-exam': 'Periodic Oral Evaluation',
    'comprehensive-oral-exam': 'Comprehensive Oral Evaluation',
    'limited-oral-exam': 'Limited Oral Evaluation',
    'complete-denture': 'Complete Denture',
    'immediate-complete-denture': 'Immediate Complete Denture',
    'resin-partial-denture': 'Partial Denture (Resin Base)',
    'scaling-and-root-planing': 'Scaling and Root Planing',
    'tooth-extraction': 'Tooth Extraction',
    'dental-crown': 'Dental Crown',
    'root-canal': 'Root Canal Treatment',
  };
  
  return displayNames?.[canonicalSlug] || canonicalSlug;
};
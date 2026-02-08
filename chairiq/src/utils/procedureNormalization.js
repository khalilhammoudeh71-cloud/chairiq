/**
 * Procedure Normalization Utility
 * Provides canonical key resolution for procedures using ADA code families,
 * canonical slugs, and procedure name mappings
 */

/**
 * ADA CODE FAMILY MAPPING
 * Maps ADA code ranges to canonical procedure types
 */
export const ADA_CODE_FAMILIES = {
  // Crown family - D27xx codes
  crown: ['D2740', 'D2750', 'D2751', 'D2752', 'D2780', 'D2790', 'D2791', 'D2792', 'D2794', 'D2781'],
  
  // Root canal family - D33xx codes
  root_canal: ['D3310', 'D3320', 'D3330', 'D3346', 'D3347', 'D3348'],
  
  // Extraction family - D7xxx codes
  extraction: ['D7140', 'D7210', 'D7220', 'D7230', 'D7240', 'D7241', 'D7250', 'D7260'],
  
  // Scaling and Root Planing (SRP) - D434x codes
  srp: ['D4341', 'D4342'],
  
  // Exam family - D01xx codes
  exam: ['D0150', 'D0120', 'D0140', 'D0180'],
  
  // Prophylaxis (cleaning) - D11xx codes
  prophy: ['D1110', 'D1120'],
  
  // Fillings - D2xxx codes
  filling: ['D2140', 'D2150', 'D2160', 'D2161', 'D2330', 'D2331', 'D2332', 'D2335', 'D2391', 'D2392', 'D2393', 'D2394'],
  
  // Bridge - D6xxx codes
  bridge: ['D6210', 'D6211', 'D6212', 'D6214', 'D6240', 'D6241', 'D6242', 'D6245', 'D6250', 'D6251', 'D6252', 'D6545', 'D6548', 'D6549', 'D6710', 'D6720'],
  
  // Denture - D5xxx codes
  denture: ['D5110', 'D5120', 'D5130', 'D5140', 'D5211', 'D5212', 'D5213', 'D5214']
};

/**
 * PROCEDURE NAME MAPPING
 * Maps common procedure names to canonical keys
 */
const PROCEDURE_NAME_MAPPING = {
  // Crown variations
  'crown': 'crown',
  'dental crown': 'crown',
  'porcelain crown': 'crown',
  'pfm crown': 'crown',
  'metal crown': 'crown',
  'zirconia crown': 'crown',
  
  // Root canal variations
  'root canal': 'root_canal',
  'root canal therapy': 'root_canal',
  'endodontic therapy': 'root_canal',
  'rct': 'root_canal',
  
  // Extraction variations
  'extraction': 'extraction',
  'tooth extraction': 'extraction',
  'simple extraction': 'extraction',
  'surgical extraction': 'extraction',
  'exo': 'extraction',
  
  // SRP variations
  'srp': 'srp',
  'scaling and root planing': 'srp',
  'deep cleaning': 'srp',
  'periodontal therapy': 'srp',
  
  // Exam variations
  'exam': 'exam',
  'examination': 'exam',
  'dental exam': 'exam',
  'comprehensive exam': 'exam',
  'periodic exam': 'exam',
  
  // Prophylaxis variations
  'prophy': 'prophy',
  'prophylaxis': 'prophy',
  'cleaning': 'prophy',
  'dental cleaning': 'prophy',
  'teeth cleaning': 'prophy',
  
  // Filling variations
  'filling': 'filling',
  'composite filling': 'filling',
  'amalgam filling': 'filling',
  'restoration': 'filling',
  
  // Bridge variations
  'bridge': 'bridge',
  'dental bridge': 'bridge',
  'fixed bridge': 'bridge',
  'pontic': 'bridge',
  
  // Denture variations
  'denture': 'denture',
  'dentures': 'denture',
  'complete denture': 'denture',
  'partial denture': 'denture',
  'removable denture': 'denture'
};

/**
 * Get canonical key from ADA code by checking code families
 * @param {string} adaCode - ADA procedure code (e.g., "D2740")
 * @returns {string|null} Canonical key or null if not found
 */
export const getCanonicalKeyFromAdaCode = (adaCode) => {
  if (!adaCode) return null;
  
  // Normalize ADA code (uppercase, remove spaces)
  const normalizedCode = adaCode?.toUpperCase()?.trim();
  
  // Check each family for matching code
  for (const [canonicalKey, codes] of Object.entries(ADA_CODE_FAMILIES)) {
    if (codes?.includes(normalizedCode)) {
      return canonicalKey;
    }
  }
  
  // If not in predefined families, return ada_<code> format for fallback
  return `ada_${normalizedCode?.toLowerCase()}`;
};

/**
 * Get canonical key from procedure name using name mapping
 * @param {string} procedureName - Procedure name
 * @returns {string|null} Canonical key or null if not found
 */
export const getCanonicalKeyFromName = (procedureName) => {
  if (!procedureName) return null;
  
  // Normalize name (lowercase, trim)
  const normalizedName = procedureName?.toLowerCase()?.trim();
  
  // Direct lookup in mapping
  if (PROCEDURE_NAME_MAPPING?.[normalizedName]) {
    return PROCEDURE_NAME_MAPPING?.[normalizedName];
  }
  
  // Partial match - check if any mapping key is contained in the name
  for (const [key, canonicalKey] of Object.entries(PROCEDURE_NAME_MAPPING)) {
    if (normalizedName?.includes(key)) {
      return canonicalKey;
    }
  }
  
  return null;
};

/**
 * MAIN NORMALIZATION FUNCTION
 * Resolves a procedure to its canonical key using priority:
 * 1. canonical_slug (if exists and recognized)
 * 2. ada_code (map by code family)
 * 3. procedure_name (fallback to cleaned name mapping)
 * 4. "unknown" if all else fails
 * 
 * @param {Object} params - Procedure parameters
 * @param {string} params.ada_code - ADA procedure code
 * @param {string} params.procedure_name - Procedure name
 * @param {string} params.canonical_slug - Canonical slug (if already resolved)
 * @returns {string} Canonical key for content/visual lookup
 */
export const normalizeProcedureKey = ({ ada_code, procedure_name, canonical_slug }) => {
  // Priority 1: Use canonical_slug if provided and recognized
  if (canonical_slug) {
    // Validate it's a recognized canonical slug (check if it exists in our families)
    const validCanonicalKeys = Object.keys(ADA_CODE_FAMILIES);
    if (validCanonicalKeys?.includes(canonical_slug)) {
      return canonical_slug;
    }
    // If it's a custom slug not in families, still use it
    return canonical_slug;
  }
  
  // Priority 2: Map by ADA code family
  if (ada_code) {
    const keyFromCode = getCanonicalKeyFromAdaCode(ada_code);
    if (keyFromCode) {
      return keyFromCode;
    }
  }
  
  // Priority 3: Fallback to procedure name mapping
  if (procedure_name) {
    const keyFromName = getCanonicalKeyFromName(procedure_name);
    if (keyFromName) {
      return keyFromName;
    }
  }
  
  // Priority 4: Unknown fallback
  return 'unknown';
};

/**
 * Get all ADA codes for a given canonical key
 * @param {string} canonicalKey - Canonical procedure key
 * @returns {Array<string>} Array of ADA codes for this procedure type
 */
export const getAdaCodesForCanonicalKey = (canonicalKey) => {
  return ADA_CODE_FAMILIES?.[canonicalKey] || [];
};

/**
 * Get friendly display name for canonical key
 * @param {string} canonicalKey - Canonical procedure key
 * @param {string} language - Language code ('EN' or 'ES')
 * @returns {string} Display name
 */
export const getDisplayNameForCanonicalKey = (canonicalKey, language = 'EN') => {
  const displayNames = {
    EN: {
      crown: 'Crown',
      root_canal: 'Root Canal',
      extraction: 'Extraction',
      srp: 'Deep Cleaning (SRP)',
      exam: 'Dental Exam',
      prophy: 'Teeth Cleaning',
      filling: 'Filling',
      bridge: 'Bridge',
      denture: 'Denture',
      unknown: 'Procedure'
    },
    ES: {
      crown: 'Corona',
      root_canal: 'Endodoncia',
      extraction: 'Extracción',
      srp: 'Limpieza Profunda',
      exam: 'Examen Dental',
      prophy: 'Limpieza Dental',
      filling: 'Empaste',
      bridge: 'Puente',
      denture: 'Dentadura',
      unknown: 'Procedimiento'
    }
  };
  
  return displayNames?.[language]?.[canonicalKey] || canonicalKey;
};
/**
 * ADA Procedure Codes Library
 * Common dental procedure codes with descriptions
 */

export const adaCodes = [
  { code: 'D0120', description: 'Periodic oral evaluation', category: 'Diagnostic' },
  { code: 'D0140', description: 'Limited oral evaluation', category: 'Diagnostic' },
  { code: 'D0210', description: 'Intraoral complete series', category: 'Diagnostic' },
  { code: 'D0274', description: 'Bitewings four images', category: 'Diagnostic' },
  { code: 'D1110', description: 'Adult prophylaxis', category: 'Preventive' },
  { code: 'D1120', description: 'Child prophylaxis', category: 'Preventive' },
  { code: 'D1206', description: 'Fluoride varnish', category: 'Preventive' },
  { code: 'D2391', description: 'Resin-based composite, 1 surface posterior', category: 'Restorative' },
  { code: 'D2392', description: 'Resin-based composite, 2 surfaces posterior', category: 'Restorative' },
  { code: 'D2393', description: 'Resin-based composite, 3 surfaces posterior', category: 'Restorative' },
  { code: 'D2394', description: 'Resin-based composite, 4+ surfaces posterior', category: 'Restorative' },
  { code: 'D2740', description: 'Crown porcelain/ceramic', category: 'Restorative' },
  { code: 'D2950', description: 'Core buildup', category: 'Restorative' },
  { code: 'D3310', description: 'Root canal anterior', category: 'Endodontics' },
  { code: 'D3320', description: 'Root canal premolar', category: 'Endodontics' },
  { code: 'D3330', description: 'Root canal molar', category: 'Endodontics' },
  { code: 'D4341', description: 'SRP 4+ teeth per quadrant', category: 'Periodontics' },
  { code: 'D4342', description: 'SRP 1-3 teeth per quadrant', category: 'Periodontics' },
  { code: 'D7140', description: 'Extraction, erupted tooth', category: 'Oral Surgery' },
  { code: 'D7210', description: 'Surgical extraction erupted tooth', category: 'Oral Surgery' },
  { code: 'D7220', description: 'Surgical extraction soft tissue impacted', category: 'Oral Surgery' },
  { code: 'D7230', description: 'Surgical extraction partially bony impacted', category: 'Oral Surgery' },
  { code: 'D7240', description: 'Surgical extraction completely bony impacted', category: 'Oral Surgery' },
  { code: 'D7250', description: 'Removal of residual tooth roots', category: 'Oral Surgery' },
  { code: 'D7310', description: 'Alveoloplasty in conjunction with extractions', category: 'Oral Surgery' },
  { code: 'D8080', description: 'Comprehensive orthodontic treatment', category: 'Orthodontics' },
  { code: 'D8090', description: 'Comprehensive orthodontic treatment adult', category: 'Orthodontics' }
];

/**
 * Procedure name library (maps to existing educational pages)
 */
export const procedureNames = [
  { name: 'Root Canal', hasEducationalPage: true, route: '/individual-procedure-detail/root-canal' },
  { name: 'Crown', hasEducationalPage: true, route: '/individual-procedure-detail/crown' },
  { name: 'Bridge', hasEducationalPage: true, route: '/individual-procedure-detail/bridge' },
  { name: 'Composite Filling', hasEducationalPage: false },
  { name: 'Scaling & Root Planing', hasEducationalPage: false },
  { name: 'Simple Extraction', hasEducationalPage: false },
  { name: 'Surgical Extraction', hasEducationalPage: false },
  { name: 'Pulpotomy + SSC', hasEducationalPage: false },
  { name: 'Metal Framework Partial Denture', hasEducationalPage: false },
  { name: 'Flexible Partial Denture (Valplast)', hasEducationalPage: false },
  { name: 'Invisalign', hasEducationalPage: false },
  { name: 'Wisdom Teeth Extraction', hasEducationalPage: false }
];

/**
 * Helper to get ADA code details
 */
export const getAdaCodeDetails = (code) => {
  return adaCodes?.find(ada => ada?.code === code);
};

/**
 * Helper to check if procedure has educational page
 */
export const hasEducationalPage = (procedureName) => {
  const procedure = procedureNames?.find(p => p?.name === procedureName);
  return procedure?.hasEducationalPage || false;
};

/**
 * Helper to get educational page route
 */
export const getEducationalRoute = (procedureName) => {
  const procedure = procedureNames?.find(p => p?.name === procedureName);
  return procedure?.route || null;
};
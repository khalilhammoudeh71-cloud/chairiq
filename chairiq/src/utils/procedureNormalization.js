export const ADA_CODE_FAMILIES = {
  crown: ['D2740', 'D2750', 'D2751', 'D2752', 'D2780', 'D2790', 'D2791', 'D2792', 'D2794', 'D2781', 'D2782', 'D2783'],
  
  root_canal: ['D3310', 'D3320', 'D3330', 'D3346', 'D3347', 'D3348'],
  
  extraction: ['D7140', 'D7210', 'D7220', 'D7230', 'D7240', 'D7241', 'D7250', 'D7260', 'D7270', 'D7272', 'D7280', 'D7282', 'D7283'],
  
  srp: ['D4341', 'D4342'],
  
  exam: ['D0120', 'D0140', 'D0150', 'D0160', 'D0170', 'D0180', 'D0210', 'D0220', 'D0230', 'D0240', 'D0250', 'D0270', 'D0272', 'D0273', 'D0274', 'D0277', 'D0330', 'D0340', 'D0350', 'D0364', 'D0365', 'D0366', 'D0367', 'D0368', 'D0380', 'D0381', 'D0382', 'D0391'],
  
  cleaning: ['D1110', 'D1120'],
  
  filling: ['D2140', 'D2150', 'D2160', 'D2161', 'D2330', 'D2331', 'D2332', 'D2335', 'D2390', 'D2391', 'D2392', 'D2393', 'D2394'],
  
  bridge: ['D6210', 'D6211', 'D6212', 'D6214', 'D6240', 'D6241', 'D6242', 'D6245', 'D6250', 'D6251', 'D6252', 'D6545', 'D6548', 'D6549', 'D6710', 'D6720', 'D6721', 'D6722', 'D6740', 'D6750', 'D6751', 'D6752'],
  
  denture: ['D5110', 'D5120', 'D5130', 'D5140', 'D5211', 'D5212', 'D5213', 'D5214'],
  
  implant: ['D6010', 'D6011', 'D6012', 'D6013', 'D6040', 'D6050', 'D6051', 'D6052', 'D6055', 'D6056', 'D6057', 'D6058', 'D6059', 'D6060', 'D6061', 'D6062', 'D6063', 'D6064', 'D6065', 'D6066', 'D6067', 'D6068', 'D6069', 'D6070', 'D6071', 'D6072', 'D6073', 'D6074', 'D6075', 'D6076', 'D6077', 'D6080', 'D6081', 'D6090', 'D6091', 'D6092', 'D6093', 'D6094', 'D6095', 'D6100', 'D6101', 'D6102', 'D6103', 'D6104', 'D6110', 'D6111', 'D6112', 'D6113', 'D6114', 'D6115', 'D6190', 'D6199'],
  
  veneer: ['D2960', 'D2961', 'D2962', 'D2963'],
  
  whitening: ['D9972', 'D9973', 'D9974', 'D9975'],
  
  orthodontics: ['D8010', 'D8020', 'D8030', 'D8040', 'D8050', 'D8060', 'D8070', 'D8080', 'D8090', 'D8210', 'D8220', 'D8660', 'D8670', 'D8680', 'D8681', 'D8690', 'D8695', 'D8696', 'D8697', 'D8698', 'D8699', 'D8701', 'D8702', 'D8703', 'D8704', 'D8999'],
  
  'night-guard': ['D9940', 'D9941', 'D9942', 'D9943', 'D9944', 'D9945', 'D9946'],
  
  'bone-graft': ['D7950', 'D7953', 'D7955', 'D7956', 'D7957', 'D4263', 'D4264'],
  
  'sinus-lift': ['D7951', 'D7952'],
  
  'dental-sealant': ['D1351', 'D1352', 'D1353', 'D1354'],
  
  'fluoride-treatment': ['D1206', 'D1208', 'D1355'],
  
  sedation: ['D9210', 'D9211', 'D9212', 'D9215', 'D9219', 'D9222', 'D9223', 'D9230', 'D9239', 'D9243', 'D9248'],
  
  'inlay-onlay': ['D2510', 'D2520', 'D2530', 'D2542', 'D2543', 'D2610', 'D2620', 'D2630', 'D2642', 'D2643', 'D2650', 'D2651', 'D2652', 'D2662', 'D2663', 'D2664'],
  
  'core-buildup': ['D2950', 'D2951', 'D2952', 'D2953', 'D2954'],
  
  'gum-graft': ['D4265', 'D4266', 'D4267', 'D4270', 'D4271', 'D4273', 'D4274', 'D4275', 'D4276', 'D4277', 'D4278']
};

const PROCEDURE_NAME_MAPPING = {
  'crown': 'crown',
  'dental crown': 'crown',
  'porcelain crown': 'crown',
  'pfm crown': 'crown',
  'metal crown': 'crown',
  'zirconia crown': 'crown',
  
  'root canal': 'root_canal',
  'root canal therapy': 'root_canal',
  'endodontic therapy': 'root_canal',
  'rct': 'root_canal',
  
  'extraction': 'extraction',
  'tooth extraction': 'extraction',
  'simple extraction': 'extraction',
  'surgical extraction': 'extraction',
  'exo': 'extraction',
  'wisdom teeth extraction': 'extraction',
  
  'srp': 'srp',
  'scaling and root planing': 'srp',
  'deep cleaning': 'srp',
  'periodontal therapy': 'srp',
  
  'exam': 'exam',
  'examination': 'exam',
  'dental exam': 'exam',
  'comprehensive exam': 'exam',
  'periodic exam': 'exam',
  'oral evaluation': 'exam',
  
  'prophy': 'cleaning',
  'prophylaxis': 'cleaning',
  'cleaning': 'cleaning',
  'dental cleaning': 'cleaning',
  'teeth cleaning': 'cleaning',
  'adult prophylaxis': 'cleaning',
  'child prophylaxis': 'cleaning',
  
  'filling': 'filling',
  'composite filling': 'filling',
  'amalgam filling': 'filling',
  'restoration': 'filling',
  
  'bridge': 'bridge',
  'dental bridge': 'bridge',
  'fixed bridge': 'bridge',
  'pontic': 'bridge',
  
  'denture': 'denture',
  'dentures': 'denture',
  'complete denture': 'denture',
  'partial denture': 'denture',
  'removable denture': 'denture',
  
  'implant': 'implant',
  'dental implant': 'implant',
  'implant placement': 'implant',
  'implant crown': 'implant',
  'implant abutment': 'implant',
  
  'veneer': 'veneer',
  'dental veneer': 'veneer',
  'porcelain veneer': 'veneer',
  'laminate veneer': 'veneer',
  
  'whitening': 'whitening',
  'teeth whitening': 'whitening',
  'bleaching': 'whitening',
  'tooth whitening': 'whitening',
  
  'orthodontics': 'orthodontics',
  'braces': 'orthodontics',
  'aligners': 'orthodontics',
  'invisalign': 'orthodontics',
  'clear aligners': 'orthodontics',
  'orthodontic treatment': 'orthodontics',
  'retainer': 'orthodontics',
  
  'night guard': 'night-guard',
  'nightguard': 'night-guard',
  'occlusal guard': 'night-guard',
  'mouth guard': 'night-guard',
  'mouthguard': 'night-guard',
  'splint': 'night-guard',
  'occlusal splint': 'night-guard',
  
  'bone graft': 'bone-graft',
  'bone grafting': 'bone-graft',
  'osseous graft': 'bone-graft',
  'ridge preservation': 'bone-graft',
  
  'sinus lift': 'sinus-lift',
  'sinus augmentation': 'sinus-lift',
  'sinus elevation': 'sinus-lift',
  
  'sealant': 'dental-sealant',
  'dental sealant': 'dental-sealant',
  'pit and fissure sealant': 'dental-sealant',
  
  'fluoride': 'fluoride-treatment',
  'fluoride treatment': 'fluoride-treatment',
  'fluoride varnish': 'fluoride-treatment',
  'topical fluoride': 'fluoride-treatment',
  
  'inlay': 'inlay-onlay',
  'onlay': 'inlay-onlay',
  'inlay/onlay': 'inlay-onlay',
  'dental inlay': 'inlay-onlay',
  'dental onlay': 'inlay-onlay',
  
  'core buildup': 'core-buildup',
  'core build-up': 'core-buildup',
  'build up': 'core-buildup',
  'post and core': 'core-buildup',
  
  'gum graft': 'gum-graft',
  'gingival graft': 'gum-graft',
  'soft tissue graft': 'gum-graft',
  'connective tissue graft': 'gum-graft',
  'gum grafting': 'gum-graft',
  'tissue graft': 'gum-graft',

  'sedation': 'sedation',
  'anesthesia': 'sedation',
  'nitrous oxide': 'sedation',
  'nitrous': 'sedation',
  'conscious sedation': 'sedation',
  'general anesthesia': 'sedation',
  'local anesthesia': 'sedation',
  'iv sedation': 'sedation'
};

export const getCanonicalKeyFromAdaCode = (adaCode) => {
  if (!adaCode) return null;
  
  const normalizedCode = adaCode?.toUpperCase()?.trim();
  
  for (const [canonicalKey, codes] of Object.entries(ADA_CODE_FAMILIES)) {
    if (codes?.includes(normalizedCode)) {
      return canonicalKey;
    }
  }
  
  return `ada_${normalizedCode?.toLowerCase()}`;
};

export const getCanonicalKeyFromName = (procedureName) => {
  if (!procedureName) return null;
  
  const normalizedName = procedureName?.toLowerCase()?.trim();
  
  if (PROCEDURE_NAME_MAPPING?.[normalizedName]) {
    return PROCEDURE_NAME_MAPPING?.[normalizedName];
  }
  
  for (const [key, canonicalKey] of Object.entries(PROCEDURE_NAME_MAPPING)) {
    if (normalizedName?.includes(key)) {
      return canonicalKey;
    }
  }
  
  return null;
};

export const normalizeProcedureKey = ({ ada_code, procedure_name, canonical_slug }) => {
  if (canonical_slug) {
    const validCanonicalKeys = Object.keys(ADA_CODE_FAMILIES);
    if (validCanonicalKeys?.includes(canonical_slug)) {
      return canonical_slug;
    }
    return canonical_slug;
  }
  
  if (ada_code) {
    const keyFromCode = getCanonicalKeyFromAdaCode(ada_code);
    if (keyFromCode) {
      return keyFromCode;
    }
  }
  
  if (procedure_name) {
    const keyFromName = getCanonicalKeyFromName(procedure_name);
    if (keyFromName) {
      return keyFromName;
    }
  }
  
  return 'unknown';
};

export const getAdaCodesForCanonicalKey = (canonicalKey) => {
  return ADA_CODE_FAMILIES?.[canonicalKey] || [];
};

export const getDisplayNameForCanonicalKey = (canonicalKey, language = 'EN') => {
  const displayNames = {
    EN: {
      crown: 'Crown',
      root_canal: 'Root Canal',
      extraction: 'Extraction',
      srp: 'Deep Cleaning (SRP)',
      exam: 'Dental Exam',
      cleaning: 'Teeth Cleaning',
      prophy: 'Teeth Cleaning',
      filling: 'Filling',
      bridge: 'Bridge',
      denture: 'Denture',
      implant: 'Dental Implant',
      veneer: 'Veneer',
      whitening: 'Teeth Whitening',
      orthodontics: 'Orthodontics',
      'night-guard': 'Night Guard',
      'bone-graft': 'Bone Graft',
      'sinus-lift': 'Sinus Lift',
      'dental-sealant': 'Dental Sealant',
      'fluoride-treatment': 'Fluoride Treatment',
      'inlay-onlay': 'Inlay/Onlay',
      'core-buildup': 'Core Buildup',
      'gum-graft': 'Gum Graft',
      sedation: 'Sedation / Anesthesia',
      unknown: 'Procedure'
    },
    ES: {
      crown: 'Corona',
      root_canal: 'Endodoncia',
      extraction: 'Extracción',
      srp: 'Limpieza Profunda',
      exam: 'Examen Dental',
      cleaning: 'Limpieza Dental',
      prophy: 'Limpieza Dental',
      filling: 'Empaste',
      bridge: 'Puente',
      denture: 'Dentadura',
      implant: 'Implante Dental',
      veneer: 'Carilla Dental',
      whitening: 'Blanqueamiento Dental',
      orthodontics: 'Ortodoncia',
      'night-guard': 'Guarda Nocturno',
      'bone-graft': 'Injerto Óseo',
      'sinus-lift': 'Elevación de Seno',
      'dental-sealant': 'Sellador Dental',
      'fluoride-treatment': 'Tratamiento de Flúor',
      'inlay-onlay': 'Incrustación Dental',
      'core-buildup': 'Reconstrucción de Muñón',
      'gum-graft': 'Injerto de Encía',
      sedation: 'Sedación / Anestesia',
      unknown: 'Procedimiento'
    }
  };
  
  return displayNames?.[language]?.[canonicalKey] || canonicalKey;
};

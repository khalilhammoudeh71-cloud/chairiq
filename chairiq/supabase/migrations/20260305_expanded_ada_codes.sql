-- Expanded ADA Codes + Canonical Procedure Mappings
-- Adds 8 new canonical procedures: pulpotomy, apicoectomy, frenectomy, crown-lengthening,
-- space-maintainer, tmj-treatment, sleep-apnea-appliance, emergency-palliative

INSERT INTO public.canonical_procedures (slug, display_name_en, display_name_es, category)
VALUES
  ('pulpotomy', 'Pulpotomy', 'Pulpotomía', 'endodontics'),
  ('apicoectomy', 'Apicoectomy', 'Apicoectomía', 'endodontics'),
  ('frenectomy', 'Frenectomy', 'Frenectomía', 'surgery'),
  ('crown-lengthening', 'Crown Lengthening', 'Alargamiento de Corona', 'periodontics'),
  ('space-maintainer', 'Space Maintainer', 'Mantenedor de Espacio', 'preventive'),
  ('tmj-treatment', 'TMJ Treatment', 'Tratamiento de ATM', 'adjunctive'),
  ('sleep-apnea-appliance', 'Sleep Apnea Appliance', 'Aparato para Apnea del Sueño', 'adjunctive'),
  ('emergency-palliative', 'Emergency / Palliative Care', 'Atención de Emergencia / Paliativa', 'adjunctive')
ON CONFLICT (slug) DO UPDATE SET
  display_name_en = EXCLUDED.display_name_en,
  display_name_es = EXCLUDED.display_name_es,
  category = EXCLUDED.category,
  updated_at = CURRENT_TIMESTAMP;

-- ============================================================
-- PULPOTOMY ADA CODES (D3220-D3222)
-- ============================================================
INSERT INTO public.ada_codes (code, description, canonical_slug)
VALUES
  ('D3220', 'Therapeutic pulpotomy (excluding final restoration)', 'pulpotomy'),
  ('D3221', 'Pulpal debridement, primary and permanent teeth', 'pulpotomy'),
  ('D3222', 'Partial pulpotomy for apexogenesis - permanent tooth with incomplete root development', 'pulpotomy')
ON CONFLICT (code) DO UPDATE SET
  description = EXCLUDED.description,
  canonical_slug = EXCLUDED.canonical_slug,
  updated_at = CURRENT_TIMESTAMP;

-- ============================================================
-- APICOECTOMY ADA CODES (D3410-D3473)
-- ============================================================
INSERT INTO public.ada_codes (code, description, canonical_slug)
VALUES
  ('D3410', 'Apicoectomy - anterior', 'apicoectomy'),
  ('D3421', 'Apicoectomy - premolar (first root)', 'apicoectomy'),
  ('D3425', 'Apicoectomy - molar (first root)', 'apicoectomy'),
  ('D3426', 'Apicoectomy (each additional root)', 'apicoectomy'),
  ('D3427', 'Periradicular surgery without apicoectomy', 'apicoectomy'),
  ('D3428', 'Bone graft in conjunction with periradicular surgery - per tooth', 'apicoectomy'),
  ('D3430', 'Retrograde filling - per root', 'apicoectomy'),
  ('D3450', 'Root amputation - per root', 'apicoectomy'),
  ('D3470', 'Intentional reimplantation', 'apicoectomy'),
  ('D3471', 'Surgical repair of root resorption - anterior', 'apicoectomy'),
  ('D3472', 'Surgical repair of root resorption - premolar', 'apicoectomy'),
  ('D3473', 'Surgical repair of root resorption - molar', 'apicoectomy')
ON CONFLICT (code) DO UPDATE SET
  description = EXCLUDED.description,
  canonical_slug = EXCLUDED.canonical_slug,
  updated_at = CURRENT_TIMESTAMP;

-- ============================================================
-- FRENECTOMY ADA CODES (D7961-D7963)
-- ============================================================
INSERT INTO public.ada_codes (code, description, canonical_slug)
VALUES
  ('D7961', 'Buccal / labial frenectomy (frenulectomy)', 'frenectomy'),
  ('D7962', 'Lingual frenectomy (frenulectomy)', 'frenectomy'),
  ('D7963', 'Frenuloplasty', 'frenectomy')
ON CONFLICT (code) DO UPDATE SET
  description = EXCLUDED.description,
  canonical_slug = EXCLUDED.canonical_slug,
  updated_at = CURRENT_TIMESTAMP;

-- ============================================================
-- CROWN LENGTHENING ADA CODES (D4249)
-- ============================================================
INSERT INTO public.ada_codes (code, description, canonical_slug)
VALUES
  ('D4249', 'Clinical crown lengthening - hard tissue', 'crown-lengthening')
ON CONFLICT (code) DO UPDATE SET
  description = EXCLUDED.description,
  canonical_slug = EXCLUDED.canonical_slug,
  updated_at = CURRENT_TIMESTAMP;

-- ============================================================
-- SPACE MAINTAINER ADA CODES (D1510-D1575)
-- ============================================================
INSERT INTO public.ada_codes (code, description, canonical_slug)
VALUES
  ('D1510', 'Space maintainer - fixed, unilateral - per quadrant', 'space-maintainer'),
  ('D1515', 'Space maintainer - fixed, bilateral (maxillary)', 'space-maintainer'),
  ('D1520', 'Space maintainer - removable, unilateral - per quadrant', 'space-maintainer'),
  ('D1525', 'Space maintainer - removable, bilateral (maxillary)', 'space-maintainer'),
  ('D1550', 'Re-cement or re-bond bilateral space maintainer - maxillary', 'space-maintainer'),
  ('D1555', 'Removal of fixed unilateral space maintainer - per quadrant', 'space-maintainer'),
  ('D1575', 'Distal shoe space maintainer - fixed, unilateral - per quadrant', 'space-maintainer')
ON CONFLICT (code) DO UPDATE SET
  description = EXCLUDED.description,
  canonical_slug = EXCLUDED.canonical_slug,
  updated_at = CURRENT_TIMESTAMP;

-- ============================================================
-- TMJ TREATMENT ADA CODES (D7810-D7880)
-- ============================================================
INSERT INTO public.ada_codes (code, description, canonical_slug)
VALUES
  ('D7810', 'Open reduction of dislocation', 'tmj-treatment'),
  ('D7820', 'Closed reduction of dislocation', 'tmj-treatment'),
  ('D7830', 'Manipulation under anesthesia', 'tmj-treatment'),
  ('D7840', 'Condylectomy', 'tmj-treatment'),
  ('D7850', 'Surgical discectomy, with/without implant', 'tmj-treatment'),
  ('D7852', 'Disc repair', 'tmj-treatment'),
  ('D7854', 'Synovectomy', 'tmj-treatment'),
  ('D7856', 'Myotomy', 'tmj-treatment'),
  ('D7858', 'Joint reconstruction', 'tmj-treatment'),
  ('D7860', 'Arthrotomy', 'tmj-treatment'),
  ('D7865', 'Arthroplasty', 'tmj-treatment'),
  ('D7870', 'Arthrocentesis', 'tmj-treatment'),
  ('D7872', 'Arthroscopy - no surgical intervention', 'tmj-treatment'),
  ('D7873', 'Arthroscopy - surgical: lavage and lysis of adhesions', 'tmj-treatment'),
  ('D7874', 'Arthroscopy - surgical: disc repositioning and stabilization', 'tmj-treatment'),
  ('D7875', 'Arthroscopy - surgical: synovectomy', 'tmj-treatment'),
  ('D7876', 'Arthroscopy - surgical: discectomy', 'tmj-treatment'),
  ('D7877', 'Arthroscopy - surgical: debridement', 'tmj-treatment'),
  ('D7880', 'Occlusal orthotic device, by report', 'tmj-treatment')
ON CONFLICT (code) DO UPDATE SET
  description = EXCLUDED.description,
  canonical_slug = EXCLUDED.canonical_slug,
  updated_at = CURRENT_TIMESTAMP;

-- ============================================================
-- SLEEP APNEA APPLIANCE ADA CODES (D9947-D9949)
-- ============================================================
INSERT INTO public.ada_codes (code, description, canonical_slug)
VALUES
  ('D9947', 'Custom sleep apnea appliance fabrication and delivery', 'sleep-apnea-appliance'),
  ('D9948', 'Adjustment of sleep apnea appliance', 'sleep-apnea-appliance'),
  ('D9949', 'Repair of sleep apnea appliance', 'sleep-apnea-appliance')
ON CONFLICT (code) DO UPDATE SET
  description = EXCLUDED.description,
  canonical_slug = EXCLUDED.canonical_slug,
  updated_at = CURRENT_TIMESTAMP;

-- ============================================================
-- EMERGENCY / PALLIATIVE ADA CODES (D9110-D9120)
-- ============================================================
INSERT INTO public.ada_codes (code, description, canonical_slug)
VALUES
  ('D9110', 'Palliative (emergency) treatment of dental pain - minor procedure', 'emergency-palliative'),
  ('D9120', 'Fixed partial denture sectioning', 'emergency-palliative')
ON CONFLICT (code) DO UPDATE SET
  description = EXCLUDED.description,
  canonical_slug = EXCLUDED.canonical_slug,
  updated_at = CURRENT_TIMESTAMP;

-- ============================================================
-- Update the get_canonical_slug_from_name function with new procedure patterns
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_canonical_slug_from_name(procedure_name TEXT)
RETURNS TEXT
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
  name_lower TEXT;
BEGIN
  IF procedure_name IS NULL OR TRIM(procedure_name) = '' THEN
    RETURN NULL;
  END IF;
  
  name_lower := LOWER(TRIM(procedure_name));
  
  IF name_lower LIKE '%crown lengthening%' OR name_lower LIKE '%crown lengthen%' THEN
    RETURN 'crown-lengthening';
  END IF;
  
  IF name_lower LIKE '%crown%' THEN
    RETURN 'crown';
  END IF;
  
  IF name_lower LIKE '%extract%' OR name_lower LIKE '%removal%' OR name_lower LIKE '%pull%' THEN
    RETURN 'extraction';
  END IF;
  
  IF name_lower LIKE '%scaling%' OR name_lower LIKE '%root planing%' OR name_lower LIKE '%srp%' OR name_lower LIKE '%deep clean%' THEN
    RETURN 'srp';
  END IF;
  
  IF name_lower LIKE '%apicoectomy%' OR name_lower LIKE '%apico%' OR name_lower LIKE '%root end surgery%' OR name_lower LIKE '%retrograde%' THEN
    RETURN 'apicoectomy';
  END IF;
  
  IF name_lower LIKE '%pulpotomy%' THEN
    RETURN 'pulpotomy';
  END IF;
  
  IF name_lower LIKE '%root canal retreatment%' OR name_lower LIKE '%retreatment%' THEN
    RETURN 'root-canal-retreatment';
  END IF;
  
  IF name_lower LIKE '%root canal%' OR name_lower LIKE '%endodontic%' OR name_lower LIKE '%rct%' THEN
    RETURN 'root-canal';
  END IF;
  
  IF name_lower LIKE '%exam%' OR name_lower LIKE '%evaluation%' OR name_lower LIKE '%checkup%' OR name_lower LIKE '%check-up%' THEN
    RETURN 'exam';
  END IF;
  
  IF name_lower LIKE '%denture reline%' OR name_lower LIKE '%reline%' THEN
    RETURN 'denture-reline';
  END IF;
  
  IF name_lower LIKE '%denture%' OR name_lower LIKE '%false teeth%' THEN
    RETURN 'denture';
  END IF;
  
  IF name_lower LIKE '%filling%' OR name_lower LIKE '%restoration%' OR name_lower LIKE '%composite%' OR name_lower LIKE '%amalgam%' THEN
    RETURN 'filling';
  END IF;
  
  IF name_lower LIKE '%bridge%' OR name_lower LIKE '%pontic%' THEN
    RETURN 'bridge';
  END IF;
  
  IF name_lower LIKE '%implant%' THEN
    RETURN 'implant';
  END IF;
  
  IF name_lower LIKE '%prophy%' OR name_lower LIKE '%cleaning%' OR name_lower LIKE '%prophylaxis%' THEN
    RETURN 'cleaning';
  END IF;
  
  IF name_lower LIKE '%veneer%' OR name_lower LIKE '%laminate%' THEN
    RETURN 'veneer';
  END IF;
  
  IF name_lower LIKE '%whiten%' OR name_lower LIKE '%bleach%' THEN
    RETURN 'whitening';
  END IF;
  
  IF name_lower LIKE '%ortho%' OR name_lower LIKE '%brace%' OR name_lower LIKE '%aligner%' OR name_lower LIKE '%invisalign%' THEN
    RETURN 'orthodontics';
  END IF;
  
  IF name_lower LIKE '%night guard%' OR name_lower LIKE '%nightguard%' OR name_lower LIKE '%occlusal guard%' OR name_lower LIKE '%splint%' OR name_lower LIKE '%mouthguard%' THEN
    RETURN 'night-guard';
  END IF;
  
  IF name_lower LIKE '%bone graft%' OR name_lower LIKE '%osseous graft%' THEN
    RETURN 'bone-graft';
  END IF;
  
  IF name_lower LIKE '%sinus lift%' OR name_lower LIKE '%sinus augment%' THEN
    RETURN 'sinus-lift';
  END IF;
  
  IF name_lower LIKE '%sealant%' THEN
    RETURN 'dental-sealant';
  END IF;
  
  IF name_lower LIKE '%fluoride%' THEN
    RETURN 'fluoride-treatment';
  END IF;
  
  IF name_lower LIKE '%inlay%' OR name_lower LIKE '%onlay%' THEN
    RETURN 'inlay-onlay';
  END IF;
  
  IF name_lower LIKE '%core buildup%' OR name_lower LIKE '%build-up%' OR name_lower LIKE '%buildup%' OR name_lower LIKE '%post and core%' THEN
    RETURN 'core-buildup';
  END IF;
  
  IF name_lower LIKE '%gum graft%' OR name_lower LIKE '%gingival graft%' OR name_lower LIKE '%soft tissue graft%' OR name_lower LIKE '%connective tissue graft%' THEN
    RETURN 'gum-graft';
  END IF;
  
  IF name_lower LIKE '%sedation%' OR name_lower LIKE '%anesthesia%' OR name_lower LIKE '%nitrous%' THEN
    RETURN 'sedation';
  END IF;
  
  IF name_lower LIKE '%frenectomy%' OR name_lower LIKE '%frenulectomy%' OR name_lower LIKE '%frenum%' OR name_lower LIKE '%frenulum%' OR name_lower LIKE '%frenuloplasty%' OR name_lower LIKE '%tongue tie%' OR name_lower LIKE '%lip tie%' THEN
    RETURN 'frenectomy';
  END IF;
  
  IF name_lower LIKE '%space maintainer%' OR name_lower LIKE '%space maintenance%' THEN
    RETURN 'space-maintainer';
  END IF;
  
  IF name_lower LIKE '%tmj%' OR name_lower LIKE '%temporomandibular%' OR name_lower LIKE '%jaw joint%' THEN
    RETURN 'tmj-treatment';
  END IF;
  
  IF name_lower LIKE '%sleep apnea%' OR name_lower LIKE '%oral appliance therapy%' OR name_lower LIKE '%mandibular advancement%' THEN
    RETURN 'sleep-apnea-appliance';
  END IF;
  
  IF name_lower LIKE '%palliative%' OR name_lower LIKE '%emergency%' OR name_lower LIKE '%urgent%' THEN
    RETURN 'emergency-palliative';
  END IF;
  
  IF name_lower LIKE '%full mouth debridement%' OR name_lower LIKE '%gross debridement%' THEN
    RETURN 'full-mouth-debridement';
  END IF;
  
  IF name_lower LIKE '%periodontal maintenance%' OR name_lower LIKE '%perio maintenance%' THEN
    RETURN 'periodontal-maintenance';
  END IF;
  
  RETURN NULL;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error in get_canonical_slug_from_name: %', SQLERRM;
    RETURN NULL;
END;
$$;

COMMENT ON FUNCTION public.get_canonical_slug_from_name IS 'Returns canonical_slug based on procedure name pattern matching. Supports all canonical procedure types including pulpotomy, apicoectomy, frenectomy, crown-lengthening, space-maintainer, tmj-treatment, sleep-apnea-appliance, and emergency-palliative.';

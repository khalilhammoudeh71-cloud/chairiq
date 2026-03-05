-- Comprehensive ADA Codes + Canonical Procedure Mappings
-- Adds 13 new canonical procedures and ~120 new ADA codes across all major dental categories

-- Insert new canonical procedures with bilingual display names
INSERT INTO public.canonical_procedures (slug, display_name_en, display_name_es, category)
VALUES
  ('implant', 'Dental Implant', 'Implante Dental', 'implants'),
  ('cleaning', 'Dental Cleaning', 'Limpieza Dental', 'preventive'),
  ('veneer', 'Dental Veneer', 'Carilla Dental', 'cosmetic'),
  ('whitening', 'Teeth Whitening', 'Blanqueamiento Dental', 'cosmetic'),
  ('orthodontics', 'Orthodontic Treatment', 'Tratamiento de Ortodoncia', 'orthodontics'),
  ('night-guard', 'Night Guard', 'Guarda Nocturno', 'adjunctive'),
  ('bone-graft', 'Bone Grafting', 'Injerto Óseo', 'surgery'),
  ('sinus-lift', 'Sinus Lift', 'Elevación de Seno Maxilar', 'surgery'),
  ('dental-sealant', 'Dental Sealant', 'Sellador Dental', 'preventive'),
  ('fluoride-treatment', 'Fluoride Treatment', 'Tratamiento de Flúor', 'preventive'),
  ('inlay-onlay', 'Inlay/Onlay', 'Incrustación Dental', 'restorative'),
  ('core-buildup', 'Core Buildup', 'Reconstrucción de Muñón', 'restorative'),
  ('gum-graft', 'Gum Graft', 'Injerto de Encía', 'periodontics'),
  ('sedation', 'Sedation / Anesthesia', 'Sedación / Anestesia', 'adjunctive')
ON CONFLICT (slug) DO UPDATE SET
  display_name_en = EXCLUDED.display_name_en,
  display_name_es = EXCLUDED.display_name_es,
  category = EXCLUDED.category,
  updated_at = CURRENT_TIMESTAMP;

-- ============================================================
-- IMPLANT ADA CODES (D6010-D6199)
-- ============================================================
INSERT INTO public.ada_codes (code, description, canonical_slug)
VALUES
  ('D6010', 'Surgical placement of implant body - endosteal implant', 'implant'),
  ('D6011', 'Second stage implant surgery', 'implant'),
  ('D6012', 'Surgical placement of interim implant body', 'implant'),
  ('D6013', 'Surgical placement of mini implant', 'implant'),
  ('D6040', 'Eposteal implant', 'implant'),
  ('D6050', 'Custom fabricated abutment', 'implant'),
  ('D6051', 'Interim abutment', 'implant'),
  ('D6052', 'Semi-precision attachment abutment', 'implant'),
  ('D6055', 'Dental implant supported connecting bar', 'implant'),
  ('D6056', 'Prefabricated abutment', 'implant'),
  ('D6057', 'Custom fabricated abutment - titanium', 'implant'),
  ('D6058', 'Abutment supported porcelain/ceramic crown', 'implant'),
  ('D6059', 'Abutment supported porcelain fused to metal crown', 'implant'),
  ('D6060', 'Abutment supported cast metal crown (high noble)', 'implant'),
  ('D6061', 'Abutment supported cast metal crown (predominantly base)', 'implant'),
  ('D6062', 'Abutment supported cast metal crown (noble)', 'implant'),
  ('D6063', 'Abutment supported porcelain fused to metal crown (predominantly base)', 'implant'),
  ('D6064', 'Abutment supported metal crown (titanium)', 'implant'),
  ('D6065', 'Implant supported porcelain/ceramic crown', 'implant'),
  ('D6066', 'Implant supported porcelain fused to metal crown (predominantly base)', 'implant'),
  ('D6067', 'Implant supported metal crown (high noble)', 'implant'),
  ('D6068', 'Abutment supported retainer for porcelain/ceramic FPD', 'implant'),
  ('D6069', 'Abutment supported retainer for porcelain fused to metal FPD (high noble)', 'implant'),
  ('D6070', 'Abutment supported retainer for cast metal FPD (high noble)', 'implant'),
  ('D6071', 'Abutment supported retainer for cast metal FPD (predominantly base)', 'implant'),
  ('D6072', 'Abutment supported retainer for cast metal FPD (noble)', 'implant'),
  ('D6073', 'Abutment supported retainer for porcelain fused to metal FPD (predominantly base)', 'implant'),
  ('D6074', 'Abutment supported retainer for porcelain fused to metal FPD (noble)', 'implant'),
  ('D6075', 'Implant supported retainer for ceramic FPD', 'implant'),
  ('D6076', 'Implant supported retainer for porcelain fused to metal FPD (predominantly base)', 'implant'),
  ('D6077', 'Implant supported retainer for cast metal FPD (high noble)', 'implant'),
  ('D6080', 'Implant maintenance procedures', 'implant'),
  ('D6081', 'Scaling and debridement in the presence of inflammation around implant', 'implant'),
  ('D6090', 'Repair implant supported prosthesis', 'implant'),
  ('D6091', 'Replacement of semi-precision or precision attachment', 'implant'),
  ('D6092', 'Recement or rebond implant/abutment supported crown', 'implant'),
  ('D6093', 'Recement or rebond implant/abutment supported FPD', 'implant'),
  ('D6094', 'Abutment supported crown (titanium)', 'implant'),
  ('D6095', 'Repair implant abutment', 'implant'),
  ('D6100', 'Implant removal', 'implant'),
  ('D6101', 'Debridement of peri-implant defect', 'implant'),
  ('D6102', 'Bone graft at time of implant placement', 'implant'),
  ('D6103', 'Bone graft first or second stage surgery', 'implant'),
  ('D6104', 'Bone graft at time of implant placement - each additional', 'implant'),
  ('D6110', 'Implant/abutment supported removable denture - maxillary', 'implant'),
  ('D6111', 'Implant/abutment supported removable denture - mandibular', 'implant'),
  ('D6112', 'Implant/abutment supported removable denture - maxillary (metal framework)', 'implant'),
  ('D6113', 'Implant/abutment supported removable denture - mandibular (metal framework)', 'implant'),
  ('D6114', 'Implant/abutment supported fixed denture - maxillary', 'implant'),
  ('D6115', 'Implant/abutment supported fixed denture - mandibular', 'implant'),
  ('D6190', 'Radiographic/surgical implant index', 'implant'),
  ('D6199', 'Unspecified implant procedure', 'implant')
ON CONFLICT (code) DO UPDATE SET
  description = EXCLUDED.description,
  canonical_slug = EXCLUDED.canonical_slug,
  updated_at = CURRENT_TIMESTAMP;

-- ============================================================
-- ORTHODONTICS ADA CODES (D8010-D8999)
-- ============================================================
INSERT INTO public.ada_codes (code, description, canonical_slug)
VALUES
  ('D8010', 'Limited orthodontic treatment - primary dentition', 'orthodontics'),
  ('D8020', 'Limited orthodontic treatment - transitional dentition', 'orthodontics'),
  ('D8030', 'Limited orthodontic treatment - adolescent dentition', 'orthodontics'),
  ('D8040', 'Limited orthodontic treatment - adult dentition', 'orthodontics'),
  ('D8050', 'Interceptive orthodontic treatment - primary dentition', 'orthodontics'),
  ('D8060', 'Interceptive orthodontic treatment - transitional dentition', 'orthodontics'),
  ('D8070', 'Comprehensive orthodontic treatment - transitional dentition', 'orthodontics'),
  ('D8080', 'Comprehensive orthodontic treatment - adolescent dentition', 'orthodontics'),
  ('D8090', 'Comprehensive orthodontic treatment - adult dentition', 'orthodontics'),
  ('D8210', 'Removable appliance therapy', 'orthodontics'),
  ('D8220', 'Fixed appliance therapy', 'orthodontics'),
  ('D8660', 'Pre-orthodontic treatment examination', 'orthodontics'),
  ('D8670', 'Periodic orthodontic treatment visit', 'orthodontics'),
  ('D8680', 'Orthodontic retention - removal of appliances', 'orthodontics'),
  ('D8681', 'Removable orthodontic retainer adjustment', 'orthodontics'),
  ('D8690', 'Orthodontic treatment (alternative billing)', 'orthodontics'),
  ('D8695', 'Removal of fixed orthodontic appliances for reasons other than completion', 'orthodontics'),
  ('D8696', 'Repair of orthodontic appliance - maxillary', 'orthodontics'),
  ('D8697', 'Repair of orthodontic appliance - mandibular', 'orthodontics'),
  ('D8698', 'Re-cement or re-bond fixed retainer - maxillary', 'orthodontics'),
  ('D8699', 'Re-cement or re-bond fixed retainer - mandibular', 'orthodontics'),
  ('D8701', 'Repair of fixed retainer', 'orthodontics'),
  ('D8702', 'Replacement of lost/broken retainer - maxillary', 'orthodontics'),
  ('D8703', 'Replacement of lost/broken retainer - mandibular', 'orthodontics'),
  ('D8704', 'Clear aligner therapy - comprehensive', 'orthodontics'),
  ('D8999', 'Unspecified orthodontic procedure', 'orthodontics')
ON CONFLICT (code) DO UPDATE SET
  description = EXCLUDED.description,
  canonical_slug = EXCLUDED.canonical_slug,
  updated_at = CURRENT_TIMESTAMP;

-- ============================================================
-- COSMETIC - VENEER CODES
-- ============================================================
INSERT INTO public.ada_codes (code, description, canonical_slug)
VALUES
  ('D2960', 'Labial veneer - resin laminate - laboratory', 'veneer'),
  ('D2961', 'Labial veneer - resin laminate - chairside', 'veneer'),
  ('D2962', 'Labial veneer - porcelain laminate - laboratory', 'veneer'),
  ('D2963', 'Labial veneer - in conjunction with crown', 'veneer')
ON CONFLICT (code) DO UPDATE SET
  description = EXCLUDED.description,
  canonical_slug = EXCLUDED.canonical_slug,
  updated_at = CURRENT_TIMESTAMP;

-- ============================================================
-- COSMETIC - WHITENING CODES
-- ============================================================
INSERT INTO public.ada_codes (code, description, canonical_slug)
VALUES
  ('D9972', 'External bleaching - per arch - performed in office', 'whitening'),
  ('D9973', 'External bleaching - per arch - home application', 'whitening'),
  ('D9974', 'Internal bleaching - per tooth', 'whitening'),
  ('D9975', 'External bleaching for home application - per arch - includes trays', 'whitening')
ON CONFLICT (code) DO UPDATE SET
  description = EXCLUDED.description,
  canonical_slug = EXCLUDED.canonical_slug,
  updated_at = CURRENT_TIMESTAMP;

-- ============================================================
-- PREVENTIVE - CLEANING/PROPHYLAXIS
-- ============================================================
INSERT INTO public.ada_codes (code, description, canonical_slug)
VALUES
  ('D1110', 'Prophylaxis - adult', 'cleaning'),
  ('D1120', 'Prophylaxis - child', 'cleaning')
ON CONFLICT (code) DO UPDATE SET
  description = EXCLUDED.description,
  canonical_slug = EXCLUDED.canonical_slug,
  updated_at = CURRENT_TIMESTAMP;

-- ============================================================
-- PREVENTIVE - SEALANT CODES
-- ============================================================
INSERT INTO public.ada_codes (code, description, canonical_slug)
VALUES
  ('D1310', 'Nutritional counseling for control of dental disease', 'dental-sealant'),
  ('D1320', 'Tobacco counseling for the control and prevention of oral disease', 'dental-sealant'),
  ('D1330', 'Oral hygiene instructions', 'dental-sealant'),
  ('D1351', 'Sealant - per tooth', 'dental-sealant'),
  ('D1352', 'Preventive resin restoration in a moderate to high caries risk patient', 'dental-sealant'),
  ('D1353', 'Sealant repair - per tooth', 'dental-sealant'),
  ('D1354', 'Interim caries arresting medicament application - per tooth', 'dental-sealant')
ON CONFLICT (code) DO UPDATE SET
  description = EXCLUDED.description,
  canonical_slug = EXCLUDED.canonical_slug,
  updated_at = CURRENT_TIMESTAMP;

-- ============================================================
-- PREVENTIVE - FLUORIDE TREATMENT CODES
-- ============================================================
INSERT INTO public.ada_codes (code, description, canonical_slug)
VALUES
  ('D1206', 'Topical application of fluoride varnish', 'fluoride-treatment'),
  ('D1208', 'Topical application of fluoride - excluding varnish', 'fluoride-treatment'),
  ('D1355', 'Caries preventive medicament application - per tooth', 'fluoride-treatment')
ON CONFLICT (code) DO UPDATE SET
  description = EXCLUDED.description,
  canonical_slug = EXCLUDED.canonical_slug,
  updated_at = CURRENT_TIMESTAMP;

-- ============================================================
-- NIGHT GUARD / SPLINT CODES (D9940-D9944)
-- ============================================================
INSERT INTO public.ada_codes (code, description, canonical_slug)
VALUES
  ('D9940', 'Occlusal guard - by report', 'night-guard'),
  ('D9941', 'Fabrication of athletic mouthguard', 'night-guard'),
  ('D9942', 'Repair and/or reline of occlusal guard', 'night-guard'),
  ('D9943', 'Occlusal guard adjustment', 'night-guard'),
  ('D9944', 'Occlusal guard - hard appliance, full arch', 'night-guard'),
  ('D9945', 'Occlusal guard - soft appliance, full arch', 'night-guard'),
  ('D9946', 'Occlusal guard - hard appliance, partial arch', 'night-guard')
ON CONFLICT (code) DO UPDATE SET
  description = EXCLUDED.description,
  canonical_slug = EXCLUDED.canonical_slug,
  updated_at = CURRENT_TIMESTAMP;

-- ============================================================
-- BONE GRAFT CODES (D7950-D7955)
-- ============================================================
INSERT INTO public.ada_codes (code, description, canonical_slug)
VALUES
  ('D7950', 'Osseous, osteoperiosteal, or cartilage graft of the mandible or maxilla - autogenous or nonautogenous', 'bone-graft'),
  ('D7951', 'Sinus augmentation with bone or bone substitutes via a lateral open approach', 'bone-graft'),
  ('D7952', 'Sinus augmentation via a vertical approach', 'bone-graft'),
  ('D7953', 'Bone replacement graft for ridge preservation - per site', 'bone-graft'),
  ('D7955', 'Repair of maxillofacial soft and/or hard tissue defect', 'bone-graft'),
  ('D7956', 'Guided tissue regeneration, edentulous area - resorbable barrier, per site', 'bone-graft'),
  ('D7957', 'Guided tissue regeneration, edentulous area - non-resorbable barrier, per site', 'bone-graft'),
  ('D4263', 'Bone replacement graft - retained natural tooth, first site in quadrant', 'bone-graft'),
  ('D4264', 'Bone replacement graft - retained natural tooth, each additional site in quadrant', 'bone-graft')
ON CONFLICT (code) DO UPDATE SET
  description = EXCLUDED.description,
  canonical_slug = EXCLUDED.canonical_slug,
  updated_at = CURRENT_TIMESTAMP;

-- ============================================================
-- SINUS LIFT CODES
-- Note: D7951 and D7952 are sinus-specific procedures, mapped to sinus-lift.
-- D7953 is a general bone graft code, kept under bone-graft above.
-- ============================================================
INSERT INTO public.ada_codes (code, description, canonical_slug)
VALUES
  ('D7951', 'Sinus augmentation with bone or bone substitutes via a lateral open approach', 'sinus-lift'),
  ('D7952', 'Sinus augmentation via a vertical approach', 'sinus-lift')
ON CONFLICT (code) DO UPDATE SET
  description = EXCLUDED.description,
  canonical_slug = EXCLUDED.canonical_slug,
  updated_at = CURRENT_TIMESTAMP;

-- ============================================================
-- INLAY/ONLAY CODES (D2510-D2543)
-- ============================================================
INSERT INTO public.ada_codes (code, description, canonical_slug)
VALUES
  ('D2510', 'Inlay - metallic - one surface', 'inlay-onlay'),
  ('D2520', 'Inlay - metallic - two surfaces', 'inlay-onlay'),
  ('D2530', 'Inlay - metallic - three or more surfaces', 'inlay-onlay'),
  ('D2542', 'Onlay - metallic - two surfaces', 'inlay-onlay'),
  ('D2543', 'Onlay - metallic - three or more surfaces', 'inlay-onlay'),
  ('D2610', 'Inlay - porcelain/ceramic - one surface', 'inlay-onlay'),
  ('D2620', 'Inlay - porcelain/ceramic - two surfaces', 'inlay-onlay'),
  ('D2630', 'Inlay - porcelain/ceramic - three or more surfaces', 'inlay-onlay'),
  ('D2642', 'Onlay - porcelain/ceramic - two surfaces', 'inlay-onlay'),
  ('D2643', 'Onlay - porcelain/ceramic - three or more surfaces', 'inlay-onlay'),
  ('D2650', 'Inlay - resin-based composite - one surface', 'inlay-onlay'),
  ('D2651', 'Inlay - resin-based composite - two surfaces', 'inlay-onlay'),
  ('D2652', 'Inlay - resin-based composite - three or more surfaces', 'inlay-onlay'),
  ('D2662', 'Onlay - resin-based composite - two surfaces', 'inlay-onlay'),
  ('D2663', 'Onlay - resin-based composite - three or more surfaces', 'inlay-onlay'),
  ('D2664', 'Onlay - resin-based composite - four or more surfaces', 'inlay-onlay')
ON CONFLICT (code) DO UPDATE SET
  description = EXCLUDED.description,
  canonical_slug = EXCLUDED.canonical_slug,
  updated_at = CURRENT_TIMESTAMP;

-- ============================================================
-- CORE BUILDUP CODES (D2950-D2954)
-- ============================================================
INSERT INTO public.ada_codes (code, description, canonical_slug)
VALUES
  ('D2950', 'Core buildup, including any pins when required', 'core-buildup'),
  ('D2951', 'Pin retention - per tooth, in addition to restoration', 'core-buildup'),
  ('D2952', 'Post and core in addition to crown, indirectly fabricated', 'core-buildup'),
  ('D2953', 'Each additional indirectly fabricated post - same tooth', 'core-buildup'),
  ('D2954', 'Prefabricated post and core in addition to crown', 'core-buildup')
ON CONFLICT (code) DO UPDATE SET
  description = EXCLUDED.description,
  canonical_slug = EXCLUDED.canonical_slug,
  updated_at = CURRENT_TIMESTAMP;

-- ============================================================
-- GUM GRAFT / PERIODONTICS ADDITIONS (D4263-D4275)
-- ============================================================
INSERT INTO public.ada_codes (code, description, canonical_slug)
VALUES
  ('D4265', 'Biologic materials to aid in soft and osseous tissue regeneration', 'gum-graft'),
  ('D4266', 'Guided tissue regeneration - resorbable barrier, per site, per tooth', 'gum-graft'),
  ('D4267', 'Guided tissue regeneration - non-resorbable barrier, per site, per tooth', 'gum-graft'),
  ('D4270', 'Pedicle soft tissue graft procedure', 'gum-graft'),
  ('D4271', 'Free soft tissue graft procedure (including donor site surgery), first tooth', 'gum-graft'),
  ('D4273', 'Autogenous connective tissue graft procedure, first tooth', 'gum-graft'),
  ('D4274', 'Mesial/distal wedge procedure, single tooth', 'gum-graft'),
  ('D4275', 'Non-autogenous connective tissue graft procedure, first tooth', 'gum-graft'),
  ('D4276', 'Combined connective tissue and double pedicle graft, per tooth', 'gum-graft'),
  ('D4277', 'Free soft tissue graft procedure, each additional contiguous tooth', 'gum-graft'),
  ('D4278', 'Free soft tissue graft procedure, each non-contiguous tooth', 'gum-graft')
ON CONFLICT (code) DO UPDATE SET
  description = EXCLUDED.description,
  canonical_slug = EXCLUDED.canonical_slug,
  updated_at = CURRENT_TIMESTAMP;

-- ============================================================
-- ADJUNCTIVE - SEDATION / ANESTHESIA CODES (D9210-D9248)
-- ============================================================
INSERT INTO public.ada_codes (code, description, canonical_slug)
VALUES
  ('D9210', 'Local anesthesia not in conjunction with operative or surgical procedures', 'sedation'),
  ('D9211', 'Regional block anesthesia', 'sedation'),
  ('D9212', 'Trigeminal division block anesthesia', 'sedation'),
  ('D9215', 'Local anesthesia in conjunction with operative or surgical procedures', 'sedation'),
  ('D9219', 'Evaluation for moderate sedation, deep sedation, or general anesthesia', 'sedation'),
  ('D9222', 'Deep sedation/general anesthesia - first 15 minutes', 'sedation'),
  ('D9223', 'Deep sedation/general anesthesia - each subsequent 15 minute increment', 'sedation'),
  ('D9230', 'Inhalation of nitrous oxide / analgesia, anxiolysis', 'sedation'),
  ('D9239', 'Intravenous moderate (conscious) sedation - first 15 minutes', 'sedation'),
  ('D9243', 'Intravenous moderate (conscious) sedation - each subsequent 15 minute increment', 'sedation'),
  ('D9248', 'Non-intravenous conscious sedation', 'sedation')
ON CONFLICT (code) DO UPDATE SET
  description = EXCLUDED.description,
  canonical_slug = EXCLUDED.canonical_slug,
  updated_at = CURRENT_TIMESTAMP;

-- ============================================================
-- RADIOGRAPH CODES (D0220-D0391)
-- ============================================================
INSERT INTO public.ada_codes (code, description, canonical_slug)
VALUES
  ('D0210', 'Intraoral - complete series of radiographic images', 'exam'),
  ('D0220', 'Intraoral - periapical first radiographic image', 'exam'),
  ('D0230', 'Intraoral - periapical each additional radiographic image', 'exam'),
  ('D0240', 'Intraoral - occlusal radiographic image', 'exam'),
  ('D0250', 'Extraoral - 2D projection radiographic image', 'exam'),
  ('D0270', 'Bitewing - single radiographic image', 'exam'),
  ('D0272', 'Bitewings - two radiographic images', 'exam'),
  ('D0273', 'Bitewings - three radiographic images', 'exam'),
  ('D0274', 'Bitewings - four radiographic images', 'exam'),
  ('D0277', 'Vertical bitewings - 7 to 8 radiographic images', 'exam'),
  ('D0330', 'Panoramic radiographic image', 'exam'),
  ('D0340', 'Cephalometric radiographic image', 'exam'),
  ('D0350', 'Oral/facial photographic image obtained intraorally or extraorally', 'exam'),
  ('D0364', 'Cone beam CT capture and interpretation - limited field of view', 'exam'),
  ('D0365', 'Cone beam CT capture and interpretation - field of view of both jaws', 'exam'),
  ('D0366', 'Cone beam CT capture and interpretation - field of view of both jaws with cranium', 'exam'),
  ('D0367', 'Cone beam CT capture and interpretation with field of view of both jaws - with or without cranium', 'exam'),
  ('D0368', 'Cone beam CT capture and interpretation for TMJ series', 'exam'),
  ('D0380', 'Cone beam CT image capture with limited field of view', 'exam'),
  ('D0381', 'Cone beam CT image capture with field of view of both jaws', 'exam'),
  ('D0382', 'Cone beam CT image capture with field of view of both jaws - with cranium', 'exam'),
  ('D0391', 'Interpretation of diagnostic image by a practitioner not associated with capture', 'exam')
ON CONFLICT (code) DO UPDATE SET
  description = EXCLUDED.description,
  canonical_slug = EXCLUDED.canonical_slug,
  updated_at = CURRENT_TIMESTAMP;

-- ============================================================
-- Update the get_canonical_slug_from_name function to support new procedures
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
  
  IF name_lower LIKE '%crown%' THEN
    RETURN 'crown';
  END IF;
  
  IF name_lower LIKE '%extract%' OR name_lower LIKE '%removal%' OR name_lower LIKE '%pull%' THEN
    RETURN 'extraction';
  END IF;
  
  IF name_lower LIKE '%scaling%' OR name_lower LIKE '%root planing%' OR name_lower LIKE '%srp%' OR name_lower LIKE '%deep clean%' THEN
    RETURN 'srp';
  END IF;
  
  IF name_lower LIKE '%root canal%' OR name_lower LIKE '%endodontic%' OR name_lower LIKE '%rct%' THEN
    RETURN 'root-canal';
  END IF;
  
  IF name_lower LIKE '%exam%' OR name_lower LIKE '%evaluation%' OR name_lower LIKE '%checkup%' OR name_lower LIKE '%check-up%' THEN
    RETURN 'exam';
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
  
  RETURN NULL;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error in get_canonical_slug_from_name: %', SQLERRM;
    RETURN NULL;
END;
$$;

COMMENT ON FUNCTION public.get_canonical_slug_from_name IS 'Returns canonical_slug based on procedure name pattern matching. Supports all canonical procedure types including implant, cleaning, veneer, whitening, orthodontics, night-guard, bone-graft, sinus-lift, dental-sealant, fluoride-treatment, inlay-onlay, core-buildup, and gum-graft.';

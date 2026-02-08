-- Location: supabase/migrations/20251230194100_seed_canonical_procedures_mappings.sql
-- Schema Analysis: canonical_procedures and ada_codes tables exist with proper structure
-- Integration Type: Enhancement - Seeding canonical procedures and ADA code mappings
-- Dependencies: canonical_procedures, ada_codes tables from previous migration

-- Clean up existing test data to start fresh
DELETE FROM public.ada_codes WHERE canonical_slug IN ('crown', 'extraction', 'srp', 'root-canal', 'exam', 'denture', 'filling', 'bridge');
DELETE FROM public.canonical_procedures WHERE slug IN ('crown', 'extraction', 'srp', 'root-canal', 'exam', 'denture', 'filling', 'bridge');

-- Insert canonical procedures with bilingual display names
INSERT INTO public.canonical_procedures (slug, display_name_en, display_name_es, category)
VALUES
  ('crown', 'Dental Crown', 'Corona Dental', 'restorative'),
  ('root-canal', 'Root Canal Treatment', 'Tratamiento de Conducto', 'endodontics'),
  ('extraction', 'Tooth Extraction', 'Extracción Dental', 'surgery'),
  ('srp', 'Scaling and Root Planing', 'Raspado y Alisado Radicular', 'periodontics'),
  ('exam', 'Dental Examination', 'Examen Dental', 'diagnostic'),
  ('denture', 'Denture', 'Dentadura', 'prosthodontics'),
  ('filling', 'Dental Filling', 'Empaste Dental', 'restorative'),
  ('bridge', 'Dental Bridge', 'Puente Dental', 'prosthodontics')
ON CONFLICT (slug) DO UPDATE SET
  display_name_en = EXCLUDED.display_name_en,
  display_name_es = EXCLUDED.display_name_es,
  category = EXCLUDED.category,
  updated_at = CURRENT_TIMESTAMP;

-- Insert comprehensive ADA code mappings for crowns
INSERT INTO public.ada_codes (code, description, canonical_slug)
VALUES
  ('D2740', 'Crown - porcelain/ceramic substrate', 'crown'),
  ('D2750', 'Crown - porcelain fused to high noble metal', 'crown'),
  ('D2751', 'Crown - porcelain fused to predominantly base metal', 'crown'),
  ('D2752', 'Crown - porcelain fused to noble metal', 'crown'),
  ('D2780', 'Crown - 3/4 cast high noble metal', 'crown'),
  ('D2781', 'Crown - 3/4 cast predominantly base metal', 'crown'),
  ('D2782', 'Crown - 3/4 cast noble metal', 'crown'),
  ('D2783', 'Crown - 3/4 porcelain/ceramic', 'crown'),
  ('D2790', 'Crown - full cast high noble metal', 'crown'),
  ('D2791', 'Crown - full cast predominantly base metal', 'crown'),
  ('D2792', 'Crown - full cast noble metal', 'crown'),
  ('D2794', 'Crown - titanium', 'crown')
ON CONFLICT (code) DO UPDATE SET
  description = EXCLUDED.description,
  canonical_slug = EXCLUDED.canonical_slug,
  updated_at = CURRENT_TIMESTAMP;

-- Insert ADA code mappings for extractions
INSERT INTO public.ada_codes (code, description, canonical_slug)
VALUES
  ('D7140', 'Extraction, erupted tooth or exposed root', 'extraction'),
  ('D7210', 'Extraction, erupted tooth requiring removal of bone and/or sectioning', 'extraction'),
  ('D7220', 'Removal of impacted tooth - soft tissue', 'extraction'),
  ('D7230', 'Removal of impacted tooth - partially bony', 'extraction'),
  ('D7240', 'Removal of impacted tooth - completely bony', 'extraction'),
  ('D7241', 'Removal of impacted tooth - completely bony, with unusual complications', 'extraction'),
  ('D7250', 'Removal of residual tooth roots', 'extraction'),
  ('D7260', 'Oroantral fistula closure', 'extraction'),
  ('D7270', 'Tooth reimplantation and/or stabilization', 'extraction'),
  ('D7272', 'Tooth transplantation', 'extraction'),
  ('D7280', 'Exposure of an unerupted tooth', 'extraction'),
  ('D7282', 'Mobilization of erupted or malpositioned tooth', 'extraction'),
  ('D7283', 'Placement of device to facilitate eruption of impacted tooth', 'extraction'),
  ('D7285', 'Incisional biopsy of oral tissue - hard', 'extraction'),
  ('D7286', 'Incisional biopsy of oral tissue - soft', 'extraction')
ON CONFLICT (code) DO UPDATE SET
  description = EXCLUDED.description,
  canonical_slug = EXCLUDED.canonical_slug,
  updated_at = CURRENT_TIMESTAMP;

-- Insert ADA code mappings for SRP (Scaling and Root Planing)
INSERT INTO public.ada_codes (code, description, canonical_slug)
VALUES
  ('D4341', 'Periodontal scaling and root planing - four or more teeth per quadrant', 'srp'),
  ('D4342', 'Periodontal scaling and root planing - one to three teeth per quadrant', 'srp')
ON CONFLICT (code) DO UPDATE SET
  description = EXCLUDED.description,
  canonical_slug = EXCLUDED.canonical_slug,
  updated_at = CURRENT_TIMESTAMP;

-- Insert ADA code mappings for root canals
INSERT INTO public.ada_codes (code, description, canonical_slug)
VALUES
  ('D3310', 'Endodontic therapy, anterior tooth', 'root-canal'),
  ('D3320', 'Endodontic therapy, premolar', 'root-canal'),
  ('D3330', 'Endodontic therapy, molar', 'root-canal')
ON CONFLICT (code) DO UPDATE SET
  description = EXCLUDED.description,
  canonical_slug = EXCLUDED.canonical_slug,
  updated_at = CURRENT_TIMESTAMP;

-- Insert ADA code mappings for dental examinations
INSERT INTO public.ada_codes (code, description, canonical_slug)
VALUES
  ('D0120', 'Periodic oral evaluation', 'exam'),
  ('D0140', 'Limited oral evaluation - problem focused', 'exam'),
  ('D0150', 'Comprehensive oral evaluation', 'exam'),
  ('D0160', 'Detailed and extensive oral evaluation - problem focused', 'exam'),
  ('D0170', 'Re-evaluation - limited, problem focused', 'exam'),
  ('D0180', 'Comprehensive periodontal evaluation', 'exam')
ON CONFLICT (code) DO UPDATE SET
  description = EXCLUDED.description,
  canonical_slug = EXCLUDED.canonical_slug,
  updated_at = CURRENT_TIMESTAMP;

-- Insert ADA code mappings for dentures
INSERT INTO public.ada_codes (code, description, canonical_slug)
VALUES
  ('D5110', 'Complete denture - maxillary (upper)', 'denture'),
  ('D5120', 'Complete denture - mandibular (lower)', 'denture'),
  ('D5130', 'Immediate denture - maxillary', 'denture'),
  ('D5140', 'Immediate denture - mandibular', 'denture'),
  ('D5211', 'Maxillary partial denture - resin base', 'denture'),
  ('D5212', 'Mandibular partial denture - resin base', 'denture'),
  ('D5213', 'Maxillary partial denture - cast metal framework', 'denture'),
  ('D5214', 'Mandibular partial denture - cast metal framework', 'denture')
ON CONFLICT (code) DO UPDATE SET
  description = EXCLUDED.description,
  canonical_slug = EXCLUDED.canonical_slug,
  updated_at = CURRENT_TIMESTAMP;

-- Insert ADA code mappings for fillings
INSERT INTO public.ada_codes (code, description, canonical_slug)
VALUES
  ('D2140', 'Amalgam - one surface, primary or permanent', 'filling'),
  ('D2150', 'Amalgam - two surfaces, primary or permanent', 'filling'),
  ('D2160', 'Amalgam - three surfaces, primary or permanent', 'filling'),
  ('D2161', 'Amalgam - four or more surfaces, primary or permanent', 'filling'),
  ('D2330', 'Resin-based composite - one surface, anterior', 'filling'),
  ('D2331', 'Resin-based composite - two surfaces, anterior', 'filling'),
  ('D2332', 'Resin-based composite - three surfaces, anterior', 'filling'),
  ('D2335', 'Resin-based composite - four or more surfaces, anterior', 'filling'),
  ('D2390', 'Resin-based composite crown, anterior', 'filling'),
  ('D2391', 'Resin-based composite - one surface, posterior', 'filling'),
  ('D2392', 'Resin-based composite - two surfaces, posterior', 'filling'),
  ('D2393', 'Resin-based composite - three surfaces, posterior', 'filling'),
  ('D2394', 'Resin-based composite - four or more surfaces, posterior', 'filling')
ON CONFLICT (code) DO UPDATE SET
  description = EXCLUDED.description,
  canonical_slug = EXCLUDED.canonical_slug,
  updated_at = CURRENT_TIMESTAMP;

-- Insert ADA code mappings for bridges
INSERT INTO public.ada_codes (code, description, canonical_slug)
VALUES
  ('D6210', 'Pontic - cast high noble metal', 'bridge'),
  ('D6211', 'Pontic - cast predominantly base metal', 'bridge'),
  ('D6212', 'Pontic - cast noble metal', 'bridge'),
  ('D6214', 'Pontic - titanium', 'bridge'),
  ('D6240', 'Pontic - porcelain fused to high noble metal', 'bridge'),
  ('D6241', 'Pontic - porcelain fused to predominantly base metal', 'bridge'),
  ('D6242', 'Pontic - porcelain fused to noble metal', 'bridge'),
  ('D6245', 'Pontic - porcelain/ceramic', 'bridge'),
  ('D6710', 'Retainer crown - indirect resin based composite', 'bridge'),
  ('D6720', 'Retainer crown - resin with high noble metal', 'bridge'),
  ('D6721', 'Retainer crown - resin with predominantly base metal', 'bridge'),
  ('D6722', 'Retainer crown - resin with noble metal', 'bridge'),
  ('D6740', 'Retainer crown - porcelain/ceramic', 'bridge'),
  ('D6750', 'Retainer crown - porcelain fused to high noble metal', 'bridge'),
  ('D6751', 'Retainer crown - porcelain fused to predominantly base metal', 'bridge'),
  ('D6752', 'Retainer crown - porcelain fused to noble metal', 'bridge')
ON CONFLICT (code) DO UPDATE SET
  description = EXCLUDED.description,
  canonical_slug = EXCLUDED.canonical_slug,
  updated_at = CURRENT_TIMESTAMP;

-- Create helper function to get canonical display name from procedure name (name-based fallback)
CREATE OR REPLACE FUNCTION public.get_canonical_slug_from_name(procedure_name TEXT)
RETURNS TEXT
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
  found_slug TEXT;
  name_lower TEXT;
BEGIN
  IF procedure_name IS NULL OR TRIM(procedure_name) = '' THEN
    RETURN NULL;
  END IF;
  
  name_lower := LOWER(TRIM(procedure_name));
  
  -- Check for crown aliases
  IF name_lower LIKE '%crown%' THEN
    RETURN 'crown';
  END IF;
  
  -- Check for extraction aliases
  IF name_lower LIKE '%extract%' OR name_lower LIKE '%removal%' OR name_lower LIKE '%pull%' THEN
    RETURN 'extraction';
  END IF;
  
  -- Check for SRP aliases
  IF name_lower LIKE '%scaling%' OR name_lower LIKE '%root planing%' OR name_lower LIKE '%srp%' OR name_lower LIKE '%deep clean%' THEN
    RETURN 'srp';
  END IF;
  
  -- Check for root canal aliases
  IF name_lower LIKE '%root canal%' OR name_lower LIKE '%endodontic%' OR name_lower LIKE '%rct%' THEN
    RETURN 'root-canal';
  END IF;
  
  -- Check for exam aliases
  IF name_lower LIKE '%exam%' OR name_lower LIKE '%evaluation%' OR name_lower LIKE '%checkup%' OR name_lower LIKE '%check-up%' THEN
    RETURN 'exam';
  END IF;
  
  -- Check for denture aliases
  IF name_lower LIKE '%denture%' OR name_lower LIKE '%false teeth%' THEN
    RETURN 'denture';
  END IF;
  
  -- Check for filling aliases
  IF name_lower LIKE '%filling%' OR name_lower LIKE '%restoration%' OR name_lower LIKE '%composite%' OR name_lower LIKE '%amalgam%' THEN
    RETURN 'filling';
  END IF;
  
  -- Check for bridge aliases
  IF name_lower LIKE '%bridge%' OR name_lower LIKE '%pontic%' THEN
    RETURN 'bridge';
  END IF;
  
  RETURN NULL;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error in get_canonical_slug_from_name: %', SQLERRM;
    RETURN NULL;
END;
$$;

-- Comment on function
COMMENT ON FUNCTION public.get_canonical_slug_from_name IS 'Returns canonical_slug based on procedure name pattern matching. Used as fallback when ada_code is not available.';
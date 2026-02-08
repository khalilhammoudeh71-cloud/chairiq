-- ================================================================
-- ADA Code → Canonical Procedure Mapping Migration
-- ================================================================
-- Purpose: Fix patient page visuals + implement ADA-code → canonical-procedure mapping
-- Timestamp: 20251230050508
-- Schema Analysis: Existing tables (procedure_library, procedure_codes, plan_procedures) will be enhanced
-- Integration Type: Extension - adds canonical mapping system
-- Dependencies: procedure_library (slug), procedure_codes (code), plan_procedures

-- ================================================================
-- STEP 1: Create canonical_procedures table
-- ================================================================
CREATE TABLE IF NOT EXISTS public.canonical_procedures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    display_name_en TEXT NOT NULL,
    display_name_es TEXT NOT NULL,
    category TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Add index for slug lookups
CREATE INDEX IF NOT EXISTS idx_canonical_procedures_slug ON public.canonical_procedures(slug);
CREATE INDEX IF NOT EXISTS idx_canonical_procedures_category ON public.canonical_procedures(category);

-- ================================================================
-- STEP 2: Seed canonical_procedures with common procedures
-- ================================================================
INSERT INTO public.canonical_procedures (slug, display_name_en, display_name_es, category)
VALUES
    ('crown', 'Dental Crown', 'Corona Dental', 'restorative'),
    ('root-canal', 'Root Canal Treatment', 'Tratamiento de Conducto', 'endodontics'),
    ('extraction', 'Tooth Extraction', 'Extracción Dental', 'oral_surgery'),
    ('scaling-root-planing', 'Scaling and Root Planing', 'Raspaje y Alisado Radicular', 'periodontics'),
    ('bridge', 'Dental Bridge', 'Puente Dental', 'restorative'),
    ('filling', 'Dental Filling', 'Empaste Dental', 'restorative'),
    ('implant', 'Dental Implant', 'Implante Dental', 'oral_surgery'),
    ('denture', 'Denture', 'Dentadura Postiza', 'prosthetics'),
    ('veneer', 'Dental Veneer', 'Carilla Dental', 'cosmetic'),
    ('cleaning', 'Dental Cleaning', 'Limpieza Dental', 'preventive')
ON CONFLICT (slug) DO NOTHING;

-- ================================================================
-- STEP 3: Create ada_codes table with canonical mapping
-- ================================================================
CREATE TABLE IF NOT EXISTS public.ada_codes (
    code TEXT PRIMARY KEY,
    description TEXT NOT NULL,
    canonical_slug TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ada_codes_canonical_slug FOREIGN KEY (canonical_slug) 
        REFERENCES public.canonical_procedures(slug) ON DELETE CASCADE
);

-- Add indexes for ada_codes
CREATE INDEX IF NOT EXISTS idx_ada_codes_canonical_slug ON public.ada_codes(canonical_slug);
CREATE INDEX IF NOT EXISTS idx_ada_codes_is_active ON public.ada_codes(is_active);

-- ================================================================
-- STEP 4: Seed ada_codes with crown codes mapping
-- ================================================================
INSERT INTO public.ada_codes (code, description, canonical_slug, is_active)
VALUES
    -- Crown codes → crown
    ('D2740', 'Crown - porcelain/ceramic substrate', 'crown', true),
    ('D2750', 'Crown - porcelain fused to high noble metal', 'crown', true),
    ('D2751', 'Crown - porcelain fused to predominantly base metal', 'crown', true),
    ('D2752', 'Crown - porcelain fused to noble metal', 'crown', true),
    ('D2781', 'Crown - 3/4 cast high noble metal', 'crown', true),
    ('D2782', 'Crown - 3/4 cast predominantly base metal', 'crown', true),
    ('D2783', 'Crown - 3/4 cast noble metal', 'crown', true),
    ('D2790', 'Crown - full cast high noble metal', 'crown', true),
    ('D2791', 'Crown - full cast predominantly base metal', 'crown', true),
    ('D2792', 'Crown - full cast noble metal', 'crown', true),
    ('D2794', 'Crown - titanium', 'crown', true),
    
    -- Extraction codes → extraction
    ('D7140', 'Extraction, erupted tooth or exposed root', 'extraction', true),
    ('D7210', 'Extraction, erupted tooth requiring removal of bone/sectioning', 'extraction', true),
    ('D7220', 'Removal of impacted tooth - soft tissue', 'extraction', true),
    ('D7230', 'Removal of impacted tooth - partially bony', 'extraction', true),
    ('D7240', 'Removal of impacted tooth - completely bony', 'extraction', true),
    
    -- Root canal codes → root-canal
    ('D3310', 'Root canal - anterior tooth', 'root-canal', true),
    ('D3320', 'Root canal - bicuspid tooth', 'root-canal', true),
    ('D3330', 'Root canal - molar tooth', 'root-canal', true),
    
    -- Scaling and Root Planing codes → scaling-root-planing
    ('D4341', 'Periodontal scaling and root planing - four or more teeth per quadrant', 'scaling-root-planing', true),
    ('D4342', 'Periodontal scaling and root planing - one to three teeth per quadrant', 'scaling-root-planing', true),
    
    -- Bridge codes → bridge
    ('D6210', 'Pontic - cast high noble metal', 'bridge', true),
    ('D6211', 'Pontic - cast predominantly base metal', 'bridge', true),
    ('D6212', 'Pontic - cast noble metal', 'bridge', true),
    ('D6240', 'Pontic - porcelain fused to high noble metal', 'bridge', true),
    ('D6241', 'Pontic - porcelain fused to predominantly base metal', 'bridge', true),
    ('D6242', 'Pontic - porcelain fused to noble metal', 'bridge', true)
ON CONFLICT (code) DO UPDATE SET
    description = EXCLUDED.description,
    canonical_slug = EXCLUDED.canonical_slug,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;

-- ================================================================
-- STEP 5: Add canonical_slug to procedure_library (if not exists)
-- ================================================================
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'procedure_library' 
        AND column_name = 'canonical_slug'
    ) THEN
        ALTER TABLE public.procedure_library 
        ADD COLUMN canonical_slug TEXT;
        
        CREATE INDEX idx_procedure_library_canonical_slug 
        ON public.procedure_library(canonical_slug);
    END IF;
END $$;

-- ================================================================
-- STEP 6: Backfill canonical_slug in procedure_library
-- ================================================================
-- Map existing library entries to canonical slugs
UPDATE public.procedure_library 
SET canonical_slug = slug 
WHERE canonical_slug IS NULL;

-- Specific mappings for known procedures
UPDATE public.procedure_library SET canonical_slug = 'crown' WHERE slug = 'dental-crown';
UPDATE public.procedure_library SET canonical_slug = 'root-canal' WHERE slug = 'root-canal';
UPDATE public.procedure_library SET canonical_slug = 'extraction' WHERE slug LIKE '%extraction%';
UPDATE public.procedure_library SET canonical_slug = 'bridge' WHERE slug LIKE '%bridge%';
UPDATE public.procedure_library SET canonical_slug = 'filling' WHERE slug LIKE '%filling%';

-- ================================================================
-- STEP 7: Backfill canonical_slug in plan_procedures using procedure_slug
-- ================================================================
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'plan_procedures' 
        AND column_name = 'canonical_slug'
    ) THEN
        ALTER TABLE public.plan_procedures 
        ADD COLUMN canonical_slug TEXT;
        
        CREATE INDEX idx_plan_procedures_canonical_slug 
        ON public.plan_procedures(canonical_slug);
    END IF;
END $$;

-- Backfill canonical_slug for existing plan_procedures
-- Priority 1: Use procedure_slug if it exists
UPDATE public.plan_procedures pp
SET canonical_slug = pl.canonical_slug
FROM public.procedure_library pl
WHERE pp.procedure_slug = pl.slug
AND pp.canonical_slug IS NULL;

-- Priority 2: Try to map by ADA code
UPDATE public.plan_procedures pp
SET canonical_slug = ac.canonical_slug
FROM public.ada_codes ac
WHERE pp.ada_code = ac.code
AND pp.canonical_slug IS NULL;

-- Priority 3: Best-effort mapping by procedure name
UPDATE public.plan_procedures 
SET canonical_slug = CASE
    WHEN procedure_name ILIKE '%crown%' THEN 'crown'
    WHEN procedure_name ILIKE '%root canal%' OR procedure_name ILIKE '%endodontic%' THEN 'root-canal'
    WHEN procedure_name ILIKE '%extraction%' OR procedure_name ILIKE '%removal%' THEN 'extraction'
    WHEN procedure_name ILIKE '%bridge%' THEN 'bridge'
    WHEN procedure_name ILIKE '%filling%' THEN 'filling'
    WHEN procedure_name ILIKE '%scaling%' OR procedure_name ILIKE '%root planing%' THEN 'scaling-root-planing'
    ELSE NULL
END
WHERE canonical_slug IS NULL;

-- ================================================================
-- STEP 8: Create procedure_visuals table
-- ================================================================
CREATE TABLE IF NOT EXISTS public.procedure_visuals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    canonical_slug TEXT NOT NULL,
    step_key TEXT,
    image_url TEXT NOT NULL,
    alt_text_en TEXT NOT NULL,
    alt_text_es TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_procedure_visuals_canonical_slug FOREIGN KEY (canonical_slug) 
        REFERENCES public.canonical_procedures(slug) ON DELETE CASCADE
);

-- Add indexes for procedure_visuals
CREATE INDEX IF NOT EXISTS idx_procedure_visuals_canonical_slug ON public.procedure_visuals(canonical_slug);
CREATE INDEX IF NOT EXISTS idx_procedure_visuals_sort_order ON public.procedure_visuals(canonical_slug, sort_order);

-- ================================================================
-- STEP 9: Enable RLS on new tables
-- ================================================================
ALTER TABLE public.canonical_procedures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ada_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.procedure_visuals ENABLE ROW LEVEL SECURITY;

-- ================================================================
-- STEP 10: Create RLS policies (public read, authenticated write)
-- ================================================================

-- Canonical procedures - public read
CREATE POLICY "public_can_read_canonical_procedures"
ON public.canonical_procedures
FOR SELECT
TO public
USING (true);

-- Canonical procedures - authenticated manage
CREATE POLICY "authenticated_manage_canonical_procedures"
ON public.canonical_procedures
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- ADA codes - public read
CREATE POLICY "public_can_read_ada_codes"
ON public.ada_codes
FOR SELECT
TO public
USING (is_active = true);

-- ADA codes - authenticated manage
CREATE POLICY "authenticated_manage_ada_codes"
ON public.ada_codes
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Procedure visuals - public read
CREATE POLICY "public_can_read_procedure_visuals"
ON public.procedure_visuals
FOR SELECT
TO public
USING (true);

-- Procedure visuals - authenticated manage
CREATE POLICY "authenticated_manage_procedure_visuals"
ON public.procedure_visuals
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- ================================================================
-- STEP 11: Create helper functions for canonical lookups
-- ================================================================

-- Function to get canonical slug from ADA code
CREATE OR REPLACE FUNCTION public.get_canonical_slug_from_ada_code(p_ada_code TEXT)
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT canonical_slug 
    FROM public.ada_codes 
    WHERE code = p_ada_code AND is_active = true
    LIMIT 1;
$$;

-- Function to get canonical slug from procedure library slug
CREATE OR REPLACE FUNCTION public.get_canonical_slug_from_procedure_slug(p_procedure_slug TEXT)
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT canonical_slug 
    FROM public.procedure_library 
    WHERE slug = p_procedure_slug AND is_published = true
    LIMIT 1;
$$;

-- Function to get display name by language
CREATE OR REPLACE FUNCTION public.get_canonical_display_name(p_canonical_slug TEXT, p_language TEXT DEFAULT 'en')
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT CASE 
        WHEN LOWER(p_language) = 'es' THEN display_name_es
        ELSE display_name_en
    END
    FROM public.canonical_procedures
    WHERE slug = p_canonical_slug
    LIMIT 1;
$$;

-- ================================================================
-- STEP 12: Create updated_at trigger for new tables
-- ================================================================

CREATE OR REPLACE FUNCTION public.update_canonical_procedures_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

CREATE TRIGGER set_canonical_procedures_updated_at
    BEFORE UPDATE ON public.canonical_procedures
    FOR EACH ROW
    EXECUTE FUNCTION public.update_canonical_procedures_updated_at();

CREATE OR REPLACE FUNCTION public.update_ada_codes_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

CREATE TRIGGER set_ada_codes_updated_at
    BEFORE UPDATE ON public.ada_codes
    FOR EACH ROW
    EXECUTE FUNCTION public.update_ada_codes_updated_at();

-- ================================================================
-- Migration Complete
-- ================================================================
-- Summary:
-- 1. Created canonical_procedures table with multilingual names
-- 2. Seeded with common dental procedures
-- 3. Created ada_codes table with canonical_slug mappings
-- 4. Seeded with crown, extraction, root canal, bridge, and scaling codes
-- 5. Added canonical_slug to procedure_library and plan_procedures
-- 6. Backfilled canonical_slug based on slug, ada_code, and name matching
-- 7. Created procedure_visuals table for canonical slug-based images
-- 8. Enabled RLS with public read, authenticated write policies
-- 9. Created helper functions for canonical lookups
-- 10. Added updated_at triggers
-- ================================================================
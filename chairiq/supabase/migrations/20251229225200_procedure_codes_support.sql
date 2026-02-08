-- Location: supabase/migrations/20251229225200_procedure_codes_support.sql
-- Schema Analysis: Extends existing plan_procedures table with new fields and creates procedure_codes table
-- Integration Type: enhancement
-- Dependencies: plan_procedures, user_profiles

-- 1. Create procedure_codes table for CDT/ADA codes
CREATE TABLE public.procedure_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    category TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. Add new columns to plan_procedures table
ALTER TABLE public.plan_procedures
ADD COLUMN procedure_slug TEXT,
ADD COLUMN display_title TEXT,
ADD COLUMN tooth_numbers TEXT;

-- 3. Create procedure_favorites table
CREATE TABLE public.procedure_favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    procedure_slug TEXT,
    ada_code TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create procedure_recents table
CREATE TABLE public.procedure_recents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    procedure_slug TEXT,
    ada_code TEXT,
    last_used_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Create indexes for performance
CREATE INDEX idx_procedure_codes_code ON public.procedure_codes(code);
CREATE INDEX idx_procedure_codes_category ON public.procedure_codes(category);
CREATE INDEX idx_procedure_codes_is_active ON public.procedure_codes(is_active);
CREATE INDEX idx_plan_procedures_procedure_slug ON public.plan_procedures(procedure_slug);
CREATE INDEX idx_procedure_favorites_user_id ON public.procedure_favorites(user_id);
CREATE INDEX idx_procedure_recents_user_id ON public.procedure_recents(user_id);
CREATE INDEX idx_procedure_recents_last_used ON public.procedure_recents(last_used_at DESC);

-- 6. Enable RLS on new tables
ALTER TABLE public.procedure_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.procedure_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.procedure_recents ENABLE ROW LEVEL SECURITY;

-- 7. Create RLS policies
-- Public read access for procedure_codes
CREATE POLICY "public_can_read_procedure_codes"
ON public.procedure_codes
FOR SELECT
TO public
USING (is_active = true);

-- Authenticated users can manage procedure_codes
CREATE POLICY "authenticated_manage_procedure_codes"
ON public.procedure_codes
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Users manage their own favorites
CREATE POLICY "users_manage_own_favorites"
ON public.procedure_favorites
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Users manage their own recents
CREATE POLICY "users_manage_own_recents"
ON public.procedure_recents
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 8. Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_procedure_codes_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $func$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$func$;

-- 9. Create trigger
CREATE TRIGGER set_procedure_codes_updated_at
BEFORE UPDATE ON public.procedure_codes
FOR EACH ROW
EXECUTE FUNCTION public.update_procedure_codes_updated_at();

-- 10. Insert sample CDT/ADA codes (common dental procedures)
DO $$
BEGIN
    INSERT INTO public.procedure_codes (code, title, category) VALUES
        ('D0120', 'Periodic oral evaluation', 'Diagnostic'),
        ('D0140', 'Limited oral evaluation - problem focused', 'Diagnostic'),
        ('D0150', 'Comprehensive oral evaluation', 'Diagnostic'),
        ('D0210', 'Intraoral - complete series of radiographic images', 'Diagnostic'),
        ('D0220', 'Intraoral - periapical first radiographic image', 'Diagnostic'),
        ('D0230', 'Intraoral - periapical each additional radiographic image', 'Diagnostic'),
        ('D0330', 'Panoramic radiographic image', 'Diagnostic'),
        ('D1110', 'Prophylaxis - adult', 'Preventive'),
        ('D1120', 'Prophylaxis - child', 'Preventive'),
        ('D1206', 'Topical application of fluoride varnish', 'Preventive'),
        ('D1208', 'Topical application of fluoride - excluding varnish', 'Preventive'),
        ('D2140', 'Amalgam - one surface, primary or permanent', 'Restorative'),
        ('D2150', 'Amalgam - two surfaces, primary or permanent', 'Restorative'),
        ('D2160', 'Amalgam - three surfaces, primary or permanent', 'Restorative'),
        ('D2330', 'Resin-based composite - one surface, anterior', 'Restorative'),
        ('D2331', 'Resin-based composite - two surfaces, anterior', 'Restorative'),
        ('D2332', 'Resin-based composite - three surfaces, anterior', 'Restorative'),
        ('D2391', 'Resin-based composite - one surface, posterior', 'Restorative'),
        ('D2392', 'Resin-based composite - two surfaces, posterior', 'Restorative'),
        ('D2393', 'Resin-based composite - three surfaces, posterior', 'Restorative'),
        ('D2740', 'Crown - porcelain/ceramic substrate', 'Restorative'),
        ('D2750', 'Crown - porcelain fused to high noble metal', 'Restorative'),
        ('D2790', 'Crown - full cast high noble metal', 'Restorative'),
        ('D2910', 'Re-cement or re-bond inlay, onlay, veneer or partial coverage restoration', 'Restorative'),
        ('D2920', 'Re-cement or re-bond crown', 'Restorative'),
        ('D3110', 'Pulp cap - direct (excluding final restoration)', 'Endodontics'),
        ('D3220', 'Therapeutic pulpotomy (excluding final restoration)', 'Endodontics'),
        ('D3310', 'Endodontic therapy, anterior tooth (excluding final restoration)', 'Endodontics'),
        ('D3320', 'Endodontic therapy, premolar tooth (excluding final restoration)', 'Endodontics'),
        ('D3330', 'Endodontic therapy, molar tooth (excluding final restoration)', 'Endodontics'),
        ('D4210', 'Gingivectomy or gingivoplasty - four or more contiguous teeth', 'Periodontics'),
        ('D4341', 'Periodontal scaling and root planing - four or more teeth per quadrant', 'Periodontics'),
        ('D4910', 'Periodontal maintenance', 'Periodontics'),
        ('D5110', 'Complete denture - maxillary', 'Prosthodontics'),
        ('D5120', 'Complete denture - mandibular', 'Prosthodontics'),
        ('D5213', 'Maxillary partial denture - cast metal framework with resin denture bases', 'Prosthodontics'),
        ('D5214', 'Mandibular partial denture - cast metal framework with resin denture bases', 'Prosthodontics'),
        ('D6010', 'Surgical placement of implant body: endosteal implant', 'Implant Services'),
        ('D6040', 'Surgical placement: eposteal implant', 'Implant Services'),
        ('D6050', 'Surgical placement: transosteal implant', 'Implant Services'),
        ('D6065', 'Implant supported porcelain/ceramic crown', 'Implant Services'),
        ('D7111', 'Extraction, coronal remnants - primary tooth', 'Oral Surgery'),
        ('D7140', 'Extraction, erupted tooth or exposed root', 'Oral Surgery'),
        ('D7210', 'Extraction, erupted tooth requiring removal of bone and/or sectioning of tooth', 'Oral Surgery'),
        ('D7220', 'Removal of impacted tooth - soft tissue', 'Oral Surgery'),
        ('D7230', 'Removal of impacted tooth - partially bony', 'Oral Surgery'),
        ('D7240', 'Removal of impacted tooth - completely bony', 'Oral Surgery'),
        ('D8080', 'Comprehensive orthodontic treatment of the adolescent dentition', 'Orthodontics'),
        ('D8210', 'Removable appliance therapy', 'Orthodontics'),
        ('D9110', 'Palliative (emergency) treatment of dental pain', 'Adjunctive General Services'),
        ('D9310', 'Consultation - diagnostic service provided by dentist or physician', 'Adjunctive General Services'),
        ('D9972', 'External bleaching - per arch', 'Adjunctive General Services');
END $$;
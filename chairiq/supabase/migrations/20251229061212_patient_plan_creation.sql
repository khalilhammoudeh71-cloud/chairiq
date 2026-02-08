-- Location: supabase/migrations/20251229061212_patient_plan_creation.sql
-- Schema Analysis: Fresh database with no existing schema
-- Integration Type: NEW_MODULE - Complete patient plan creation system
-- Dependencies: None (fresh project)

-- 1. TYPES AND ENUMS
CREATE TYPE public.preferred_language AS ENUM ('EN', 'ES');
CREATE TYPE public.procedure_priority AS ENUM ('Immediate', 'Soon', 'Future');

-- 2. CORE TABLES

-- Patients table
CREATE TABLE public.patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    preferred_language public.preferred_language DEFAULT 'EN'::public.preferred_language,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Treatment Plans table
CREATE TABLE public.treatment_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    dentist_name TEXT NOT NULL,
    practice_name TEXT NOT NULL,
    public_token TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Plan Procedures table
CREATE TABLE public.plan_procedures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    treatment_plan_id UUID REFERENCES public.treatment_plans(id) ON DELETE CASCADE,
    procedure_name TEXT NOT NULL,
    ada_code TEXT,
    priority public.procedure_priority DEFAULT 'Soon'::public.procedure_priority,
    est_time TEXT,
    notes_for_patient TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. INDEXES
CREATE INDEX idx_patients_phone ON public.patients(phone);
CREATE INDEX idx_treatment_plans_patient_id ON public.treatment_plans(patient_id);
CREATE INDEX idx_treatment_plans_public_token ON public.treatment_plans(public_token);
CREATE INDEX idx_plan_procedures_treatment_plan_id ON public.plan_procedures(treatment_plan_id);
CREATE INDEX idx_plan_procedures_priority ON public.plan_procedures(priority);

-- 4. FUNCTIONS (Must be before RLS policies)

-- Function to generate unique public tokens
CREATE OR REPLACE FUNCTION public.generate_unique_token()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $func$
DECLARE
    token TEXT;
    token_exists BOOLEAN;
BEGIN
    LOOP
        -- Generate random 12-character token
        token := encode(gen_random_bytes(9), 'base64');
        token := replace(token, '/', '_');
        token := replace(token, '+', '-');
        token := substring(token, 1, 12);
        
        -- Check if token already exists
        SELECT EXISTS(SELECT 1 FROM public.treatment_plans WHERE public_token = token) INTO token_exists;
        
        -- Exit loop if token is unique
        EXIT WHEN NOT token_exists;
    END LOOP;
    
    RETURN token;
END;
$func$;

-- 5. ENABLE RLS
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_procedures ENABLE ROW LEVEL SECURITY;

-- 6. RLS POLICIES

-- Public read access for patients table (dentists need to access without auth)
CREATE POLICY "allow_all_access_patients"
ON public.patients
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Public read access for treatment_plans
CREATE POLICY "allow_all_access_treatment_plans"
ON public.treatment_plans
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Public read access for plan_procedures
CREATE POLICY "allow_all_access_plan_procedures"
ON public.plan_procedures
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- 7. TRIGGERS

-- Auto-generate public token for treatment plans
CREATE OR REPLACE FUNCTION public.auto_generate_token()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $func$
BEGIN
    IF NEW.public_token IS NULL OR NEW.public_token = '' THEN
        NEW.public_token := public.generate_unique_token();
    END IF;
    RETURN NEW;
END;
$func$;

CREATE TRIGGER set_public_token_before_insert
    BEFORE INSERT ON public.treatment_plans
    FOR EACH ROW
    EXECUTE FUNCTION public.auto_generate_token();

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $func$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$func$;

CREATE TRIGGER update_patients_timestamp
    BEFORE UPDATE ON public.patients
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_treatment_plans_timestamp
    BEFORE UPDATE ON public.treatment_plans
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();

-- 8. MOCK DATA
DO $$
DECLARE
    patient1_id UUID := gen_random_uuid();
    patient2_id UUID := gen_random_uuid();
    plan1_id UUID := gen_random_uuid();
    plan2_id UUID := gen_random_uuid();
BEGIN
    -- Insert sample patients
    INSERT INTO public.patients (id, first_name, last_name, phone, preferred_language)
    VALUES
        (patient1_id, 'Maria', 'Garcia', '+1-555-0101', 'ES'::public.preferred_language),
        (patient2_id, 'John', 'Smith', '+1-555-0102', 'EN'::public.preferred_language);

    -- Insert sample treatment plans (tokens will be auto-generated)
    INSERT INTO public.treatment_plans (id, patient_id, dentist_name, practice_name, public_token)
    VALUES
        (plan1_id, patient1_id, 'Dr. Sarah Johnson', 'Bright Smile Dental', ''),
        (plan2_id, patient2_id, 'Dr. Michael Chen', 'Family Dental Care', '');

    -- Insert sample procedures for plan 1
    INSERT INTO public.plan_procedures (treatment_plan_id, procedure_name, ada_code, priority, est_time, notes_for_patient, sort_order)
    VALUES
        (plan1_id, 'Root Canal', 'D3310', 'Immediate'::public.procedure_priority, '90 minutes', 'Priority treatment to save tooth', 1),
        (plan1_id, 'Crown', 'D2740', 'Soon'::public.procedure_priority, '60 minutes', 'Protect tooth after root canal', 2),
        (plan1_id, 'Professional Cleaning', 'D1110', 'Future'::public.procedure_priority, '45 minutes', 'Regular maintenance', 3);

    -- Insert sample procedures for plan 2
    INSERT INTO public.plan_procedures (treatment_plan_id, procedure_name, ada_code, priority, est_time, notes_for_patient, sort_order)
    VALUES
        (plan2_id, 'Comprehensive Exam', 'D0150', 'Immediate'::public.procedure_priority, '45 minutes', 'Initial assessment needed', 1),
        (plan2_id, 'X-rays', 'D0210', 'Immediate'::public.procedure_priority, '20 minutes', 'Required for diagnosis', 2),
        (plan2_id, 'Composite Filling', 'D2391', 'Soon'::public.procedure_priority, '30 minutes', 'Cavity treatment', 3);
END $$;
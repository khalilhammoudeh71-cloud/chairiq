-- Location: supabase/migrations/20251229062007_dentist_authentication.sql
-- Schema Analysis: Existing patient management tables, NO auth system
-- Integration Type: NEW authentication module with role-based access
-- Dependencies: Existing patients and treatment_plans tables

-- 1. Create user_role enum
CREATE TYPE public.user_role AS ENUM ('dentist', 'patient', 'admin');

-- 2. Create user_profiles table (intermediary for auth.users)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role public.user_role DEFAULT 'patient'::public.user_role,
    practice_name TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create indexes
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);

-- 4. Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies - Pattern 1 (Core User Table - Simple Only)
CREATE POLICY "users_manage_own_profile"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- 6. Function for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name, role, practice_name, phone)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'patient'::public.user_role),
        COALESCE(NEW.raw_user_meta_data->>'practice_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'phone', '')
    );
    RETURN NEW;
END;
$$;

-- 7. Trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- 8. Function to check if user is dentist
CREATE OR REPLACE FUNCTION public.is_dentist()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'dentist'::public.user_role
)
$$;

-- 9. Update existing table policies for dentist access

-- Update treatment_plans to allow dentist full access
DROP POLICY IF EXISTS "dentists_manage_all_treatment_plans" ON public.treatment_plans;
CREATE POLICY "dentists_manage_all_treatment_plans"
ON public.treatment_plans
FOR ALL
TO authenticated
USING (public.is_dentist())
WITH CHECK (public.is_dentist());

-- Update patients table to allow dentist full access
DROP POLICY IF EXISTS "dentists_manage_all_patients" ON public.patients;
CREATE POLICY "dentists_manage_all_patients"
ON public.patients
FOR ALL
TO authenticated
USING (public.is_dentist())
WITH CHECK (public.is_dentist());

-- Update plan_procedures to allow dentist full access
DROP POLICY IF EXISTS "dentists_manage_all_procedures" ON public.plan_procedures;
CREATE POLICY "dentists_manage_all_procedures"
ON public.plan_procedures
FOR ALL
TO authenticated
USING (public.is_dentist())
WITH CHECK (public.is_dentist());

-- 10. Update trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_user_profiles_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

CREATE TRIGGER update_user_profiles_timestamp
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_user_profiles_updated_at();

-- 11. Mock data for testing (dentist accounts)
DO $$
DECLARE
    dentist1_uuid UUID := gen_random_uuid();
    dentist2_uuid UUID := gen_random_uuid();
BEGIN
    -- Create dentist auth users with required fields
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (dentist1_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'dentist@chairiq.com', crypt('dentist123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Dr. Sarah Johnson", "role": "dentist", "practice_name": "ChairIQ Dental Care", "phone": "(555) 123-4567"}'::jsonb,
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (dentist2_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@chairiq.com', crypt('admin123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Dr. Michael Chen", "role": "dentist", "practice_name": "Advanced Dental Solutions", "phone": "(555) 987-6543"}'::jsonb,
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);
END $$;
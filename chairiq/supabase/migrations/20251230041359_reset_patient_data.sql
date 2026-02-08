-- Migration: Reset All Patient Data
-- Description: Removes all patient records and related data from the database
-- WARNING: This is a destructive operation that cannot be undone
-- Created: 2025-12-30 04:13:59

-- Disable foreign key checks temporarily for cascade deletion
-- PostgreSQL will handle cascade properly with proper ordering

-- Step 1: Delete batch job related records (if any linked to procedures)
-- Note: batch_jobs and batch_job_items are not directly linked to patients, so we skip them

-- Step 2: Delete patient engagement and analytics data
DO $$
BEGIN
  RAISE NOTICE 'Deleting patient engagement events...';
  DELETE FROM public.patient_engagement_events;
  
  RAISE NOTICE 'Deleting patient language preferences...';
  DELETE FROM public.patient_language_preferences;
  
  RAISE NOTICE 'Deleting patient session analytics...';
  DELETE FROM public.patient_session_analytics;
  
  RAISE NOTICE 'Deleting procedure completion tracking...';
  DELETE FROM public.procedure_completion_tracking;
END $$;

-- Step 3: Delete SMS related records
DO $$
BEGIN
  RAISE NOTICE 'Deleting SMS link clicks...';
  DELETE FROM public.sms_link_clicks;
  
  RAISE NOTICE 'Deleting SMS messages...';
  DELETE FROM public.sms_messages;
END $$;

-- Step 4: Delete plan procedures (treatment plan details)
DO $$
BEGIN
  RAISE NOTICE 'Deleting plan procedures...';
  DELETE FROM public.plan_procedures;
END $$;

-- Step 5: Delete treatment plans
DO $$
BEGIN
  RAISE NOTICE 'Deleting treatment plans...';
  DELETE FROM public.treatment_plans;
END $$;

-- Step 6: Delete patients (parent table)
DO $$
DECLARE
  deleted_count INTEGER;
BEGIN
  RAISE NOTICE 'Deleting all patients...';
  DELETE FROM public.patients;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RAISE NOTICE 'Successfully deleted % patient records', deleted_count;
END $$;

-- Step 7: Reset sequences (optional - ensures IDs start from 1 again)
-- Uncomment if you want to reset auto-increment sequences
-- ALTER SEQUENCE patients_id_seq RESTART WITH 1;
-- ALTER SEQUENCE treatment_plans_id_seq RESTART WITH 1;
-- ALTER SEQUENCE plan_procedures_id_seq RESTART WITH 1;

-- Step 8: Verify deletion
DO $$
DECLARE
  patient_count INTEGER;
  plan_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO patient_count FROM public.patients;
  SELECT COUNT(*) INTO plan_count FROM public.treatment_plans;
  
  RAISE NOTICE '========================================';
  RAISE NOTICE 'PATIENT DATA RESET COMPLETE';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Remaining patients: %', patient_count;
  RAISE NOTICE 'Remaining treatment plans: %', plan_count;
  RAISE NOTICE '========================================';
  
  IF patient_count = 0 AND plan_count = 0 THEN
    RAISE NOTICE '✓ All patient data successfully removed';
  ELSE
    RAISE WARNING '⚠ Some data may remain - manual verification required';
  END IF;
END $$;

-- Note: This migration preserves:
-- - user_profiles (dentist accounts)
-- - procedure_library (treatment content)
-- - procedure_codes (ADA codes)
-- - procedure_favorites and procedure_recents (user preferences)
-- - batch_jobs and batch_job_items (AI content generation history)
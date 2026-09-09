-- REVIEWED CANDIDATE ONLY: NOT EXECUTED AGAINST THE LIVE DATABASE.
-- User confirmed on 2026-09-08 that both existing plans belong to their ChairIQ
-- dentist account. Account/plan/patient UUIDs were verified read-only.
-- Apply only after the scope_patient_data_access migration and explicit live
-- rollout approval. This targeted operation is NOT a general ownership backfill.
BEGIN;
LOCK TABLE public.patients,public.treatment_plans IN SHARE ROW EXCLUSIVE MODE;
DO $$
DECLARE
  confirmed_owner constant uuid := 'd9683d3c-7761-4f9b-8e07-2e0785dc28ee';
  confirmed_patient constant uuid := '12779f7b-2366-4113-85f7-559bb084d1a9';
  confirmed_plans constant uuid[] := ARRAY[
    'a452b656-9d70-453a-8ade-42cb3b475bc5'::uuid,
    'd27cf683-3687-4d25-ad96-5713daccdbf8'::uuid
  ];
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id=confirmed_owner) THEN
    RAISE EXCEPTION 'Confirmed account missing; review ownership again';
  END IF;
  IF (SELECT count(*) FROM public.patients WHERE id=confirmed_patient AND created_by IS NULL) <> 1
    OR (SELECT count(*) FROM public.treatment_plans
      WHERE id=ANY(confirmed_plans) AND patient_id=confirmed_patient AND created_by IS NULL) <> 2
    OR EXISTS (SELECT 1 FROM public.treatment_plans WHERE patient_id=confirmed_patient AND NOT(id=ANY(confirmed_plans))) THEN
    RAISE EXCEPTION 'Confirmed rows changed; review ownership again before assigning';
  END IF;
  UPDATE public.patients SET created_by=confirmed_owner WHERE id=confirmed_patient;
  UPDATE public.treatment_plans SET created_by=confirmed_owner WHERE id=ANY(confirmed_plans);
END $$;
COMMIT;

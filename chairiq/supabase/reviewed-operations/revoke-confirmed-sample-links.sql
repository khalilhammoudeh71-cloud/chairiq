-- Reviewed rollout operation: execute only after owner assignment and explicit
-- live rollout approval. The user confirmed these two plans are samples.
-- Preserve NOT NULL / UNIQUE public_token constraints with non-bearer markers.
-- These markers cannot pass the patient RPC's 12/48-character token validation.
BEGIN;
LOCK TABLE public.patients, public.treatment_plans IN SHARE ROW EXCLUSIVE MODE;
DO $$
DECLARE
  confirmed_owner constant uuid := 'd9683d3c-7761-4f9b-8e07-2e0785dc28ee';
  confirmed_patient constant uuid := '12779f7b-2366-4113-85f7-559bb084d1a9';
  confirmed_plans constant uuid[] := ARRAY[
    'a452b656-9d70-453a-8ade-42cb3b475bc5'::uuid,
    'd27cf683-3687-4d25-ad96-5713daccdbf8'::uuid
  ];
BEGIN
  IF (SELECT count(*) FROM public.patients WHERE id=confirmed_patient AND created_by=confirmed_owner) <> 1
    OR (SELECT count(*) FROM public.treatment_plans WHERE id=ANY(confirmed_plans)
      AND patient_id=confirmed_patient AND created_by=confirmed_owner) <> 2
    OR EXISTS (SELECT 1 FROM public.treatment_plans WHERE patient_id=confirmed_patient AND NOT(id=ANY(confirmed_plans))) THEN
    RAISE EXCEPTION 'Confirmed sample rows changed; review before revoking links';
  END IF;
  UPDATE public.treatment_plans SET public_token='revoked:' || gen_random_uuid()::text
    WHERE id=ANY(confirmed_plans);
END $$;
COMMIT;

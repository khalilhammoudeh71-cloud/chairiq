-- Local candidate. Apply only with the matching client and reviewed ownership
-- assignment. Never replay the older repository migrations against production.
BEGIN;

-- Existing public patient objects require a real Storage API move and review,
-- not an SQL metadata update. The inspected project had zero such objects/rows.
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id='treatment-images' AND name LIKE 'patient-specific/%')
     OR EXISTS (SELECT 1 FROM public.procedure_visuals WHERE canonical_slug LIKE 'patient-%') THEN
    RAISE EXCEPTION 'Existing patient images require a reviewed private-storage migration first';
  END IF;
END $$;

ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS created_by uuid;
ALTER TABLE public.patients ALTER COLUMN created_by SET DEFAULT auth.uid();
-- Set the default only after adding the nullable column so no existing row is
-- assigned from the migration session. Verified ownership is assigned separately.
CREATE INDEX IF NOT EXISTS patients_created_by_idx ON public.patients(created_by);
CREATE INDEX IF NOT EXISTS treatment_plans_created_by_idx ON public.treatment_plans(created_by);
CREATE INDEX IF NOT EXISTS plan_procedures_plan_idx ON public.plan_procedures(treatment_plan_id);
CREATE TRIGGER patient_access_keep_patient_owner BEFORE UPDATE ON public.patients
  FOR EACH ROW EXECUTE FUNCTION chairiq_private.keep_plan_owner();

CREATE FUNCTION chairiq_private.owns_patient(patient_uuid uuid) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
  SELECT auth.uid() IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.patients WHERE id=patient_uuid AND created_by=auth.uid());
$$;
CREATE FUNCTION chairiq_private.owns_plan(plan_uuid uuid) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
  SELECT auth.uid() IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.treatment_plans p JOIN public.patients pt ON pt.id=p.patient_id
    WHERE p.id=plan_uuid AND p.created_by=auth.uid() AND pt.created_by=auth.uid());
$$;
CREATE FUNCTION chairiq_private.owns_procedure(procedure_uuid uuid) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
  SELECT EXISTS (SELECT 1 FROM public.plan_procedures p
    WHERE p.id=procedure_uuid AND chairiq_private.owns_plan(p.treatment_plan_id));
$$;
REVOKE ALL ON FUNCTION chairiq_private.owns_patient(uuid),chairiq_private.owns_plan(uuid),chairiq_private.owns_procedure(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION chairiq_private.owns_patient(uuid),chairiq_private.owns_plan(uuid),chairiq_private.owns_procedure(uuid) TO anon,authenticated;

-- Replace every permissive policy on patient-bearing tables. Old PUBLIC ALL
-- policies cannot be left in place alongside a new permissive owner policy.
DO $$ DECLARE target text; pol record; fk text; predicate text; BEGIN
  FOR target,fk IN SELECT * FROM (VALUES
    ('patients',NULL),('treatment_plans',NULL),('plan_procedures','treatment_plan_id'),
    ('patient_session_analytics','treatment_plan_id'),('patient_engagement_events','treatment_plan_id'),
    ('patient_language_preferences','treatment_plan_id'),('procedure_completion_tracking','treatment_plan_id'),
    ('sms_messages','treatment_plan_id'),('sms_link_clicks','treatment_plan_id'),
    ('plan_views','plan_id'),('plan_reminders','plan_id'),('message_logs','plan_id')
  ) AS tables(name,plan_column) LOOP
    IF to_regclass('public.'||target) IS NULL THEN CONTINUE; END IF;
    FOR pol IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename=target LOOP
      EXECUTE format('DROP POLICY %I ON public.%I',pol.policyname,target);
    END LOOP;
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY',target);
    EXECUTE format('REVOKE ALL ON public.%I FROM PUBLIC,anon,authenticated',target);
    EXECUTE format('GRANT SELECT,INSERT,UPDATE,DELETE ON public.%I TO authenticated',target);
    predicate := CASE target
      WHEN 'patients' THEN '(auth.uid() IS NOT NULL AND created_by=auth.uid())'
      WHEN 'treatment_plans' THEN '(auth.uid() IS NOT NULL AND created_by=auth.uid() AND chairiq_private.owns_patient(patient_id))'
      ELSE format('chairiq_private.owns_plan(%I)',fk) END;
    -- Do not allow an owned plan to be used to attach another patient's data.
    IF fk IS NOT NULL AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name=target AND column_name='patient_id') THEN
      predicate := predicate || format(' AND (patient_id IS NULL OR EXISTS (SELECT 1 FROM public.treatment_plans p WHERE p.id=%I.%I AND p.patient_id=%I.patient_id))',target,fk,target);
    END IF;
    IF fk IS NOT NULL AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name=target AND column_name='procedure_id') THEN
      predicate := predicate || format(' AND (procedure_id IS NULL OR EXISTS (SELECT 1 FROM public.plan_procedures pp WHERE pp.id=%I.procedure_id AND pp.treatment_plan_id=%I.%I))',target,target,fk);
    END IF;
    EXECUTE format('CREATE POLICY patient_owner_access ON public.%I FOR ALL TO authenticated USING (%s) WITH CHECK (%s)',target,predicate,predicate);
  END LOOP;
END $$;

-- Patient images are not canonical educational visuals. Keep the existing
-- canonical_procedures foreign key intact and use a real procedure FK here.
CREATE TABLE public.patient_plan_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_procedure_id uuid NOT NULL REFERENCES public.plan_procedures(id) ON DELETE CASCADE,
  step_key text NOT NULL,
  image_url text NOT NULL,
  alt_text_en text NOT NULL DEFAULT '',
  alt_text_es text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(plan_procedure_id,step_key),
  CHECK (image_url LIKE 'patient-specific/'||plan_procedure_id::text||'/%')
);
ALTER TABLE public.patient_plan_images ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.patient_plan_images FROM PUBLIC,anon,authenticated;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.patient_plan_images TO authenticated;
CREATE POLICY patient_image_metadata_owner ON public.patient_plan_images FOR ALL TO authenticated
  USING (chairiq_private.owns_procedure(plan_procedure_id))
  WITH CHECK (chairiq_private.owns_procedure(plan_procedure_id));

-- Exact bearer lookup. The expiring token is checked in the same database
-- statement that reads patient data; knowing a plan UUID grants no access.
CREATE FUNCTION chairiq_private.plan_for_token(link_token text) RETURNS uuid
LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
  SELECT p.id FROM public.treatment_plans p
  WHERE (link_token ~ '^[A-Za-z0-9_-]{12}$' AND p.public_token=link_token)
     OR (link_token ~ '^[A-Za-z0-9]{48}$' AND EXISTS (
       SELECT 1 FROM public.plan_share_links l WHERE l.token=link_token
       AND l.plan_id=p.id AND l.patient_id=p.patient_id AND l.expires_at>statement_timestamp()))
  LIMIT 1;
$$;
REVOKE ALL ON FUNCTION chairiq_private.plan_for_token(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION chairiq_private.plan_for_token(text) TO anon,authenticated;

CREATE FUNCTION chairiq_private.get_patient_plan(link_token text) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path='' AS $$
DECLARE selected_plan uuid; result jsonb; BEGIN
  selected_plan := chairiq_private.plan_for_token(link_token);
  IF selected_plan IS NULL THEN
    RETURN jsonb_build_object('success',false,'reason',CASE WHEN link_token ~ '^[A-Za-z0-9]{48}$'
      AND EXISTS (SELECT 1 FROM public.plan_share_links WHERE token=link_token AND expires_at<=statement_timestamp())
      THEN 'expired' ELSE 'not_found' END);
  END IF;
  SELECT jsonb_build_object('id',p.id,'dentist_name',p.dentist_name,'practice_name',p.practice_name,'created_at',p.created_at,
    'patients',jsonb_build_object('first_name',pt.first_name,'last_name',pt.last_name,'preferred_language',pt.preferred_language),
    'plan_procedures',coalesce((SELECT jsonb_agg(jsonb_build_object(
      'id',pp.id,'procedure_name',pp.procedure_name,'procedure_slug',pp.procedure_slug,
      'display_title',pp.display_title,'ada_code',pp.ada_code,'tooth_numbers',pp.tooth_numbers,
      'canonical_slug',pp.canonical_slug,'priority',pp.priority,'est_time',pp.est_time,
      'notes_for_patient',pp.notes_for_patient,'sort_order',pp.sort_order,
      'patient_images',coalesce((SELECT jsonb_agg(jsonb_build_object('image_url',v.image_url,'alt_text_en',v.alt_text_en,'sort_order',v.sort_order) ORDER BY v.sort_order)
        FROM public.patient_plan_images v WHERE v.plan_procedure_id=pp.id),'[]'::jsonb)
      ) ORDER BY pp.sort_order) FROM public.plan_procedures pp WHERE pp.treatment_plan_id=p.id),'[]'::jsonb))
    INTO result FROM public.treatment_plans p JOIN public.patients pt ON pt.id=p.patient_id WHERE p.id=selected_plan;
  IF result IS NULL THEN RETURN jsonb_build_object('success',false,'reason','not_found'); END IF;
  RETURN jsonb_build_object('success',true,'plan',result);
END;
$$;
REVOKE ALL ON FUNCTION chairiq_private.get_patient_plan(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION chairiq_private.get_patient_plan(text) TO anon,authenticated;
CREATE FUNCTION public.get_patient_plan(link_token text) RETURNS jsonb
LANGUAGE sql STABLE SECURITY INVOKER SET search_path='' AS $$
  SELECT chairiq_private.get_patient_plan(link_token);
$$;
REVOKE ALL ON FUNCTION public.get_patient_plan(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_patient_plan(text) TO anon,authenticated;

-- Legacy aggregate functions must not bypass the new table policies.
DO $$ DECLARE f record; BEGIN
  FOR f IN SELECT p.oid::regprocedure AS signature FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
    WHERE n.nspname='public' AND p.proname IN ('get_patient_engagement_summary','get_patient_engagement_metrics','get_sms_delivery_metrics','update_session_end_time') LOOP
    EXECUTE format('ALTER FUNCTION %s SECURITY INVOKER',f.signature);
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC,anon',f.signature);
    EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO authenticated',f.signature);
  END LOOP;
END $$;

-- Generic educational visuals stay public; patient images/notes do not.
CREATE FUNCTION chairiq_private.owns_patient_visual(slug text) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
  SELECT EXISTS (SELECT 1 FROM public.plan_procedures pp
    WHERE slug='patient-'||pp.id::text AND chairiq_private.owns_plan(pp.treatment_plan_id));
$$;
REVOKE ALL ON FUNCTION chairiq_private.owns_patient_visual(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION chairiq_private.owns_patient_visual(text) TO anon,authenticated;
CREATE POLICY patient_visual_guard ON public.procedure_visuals AS RESTRICTIVE FOR ALL TO PUBLIC
  USING (canonical_slug NOT LIKE 'patient-%' OR chairiq_private.owns_patient_visual(canonical_slug))
  WITH CHECK (canonical_slug NOT LIKE 'patient-%' OR chairiq_private.owns_patient_visual(canonical_slug));

INSERT INTO storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
  VALUES ('patient-images','patient-images',false,10485760,ARRAY['image/jpeg','image/png','image/webp','image/gif'])
  ON CONFLICT(id) DO UPDATE SET public=false,file_size_limit=10485760,allowed_mime_types=EXCLUDED.allowed_mime_types;

CREATE FUNCTION chairiq_private.owns_patient_image(object_name text) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
  SELECT EXISTS (SELECT 1 FROM public.plan_procedures pp
    WHERE split_part(object_name,'/',1)='patient-specific' AND split_part(object_name,'/',2)=pp.id::text
      AND chairiq_private.owns_plan(pp.treatment_plan_id));
$$;
REVOKE ALL ON FUNCTION chairiq_private.owns_patient_image(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION chairiq_private.owns_patient_image(text) TO anon,authenticated;
-- Patient downloads go through the uncached patient-plan-image Edge endpoint.
-- Custom headers do not isolate Storage CDN cache entries for the shared anon JWT.
-- Restrictive rules also constrain any preexisting permissive bucket policies.
CREATE POLICY patient_image_read_guard ON storage.objects AS RESTRICTIVE FOR SELECT TO PUBLIC
  USING (CASE WHEN bucket_id='patient-images' THEN chairiq_private.owns_patient_image(name)
    ELSE NOT (bucket_id='treatment-images' AND name LIKE 'patient-specific/%') END);
CREATE POLICY patient_image_insert_guard ON storage.objects AS RESTRICTIVE FOR INSERT TO PUBLIC
  WITH CHECK (CASE WHEN bucket_id='patient-images' THEN chairiq_private.owns_patient_image(name)
    ELSE NOT (bucket_id='treatment-images' AND name LIKE 'patient-specific/%') END);
CREATE POLICY patient_image_update_guard ON storage.objects AS RESTRICTIVE FOR UPDATE TO PUBLIC
  USING (CASE WHEN bucket_id='patient-images' THEN chairiq_private.owns_patient_image(name)
    ELSE NOT (bucket_id='treatment-images' AND name LIKE 'patient-specific/%') END)
  WITH CHECK (CASE WHEN bucket_id='patient-images' THEN chairiq_private.owns_patient_image(name)
    ELSE NOT (bucket_id='treatment-images' AND name LIKE 'patient-specific/%') END);
CREATE POLICY patient_image_delete_guard ON storage.objects AS RESTRICTIVE FOR DELETE TO PUBLIC
  USING (CASE WHEN bucket_id='patient-images' THEN chairiq_private.owns_patient_image(name)
    ELSE NOT (bucket_id='treatment-images' AND name LIKE 'patient-specific/%') END);
CREATE POLICY patient_image_owner ON storage.objects FOR ALL TO authenticated
  USING (bucket_id='patient-images' AND chairiq_private.owns_patient_image(name))
  WITH CHECK (bucket_id='patient-images' AND chairiq_private.owns_patient_image(name));
NOTIFY pgrst,'reload schema';
COMMIT;

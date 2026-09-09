-- Apply only after reviewing SHARE-LINK-ROLLOUT.md. This migration never guesses
-- ownership for existing plans. It works with the table absent or already present.
BEGIN;

CREATE SCHEMA IF NOT EXISTS chairiq_private;
REVOKE ALL ON SCHEMA chairiq_private FROM PUBLIC;
GRANT USAGE ON SCHEMA chairiq_private TO anon, authenticated;

ALTER TABLE public.treatment_plans ADD COLUMN IF NOT EXISTS created_by uuid;
ALTER TABLE public.treatment_plans ALTER COLUMN created_by SET DEFAULT auth.uid();

-- Existing permissive plan policies must not allow callers to forge ownership.
-- Leave legacy reads alone; this is not a replacement for a full patient-data RLS audit.
CREATE POLICY share_links_plan_insert_owner ON public.treatment_plans
  AS RESTRICTIVE FOR INSERT TO PUBLIC
  WITH CHECK (auth.uid() IS NOT NULL AND created_by = auth.uid());
CREATE POLICY share_links_plan_update_owner ON public.treatment_plans
  AS RESTRICTIVE FOR UPDATE TO PUBLIC
  USING (auth.uid() IS NOT NULL AND created_by = auth.uid())
  WITH CHECK (auth.uid() IS NOT NULL AND created_by = auth.uid());
CREATE POLICY share_links_plan_delete_owner ON public.treatment_plans
  AS RESTRICTIVE FOR DELETE TO PUBLIC
  USING (auth.uid() IS NOT NULL AND created_by = auth.uid());

CREATE FUNCTION chairiq_private.keep_plan_owner() RETURNS trigger
LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN
  IF current_user IN ('anon', 'authenticated') AND NEW.created_by IS DISTINCT FROM OLD.created_by THEN
    RAISE EXCEPTION 'Plan ownership cannot be reassigned by clients' USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION chairiq_private.keep_plan_owner() FROM PUBLIC;
CREATE TRIGGER share_links_keep_plan_owner BEFORE UPDATE ON public.treatment_plans
  FOR EACH ROW EXECUTE FUNCTION chairiq_private.keep_plan_owner();

CREATE TABLE IF NOT EXISTS public.plan_share_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token varchar(64) NOT NULL UNIQUE,
  patient_id uuid NOT NULL,
  plan_id uuid NOT NULL,
  expires_at timestamptz NOT NULL,
  view_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_plan_share_links_plan_id ON public.plan_share_links(plan_id);
LOCK TABLE public.plan_share_links IN ACCESS EXCLUSIVE MODE;
-- Tokens created under the old public-read policy may already have been copied
-- or forged. Keep their audit rows, but require newly issued tokens after upgrade.
UPDATE public.plan_share_links SET expires_at = least(expires_at, now());
ALTER TABLE public.plan_share_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_share_links ADD CONSTRAINT share_link_plan_fk
  FOREIGN KEY (plan_id) REFERENCES public.treatment_plans(id) ON DELETE CASCADE;
ALTER TABLE public.plan_share_links ADD CONSTRAINT share_link_patient_fk
  FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE;

DROP POLICY IF EXISTS "Allow select by exact token" ON public.plan_share_links;
DROP POLICY IF EXISTS "Allow authenticated insert on plan_share_links" ON public.plan_share_links;
REVOKE ALL ON public.plan_share_links FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT ON public.plan_share_links TO authenticated;

CREATE POLICY share_link_owner_read ON public.plan_share_links FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.treatment_plans p
    WHERE p.id = plan_id AND p.patient_id = plan_share_links.patient_id AND p.created_by = auth.uid()));
CREATE POLICY share_link_owner_insert ON public.plan_share_links FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL AND EXISTS (SELECT 1 FROM public.treatment_plans p
    WHERE p.id = plan_id AND p.patient_id = plan_share_links.patient_id AND p.created_by = auth.uid()));

CREATE FUNCTION chairiq_private.initialize_share_link() RETURNS trigger
LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN
  IF NEW.token !~ '^[A-Za-z0-9]{48}$' THEN
    RAISE EXCEPTION 'Invalid share token format' USING ERRCODE = '22023';
  END IF;
  IF current_user IN ('anon', 'authenticated') THEN
    NEW.created_at := now();
    NEW.expires_at := now() + interval '24 hours';
    NEW.view_count := 0;
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION chairiq_private.initialize_share_link() FROM PUBLIC;
CREATE TRIGGER initialize_share_link BEFORE INSERT ON public.plan_share_links
  FOR EACH ROW EXECUTE FUNCTION chairiq_private.initialize_share_link();

-- Bearer-token authorization is deliberate: patients have no dentist session.
-- The privileged code is outside exposed schemas, has a fixed search path, and
-- returns one exact match only. No list/search endpoint or wildcard matching.
CREATE FUNCTION chairiq_private.validate_plan_share_link(link_token text) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE link public.plan_share_links%ROWTYPE;
BEGIN
  IF link_token IS NULL OR link_token !~ '^[A-Za-z0-9]{48}$' THEN
    RETURN jsonb_build_object('valid', false, 'reason', 'not_found');
  END IF;
  SELECT l.* INTO link FROM public.plan_share_links l
    JOIN public.treatment_plans p ON p.id = l.plan_id AND p.patient_id = l.patient_id
    WHERE l.token = link_token;
  IF NOT FOUND THEN RETURN jsonb_build_object('valid', false, 'reason', 'not_found'); END IF;
  IF link.expires_at <= now() THEN RETURN jsonb_build_object('valid', false, 'reason', 'expired'); END IF;
  RETURN jsonb_build_object('valid', true, 'link', jsonb_build_object(
    'plan_id', link.plan_id, 'patient_id', link.patient_id,
    'expires_at', link.expires_at, 'view_count', link.view_count));
END;
$$;
REVOKE ALL ON FUNCTION chairiq_private.validate_plan_share_link(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION chairiq_private.validate_plan_share_link(text) TO anon, authenticated;
CREATE FUNCTION public.validate_plan_share_link(link_token text) RETURNS jsonb
LANGUAGE sql SECURITY INVOKER SET search_path = '' AS $$
  SELECT chairiq_private.validate_plan_share_link(link_token);
$$;
REVOKE ALL ON FUNCTION public.validate_plan_share_link(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.validate_plan_share_link(text) TO anon, authenticated;

CREATE FUNCTION chairiq_private.increment_share_link_view(link_token varchar) RETURNS void
LANGUAGE sql SECURITY DEFINER SET search_path = '' AS $$
  UPDATE public.plan_share_links l SET view_count = least(coalesce(l.view_count, 0)::bigint + 1, 2147483647)::integer
  WHERE link_token ~ '^[A-Za-z0-9]{48}$' AND l.token = link_token AND l.expires_at > now()
    AND EXISTS (SELECT 1 FROM public.treatment_plans p WHERE p.id = l.plan_id AND p.patient_id = l.patient_id);
$$;
REVOKE ALL ON FUNCTION chairiq_private.increment_share_link_view(varchar) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION chairiq_private.increment_share_link_view(varchar) TO anon, authenticated;
CREATE OR REPLACE FUNCTION public.increment_share_link_view(link_token varchar) RETURNS void
LANGUAGE sql SECURITY INVOKER SET search_path = '' AS $$
  SELECT chairiq_private.increment_share_link_view(link_token);
$$;
REVOKE ALL ON FUNCTION public.increment_share_link_view(varchar) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.increment_share_link_view(varchar) TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
COMMIT;

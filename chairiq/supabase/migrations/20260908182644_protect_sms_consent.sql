-- Protect the existing consent ledger without changing its records.
-- Read-only inspection found no app/database consumer, policies or records.
-- The public /consent page is informational and does not access this table.
-- Ordinary client sessions have no verified consent ownership or write authority.
BEGIN;
ALTER TABLE public.sms_consent ENABLE ROW LEVEL SECURITY;
REVOKE ALL PRIVILEGES ON TABLE public.sms_consent FROM PUBLIC, anon, authenticated;

-- Defense in depth: a later permissive policy/table grant must not expose
-- consent rows. Administrative owners and service_role (BYPASSRLS) retain access.
CREATE POLICY sms_consent_server_only ON public.sms_consent
  AS RESTRICTIVE FOR ALL TO PUBLIC USING (false) WITH CHECK (false);

NOTIFY pgrst, 'reload schema';
COMMIT;

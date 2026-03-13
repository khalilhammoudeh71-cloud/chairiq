CREATE TABLE IF NOT EXISTS public.message_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES public.patients(id) ON DELETE SET NULL,
    plan_id UUID NOT NULL REFERENCES public.treatment_plans(id) ON DELETE CASCADE,
    method TEXT NOT NULL CHECK (method IN ('sms', 'email')),
    destination TEXT NOT NULL,
    message_preview TEXT,
    status TEXT NOT NULL CHECK (status IN ('sent', 'failed')),
    provider_response TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_message_logs_plan_id ON public.message_logs(plan_id);
CREATE INDEX idx_message_logs_created_at ON public.message_logs(created_at DESC);

ALTER TABLE public.message_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can insert message logs"
    ON public.message_logs
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Anon can insert message logs"
    ON public.message_logs
    FOR INSERT
    TO anon
    WITH CHECK (true);

CREATE POLICY "Authenticated users can read message logs"
    ON public.message_logs
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Anon can read message logs"
    ON public.message_logs
    FOR SELECT
    TO anon
    USING (true);

CREATE TABLE IF NOT EXISTS public.message_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES public.patients(id) ON DELETE SET NULL,
    plan_id UUID NOT NULL REFERENCES public.treatment_plans(id) ON DELETE CASCADE,
    created_by UUID NOT NULL,
    method TEXT NOT NULL CHECK (method IN ('sms', 'email')),
    destination TEXT NOT NULL,
    message_preview TEXT,
    status TEXT NOT NULL CHECK (status IN ('sent', 'failed')),
    provider_response TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_message_logs_plan_id ON public.message_logs(plan_id);
CREATE INDEX idx_message_logs_created_at ON public.message_logs(created_at DESC);
CREATE INDEX idx_message_logs_created_by ON public.message_logs(created_by);

ALTER TABLE public.message_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own message logs"
    ON public.message_logs
    FOR INSERT
    TO authenticated
    WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can read their own message logs"
    ON public.message_logs
    FOR SELECT
    TO authenticated
    USING (created_by = auth.uid());

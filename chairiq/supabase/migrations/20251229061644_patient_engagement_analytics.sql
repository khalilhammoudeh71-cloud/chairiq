-- Location: supabase/migrations/20251229061644_patient_engagement_analytics.sql
-- Schema Analysis: Existing tables - patients, treatment_plans, plan_procedures
-- Integration Type: Extension - Adding analytics tracking tables
-- Dependencies: patients, treatment_plans, plan_procedures

-- ========================================
-- 1. TYPES
-- ========================================

CREATE TYPE public.engagement_event_type AS ENUM (
    'plan_view',
    'procedure_view',
    'section_view',
    'page_exit',
    'language_change',
    'procedure_completion'
);

-- ========================================
-- 2. CORE ANALYTICS TABLES
-- ========================================

-- Track individual patient engagement events
CREATE TABLE public.patient_engagement_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    treatment_plan_id UUID REFERENCES public.treatment_plans(id) ON DELETE CASCADE,
    procedure_id UUID REFERENCES public.plan_procedures(id) ON DELETE SET NULL,
    event_type public.engagement_event_type NOT NULL,
    event_data JSONB DEFAULT '{}'::jsonb,
    session_id TEXT NOT NULL,
    page_url TEXT,
    time_spent_seconds INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Track language preferences and changes
CREATE TABLE public.patient_language_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    treatment_plan_id UUID REFERENCES public.treatment_plans(id) ON DELETE CASCADE,
    language_code TEXT NOT NULL,
    changed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    session_id TEXT NOT NULL
);

-- Track procedure completion status
CREATE TABLE public.procedure_completion_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    procedure_id UUID REFERENCES public.plan_procedures(id) ON DELETE CASCADE,
    treatment_plan_id UUID REFERENCES public.treatment_plans(id) ON DELETE CASCADE,
    viewed_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    time_spent_seconds INTEGER DEFAULT 0,
    completion_percentage INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Aggregated session analytics
CREATE TABLE public.patient_session_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    treatment_plan_id UUID REFERENCES public.treatment_plans(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL UNIQUE,
    session_start TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    session_end TIMESTAMPTZ,
    total_time_seconds INTEGER DEFAULT 0,
    pages_viewed INTEGER DEFAULT 0,
    procedures_viewed INTEGER DEFAULT 0,
    dropout_point TEXT,
    device_type TEXT,
    browser_info TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- 3. INDEXES
-- ========================================

CREATE INDEX idx_engagement_events_patient_id ON public.patient_engagement_events(patient_id);
CREATE INDEX idx_engagement_events_treatment_plan_id ON public.patient_engagement_events(treatment_plan_id);
CREATE INDEX idx_engagement_events_event_type ON public.patient_engagement_events(event_type);
CREATE INDEX idx_engagement_events_created_at ON public.patient_engagement_events(created_at);

CREATE INDEX idx_language_prefs_patient_id ON public.patient_language_preferences(patient_id);
CREATE INDEX idx_language_prefs_treatment_plan_id ON public.patient_language_preferences(treatment_plan_id);

CREATE INDEX idx_completion_tracking_patient_id ON public.procedure_completion_tracking(patient_id);
CREATE INDEX idx_completion_tracking_procedure_id ON public.procedure_completion_tracking(procedure_id);
CREATE INDEX idx_completion_tracking_treatment_plan_id ON public.procedure_completion_tracking(treatment_plan_id);

CREATE INDEX idx_session_analytics_patient_id ON public.patient_session_analytics(patient_id);
CREATE INDEX idx_session_analytics_treatment_plan_id ON public.patient_session_analytics(treatment_plan_id);
CREATE INDEX idx_session_analytics_session_id ON public.patient_session_analytics(session_id);

-- ========================================
-- 4. FUNCTIONS
-- ========================================

-- Function to calculate engagement metrics
CREATE OR REPLACE FUNCTION public.get_patient_engagement_metrics(plan_id UUID)
RETURNS TABLE(
    total_views INTEGER,
    unique_patients INTEGER,
    avg_time_spent INTEGER,
    completion_rate NUMERIC,
    language_distribution JSONB,
    dropout_points JSONB
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(DISTINCT pee.id)::INTEGER AS total_views,
        COUNT(DISTINCT pee.patient_id)::INTEGER AS unique_patients,
        COALESCE(AVG(psa.total_time_seconds)::INTEGER, 0) AS avg_time_spent,
        COALESCE(
            (COUNT(DISTINCT CASE WHEN pct.completed_at IS NOT NULL THEN pct.patient_id END)::NUMERIC / 
             NULLIF(COUNT(DISTINCT pee.patient_id), 0)) * 100, 
            0
        ) AS completion_rate,
        COALESCE(
            jsonb_object_agg(
                plp.language_code, 
                COUNT(DISTINCT plp.patient_id)
            ) FILTER (WHERE plp.language_code IS NOT NULL),
            '{}'::jsonb
        ) AS language_distribution,
        COALESCE(
            jsonb_object_agg(
                psa.dropout_point, 
                COUNT(*)
            ) FILTER (WHERE psa.dropout_point IS NOT NULL),
            '{}'::jsonb
        ) AS dropout_points
    FROM public.patient_engagement_events pee
    LEFT JOIN public.patient_session_analytics psa ON pee.session_id = psa.session_id
    LEFT JOIN public.patient_language_preferences plp ON pee.patient_id = plp.patient_id
    LEFT JOIN public.procedure_completion_tracking pct ON pee.patient_id = pct.patient_id
    WHERE pee.treatment_plan_id = plan_id;
END;
$$;

-- Function to update session analytics
CREATE OR REPLACE FUNCTION public.update_session_end_time()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.patient_session_analytics
    SET 
        session_end = NEW.created_at,
        total_time_seconds = EXTRACT(EPOCH FROM (NEW.created_at - session_start))::INTEGER,
        pages_viewed = pages_viewed + 1
    WHERE session_id = NEW.session_id;
    
    RETURN NEW;
END;
$$;

-- ========================================
-- 5. ENABLE RLS
-- ========================================

ALTER TABLE public.patient_engagement_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_language_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.procedure_completion_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_session_analytics ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 6. RLS POLICIES (Pattern 4 - Public Read)
-- ========================================

-- Analytics tables need public read for patient tracking, but only public can write
CREATE POLICY "public_can_track_engagement_events"
ON public.patient_engagement_events
FOR ALL
TO public
USING (true)
WITH CHECK (true);

CREATE POLICY "public_can_track_language_preferences"
ON public.patient_language_preferences
FOR ALL
TO public
USING (true)
WITH CHECK (true);

CREATE POLICY "public_can_track_completion"
ON public.procedure_completion_tracking
FOR ALL
TO public
USING (true)
WITH CHECK (true);

CREATE POLICY "public_can_track_sessions"
ON public.patient_session_analytics
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- ========================================
-- 7. TRIGGERS
-- ========================================

CREATE TRIGGER update_session_analytics_trigger
    AFTER INSERT ON public.patient_engagement_events
    FOR EACH ROW
    EXECUTE FUNCTION public.update_session_end_time();

CREATE TRIGGER update_completion_tracking_timestamp
    BEFORE UPDATE ON public.procedure_completion_tracking
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();

-- ========================================
-- 8. MOCK DATA
-- ========================================

DO $$
DECLARE
    patient1_id UUID;
    patient2_id UUID;
    plan1_id UUID;
    plan2_id UUID;
    procedure1_id UUID;
    procedure2_id UUID;
    session1_id TEXT := 'session_' || gen_random_uuid();
    session2_id TEXT := 'session_' || gen_random_uuid();
BEGIN
    -- Get existing patient and plan IDs
    SELECT id INTO patient1_id FROM public.patients LIMIT 1;
    SELECT id INTO patient2_id FROM public.patients OFFSET 1 LIMIT 1;
    SELECT id INTO plan1_id FROM public.treatment_plans WHERE patient_id = patient1_id LIMIT 1;
    SELECT id INTO plan2_id FROM public.treatment_plans WHERE patient_id = patient2_id LIMIT 1;
    SELECT id INTO procedure1_id FROM public.plan_procedures WHERE treatment_plan_id = plan1_id LIMIT 1;
    SELECT id INTO procedure2_id FROM public.plan_procedures WHERE treatment_plan_id = plan2_id LIMIT 1;

    -- Insert session analytics
    INSERT INTO public.patient_session_analytics (
        patient_id, treatment_plan_id, session_id, session_start, session_end,
        total_time_seconds, pages_viewed, procedures_viewed, dropout_point,
        device_type, browser_info
    ) VALUES
        (
            patient1_id, plan1_id, session1_id,
            CURRENT_TIMESTAMP - INTERVAL '2 hours',
            CURRENT_TIMESTAMP - INTERVAL '1 hour',
            3600, 5, 2, 'procedure_details',
            'desktop', 'Chrome 120'
        ),
        (
            patient2_id, plan2_id, session2_id,
            CURRENT_TIMESTAMP - INTERVAL '1 day',
            CURRENT_TIMESTAMP - INTERVAL '1 day' + INTERVAL '30 minutes',
            1800, 3, 1, 'treatment_overview',
            'mobile', 'Safari iOS 17'
        );

    -- Insert engagement events
    INSERT INTO public.patient_engagement_events (
        patient_id, treatment_plan_id, procedure_id, event_type,
        event_data, session_id, page_url, time_spent_seconds
    ) VALUES
        (
            patient1_id, plan1_id, NULL, 'plan_view',
            '{"action": "initial_view"}'::jsonb,
            session1_id, '/p/' || (SELECT public_token FROM public.treatment_plans WHERE id = plan1_id),
            120
        ),
        (
            patient1_id, plan1_id, procedure1_id, 'procedure_view',
            '{"procedure_name": "Root Canal"}'::jsonb,
            session1_id, '/procedure/root-canal',
            300
        ),
        (
            patient2_id, plan2_id, NULL, 'plan_view',
            '{"action": "initial_view"}'::jsonb,
            session2_id, '/p/' || (SELECT public_token FROM public.treatment_plans WHERE id = plan2_id),
            60
        );

    -- Insert language preferences
    INSERT INTO public.patient_language_preferences (
        patient_id, treatment_plan_id, language_code, session_id
    ) VALUES
        (patient1_id, plan1_id, 'ES', session1_id),
        (patient2_id, plan2_id, 'EN', session2_id);

    -- Insert completion tracking
    INSERT INTO public.procedure_completion_tracking (
        patient_id, procedure_id, treatment_plan_id,
        viewed_at, completed_at, time_spent_seconds, completion_percentage
    ) VALUES
        (
            patient1_id, procedure1_id, plan1_id,
            CURRENT_TIMESTAMP - INTERVAL '2 hours',
            CURRENT_TIMESTAMP - INTERVAL '1 hour',
            300, 100
        ),
        (
            patient2_id, procedure2_id, plan2_id,
            CURRENT_TIMESTAMP - INTERVAL '1 day',
            NULL,
            150, 50
        );
END $$;
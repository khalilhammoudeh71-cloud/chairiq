-- Location: supabase/migrations/20251229232500_ai_batch_processing.sql
-- Schema Analysis: Building upon existing procedure_library and user_profiles tables
-- Integration Type: Addition - New batch processing system for AI content generation
-- Dependencies: procedure_library, user_profiles

-- 1. Create custom types for batch processing
CREATE TYPE public.batch_job_status AS ENUM ('pending', 'in_progress', 'completed', 'failed', 'cancelled');
CREATE TYPE public.batch_priority AS ENUM ('low', 'normal', 'high', 'urgent');
CREATE TYPE public.content_type AS ENUM ('description', 'risks', 'aftercare', 'faqs', 'all');

-- 2. Create batch_jobs table
CREATE TABLE public.batch_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    status public.batch_job_status DEFAULT 'pending'::public.batch_job_status,
    priority public.batch_priority DEFAULT 'normal'::public.batch_priority,
    total_items INTEGER NOT NULL DEFAULT 0,
    completed_items INTEGER DEFAULT 0,
    failed_items INTEGER DEFAULT 0,
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    scheduled_at TIMESTAMPTZ,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    error_message TEXT,
    configuration JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create batch_job_items table
CREATE TABLE public.batch_job_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_job_id UUID REFERENCES public.batch_jobs(id) ON DELETE CASCADE,
    procedure_id UUID REFERENCES public.procedure_library(id) ON DELETE CASCADE,
    content_types public.content_type[] NOT NULL,
    language TEXT NOT NULL DEFAULT 'en',
    clinical_specs TEXT,
    tone TEXT DEFAULT 'professional',
    complexity TEXT DEFAULT 'detailed',
    target_audience TEXT DEFAULT 'general',
    status public.batch_job_status DEFAULT 'pending'::public.batch_job_status,
    generated_content JSONB DEFAULT '{}'::jsonb,
    error_message TEXT,
    processing_started_at TIMESTAMPTZ,
    processing_completed_at TIMESTAMPTZ,
    processing_duration_seconds INTEGER,
    retry_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create batch_job_logs table for detailed tracking
CREATE TABLE public.batch_job_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_job_id UUID REFERENCES public.batch_jobs(id) ON DELETE CASCADE,
    batch_job_item_id UUID REFERENCES public.batch_job_items(id) ON DELETE CASCADE,
    log_level TEXT NOT NULL,
    message TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Create indexes for performance
CREATE INDEX idx_batch_jobs_created_by ON public.batch_jobs(created_by);
CREATE INDEX idx_batch_jobs_status ON public.batch_jobs(status);
CREATE INDEX idx_batch_jobs_scheduled_at ON public.batch_jobs(scheduled_at);
CREATE INDEX idx_batch_jobs_priority ON public.batch_jobs(priority);

CREATE INDEX idx_batch_job_items_batch_job_id ON public.batch_job_items(batch_job_id);
CREATE INDEX idx_batch_job_items_procedure_id ON public.batch_job_items(procedure_id);
CREATE INDEX idx_batch_job_items_status ON public.batch_job_items(status);

CREATE INDEX idx_batch_job_logs_batch_job_id ON public.batch_job_logs(batch_job_id);
CREATE INDEX idx_batch_job_logs_batch_job_item_id ON public.batch_job_logs(batch_job_item_id);

-- 6. Create function to update job progress
CREATE OR REPLACE FUNCTION public.update_batch_job_progress()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $func$
BEGIN
    UPDATE public.batch_jobs
    SET 
        completed_items = (
            SELECT COUNT(*) 
            FROM public.batch_job_items 
            WHERE batch_job_id = NEW.batch_job_id 
            AND status = 'completed'
        ),
        failed_items = (
            SELECT COUNT(*) 
            FROM public.batch_job_items 
            WHERE batch_job_id = NEW.batch_job_id 
            AND status = 'failed'
        ),
        progress_percentage = (
            SELECT ROUND(
                (COUNT(*) FILTER (WHERE status IN ('completed', 'failed'))::DECIMAL / NULLIF(COUNT(*), 0)) * 100, 
                2
            )
            FROM public.batch_job_items 
            WHERE batch_job_id = NEW.batch_job_id
        ),
        status = CASE
            WHEN (
                SELECT COUNT(*) 
                FROM public.batch_job_items 
                WHERE batch_job_id = NEW.batch_job_id 
                AND status IN ('completed', 'failed')
            ) = (
                SELECT COUNT(*) 
                FROM public.batch_job_items 
                WHERE batch_job_id = NEW.batch_job_id
            ) THEN 'completed'::public.batch_job_status
            WHEN (
                SELECT COUNT(*) 
                FROM public.batch_job_items 
                WHERE batch_job_id = NEW.batch_job_id 
                AND status = 'in_progress'
            ) > 0 THEN 'in_progress'::public.batch_job_status
            ELSE status
        END,
        completed_at = CASE
            WHEN (
                SELECT COUNT(*) 
                FROM public.batch_job_items 
                WHERE batch_job_id = NEW.batch_job_id 
                AND status IN ('completed', 'failed')
            ) = (
                SELECT COUNT(*) 
                FROM public.batch_job_items 
                WHERE batch_job_id = NEW.batch_job_id
            ) THEN CURRENT_TIMESTAMP
            ELSE completed_at
        END,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.batch_job_id;
    
    RETURN NEW;
END;
$func$;

-- 7. Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_batch_tables_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $func$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$func$;

-- 8. Enable RLS on all batch processing tables
ALTER TABLE public.batch_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.batch_job_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.batch_job_logs ENABLE ROW LEVEL SECURITY;

-- 9. Create RLS policies
CREATE POLICY "users_manage_own_batch_jobs"
ON public.batch_jobs
FOR ALL
TO authenticated
USING (created_by = auth.uid())
WITH CHECK (created_by = auth.uid());

CREATE POLICY "users_access_own_batch_job_items"
ON public.batch_job_items
FOR ALL
TO authenticated
USING (
    batch_job_id IN (
        SELECT id FROM public.batch_jobs WHERE created_by = auth.uid()
    )
)
WITH CHECK (
    batch_job_id IN (
        SELECT id FROM public.batch_jobs WHERE created_by = auth.uid()
    )
);

CREATE POLICY "users_access_own_batch_job_logs"
ON public.batch_job_logs
FOR ALL
TO authenticated
USING (
    batch_job_id IN (
        SELECT id FROM public.batch_jobs WHERE created_by = auth.uid()
    )
)
WITH CHECK (
    batch_job_id IN (
        SELECT id FROM public.batch_jobs WHERE created_by = auth.uid()
    )
);

-- 10. Create triggers
CREATE TRIGGER update_batch_job_progress_trigger
AFTER UPDATE ON public.batch_job_items
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM NEW.status)
EXECUTE FUNCTION public.update_batch_job_progress();

CREATE TRIGGER update_batch_jobs_timestamp
BEFORE UPDATE ON public.batch_jobs
FOR EACH ROW
EXECUTE FUNCTION public.update_batch_tables_updated_at();

CREATE TRIGGER update_batch_job_items_timestamp
BEFORE UPDATE ON public.batch_job_items
FOR EACH ROW
EXECUTE FUNCTION public.update_batch_tables_updated_at();

-- 11. Create helper function to get next scheduled job
CREATE OR REPLACE FUNCTION public.get_next_scheduled_batch_job()
RETURNS TABLE(
    job_id UUID,
    job_name TEXT,
    total_items INTEGER,
    priority public.batch_priority,
    scheduled_at TIMESTAMPTZ
)
LANGUAGE sql
SECURITY DEFINER
AS $func$
    SELECT 
        bj.id,
        bj.name,
        bj.total_items,
        bj.priority,
        bj.scheduled_at
    FROM public.batch_jobs bj
    WHERE bj.status = 'pending'
    AND (bj.scheduled_at IS NULL OR bj.scheduled_at <= CURRENT_TIMESTAMP)
    ORDER BY 
        CASE bj.priority
            WHEN 'urgent' THEN 1
            WHEN 'high' THEN 2
            WHEN 'normal' THEN 3
            WHEN 'low' THEN 4
        END,
        bj.scheduled_at NULLS FIRST,
        bj.created_at
    LIMIT 1;
$func$;

-- 12. Create function to cancel batch job
CREATE OR REPLACE FUNCTION public.cancel_batch_job(job_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $func$
BEGIN
    UPDATE public.batch_jobs
    SET 
        status = 'cancelled'::public.batch_job_status,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = job_id
    AND created_by = auth.uid()
    AND status IN ('pending', 'in_progress');
    
    UPDATE public.batch_job_items
    SET 
        status = 'cancelled'::public.batch_job_status,
        updated_at = CURRENT_TIMESTAMP
    WHERE batch_job_id = job_id
    AND status IN ('pending', 'in_progress');
    
    RETURN FOUND;
END;
$func$;

-- 13. Add comments for documentation
COMMENT ON TABLE public.batch_jobs IS 'Stores batch content generation jobs with scheduling and progress tracking';
COMMENT ON TABLE public.batch_job_items IS 'Individual procedure items within a batch job';
COMMENT ON TABLE public.batch_job_logs IS 'Detailed logs for batch job execution';
COMMENT ON COLUMN public.batch_jobs.configuration IS 'JSON configuration for the batch job including generation parameters';
COMMENT ON COLUMN public.batch_job_items.content_types IS 'Array of content types to generate (description, risks, aftercare, faqs, all)';
COMMENT ON COLUMN public.batch_job_items.generated_content IS 'JSON object containing generated content for each content type';
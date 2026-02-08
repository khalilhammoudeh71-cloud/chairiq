-- Location: supabase/migrations/20260101030100_add_canonical_slug_unique_constraint.sql
-- Schema Analysis: procedure_library table exists with slug UNIQUE but canonical_slug is not unique
-- Integration Type: MODIFICATIVE - Adding UNIQUE constraint to existing column
-- Dependencies: procedure_library table

-- Migration: Add UNIQUE constraint to canonical_slug column
-- This enables upsert operations using ON CONFLICT(canonical_slug)

-- Step 1: Add UNIQUE constraint to canonical_slug
ALTER TABLE public.procedure_library
ADD CONSTRAINT procedure_library_canonical_slug_key UNIQUE (canonical_slug);

-- Step 2: Add index for performance (if not already created by constraint)
-- The UNIQUE constraint automatically creates an index, but we'll ensure it's there
CREATE INDEX IF NOT EXISTS idx_procedure_library_canonical_slug_unique 
ON public.procedure_library(canonical_slug);

-- Note: This migration enables the upsert logic in procedureEducationGeneratorService.js
-- which uses: .upsert(procedureData, { onConflict: 'canonical_slug', ignoreDuplicates: false })
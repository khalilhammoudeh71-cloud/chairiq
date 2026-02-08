-- Migration: Add support for ada_codes array in procedure_library
-- Purpose: Store multiple ADA codes associated with a single procedure
-- Date: 2025-12-30

-- Check if ada_codes column exists, if not add it
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'procedure_library' 
    AND column_name = 'ada_codes'
  ) THEN
    ALTER TABLE procedure_library 
    ADD COLUMN ada_codes text[] DEFAULT '{}';
    
    -- Add index for faster lookups
    CREATE INDEX IF NOT EXISTS idx_procedure_library_ada_codes 
    ON procedure_library USING GIN (ada_codes);
    
    RAISE NOTICE 'Added ada_codes column and GIN index to procedure_library';
  ELSE
    RAISE NOTICE 'ada_codes column already exists in procedure_library';
  END IF;
END $$;

-- Add comment for documentation
COMMENT ON COLUMN procedure_library.ada_codes IS 'Array of ADA codes associated with this procedure (e.g., {D2740, D2750} for crowns)';
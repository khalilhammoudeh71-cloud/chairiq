-- Migration: Seed procedure_visuals for crown and root-canal procedures
-- Purpose: Add visual image URLs for dental crown and root canal treatment to fix "Visual coming soon" issue
-- Date: 2025-12-30

-- ============================================================================
-- SEED PROCEDURE VISUALS FOR CROWN AND ROOT CANAL
-- ============================================================================

-- Insert visuals for "crown" (canonical_slug = "crown")
-- Using existing images from public/assets/images directory
INSERT INTO procedure_visuals (
  canonical_slug,
  step_key,
  image_url,
  alt_text_en,
  alt_text_es,
  sort_order
) VALUES
  -- Hero image for crown
  (
    'crown',
    'hero',
    '/assets/images/crown-5-crown-placement.png-1766118464418.PNG',
    'Dental crown being placed on prepared tooth',
    'Corona dental siendo colocada en diente preparado',
    0
  ),
  -- Step 1: Crown preparation
  (
    'crown',
    'step_1',
    '/assets/images/25A0FFC5-8659-43A7-8EF9-AD803D48B187-1766118077465.png',
    'Dentist preparing tooth for crown placement',
    'Dentista preparando diente para colocación de corona',
    1
  ),
  -- Step 2: Impression taking
  (
    'crown',
    'step_2',
    '/assets/images/tmpyb2dx7tw-1766118360426.jpg',
    'Taking dental impression for crown fabrication',
    'Tomando impresión dental para fabricación de corona',
    2
  ),
  -- Step 3: Temporary crown
  (
    'crown',
    'step_3',
    '/assets/images/tmpaq8pv306-1766118280819.jpg',
    'Temporary crown placed while permanent crown is being made',
    'Corona temporal colocada mientras se fabrica la corona permanente',
    3
  ),
  -- Step 4: Lab fabrication
  (
    'crown',
    'step_4',
    '/assets/images/crown-4-lab-fabrication.png-1766118384254.PNG',
    'Dental laboratory fabricating permanent crown',
    'Laboratorio dental fabricando corona permanente',
    4
  ),
  -- Step 5: Final crown placement
  (
    'crown',
    'step_5',
    '/assets/images/crown-5-crown-placement.png-1766118464418.PNG',
    'Final permanent crown being cemented in place',
    'Corona permanente final siendo cementada en su lugar',
    5
  )
ON CONFLICT DO NOTHING;

-- Insert visuals for "root-canal" (canonical_slug = "root-canal")
-- Using existing images from public/assets/images directory
INSERT INTO procedure_visuals (
  canonical_slug,
  step_key,
  image_url,
  alt_text_en,
  alt_text_es,
  sort_order
) VALUES
  -- Hero image for root canal
  (
    'root-canal',
    'hero',
    '/assets/images/root-canal-hero.png-1765907232834.PNG',
    'Root canal treatment illustration showing tooth anatomy',
    'Ilustración de tratamiento de conducto mostrando anatomía del diente',
    0
  ),
  -- Step 1: Access opening
  (
    'root-canal',
    'step_1',
    '/assets/images/root-canal-1-access-opening.png-1765907492802.PNG',
    'Dentist creating access opening to reach infected pulp',
    'Dentista creando abertura de acceso para alcanzar pulpa infectada',
    1
  ),
  -- Step 2: Canal cleaning
  (
    'root-canal',
    'step_2',
    '/assets/images/root-canal-2-canal-cleaning.png-1765907556946.PNG',
    'Cleaning and shaping root canals with specialized instruments',
    'Limpiando y dando forma a conductos radiculares con instrumentos especializados',
    2
  ),
  -- Step 3: Canal filling (obturation)
  (
    'root-canal',
    'step_3',
    '/assets/images/root-canal-3-canal-obturation.png-1765907638967.PNG',
    'Filling cleaned root canals with gutta-percha material',
    'Llenando conductos radiculares limpios con material de gutapercha',
    3
  )
ON CONFLICT DO NOTHING;

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Log completion
DO $$
BEGIN
  RAISE NOTICE 'Procedure visuals seeded successfully for crown and root-canal';
  RAISE NOTICE 'Crown visuals: 6 images (1 hero + 5 steps)';
  RAISE NOTICE 'Root canal visuals: 4 images (1 hero + 3 steps)';
  RAISE NOTICE 'All image URLs use existing files from /assets/images/ directory';
END $$;
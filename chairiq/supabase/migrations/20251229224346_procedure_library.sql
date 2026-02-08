-- Location: supabase/migrations/20251229224346_procedure_library.sql
-- Schema Analysis: Building on existing patient education system
-- Integration Type: New Module - Structured procedure content management
-- Dependencies: Existing user_profiles for created_by tracking

-- Create procedure_library table with multilingual structured content
CREATE TABLE public.procedure_library (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    
    -- Multilingual titles and summaries
    title_en TEXT NOT NULL,
    title_es TEXT NOT NULL,
    summary_en TEXT,
    summary_es TEXT,
    
    -- Why sections (markdown allowed)
    why_en TEXT,
    why_es TEXT,
    
    -- What if not sections (markdown allowed)
    what_if_not_en TEXT,
    what_if_not_es TEXT,
    
    -- Steps (JSON array of step objects)
    steps_en JSONB DEFAULT '[]'::JSONB,
    steps_es JSONB DEFAULT '[]'::JSONB,
    
    -- Anesthesia information
    anesthesia_en TEXT,
    anesthesia_es TEXT,
    
    -- Risks information
    risks_en TEXT,
    risks_es TEXT,
    
    -- Aftercare instructions
    aftercare_en TEXT,
    aftercare_es TEXT,
    
    -- FAQs (JSON array of Q&A objects)
    faqs_en JSONB DEFAULT '[]'::JSONB,
    faqs_es JSONB DEFAULT '[]'::JSONB,
    
    -- Time and visit estimates
    time_estimate TEXT,
    visits_estimate TEXT,
    
    -- Visuals (JSON object with hero and step image keys)
    visuals JSONB DEFAULT '{}'::JSONB,
    
    -- Metadata
    category TEXT,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL
);

-- Create indexes for performance
CREATE INDEX idx_procedure_library_slug ON public.procedure_library(slug);
CREATE INDEX idx_procedure_library_category ON public.procedure_library(category);
CREATE INDEX idx_procedure_library_published ON public.procedure_library(is_published);
CREATE INDEX idx_procedure_library_created_by ON public.procedure_library(created_by);

-- Enable RLS
ALTER TABLE public.procedure_library ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Public read access for published procedures
CREATE POLICY "public_can_read_published_procedures"
ON public.procedure_library
FOR SELECT
TO public
USING (is_published = true);

-- RLS Policy: Authenticated users can manage procedures
CREATE POLICY "authenticated_users_manage_procedures"
ON public.procedure_library
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_procedure_library_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER set_procedure_library_updated_at
BEFORE UPDATE ON public.procedure_library
FOR EACH ROW
EXECUTE FUNCTION public.update_procedure_library_updated_at();

-- Sample data for common dental procedures
DO $$
DECLARE
    dentist_id UUID;
BEGIN
    -- Get first dentist user or use system default
    SELECT id INTO dentist_id 
    FROM public.user_profiles 
    WHERE role = 'dentist' 
    LIMIT 1;

    INSERT INTO public.procedure_library (
        slug, title_en, title_es, summary_en, summary_es, 
        why_en, why_es, what_if_not_en, what_if_not_es,
        steps_en, steps_es,
        anesthesia_en, anesthesia_es,
        risks_en, risks_es,
        aftercare_en, aftercare_es,
        faqs_en, faqs_es,
        time_estimate, visits_estimate, visuals, category, created_by
    ) VALUES
    (
        'dental-crown',
        'Dental Crown',
        'Corona Dental',
        'A dental crown is a tooth-shaped cap that is placed over a damaged tooth to restore its shape, size, strength, and appearance.',
        'Una corona dental es una tapa en forma de diente que se coloca sobre un diente dañado para restaurar su forma, tamaño, resistencia y apariencia.',
        '### Why You Need a Crown

A crown protects and strengthens a tooth that cannot be restored with fillings or other types of restorations. It covers the entire visible portion of the tooth above the gum line.

**Common Reasons:**
- Large cavities that are too big for fillings
- Cracked or broken teeth
- After root canal treatment
- To hold a dental bridge in place
- To improve appearance of discolored or misshapen teeth',
        '### Por Qué Necesita Una Corona

Una corona protege y fortalece un diente que no puede restaurarse con empastes u otros tipos de restauraciones. Cubre toda la porción visible del diente por encima de la línea de las encías.

**Razones Comunes:**
- Caries grandes que son demasiado grandes para empastes
- Dientes agrietados o rotos
- Después del tratamiento de conducto
- Para sostener un puente dental en su lugar
- Para mejorar la apariencia de dientes descoloridos o deformados',
        'Without treatment, the tooth may become more damaged and require extraction. This can lead to shifting teeth, bite problems, and the need for more extensive dental work.',
        'Sin tratamiento, el diente puede dañarse más y requerir extracción. Esto puede provocar el desplazamiento de los dientes, problemas de mordida y la necesidad de un trabajo dental más extenso.',
        '[
            {
                "stepTitle": "Tooth Preparation",
                "stepBody": "The tooth is carefully shaped to create space for the crown. Any decay is removed and the tooth is built up if needed.",
                "imageKey": "crown-prep"
            },
            {
                "stepTitle": "Impression Taking",
                "stepBody": "We take detailed impressions of your prepared tooth and surrounding teeth to ensure a perfect fit.",
                "imageKey": "crown-impression"
            },
            {
                "stepTitle": "Temporary Crown",
                "stepBody": "A temporary crown is placed to protect your tooth while the permanent crown is being made.",
                "imageKey": "crown-temp"
            },
            {
                "stepTitle": "Crown Fabrication",
                "stepBody": "Your custom crown is created in a dental laboratory to match your natural teeth perfectly.",
                "imageKey": "crown-fabrication"
            },
            {
                "stepTitle": "Final Placement",
                "stepBody": "The permanent crown is carefully fitted and cemented in place for a secure, long-lasting restoration.",
                "imageKey": "crown-placement"
            }
        ]'::JSONB,
        '[
            {
                "stepTitle": "Preparación del Diente",
                "stepBody": "El diente se moldea cuidadosamente para crear espacio para la corona. Se elimina cualquier caries y se construye el diente si es necesario.",
                "imageKey": "crown-prep"
            },
            {
                "stepTitle": "Toma de Impresiones",
                "stepBody": "Tomamos impresiones detalladas de su diente preparado y los dientes circundantes para asegurar un ajuste perfecto.",
                "imageKey": "crown-impression"
            },
            {
                "stepTitle": "Corona Temporal",
                "stepBody": "Se coloca una corona temporal para proteger su diente mientras se hace la corona permanente.",
                "imageKey": "crown-temp"
            },
            {
                "stepTitle": "Fabricación de la Corona",
                "stepBody": "Su corona personalizada se crea en un laboratorio dental para que coincida perfectamente con sus dientes naturales.",
                "imageKey": "crown-fabrication"
            },
            {
                "stepTitle": "Colocación Final",
                "stepBody": "La corona permanente se ajusta cuidadosamente y se cementa en su lugar para una restauración segura y duradera.",
                "imageKey": "crown-placement"
            }
        ]'::JSONB,
        'Local anesthesia is used to numb the area around the tooth. You will feel pressure during tooth preparation but should not feel pain.',
        'Se usa anestesia local para adormecer el área alrededor del diente. Sentirá presión durante la preparación del diente pero no debe sentir dolor.',
        '**Minimal risks include:**
- Temporary sensitivity to hot or cold
- Slight discomfort after anesthesia wears off
- Rare allergic reactions to materials
- Crown may need adjustment if bite feels off',
        '**Los riesgos mínimos incluyen:**
- Sensibilidad temporal al calor o frío
- Ligera incomodidad después de que desaparezca la anestesia
- Reacciones alérgicas raras a los materiales
- La corona puede necesitar ajustes si la mordida se siente incorrecta',
        '### Aftercare Instructions

**First 24 Hours:**
- Avoid sticky or hard foods
- Eat on the opposite side if possible
- Take pain medication as prescribed

**Long-term Care:**
- Brush twice daily with soft-bristle brush
- Floss daily around the crown
- Avoid chewing ice or hard objects
- Visit dentist for regular checkups',
        '### Instrucciones de Cuidado Posterior

**Primeras 24 Horas:**
- Evite alimentos pegajosos o duros
- Coma del lado opuesto si es posible
- Tome medicamentos para el dolor según lo prescrito

**Cuidado a Largo Plazo:**
- Cepille dos veces al día con cepillo de cerdas suaves
- Use hilo dental diariamente alrededor de la corona
- Evite masticar hielo u objetos duros
- Visite al dentista para chequeos regulares',
        '[
            {
                "q": "How long will my crown last?",
                "a": "With proper care, crowns typically last 10-15 years or longer. Regular dental checkups help ensure longevity."
            },
            {
                "q": "Will my crown look natural?",
                "a": "Yes! Modern crowns are made from materials that closely match the color and translucency of natural teeth."
            },
            {
                "q": "Is the procedure painful?",
                "a": "No, the area is numbed with local anesthesia. You may feel pressure but not pain during the procedure."
            }
        ]'::JSONB,
        '[
            {
                "q": "¿Cuánto tiempo durará mi corona?",
                "a": "Con el cuidado adecuado, las coronas suelen durar de 10 a 15 años o más. Los chequeos dentales regulares ayudan a garantizar la longevidad."
            },
            {
                "q": "¿Mi corona se verá natural?",
                "a": "¡Sí! Las coronas modernas están hechas de materiales que se asemejan mucho al color y la translucidez de los dientes naturales."
            },
            {
                "q": "¿El procedimiento es doloroso?",
                "a": "No, el área se adormece con anestesia local. Puede sentir presión pero no dolor durante el procedimiento."
            }
        ]'::JSONB,
        '1-2 hours per visit',
        '2 visits',
        '{"heroKey": "crown-hero", "stepKeys": ["crown-prep", "crown-impression", "crown-temp", "crown-fabrication", "crown-placement"]}'::JSONB,
        'restorative',
        dentist_id
    ),
    (
        'root-canal',
        'Root Canal Treatment',
        'Tratamiento de Conducto',
        'A root canal is a treatment to repair and save a badly damaged or infected tooth. The procedure involves removing the damaged pulp, cleaning, and sealing the tooth.',
        'Un conducto radicular es un tratamiento para reparar y salvar un diente muy dañado o infectado. El procedimiento implica eliminar la pulpa dañada, limpiar y sellar el diente.',
        '### Why You Need a Root Canal

Root canal treatment is necessary when the pulp (soft tissue inside the tooth) becomes inflamed or infected. This can happen due to deep decay, repeated dental procedures, or trauma.

**Signs You May Need Treatment:**
- Severe toothache when chewing or applying pressure
- Prolonged sensitivity to hot or cold
- Darkening of the tooth
- Swelling and tenderness in nearby gums
- Persistent or recurring pimple on the gums',
        '### Por Qué Necesita un Conducto

El tratamiento de conducto es necesario cuando la pulpa (tejido blando dentro del diente) se inflama o se infecta. Esto puede ocurrir debido a caries profundas, procedimientos dentales repetidos o trauma.

**Señales de que Puede Necesitar Tratamiento:**
- Dolor de muelas severo al masticar o aplicar presión
- Sensibilidad prolongada al calor o frío
- Oscurecimiento del diente
- Hinchazón y sensibilidad en las encías cercanas
- Grano persistente o recurrente en las encías',
        'Without treatment, the infection can spread and lead to an abscess, severe pain, and eventual tooth loss. The infection can also affect your overall health.',
        'Sin tratamiento, la infección puede propagarse y provocar un absceso, dolor severo y eventual pérdida del diente. La infección también puede afectar su salud general.',
        '[
            {
                "stepTitle": "Access Opening",
                "stepBody": "A small opening is made in the crown of the tooth to access the infected pulp chamber.",
                "imageKey": "rootcanal-access"
            },
            {
                "stepTitle": "Pulp Removal",
                "stepBody": "The infected or damaged pulp is carefully removed from the pulp chamber and root canals.",
                "imageKey": "rootcanal-removal"
            },
            {
                "stepTitle": "Cleaning & Shaping",
                "stepBody": "The canals are thoroughly cleaned, disinfected, and shaped to prepare for filling.",
                "imageKey": "rootcanal-cleaning"
            },
            {
                "stepTitle": "Filling",
                "stepBody": "The cleaned canals are filled with a biocompatible material called gutta-percha and sealed.",
                "imageKey": "rootcanal-filling"
            },
            {
                "stepTitle": "Restoration",
                "stepBody": "A crown or filling is placed to protect and restore the tooth to full function.",
                "imageKey": "rootcanal-crown"
            }
        ]'::JSONB,
        '[
            {
                "stepTitle": "Apertura de Acceso",
                "stepBody": "Se hace una pequeña abertura en la corona del diente para acceder a la cámara pulpar infectada.",
                "imageKey": "rootcanal-access"
            },
            {
                "stepTitle": "Eliminación de Pulpa",
                "stepBody": "La pulpa infectada o dañada se elimina cuidadosamente de la cámara pulpar y los conductos radiculares.",
                "imageKey": "rootcanal-removal"
            },
            {
                "stepTitle": "Limpieza y Modelado",
                "stepBody": "Los conductos se limpian, desinfectan y dan forma minuciosamente para preparar el relleno.",
                "imageKey": "rootcanal-cleaning"
            },
            {
                "stepTitle": "Relleno",
                "stepBody": "Los conductos limpios se rellenan con un material biocompatible llamado gutapercha y se sellan.",
                "imageKey": "rootcanal-filling"
            },
            {
                "stepTitle": "Restauración",
                "stepBody": "Se coloca una corona o empaste para proteger y restaurar el diente a su función completa.",
                "imageKey": "rootcanal-crown"
            }
        ]'::JSONB,
        'Local anesthesia is used to completely numb the tooth and surrounding area. Modern techniques make root canals no more uncomfortable than getting a filling.',
        'Se usa anestesia local para adormecer completamente el diente y el área circundante. Las técnicas modernas hacen que los conductos radiculares no sean más incómodos que obtener un empaste.',
        '**Common side effects:**
- Mild discomfort for a few days after treatment
- Temporary sensitivity
- Rare cases of infection requiring additional treatment
- Very rare: instrument breakage (can usually be managed)',
        '**Efectos secundarios comunes:**
- Molestia leve durante unos días después del tratamiento
- Sensibilidad temporal
- Casos raros de infección que requieren tratamiento adicional
- Muy raro: rotura de instrumento (generalmente se puede manejar)',
        '### Post-Treatment Care

**First 24-48 Hours:**
- Take prescribed pain medication as directed
- Avoid chewing on the treated tooth
- Eat soft foods
- Continue normal oral hygiene

**Until Permanent Restoration:**
- Avoid sticky or hard foods on treated side
- Be gentle when brushing the area
- Follow up for permanent crown placement',
        '### Cuidado Post-Tratamiento

**Primeras 24-48 Horas:**
- Tome el medicamento para el dolor recetado según las indicaciones
- Evite masticar en el diente tratado
- Coma alimentos blandos
- Continúe con la higiene oral normal

**Hasta la Restauración Permanente:**
- Evite alimentos pegajosos o duros en el lado tratado
- Sea gentil al cepillar el área
- Haga seguimiento para la colocación de corona permanente',
        '[
            {
                "q": "Is a root canal painful?",
                "a": "No, the procedure is performed under anesthesia. Most patients report minimal discomfort, similar to getting a filling."
            },
            {
                "q": "How long does the procedure take?",
                "a": "Most root canals can be completed in one or two appointments, each lasting 60-90 minutes."
            },
            {
                "q": "Will I need a crown after root canal?",
                "a": "In most cases, yes. A crown protects the treated tooth and restores its full function and appearance."
            }
        ]'::JSONB,
        '[
            {
                "q": "¿Es doloroso un conducto radicular?",
                "a": "No, el procedimiento se realiza bajo anestesia. La mayoría de los pacientes reportan molestias mínimas, similares a obtener un empaste."
            },
            {
                "q": "¿Cuánto tiempo toma el procedimiento?",
                "a": "La mayoría de los conductos radiculares se pueden completar en una o dos citas, cada una de 60-90 minutos."
            },
            {
                "q": "¿Necesitaré una corona después del conducto?",
                "a": "En la mayoría de los casos, sí. Una corona protege el diente tratado y restaura su función y apariencia completas."
            }
        ]'::JSONB,
        '60-90 minutes',
        '1-2 visits',
        '{"heroKey": "rootcanal-hero", "stepKeys": ["rootcanal-access", "rootcanal-removal", "rootcanal-cleaning", "rootcanal-filling", "rootcanal-crown"]}'::JSONB,
        'restorative',
        dentist_id
    );

    -- Log completion
    RAISE NOTICE 'Procedure library initialized with sample procedures';
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error initializing procedure library: %', SQLERRM;
END $$;
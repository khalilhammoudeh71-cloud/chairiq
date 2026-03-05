INSERT INTO public.procedure_library (
    slug, title_en, title_es, summary_en, summary_es,
    why_en, why_es, what_if_not_en, what_if_not_es,
    steps_en, steps_es,
    anesthesia_en, anesthesia_es,
    risks_en, risks_es,
    aftercare_en, aftercare_es,
    faqs_en, faqs_es,
    time_estimate, visits_estimate, visuals, category, is_published
) VALUES
(
    'filling',
    'Dental Filling',
    'Empaste Dental',
    'A dental filling restores a tooth damaged by decay back to its normal shape and function. Your dentist removes the decayed portion, cleans the area, and fills the cavity with a tooth-colored composite resin or other filling material.',
    'Un empaste dental restaura un diente dañado por caries a su forma y función normal. Su dentista elimina la porción cariada, limpia el área y rellena la cavidad con una resina compuesta del color del diente u otro material de empaste.',
    '### Why You Need a Dental Filling

Cavities are caused by bacteria that produce acid, which erodes tooth enamel over time. Without treatment, decay spreads deeper into the tooth, potentially reaching the nerve and causing pain or infection.

**Common Reasons:**
- Repair a tooth with a cavity caused by decay
- Restore a cracked or broken tooth
- Replace a worn or damaged existing filling
- Prevent further decay and preserve tooth structure',
    '### Por Qué Necesita un Empaste Dental

Las caries son causadas por bacterias que producen ácido, lo que erosiona el esmalte dental con el tiempo. Sin tratamiento, la caries se extiende más profundamente en el diente, pudiendo llegar al nervio y causar dolor o infección.

**Razones Comunes:**
- Reparar un diente con una cavidad causada por caries
- Restaurar un diente agrietado o roto
- Reemplazar un empaste existente desgastado o dañado
- Prevenir más caries y preservar la estructura dental',
    'If a cavity is left untreated, the decay will continue to grow deeper into the tooth. This can lead to severe toothache, infection, abscess formation, and eventually the need for a root canal or extraction. Early fillings are simpler, faster, and far less costly than advanced treatments.',
    'Si una cavidad no se trata, la caries seguirá creciendo más profundamente en el diente. Esto puede provocar dolor de muelas severo, infección, formación de abscesos y eventualmente la necesidad de un tratamiento de conducto o una extracción. Los empastes tempranos son más simples, rápidos y mucho menos costosos que los tratamientos avanzados.',
    '[
        {
            "stepTitle": "Numbing the Area",
            "stepBody": "Your dentist applies a topical anesthetic to the gum, then administers a local anesthetic injection to completely numb the tooth and surrounding area. You will feel pressure but no pain during the procedure.",
            "imageKey": "filling-numbing"
        },
        {
            "stepTitle": "Decay Removal",
            "stepBody": "Using a dental drill or laser, your dentist carefully removes all decayed tooth material. The cavity is then tested to ensure all decay has been eliminated before proceeding.",
            "imageKey": "filling-decay-removal"
        },
        {
            "stepTitle": "Filling Placement",
            "stepBody": "The cleaned cavity is prepared with a bonding agent, then the tooth-colored composite resin is applied in layers. Each layer is hardened with a special curing light to create a strong, durable restoration.",
            "imageKey": "filling-placement"
        },
        {
            "stepTitle": "Shaping & Polishing",
            "stepBody": "The filling is trimmed and shaped to match the natural contours of your tooth. Your bite is checked and adjusted, then the filling is polished smooth for comfort and a natural appearance.",
            "imageKey": "filling-polishing"
        }
    ]'::JSONB,
    '[
        {
            "stepTitle": "Adormecimiento del Área",
            "stepBody": "Su dentista aplica un anestésico tópico en la encía, luego administra una inyección de anestésico local para adormecer completamente el diente y el área circundante. Sentirá presión pero no dolor durante el procedimiento.",
            "imageKey": "filling-numbing"
        },
        {
            "stepTitle": "Eliminación de la Caries",
            "stepBody": "Usando un taladro dental o láser, su dentista elimina cuidadosamente todo el material dental cariado. Luego se prueba la cavidad para asegurar que toda la caries haya sido eliminada antes de continuar.",
            "imageKey": "filling-decay-removal"
        },
        {
            "stepTitle": "Colocación del Empaste",
            "stepBody": "La cavidad limpia se prepara con un agente adhesivo, luego la resina compuesta del color del diente se aplica en capas. Cada capa se endurece con una luz de curado especial para crear una restauración fuerte y duradera.",
            "imageKey": "filling-placement"
        },
        {
            "stepTitle": "Moldeado y Pulido",
            "stepBody": "El empaste se recorta y moldea para coincidir con los contornos naturales de su diente. Se verifica y ajusta su mordida, luego el empaste se pule hasta quedar suave para mayor comodidad y una apariencia natural.",
            "imageKey": "filling-polishing"
        }
    ]'::JSONB,
    'Local anesthesia is used to numb the tooth and surrounding area. The injection may cause a brief pinch, but you will be completely comfortable during the procedure.',
    'Se usa anestesia local para adormecer el diente y el área circundante. La inyección puede causar un breve pinchazo, pero estará completamente cómodo durante el procedimiento.',
    '**Possible risks include:**
- Temporary tooth sensitivity to hot, cold, or pressure
- Slight soreness in the gum or jaw from the injection
- Very rare: allergic reaction to anesthetic or filling material
- Filling may need replacement after 5-15 years depending on material and wear',
    '**Los posibles riesgos incluyen:**
- Sensibilidad dental temporal al calor, frío o presión
- Ligera molestia en la encía o mandíbula por la inyección
- Muy raro: reacción alérgica al anestésico o material de empaste
- El empaste puede necesitar reemplazo después de 5 a 15 años dependiendo del material y desgaste',
    '### Aftercare Instructions

**First 24 Hours:**
- Avoid chewing on the treated side until numbness wears off
- Eat soft foods and avoid very hot or cold beverages
- Mild sensitivity is normal and should subside within a few days

**Ongoing Care:**
- Brush twice daily with fluoride toothpaste
- Floss daily, including around the filled tooth
- Avoid biting hard objects (ice, pens, hard candy)
- Visit your dentist for regular checkups every 6 months
- Contact your dentist if you experience persistent pain or sensitivity',
    '### Instrucciones de Cuidado Posterior

**Primeras 24 Horas:**
- Evite masticar del lado tratado hasta que desaparezca el adormecimiento
- Coma alimentos blandos y evite bebidas muy calientes o frías
- La sensibilidad leve es normal y debería desaparecer en unos días

**Cuidado Continuo:**
- Cepille dos veces al día con pasta dental con flúor
- Use hilo dental diariamente, incluyendo alrededor del diente empastado
- Evite morder objetos duros (hielo, bolígrafos, caramelos duros)
- Visite a su dentista para chequeos regulares cada 6 meses
- Contacte a su dentista si experimenta dolor o sensibilidad persistente',
    '[
        {
            "q": "How long does a filling take?",
            "a": "A typical filling appointment takes 30-60 minutes. Simple fillings may take as little as 20 minutes, while larger or multiple fillings may take longer."
        },
        {
            "q": "Will the filling match my tooth color?",
            "a": "Yes. Composite resin fillings are carefully shade-matched to blend seamlessly with your natural tooth color. Most people cannot tell where the filling ends and the tooth begins."
        },
        {
            "q": "How long do fillings last?",
            "a": "Composite fillings typically last 5-10 years, while amalgam fillings can last 10-15 years or more. Longevity depends on the size, location, and your oral habits."
        },
        {
            "q": "Does getting a filling hurt?",
            "a": "No. The area is completely numbed with local anesthesia before any work begins. You may feel pressure or vibration but should not feel pain."
        }
    ]'::JSONB,
    '[
        {
            "q": "¿Cuánto tiempo toma un empaste?",
            "a": "Una cita típica de empaste toma de 30 a 60 minutos. Los empastes simples pueden tomar tan solo 20 minutos, mientras que los empastes más grandes o múltiples pueden tomar más tiempo."
        },
        {
            "q": "¿El empaste coincidirá con el color de mi diente?",
            "a": "Sí. Los empastes de resina compuesta se combinan cuidadosamente con el color de su diente natural. La mayoría de las personas no pueden distinguir dónde termina el empaste y dónde comienza el diente."
        },
        {
            "q": "¿Cuánto duran los empastes?",
            "a": "Los empastes de composite generalmente duran de 5 a 10 años, mientras que los empastes de amalgama pueden durar de 10 a 15 años o más. La longevidad depende del tamaño, la ubicación y sus hábitos orales."
        },
        {
            "q": "¿Duele hacerse un empaste?",
            "a": "No. El área se adormece completamente con anestesia local antes de comenzar cualquier trabajo. Puede sentir presión o vibración pero no debe sentir dolor."
        }
    ]'::JSONB,
    '30-60 minutes',
    '1 visit',
    '{"heroKey": "filling-hero", "stepKeys": ["filling-numbing", "filling-decay-removal", "filling-placement", "filling-polishing"]}'::JSONB,
    'restorative',
    true
),
(
    'sedation',
    'Dental Sedation',
    'Sedación Dental',
    'Dental sedation uses medication to help patients relax during dental procedures. Options range from mild sedation (nitrous oxide) to moderate sedation (oral or IV) to help manage anxiety and ensure comfort during treatment.',
    'La sedación dental utiliza medicamentos para ayudar a los pacientes a relajarse durante los procedimientos dentales. Las opciones van desde sedación leve (óxido nitroso) hasta sedación moderada (oral o intravenosa) para ayudar a controlar la ansiedad y garantizar la comodidad durante el tratamiento.',
    '### Why Dental Sedation May Be Recommended

Dental sedation helps patients who experience significant anxiety, have a low pain threshold, or need extensive dental work completed in fewer visits.

**Common Reasons:**
- Severe dental anxiety or phobia
- Need for lengthy or complex procedures
- Strong gag reflex that interferes with treatment
- Difficulty getting numb with local anesthesia alone
- Special needs patients who benefit from additional relaxation
- Multiple procedures being done in a single visit',
    '### Por Qué Se Puede Recomendar la Sedación Dental

La sedación dental ayuda a los pacientes que experimentan ansiedad significativa, tienen un umbral de dolor bajo o necesitan un trabajo dental extenso completado en menos visitas.

**Razones Comunes:**
- Ansiedad o fobia dental severa
- Necesidad de procedimientos largos o complejos
- Reflejo nauseoso fuerte que interfiere con el tratamiento
- Dificultad para adormecerse solo con anestesia local
- Pacientes con necesidades especiales que se benefician de relajación adicional
- Múltiples procedimientos realizados en una sola visita',
    NULL,
    NULL,
    '[
        {
            "stepTitle": "Pre-Sedation Evaluation",
            "stepBody": "Your dentist reviews your medical history, current medications, and allergies to determine the safest sedation option for you. You will receive specific instructions about eating, drinking, and medication adjustments before your appointment.",
            "imageKey": "sedation-evaluation"
        },
        {
            "stepTitle": "Preparation",
            "stepBody": "On the day of your procedure, vital signs are checked (blood pressure, heart rate, oxygen levels). Monitoring equipment is placed to track your safety throughout the appointment. You should arrive with a companion who can drive you home.",
            "imageKey": "sedation-preparation"
        },
        {
            "stepTitle": "Sedation Administration",
            "stepBody": "The chosen sedation method is administered: nitrous oxide is inhaled through a nose mask, oral sedation is taken as a pill 30-60 minutes before the procedure, or IV sedation is delivered through a small needle in your arm. You will feel deeply relaxed but remain responsive.",
            "imageKey": "sedation-administration"
        },
        {
            "stepTitle": "Monitoring & Recovery",
            "stepBody": "Throughout the procedure, your vital signs are continuously monitored. After the dental work is complete, sedation is gradually reversed. For nitrous oxide, effects wear off in minutes. For oral or IV sedation, you will rest in the office until safe to leave with your companion.",
            "imageKey": "sedation-recovery"
        }
    ]'::JSONB,
    '[
        {
            "stepTitle": "Evaluación Pre-Sedación",
            "stepBody": "Su dentista revisa su historial médico, medicamentos actuales y alergias para determinar la opción de sedación más segura para usted. Recibirá instrucciones específicas sobre comer, beber y ajustes de medicamentos antes de su cita.",
            "imageKey": "sedation-evaluation"
        },
        {
            "stepTitle": "Preparación",
            "stepBody": "El día de su procedimiento, se verifican los signos vitales (presión arterial, frecuencia cardíaca, niveles de oxígeno). Se coloca equipo de monitoreo para rastrear su seguridad durante toda la cita. Debe llegar con un acompañante que pueda llevarlo a casa.",
            "imageKey": "sedation-preparation"
        },
        {
            "stepTitle": "Administración de la Sedación",
            "stepBody": "Se administra el método de sedación elegido: el óxido nitroso se inhala a través de una máscara nasal, la sedación oral se toma como una pastilla 30-60 minutos antes del procedimiento, o la sedación IV se administra a través de una pequeña aguja en su brazo. Se sentirá profundamente relajado pero permanecerá receptivo.",
            "imageKey": "sedation-administration"
        },
        {
            "stepTitle": "Monitoreo y Recuperación",
            "stepBody": "Durante todo el procedimiento, sus signos vitales son monitoreados continuamente. Después de que el trabajo dental se completa, la sedación se revierte gradualmente. Para el óxido nitroso, los efectos desaparecen en minutos. Para la sedación oral o IV, descansará en la oficina hasta que sea seguro irse con su acompañante.",
            "imageKey": "sedation-recovery"
        }
    ]'::JSONB,
    'Sedation options include: Nitrous oxide (laughing gas) for mild relaxation, oral sedation pills for moderate relaxation, and IV sedation for deeper sedation. Local anesthesia is still used alongside sedation to numb the treatment area.',
    'Las opciones de sedación incluyen: óxido nitroso (gas de la risa) para relajación leve, pastillas de sedación oral para relajación moderada y sedación IV para sedación más profunda. La anestesia local todavía se usa junto con la sedación para adormecer el área de tratamiento.',
    '**Possible risks include:**
- Drowsiness lasting several hours after the appointment
- Nausea or vomiting (uncommon)
- Headache
- Rare: allergic reaction to sedation medication
- Very rare: respiratory depression (continuously monitored)',
    '**Los posibles riesgos incluyen:**
- Somnolencia que dura varias horas después de la cita
- Náuseas o vómitos (poco común)
- Dolor de cabeza
- Raro: reacción alérgica a la medicación de sedación
- Muy raro: depresión respiratoria (monitoreada continuamente)',
    '### Aftercare Instructions

**After Nitrous Oxide:**
- Effects wear off within 5-10 minutes
- You may drive yourself home
- No special dietary restrictions

**After Oral or IV Sedation:**
- Do NOT drive for 24 hours — a companion must take you home
- Rest at home for the remainder of the day
- Avoid operating heavy machinery or making important decisions for 24 hours
- Eat light, bland foods initially
- Drink plenty of water
- Take prescribed medications as directed
- Call your dentist if you experience prolonged nausea, difficulty breathing, or unusual symptoms',
    '### Instrucciones de Cuidado Posterior

**Después del Óxido Nitroso:**
- Los efectos desaparecen en 5 a 10 minutos
- Puede conducir usted mismo a casa
- Sin restricciones dietéticas especiales

**Después de Sedación Oral o IV:**
- NO conduzca durante 24 horas — un acompañante debe llevarlo a casa
- Descanse en casa por el resto del día
- Evite operar maquinaria pesada o tomar decisiones importantes durante 24 horas
- Coma alimentos ligeros y suaves inicialmente
- Beba abundante agua
- Tome los medicamentos recetados según las indicaciones
- Llame a su dentista si experimenta náuseas prolongadas, dificultad para respirar o síntomas inusuales',
    '[
        {
            "q": "Will I be unconscious during sedation?",
            "a": "With dental sedation (not general anesthesia), you remain conscious and can respond to your dentist. You will feel deeply relaxed and may not remember much of the procedure afterward."
        },
        {
            "q": "Is dental sedation safe?",
            "a": "Yes. Dental sedation is very safe when administered by trained professionals. Your vital signs are monitored throughout the procedure, and sedation levels are carefully controlled."
        },
        {
            "q": "How long do the effects of sedation last?",
            "a": "Nitrous oxide wears off in minutes. Oral sedation effects can last 4-6 hours. IV sedation effects typically last 2-4 hours. Plan to rest for the remainder of the day after oral or IV sedation."
        },
        {
            "q": "Can anyone receive dental sedation?",
            "a": "Most patients are candidates for some form of sedation. Your dentist will review your health history to determine the safest option. Certain medical conditions or medications may affect which type is recommended."
        }
    ]'::JSONB,
    '[
        {
            "q": "¿Estaré inconsciente durante la sedación?",
            "a": "Con la sedación dental (no anestesia general), usted permanece consciente y puede responder a su dentista. Se sentirá profundamente relajado y puede que no recuerde mucho del procedimiento después."
        },
        {
            "q": "¿Es segura la sedación dental?",
            "a": "Sí. La sedación dental es muy segura cuando es administrada por profesionales capacitados. Sus signos vitales son monitoreados durante todo el procedimiento y los niveles de sedación se controlan cuidadosamente."
        },
        {
            "q": "¿Cuánto duran los efectos de la sedación?",
            "a": "El óxido nitroso desaparece en minutos. Los efectos de la sedación oral pueden durar de 4 a 6 horas. Los efectos de la sedación IV generalmente duran de 2 a 4 horas. Planee descansar por el resto del día después de la sedación oral o IV."
        },
        {
            "q": "¿Cualquier persona puede recibir sedación dental?",
            "a": "La mayoría de los pacientes son candidatos para alguna forma de sedación. Su dentista revisará su historial de salud para determinar la opción más segura. Ciertas condiciones médicas o medicamentos pueden afectar qué tipo se recomienda."
        }
    ]'::JSONB,
    'Varies by procedure (sedation adds 30-60 minutes)',
    '1 visit (pre-evaluation may be separate)',
    '{"heroKey": "sedation-hero", "stepKeys": ["sedation-evaluation", "sedation-preparation", "sedation-administration", "sedation-recovery"]}'::JSONB,
    'general',
    true
),
(
    'denture-reline',
    'Denture Reline',
    'Rebase de Dentadura',
    'A denture reline reshapes the underside of a denture to improve its fit against your gums. Over time, the jawbone and gum tissue change shape, causing dentures to become loose. A reline restores a snug, comfortable fit without replacing the entire denture.',
    'Un rebase de dentadura remodela la parte inferior de una dentadura para mejorar su ajuste contra las encías. Con el tiempo, el hueso de la mandíbula y el tejido de las encías cambian de forma, causando que las dentaduras se aflojen. Un rebase restaura un ajuste cómodo y seguro sin reemplazar toda la dentadura.',
    '### Why You Need a Denture Reline

As you wear dentures, the bone and soft tissue beneath them gradually change shape. This natural process causes dentures to become loose, uncomfortable, and less effective at chewing.

**Common Reasons:**
- Dentures have become loose or ill-fitting
- Sore spots or irritation from poorly fitting dentures
- Difficulty chewing or speaking due to denture movement
- Dentures are clicking or shifting when eating
- It has been more than 1-2 years since the last reline',
    '### Por Qué Necesita un Rebase de Dentadura

A medida que usa dentaduras, el hueso y el tejido blando debajo de ellas cambian gradualmente de forma. Este proceso natural causa que las dentaduras se aflojen, sean incómodas y menos efectivas para masticar.

**Razones Comunes:**
- Las dentaduras se han aflojado o no ajustan bien
- Puntos dolorosos o irritación por dentaduras mal ajustadas
- Dificultad para masticar o hablar debido al movimiento de la dentadura
- Las dentaduras hacen clic o se desplazan al comer
- Han pasado más de 1 a 2 años desde el último rebase',
    NULL,
    NULL,
    '[
        {
            "stepTitle": "Impression Taking",
            "stepBody": "Your dentist places a soft impression material inside your existing denture and has you bite down. This captures the current shape of your gums and jaw ridge to create a precise mold for the reline.",
            "imageKey": "reline-impression"
        },
        {
            "stepTitle": "Reline Application",
            "stepBody": "The old inner surface of the denture is removed and replaced with new acrylic material that matches the impression of your gums. For a hard reline, this is done in a dental laboratory. For a soft reline, a pliable material is applied chairside.",
            "imageKey": "reline-application"
        },
        {
            "stepTitle": "Fitting & Adjustment",
            "stepBody": "The relined denture is placed back in your mouth. Your dentist checks the fit, bite alignment, and comfort, making any necessary adjustments to pressure points or edges to ensure a secure and comfortable fit.",
            "imageKey": "reline-adjustment"
        }
    ]'::JSONB,
    '[
        {
            "stepTitle": "Toma de Impresión",
            "stepBody": "Su dentista coloca un material de impresión suave dentro de su dentadura existente y le pide que muerda. Esto captura la forma actual de sus encías y cresta mandibular para crear un molde preciso para el rebase.",
            "imageKey": "reline-impression"
        },
        {
            "stepTitle": "Aplicación del Rebase",
            "stepBody": "La superficie interna antigua de la dentadura se retira y se reemplaza con nuevo material acrílico que coincide con la impresión de sus encías. Para un rebase duro, esto se hace en un laboratorio dental. Para un rebase blando, se aplica un material flexible directamente en el consultorio.",
            "imageKey": "reline-application"
        },
        {
            "stepTitle": "Ajuste y Acomodación",
            "stepBody": "La dentadura rebasada se coloca de nuevo en su boca. Su dentista verifica el ajuste, la alineación de la mordida y la comodidad, realizando los ajustes necesarios a los puntos de presión o bordes para asegurar un ajuste seguro y cómodo.",
            "imageKey": "reline-adjustment"
        }
    ]'::JSONB,
    'No anesthesia is typically needed for a denture reline as the procedure is non-invasive and involves only the denture itself, not your natural tissue.',
    'Generalmente no se necesita anestesia para un rebase de dentadura ya que el procedimiento es no invasivo e involucra solo la dentadura misma, no su tejido natural.',
    NULL,
    NULL,
    '### Aftercare Instructions

**First 24 Hours:**
- Wear the denture continuously for the first 24 hours to allow your gums to adjust
- Eat soft foods initially
- Minor soreness is normal as you adjust to the new fit

**Ongoing Care:**
- Remove and clean your denture daily
- Brush the denture with a denture-specific brush and cleanser
- Soak dentures overnight in cleaning solution
- Rinse your mouth and gums after removing dentures
- Schedule follow-up if any persistent sore spots develop
- Plan for relines every 1-2 years to maintain optimal fit',
    '### Instrucciones de Cuidado Posterior

**Primeras 24 Horas:**
- Use la dentadura continuamente durante las primeras 24 horas para permitir que sus encías se ajusten
- Coma alimentos blandos inicialmente
- La molestia menor es normal mientras se ajusta al nuevo ajuste

**Cuidado Continuo:**
- Retire y limpie su dentadura diariamente
- Cepille la dentadura con un cepillo y limpiador específico para dentaduras
- Remoje las dentaduras durante la noche en solución limpiadora
- Enjuague su boca y encías después de retirar las dentaduras
- Programe un seguimiento si se desarrollan puntos dolorosos persistentes
- Planifique rebases cada 1 a 2 años para mantener un ajuste óptimo',
    '[
        {
            "q": "How often should I get my dentures relined?",
            "a": "Most dentists recommend a reline every 1-2 years for a good fit. However, if your dentures become loose or uncomfortable sooner, schedule a reline appointment right away."
        },
        {
            "q": "What is the difference between a hard and soft reline?",
            "a": "A hard reline uses firm acrylic and lasts longer (1-2 years). A soft reline uses a flexible material that is gentler on sore gums but may need replacement more often (every 6-12 months)."
        },
        {
            "q": "How long does a reline take?",
            "a": "A chairside soft reline can be done in about 30 minutes during a single visit. A hard (laboratory) reline may require leaving your denture overnight and picking it up the next day."
        },
        {
            "q": "Can I use denture adhesive instead of getting a reline?",
            "a": "Adhesive is a temporary solution. If you need adhesive daily to keep dentures in place, it is a sign that a professional reline is needed for proper fit and comfort."
        }
    ]'::JSONB,
    '[
        {
            "q": "¿Con qué frecuencia debo rebasar mis dentaduras?",
            "a": "La mayoría de los dentistas recomiendan un rebase cada 1 a 2 años para un buen ajuste. Sin embargo, si sus dentaduras se aflojan o se vuelven incómodas antes, programe una cita de rebase de inmediato."
        },
        {
            "q": "¿Cuál es la diferencia entre un rebase duro y uno blando?",
            "a": "Un rebase duro usa acrílico firme y dura más (1-2 años). Un rebase blando usa un material flexible que es más suave para las encías adoloridas pero puede necesitar reemplazo más a menudo (cada 6-12 meses)."
        },
        {
            "q": "¿Cuánto tiempo toma un rebase?",
            "a": "Un rebase blando en el consultorio puede hacerse en aproximadamente 30 minutos durante una sola visita. Un rebase duro (de laboratorio) puede requerir dejar su dentadura durante la noche y recogerla al día siguiente."
        },
        {
            "q": "¿Puedo usar adhesivo para dentaduras en lugar de hacerme un rebase?",
            "a": "El adhesivo es una solución temporal. Si necesita adhesivo diariamente para mantener las dentaduras en su lugar, es una señal de que se necesita un rebase profesional para un ajuste y comodidad adecuados."
        }
    ]'::JSONB,
    '30-60 minutes (chairside); 1-2 days (laboratory)',
    '1-2 visits',
    '{"heroKey": "denture-reline-hero", "stepKeys": ["reline-impression", "reline-application", "reline-adjustment"]}'::JSONB,
    'prosthodontics',
    true
),
(
    'root-canal-retreatment',
    'Root Canal Retreatment',
    'Retratamiento de Conducto Radicular',
    'Root canal retreatment is performed when a previously treated tooth has not healed properly or has developed new problems. The original filling material is removed, the canals are re-cleaned and reshaped, and new filling material is placed to give the tooth another chance to heal.',
    'El retratamiento de conducto radicular se realiza cuando un diente previamente tratado no ha sanado correctamente o ha desarrollado nuevos problemas. El material de relleno original se retira, los conductos se vuelven a limpiar y remodelar, y se coloca nuevo material de relleno para darle al diente otra oportunidad de sanar.',
    '### Why You May Need Root Canal Retreatment

Although root canals have a high success rate (over 95%), occasionally a treated tooth may not heal as expected or may develop new issues months or years later.

**Common Reasons:**
- Persistent or recurring infection after the initial root canal
- New decay exposing the root canal filling to bacteria
- A cracked or loose crown allowing contamination
- Narrow or curved canals that were not fully treated initially
- Delayed placement of a permanent crown after the original treatment
- New fracture in the treated tooth',
    '### Por Qué Puede Necesitar un Retratamiento de Conducto

Aunque los tratamientos de conducto tienen una alta tasa de éxito (más del 95%), ocasionalmente un diente tratado puede no sanar como se esperaba o puede desarrollar nuevos problemas meses o años después.

**Razones Comunes:**
- Infección persistente o recurrente después del conducto radicular inicial
- Nueva caries exponiendo el relleno del conducto a bacterias
- Una corona agrietada o floja que permite la contaminación
- Conductos estrechos o curvos que no fueron completamente tratados inicialmente
- Colocación tardía de una corona permanente después del tratamiento original
- Nueva fractura en el diente tratado',
    'Without retreatment, the infection in the tooth will persist and may worsen. This can lead to abscess formation, bone loss around the root, chronic pain, and potential spread of infection. Eventually, the tooth may need to be extracted if retreatment is not performed.',
    'Sin retratamiento, la infección en el diente persistirá y puede empeorar. Esto puede llevar a la formación de abscesos, pérdida ósea alrededor de la raíz, dolor crónico y posible propagación de la infección. Eventualmente, el diente puede necesitar ser extraído si no se realiza el retratamiento.',
    '[
        {
            "stepTitle": "Access & Crown Removal",
            "stepBody": "Your dentist removes the existing crown or restoration to access the root canal filling. An opening is made through the top of the tooth to reach the previously treated canals.",
            "imageKey": "retreatment-access"
        },
        {
            "stepTitle": "Old Filling Removal",
            "stepBody": "The original root canal filling material (gutta-percha) is carefully removed from each canal using specialized instruments. This allows your dentist to examine the full length of the canals.",
            "imageKey": "retreatment-removal"
        },
        {
            "stepTitle": "Re-Cleaning & Shaping",
            "stepBody": "The canals are thoroughly re-cleaned, disinfected, and reshaped. Any additional canals that were missed initially are located and treated. Medicated solutions are used to eliminate bacteria.",
            "imageKey": "retreatment-cleaning"
        },
        {
            "stepTitle": "Re-Filling the Canals",
            "stepBody": "Once the canals are clean and dry, they are filled with new gutta-percha and sealed. In some cases, a medicated paste is placed first and the final filling is done at a second visit.",
            "imageKey": "retreatment-filling"
        },
        {
            "stepTitle": "Crown Restoration",
            "stepBody": "A new crown or restoration is placed over the tooth to protect it and restore full function. This step is crucial to prevent recontamination of the treated canals.",
            "imageKey": "retreatment-crown"
        }
    ]'::JSONB,
    '[
        {
            "stepTitle": "Acceso y Remoción de Corona",
            "stepBody": "Su dentista retira la corona o restauración existente para acceder al relleno del conducto radicular. Se hace una abertura a través de la parte superior del diente para llegar a los conductos previamente tratados.",
            "imageKey": "retreatment-access"
        },
        {
            "stepTitle": "Remoción del Relleno Antiguo",
            "stepBody": "El material de relleno original del conducto radicular (gutapercha) se retira cuidadosamente de cada conducto usando instrumentos especializados. Esto permite a su dentista examinar toda la longitud de los conductos.",
            "imageKey": "retreatment-removal"
        },
        {
            "stepTitle": "Re-Limpieza y Modelado",
            "stepBody": "Los conductos se vuelven a limpiar, desinfectar y remodelar a fondo. Cualquier conducto adicional que se haya pasado por alto inicialmente se localiza y trata. Se usan soluciones medicadas para eliminar las bacterias.",
            "imageKey": "retreatment-cleaning"
        },
        {
            "stepTitle": "Re-Relleno de los Conductos",
            "stepBody": "Una vez que los conductos están limpios y secos, se rellenan con nueva gutapercha y se sellan. En algunos casos, se coloca primero una pasta medicada y el relleno final se realiza en una segunda visita.",
            "imageKey": "retreatment-filling"
        },
        {
            "stepTitle": "Restauración con Corona",
            "stepBody": "Se coloca una nueva corona o restauración sobre el diente para protegerlo y restaurar su función completa. Este paso es crucial para prevenir la recontaminación de los conductos tratados.",
            "imageKey": "retreatment-crown"
        }
    ]'::JSONB,
    'Local anesthesia is used to completely numb the tooth and surrounding area. The procedure is similar in sensation to the original root canal treatment.',
    'Se usa anestesia local para adormecer completamente el diente y el área circundante. El procedimiento es similar en sensación al tratamiento de conducto radicular original.',
    '**Possible risks include:**
- Instrument separation within the canal (rare)
- Perforation of the root during retreatment (rare)
- Inability to fully clean calcified or blocked canals
- Post-treatment discomfort for several days
- The tooth may ultimately require extraction if retreatment is not successful',
    '**Los posibles riesgos incluyen:**
- Separación de instrumento dentro del conducto (raro)
- Perforación de la raíz durante el retratamiento (raro)
- Incapacidad para limpiar completamente conductos calcificados o bloqueados
- Molestia post-tratamiento durante varios días
- El diente puede finalmente requerir extracción si el retratamiento no es exitoso',
    '### Aftercare Instructions

**First 48-72 Hours:**
- Mild to moderate discomfort is normal — take prescribed or over-the-counter pain medication
- Avoid chewing on the treated tooth until the permanent restoration is placed
- Eat soft foods and chew on the opposite side
- Some swelling is normal; apply ice packs as needed

**Ongoing Care:**
- Complete the full course of any prescribed antibiotics
- Return promptly for your permanent crown appointment
- Maintain excellent oral hygiene around the treated tooth
- Contact your dentist if you experience increasing pain, swelling, or fever',
    '### Instrucciones de Cuidado Posterior

**Primeras 48-72 Horas:**
- La molestia leve a moderada es normal — tome medicamentos para el dolor recetados o de venta libre
- Evite masticar con el diente tratado hasta que se coloque la restauración permanente
- Coma alimentos blandos y mastique del lado opuesto
- Algo de hinchazón es normal; aplique compresas de hielo según sea necesario

**Cuidado Continuo:**
- Complete el curso completo de cualquier antibiótico recetado
- Regrese puntualmente para su cita de corona permanente
- Mantenga una excelente higiene oral alrededor del diente tratado
- Contacte a su dentista si experimenta dolor creciente, hinchazón o fiebre',
    '[
        {
            "q": "Why did my original root canal fail?",
            "a": "Root canals can fail for several reasons: new decay, a cracked tooth, complex canal anatomy that was difficult to treat completely, or delayed crown placement that allowed bacteria to re-enter the tooth."
        },
        {
            "q": "Is retreatment painful?",
            "a": "The procedure is performed under local anesthesia, so you should not feel pain during treatment. Some soreness for a few days afterward is normal and manageable with pain medication."
        },
        {
            "q": "What is the success rate of retreatment?",
            "a": "Root canal retreatment has a success rate of approximately 75-85%. The outcome depends on factors like the reason for failure, tooth anatomy, and the extent of infection."
        },
        {
            "q": "What are the alternatives to retreatment?",
            "a": "Alternatives include apicoectomy (surgical removal of the root tip) or tooth extraction followed by an implant or bridge. Your dentist will discuss which option is best for your situation."
        }
    ]'::JSONB,
    '[
        {
            "q": "¿Por qué falló mi conducto radicular original?",
            "a": "Los conductos radiculares pueden fallar por varias razones: nueva caries, un diente agrietado, anatomía compleja del conducto que fue difícil de tratar completamente, o colocación tardía de la corona que permitió que las bacterias reingresaran al diente."
        },
        {
            "q": "¿El retratamiento es doloroso?",
            "a": "El procedimiento se realiza bajo anestesia local, por lo que no debe sentir dolor durante el tratamiento. Algo de molestia durante unos días después es normal y manejable con medicamentos para el dolor."
        },
        {
            "q": "¿Cuál es la tasa de éxito del retratamiento?",
            "a": "El retratamiento de conducto radicular tiene una tasa de éxito de aproximadamente 75-85%. El resultado depende de factores como la razón del fallo, la anatomía del diente y la extensión de la infección."
        },
        {
            "q": "¿Cuáles son las alternativas al retratamiento?",
            "a": "Las alternativas incluyen la apicectomía (remoción quirúrgica de la punta de la raíz) o la extracción del diente seguida de un implante o puente. Su dentista discutirá cuál opción es mejor para su situación."
        }
    ]'::JSONB,
    '1-2 hours per visit',
    '2-3 visits',
    '{"heroKey": "retreatment-hero", "stepKeys": ["retreatment-access", "retreatment-removal", "retreatment-cleaning", "retreatment-filling", "retreatment-crown"]}'::JSONB,
    'endodontics',
    true
),
(
    'full-mouth-debridement',
    'Full Mouth Debridement',
    'Desbridamiento de Boca Completa',
    'Full mouth debridement is a thorough cleaning procedure that removes heavy plaque and calculus (tartar) buildup when deposits are so extensive that a regular evaluation of gum and tooth health is not possible. It is typically the first step before a comprehensive dental exam for patients who have not been to the dentist in a long time.',
    'El desbridamiento de boca completa es un procedimiento de limpieza profunda que elimina la acumulación abundante de placa y cálculo (sarro) cuando los depósitos son tan extensos que no es posible una evaluación regular de la salud de las encías y los dientes. Es típicamente el primer paso antes de un examen dental completo para pacientes que no han ido al dentista en mucho tiempo.',
    '### Why You Need a Full Mouth Debridement

When significant time has passed without professional dental care, plaque and tartar can build up to levels that make it impossible for your dentist to properly examine your teeth and gums.

**Common Reasons:**
- It has been several years since your last dental visit
- Heavy tartar buildup covering the teeth and below the gumline
- Gum tissue is inflamed due to extensive plaque accumulation
- Your dentist cannot adequately assess your oral health without removing the buildup first
- First step toward getting back on track with dental care',
    '### Por Qué Necesita un Desbridamiento de Boca Completa

Cuando ha pasado un tiempo significativo sin atención dental profesional, la placa y el sarro pueden acumularse a niveles que hacen imposible que su dentista examine adecuadamente sus dientes y encías.

**Razones Comunes:**
- Han pasado varios años desde su última visita dental
- Acumulación abundante de sarro cubriendo los dientes y debajo de la línea de las encías
- El tejido de las encías está inflamado debido a la acumulación extensa de placa
- Su dentista no puede evaluar adecuadamente su salud oral sin eliminar la acumulación primero
- Primer paso para retomar el camino con el cuidado dental',
    NULL,
    NULL,
    '[
        {
            "stepTitle": "Scaling & Tartar Removal",
            "stepBody": "Using ultrasonic instruments and hand scalers, your dental hygienist systematically removes heavy tartar and plaque deposits from all tooth surfaces, above and below the gumline. This may take longer than a standard cleaning due to the extent of buildup.",
            "imageKey": "debridement-scaling"
        },
        {
            "stepTitle": "Irrigation & Rinse",
            "stepBody": "The mouth is thoroughly irrigated with an antimicrobial rinse to flush away loosened debris and bacteria from the gum pockets and between teeth. This helps reduce the bacterial load and soothe inflamed gum tissue.",
            "imageKey": "debridement-irrigation"
        },
        {
            "stepTitle": "Re-Evaluation Planning",
            "stepBody": "Your dentist schedules a follow-up appointment (typically 2-4 weeks later) to allow the gums to heal. At that visit, a comprehensive exam with X-rays, probing measurements, and full assessment can be properly performed to create your treatment plan.",
            "imageKey": "debridement-evaluation"
        }
    ]'::JSONB,
    '[
        {
            "stepTitle": "Raspado y Eliminación de Sarro",
            "stepBody": "Usando instrumentos ultrasónicos y raspadores manuales, su higienista dental elimina sistemáticamente los depósitos pesados de sarro y placa de todas las superficies dentales, por encima y por debajo de la línea de las encías. Esto puede tomar más tiempo que una limpieza estándar debido a la extensión de la acumulación.",
            "imageKey": "debridement-scaling"
        },
        {
            "stepTitle": "Irrigación y Enjuague",
            "stepBody": "La boca se irriga completamente con un enjuague antimicrobiano para eliminar los residuos sueltos y las bacterias de las bolsas de las encías y entre los dientes. Esto ayuda a reducir la carga bacteriana y calmar el tejido de las encías inflamado.",
            "imageKey": "debridement-irrigation"
        },
        {
            "stepTitle": "Planificación de Re-Evaluación",
            "stepBody": "Su dentista programa una cita de seguimiento (generalmente 2 a 4 semanas después) para permitir que las encías sanen. En esa visita, se puede realizar adecuadamente un examen completo con radiografías, mediciones de sondeo y evaluación completa para crear su plan de tratamiento.",
            "imageKey": "debridement-evaluation"
        }
    ]'::JSONB,
    'Local anesthesia or topical numbing may be used if your gums are very sensitive or inflamed. Many patients tolerate the procedure with minimal or no anesthesia.',
    'Se puede usar anestesia local o adormecimiento tópico si sus encías están muy sensibles o inflamadas. Muchos pacientes toleran el procedimiento con mínima o sin anestesia.',
    NULL,
    NULL,
    '### Aftercare Instructions

**First 24-48 Hours:**
- Gum tenderness and slight bleeding are normal and should improve within a day or two
- Rinse gently with warm salt water (1/2 teaspoon salt in 8 oz water) 2-3 times daily
- Avoid spicy, acidic, or very hot foods that may irritate sensitive gums
- Use a soft-bristled toothbrush and brush gently

**Ongoing Care:**
- Brush twice daily with fluoride toothpaste
- Begin flossing daily — your gums may bleed initially but this will improve
- Use an antimicrobial mouthwash as recommended
- Keep your follow-up appointment for the comprehensive exam
- Commit to regular dental visits going forward',
    '### Instrucciones de Cuidado Posterior

**Primeras 24-48 Horas:**
- La sensibilidad y el sangrado leve de las encías son normales y deberían mejorar en uno o dos días
- Enjuague suavemente con agua tibia con sal (1/2 cucharadita de sal en 8 oz de agua) 2-3 veces al día
- Evite alimentos picantes, ácidos o muy calientes que puedan irritar las encías sensibles
- Use un cepillo de cerdas suaves y cepille suavemente

**Cuidado Continuo:**
- Cepille dos veces al día con pasta dental con flúor
- Comience a usar hilo dental diariamente — sus encías pueden sangrar inicialmente pero esto mejorará
- Use un enjuague bucal antimicrobiano según lo recomendado
- Asista a su cita de seguimiento para el examen completo
- Comprométase con visitas dentales regulares en adelante',
    '[
        {
            "q": "Is full mouth debridement the same as a deep cleaning?",
            "a": "No. A full mouth debridement removes heavy buildup so your dentist can examine your mouth properly. A deep cleaning (scaling and root planing) is a targeted treatment for gum disease. After debridement, your dentist may recommend deep cleaning if gum disease is found."
        },
        {
            "q": "Will it hurt?",
            "a": "You may feel some discomfort, especially if your gums are inflamed. Numbing options are available to keep you comfortable. Most patients describe the sensation as pressure rather than pain."
        },
        {
            "q": "How long does it take?",
            "a": "A full mouth debridement typically takes 45-90 minutes, depending on the amount of buildup. It is usually completed in a single visit."
        },
        {
            "q": "Why can''t I just get a regular cleaning?",
            "a": "When tartar buildup is very heavy, a regular cleaning is not sufficient to remove it all, and your dentist cannot properly evaluate your oral health. Debridement is the necessary first step to clear the way for a thorough exam and treatment plan."
        }
    ]'::JSONB,
    '[
        {
            "q": "¿El desbridamiento de boca completa es lo mismo que una limpieza profunda?",
            "a": "No. Un desbridamiento de boca completa elimina la acumulación pesada para que su dentista pueda examinar su boca adecuadamente. Una limpieza profunda (raspado y alisado radicular) es un tratamiento dirigido para la enfermedad de las encías. Después del desbridamiento, su dentista puede recomendar una limpieza profunda si se encuentra enfermedad de las encías."
        },
        {
            "q": "¿Dolerá?",
            "a": "Puede sentir algo de molestia, especialmente si sus encías están inflamadas. Hay opciones de adormecimiento disponibles para mantenerlo cómodo. La mayoría de los pacientes describen la sensación como presión en lugar de dolor."
        },
        {
            "q": "¿Cuánto tiempo toma?",
            "a": "Un desbridamiento de boca completa generalmente toma de 45 a 90 minutos, dependiendo de la cantidad de acumulación. Generalmente se completa en una sola visita."
        },
        {
            "q": "¿Por qué no puedo simplemente hacerme una limpieza regular?",
            "a": "Cuando la acumulación de sarro es muy pesada, una limpieza regular no es suficiente para eliminarla toda, y su dentista no puede evaluar adecuadamente su salud oral. El desbridamiento es el primer paso necesario para abrir camino a un examen completo y plan de tratamiento."
        }
    ]'::JSONB,
    '45-90 minutes',
    '1 visit (follow-up exam 2-4 weeks later)',
    '{"heroKey": "debridement-hero", "stepKeys": ["debridement-scaling", "debridement-irrigation", "debridement-evaluation"]}'::JSONB,
    'periodontics',
    true
),
(
    'periodontal-maintenance',
    'Periodontal Maintenance',
    'Mantenimiento Periodontal',
    'Periodontal maintenance is a specialized cleaning procedure for patients who have been treated for gum disease (periodontitis). It goes beyond a regular cleaning to include thorough scaling below the gumline, pocket measurements, and monitoring of gum health to prevent disease recurrence.',
    'El mantenimiento periodontal es un procedimiento de limpieza especializado para pacientes que han sido tratados por enfermedad de las encías (periodontitis). Va más allá de una limpieza regular para incluir un raspado completo debajo de la línea de las encías, mediciones de bolsas y monitoreo de la salud de las encías para prevenir la recurrencia de la enfermedad.',
    '### Why You Need Periodontal Maintenance

After being treated for gum disease, your gums require ongoing specialized care. Periodontal disease cannot be cured, but it can be managed and controlled with regular maintenance visits.

**Common Reasons:**
- You have been diagnosed with and treated for periodontal disease
- Previous scaling and root planing (deep cleaning) treatment
- Prevent recurrence of gum infection and bone loss
- Monitor pocket depths and gum attachment levels
- Maintain the results achieved through periodontal treatment
- Reduce the risk of tooth loss from advancing gum disease',
    '### Por Qué Necesita Mantenimiento Periodontal

Después de ser tratado por enfermedad de las encías, sus encías requieren cuidado especializado continuo. La enfermedad periodontal no puede curarse, pero puede manejarse y controlarse con visitas regulares de mantenimiento.

**Razones Comunes:**
- Ha sido diagnosticado y tratado por enfermedad periodontal
- Tratamiento previo de raspado y alisado radicular (limpieza profunda)
- Prevenir la recurrencia de la infección de las encías y la pérdida ósea
- Monitorear la profundidad de las bolsas y los niveles de inserción de las encías
- Mantener los resultados logrados a través del tratamiento periodontal
- Reducir el riesgo de pérdida de dientes por enfermedad de las encías avanzada',
    NULL,
    NULL,
    '[
        {
            "stepTitle": "Review & Assessment",
            "stepBody": "Your dental hygienist reviews your medical and dental history updates, asks about any changes in your oral health, and performs a visual examination of your teeth, gums, and any existing dental work.",
            "imageKey": "perio-maint-review"
        },
        {
            "stepTitle": "Pocket Measurements",
            "stepBody": "Using a periodontal probe, the hygienist measures the depth of the gum pockets around each tooth. These measurements are compared to previous readings to track whether the disease is stable, improving, or worsening.",
            "imageKey": "perio-maint-measurements"
        },
        {
            "stepTitle": "Scaling Above & Below the Gumline",
            "stepBody": "Specialized instruments are used to thoroughly remove plaque, tartar, and bacterial deposits from tooth surfaces both above and below the gumline, including within the gum pockets. This is more extensive than a regular cleaning.",
            "imageKey": "perio-maint-scaling"
        },
        {
            "stepTitle": "Polishing & Fluoride Application",
            "stepBody": "The teeth are polished to remove surface stains and smooth the enamel. A fluoride treatment is applied to strengthen teeth and help protect against decay. Your dentist reviews your home care routine and schedules your next maintenance visit.",
            "imageKey": "perio-maint-polishing"
        }
    ]'::JSONB,
    '[
        {
            "stepTitle": "Revisión y Evaluación",
            "stepBody": "Su higienista dental revisa las actualizaciones de su historial médico y dental, pregunta sobre cualquier cambio en su salud oral y realiza un examen visual de sus dientes, encías y cualquier trabajo dental existente.",
            "imageKey": "perio-maint-review"
        },
        {
            "stepTitle": "Mediciones de Bolsas",
            "stepBody": "Usando una sonda periodontal, el higienista mide la profundidad de las bolsas de las encías alrededor de cada diente. Estas mediciones se comparan con las lecturas anteriores para rastrear si la enfermedad está estable, mejorando o empeorando.",
            "imageKey": "perio-maint-measurements"
        },
        {
            "stepTitle": "Raspado por Encima y Debajo de la Línea de las Encías",
            "stepBody": "Se usan instrumentos especializados para eliminar completamente la placa, el sarro y los depósitos bacterianos de las superficies dentales tanto por encima como por debajo de la línea de las encías, incluyendo dentro de las bolsas de las encías. Esto es más extenso que una limpieza regular.",
            "imageKey": "perio-maint-scaling"
        },
        {
            "stepTitle": "Pulido y Aplicación de Flúor",
            "stepBody": "Los dientes se pulen para eliminar las manchas superficiales y alisar el esmalte. Se aplica un tratamiento de flúor para fortalecer los dientes y ayudar a proteger contra las caries. Su dentista revisa su rutina de cuidado en casa y programa su próxima visita de mantenimiento.",
            "imageKey": "perio-maint-polishing"
        }
    ]'::JSONB,
    'Topical or local anesthesia may be used if gum pockets are deep or sensitive. Many patients are comfortable without full anesthesia during maintenance visits.',
    'Se puede usar anestesia tópica o local si las bolsas de las encías son profundas o sensibles. Muchos pacientes están cómodos sin anestesia completa durante las visitas de mantenimiento.',
    NULL,
    NULL,
    '### Aftercare Instructions

**After Your Visit:**
- Mild gum tenderness is normal for 1-2 days
- Rinse with warm salt water if gums feel sore
- Avoid spicy or very hot foods for the first day
- Wait 30 minutes before eating if fluoride was applied

**Between Maintenance Visits:**
- Brush at least twice daily with a soft-bristled brush
- Floss or use interdental brushes daily — this is critical for periodontal patients
- Use any prescribed antimicrobial rinse as directed
- Avoid smoking — it significantly worsens periodontal disease
- Keep all scheduled maintenance appointments (typically every 3-4 months)
- Contact your dentist if you notice bleeding, swelling, or loose teeth between visits',
    '### Instrucciones de Cuidado Posterior

**Después de Su Visita:**
- La sensibilidad leve de las encías es normal durante 1 a 2 días
- Enjuague con agua tibia con sal si las encías se sienten adoloridas
- Evite alimentos picantes o muy calientes el primer día
- Espere 30 minutos antes de comer si se aplicó flúor

**Entre Visitas de Mantenimiento:**
- Cepille al menos dos veces al día con un cepillo de cerdas suaves
- Use hilo dental o cepillos interdentales diariamente — esto es crítico para pacientes periodontales
- Use cualquier enjuague antimicrobiano recetado según las indicaciones
- Evite fumar — empeora significativamente la enfermedad periodontal
- Asista a todas las citas de mantenimiento programadas (generalmente cada 3 a 4 meses)
- Contacte a su dentista si nota sangrado, hinchazón o dientes flojos entre visitas',
    '[
        {
            "q": "How often do I need periodontal maintenance?",
            "a": "Most periodontal patients need maintenance every 3-4 months, rather than the standard 6-month interval. Your dentist may adjust the frequency based on how well your gum disease is controlled."
        },
        {
            "q": "Is periodontal maintenance the same as a regular cleaning?",
            "a": "No. Periodontal maintenance is more thorough and includes pocket measurements, deeper scaling below the gumline, and specific monitoring of areas previously affected by gum disease. It is tailored to your periodontal condition."
        },
        {
            "q": "Will my gum disease come back if I stop maintenance?",
            "a": "Yes, gum disease will likely return and progress if maintenance visits are skipped. Periodontal disease is a chronic condition that requires ongoing management to keep under control."
        },
        {
            "q": "Does insurance cover periodontal maintenance?",
            "a": "Most dental insurance plans cover periodontal maintenance, though coverage frequency may vary. Your dental office can help verify your specific benefits and coverage."
        }
    ]'::JSONB,
    '[
        {
            "q": "¿Con qué frecuencia necesito mantenimiento periodontal?",
            "a": "La mayoría de los pacientes periodontales necesitan mantenimiento cada 3 a 4 meses, en lugar del intervalo estándar de 6 meses. Su dentista puede ajustar la frecuencia según qué tan bien esté controlada su enfermedad de las encías."
        },
        {
            "q": "¿El mantenimiento periodontal es lo mismo que una limpieza regular?",
            "a": "No. El mantenimiento periodontal es más completo e incluye mediciones de bolsas, raspado más profundo debajo de la línea de las encías y monitoreo específico de áreas previamente afectadas por enfermedad de las encías. Está adaptado a su condición periodontal."
        },
        {
            "q": "¿Mi enfermedad de las encías volverá si dejo el mantenimiento?",
            "a": "Sí, es probable que la enfermedad de las encías regrese y progrese si se omiten las visitas de mantenimiento. La enfermedad periodontal es una condición crónica que requiere manejo continuo para mantenerse bajo control."
        },
        {
            "q": "¿El seguro cubre el mantenimiento periodontal?",
            "a": "La mayoría de los planes de seguro dental cubren el mantenimiento periodontal, aunque la frecuencia de cobertura puede variar. Su oficina dental puede ayudar a verificar sus beneficios y cobertura específicos."
        }
    ]'::JSONB,
    '45-60 minutes',
    '1 visit every 3-4 months',
    '{"heroKey": "perio-maint-hero", "stepKeys": ["perio-maint-review", "perio-maint-measurements", "perio-maint-scaling", "perio-maint-polishing"]}'::JSONB,
    'periodontics',
    true
)
ON CONFLICT (slug) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_es = EXCLUDED.title_es,
    summary_en = EXCLUDED.summary_en,
    summary_es = EXCLUDED.summary_es,
    why_en = EXCLUDED.why_en,
    why_es = EXCLUDED.why_es,
    what_if_not_en = EXCLUDED.what_if_not_en,
    what_if_not_es = EXCLUDED.what_if_not_es,
    steps_en = EXCLUDED.steps_en,
    steps_es = EXCLUDED.steps_es,
    anesthesia_en = EXCLUDED.anesthesia_en,
    anesthesia_es = EXCLUDED.anesthesia_es,
    risks_en = EXCLUDED.risks_en,
    risks_es = EXCLUDED.risks_es,
    aftercare_en = EXCLUDED.aftercare_en,
    aftercare_es = EXCLUDED.aftercare_es,
    faqs_en = EXCLUDED.faqs_en,
    faqs_es = EXCLUDED.faqs_es,
    time_estimate = EXCLUDED.time_estimate,
    visits_estimate = EXCLUDED.visits_estimate,
    visuals = EXCLUDED.visuals,
    category = EXCLUDED.category,
    is_published = EXCLUDED.is_published;

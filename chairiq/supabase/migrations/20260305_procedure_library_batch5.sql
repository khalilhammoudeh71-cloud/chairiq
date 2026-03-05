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
    'space-maintainer',
    'Space Maintainer',
    'Mantenedor de Espacio',
    'A space maintainer is a custom-made dental appliance used to hold open the space left by a prematurely lost baby tooth. It prevents neighboring teeth from shifting into the gap, ensuring the permanent tooth has room to erupt properly.',
    'Un mantenedor de espacio es un aparato dental hecho a medida que se usa para mantener abierto el espacio dejado por un diente de leche perdido prematuramente. Evita que los dientes vecinos se desplacen hacia el espacio, asegurando que el diente permanente tenga espacio para erupcionar correctamente.',
    '### Why Your Child Needs a Space Maintainer

When a baby tooth is lost too early — due to decay, injury, or extraction — the surrounding teeth can drift into the empty space. This can block or crowd the permanent tooth trying to come in, leading to alignment problems that may require orthodontic treatment later.

**Key Reasons:**
- Prevent neighboring teeth from shifting into the gap
- Guide the permanent tooth into its correct position
- Avoid the need for more extensive orthodontic work later
- Maintain proper bite alignment during growth
- Preserve arch space for natural dental development',
    '### Por Qué Su Hijo Necesita un Mantenedor de Espacio

Cuando un diente de leche se pierde demasiado pronto — debido a caries, lesión o extracción — los dientes circundantes pueden desplazarse hacia el espacio vacío. Esto puede bloquear o apiñar el diente permanente que intenta salir, lo que lleva a problemas de alineación que pueden requerir tratamiento de ortodoncia más adelante.

**Razones Clave:**
- Prevenir que los dientes vecinos se desplacen hacia el espacio
- Guiar al diente permanente a su posición correcta
- Evitar la necesidad de un trabajo de ortodoncia más extenso más adelante
- Mantener la alineación adecuada de la mordida durante el crecimiento
- Preservar el espacio del arco para el desarrollo dental natural',
    'Without a space maintainer, adjacent teeth will gradually drift into the empty space. This can cause the permanent tooth to come in crooked, become impacted, or fail to erupt at all. The resulting crowding often requires braces or other orthodontic treatment to correct.',
    'Sin un mantenedor de espacio, los dientes adyacentes se desplazarán gradualmente hacia el espacio vacío. Esto puede causar que el diente permanente salga torcido, quede impactado o no erupcione en absoluto. El apiñamiento resultante a menudo requiere brackets u otro tratamiento de ortodoncia para corregirlo.',
    '[
        {
            "stepTitle": "Impressions & Design",
            "stepBody": "The dentist takes impressions or digital scans of your child''s teeth to create a custom-fitted space maintainer. The type of maintainer (band-and-loop, crown-and-loop, or other) is selected based on which tooth was lost and where.",
            "imageKey": "space-maintainer-impressions"
        },
        {
            "stepTitle": "Fitting the Appliance",
            "stepBody": "At a follow-up visit, the custom space maintainer is tried in and cemented onto the anchor tooth. The dentist checks that it fits comfortably and holds the space open correctly without irritating the gums.",
            "imageKey": "space-maintainer-fitting"
        },
        {
            "stepTitle": "Follow-Up & Monitoring",
            "stepBody": "Regular checkups are scheduled to monitor the space maintainer, check for the eruption of the permanent tooth, and ensure the appliance remains in good condition. The maintainer is removed once the permanent tooth begins to emerge.",
            "imageKey": "space-maintainer-followup"
        }
    ]'::JSONB,
    '[
        {
            "stepTitle": "Impresiones y Diseño",
            "stepBody": "El dentista toma impresiones o escaneos digitales de los dientes de su hijo para crear un mantenedor de espacio a medida. El tipo de mantenedor (banda y ansa, corona y ansa, u otro) se selecciona según qué diente se perdió y dónde.",
            "imageKey": "space-maintainer-impressions"
        },
        {
            "stepTitle": "Colocación del Aparato",
            "stepBody": "En una visita de seguimiento, el mantenedor de espacio personalizado se prueba y se cementa sobre el diente de anclaje. El dentista verifica que se ajuste cómodamente y mantenga el espacio abierto correctamente sin irritar las encías.",
            "imageKey": "space-maintainer-fitting"
        },
        {
            "stepTitle": "Seguimiento y Monitoreo",
            "stepBody": "Se programan chequeos regulares para monitorear el mantenedor de espacio, verificar la erupción del diente permanente y asegurar que el aparato se mantenga en buenas condiciones. El mantenedor se retira una vez que el diente permanente comienza a emerger.",
            "imageKey": "space-maintainer-followup"
        }
    ]'::JSONB,
    'No anesthesia is typically required. The procedure is non-invasive and painless. If a crown-type maintainer is used, mild local anesthesia may be applied.',
    'Generalmente no se requiere anestesia. El procedimiento es no invasivo e indoloro. Si se usa un mantenedor tipo corona, se puede aplicar anestesia local leve.',
    NULL,
    NULL,
    '### Aftercare Instructions

**First Few Days:**
- Your child may feel slight pressure or awkwardness — this is normal and resolves quickly
- Encourage soft foods for the first day
- Avoid sticky or chewy candies (taffy, caramels, gum) that can dislodge the appliance

**Ongoing Care:**
- Brush around the space maintainer carefully at each brushing
- Avoid hard, crunchy foods that could bend or break the appliance
- Do not push or pull on the maintainer with fingers or tongue
- Attend all scheduled follow-up appointments
- Contact your dentist if the maintainer becomes loose or falls off',
    '### Instrucciones de Cuidado Posterior

**Primeros Días:**
- Su hijo puede sentir una ligera presión o incomodidad — esto es normal y se resuelve rápidamente
- Fomente alimentos blandos el primer día
- Evite dulces pegajosos o masticables (caramelos, chicle) que pueden desprender el aparato

**Cuidado Continuo:**
- Cepille alrededor del mantenedor de espacio cuidadosamente en cada cepillado
- Evite alimentos duros y crujientes que podrían doblar o romper el aparato
- No empuje ni tire del mantenedor con los dedos o la lengua
- Asista a todas las citas de seguimiento programadas
- Contacte a su dentista si el mantenedor se afloja o se cae',
    '[
        {
            "q": "At what age does my child need a space maintainer?",
            "a": "Space maintainers are typically placed in children between ages 3 and 12, whenever a baby tooth is lost prematurely and the permanent tooth is not yet ready to come in."
        },
        {
            "q": "How long does the space maintainer stay in?",
            "a": "It remains in place until the permanent tooth is ready to erupt, which can be months to a few years depending on your child''s development."
        },
        {
            "q": "Will it hurt my child?",
            "a": "No, placement is painless and non-invasive. Your child may need a day or two to get used to the feel of the appliance, but it should not cause pain."
        },
        {
            "q": "What happens if the space maintainer falls out?",
            "a": "Contact your dentist as soon as possible. Keep the appliance if you can find it, and schedule an appointment to have it recemented or replaced."
        }
    ]'::JSONB,
    '[
        {
            "q": "¿A qué edad necesita mi hijo un mantenedor de espacio?",
            "a": "Los mantenedores de espacio generalmente se colocan en niños entre 3 y 12 años, cuando un diente de leche se pierde prematuramente y el diente permanente aún no está listo para salir."
        },
        {
            "q": "¿Cuánto tiempo permanece el mantenedor de espacio?",
            "a": "Permanece en su lugar hasta que el diente permanente esté listo para erupcionar, lo cual puede ser de meses a algunos años dependiendo del desarrollo de su hijo."
        },
        {
            "q": "¿Le dolerá a mi hijo?",
            "a": "No, la colocación es indolora y no invasiva. Su hijo puede necesitar uno o dos días para acostumbrarse a la sensación del aparato, pero no debería causar dolor."
        },
        {
            "q": "¿Qué pasa si el mantenedor de espacio se cae?",
            "a": "Contacte a su dentista lo antes posible. Guarde el aparato si puede encontrarlo y programe una cita para que lo recementen o reemplacen."
        }
    ]'::JSONB,
    '15-30 minutes per visit',
    '2-3 visits (impressions, fitting, follow-ups)',
    '{"heroKey": "space-maintainer-hero", "stepKeys": ["space-maintainer-impressions", "space-maintainer-fitting", "space-maintainer-followup"]}'::JSONB,
    'pediatric',
    true
),
(
    'tmj-treatment',
    'TMJ/TMD Treatment',
    'Tratamiento de ATM/DTM',
    'TMJ treatment addresses disorders of the temporomandibular joint — the hinge connecting your jaw to your skull. Treatment may include oral appliances, therapy, medication, or other interventions to relieve jaw pain, clicking, locking, and headaches.',
    'El tratamiento de ATM aborda los trastornos de la articulación temporomandibular — la bisagra que conecta su mandíbula con su cráneo. El tratamiento puede incluir aparatos orales, terapia, medicación u otras intervenciones para aliviar el dolor de mandíbula, chasquidos, bloqueos y dolores de cabeza.',
    '### Why You Need TMJ Treatment

TMJ disorders (TMD) affect the jaw joint and surrounding muscles, causing pain and dysfunction that can significantly impact daily life. Without treatment, symptoms often worsen over time.

**Common Symptoms Treated:**
- Jaw pain, tenderness, or aching around the ear
- Clicking, popping, or grating sounds when opening or closing the mouth
- Difficulty or pain while chewing
- Jaw locking in the open or closed position
- Chronic headaches, earaches, or neck pain
- Teeth grinding or clenching (bruxism)',
    '### Por Qué Necesita Tratamiento de ATM

Los trastornos de ATM (DTM) afectan la articulación de la mandíbula y los músculos circundantes, causando dolor y disfunción que pueden impactar significativamente la vida diaria. Sin tratamiento, los síntomas a menudo empeoran con el tiempo.

**Síntomas Comunes Tratados:**
- Dolor de mandíbula, sensibilidad o molestias alrededor del oído
- Chasquidos, estallidos o sonidos de rechinamiento al abrir o cerrar la boca
- Dificultad o dolor al masticar
- Bloqueo de la mandíbula en posición abierta o cerrada
- Dolores de cabeza crónicos, dolor de oído o dolor de cuello
- Rechinar o apretar los dientes (bruxismo)',
    NULL,
    NULL,
    '[
        {
            "stepTitle": "Comprehensive Evaluation",
            "stepBody": "Your dentist performs a thorough examination of your jaw joint, bite, and facial muscles. This includes checking range of motion, listening for joint sounds, and identifying areas of pain or tenderness.",
            "imageKey": "tmj-evaluation"
        },
        {
            "stepTitle": "Diagnostic Imaging",
            "stepBody": "X-rays, panoramic images, or a CBCT scan may be taken to visualize the jaw joint structure, check for bone changes, and rule out other conditions. An MRI may be ordered for soft tissue evaluation.",
            "imageKey": "tmj-imaging"
        },
        {
            "stepTitle": "Treatment Plan Development",
            "stepBody": "Based on your diagnosis, a personalized treatment plan is created. This may include a custom oral appliance (night guard or splint), physical therapy exercises, medication, stress management techniques, or a combination of approaches.",
            "imageKey": "tmj-planning"
        },
        {
            "stepTitle": "Appliance Fitting & Therapy",
            "stepBody": "If an oral appliance is prescribed, impressions are taken and a custom device is fabricated. At a follow-up visit, the appliance is fitted and adjusted. Your dentist teaches you jaw exercises and self-care techniques to manage symptoms.",
            "imageKey": "tmj-appliance"
        }
    ]'::JSONB,
    '[
        {
            "stepTitle": "Evaluación Integral",
            "stepBody": "Su dentista realiza un examen exhaustivo de su articulación mandibular, mordida y músculos faciales. Esto incluye verificar el rango de movimiento, escuchar sonidos articulares e identificar áreas de dolor o sensibilidad.",
            "imageKey": "tmj-evaluation"
        },
        {
            "stepTitle": "Imágenes Diagnósticas",
            "stepBody": "Se pueden tomar radiografías, imágenes panorámicas o una tomografía CBCT para visualizar la estructura de la articulación mandibular, verificar cambios óseos y descartar otras condiciones. Se puede ordenar una resonancia magnética para evaluación de tejidos blandos.",
            "imageKey": "tmj-imaging"
        },
        {
            "stepTitle": "Desarrollo del Plan de Tratamiento",
            "stepBody": "Basándose en su diagnóstico, se crea un plan de tratamiento personalizado. Esto puede incluir un aparato oral personalizado (protector nocturno o férula), ejercicios de fisioterapia, medicación, técnicas de manejo del estrés o una combinación de enfoques.",
            "imageKey": "tmj-planning"
        },
        {
            "stepTitle": "Colocación de Aparato y Terapia",
            "stepBody": "Si se prescribe un aparato oral, se toman impresiones y se fabrica un dispositivo personalizado. En una visita de seguimiento, el aparato se ajusta y se adapta. Su dentista le enseña ejercicios mandibulares y técnicas de autocuidado para manejar los síntomas.",
            "imageKey": "tmj-appliance"
        }
    ]'::JSONB,
    'No anesthesia is typically needed for TMJ evaluation and appliance fitting. If trigger point injections or other interventional treatments are recommended, local anesthesia may be used.',
    'Generalmente no se necesita anestesia para la evaluación de ATM y la colocación de aparatos. Si se recomiendan inyecciones en puntos gatillo u otros tratamientos intervencionistas, se puede usar anestesia local.',
    '**Possible considerations:**
- Adjustment period when wearing an oral appliance
- Temporary changes in bite while muscles adapt
- Jaw exercises may cause mild soreness initially
- Some treatments require ongoing commitment for best results',
    '**Posibles consideraciones:**
- Período de adaptación al usar un aparato oral
- Cambios temporales en la mordida mientras los músculos se adaptan
- Los ejercicios mandibulares pueden causar leves molestias inicialmente
- Algunos tratamientos requieren compromiso continuo para mejores resultados',
    '### Aftercare Instructions

**Daily Self-Care:**
- Apply moist heat or ice packs to the jaw area as directed (15-20 minutes at a time)
- Eat soft foods and cut food into small pieces
- Avoid extreme jaw movements (wide yawning, loud singing, gum chewing)
- Practice relaxation techniques to reduce jaw clenching

**Appliance Care:**
- Wear your oral appliance as directed (typically during sleep)
- Clean the appliance daily with a toothbrush and cool water
- Bring it to every dental appointment for adjustment
- Store in its protective case when not in use

**Exercises:**
- Perform prescribed jaw stretching and strengthening exercises daily
- Maintain good posture, especially when working at a desk
- Avoid resting your chin on your hand',
    '### Instrucciones de Cuidado Posterior

**Autocuidado Diario:**
- Aplique calor húmedo o compresas de hielo en el área de la mandíbula según las indicaciones (15-20 minutos a la vez)
- Coma alimentos blandos y corte la comida en trozos pequeños
- Evite movimientos extremos de la mandíbula (bostezos amplios, cantar fuerte, masticar chicle)
- Practique técnicas de relajación para reducir el apretamiento de la mandíbula

**Cuidado del Aparato:**
- Use su aparato oral según las indicaciones (generalmente durante el sueño)
- Limpie el aparato diariamente con un cepillo de dientes y agua fría
- Llévelo a cada cita dental para ajustes
- Guárdelo en su estuche protector cuando no esté en uso

**Ejercicios:**
- Realice los ejercicios de estiramiento y fortalecimiento mandibular prescritos diariamente
- Mantenga una buena postura, especialmente al trabajar en un escritorio
- Evite apoyar la barbilla en su mano',
    '[
        {
            "q": "What causes TMJ disorders?",
            "a": "TMJ disorders can result from jaw injury, arthritis, teeth grinding (bruxism), stress, misaligned bite, or a combination of factors. In many cases, the exact cause is difficult to determine."
        },
        {
            "q": "How long does TMJ treatment take?",
            "a": "Treatment duration varies widely. Some patients find relief within weeks, while others may need several months of appliance therapy and exercises. Your dentist will monitor progress and adjust the plan."
        },
        {
            "q": "Will I need surgery?",
            "a": "Surgery is rarely needed for TMJ disorders. Most cases respond well to conservative treatments like oral appliances, physical therapy, and lifestyle modifications. Surgery is only considered when other options have not provided relief."
        },
        {
            "q": "Can TMJ disorders go away on their own?",
            "a": "Some mild cases may improve with self-care alone. However, persistent or worsening symptoms should be evaluated and treated to prevent chronic pain and joint damage."
        }
    ]'::JSONB,
    '[
        {
            "q": "¿Qué causa los trastornos de ATM?",
            "a": "Los trastornos de ATM pueden resultar de lesión mandibular, artritis, rechinar de dientes (bruxismo), estrés, mordida desalineada o una combinación de factores. En muchos casos, la causa exacta es difícil de determinar."
        },
        {
            "q": "¿Cuánto tiempo dura el tratamiento de ATM?",
            "a": "La duración del tratamiento varía ampliamente. Algunos pacientes encuentran alivio en semanas, mientras que otros pueden necesitar varios meses de terapia con aparatos y ejercicios. Su dentista monitoreará el progreso y ajustará el plan."
        },
        {
            "q": "¿Necesitaré cirugía?",
            "a": "La cirugía rara vez es necesaria para los trastornos de ATM. La mayoría de los casos responden bien a tratamientos conservadores como aparatos orales, fisioterapia y modificaciones del estilo de vida. La cirugía solo se considera cuando otras opciones no han proporcionado alivio."
        },
        {
            "q": "¿Pueden los trastornos de ATM desaparecer por sí solos?",
            "a": "Algunos casos leves pueden mejorar solo con autocuidado. Sin embargo, los síntomas persistentes o que empeoran deben ser evaluados y tratados para prevenir dolor crónico y daño articular."
        }
    ]'::JSONB,
    '30-60 minutes per visit',
    '3-6 visits over several months',
    '{"heroKey": "tmj-hero", "stepKeys": ["tmj-evaluation", "tmj-imaging", "tmj-planning", "tmj-appliance"]}'::JSONB,
    'restorative',
    true
),
(
    'sleep-apnea-appliance',
    'Sleep Apnea Oral Appliance',
    'Aparato Oral para Apnea del Sueño',
    'A sleep apnea oral appliance is a custom-fitted dental device worn during sleep to treat obstructive sleep apnea (OSA) and snoring. It works by repositioning the lower jaw and tongue forward to keep the airway open during sleep.',
    'Un aparato oral para apnea del sueño es un dispositivo dental hecho a medida que se usa durante el sueño para tratar la apnea obstructiva del sueño (AOS) y los ronquidos. Funciona reposicionando la mandíbula inferior y la lengua hacia adelante para mantener las vías respiratorias abiertas durante el sueño.',
    '### Why You Need a Sleep Apnea Appliance

Obstructive sleep apnea causes repeated pauses in breathing during sleep, reducing oxygen levels and disrupting rest. Left untreated, it increases the risk of serious health problems.

**Key Reasons for Treatment:**
- Reduce or eliminate snoring
- Prevent dangerous breathing pauses during sleep
- Improve sleep quality and daytime energy
- Lower risk of high blood pressure, heart disease, and stroke
- Alternative to CPAP for mild to moderate sleep apnea
- Improve concentration, mood, and overall quality of life',
    '### Por Qué Necesita un Aparato para Apnea del Sueño

La apnea obstructiva del sueño causa pausas repetidas en la respiración durante el sueño, reduciendo los niveles de oxígeno e interrumpiendo el descanso. Sin tratamiento, aumenta el riesgo de problemas de salud graves.

**Razones Clave para el Tratamiento:**
- Reducir o eliminar los ronquidos
- Prevenir pausas peligrosas de la respiración durante el sueño
- Mejorar la calidad del sueño y la energía diurna
- Reducir el riesgo de hipertensión arterial, enfermedades cardíacas y accidentes cerebrovasculares
- Alternativa al CPAP para apnea del sueño leve a moderada
- Mejorar la concentración, el ánimo y la calidad de vida general',
    'Without treatment, obstructive sleep apnea can lead to chronic fatigue, high blood pressure, heart disease, stroke, type 2 diabetes, and increased risk of accidents due to daytime drowsiness. The condition typically worsens over time without intervention.',
    'Sin tratamiento, la apnea obstructiva del sueño puede llevar a fatiga crónica, hipertensión arterial, enfermedades cardíacas, accidentes cerebrovasculares, diabetes tipo 2 y mayor riesgo de accidentes debido a la somnolencia diurna. La condición generalmente empeora con el tiempo sin intervención.',
    '[
        {
            "stepTitle": "Sleep Evaluation & Diagnosis",
            "stepBody": "Your dentist works with your physician to review your sleep study results and confirm the diagnosis. Your oral anatomy, jaw structure, and airway are evaluated to determine if an oral appliance is the right treatment for you.",
            "imageKey": "sleep-apnea-evaluation"
        },
        {
            "stepTitle": "Impressions & Bite Registration",
            "stepBody": "Detailed impressions or digital scans of your upper and lower teeth are taken, along with a bite registration. These are sent to a dental laboratory to fabricate your custom mandibular advancement device.",
            "imageKey": "sleep-apnea-impressions"
        },
        {
            "stepTitle": "Appliance Fitting & Calibration",
            "stepBody": "Your custom appliance is fitted and the jaw advancement is set to an initial position. Your dentist ensures proper fit, comfort, and that you can open and close your mouth naturally. Instructions for use and care are provided.",
            "imageKey": "sleep-apnea-fitting"
        },
        {
            "stepTitle": "Follow-Up & Adjustment",
            "stepBody": "At follow-up visits, the appliance advancement is gradually adjusted for optimal effectiveness. A follow-up sleep study may be recommended to confirm the appliance is adequately treating your sleep apnea. Ongoing monitoring ensures continued success.",
            "imageKey": "sleep-apnea-followup"
        }
    ]'::JSONB,
    '[
        {
            "stepTitle": "Evaluación y Diagnóstico del Sueño",
            "stepBody": "Su dentista trabaja con su médico para revisar los resultados de su estudio del sueño y confirmar el diagnóstico. Se evalúan su anatomía oral, estructura mandibular y vías respiratorias para determinar si un aparato oral es el tratamiento adecuado para usted.",
            "imageKey": "sleep-apnea-evaluation"
        },
        {
            "stepTitle": "Impresiones y Registro de Mordida",
            "stepBody": "Se toman impresiones detalladas o escaneos digitales de sus dientes superiores e inferiores, junto con un registro de mordida. Estos se envían a un laboratorio dental para fabricar su dispositivo de avance mandibular personalizado.",
            "imageKey": "sleep-apnea-impressions"
        },
        {
            "stepTitle": "Colocación y Calibración del Aparato",
            "stepBody": "Su aparato personalizado se coloca y el avance mandibular se establece en una posición inicial. Su dentista asegura el ajuste adecuado, la comodidad y que pueda abrir y cerrar la boca naturalmente. Se proporcionan instrucciones de uso y cuidado.",
            "imageKey": "sleep-apnea-fitting"
        },
        {
            "stepTitle": "Seguimiento y Ajuste",
            "stepBody": "En las visitas de seguimiento, el avance del aparato se ajusta gradualmente para una efectividad óptima. Se puede recomendar un estudio del sueño de seguimiento para confirmar que el aparato está tratando adecuadamente su apnea del sueño. El monitoreo continuo asegura el éxito continuado.",
            "imageKey": "sleep-apnea-followup"
        }
    ]'::JSONB,
    'No anesthesia is needed. The evaluation, impression-taking, and appliance fitting are all non-invasive and painless procedures.',
    'No se necesita anestesia. La evaluación, la toma de impresiones y la colocación del aparato son procedimientos no invasivos e indoloros.',
    '**Possible considerations:**
- Temporary jaw soreness or stiffness in the morning
- Excess salivation or dry mouth initially
- Temporary changes in bite that usually resolve after removing the appliance
- Tooth movement with long-term use (monitored at follow-ups)',
    '**Posibles consideraciones:**
- Dolor o rigidez temporal de la mandíbula por la mañana
- Salivación excesiva o boca seca inicialmente
- Cambios temporales en la mordida que generalmente se resuelven al retirar el aparato
- Movimiento dental con uso a largo plazo (monitoreado en seguimientos)',
    '### Aftercare Instructions

**Daily Use:**
- Wear the appliance every night during sleep
- Insert the appliance just before going to bed
- In the morning, remove and perform any prescribed jaw exercises to normalize your bite

**Appliance Care:**
- Clean the appliance each morning with a toothbrush and cool water or mild soap
- Do not use hot water as it may warp the material
- Store in the provided case during the day
- Soak weekly in a denture cleaner or appliance cleaning solution

**Ongoing Monitoring:**
- Attend all follow-up appointments for adjustments
- Report any persistent jaw pain, bite changes, or tooth discomfort
- A follow-up sleep study may be needed to verify treatment effectiveness
- Bring the appliance to every dental visit',
    '### Instrucciones de Cuidado Posterior

**Uso Diario:**
- Use el aparato todas las noches durante el sueño
- Inserte el aparato justo antes de acostarse
- Por la mañana, retírelo y realice los ejercicios mandibulares prescritos para normalizar su mordida

**Cuidado del Aparato:**
- Limpie el aparato cada mañana con un cepillo de dientes y agua fría o jabón suave
- No use agua caliente ya que puede deformar el material
- Guárdelo en el estuche proporcionado durante el día
- Remoje semanalmente en un limpiador de dentaduras o solución de limpieza de aparatos

**Monitoreo Continuo:**
- Asista a todas las citas de seguimiento para ajustes
- Reporte cualquier dolor mandibular persistente, cambios en la mordida o molestias dentales
- Puede ser necesario un estudio del sueño de seguimiento para verificar la efectividad del tratamiento
- Lleve el aparato a cada visita dental',
    '[
        {
            "q": "Is an oral appliance as effective as a CPAP machine?",
            "a": "For mild to moderate obstructive sleep apnea, oral appliances are often comparable to CPAP in effectiveness. For severe cases, CPAP may be more effective, but an oral appliance is a good alternative for patients who cannot tolerate CPAP."
        },
        {
            "q": "How long does it take to get used to wearing the appliance?",
            "a": "Most patients adapt within 1-2 weeks. Initial nights may feel unusual, but comfort improves quickly as your jaw adjusts to the new position."
        },
        {
            "q": "Will the appliance stop my snoring?",
            "a": "In most cases, yes. The appliance advances the jaw forward, which opens the airway and significantly reduces or eliminates snoring."
        },
        {
            "q": "How long does the appliance last?",
            "a": "A well-maintained oral appliance typically lasts 3-5 years. Your dentist will monitor its condition at regular checkups and recommend replacement when needed."
        }
    ]'::JSONB,
    '[
        {
            "q": "¿Es un aparato oral tan efectivo como una máquina CPAP?",
            "a": "Para la apnea obstructiva del sueño leve a moderada, los aparatos orales son frecuentemente comparables al CPAP en efectividad. Para casos severos, el CPAP puede ser más efectivo, pero un aparato oral es una buena alternativa para pacientes que no toleran el CPAP."
        },
        {
            "q": "¿Cuánto tiempo toma acostumbrarse a usar el aparato?",
            "a": "La mayoría de los pacientes se adaptan en 1-2 semanas. Las primeras noches pueden sentirse inusuales, pero la comodidad mejora rápidamente a medida que su mandíbula se ajusta a la nueva posición."
        },
        {
            "q": "¿El aparato detendrá mis ronquidos?",
            "a": "En la mayoría de los casos, sí. El aparato avanza la mandíbula hacia adelante, lo que abre las vías respiratorias y reduce significativamente o elimina los ronquidos."
        },
        {
            "q": "¿Cuánto dura el aparato?",
            "a": "Un aparato oral bien mantenido generalmente dura de 3 a 5 años. Su dentista monitoreará su condición en chequeos regulares y recomendará el reemplazo cuando sea necesario."
        }
    ]'::JSONB,
    '30-45 minutes per visit',
    '3-4 visits over 4-6 weeks',
    '{"heroKey": "sleep-apnea-hero", "stepKeys": ["sleep-apnea-evaluation", "sleep-apnea-impressions", "sleep-apnea-fitting", "sleep-apnea-followup"]}'::JSONB,
    'restorative',
    true
),
(
    'emergency-palliative',
    'Emergency/Palliative Dental Treatment',
    'Tratamiento Dental de Emergencia/Paliativo',
    'Emergency palliative treatment provides immediate relief from acute dental pain, infection, or trauma. The goal is to stabilize the situation, manage pain, and address the urgent issue until a definitive treatment can be completed.',
    'El tratamiento paliativo de emergencia proporciona alivio inmediato del dolor dental agudo, infección o trauma. El objetivo es estabilizar la situación, manejar el dolor y abordar el problema urgente hasta que se pueda completar un tratamiento definitivo.',
    '### Why You Need Emergency Dental Treatment

Dental emergencies can involve severe pain, swelling, bleeding, or trauma that requires immediate attention. Prompt treatment prevents complications and provides relief.

**Common Emergency Situations:**
- Severe toothache or throbbing pain
- Dental abscess with swelling or fever
- Broken, cracked, or knocked-out tooth
- Lost filling or crown
- Soft tissue injury (cut lip, tongue, or cheek)
- Uncontrolled bleeding after a dental procedure',
    '### Por Qué Necesita Tratamiento Dental de Emergencia

Las emergencias dentales pueden involucrar dolor severo, hinchazón, sangrado o trauma que requiere atención inmediata. El tratamiento oportuno previene complicaciones y proporciona alivio.

**Situaciones de Emergencia Comunes:**
- Dolor de muelas severo o dolor pulsante
- Absceso dental con hinchazón o fiebre
- Diente roto, agrietado o desalojado
- Relleno o corona perdida
- Lesión de tejido blando (labio, lengua o mejilla cortada)
- Sangrado incontrolado después de un procedimiento dental',
    NULL,
    NULL,
    '[
        {
            "stepTitle": "Assessment & Diagnosis",
            "stepBody": "The dentist quickly evaluates your condition, examining the affected area, taking X-rays if needed, and determining the source and severity of the problem. Vital signs may be checked if infection or trauma is significant.",
            "imageKey": "emergency-assessment"
        },
        {
            "stepTitle": "Pain Management",
            "stepBody": "Immediate steps are taken to relieve your pain. This may include local anesthesia to numb the area, prescription pain medication, or draining an abscess. The goal is to make you comfortable as quickly as possible.",
            "imageKey": "emergency-pain"
        },
        {
            "stepTitle": "Temporary Treatment & Stabilization",
            "stepBody": "A temporary fix is applied to stabilize the situation. This may include a temporary filling, re-cementing a crown, splinting a loose tooth, prescribing antibiotics for infection, or providing wound care for soft tissue injuries. A follow-up plan for definitive treatment is discussed.",
            "imageKey": "emergency-treatment"
        }
    ]'::JSONB,
    '[
        {
            "stepTitle": "Evaluación y Diagnóstico",
            "stepBody": "El dentista evalúa rápidamente su condición, examina el área afectada, toma radiografías si es necesario y determina la fuente y severidad del problema. Se pueden verificar los signos vitales si la infección o el trauma es significativo.",
            "imageKey": "emergency-assessment"
        },
        {
            "stepTitle": "Manejo del Dolor",
            "stepBody": "Se toman medidas inmediatas para aliviar su dolor. Esto puede incluir anestesia local para adormecer el área, medicación para el dolor con receta, o drenar un absceso. El objetivo es hacerlo sentir cómodo lo más rápido posible.",
            "imageKey": "emergency-pain"
        },
        {
            "stepTitle": "Tratamiento Temporal y Estabilización",
            "stepBody": "Se aplica una solución temporal para estabilizar la situación. Esto puede incluir un relleno temporal, recementar una corona, ferulizar un diente suelto, recetar antibióticos para la infección, o proporcionar cuidado de heridas para lesiones de tejidos blandos. Se discute un plan de seguimiento para el tratamiento definitivo.",
            "imageKey": "emergency-treatment"
        }
    ]'::JSONB,
    'Local anesthesia is commonly administered to provide immediate pain relief. The type and amount depend on the emergency situation and the treatment required.',
    'La anestesia local se administra comúnmente para proporcionar alivio inmediato del dolor. El tipo y la cantidad dependen de la situación de emergencia y el tratamiento requerido.',
    NULL,
    NULL,
    '### Aftercare Instructions

**Immediately After Treatment:**
- Take all prescribed medications (pain relievers, antibiotics) as directed
- Apply ice packs externally to reduce swelling (20 min on, 20 min off)
- Eat soft foods and avoid chewing on the treated side
- Avoid very hot or cold foods and beverages

**Important Reminders:**
- Keep the follow-up appointment for definitive treatment — emergency care is temporary
- If pain worsens, swelling increases, or fever develops, contact your dentist immediately or visit an emergency room
- Do not ignore a temporary fix — the underlying problem still needs permanent treatment
- Continue gentle brushing and flossing in non-affected areas

**For Knocked-Out Teeth:**
- If a permanent tooth is knocked out, place it in milk or saline and see a dentist within 30 minutes for the best chance of reimplantation',
    '### Instrucciones de Cuidado Posterior

**Inmediatamente Después del Tratamiento:**
- Tome todos los medicamentos recetados (analgésicos, antibióticos) según las indicaciones
- Aplique compresas de hielo externamente para reducir la hinchazón (20 min sí, 20 min no)
- Coma alimentos blandos y evite masticar del lado tratado
- Evite alimentos y bebidas muy calientes o fríos

**Recordatorios Importantes:**
- Asista a la cita de seguimiento para el tratamiento definitivo — la atención de emergencia es temporal
- Si el dolor empeora, la hinchazón aumenta o se desarrolla fiebre, contacte a su dentista inmediatamente o visite una sala de emergencias
- No ignore una solución temporal — el problema subyacente aún necesita tratamiento permanente
- Continúe el cepillado suave y el uso de hilo dental en las áreas no afectadas

**Para Dientes Desalojados:**
- Si un diente permanente es desalojado, colóquelo en leche o solución salina y vea a un dentista dentro de 30 minutos para la mejor oportunidad de reimplantación',
    '[
        {
            "q": "What counts as a dental emergency?",
            "a": "Severe pain, uncontrolled bleeding, facial swelling, knocked-out teeth, and broken teeth with exposed nerves are all dental emergencies. When in doubt, call your dentist — they can advise if you need immediate care."
        },
        {
            "q": "Will the emergency treatment fix the problem permanently?",
            "a": "Emergency treatment is designed to provide immediate relief and stabilize the situation. A follow-up appointment is needed for definitive treatment such as a root canal, crown, extraction, or other permanent solution."
        },
        {
            "q": "How much does emergency dental treatment cost?",
            "a": "Costs vary based on the type of emergency and treatment provided. Many dental insurance plans cover emergency visits. Ask your dental office about costs and payment options when you call."
        },
        {
            "q": "Should I go to the emergency room or the dentist?",
            "a": "For dental-specific problems (toothache, lost filling, broken tooth), your dentist is the best option. Go to the ER for facial trauma with possible fractures, uncontrolled bleeding, or swelling that affects breathing or swallowing."
        }
    ]'::JSONB,
    '[
        {
            "q": "¿Qué cuenta como una emergencia dental?",
            "a": "Dolor severo, sangrado incontrolado, hinchazón facial, dientes desalojados y dientes rotos con nervios expuestos son todas emergencias dentales. En caso de duda, llame a su dentista — pueden aconsejarle si necesita atención inmediata."
        },
        {
            "q": "¿El tratamiento de emergencia arreglará el problema permanentemente?",
            "a": "El tratamiento de emergencia está diseñado para proporcionar alivio inmediato y estabilizar la situación. Se necesita una cita de seguimiento para el tratamiento definitivo como un tratamiento de conducto, corona, extracción u otra solución permanente."
        },
        {
            "q": "¿Cuánto cuesta el tratamiento dental de emergencia?",
            "a": "Los costos varían según el tipo de emergencia y el tratamiento proporcionado. Muchos planes de seguro dental cubren las visitas de emergencia. Pregunte en su consultorio dental sobre costos y opciones de pago cuando llame."
        },
        {
            "q": "¿Debo ir a la sala de emergencias o al dentista?",
            "a": "Para problemas específicamente dentales (dolor de muelas, relleno perdido, diente roto), su dentista es la mejor opción. Vaya a la sala de emergencias por trauma facial con posibles fracturas, sangrado incontrolado o hinchazón que afecte la respiración o la deglución."
        }
    ]'::JSONB,
    '20-45 minutes',
    '1 emergency visit + follow-up for definitive care',
    '{"heroKey": "emergency-hero", "stepKeys": ["emergency-assessment", "emergency-pain", "emergency-treatment"]}'::JSONB,
    'emergency',
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

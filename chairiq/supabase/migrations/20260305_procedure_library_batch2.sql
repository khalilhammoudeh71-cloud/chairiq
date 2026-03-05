-- Location: supabase/migrations/20260305_procedure_library_batch2.sql
-- Schema Analysis: Inserting into procedure_library table (existing)
-- Integration Type: Data seeding - Batch 2 educational content
-- Dependencies: procedure_library table, canonical_procedures table

-- =====================================================
-- PROCEDURE LIBRARY - BATCH 2
-- Night Guard, Bone Graft, Sinus Lift, Dental Sealant, Fluoride Treatment
-- Complete bilingual (EN + ES) Gold Standard content
-- 6th-8th grade reading level throughout
-- =====================================================

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

-- =====================================================
-- 1. NIGHT GUARD
-- =====================================================
(
    'night-guard',
    'Night Guard / Occlusal Splint',
    'Guarda Nocturna / Férula Oclusal',

    E'## What this is\n\nA night guard is a custom-made plastic tray that fits over your teeth. You wear it while you sleep to protect your teeth from grinding and clenching. Grinding your teeth at night (called bruxism) can wear down, crack, or break your teeth over time. A night guard acts like a cushion between your upper and lower teeth so they do not rub against each other.',

    E'## Qué es esto\n\nUna guarda nocturna es una bandeja de plástico hecha a medida que se ajusta sobre sus dientes. La usa mientras duerme para proteger sus dientes del rechinamiento y el apretamiento. Rechinar los dientes por la noche (llamado bruxismo) puede desgastar, agrietar o romper sus dientes con el tiempo. La guarda nocturna actúa como un cojín entre sus dientes superiores e inferiores para que no se froten entre sí.',

    E'## Why you may need it\n\nYou may need a night guard if:\n\n**You grind or clench your teeth at night**: Many people do this without knowing it\n\n**You wake up with jaw pain or headaches**: Grinding puts a lot of pressure on your jaw muscles\n\n**Your teeth show signs of wear**: Flat, chipped, or cracked teeth can be caused by grinding\n\n**You have TMJ problems**: Pain or clicking in your jaw joint\n\n**Your partner hears grinding sounds**: Loud grinding at night is a clear sign of bruxism',

    E'## Por qué puede necesitarla\n\nPuede necesitar una guarda nocturna si:\n\n**Rechina o aprieta los dientes por la noche**: Muchas personas lo hacen sin saberlo\n\n**Se despierta con dolor de mandíbula o dolores de cabeza**: El rechinamiento ejerce mucha presión sobre los músculos de la mandíbula\n\n**Sus dientes muestran signos de desgaste**: Los dientes planos, astillados o agrietados pueden ser causados por el rechinamiento\n\n**Tiene problemas de ATM**: Dolor o chasquidos en la articulación de la mandíbula\n\n**Su pareja escucha sonidos de rechinamiento**: El rechinamiento fuerte por la noche es una señal clara de bruxismo',

    NULL,
    NULL,

    jsonb_build_array(
        jsonb_build_object(
            'title', 'Step 1: Impressions',
            'description', E'**What we do**: We take a mold (impression) of your upper and lower teeth so the night guard fits you perfectly\n\n**What you may feel**: The impression material feels like soft putty and sits in your mouth for about 2 minutes\n\n**Why it matters**: A custom fit means the guard stays in place while you sleep and is comfortable to wear'
        ),
        jsonb_build_object(
            'title', 'Step 2: Lab Fabrication',
            'description', E'**What we do**: We send your impressions to a dental lab where your custom night guard is made from durable, medical-grade material\n\n**What you may feel**: Nothing - this happens at the lab over 1-2 weeks\n\n**Why it matters**: A lab-made guard is stronger and fits better than store-bought options'
        ),
        jsonb_build_object(
            'title', 'Step 3: Fitting and Adjustments',
            'description', E'**What we do**: You try on your new night guard and we make small adjustments so it fits perfectly and feels comfortable\n\n**What you may feel**: Slight pressure as we check your bite and trim any spots that feel tight\n\n**Why it matters**: A proper fit means you will actually wear it every night, which protects your teeth'
        )
    ),

    jsonb_build_array(
        jsonb_build_object(
            'title', 'Paso 1: Impresiones',
            'description', E'**Lo que hacemos**: Tomamos un molde (impresión) de sus dientes superiores e inferiores para que la guarda nocturna le quede perfectamente\n\n**Lo que puede sentir**: El material de impresión se siente como masilla suave y permanece en su boca por aproximadamente 2 minutos\n\n**Por qué importa**: Un ajuste personalizado significa que la guarda se mantiene en su lugar mientras duerme y es cómoda de usar'
        ),
        jsonb_build_object(
            'title', 'Paso 2: Fabricación en Laboratorio',
            'description', E'**Lo que hacemos**: Enviamos sus impresiones a un laboratorio dental donde su guarda nocturna personalizada se fabrica con material duradero de grado médico\n\n**Lo que puede sentir**: Nada - esto ocurre en el laboratorio durante 1-2 semanas\n\n**Por qué importa**: Una guarda hecha en laboratorio es más fuerte y se ajusta mejor que las opciones de venta libre'
        ),
        jsonb_build_object(
            'title', 'Paso 3: Prueba y Ajustes',
            'description', E'**Lo que hacemos**: Se prueba su nueva guarda nocturna y hacemos pequeños ajustes para que quede perfecta y se sienta cómoda\n\n**Lo que puede sentir**: Ligera presión mientras revisamos su mordida y recortamos cualquier punto que se sienta apretado\n\n**Por qué importa**: Un ajuste adecuado significa que realmente la usará cada noche, lo que protege sus dientes'
        )
    ),

    NULL,
    NULL,

    NULL,
    NULL,

    E'## How to care for your night guard\n\n### Daily care\n- Rinse your night guard with cool water every morning after use\n- Brush it gently with a soft toothbrush and mild soap (not toothpaste, which can scratch it)\n- Let it air dry completely before storing it in its case\n- Keep it in a hard ventilated case when not in use\n\n### Weekly care\n- Soak it once a week in a denture cleaner or a mix of water and white vinegar for 15-30 minutes\n- Rinse thoroughly after soaking\n\n### Important tips\n- Bring your night guard to every dental visit so we can check it\n- Do not leave it in hot water, a hot car, or direct sunlight (heat can warp the plastic)\n- Replace it when it shows signs of wear (usually every 3-5 years)\n- If it cracks or no longer fits well, call us for a replacement',

    E'## Cómo cuidar su guarda nocturna\n\n### Cuidado diario\n- Enjuague su guarda nocturna con agua fría cada mañana después de usarla\n- Cepíllela suavemente con un cepillo de dientes suave y jabón suave (no pasta de dientes, ya que puede rayarla)\n- Déjela secar al aire completamente antes de guardarla en su estuche\n- Guárdela en un estuche duro ventilado cuando no la use\n\n### Cuidado semanal\n- Remójela una vez a la semana en un limpiador de dentaduras o una mezcla de agua y vinagre blanco por 15-30 minutos\n- Enjuague bien después de remojar\n\n### Consejos importantes\n- Traiga su guarda nocturna a cada visita dental para que podamos revisarla\n- No la deje en agua caliente, un auto caliente o luz solar directa (el calor puede deformar el plástico)\n- Reemplácela cuando muestre signos de desgaste (generalmente cada 3-5 años)\n- Si se agrieta o ya no le queda bien, llámenos para un reemplazo',

    jsonb_build_array(
        jsonb_build_object('q', 'Will the night guard be uncomfortable?', 'a', 'It may feel a little strange for the first few nights, but most people get used to it within a week. A custom-made guard fits much better than store-bought ones.'),
        jsonb_build_object('q', 'How long does a night guard last?', 'a', 'With proper care, a custom night guard typically lasts 3 to 5 years. Heavy grinders may need a replacement sooner.'),
        jsonb_build_object('q', 'Can I use a store-bought night guard instead?', 'a', 'Store-bought guards are thinner and do not fit as well. A custom guard from your dentist provides better protection and is more comfortable for nightly use.'),
        jsonb_build_object('q', 'Will wearing a night guard stop my grinding?', 'a', 'The guard does not stop you from grinding, but it protects your teeth from the damage grinding causes. Think of it as a shield for your teeth.'),
        jsonb_build_object('q', 'Do I wear it on the top or bottom teeth?', 'a', 'Most night guards are made for the upper teeth, but your dentist will decide which works best for you based on your bite.')
    ),

    jsonb_build_array(
        jsonb_build_object('q', '¿Será incómoda la guarda nocturna?', 'a', 'Puede sentirse un poco extraña las primeras noches, pero la mayoría de las personas se acostumbran en una semana. Una guarda hecha a medida se ajusta mucho mejor que las compradas en tienda.'),
        jsonb_build_object('q', '¿Cuánto dura una guarda nocturna?', 'a', 'Con el cuidado adecuado, una guarda nocturna personalizada típicamente dura de 3 a 5 años. Las personas que rechinan mucho pueden necesitar un reemplazo antes.'),
        jsonb_build_object('q', '¿Puedo usar una guarda nocturna comprada en tienda?', 'a', 'Las guardas de tienda son más delgadas y no se ajustan tan bien. Una guarda personalizada de su dentista proporciona mejor protección y es más cómoda para uso nocturno.'),
        jsonb_build_object('q', '¿Usar una guarda nocturna detendrá mi rechinamiento?', 'a', 'La guarda no detiene el rechinamiento, pero protege sus dientes del daño que causa el rechinamiento. Piense en ella como un escudo para sus dientes.'),
        jsonb_build_object('q', '¿Se usa en los dientes de arriba o de abajo?', 'a', 'La mayoría de las guardas nocturnas se hacen para los dientes superiores, pero su dentista decidirá cuál funciona mejor para usted según su mordida.')
    ),

    '30 minutes per visit',
    '2 visits (impression + fitting)',
    '{"heroKey": "night-guard-hero", "stepKeys": ["night-guard-impression", "night-guard-fabrication", "night-guard-fitting"]}'::JSONB,
    'adjunctive',
    true
),

-- =====================================================
-- 2. BONE GRAFT
-- =====================================================
(
    'bone-graft',
    'Bone Grafting',
    'Injerto Óseo',

    E'## What this is\n\nBone grafting is a procedure where we add bone material to your jaw to rebuild areas where bone has been lost. Your jaw bone can shrink after losing a tooth, from gum disease, or from infection. A bone graft helps grow new bone so your jaw is strong enough to support dental implants or to keep your remaining teeth stable.',

    E'## Qué es esto\n\nEl injerto óseo es un procedimiento en el que agregamos material óseo a su mandíbula para reconstruir áreas donde se ha perdido hueso. El hueso de su mandíbula puede encogerse después de perder un diente, por enfermedad de las encías o por infección. Un injerto óseo ayuda a crecer hueso nuevo para que su mandíbula sea lo suficientemente fuerte para soportar implantes dentales o para mantener estables sus dientes restantes.',

    E'## Why you may need it\n\nYou may need a bone graft if:\n\n**You want a dental implant**: Implants need a strong, thick jawbone to hold them in place. If your bone is too thin or soft, a graft builds it up first\n\n**You lost a tooth**: When a tooth is missing, the bone underneath starts to shrink. A graft preserves the bone for future treatment\n\n**You have gum disease**: Advanced periodontal disease can destroy the bone around your teeth. A graft can help rebuild it\n\n**Your dentures do not fit well**: Bone loss can change the shape of your jaw, making dentures loose',

    E'## Por qué puede necesitarlo\n\nPuede necesitar un injerto óseo si:\n\n**Quiere un implante dental**: Los implantes necesitan un hueso mandibular fuerte y grueso para mantenerlos en su lugar. Si su hueso es demasiado delgado o blando, un injerto lo reconstruye primero\n\n**Perdió un diente**: Cuando falta un diente, el hueso debajo comienza a encogerse. Un injerto preserva el hueso para tratamiento futuro\n\n**Tiene enfermedad de las encías**: La enfermedad periodontal avanzada puede destruir el hueso alrededor de sus dientes. Un injerto puede ayudar a reconstruirlo\n\n**Sus dentaduras no le quedan bien**: La pérdida ósea puede cambiar la forma de su mandíbula, haciendo que las dentaduras queden flojas',

    E'## If you delay\n\nDelaying a bone graft can lead to:\n\n**More bone loss**: Bone continues to shrink over time, making future treatment harder\n\n**Cannot get an implant**: Without enough bone, placing an implant may not be possible later\n\n**Teeth shifting**: Nearby teeth can move into the gap left by the missing bone support\n\n**More complex surgery later**: The longer you wait, the more bone you lose, and the bigger the graft you will need\n\n**Higher cost**: A larger graft or additional procedures add to the total expense',

    E'## Si lo retrasa\n\nRetrasar un injerto óseo puede llevar a:\n\n**Más pérdida ósea**: El hueso continúa encogiéndose con el tiempo, haciendo más difícil el tratamiento futuro\n\n**No poder obtener un implante**: Sin suficiente hueso, colocar un implante puede no ser posible después\n\n**Dientes moviéndose**: Los dientes cercanos pueden moverse hacia el espacio dejado por la falta de soporte óseo\n\n**Cirugía más compleja después**: Cuanto más espere, más hueso pierde y más grande será el injerto que necesitará\n\n**Mayor costo**: Un injerto más grande o procedimientos adicionales aumentan el gasto total',

    jsonb_build_array(
        jsonb_build_object(
            'title', 'Step 1: Anesthesia',
            'description', E'**What we do**: We numb the area completely with local anesthesia so you feel no pain during the procedure\n\n**What you may feel**: A small pinch from the numbing injection, then the area goes numb within minutes\n\n**Why it matters**: You stay comfortable throughout the entire procedure'
        ),
        jsonb_build_object(
            'title', 'Step 2: Site Preparation',
            'description', E'**What we do**: We make a small incision in your gum to expose the bone underneath and clean the area\n\n**What you may feel**: Pressure but no pain since the area is numb\n\n**Why it matters**: A clean, prepared site helps the graft material bond with your existing bone'
        ),
        jsonb_build_object(
            'title', 'Step 3: Graft Placement',
            'description', E'**What we do**: We place the bone graft material into the area where bone is needed. The material may come from a tissue bank, animal source, or synthetic material\n\n**What you may feel**: Pressure as we pack the material into place\n\n**Why it matters**: The graft material acts as a scaffold for your body to grow new, natural bone'
        ),
        jsonb_build_object(
            'title', 'Step 4: Membrane Placement',
            'description', E'**What we do**: We place a thin protective membrane over the graft to hold it in place and keep soft tissue from growing into the bone area\n\n**What you may feel**: Nothing additional - this is a quick step\n\n**Why it matters**: The membrane protects the graft and guides proper bone growth'
        ),
        jsonb_build_object(
            'title', 'Step 5: Suturing',
            'description', E'**What we do**: We carefully close the gum tissue over the graft with stitches\n\n**What you may feel**: Slight tugging as we place the stitches\n\n**Why it matters**: Closing the site protects the graft while it heals and new bone grows'
        )
    ),

    jsonb_build_array(
        jsonb_build_object(
            'title', 'Paso 1: Anestesia',
            'description', E'**Lo que hacemos**: Adormecemos el área completamente con anestesia local para que no sienta dolor durante el procedimiento\n\n**Lo que puede sentir**: Un pequeño pinchazo de la inyección de anestesia, luego el área se adormece en minutos\n\n**Por qué importa**: Se mantiene cómodo durante todo el procedimiento'
        ),
        jsonb_build_object(
            'title', 'Paso 2: Preparación del Sitio',
            'description', E'**Lo que hacemos**: Hacemos una pequeña incisión en su encía para exponer el hueso debajo y limpiar el área\n\n**Lo que puede sentir**: Presión pero sin dolor ya que el área está adormecida\n\n**Por qué importa**: Un sitio limpio y preparado ayuda a que el material de injerto se una con su hueso existente'
        ),
        jsonb_build_object(
            'title', 'Paso 3: Colocación del Injerto',
            'description', E'**Lo que hacemos**: Colocamos el material de injerto óseo en el área donde se necesita hueso. El material puede provenir de un banco de tejidos, fuente animal o material sintético\n\n**Lo que puede sentir**: Presión mientras empacamos el material en su lugar\n\n**Por qué importa**: El material de injerto actúa como un andamio para que su cuerpo crezca hueso nuevo y natural'
        ),
        jsonb_build_object(
            'title', 'Paso 4: Colocación de Membrana',
            'description', E'**Lo que hacemos**: Colocamos una membrana protectora delgada sobre el injerto para mantenerlo en su lugar y evitar que el tejido blando crezca en el área del hueso\n\n**Lo que puede sentir**: Nada adicional - este es un paso rápido\n\n**Por qué importa**: La membrana protege el injerto y guía el crecimiento óseo adecuado'
        ),
        jsonb_build_object(
            'title', 'Paso 5: Sutura',
            'description', E'**Lo que hacemos**: Cerramos cuidadosamente el tejido de la encía sobre el injerto con puntos de sutura\n\n**Lo que puede sentir**: Ligero tirón mientras colocamos los puntos\n\n**Por qué importa**: Cerrar el sitio protege el injerto mientras sana y crece hueso nuevo'
        )
    ),

    'Local anesthesia is used to numb the surgical area completely. Sedation options are available if you feel anxious about the procedure.',
    'Se usa anestesia local para adormecer completamente el área quirúrgica. Hay opciones de sedación disponibles si se siente ansioso por el procedimiento.',

    E'**Possible risks include:**\n- Swelling and bruising around the surgical site\n- Mild to moderate discomfort for several days\n- Infection at the graft site (rare with proper care)\n- Graft material not integrating with natural bone (uncommon)\n- Numbness or tingling near the surgical area (usually temporary)',
    E'**Los posibles riesgos incluyen:**\n- Hinchazón y moretones alrededor del sitio quirúrgico\n- Molestia leve a moderada por varios días\n- Infección en el sitio del injerto (rara con cuidado adecuado)\n- Material de injerto que no se integra con el hueso natural (poco común)\n- Adormecimiento u hormigueo cerca del área quirúrgica (generalmente temporal)',

    E'## What to expect after\n\n### First 24-48 hours\n- Apply ice packs to the outside of your face (20 minutes on, 20 minutes off) to reduce swelling\n- Take pain medication as prescribed before the numbness wears off\n- Eat soft, cool foods only - avoid hot foods and drinks\n- Do not rinse, spit forcefully, or use straws (this can disturb the graft)\n- Sleep with your head elevated on extra pillows\n- Do not smoke - smoking greatly slows healing and can cause graft failure\n\n### First week\n- Gently rinse with warm salt water starting 24 hours after surgery\n- Continue eating soft foods (yogurt, mashed potatoes, smoothies, scrambled eggs)\n- Brush your other teeth normally but avoid the surgical area\n- Take all prescribed antibiotics until finished\n- Swelling usually peaks at day 2-3 then starts to improve\n\n### Healing timeline\n- Stitches dissolve or are removed in 7-14 days\n- Soft tissue heals in 2-4 weeks\n- New bone growth takes 3-6 months\n- Follow-up appointments will monitor your healing progress\n\n### Call us if you notice\n- Severe pain that gets worse after day 3\n- Swelling that increases after day 3\n- Fever over 100°F\n- Bleeding that does not stop with gentle pressure\n- Graft material coming out\n- Pus or foul taste in your mouth',

    E'## Qué esperar después\n\n### Primeras 24-48 horas\n- Aplique compresas de hielo en el exterior de su cara (20 minutos sí, 20 minutos no) para reducir la hinchazón\n- Tome medicamentos para el dolor según lo recetado antes de que desaparezca la anestesia\n- Coma solo alimentos suaves y fríos - evite alimentos y bebidas calientes\n- No enjuague, escupa con fuerza ni use popotes (esto puede disturbar el injerto)\n- Duerma con la cabeza elevada sobre almohadas extra\n- No fume - fumar ralentiza enormemente la curación y puede causar el fracaso del injerto\n\n### Primera semana\n- Enjuague suavemente con agua tibia con sal comenzando 24 horas después de la cirugía\n- Continúe comiendo alimentos suaves (yogur, puré de papas, licuados, huevos revueltos)\n- Cepille sus otros dientes normalmente pero evite el área quirúrgica\n- Tome todos los antibióticos recetados hasta terminarlos\n- La hinchazón generalmente alcanza su punto máximo en el día 2-3 y luego comienza a mejorar\n\n### Línea de tiempo de curación\n- Los puntos se disuelven o se retiran en 7-14 días\n- El tejido blando sana en 2-4 semanas\n- El crecimiento de hueso nuevo toma 3-6 meses\n- Las citas de seguimiento monitorearán su progreso de curación\n\n### Llámenos si nota\n- Dolor severo que empeora después del día 3\n- Hinchazón que aumenta después del día 3\n- Fiebre mayor a 100°F\n- Sangrado que no se detiene con presión suave\n- Material de injerto saliendo\n- Pus o mal sabor en la boca',

    jsonb_build_array(
        jsonb_build_object('q', 'Where does the bone graft material come from?', 'a', 'Most grafts use processed bone from a tissue bank, which is safe and well-tested. We may also use synthetic bone material. Your dentist will explain which type is best for your situation.'),
        jsonb_build_object('q', 'How long does it take for the bone to grow?', 'a', 'New bone growth usually takes 3 to 6 months. Your body gradually replaces the graft material with your own natural bone during this time.'),
        jsonb_build_object('q', 'Is bone grafting painful?', 'a', 'The procedure is done under local anesthesia so you will not feel pain during it. After, you may have moderate soreness for a few days that is managed with pain medication.'),
        jsonb_build_object('q', 'Can I get my implant at the same time as the bone graft?', 'a', 'Sometimes yes, if enough bone is present. In many cases, the graft needs to heal for 3-6 months before the implant can be placed.'),
        jsonb_build_object('q', 'What if the bone graft does not work?', 'a', 'Bone grafts have a high success rate. In the rare case it does not integrate, we can repeat the procedure after the area heals.')
    ),

    jsonb_build_array(
        jsonb_build_object('q', '¿De dónde viene el material del injerto óseo?', 'a', 'La mayoría de los injertos usan hueso procesado de un banco de tejidos, que es seguro y bien probado. También podemos usar material óseo sintético. Su dentista le explicará qué tipo es mejor para su situación.'),
        jsonb_build_object('q', '¿Cuánto tiempo tarda en crecer el hueso?', 'a', 'El crecimiento de hueso nuevo generalmente toma de 3 a 6 meses. Su cuerpo reemplaza gradualmente el material de injerto con su propio hueso natural durante este tiempo.'),
        jsonb_build_object('q', '¿Es doloroso el injerto óseo?', 'a', 'El procedimiento se realiza bajo anestesia local para que no sienta dolor durante el mismo. Después, puede tener dolor moderado por unos días que se maneja con medicamentos para el dolor.'),
        jsonb_build_object('q', '¿Puedo obtener mi implante al mismo tiempo que el injerto óseo?', 'a', 'A veces sí, si hay suficiente hueso presente. En muchos casos, el injerto necesita sanar de 3 a 6 meses antes de que se pueda colocar el implante.'),
        jsonb_build_object('q', '¿Qué pasa si el injerto óseo no funciona?', 'a', 'Los injertos óseos tienen una alta tasa de éxito. En el caso raro de que no se integre, podemos repetir el procedimiento después de que el área sane.')
    ),

    '45-90 minutes',
    '1 visit (+ follow-ups for healing checks)',
    '{"heroKey": "bone-graft-hero", "stepKeys": ["bone-graft-anesthesia", "bone-graft-site-prep", "bone-graft-placement", "bone-graft-membrane", "bone-graft-suturing"]}'::JSONB,
    'surgery',
    true
),

-- =====================================================
-- 3. SINUS LIFT
-- =====================================================
(
    'sinus-lift',
    'Sinus Lift',
    'Elevación de Seno Maxilar',

    E'## What this is\n\nA sinus lift is a surgery that adds bone to your upper jaw in the area of your back teeth (molars and premolars). The procedure lifts the sinus membrane upward to make room for new bone. This is needed when there is not enough bone height in the upper jaw to place dental implants because the sinuses are too close to the jaw.',

    E'## Qué es esto\n\nUna elevación de seno maxilar es una cirugía que agrega hueso a su mandíbula superior en el área de sus dientes posteriores (molares y premolares). El procedimiento eleva la membrana del seno hacia arriba para hacer espacio para hueso nuevo. Esto es necesario cuando no hay suficiente altura de hueso en la mandíbula superior para colocar implantes dentales porque los senos están demasiado cerca de la mandíbula.',

    E'## Why you may need it\n\nYou may need a sinus lift if:\n\n**You want implants in your upper back jaw**: The bone in this area is naturally thinner and the sinus cavity sits right above it\n\n**You lost bone after tooth loss**: When upper back teeth are missing, the bone shrinks and the sinus expands downward into the space\n\n**You have naturally large sinuses**: Some people have sinuses that are very close to the jaw, leaving little bone for implants\n\n**Gum disease caused bone loss**: Periodontal disease can destroy bone in the upper jaw area',

    E'## Por qué puede necesitarla\n\nPuede necesitar una elevación de seno maxilar si:\n\n**Quiere implantes en la parte posterior superior de la mandíbula**: El hueso en esta área es naturalmente más delgado y la cavidad del seno se encuentra justo encima\n\n**Perdió hueso después de la pérdida dental**: Cuando faltan los dientes posteriores superiores, el hueso se encoge y el seno se expande hacia abajo en el espacio\n\n**Tiene senos naturalmente grandes**: Algunas personas tienen senos que están muy cerca de la mandíbula, dejando poco hueso para implantes\n\n**La enfermedad de las encías causó pérdida ósea**: La enfermedad periodontal puede destruir hueso en el área de la mandíbula superior',

    E'## If you delay\n\nDelaying a sinus lift when recommended can mean:\n\n**Cannot place implants**: Without enough bone, implants in the upper back jaw are not possible\n\n**More bone loss over time**: The bone continues to shrink the longer you wait\n\n**Larger surgery needed later**: More bone loss means a bigger graft and longer recovery\n\n**Fewer options for tooth replacement**: You may be limited to dentures or bridges instead of implants',

    E'## Si lo retrasa\n\nRetrasar una elevación de seno maxilar cuando se recomienda puede significar:\n\n**No poder colocar implantes**: Sin suficiente hueso, los implantes en la parte posterior superior de la mandíbula no son posibles\n\n**Más pérdida ósea con el tiempo**: El hueso continúa encogiéndose cuanto más espere\n\n**Cirugía más grande necesaria después**: Más pérdida ósea significa un injerto más grande y una recuperación más larga\n\n**Menos opciones para reemplazo dental**: Puede estar limitado a dentaduras o puentes en lugar de implantes',

    jsonb_build_array(
        jsonb_build_object(
            'title', 'Step 1: Anesthesia',
            'description', E'**What we do**: We numb the area with local anesthesia. Sedation is also available if you prefer\n\n**What you may feel**: A small pinch from the injection, then complete numbness in the upper jaw area\n\n**Why it matters**: You will be comfortable and pain-free during the procedure'
        ),
        jsonb_build_object(
            'title', 'Step 2: Window Creation',
            'description', E'**What we do**: We make a small incision in your gum and create a small window in the bone to access the sinus membrane\n\n**What you may feel**: Pressure and vibration but no pain\n\n**Why it matters**: The window gives us careful access to the sinus membrane without damaging it'
        ),
        jsonb_build_object(
            'title', 'Step 3: Membrane Lift',
            'description', E'**What we do**: We gently push the sinus membrane upward, away from the jaw bone, creating a space underneath\n\n**What you may feel**: A sense of pressure in the area\n\n**Why it matters**: Lifting the membrane creates the space needed to add bone graft material'
        ),
        jsonb_build_object(
            'title', 'Step 4: Bone Graft Placement',
            'description', E'**What we do**: We pack bone graft material into the space created between the jaw bone and the sinus membrane\n\n**What you may feel**: Pressure as the material is placed\n\n**Why it matters**: This material will become new bone over several months, giving you enough height for implants'
        ),
        jsonb_build_object(
            'title', 'Step 5: Closure',
            'description', E'**What we do**: We close the gum tissue with stitches to protect the graft while it heals\n\n**What you may feel**: Slight tugging as stitches are placed\n\n**Why it matters**: Proper closure protects the graft and helps your body grow new bone undisturbed'
        )
    ),

    jsonb_build_array(
        jsonb_build_object(
            'title', 'Paso 1: Anestesia',
            'description', E'**Lo que hacemos**: Adormecemos el área con anestesia local. También hay sedación disponible si lo prefiere\n\n**Lo que puede sentir**: Un pequeño pinchazo de la inyección, luego adormecimiento completo en el área de la mandíbula superior\n\n**Por qué importa**: Estará cómodo y sin dolor durante el procedimiento'
        ),
        jsonb_build_object(
            'title', 'Paso 2: Creación de Ventana',
            'description', E'**Lo que hacemos**: Hacemos una pequeña incisión en su encía y creamos una pequeña ventana en el hueso para acceder a la membrana del seno\n\n**Lo que puede sentir**: Presión y vibración pero sin dolor\n\n**Por qué importa**: La ventana nos da acceso cuidadoso a la membrana del seno sin dañarla'
        ),
        jsonb_build_object(
            'title', 'Paso 3: Elevación de Membrana',
            'description', E'**Lo que hacemos**: Empujamos suavemente la membrana del seno hacia arriba, alejándola del hueso de la mandíbula, creando un espacio debajo\n\n**Lo que puede sentir**: Una sensación de presión en el área\n\n**Por qué importa**: Elevar la membrana crea el espacio necesario para agregar material de injerto óseo'
        ),
        jsonb_build_object(
            'title', 'Paso 4: Colocación del Injerto Óseo',
            'description', E'**Lo que hacemos**: Empacamos material de injerto óseo en el espacio creado entre el hueso de la mandíbula y la membrana del seno\n\n**Lo que puede sentir**: Presión mientras se coloca el material\n\n**Por qué importa**: Este material se convertirá en hueso nuevo durante varios meses, dándole suficiente altura para implantes'
        ),
        jsonb_build_object(
            'title', 'Paso 5: Cierre',
            'description', E'**Lo que hacemos**: Cerramos el tejido de la encía con puntos de sutura para proteger el injerto mientras sana\n\n**Lo que puede sentir**: Ligero tirón mientras se colocan los puntos\n\n**Por qué importa**: Un cierre adecuado protege el injerto y ayuda a su cuerpo a crecer hueso nuevo sin perturbaciones'
        )
    ),

    'Local anesthesia is used to numb the upper jaw area. Sedation (oral or IV) is available for patients who feel anxious about the surgery.',
    'Se usa anestesia local para adormecer el área de la mandíbula superior. La sedación (oral o intravenosa) está disponible para pacientes que se sienten ansiosos por la cirugía.',

    E'**Possible risks include:**\n- Sinus membrane perforation (small tears can usually be repaired during surgery)\n- Swelling and discomfort for several days\n- Minor nosebleeds or nasal congestion\n- Infection at the surgical site (uncommon with proper care)\n- Graft failure requiring repeat procedure (rare)',
    E'**Los posibles riesgos incluyen:**\n- Perforación de la membrana del seno (pequeñas roturas generalmente se pueden reparar durante la cirugía)\n- Hinchazón y molestia por varios días\n- Sangrados nasales menores o congestión nasal\n- Infección en el sitio quirúrgico (poco común con cuidado adecuado)\n- Fracaso del injerto requiriendo repetir el procedimiento (raro)',

    E'## What to expect after\n\n### First 24-48 hours\n- Some swelling of your cheek and gum is normal - use ice packs (20 minutes on, 20 off)\n- Take pain medication as prescribed before numbness wears off\n- Do NOT blow your nose for at least 2 weeks (this can damage the graft)\n- Sneeze with your mouth open to avoid pressure on the sinus\n- Do not use straws or smoke\n- Sleep with your head elevated\n- Eat soft, cool foods only\n\n### First 2 weeks\n- Avoid strenuous exercise or heavy lifting\n- Do not fly on airplanes (cabin pressure changes can affect healing)\n- Take all prescribed antibiotics and decongestants\n- Rinse gently with salt water starting 24 hours after surgery\n- Stitches are removed or dissolve in 7-14 days\n\n### Healing timeline\n- Soft tissue heals in 2-3 weeks\n- New bone growth takes 4-9 months\n- Implant placement is scheduled after bone has matured (usually 6-9 months)\n\n### Call us if you notice\n- Heavy or persistent nosebleeds\n- Severe pain that worsens after day 3\n- Increasing swelling after day 3\n- Fever over 100°F\n- Feeling like air is passing between your mouth and nose\n- Graft material coming out',

    E'## Qué esperar después\n\n### Primeras 24-48 horas\n- Algo de hinchazón en su mejilla y encía es normal - use compresas de hielo (20 minutos sí, 20 no)\n- Tome medicamentos para el dolor según lo recetado antes de que desaparezca la anestesia\n- NO se suene la nariz por al menos 2 semanas (esto puede dañar el injerto)\n- Estornude con la boca abierta para evitar presión en el seno\n- No use popotes ni fume\n- Duerma con la cabeza elevada\n- Coma solo alimentos suaves y fríos\n\n### Primeras 2 semanas\n- Evite ejercicio intenso o levantar objetos pesados\n- No viaje en avión (los cambios de presión en la cabina pueden afectar la curación)\n- Tome todos los antibióticos y descongestionantes recetados\n- Enjuague suavemente con agua con sal comenzando 24 horas después de la cirugía\n- Los puntos se retiran o se disuelven en 7-14 días\n\n### Línea de tiempo de curación\n- El tejido blando sana en 2-3 semanas\n- El crecimiento de hueso nuevo toma 4-9 meses\n- La colocación del implante se programa después de que el hueso haya madurado (generalmente 6-9 meses)\n\n### Llámenos si nota\n- Sangrados nasales fuertes o persistentes\n- Dolor severo que empeora después del día 3\n- Hinchazón que aumenta después del día 3\n- Fiebre mayor a 100°F\n- Sensación de que el aire pasa entre su boca y nariz\n- Material de injerto saliendo',

    jsonb_build_array(
        jsonb_build_object('q', 'How long does a sinus lift take?', 'a', 'The procedure usually takes 1 to 2 hours depending on the amount of bone needed.'),
        jsonb_build_object('q', 'Is a sinus lift painful?', 'a', 'No, the area is completely numbed. After surgery, you may have moderate discomfort for a few days that is well controlled with pain medication.'),
        jsonb_build_object('q', 'How long until I can get my implant after a sinus lift?', 'a', 'Most patients need to wait 4 to 9 months for the new bone to mature before implants can be placed.'),
        jsonb_build_object('q', 'Will this affect my sinuses or breathing?', 'a', 'You may have some nasal congestion for a week or two. Once healed, your sinuses will function normally. The procedure does not affect your breathing long-term.'),
        jsonb_build_object('q', 'What if the sinus membrane tears during surgery?', 'a', 'Small tears are not uncommon and can usually be repaired during the same procedure. If the tear is large, we may need to let it heal and try again later.')
    ),

    jsonb_build_array(
        jsonb_build_object('q', '¿Cuánto tiempo toma una elevación de seno?', 'a', 'El procedimiento generalmente toma de 1 a 2 horas dependiendo de la cantidad de hueso necesario.'),
        jsonb_build_object('q', '¿Es dolorosa una elevación de seno?', 'a', 'No, el área está completamente adormecida. Después de la cirugía, puede tener molestia moderada por unos días que se controla bien con medicamentos para el dolor.'),
        jsonb_build_object('q', '¿Cuánto tiempo hasta que pueda obtener mi implante después de una elevación de seno?', 'a', 'La mayoría de los pacientes necesitan esperar de 4 a 9 meses para que el hueso nuevo madure antes de que se puedan colocar los implantes.'),
        jsonb_build_object('q', '¿Esto afectará mis senos nasales o respiración?', 'a', 'Puede tener algo de congestión nasal por una o dos semanas. Una vez sanado, sus senos nasales funcionarán normalmente. El procedimiento no afecta su respiración a largo plazo.'),
        jsonb_build_object('q', '¿Qué pasa si la membrana del seno se rompe durante la cirugía?', 'a', 'Las roturas pequeñas no son poco comunes y generalmente se pueden reparar durante el mismo procedimiento. Si la rotura es grande, puede que necesitemos dejar que sane e intentar de nuevo después.')
    ),

    '1-2 hours',
    '1 visit (+ follow-ups over 4-9 months)',
    '{"heroKey": "sinus-lift-hero", "stepKeys": ["sinus-lift-anesthesia", "sinus-lift-window", "sinus-lift-membrane", "sinus-lift-graft", "sinus-lift-closure"]}'::JSONB,
    'surgery',
    true
),

-- =====================================================
-- 4. DENTAL SEALANT
-- =====================================================
(
    'dental-sealant',
    'Dental Sealant',
    'Sellador Dental',

    E'## What this is\n\nA dental sealant is a thin, protective coating painted onto the chewing surfaces of your back teeth (molars and premolars). It bonds into the grooves and pits of the teeth, forming a shield over the enamel. Sealants are a quick, painless way to prevent cavities in the areas that are hardest to keep clean with brushing alone.',

    E'## Qué es esto\n\nUn sellador dental es un recubrimiento delgado y protector que se pinta sobre las superficies de masticación de sus dientes posteriores (molares y premolares). Se adhiere a los surcos y fosas de los dientes, formando un escudo sobre el esmalte. Los selladores son una forma rápida e indolora de prevenir caries en las áreas que son más difíciles de mantener limpias solo con el cepillado.',

    E'## Why you may need it\n\nSealants are recommended because:\n\n**Back teeth have deep grooves**: The chewing surfaces of molars have tiny pits and grooves where food and bacteria collect, even with good brushing\n\n**Prevention is easier than treatment**: Sealing teeth before cavities start is simpler, faster, and less expensive than fillings\n\n**Great for children and teens**: Sealants are most often placed on permanent molars as soon as they come in (around ages 6 and 12)\n\n**Adults benefit too**: If you have deep grooves in your teeth that have not yet developed cavities, sealants can protect them',

    E'## Por qué puede necesitarlo\n\nLos selladores se recomiendan porque:\n\n**Los dientes posteriores tienen surcos profundos**: Las superficies de masticación de los molares tienen pequeñas fosas y surcos donde se acumulan alimentos y bacterias, incluso con buen cepillado\n\n**La prevención es más fácil que el tratamiento**: Sellar los dientes antes de que comiencen las caries es más simple, más rápido y menos costoso que los empastes\n\n**Excelente para niños y adolescentes**: Los selladores se colocan más frecuentemente en molares permanentes tan pronto como salen (alrededor de los 6 y 12 años)\n\n**Los adultos también se benefician**: Si tiene surcos profundos en sus dientes que aún no han desarrollado caries, los selladores pueden protegerlos',

    NULL,
    NULL,

    jsonb_build_array(
        jsonb_build_object(
            'title', 'Step 1: Cleaning',
            'description', E'**What we do**: We thoroughly clean the tooth surface to remove any food particles, plaque, or debris from the grooves\n\n**What you may feel**: A slight tickling from the cleaning brush or air\n\n**Why it matters**: A perfectly clean surface allows the sealant to bond tightly to the tooth'
        ),
        jsonb_build_object(
            'title', 'Step 2: Etching',
            'description', E'**What we do**: We apply a mild acid solution to the chewing surface for a few seconds, then rinse and dry the tooth\n\n**What you may feel**: A slightly sour taste - the solution is harmless\n\n**Why it matters**: The acid creates a rough texture on the enamel so the sealant grips the tooth better'
        ),
        jsonb_build_object(
            'title', 'Step 3: Sealant Application',
            'description', E'**What we do**: We paint the liquid sealant material onto the tooth surface, letting it flow into all the grooves and pits, then harden it with a special curing light\n\n**What you may feel**: Nothing - the sealant is simply painted on. The light does not produce heat\n\n**Why it matters**: The hardened sealant creates a smooth, protective barrier that keeps food and bacteria out of the grooves'
        )
    ),

    jsonb_build_array(
        jsonb_build_object(
            'title', 'Paso 1: Limpieza',
            'description', E'**Lo que hacemos**: Limpiamos a fondo la superficie del diente para eliminar cualquier partícula de alimento, placa o residuo de los surcos\n\n**Lo que puede sentir**: Un ligero cosquilleo del cepillo de limpieza o el aire\n\n**Por qué importa**: Una superficie perfectamente limpia permite que el sellador se adhiera firmemente al diente'
        ),
        jsonb_build_object(
            'title', 'Paso 2: Grabado',
            'description', E'**Lo que hacemos**: Aplicamos una solución ácida suave en la superficie de masticación por unos segundos, luego enjuagamos y secamos el diente\n\n**Lo que puede sentir**: Un sabor ligeramente ácido - la solución es inofensiva\n\n**Por qué importa**: El ácido crea una textura rugosa en el esmalte para que el sellador se agarre mejor al diente'
        ),
        jsonb_build_object(
            'title', 'Paso 3: Aplicación del Sellador',
            'description', E'**Lo que hacemos**: Pintamos el material sellador líquido sobre la superficie del diente, dejándolo fluir en todos los surcos y fosas, luego lo endurecemos con una luz de curado especial\n\n**Lo que puede sentir**: Nada - el sellador simplemente se pinta. La luz no produce calor\n\n**Por qué importa**: El sellador endurecido crea una barrera protectora suave que mantiene los alimentos y las bacterias fuera de los surcos'
        )
    ),

    'No anesthesia is needed. Sealant application is completely painless.',
    'No se necesita anestesia. La aplicación de sellador es completamente indolora.',

    NULL,
    NULL,

    E'## Caring for your sealants\n\n- You can eat and drink right away after the sealant is placed\n- Continue brushing twice a day and flossing daily as normal\n- Avoid chewing on ice or very hard candy, which can chip sealants\n- Sealants are checked at every dental visit and can be reapplied if they wear down\n- Sealants typically last 5 to 10 years with normal use\n- They are not a replacement for brushing and flossing - they work together with good hygiene',

    E'## Cuidado de sus selladores\n\n- Puede comer y beber inmediatamente después de que se coloque el sellador\n- Continúe cepillándose dos veces al día y usando hilo dental diariamente como de costumbre\n- Evite masticar hielo o dulces muy duros, que pueden astillar los selladores\n- Los selladores se revisan en cada visita dental y se pueden reaplicar si se desgastan\n- Los selladores típicamente duran de 5 a 10 años con uso normal\n- No son un reemplazo del cepillado y el hilo dental - trabajan junto con una buena higiene',

    jsonb_build_array(
        jsonb_build_object('q', 'Do sealants hurt?', 'a', 'Not at all. No drilling or needles are needed. The sealant is simply painted onto the tooth and hardened with a light.'),
        jsonb_build_object('q', 'How long do sealants last?', 'a', 'Sealants typically last 5 to 10 years. We check them at every visit and can reapply them if needed.'),
        jsonb_build_object('q', 'Are sealants only for kids?', 'a', 'While they are most common for children, adults with deep grooves in their teeth that have not had cavities can also benefit from sealants.'),
        jsonb_build_object('q', 'Can sealants be placed over a cavity?', 'a', 'Sealants work best on teeth without cavities. If a tooth already has decay, it needs a filling instead. Sealants are a preventive measure.'),
        jsonb_build_object('q', 'Are sealants safe?', 'a', 'Yes, dental sealants are very safe. They have been used for decades and are recommended by the American Dental Association for cavity prevention.')
    ),

    jsonb_build_array(
        jsonb_build_object('q', '¿Duelen los selladores?', 'a', 'Para nada. No se necesitan perforaciones ni agujas. El sellador simplemente se pinta sobre el diente y se endurece con una luz.'),
        jsonb_build_object('q', '¿Cuánto duran los selladores?', 'a', 'Los selladores típicamente duran de 5 a 10 años. Los revisamos en cada visita y podemos reaplicarlos si es necesario.'),
        jsonb_build_object('q', '¿Los selladores son solo para niños?', 'a', 'Aunque son más comunes para niños, los adultos con surcos profundos en sus dientes que no han tenido caries también pueden beneficiarse de los selladores.'),
        jsonb_build_object('q', '¿Se pueden colocar selladores sobre una caries?', 'a', 'Los selladores funcionan mejor en dientes sin caries. Si un diente ya tiene caries, necesita un empaste en su lugar. Los selladores son una medida preventiva.'),
        jsonb_build_object('q', '¿Son seguros los selladores?', 'a', 'Sí, los selladores dentales son muy seguros. Se han usado durante décadas y son recomendados por la Asociación Dental Americana para la prevención de caries.')
    ),

    '5-10 minutes per tooth',
    '1 visit',
    '{"heroKey": "dental-sealant-hero", "stepKeys": ["dental-sealant-cleaning", "dental-sealant-etching", "dental-sealant-application"]}'::JSONB,
    'preventive',
    true
),

-- =====================================================
-- 5. FLUORIDE TREATMENT
-- =====================================================
(
    'fluoride-treatment',
    'Fluoride Treatment',
    'Tratamiento con Flúor',

    E'## What this is\n\nA fluoride treatment is a quick, in-office procedure where we apply a concentrated fluoride solution to your teeth. Fluoride is a natural mineral that strengthens tooth enamel and helps prevent cavities. Professional fluoride treatments contain much more fluoride than what is in your toothpaste or tap water, giving your teeth extra protection.',

    E'## Qué es esto\n\nUn tratamiento con flúor es un procedimiento rápido en el consultorio donde aplicamos una solución concentrada de flúor a sus dientes. El flúor es un mineral natural que fortalece el esmalte dental y ayuda a prevenir caries. Los tratamientos profesionales con flúor contienen mucho más flúor que el que hay en su pasta de dientes o agua del grifo, dándole a sus dientes protección extra.',

    E'## Why you may need it\n\nFluoride treatments are recommended because:\n\n**Strengthens enamel**: Fluoride rebuilds weakened enamel and makes teeth more resistant to acid attacks from bacteria\n\n**Prevents cavities**: Regular fluoride treatments can reduce cavity risk by up to 30%\n\n**Reverses early decay**: Fluoride can actually reverse very early stages of tooth decay before a cavity forms\n\n**Good for all ages**: Children, teens, and adults all benefit, especially those at higher risk for cavities\n\n**Quick and easy**: The treatment takes just a few minutes and is completely painless',

    E'## Por qué puede necesitarlo\n\nLos tratamientos con flúor se recomiendan porque:\n\n**Fortalece el esmalte**: El flúor reconstruye el esmalte debilitado y hace que los dientes sean más resistentes a los ataques ácidos de las bacterias\n\n**Previene caries**: Los tratamientos regulares con flúor pueden reducir el riesgo de caries hasta en un 30%\n\n**Revierte el deterioro temprano**: El flúor puede realmente revertir las etapas muy tempranas del deterioro dental antes de que se forme una caries\n\n**Bueno para todas las edades**: Niños, adolescentes y adultos se benefician, especialmente aquellos con mayor riesgo de caries\n\n**Rápido y fácil**: El tratamiento toma solo unos minutos y es completamente indoloro',

    NULL,
    NULL,

    jsonb_build_array(
        jsonb_build_object(
            'title', 'Step 1: Cleaning',
            'description', E'**What we do**: We clean your teeth to remove plaque and food particles so the fluoride can reach the tooth surface directly\n\n**What you may feel**: The normal sensation of a dental cleaning\n\n**Why it matters**: Clean teeth absorb fluoride much better than teeth covered in plaque'
        ),
        jsonb_build_object(
            'title', 'Step 2: Fluoride Application',
            'description', E'**What we do**: We apply the fluoride to your teeth as a varnish (painted on), gel (in a tray), or foam. The fluoride stays on your teeth for a few minutes\n\n**What you may feel**: The varnish may feel slightly sticky. Gels and foams may have a mild flavor. There is no pain at all\n\n**Why it matters**: The concentrated fluoride soaks into your enamel, making it stronger and more resistant to decay'
        ),
        jsonb_build_object(
            'title', 'Step 3: Waiting Period',
            'description', E'**What we do**: After application, we ask you to avoid eating, drinking, or rinsing for 30 minutes to let the fluoride fully absorb\n\n**What you may feel**: A thin coating on your teeth that goes away on its own\n\n**Why it matters**: Giving the fluoride time to absorb ensures maximum protection for your teeth'
        )
    ),

    jsonb_build_array(
        jsonb_build_object(
            'title', 'Paso 1: Limpieza',
            'description', E'**Lo que hacemos**: Limpiamos sus dientes para eliminar la placa y las partículas de alimentos para que el flúor pueda llegar directamente a la superficie del diente\n\n**Lo que puede sentir**: La sensación normal de una limpieza dental\n\n**Por qué importa**: Los dientes limpios absorben el flúor mucho mejor que los dientes cubiertos de placa'
        ),
        jsonb_build_object(
            'title', 'Paso 2: Aplicación del Flúor',
            'description', E'**Lo que hacemos**: Aplicamos el flúor a sus dientes como un barniz (pintado), gel (en una bandeja) o espuma. El flúor permanece en sus dientes por unos minutos\n\n**Lo que puede sentir**: El barniz puede sentirse ligeramente pegajoso. Los geles y espumas pueden tener un sabor suave. No hay dolor en absoluto\n\n**Por qué importa**: El flúor concentrado se absorbe en su esmalte, haciéndolo más fuerte y más resistente al deterioro'
        ),
        jsonb_build_object(
            'title', 'Paso 3: Período de Espera',
            'description', E'**Lo que hacemos**: Después de la aplicación, le pedimos que evite comer, beber o enjuagarse por 30 minutos para que el flúor se absorba completamente\n\n**Lo que puede sentir**: Una capa delgada en sus dientes que desaparece por sí sola\n\n**Por qué importa**: Darle tiempo al flúor para absorberse asegura la máxima protección para sus dientes'
        )
    ),

    'No anesthesia is needed. Fluoride treatments are completely painless.',
    'No se necesita anestesia. Los tratamientos con flúor son completamente indoloros.',

    NULL,
    NULL,

    E'## After your fluoride treatment\n\n- Wait 30 minutes before eating, drinking, or rinsing your mouth\n- When you do eat, choose soft foods for the first meal\n- You may notice a thin yellowish coating on your teeth from the varnish - this is normal and will brush off at your next brushing\n- Continue your regular brushing and flossing routine\n- Professional fluoride treatments are typically recommended every 3, 6, or 12 months depending on your cavity risk\n- Use fluoride toothpaste daily at home for ongoing protection',

    E'## Después de su tratamiento con flúor\n\n- Espere 30 minutos antes de comer, beber o enjuagarse la boca\n- Cuando coma, elija alimentos suaves para la primera comida\n- Puede notar una capa delgada amarillenta en sus dientes por el barniz - esto es normal y se quitará con el siguiente cepillado\n- Continúe su rutina regular de cepillado y uso de hilo dental\n- Los tratamientos profesionales con flúor se recomiendan típicamente cada 3, 6 o 12 meses dependiendo de su riesgo de caries\n- Use pasta de dientes con flúor diariamente en casa para protección continua',

    jsonb_build_array(
        jsonb_build_object('q', 'Is fluoride safe?', 'a', 'Yes, fluoride treatments are very safe when applied by a dental professional. The amount used is carefully controlled and has been proven safe and effective for decades.'),
        jsonb_build_object('q', 'How often should I get fluoride treatments?', 'a', 'Most adults benefit from fluoride treatments every 6 to 12 months. People at higher risk for cavities (dry mouth, history of cavities, braces) may benefit from treatments every 3 months.'),
        jsonb_build_object('q', 'Do adults need fluoride treatments or just children?', 'a', 'Adults benefit from professional fluoride treatments too. Anyone at risk for cavities can benefit, regardless of age.'),
        jsonb_build_object('q', 'Does fluoride treatment hurt?', 'a', 'Not at all. There are no needles, no drilling, and no discomfort. The fluoride is simply applied to your teeth and left to absorb.'),
        jsonb_build_object('q', 'Why can I not just use fluoride toothpaste at home?', 'a', 'Fluoride toothpaste is great for daily protection, but professional treatments use a much higher concentration that provides extra strengthening that toothpaste alone cannot achieve.')
    ),

    jsonb_build_array(
        jsonb_build_object('q', '¿Es seguro el flúor?', 'a', 'Sí, los tratamientos con flúor son muy seguros cuando los aplica un profesional dental. La cantidad utilizada está cuidadosamente controlada y ha demostrado ser segura y efectiva durante décadas.'),
        jsonb_build_object('q', '¿Con qué frecuencia debo recibir tratamientos con flúor?', 'a', 'La mayoría de los adultos se benefician de tratamientos con flúor cada 6 a 12 meses. Las personas con mayor riesgo de caries (boca seca, historial de caries, brackets) pueden beneficiarse de tratamientos cada 3 meses.'),
        jsonb_build_object('q', '¿Los adultos necesitan tratamientos con flúor o solo los niños?', 'a', 'Los adultos también se benefician de los tratamientos profesionales con flúor. Cualquier persona con riesgo de caries puede beneficiarse, independientemente de la edad.'),
        jsonb_build_object('q', '¿Duele el tratamiento con flúor?', 'a', 'Para nada. No hay agujas, no hay perforaciones y no hay molestias. El flúor simplemente se aplica a sus dientes y se deja absorber.'),
        jsonb_build_object('q', '¿Por qué no puedo simplemente usar pasta de dientes con flúor en casa?', 'a', 'La pasta de dientes con flúor es excelente para la protección diaria, pero los tratamientos profesionales usan una concentración mucho mayor que proporciona un fortalecimiento extra que la pasta de dientes sola no puede lograr.')
    ),

    '5-10 minutes',
    '1 visit (repeated every 3-12 months)',
    '{"heroKey": "fluoride-treatment-hero", "stepKeys": ["fluoride-cleaning", "fluoride-application", "fluoride-waiting"]}'::JSONB,
    'preventive',
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
    is_published = EXCLUDED.is_published,
    updated_at = CURRENT_TIMESTAMP;

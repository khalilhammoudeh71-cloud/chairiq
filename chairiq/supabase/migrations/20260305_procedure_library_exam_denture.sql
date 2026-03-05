INSERT INTO public.procedure_library (
    slug, title_en, title_es, summary_en, summary_es,
    why_en, why_es, what_if_not_en, what_if_not_es,
    steps_en, steps_es,
    aftercare_en, aftercare_es,
    faqs_en, faqs_es,
    time_estimate, visits_estimate, category, is_published
) VALUES (
    'exam',
    'Dental Examination',
    'Examen Dental',

    E'## What this is\n\nA dental examination is a thorough checkup of your teeth, gums, and mouth. Your dentist looks for cavities, gum disease, oral cancer, and other problems. This visit also includes reviewing your medical history and discussing any concerns you have about your oral health. Regular exams help catch problems early when they are easier and less expensive to treat.\n\n## Why you may need it\n\nYou may need a dental exam if:\n- It has been six months or more since your last checkup\n- You have tooth pain, sensitivity, or bleeding gums\n- You notice changes in your mouth such as sores, lumps, or discoloration\n- You want to maintain good oral health and prevent future problems\n- You are starting a new treatment plan and need an evaluation\n- You have a medical condition that can affect your oral health, such as diabetes',

    E'## Qué es esto\n\nUn examen dental es una revisión completa de sus dientes, encías y boca. Su dentista busca caries, enfermedad de las encías, cáncer oral y otros problemas. Esta visita también incluye revisar su historial médico y hablar sobre cualquier preocupación que tenga sobre su salud bucal. Los exámenes regulares ayudan a detectar problemas a tiempo, cuando son más fáciles y menos costosos de tratar.\n\n## Por qué puede necesitarlo\n\nPuede necesitar un examen dental si:\n- Han pasado seis meses o más desde su último chequeo\n- Tiene dolor de dientes, sensibilidad o encías sangrantes\n- Nota cambios en su boca como llagas, bultos o decoloración\n- Quiere mantener una buena salud bucal y prevenir problemas futuros\n- Está comenzando un nuevo plan de tratamiento y necesita una evaluación\n- Tiene una condición médica que puede afectar su salud bucal, como la diabetes',

    E'## Why you may need it\n\nRegular dental exams are the foundation of good oral health. Common reasons include:\n\n**Preventive care**: Catching cavities, gum disease, and other issues early before they become painful or costly\n\n**Oral cancer screening**: Your dentist checks for signs of oral cancer at every exam, which is critical for early detection\n\n**Gum health check**: Measuring gum pockets and checking for signs of periodontal disease\n\n**Existing dental work**: Checking that fillings, crowns, bridges, and other restorations are still in good condition\n\n**Overall health connection**: Oral health is linked to heart disease, diabetes, and other conditions, so regular exams support your overall well-being\n\n**Updated X-rays**: Periodic X-rays reveal problems hidden between teeth or below the gum line that cannot be seen during a visual exam',

    E'## Por qué puede necesitarlo\n\nLos exámenes dentales regulares son la base de una buena salud bucal. Razones comunes incluyen:\n\n**Cuidado preventivo**: Detectar caries, enfermedad de las encías y otros problemas a tiempo antes de que se vuelvan dolorosos o costosos\n\n**Detección de cáncer oral**: Su dentista busca signos de cáncer oral en cada examen, lo cual es fundamental para la detección temprana\n\n**Revisión de salud de encías**: Medir las bolsas de las encías y buscar signos de enfermedad periodontal\n\n**Trabajo dental existente**: Verificar que empastes, coronas, puentes y otras restauraciones estén en buenas condiciones\n\n**Conexión con la salud general**: La salud bucal está vinculada a enfermedades cardíacas, diabetes y otras condiciones, por lo que los exámenes regulares apoyan su bienestar general\n\n**Radiografías actualizadas**: Las radiografías periódicas revelan problemas ocultos entre los dientes o debajo de la línea de las encías que no se ven durante un examen visual',

    NULL,
    NULL,

    jsonb_build_array(
        jsonb_build_object(
            'title', 'Step 1: Medical history review',
            'description', E'**What we do**: We review your medical history, current medications, and any changes in your health since your last visit\n\n**What you may feel**: No discomfort - this is a conversation between you and your dental team\n\n**Why it matters**: Your overall health affects your oral health, and some medications can cause dry mouth, gum changes, or other issues we need to know about'
        ),
        jsonb_build_object(
            'title', 'Step 2: Visual and clinical examination',
            'description', E'**What we do**: Your dentist examines every tooth, your gums, tongue, cheeks, throat, and jaw. We check for cavities, gum disease, oral cancer signs, bite problems, and the condition of any existing dental work\n\n**What you may feel**: Mild pressure as we gently probe your gums and teeth with a small instrument. A small mirror helps us see all areas of your mouth\n\n**Why it matters**: A thorough visual exam catches problems early when they are small and easier to fix'
        ),
        jsonb_build_object(
            'title', 'Step 3: Findings discussion and treatment plan',
            'description', E'**What we do**: We discuss what we found during your exam, explain any areas of concern, and recommend next steps or treatments if needed\n\n**What you may feel**: No discomfort - this is a conversation where you can ask questions about your oral health\n\n**Why it matters**: Understanding your oral health empowers you to make informed decisions about your care and prioritize any needed treatments'
        )
    ),

    jsonb_build_array(
        jsonb_build_object(
            'title', 'Paso 1: Revisión del historial médico',
            'description', E'**Lo que hacemos**: Revisamos su historial médico, medicamentos actuales y cualquier cambio en su salud desde su última visita\n\n**Lo que puede sentir**: Sin molestias - es una conversación entre usted y su equipo dental\n\n**Por qué es importante**: Su salud general afecta su salud bucal, y algunos medicamentos pueden causar boca seca, cambios en las encías u otros problemas que necesitamos conocer'
        ),
        jsonb_build_object(
            'title', 'Paso 2: Examen visual y clínico',
            'description', E'**Lo que hacemos**: Su dentista examina cada diente, sus encías, lengua, mejillas, garganta y mandíbula. Buscamos caries, enfermedad de las encías, signos de cáncer oral, problemas de mordida y el estado de cualquier trabajo dental existente\n\n**Lo que puede sentir**: Presión leve mientras sondeamos suavemente sus encías y dientes con un pequeño instrumento. Un pequeño espejo nos ayuda a ver todas las áreas de su boca\n\n**Por qué es importante**: Un examen visual completo detecta problemas a tiempo cuando son pequeños y más fáciles de arreglar'
        ),
        jsonb_build_object(
            'title', 'Paso 3: Discusión de hallazgos y plan de tratamiento',
            'description', E'**Lo que hacemos**: Discutimos lo que encontramos durante su examen, explicamos cualquier área de preocupación y recomendamos los próximos pasos o tratamientos si es necesario\n\n**Lo que puede sentir**: Sin molestias - es una conversación donde puede hacer preguntas sobre su salud bucal\n\n**Por qué es importante**: Comprender su salud bucal le permite tomar decisiones informadas sobre su cuidado y priorizar los tratamientos necesarios'
        )
    ),

    E'## What to expect after\n\n### After your exam\n- If X-rays were taken, results are usually discussed during the same visit\n- If cavities or other issues were found, your dentist will explain treatment options and help you schedule follow-up appointments\n- Continue brushing twice a day and flossing daily\n- Follow any personalized recommendations your dentist gave you\n\n### Maintaining oral health between exams\n- Brush for two minutes, twice a day, with fluoride toothpaste\n- Floss at least once a day to clean between teeth\n- Limit sugary snacks and drinks\n- Do not use tobacco products\n- Schedule your next exam in six months (or as recommended)\n\n### When to call us\n\nCall our office if you experience any of these between exams:\n- Tooth pain or sensitivity that does not go away\n- Bleeding gums when brushing or flossing\n- A sore or lump in your mouth that does not heal within two weeks\n- A broken or loose filling, crown, or other dental work\n- Swelling in your face, jaw, or gums',

    E'## Qué esperar después\n\n### Después de su examen\n- Si se tomaron radiografías, los resultados generalmente se discuten durante la misma visita\n- Si se encontraron caries u otros problemas, su dentista le explicará las opciones de tratamiento y le ayudará a programar citas de seguimiento\n- Continúe cepillándose dos veces al día y usando hilo dental diariamente\n- Siga las recomendaciones personalizadas que le dio su dentista\n\n### Mantener la salud bucal entre exámenes\n- Cepíllese durante dos minutos, dos veces al día, con pasta dental con flúor\n- Use hilo dental al menos una vez al día para limpiar entre los dientes\n- Limite los bocadillos y bebidas azucaradas\n- No use productos de tabaco\n- Programe su próximo examen en seis meses (o según lo recomendado)\n\n### Cuándo llamarnos\n\nLlame a nuestra oficina si experimenta alguno de estos síntomas entre exámenes:\n- Dolor o sensibilidad dental que no desaparece\n- Encías sangrantes al cepillarse o usar hilo dental\n- Una llaga o bulto en la boca que no sana en dos semanas\n- Un empaste, corona u otro trabajo dental roto o flojo\n- Hinchazón en la cara, mandíbula o encías',

    jsonb_build_array(
        jsonb_build_object(
            'q', 'How often should I get a dental exam?',
            'a', 'Most dentists recommend every six months. If you have gum disease, a history of cavities, or other risk factors, your dentist may recommend more frequent visits.'
        ),
        jsonb_build_object(
            'q', 'Does a dental exam hurt?',
            'a', 'No. A routine exam involves gentle probing and visual inspection. You may feel slight pressure when we check your gums, but it should not be painful.'
        ),
        jsonb_build_object(
            'q', 'Do I need X-rays at every exam?',
            'a', 'Not always. Your dentist decides based on your risk factors and how long it has been since your last X-rays. Most patients get X-rays once a year or every other year.'
        ),
        jsonb_build_object(
            'q', 'What is the difference between a regular exam and a comprehensive exam?',
            'a', 'A comprehensive exam is more detailed and is usually done at your first visit or when you have not been to the dentist in a long time. It includes a full assessment of your teeth, gums, jaw, and bite. A periodic exam is a shorter follow-up at regular intervals.'
        ),
        jsonb_build_object(
            'q', 'Will my insurance cover a dental exam?',
            'a', 'Most dental insurance plans cover two exams per year at little or no cost to you. Check with your insurance provider for specific coverage details.'
        ),
        jsonb_build_object(
            'q', 'What happens if the dentist finds a problem?',
            'a', 'Your dentist will explain the problem, discuss treatment options, and help you decide on the best course of action. Treatment can often be scheduled at a future appointment.'
        ),
        jsonb_build_object(
            'q', 'How long does a dental exam take?',
            'a', 'A typical exam takes about 30 to 60 minutes, depending on whether X-rays or a cleaning are included in the same visit.'
        ),
        jsonb_build_object(
            'q', 'Can I combine my exam with a cleaning?',
            'a', 'Yes. Many patients schedule their exam and cleaning together in the same visit for convenience.'
        )
    ),

    jsonb_build_array(
        jsonb_build_object(
            'q', '¿Con qué frecuencia debo hacerme un examen dental?',
            'a', 'La mayoría de los dentistas recomiendan cada seis meses. Si tiene enfermedad de las encías, historial de caries u otros factores de riesgo, su dentista puede recomendar visitas más frecuentes.'
        ),
        jsonb_build_object(
            'q', '¿Duele un examen dental?',
            'a', 'No. Un examen de rutina implica un sondeo suave e inspección visual. Puede sentir una ligera presión cuando revisamos sus encías, pero no debería ser doloroso.'
        ),
        jsonb_build_object(
            'q', '¿Necesito radiografías en cada examen?',
            'a', 'No siempre. Su dentista decide según sus factores de riesgo y cuánto tiempo ha pasado desde sus últimas radiografías. La mayoría de los pacientes se hacen radiografías una vez al año o cada dos años.'
        ),
        jsonb_build_object(
            'q', '¿Cuál es la diferencia entre un examen regular y uno completo?',
            'a', 'Un examen completo es más detallado y generalmente se hace en su primera visita o cuando no ha ido al dentista en mucho tiempo. Incluye una evaluación completa de sus dientes, encías, mandíbula y mordida. Un examen periódico es un seguimiento más corto a intervalos regulares.'
        ),
        jsonb_build_object(
            'q', '¿Mi seguro cubrirá un examen dental?',
            'a', 'La mayoría de los planes de seguro dental cubren dos exámenes por año con poco o ningún costo para usted. Consulte con su proveedor de seguros para detalles específicos de cobertura.'
        ),
        jsonb_build_object(
            'q', '¿Qué pasa si el dentista encuentra un problema?',
            'a', 'Su dentista le explicará el problema, discutirá las opciones de tratamiento y le ayudará a decidir el mejor curso de acción. El tratamiento a menudo se puede programar en una cita futura.'
        ),
        jsonb_build_object(
            'q', '¿Cuánto dura un examen dental?',
            'a', 'Un examen típico toma aproximadamente 30 a 60 minutos, dependiendo de si se incluyen radiografías o una limpieza en la misma visita.'
        ),
        jsonb_build_object(
            'q', '¿Puedo combinar mi examen con una limpieza?',
            'a', 'Sí. Muchos pacientes programan su examen y limpieza juntos en la misma visita por conveniencia.'
        )
    ),

    '1 visit, 30-60 minutes',
    '1 appointment (exam, may include cleaning)',
    'diagnostic',
    true
)
ON CONFLICT (slug) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_es = EXCLUDED.title_es,
    summary_en = EXCLUDED.summary_en,
    summary_es = EXCLUDED.summary_es,
    why_en = EXCLUDED.why_en,
    why_es = EXCLUDED.why_es,
    steps_en = EXCLUDED.steps_en,
    steps_es = EXCLUDED.steps_es,
    aftercare_en = EXCLUDED.aftercare_en,
    aftercare_es = EXCLUDED.aftercare_es,
    faqs_en = EXCLUDED.faqs_en,
    faqs_es = EXCLUDED.faqs_es,
    time_estimate = EXCLUDED.time_estimate,
    visits_estimate = EXCLUDED.visits_estimate,
    category = EXCLUDED.category,
    is_published = EXCLUDED.is_published,
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO public.procedure_library (
    slug, title_en, title_es, summary_en, summary_es,
    why_en, why_es, what_if_not_en, what_if_not_es,
    steps_en, steps_es,
    aftercare_en, aftercare_es,
    risks_en, risks_es,
    faqs_en, faqs_es,
    time_estimate, visits_estimate, category, is_published
) VALUES (
    'denture',
    'Denture',
    'Dentadura',

    E'## What this is\n\nA denture is a removable appliance that replaces missing teeth and the surrounding gum tissue. If you are missing several teeth or all of your teeth, dentures restore your ability to eat, speak, and smile with confidence. There are two main types: complete dentures replace all teeth in the upper or lower jaw, and partial dentures replace some teeth when you still have healthy natural teeth remaining. Dentures are custom-made to fit your mouth and look like natural teeth.\n\n## Why you may need it\n\nYou may need dentures if:\n- You are missing most or all of your teeth\n- You have teeth that are too damaged or decayed to save\n- Gum disease has loosened your teeth beyond repair\n- You have difficulty chewing food because of missing teeth\n- You want to improve your appearance and restore your smile\n- You want an affordable option for replacing multiple teeth',

    E'## Qué es esto\n\nUna dentadura es un aparato removible que reemplaza los dientes faltantes y el tejido de encía circundante. Si le faltan varios dientes o todos sus dientes, las dentaduras restauran su capacidad de comer, hablar y sonreír con confianza. Hay dos tipos principales: las dentaduras completas reemplazan todos los dientes en el maxilar superior o inferior, y las dentaduras parciales reemplazan algunos dientes cuando aún tiene dientes naturales sanos. Las dentaduras se hacen a medida para adaptarse a su boca y lucir como dientes naturales.\n\n## Por qué puede necesitarlo\n\nPuede necesitar dentaduras si:\n- Le faltan la mayoría o todos sus dientes\n- Tiene dientes que están demasiado dañados o cariados para salvarlos\n- La enfermedad de las encías ha aflojado sus dientes sin posibilidad de reparación\n- Tiene dificultad para masticar alimentos debido a dientes faltantes\n- Quiere mejorar su apariencia y restaurar su sonrisa\n- Quiere una opción asequible para reemplazar múltiples dientes',

    E'## Why you may need it\n\nDentures replace missing teeth and restore important daily functions. Common reasons include:\n\n**Multiple missing teeth**: You have lost several teeth from decay, gum disease, or injury and need a full restoration\n\n**Severe decay or damage**: Remaining teeth are too damaged to repair with fillings, crowns, or other treatments\n\n**Advanced gum disease**: Periodontitis has destroyed the bone supporting your teeth, making them loose or painful\n\n**Improved nutrition**: Missing teeth make it hard to chew properly, which can affect your diet and overall health\n\n**Speech and appearance**: Missing teeth can change how you speak and affect your facial structure over time\n\n**Affordable tooth replacement**: Dentures are typically less expensive than implants or bridges for replacing many teeth at once',

    E'## Por qué puede necesitarlo\n\nLas dentaduras reemplazan los dientes faltantes y restauran funciones diarias importantes. Razones comunes incluyen:\n\n**Múltiples dientes faltantes**: Ha perdido varios dientes por caries, enfermedad de las encías o lesiones y necesita una restauración completa\n\n**Caries o daño severo**: Los dientes restantes están demasiado dañados para reparar con empastes, coronas u otros tratamientos\n\n**Enfermedad avanzada de las encías**: La periodontitis ha destruido el hueso que sostiene sus dientes, haciéndolos flojos o dolorosos\n\n**Mejor nutrición**: Los dientes faltantes dificultan masticar correctamente, lo que puede afectar su dieta y salud general\n\n**Habla y apariencia**: Los dientes faltantes pueden cambiar cómo habla y afectar la estructura de su cara con el tiempo\n\n**Reemplazo dental asequible**: Las dentaduras generalmente son menos costosas que los implantes o puentes para reemplazar muchos dientes a la vez',

    E'## If you delay\n\nDelaying dentures when you have missing teeth can cause several problems:\n\n**Bone loss accelerates**: Without teeth to stimulate the jawbone, the bone shrinks over time, which can make fitting dentures harder later\n\n**Remaining teeth shift**: If you still have some teeth, they can drift into the gaps, changing your bite and making future dental work more complex\n\n**Nutrition suffers**: Missing teeth limit what you can eat, which may lead to poor nutrition and health problems\n\n**Facial changes**: Loss of teeth causes your face to sag and look older as the jawbone and muscles lose support\n\n**Speech difficulties continue**: Gaps make it harder to pronounce certain words clearly\n\n**Social and emotional impact**: Many people feel self-conscious about missing teeth and avoid smiling or socializing',

    E'## Si se demora\n\nRetrasar las dentaduras cuando tiene dientes faltantes puede causar varios problemas:\n\n**La pérdida ósea se acelera**: Sin dientes que estimulen el hueso de la mandíbula, el hueso se encoge con el tiempo, lo que puede dificultar la adaptación de dentaduras más adelante\n\n**Los dientes restantes se desplazan**: Si aún tiene algunos dientes, pueden moverse hacia los espacios vacíos, cambiando su mordida y haciendo que el trabajo dental futuro sea más complejo\n\n**La nutrición se ve afectada**: Los dientes faltantes limitan lo que puede comer, lo que puede llevar a mala nutrición y problemas de salud\n\n**Cambios faciales**: La pérdida de dientes hace que su cara se hunda y se vea más vieja a medida que el hueso y los músculos pierden soporte\n\n**Las dificultades del habla continúan**: Los espacios dificultan pronunciar ciertas palabras claramente\n\n**Impacto social y emocional**: Muchas personas se sienten cohibidas por los dientes faltantes y evitan sonreír o socializar',

    jsonb_build_array(
        jsonb_build_object(
            'title', 'Step 1: Initial impressions and measurements',
            'description', E'**What we do**: We take detailed molds (impressions) of your upper and lower jaws, along with measurements of how your jaws relate to each other\n\n**What you may feel**: A tray filled with soft putty placed in your mouth for one to two minutes. It may feel a bit bulky but is not painful\n\n**Why it matters**: Accurate impressions are the foundation for dentures that fit well and feel comfortable'
        ),
        jsonb_build_object(
            'title', 'Step 2: Bite registration',
            'description', E'**What we do**: We record how your upper and lower jaws come together when you bite down. We also select the shade, shape, and size of the teeth for your denture\n\n**What you may feel**: You will bite down on a soft wax or silicone material for a moment\n\n**Why it matters**: Matching your natural bite ensures the denture works correctly for chewing and speaking, and selecting the right tooth appearance gives you a natural-looking smile'
        ),
        jsonb_build_object(
            'title', 'Step 3: Try-in appointment',
            'description', E'**What we do**: We place a wax model of your denture in your mouth so you can see how it looks and feels before the final version is made\n\n**What you may feel**: The wax model may feel slightly different from the final denture, but it gives you a preview of the shape, color, and arrangement of the teeth\n\n**Why it matters**: This is your chance to approve the appearance and request any changes before the denture is finalized'
        ),
        jsonb_build_object(
            'title', 'Step 4: Final denture fitting',
            'description', E'**What we do**: We place the completed denture in your mouth, check the fit, bite, and comfort, and make any needed adjustments\n\n**What you may feel**: The denture may feel full or strange at first. We adjust pressure points to improve comfort\n\n**Why it matters**: A proper fit ensures the denture stays in place, works well for eating, and looks natural'
        ),
        jsonb_build_object(
            'title', 'Step 5: Follow-up adjustments',
            'description', E'**What we do**: We schedule one or more follow-up visits to check for sore spots, make fine adjustments, and ensure you are adapting well to your new denture\n\n**What you may feel**: If you have sore spots, we gently adjust the denture to relieve pressure\n\n**Why it matters**: Adjustments in the first few weeks are normal and help you get the best comfort and function from your denture'
        )
    ),

    jsonb_build_array(
        jsonb_build_object(
            'title', 'Paso 1: Impresiones y mediciones iniciales',
            'description', E'**Lo que hacemos**: Tomamos moldes detallados (impresiones) de sus maxilares superior e inferior, junto con mediciones de cómo se relacionan sus mandíbulas entre sí\n\n**Lo que puede sentir**: Una bandeja llena de masilla suave colocada en su boca durante uno a dos minutos. Puede sentirse un poco voluminosa pero no es dolorosa\n\n**Por qué es importante**: Las impresiones precisas son la base para dentaduras que se ajusten bien y se sientan cómodas'
        ),
        jsonb_build_object(
            'title', 'Paso 2: Registro de mordida',
            'description', E'**Lo que hacemos**: Registramos cómo se juntan sus maxilares superior e inferior cuando muerde. También seleccionamos el tono, forma y tamaño de los dientes para su dentadura\n\n**Lo que puede sentir**: Morderá un material suave de cera o silicona por un momento\n\n**Por qué es importante**: Igualar su mordida natural asegura que la dentadura funcione correctamente para masticar y hablar, y seleccionar la apariencia correcta de los dientes le da una sonrisa de aspecto natural'
        ),
        jsonb_build_object(
            'title', 'Paso 3: Cita de prueba',
            'description', E'**Lo que hacemos**: Colocamos un modelo de cera de su dentadura en su boca para que pueda ver cómo se ve y se siente antes de hacer la versión final\n\n**Lo que puede sentir**: El modelo de cera puede sentirse ligeramente diferente a la dentadura final, pero le da una vista previa de la forma, color y disposición de los dientes\n\n**Por qué es importante**: Esta es su oportunidad de aprobar la apariencia y solicitar cualquier cambio antes de que se finalice la dentadura'
        ),
        jsonb_build_object(
            'title', 'Paso 4: Colocación final de la dentadura',
            'description', E'**Lo que hacemos**: Colocamos la dentadura terminada en su boca, verificamos el ajuste, mordida y comodidad, y hacemos los ajustes necesarios\n\n**Lo que puede sentir**: La dentadura puede sentirse llena o extraña al principio. Ajustamos los puntos de presión para mejorar la comodidad\n\n**Por qué es importante**: Un ajuste adecuado asegura que la dentadura se mantenga en su lugar, funcione bien para comer y se vea natural'
        ),
        jsonb_build_object(
            'title', 'Paso 5: Ajustes de seguimiento',
            'description', E'**Lo que hacemos**: Programamos una o más visitas de seguimiento para verificar puntos dolorosos, hacer ajustes finos y asegurar que se esté adaptando bien a su nueva dentadura\n\n**Lo que puede sentir**: Si tiene puntos dolorosos, ajustamos suavemente la dentadura para aliviar la presión\n\n**Por qué es importante**: Los ajustes en las primeras semanas son normales y le ayudan a obtener la mejor comodidad y función de su dentadura'
        )
    ),

    E'## What to expect after\n\n### First 24 hours\n- Your mouth will feel full and strange with the new denture - this is completely normal\n- You may produce more saliva than usual at first\n- Start with soft foods cut into small pieces and chew slowly using both sides of your mouth\n- Practice speaking by reading aloud - some words may sound different at first\n- Remove dentures at night and soak them in water or denture cleaning solution\n\n### First week\n- Sore spots are common as your gums adjust. Do not try to fix the denture yourself - come see us for adjustments\n- Gradually add firmer foods as you get more comfortable\n- Continue practicing speech - most people adjust within a week or two\n- Clean your denture daily with a soft brush and denture cleaner (not regular toothpaste, which can scratch)\n- Brush your gums, tongue, and roof of your mouth with a soft brush before putting the denture back in\n- Use denture adhesive only if recommended by your dentist\n\n### Normal vs not normal\n\n**Normal**:\n- Feeling awkward or full in your mouth for the first few days\n- Increased saliva or mild gagging at first\n- Minor sore spots on your gums\n- Difficulty with certain words temporarily\n- Needing a few adjustment visits\n\n**Not normal - call us if you notice**:\n- Severe pain or sores that do not improve\n- The denture feels very loose or falls out when talking or eating\n- Persistent gagging that does not improve after a week\n- Swelling, redness, or signs of infection under the denture\n- Clicking or popping sounds when eating\n- Difficulty swallowing or breathing\n\n### When to call us\n\nCall our office if you have sore spots, the denture feels loose, or you experience any of the "not normal" symptoms above. Adjustment visits are a normal part of the process.',

    E'## Qué esperar después\n\n### Primeras 24 horas\n- Su boca se sentirá llena y extraña con la nueva dentadura - esto es completamente normal\n- Puede producir más saliva de lo usual al principio\n- Comience con alimentos blandos cortados en trozos pequeños y mastique lentamente usando ambos lados de su boca\n- Practique hablar leyendo en voz alta - algunas palabras pueden sonar diferentes al principio\n- Quítese las dentaduras por la noche y remójelas en agua o solución limpiadora de dentaduras\n\n### Primera semana\n- Los puntos dolorosos son comunes mientras sus encías se ajustan. No intente arreglar la dentadura usted mismo - venga a vernos para ajustes\n- Gradualmente agregue alimentos más firmes a medida que se sienta más cómodo\n- Continúe practicando el habla - la mayoría de las personas se ajustan en una o dos semanas\n- Limpie su dentadura diariamente con un cepillo suave y limpiador de dentaduras (no pasta dental regular, que puede rayar)\n- Cepille sus encías, lengua y paladar con un cepillo suave antes de volver a ponerse la dentadura\n- Use adhesivo para dentaduras solo si lo recomienda su dentista\n\n### Normal vs no normal\n\n**Normal**:\n- Sentirse incómodo o con la boca llena los primeros días\n- Aumento de saliva o arcadas leves al principio\n- Puntos dolorosos menores en las encías\n- Dificultad temporal con ciertas palabras\n- Necesitar algunas visitas de ajuste\n\n**No normal - llámenos si nota**:\n- Dolor severo o llagas que no mejoran\n- La dentadura se siente muy suelta o se cae al hablar o comer\n- Arcadas persistentes que no mejoran después de una semana\n- Hinchazón, enrojecimiento o signos de infección debajo de la dentadura\n- Sonidos de clic o chasquido al comer\n- Dificultad para tragar o respirar\n\n### Cuándo llamarnos\n\nLlame a nuestra oficina si tiene puntos dolorosos, la dentadura se siente suelta o experimenta alguno de los síntomas "no normales" mencionados. Las visitas de ajuste son una parte normal del proceso.',

    E'## Risks and considerations\n\nDentures are safe and well-established, but there are some things to be aware of:\n\n**Adjustment period**: It takes time to get used to wearing dentures. Eating and speaking may feel different at first\n\n**Bone resorption**: Over time, the jawbone underneath dentures slowly shrinks because it is no longer supporting teeth. This can cause dentures to become loose and need relining or replacement\n\n**Sore spots**: Pressure points can develop, especially in the first few weeks. Adjustments resolve most sore spots\n\n**Dietary limitations**: Very hard, sticky, or small-seeded foods may be difficult with dentures\n\n**Denture maintenance**: Dentures need daily cleaning and periodic professional adjustments to maintain fit\n\n**Replacement**: Most dentures need to be replaced or relined every 5 to 7 years as your jaw shape changes',

    E'## Riesgos y consideraciones\n\nLas dentaduras son seguras y están bien establecidas, pero hay algunas cosas que debe saber:\n\n**Período de ajuste**: Toma tiempo acostumbrarse a usar dentaduras. Comer y hablar pueden sentirse diferentes al principio\n\n**Reabsorción ósea**: Con el tiempo, el hueso de la mandíbula debajo de las dentaduras se encoge lentamente porque ya no sostiene dientes. Esto puede hacer que las dentaduras se aflojen y necesiten rebase o reemplazo\n\n**Puntos dolorosos**: Pueden desarrollarse puntos de presión, especialmente en las primeras semanas. Los ajustes resuelven la mayoría de los puntos dolorosos\n\n**Limitaciones dietéticas**: Los alimentos muy duros, pegajosos o con semillas pequeñas pueden ser difíciles con dentaduras\n\n**Mantenimiento de dentaduras**: Las dentaduras necesitan limpieza diaria y ajustes profesionales periódicos para mantener el ajuste\n\n**Reemplazo**: La mayoría de las dentaduras necesitan ser reemplazadas o rebasadas cada 5 a 7 años a medida que cambia la forma de su mandíbula',

    jsonb_build_array(
        jsonb_build_object(
            'q', 'How long does it take to get used to dentures?',
            'a', 'Most people adjust to new dentures within two to four weeks. Eating and speaking improve as you practice. Your brain and muscles learn to work with the denture over time.'
        ),
        jsonb_build_object(
            'q', 'Can I sleep with my dentures in?',
            'a', 'It is best to remove dentures at night to give your gums a rest and prevent infections. Soak them in water or denture solution overnight to keep them from drying out.'
        ),
        jsonb_build_object(
            'q', 'How do I clean my dentures?',
            'a', 'Brush them daily with a soft denture brush and mild soap or denture cleaner. Do not use regular toothpaste - it is too abrasive and can scratch the surface. Rinse them after every meal.'
        ),
        jsonb_build_object(
            'q', 'Will dentures look natural?',
            'a', 'Yes. Modern dentures are made to match the natural color, shape, and size of teeth. Most people will not be able to tell you are wearing dentures.'
        ),
        jsonb_build_object(
            'q', 'Can I eat normally with dentures?',
            'a', 'You can eat most foods once you adjust, but you may need to cut food into smaller pieces and chew slowly. Avoid very hard, sticky, or tough foods that can dislodge or damage the denture.'
        ),
        jsonb_build_object(
            'q', 'Do I still need to see the dentist if I have dentures?',
            'a', 'Yes. Regular checkups are important to check the fit of your dentures, examine your gums and oral tissues, and screen for oral cancer. We recommend at least one visit per year.'
        ),
        jsonb_build_object(
            'q', 'How long do dentures last?',
            'a', 'With good care, dentures typically last 5 to 7 years before they need to be replaced or relined. Your jaw shape changes over time, which affects the fit.'
        ),
        jsonb_build_object(
            'q', 'What if my dentures feel loose?',
            'a', 'Come see us for an adjustment or reline. Do not try to fix them yourself. Loose dentures can cause sore spots and make eating difficult. Denture adhesive can provide temporary improvement, but a professional adjustment is the real solution.'
        ),
        jsonb_build_object(
            'q', 'Are dentures better than implants?',
            'a', 'It depends on your situation. Dentures are less expensive and do not require surgery, but implants are more stable and feel more like natural teeth. Your dentist can help you decide which option is best for you.'
        ),
        jsonb_build_object(
            'q', 'Will dentures affect my speech?',
            'a', 'Some words may sound different at first, but most people adjust within a week or two. Practice reading aloud and speaking slowly until you get comfortable.'
        )
    ),

    jsonb_build_array(
        jsonb_build_object(
            'q', '¿Cuánto tiempo toma acostumbrarse a las dentaduras?',
            'a', 'La mayoría de las personas se ajustan a las dentaduras nuevas en dos a cuatro semanas. Comer y hablar mejoran con la práctica. Su cerebro y músculos aprenden a trabajar con la dentadura con el tiempo.'
        ),
        jsonb_build_object(
            'q', '¿Puedo dormir con mis dentaduras puestas?',
            'a', 'Es mejor quitarse las dentaduras por la noche para darle descanso a sus encías y prevenir infecciones. Remójelas en agua o solución para dentaduras durante la noche para evitar que se sequen.'
        ),
        jsonb_build_object(
            'q', '¿Cómo limpio mis dentaduras?',
            'a', 'Cepíllelas diariamente con un cepillo suave para dentaduras y jabón suave o limpiador de dentaduras. No use pasta dental regular - es demasiado abrasiva y puede rayar la superficie. Enjuáguelas después de cada comida.'
        ),
        jsonb_build_object(
            'q', '¿Las dentaduras se verán naturales?',
            'a', 'Sí. Las dentaduras modernas se hacen para igualar el color, forma y tamaño natural de los dientes. La mayoría de las personas no podrán notar que está usando dentaduras.'
        ),
        jsonb_build_object(
            'q', '¿Puedo comer normalmente con dentaduras?',
            'a', 'Puede comer la mayoría de los alimentos una vez que se ajuste, pero puede necesitar cortar la comida en trozos más pequeños y masticar lentamente. Evite alimentos muy duros, pegajosos o difíciles que pueden desalojar o dañar la dentadura.'
        ),
        jsonb_build_object(
            'q', '¿Todavía necesito ver al dentista si tengo dentaduras?',
            'a', 'Sí. Los chequeos regulares son importantes para verificar el ajuste de sus dentaduras, examinar sus encías y tejidos orales, y detectar cáncer oral. Recomendamos al menos una visita por año.'
        ),
        jsonb_build_object(
            'q', '¿Cuánto duran las dentaduras?',
            'a', 'Con buen cuidado, las dentaduras generalmente duran de 5 a 7 años antes de necesitar reemplazo o rebase. La forma de su mandíbula cambia con el tiempo, lo que afecta el ajuste.'
        ),
        jsonb_build_object(
            'q', '¿Qué pasa si mis dentaduras se sienten sueltas?',
            'a', 'Venga a vernos para un ajuste o rebase. No intente arreglarlas usted mismo. Las dentaduras sueltas pueden causar puntos dolorosos y dificultar la alimentación. El adhesivo para dentaduras puede proporcionar una mejora temporal, pero un ajuste profesional es la solución real.'
        ),
        jsonb_build_object(
            'q', '¿Son las dentaduras mejores que los implantes?',
            'a', 'Depende de su situación. Las dentaduras son menos costosas y no requieren cirugía, pero los implantes son más estables y se sienten más como dientes naturales. Su dentista puede ayudarle a decidir cuál opción es mejor para usted.'
        ),
        jsonb_build_object(
            'q', '¿Las dentaduras afectarán mi habla?',
            'a', 'Algunas palabras pueden sonar diferentes al principio, pero la mayoría de las personas se ajustan en una o dos semanas. Practique leyendo en voz alta y hablando lentamente hasta que se sienta cómodo.'
        )
    ),

    '4-6 visits over 3-6 weeks',
    '4-6 appointments (impressions, bite registration, try-in, fitting, adjustments)',
    'prosthodontics',
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
    aftercare_en = EXCLUDED.aftercare_en,
    aftercare_es = EXCLUDED.aftercare_es,
    risks_en = EXCLUDED.risks_en,
    risks_es = EXCLUDED.risks_es,
    faqs_en = EXCLUDED.faqs_en,
    faqs_es = EXCLUDED.faqs_es,
    time_estimate = EXCLUDED.time_estimate,
    visits_estimate = EXCLUDED.visits_estimate,
    category = EXCLUDED.category,
    is_published = EXCLUDED.is_published,
    updated_at = CURRENT_TIMESTAMP;

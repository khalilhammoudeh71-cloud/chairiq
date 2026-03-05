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
    'implant',
    'Dental Implant',
    'Implante Dental',
    'A dental implant is a titanium post surgically placed into the jawbone to replace a missing tooth root. Once healed, it supports a custom crown that looks, feels, and functions like a natural tooth.',
    'Un implante dental es un poste de titanio que se coloca quirúrgicamente en el hueso de la mandíbula para reemplazar la raíz de un diente perdido. Una vez cicatrizado, sostiene una corona personalizada que se ve, se siente y funciona como un diente natural.',
    '### Why You Need a Dental Implant

Dental implants are the gold standard for replacing missing teeth. They preserve jawbone, prevent neighboring teeth from shifting, and restore full chewing function.

**Common Reasons:**
- Replace a single missing tooth without affecting adjacent teeth
- Anchor a dental bridge or denture securely
- Prevent bone loss in the jaw after tooth extraction
- Restore confidence in your smile and ability to eat comfortably',
    '### Por Qué Necesita un Implante Dental

Los implantes dentales son el estándar de oro para reemplazar dientes perdidos. Preservan el hueso de la mandíbula, evitan que los dientes vecinos se desplacen y restauran la función masticatoria completa.

**Razones Comunes:**
- Reemplazar un solo diente perdido sin afectar los dientes adyacentes
- Anclar un puente dental o dentadura de forma segura
- Prevenir la pérdida ósea en la mandíbula después de una extracción
- Restaurar la confianza en su sonrisa y capacidad para comer cómodamente',
    'Without an implant, the jawbone at the extraction site will gradually shrink. Neighboring teeth may shift into the gap, causing bite problems, difficulty chewing, and potential TMJ issues. Over time, facial structure can change due to bone loss.',
    'Sin un implante, el hueso de la mandíbula en el sitio de extracción se reducirá gradualmente. Los dientes vecinos pueden desplazarse hacia el espacio, causando problemas de mordida, dificultad para masticar y posibles problemas de ATM. Con el tiempo, la estructura facial puede cambiar debido a la pérdida ósea.',
    '[
        {
            "stepTitle": "Consultation & Planning",
            "stepBody": "Your dentist examines your mouth, takes X-rays or a CBCT scan, and creates a personalized treatment plan. Bone density and gum health are evaluated to ensure you are a good candidate.",
            "imageKey": "implant-consult"
        },
        {
            "stepTitle": "Implant Placement",
            "stepBody": "The titanium implant post is surgically placed into the jawbone under local anesthesia. The gum tissue is closed over or around the implant to begin the healing process.",
            "imageKey": "implant-placement"
        },
        {
            "stepTitle": "Osseointegration (Healing)",
            "stepBody": "Over the next 3-6 months, the implant fuses with the jawbone in a process called osseointegration. During this time, a temporary restoration may be placed.",
            "imageKey": "implant-healing"
        },
        {
            "stepTitle": "Abutment Placement",
            "stepBody": "Once the implant has fully integrated, a small connector piece called an abutment is attached to the implant. This serves as the base for your new crown.",
            "imageKey": "implant-abutment"
        },
        {
            "stepTitle": "Crown Placement",
            "stepBody": "A custom-made crown is fabricated to match your natural teeth and is securely attached to the abutment. Your new tooth is now fully functional.",
            "imageKey": "implant-crown"
        },
        {
            "stepTitle": "Follow-Up & Maintenance",
            "stepBody": "Your dentist checks the implant fit, bite alignment, and gum health. Regular checkups and good oral hygiene ensure your implant lasts a lifetime.",
            "imageKey": "implant-followup"
        }
    ]'::JSONB,
    '[
        {
            "stepTitle": "Consulta y Planificación",
            "stepBody": "Su dentista examina su boca, toma radiografías o una tomografía CBCT y crea un plan de tratamiento personalizado. Se evalúan la densidad ósea y la salud de las encías para asegurar que usted sea un buen candidato.",
            "imageKey": "implant-consult"
        },
        {
            "stepTitle": "Colocación del Implante",
            "stepBody": "El poste de titanio del implante se coloca quirúrgicamente en el hueso de la mandíbula bajo anestesia local. El tejido de la encía se cierra sobre o alrededor del implante para iniciar el proceso de cicatrización.",
            "imageKey": "implant-placement"
        },
        {
            "stepTitle": "Osteointegración (Cicatrización)",
            "stepBody": "Durante los próximos 3 a 6 meses, el implante se fusiona con el hueso de la mandíbula en un proceso llamado osteointegración. Durante este tiempo, se puede colocar una restauración temporal.",
            "imageKey": "implant-healing"
        },
        {
            "stepTitle": "Colocación del Pilar",
            "stepBody": "Una vez que el implante se ha integrado completamente, se coloca una pequeña pieza conectora llamada pilar sobre el implante. Esto sirve como base para su nueva corona.",
            "imageKey": "implant-abutment"
        },
        {
            "stepTitle": "Colocación de la Corona",
            "stepBody": "Se fabrica una corona personalizada para que coincida con sus dientes naturales y se fija de forma segura al pilar. Su nuevo diente ahora es completamente funcional.",
            "imageKey": "implant-crown"
        },
        {
            "stepTitle": "Seguimiento y Mantenimiento",
            "stepBody": "Su dentista verifica el ajuste del implante, la alineación de la mordida y la salud de las encías. Los chequeos regulares y una buena higiene oral aseguran que su implante dure toda la vida.",
            "imageKey": "implant-followup"
        }
    ]'::JSONB,
    'Local anesthesia is used to numb the surgical area. Sedation options (oral or IV) may be available for anxious patients. You will feel pressure but should not feel pain during the procedure.',
    'Se usa anestesia local para adormecer el área quirúrgica. Opciones de sedación (oral o intravenosa) pueden estar disponibles para pacientes ansiosos. Sentirá presión pero no debe sentir dolor durante el procedimiento.',
    '**Possible risks include:**
- Infection at the implant site
- Nerve damage causing numbness or tingling
- Sinus problems (for upper jaw implants)
- Implant failure to integrate with bone (rare, ~2-5%)
- Temporary swelling and bruising',
    '**Los posibles riesgos incluyen:**
- Infección en el sitio del implante
- Daño nervioso que causa entumecimiento u hormigueo
- Problemas de senos nasales (para implantes en la mandíbula superior)
- Fallo del implante en integrarse con el hueso (raro, ~2-5%)
- Hinchazón y moretones temporales',
    '### Aftercare Instructions

**First 48 Hours:**
- Apply ice packs to reduce swelling (20 min on, 20 min off)
- Eat soft, cool foods only
- Avoid rinsing or spitting forcefully
- Take prescribed antibiotics and pain medication

**First Two Weeks:**
- Rinse gently with warm salt water after 24 hours
- Avoid smoking and alcohol
- Eat soft foods and chew on the opposite side
- Do not disturb the surgical site

**Long-Term Care:**
- Brush and floss around the implant daily
- Use an interdental brush or water flosser
- Visit your dentist every 6 months
- Avoid biting extremely hard objects',
    '### Instrucciones de Cuidado Posterior

**Primeras 48 Horas:**
- Aplique compresas de hielo para reducir la hinchazón (20 min sí, 20 min no)
- Coma solo alimentos blandos y frescos
- Evite enjuagar o escupir con fuerza
- Tome los antibióticos y medicamentos para el dolor recetados

**Primeras Dos Semanas:**
- Enjuague suavemente con agua tibia con sal después de 24 horas
- Evite fumar y el alcohol
- Coma alimentos blandos y mastique del lado opuesto
- No disturbe el sitio quirúrgico

**Cuidado a Largo Plazo:**
- Cepille y use hilo dental alrededor del implante diariamente
- Use un cepillo interdental o irrigador dental
- Visite a su dentista cada 6 meses
- Evite morder objetos extremadamente duros',
    '[
        {
            "q": "How long does the entire implant process take?",
            "a": "The full process typically takes 4-8 months, including healing time. The surgical placement itself takes about 1-2 hours."
        },
        {
            "q": "How long do dental implants last?",
            "a": "With proper care, dental implants can last a lifetime. The crown on top may need replacement every 10-15 years."
        },
        {
            "q": "Is the surgery painful?",
            "a": "The procedure is performed under anesthesia, so you should not feel pain. Most patients report less discomfort than expected, similar to having a tooth extracted."
        },
        {
            "q": "Am I a candidate for dental implants?",
            "a": "Most adults with adequate jawbone density and good overall health are candidates. Your dentist will evaluate your specific situation with imaging and exams."
        }
    ]'::JSONB,
    '[
        {
            "q": "¿Cuánto tiempo toma todo el proceso de implante?",
            "a": "El proceso completo generalmente toma de 4 a 8 meses, incluyendo el tiempo de cicatrización. La colocación quirúrgica en sí toma aproximadamente 1-2 horas."
        },
        {
            "q": "¿Cuánto duran los implantes dentales?",
            "a": "Con el cuidado adecuado, los implantes dentales pueden durar toda la vida. La corona encima puede necesitar reemplazo cada 10-15 años."
        },
        {
            "q": "¿La cirugía es dolorosa?",
            "a": "El procedimiento se realiza bajo anestesia, por lo que no debe sentir dolor. La mayoría de los pacientes reportan menos molestias de las esperadas, similar a una extracción dental."
        },
        {
            "q": "¿Soy candidato para implantes dentales?",
            "a": "La mayoría de los adultos con densidad ósea adecuada y buena salud general son candidatos. Su dentista evaluará su situación específica con imágenes y exámenes."
        }
    ]'::JSONB,
    '1-2 hours per surgical visit',
    '3-5 visits over 4-8 months',
    '{"heroKey": "implant-hero", "stepKeys": ["implant-consult", "implant-placement", "implant-healing", "implant-abutment", "implant-crown", "implant-followup"]}'::JSONB,
    'implants',
    true
),
(
    'cleaning',
    'Dental Cleaning (Prophylaxis)',
    'Limpieza Dental (Profilaxis)',
    'A dental cleaning, or prophylaxis, is a professional procedure to remove plaque, tartar, and stains from your teeth. It helps prevent cavities, gum disease, and keeps your smile healthy and bright.',
    'Una limpieza dental, o profilaxis, es un procedimiento profesional para eliminar la placa, el sarro y las manchas de sus dientes. Ayuda a prevenir caries, enfermedades de las encías y mantiene su sonrisa saludable y brillante.',
    '### Why You Need Regular Dental Cleanings

Even with excellent brushing and flossing, plaque and tartar build up in hard-to-reach areas. Professional cleanings remove these deposits before they cause cavities or gum disease.

**Key Benefits:**
- Remove hardened tartar that brushing cannot eliminate
- Detect early signs of cavities, gum disease, and oral cancer
- Prevent bad breath caused by bacteria buildup
- Maintain overall oral and systemic health',
    '### Por Qué Necesita Limpiezas Dentales Regulares

Incluso con un excelente cepillado y uso de hilo dental, la placa y el sarro se acumulan en áreas difíciles de alcanzar. Las limpiezas profesionales eliminan estos depósitos antes de que causen caries o enfermedades de las encías.

**Beneficios Clave:**
- Eliminar el sarro endurecido que el cepillado no puede eliminar
- Detectar signos tempranos de caries, enfermedades de las encías y cáncer oral
- Prevenir el mal aliento causado por la acumulación de bacterias
- Mantener la salud oral y sistémica general',
    NULL,
    NULL,
    '[
        {
            "stepTitle": "Oral Examination",
            "stepBody": "Your dental hygienist examines your teeth and gums, checking for any signs of inflammation, cavities, or other concerns before beginning the cleaning.",
            "imageKey": "cleaning-exam"
        },
        {
            "stepTitle": "Scaling (Tartar Removal)",
            "stepBody": "Using specialized instruments, the hygienist carefully removes plaque and tartar deposits from all tooth surfaces, including along and just below the gum line.",
            "imageKey": "cleaning-scaling"
        },
        {
            "stepTitle": "Polishing",
            "stepBody": "A gritty prophylaxis paste is applied with a rotating polishing cup to remove surface stains and smooth the tooth surfaces, making it harder for plaque to adhere.",
            "imageKey": "cleaning-polishing"
        },
        {
            "stepTitle": "Fluoride Treatment",
            "stepBody": "A fluoride varnish or gel is applied to strengthen tooth enamel and provide additional protection against cavities for several months.",
            "imageKey": "cleaning-fluoride"
        }
    ]'::JSONB,
    '[
        {
            "stepTitle": "Examen Oral",
            "stepBody": "Su higienista dental examina sus dientes y encías, verificando cualquier signo de inflamación, caries u otras preocupaciones antes de comenzar la limpieza.",
            "imageKey": "cleaning-exam"
        },
        {
            "stepTitle": "Raspado (Eliminación de Sarro)",
            "stepBody": "Usando instrumentos especializados, el higienista elimina cuidadosamente los depósitos de placa y sarro de todas las superficies dentales, incluyendo a lo largo y justo debajo de la línea de las encías.",
            "imageKey": "cleaning-scaling"
        },
        {
            "stepTitle": "Pulido",
            "stepBody": "Se aplica una pasta de profilaxis granulada con una copa de pulido giratoria para eliminar las manchas superficiales y alisar las superficies dentales, dificultando la adherencia de la placa.",
            "imageKey": "cleaning-polishing"
        },
        {
            "stepTitle": "Tratamiento con Flúor",
            "stepBody": "Se aplica un barniz o gel de flúor para fortalecer el esmalte dental y proporcionar protección adicional contra las caries durante varios meses.",
            "imageKey": "cleaning-fluoride"
        }
    ]'::JSONB,
    'No anesthesia is typically needed for a routine cleaning. If you have sensitive teeth or gums, a topical numbing gel may be applied for comfort.',
    'Generalmente no se necesita anestesia para una limpieza de rutina. Si tiene dientes o encías sensibles, se puede aplicar un gel anestésico tópico para mayor comodidad.',
    NULL,
    NULL,
    '### Aftercare Instructions

**After Your Cleaning:**
- Wait 30 minutes before eating or drinking if fluoride was applied
- Slight gum sensitivity is normal and should resolve within a day
- Continue your regular brushing and flossing routine

**Between Visits:**
- Brush twice daily with fluoride toothpaste
- Floss at least once daily
- Consider using an antimicrobial mouthwash
- Schedule cleanings every 6 months (or as recommended)',
    '### Instrucciones de Cuidado Posterior

**Después de Su Limpieza:**
- Espere 30 minutos antes de comer o beber si se aplicó flúor
- La sensibilidad leve de las encías es normal y debería resolverse en un día
- Continúe su rutina regular de cepillado y uso de hilo dental

**Entre Visitas:**
- Cepille dos veces al día con pasta dental con flúor
- Use hilo dental al menos una vez al día
- Considere usar un enjuague bucal antimicrobiano
- Programe limpiezas cada 6 meses (o según lo recomendado)',
    '[
        {
            "q": "How often should I get a dental cleaning?",
            "a": "Most people should have a professional cleaning every 6 months. If you have gum disease or other risk factors, your dentist may recommend more frequent visits."
        },
        {
            "q": "Does a dental cleaning hurt?",
            "a": "Most patients experience little to no discomfort. You may feel some pressure or minor sensitivity during tartar removal, especially if there is significant buildup."
        },
        {
            "q": "How long does a cleaning take?",
            "a": "A routine dental cleaning typically takes 30-60 minutes, depending on the amount of buildup and your overall oral health."
        }
    ]'::JSONB,
    '[
        {
            "q": "¿Con qué frecuencia debo hacerme una limpieza dental?",
            "a": "La mayoría de las personas deben hacerse una limpieza profesional cada 6 meses. Si tiene enfermedad de las encías u otros factores de riesgo, su dentista puede recomendar visitas más frecuentes."
        },
        {
            "q": "¿La limpieza dental duele?",
            "a": "La mayoría de los pacientes experimentan poca o ninguna molestia. Puede sentir algo de presión o sensibilidad menor durante la eliminación del sarro, especialmente si hay una acumulación significativa."
        },
        {
            "q": "¿Cuánto tiempo toma una limpieza?",
            "a": "Una limpieza dental de rutina generalmente toma de 30 a 60 minutos, dependiendo de la cantidad de acumulación y su salud oral general."
        }
    ]'::JSONB,
    '30-60 minutes',
    '1 visit every 6 months',
    '{"heroKey": "cleaning-hero", "stepKeys": ["cleaning-exam", "cleaning-scaling", "cleaning-polishing", "cleaning-fluoride"]}'::JSONB,
    'preventive',
    true
),
(
    'veneer',
    'Dental Veneer',
    'Carilla Dental',
    'A dental veneer is a thin, custom-made shell of tooth-colored porcelain or composite resin that is bonded to the front surface of a tooth to improve its appearance. Veneers can transform your smile by correcting color, shape, size, or alignment.',
    'Una carilla dental es una fina cubierta personalizada de porcelana o resina compuesta del color del diente que se adhiere a la superficie frontal del diente para mejorar su apariencia. Las carillas pueden transformar su sonrisa corrigiendo el color, la forma, el tamaño o la alineación.',
    '### Why You May Want Veneers

Veneers offer a conservative yet dramatic improvement to your smile. They are an excellent option when teeth are structurally sound but cosmetically imperfect.

**Common Reasons:**
- Severely stained or discolored teeth that do not respond to whitening
- Chipped, cracked, or worn teeth
- Uneven, irregularly shaped, or slightly misaligned teeth
- Gaps between teeth
- Desire for a complete smile makeover',
    '### Por Qué Puede Querer Carillas

Las carillas ofrecen una mejora conservadora pero dramática a su sonrisa. Son una excelente opción cuando los dientes están estructuralmente sanos pero cosméticamente imperfectos.

**Razones Comunes:**
- Dientes severamente manchados o descoloridos que no responden al blanqueamiento
- Dientes astillados, agrietados o desgastados
- Dientes desiguales, de forma irregular o ligeramente desalineados
- Espacios entre dientes
- Deseo de una renovación completa de la sonrisa',
    'Without veneers, cosmetic concerns may worsen over time. Chipped or worn teeth can become more damaged. Stains may deepen, and gaps may widen as teeth shift. While not medically urgent, these issues can affect self-confidence and quality of life.',
    'Sin carillas, las preocupaciones cosméticas pueden empeorar con el tiempo. Los dientes astillados o desgastados pueden dañarse más. Las manchas pueden profundizarse y los espacios pueden ampliarse a medida que los dientes se desplazan. Aunque no es médicamente urgente, estos problemas pueden afectar la autoconfianza y la calidad de vida.',
    '[
        {
            "stepTitle": "Consultation & Smile Design",
            "stepBody": "Your dentist discusses your goals, examines your teeth, and may use digital imaging to preview your new smile. Together you choose the ideal shade, shape, and number of veneers.",
            "imageKey": "veneer-consult"
        },
        {
            "stepTitle": "Tooth Preparation",
            "stepBody": "A thin layer of enamel (about 0.5mm) is gently removed from the front of each tooth to make room for the veneer. Impressions are taken and sent to the dental laboratory.",
            "imageKey": "veneer-prep"
        },
        {
            "stepTitle": "Temporary Veneers",
            "stepBody": "Temporary veneers are placed to protect your prepared teeth and give you a preview of your new smile while the permanent veneers are crafted in the lab.",
            "imageKey": "veneer-temp"
        },
        {
            "stepTitle": "Veneer Try-In & Bonding",
            "stepBody": "The custom veneers are tried in to check fit, color, and shape. Once approved, each veneer is permanently bonded to the tooth using a special adhesive and curing light.",
            "imageKey": "veneer-bonding"
        },
        {
            "stepTitle": "Final Adjustments",
            "stepBody": "Your bite is checked and minor adjustments are made to ensure comfort and a natural feel. A follow-up visit confirms everything is perfect.",
            "imageKey": "veneer-final"
        }
    ]'::JSONB,
    '[
        {
            "stepTitle": "Consulta y Diseño de Sonrisa",
            "stepBody": "Su dentista discute sus objetivos, examina sus dientes y puede usar imágenes digitales para previsualizar su nueva sonrisa. Juntos eligen el tono, la forma y el número ideal de carillas.",
            "imageKey": "veneer-consult"
        },
        {
            "stepTitle": "Preparación del Diente",
            "stepBody": "Se retira suavemente una fina capa de esmalte (aproximadamente 0.5mm) del frente de cada diente para hacer espacio para la carilla. Se toman impresiones y se envían al laboratorio dental.",
            "imageKey": "veneer-prep"
        },
        {
            "stepTitle": "Carillas Temporales",
            "stepBody": "Se colocan carillas temporales para proteger sus dientes preparados y darle una vista previa de su nueva sonrisa mientras las carillas permanentes se fabrican en el laboratorio.",
            "imageKey": "veneer-temp"
        },
        {
            "stepTitle": "Prueba y Adhesión de Carillas",
            "stepBody": "Las carillas personalizadas se prueban para verificar el ajuste, el color y la forma. Una vez aprobadas, cada carilla se adhiere permanentemente al diente usando un adhesivo especial y luz de curado.",
            "imageKey": "veneer-bonding"
        },
        {
            "stepTitle": "Ajustes Finales",
            "stepBody": "Se verifica su mordida y se realizan ajustes menores para asegurar la comodidad y una sensación natural. Una visita de seguimiento confirma que todo está perfecto.",
            "imageKey": "veneer-final"
        }
    ]'::JSONB,
    'Local anesthesia may be used during tooth preparation to ensure comfort, though the procedure involves minimal enamel removal and some patients need little to no numbing.',
    'Se puede usar anestesia local durante la preparación del diente para asegurar la comodidad, aunque el procedimiento implica una remoción mínima de esmalte y algunos pacientes necesitan poca o ninguna anestesia.',
    '**Possible risks include:**
- Increased tooth sensitivity to hot and cold
- Veneers can chip or crack under excessive force
- The process is irreversible since enamel is removed
- Color mismatch if not all teeth are treated
- Rare cases of veneer debonding',
    '**Los posibles riesgos incluyen:**
- Mayor sensibilidad dental al calor y al frío
- Las carillas pueden astillarse o agrietarse bajo fuerza excesiva
- El proceso es irreversible ya que se retira esmalte
- Desajuste de color si no se tratan todos los dientes
- Casos raros de desprendimiento de carillas',
    '### Aftercare Instructions

**First 48 Hours:**
- Avoid very hot or cold foods and beverages
- Eat soft foods initially
- Do not bite into hard foods with your front teeth

**Long-Term Care:**
- Brush twice daily with non-abrasive toothpaste
- Floss daily — veneers require the same care as natural teeth
- Avoid biting nails, pens, ice, or hard objects
- Wear a night guard if you grind your teeth
- Visit your dentist for regular checkups every 6 months',
    '### Instrucciones de Cuidado Posterior

**Primeras 48 Horas:**
- Evite alimentos y bebidas muy calientes o fríos
- Coma alimentos blandos inicialmente
- No muerda alimentos duros con los dientes frontales

**Cuidado a Largo Plazo:**
- Cepille dos veces al día con pasta dental no abrasiva
- Use hilo dental diariamente — las carillas requieren el mismo cuidado que los dientes naturales
- Evite morder uñas, bolígrafos, hielo u objetos duros
- Use un protector nocturno si rechina los dientes
- Visite a su dentista para chequeos regulares cada 6 meses',
    '[
        {
            "q": "How long do veneers last?",
            "a": "Porcelain veneers typically last 10-20 years with proper care. Composite veneers may last 5-7 years before needing replacement."
        },
        {
            "q": "Will veneers look natural?",
            "a": "Yes! Modern porcelain veneers are crafted to mimic the translucency and color of natural teeth. Most people cannot tell the difference."
        },
        {
            "q": "Can I still get cavities with veneers?",
            "a": "The veneer itself cannot decay, but the tooth underneath still can. Good oral hygiene is essential to protect the remaining tooth structure."
        },
        {
            "q": "Is the procedure reversible?",
            "a": "Traditional veneers require enamel removal and are not reversible. Minimal-prep or no-prep veneers may be an option if you want a less permanent solution."
        }
    ]'::JSONB,
    '[
        {
            "q": "¿Cuánto duran las carillas?",
            "a": "Las carillas de porcelana generalmente duran de 10 a 20 años con el cuidado adecuado. Las carillas de resina compuesta pueden durar de 5 a 7 años antes de necesitar reemplazo."
        },
        {
            "q": "¿Las carillas se verán naturales?",
            "a": "¡Sí! Las carillas de porcelana modernas están diseñadas para imitar la translucidez y el color de los dientes naturales. La mayoría de las personas no pueden notar la diferencia."
        },
        {
            "q": "¿Puedo tener caries con carillas?",
            "a": "La carilla en sí no puede tener caries, pero el diente debajo sí puede. Una buena higiene oral es esencial para proteger la estructura dental restante."
        },
        {
            "q": "¿El procedimiento es reversible?",
            "a": "Las carillas tradicionales requieren remoción de esmalte y no son reversibles. Las carillas de preparación mínima o sin preparación pueden ser una opción si desea una solución menos permanente."
        }
    ]'::JSONB,
    '1-2 hours per visit',
    '2-3 visits over 2-4 weeks',
    '{"heroKey": "veneer-hero", "stepKeys": ["veneer-consult", "veneer-prep", "veneer-temp", "veneer-bonding", "veneer-final"]}'::JSONB,
    'cosmetic',
    true
),
(
    'whitening',
    'Teeth Whitening',
    'Blanqueamiento Dental',
    'Professional teeth whitening is a safe, effective cosmetic treatment that lightens the color of your teeth by several shades. It removes stains caused by food, drinks, tobacco, and aging to reveal a brighter, more confident smile.',
    'El blanqueamiento dental profesional es un tratamiento cosmético seguro y efectivo que aclara el color de sus dientes en varios tonos. Elimina las manchas causadas por alimentos, bebidas, tabaco y el envejecimiento para revelar una sonrisa más brillante y segura.',
    '### Why Choose Professional Whitening

Professional whitening delivers faster, more dramatic, and more consistent results than over-the-counter products. Your dentist ensures the treatment is safe for your teeth and gums.

**Common Reasons:**
- Staining from coffee, tea, wine, or tobacco
- Yellowing due to natural aging
- Desire for a brighter smile for a special occasion
- Uneven tooth color after dental work
- Boost in self-confidence',
    '### Por Qué Elegir Blanqueamiento Profesional

El blanqueamiento profesional ofrece resultados más rápidos, más dramáticos y más consistentes que los productos de venta libre. Su dentista asegura que el tratamiento sea seguro para sus dientes y encías.

**Razones Comunes:**
- Manchas por café, té, vino o tabaco
- Amarillamiento debido al envejecimiento natural
- Deseo de una sonrisa más brillante para una ocasión especial
- Color dental desigual después de trabajos dentales
- Aumento de la autoconfianza',
    NULL,
    NULL,
    '[
        {
            "stepTitle": "Examination & Shade Assessment",
            "stepBody": "Your dentist examines your teeth to ensure whitening is appropriate, checks for cavities or gum issues, and records your current tooth shade for comparison.",
            "imageKey": "whitening-exam"
        },
        {
            "stepTitle": "Gum Protection",
            "stepBody": "A protective barrier or gel is applied to your gums and soft tissues to shield them from the whitening agent, ensuring only your teeth are treated.",
            "imageKey": "whitening-protection"
        },
        {
            "stepTitle": "Whitening Agent Application",
            "stepBody": "A professional-strength hydrogen peroxide or carbamide peroxide gel is carefully applied to the surface of your teeth.",
            "imageKey": "whitening-application"
        },
        {
            "stepTitle": "Light Activation & Results",
            "stepBody": "A special LED or laser light may be used to accelerate the whitening process. After the treatment, the gel is removed and your new, brighter shade is revealed.",
            "imageKey": "whitening-results"
        }
    ]'::JSONB,
    '[
        {
            "stepTitle": "Examen y Evaluación de Tono",
            "stepBody": "Su dentista examina sus dientes para asegurar que el blanqueamiento sea apropiado, verifica si hay caries o problemas de encías y registra el tono actual de sus dientes para comparación.",
            "imageKey": "whitening-exam"
        },
        {
            "stepTitle": "Protección de Encías",
            "stepBody": "Se aplica una barrera protectora o gel a sus encías y tejidos blandos para protegerlos del agente blanqueador, asegurando que solo se traten sus dientes.",
            "imageKey": "whitening-protection"
        },
        {
            "stepTitle": "Aplicación del Agente Blanqueador",
            "stepBody": "Se aplica cuidadosamente un gel de peróxido de hidrógeno o peróxido de carbamida de grado profesional a la superficie de sus dientes.",
            "imageKey": "whitening-application"
        },
        {
            "stepTitle": "Activación con Luz y Resultados",
            "stepBody": "Se puede usar una luz LED o láser especial para acelerar el proceso de blanqueamiento. Después del tratamiento, se retira el gel y se revela su nuevo tono más brillante.",
            "imageKey": "whitening-results"
        }
    ]'::JSONB,
    'No anesthesia is required for teeth whitening. Some patients may experience temporary sensitivity during or after the procedure.',
    'No se requiere anestesia para el blanqueamiento dental. Algunos pacientes pueden experimentar sensibilidad temporal durante o después del procedimiento.',
    '**Possible side effects:**
- Temporary tooth sensitivity to hot and cold (usually resolves within 48 hours)
- Mild gum irritation if whitening gel contacts soft tissue
- Results vary depending on the type and severity of staining
- Whitening does not change the color of existing crowns, fillings, or veneers',
    '**Posibles efectos secundarios:**
- Sensibilidad dental temporal al calor y al frío (generalmente se resuelve en 48 horas)
- Irritación leve de las encías si el gel blanqueador contacta el tejido blando
- Los resultados varían según el tipo y la severidad de las manchas
- El blanqueamiento no cambia el color de coronas, empastes o carillas existentes',
    '### Aftercare Instructions

**First 48 Hours (Critical Period):**
- Avoid dark-colored foods and beverages (coffee, tea, red wine, berries, soy sauce)
- Avoid tobacco products
- Eat white or light-colored foods (chicken, rice, pasta, white fish)
- Use a sensitivity toothpaste if needed

**Long-Term Maintenance:**
- Brush twice daily with whitening toothpaste
- Use a straw for staining beverages
- Schedule touch-up treatments every 6-12 months
- Maintain regular dental cleanings',
    '### Instrucciones de Cuidado Posterior

**Primeras 48 Horas (Período Crítico):**
- Evite alimentos y bebidas de color oscuro (café, té, vino tinto, bayas, salsa de soja)
- Evite productos de tabaco
- Coma alimentos blancos o de color claro (pollo, arroz, pasta, pescado blanco)
- Use pasta dental para sensibilidad si es necesario

**Mantenimiento a Largo Plazo:**
- Cepille dos veces al día con pasta dental blanqueadora
- Use un popote para bebidas que manchan
- Programe tratamientos de retoque cada 6-12 meses
- Mantenga limpiezas dentales regulares',
    '[
        {
            "q": "How white will my teeth get?",
            "a": "Professional whitening can lighten teeth by 3-8 shades. Results depend on the original shade and type of staining. Your dentist will discuss realistic expectations."
        },
        {
            "q": "How long do whitening results last?",
            "a": "Results typically last 6 months to 2 years, depending on your diet, habits, and oral care routine. Touch-up treatments can extend results."
        },
        {
            "q": "Is teeth whitening safe?",
            "a": "Yes, professional whitening supervised by a dentist is safe. The products used are specially formulated to minimize sensitivity and protect your enamel."
        }
    ]'::JSONB,
    '[
        {
            "q": "¿Qué tan blancos quedarán mis dientes?",
            "a": "El blanqueamiento profesional puede aclarar los dientes de 3 a 8 tonos. Los resultados dependen del tono original y del tipo de manchas. Su dentista discutirá expectativas realistas."
        },
        {
            "q": "¿Cuánto duran los resultados del blanqueamiento?",
            "a": "Los resultados generalmente duran de 6 meses a 2 años, dependiendo de su dieta, hábitos y rutina de cuidado oral. Los tratamientos de retoque pueden extender los resultados."
        },
        {
            "q": "¿El blanqueamiento dental es seguro?",
            "a": "Sí, el blanqueamiento profesional supervisado por un dentista es seguro. Los productos utilizados están especialmente formulados para minimizar la sensibilidad y proteger su esmalte."
        }
    ]'::JSONB,
    '60-90 minutes',
    '1 visit (touch-ups as needed)',
    '{"heroKey": "whitening-hero", "stepKeys": ["whitening-exam", "whitening-protection", "whitening-application", "whitening-results"]}'::JSONB,
    'cosmetic',
    true
),
(
    'orthodontics',
    'Orthodontic Treatment (Braces/Aligners)',
    'Tratamiento de Ortodoncia (Brackets/Alineadores)',
    'Orthodontic treatment uses braces, clear aligners, or other appliances to gradually move teeth into proper alignment. It corrects bite issues, crowding, spacing, and jaw misalignment for improved function and aesthetics.',
    'El tratamiento de ortodoncia usa brackets, alineadores transparentes u otros aparatos para mover gradualmente los dientes a la alineación correcta. Corrige problemas de mordida, apiñamiento, espaciado y desalineación de la mandíbula para mejorar la función y la estética.',
    '### Why You May Need Orthodontic Treatment

Orthodontic treatment does more than straighten teeth — it improves your bite, oral health, and overall well-being. Properly aligned teeth are easier to clean and less prone to decay and gum disease.

**Common Reasons:**
- Crowded or overlapping teeth
- Gaps or spacing between teeth
- Overbite, underbite, or crossbite
- Difficulty chewing or speaking
- Jaw pain or TMJ issues related to misalignment
- Desire for a straighter, more attractive smile',
    '### Por Qué Puede Necesitar Tratamiento de Ortodoncia

El tratamiento de ortodoncia hace más que enderezar los dientes — mejora su mordida, salud oral y bienestar general. Los dientes correctamente alineados son más fáciles de limpiar y menos propensos a caries y enfermedades de las encías.

**Razones Comunes:**
- Dientes apiñados o superpuestos
- Espacios o separaciones entre dientes
- Sobremordida, submordida o mordida cruzada
- Dificultad para masticar o hablar
- Dolor de mandíbula o problemas de ATM relacionados con la desalineación
- Deseo de una sonrisa más recta y atractiva',
    NULL,
    NULL,
    '[
        {
            "stepTitle": "Consultation & Records",
            "stepBody": "Your orthodontist takes X-rays, photographs, and impressions or digital scans of your teeth. A customized treatment plan is created showing expected tooth movements and timeline.",
            "imageKey": "ortho-consult"
        },
        {
            "stepTitle": "Appliance Placement / Aligner Fitting",
            "stepBody": "For braces, brackets are bonded to each tooth and connected with archwires. For clear aligners, you receive your first set of custom trays with instructions for wear.",
            "imageKey": "ortho-placement"
        },
        {
            "stepTitle": "Regular Adjustments",
            "stepBody": "You visit the orthodontist every 4-8 weeks for wire adjustments (braces) or to receive new aligner trays. Each adjustment gradually moves teeth closer to their ideal position.",
            "imageKey": "ortho-adjustments"
        },
        {
            "stepTitle": "Monitoring Progress",
            "stepBody": "Periodic X-rays and evaluations track tooth movement. Your treatment plan may be refined along the way to ensure the best possible outcome.",
            "imageKey": "ortho-monitoring"
        },
        {
            "stepTitle": "Appliance Removal & Retention",
            "stepBody": "Once teeth are in their final positions, braces are removed or you finish your last aligner. A retainer (fixed or removable) is provided to maintain your new smile.",
            "imageKey": "ortho-retention"
        }
    ]'::JSONB,
    '[
        {
            "stepTitle": "Consulta y Registros",
            "stepBody": "Su ortodoncista toma radiografías, fotografías e impresiones o escaneos digitales de sus dientes. Se crea un plan de tratamiento personalizado que muestra los movimientos dentales esperados y el cronograma.",
            "imageKey": "ortho-consult"
        },
        {
            "stepTitle": "Colocación de Aparatos / Ajuste de Alineadores",
            "stepBody": "Para brackets, se adhieren los soportes a cada diente y se conectan con arcos de alambre. Para alineadores transparentes, recibe su primer juego de bandejas personalizadas con instrucciones de uso.",
            "imageKey": "ortho-placement"
        },
        {
            "stepTitle": "Ajustes Regulares",
            "stepBody": "Visita al ortodoncista cada 4 a 8 semanas para ajustes de alambre (brackets) o para recibir nuevas bandejas de alineadores. Cada ajuste mueve gradualmente los dientes más cerca de su posición ideal.",
            "imageKey": "ortho-adjustments"
        },
        {
            "stepTitle": "Monitoreo del Progreso",
            "stepBody": "Radiografías y evaluaciones periódicas rastrean el movimiento dental. Su plan de tratamiento puede refinarse en el camino para asegurar el mejor resultado posible.",
            "imageKey": "ortho-monitoring"
        },
        {
            "stepTitle": "Remoción de Aparatos y Retención",
            "stepBody": "Una vez que los dientes están en sus posiciones finales, se retiran los brackets o termina su último alineador. Se proporciona un retenedor (fijo o removible) para mantener su nueva sonrisa.",
            "imageKey": "ortho-retention"
        }
    ]'::JSONB,
    'No anesthesia is needed for most orthodontic procedures. Bracket placement and adjustments involve mild pressure but are not painful. Some soreness is normal for a few days after adjustments.',
    'No se necesita anestesia para la mayoría de los procedimientos de ortodoncia. La colocación de brackets y los ajustes implican una presión leve pero no son dolorosos. Es normal sentir algo de dolor durante unos días después de los ajustes.',
    NULL,
    NULL,
    '### Aftercare Instructions

**Daily Care with Braces:**
- Brush after every meal using a soft-bristle brush
- Use floss threaders or a water flosser to clean between brackets
- Avoid hard, sticky, or chewy foods (popcorn, caramel, nuts, ice)
- Wear rubber bands or elastics as directed

**Daily Care with Aligners:**
- Wear aligners 20-22 hours per day
- Remove aligners when eating or drinking anything besides water
- Clean aligners daily with lukewarm water and a soft brush
- Store aligners in their case when not in use

**After Treatment:**
- Wear your retainer as directed (usually every night initially)
- Continue regular dental checkups and cleanings
- Retainer use is key to preventing teeth from shifting back',
    '### Instrucciones de Cuidado

**Cuidado Diario con Brackets:**
- Cepille después de cada comida usando un cepillo de cerdas suaves
- Use enhebrador de hilo dental o irrigador dental para limpiar entre los brackets
- Evite alimentos duros, pegajosos o masticables (palomitas, caramelo, nueces, hielo)
- Use ligas o elásticos según las indicaciones

**Cuidado Diario con Alineadores:**
- Use los alineadores de 20 a 22 horas al día
- Retire los alineadores al comer o beber cualquier cosa que no sea agua
- Limpie los alineadores diariamente con agua tibia y un cepillo suave
- Guarde los alineadores en su estuche cuando no estén en uso

**Después del Tratamiento:**
- Use su retenedor según las indicaciones (generalmente todas las noches inicialmente)
- Continúe con chequeos y limpiezas dentales regulares
- El uso del retenedor es clave para evitar que los dientes se desplacen de nuevo',
    '[
        {
            "q": "How long does orthodontic treatment take?",
            "a": "Treatment typically takes 12-24 months, depending on the complexity of your case. Some minor cases can be completed in as few as 6 months."
        },
        {
            "q": "Are clear aligners as effective as braces?",
            "a": "Clear aligners are effective for many cases, including mild to moderate crowding and spacing. Complex cases involving significant bite correction may require traditional braces."
        },
        {
            "q": "Will braces or aligners hurt?",
            "a": "You may experience some soreness for a few days after placement or adjustments, but it is manageable with over-the-counter pain relievers. The discomfort lessens with each adjustment."
        },
        {
            "q": "How often will I need to visit the orthodontist?",
            "a": "Typically every 4-8 weeks for adjustments or to receive new aligners. Your orthodontist will set a schedule based on your treatment plan."
        }
    ]'::JSONB,
    '[
        {
            "q": "¿Cuánto tiempo toma el tratamiento de ortodoncia?",
            "a": "El tratamiento generalmente toma de 12 a 24 meses, dependiendo de la complejidad de su caso. Algunos casos menores pueden completarse en tan solo 6 meses."
        },
        {
            "q": "¿Los alineadores transparentes son tan efectivos como los brackets?",
            "a": "Los alineadores transparentes son efectivos para muchos casos, incluyendo apiñamiento y espaciado leve a moderado. Los casos complejos que involucran corrección significativa de mordida pueden requerir brackets tradicionales."
        },
        {
            "q": "¿Los brackets o alineadores dolerán?",
            "a": "Puede experimentar algo de dolor durante unos días después de la colocación o ajustes, pero es manejable con analgésicos de venta libre. La molestia disminuye con cada ajuste."
        },
        {
            "q": "¿Con qué frecuencia necesitaré visitar al ortodoncista?",
            "a": "Generalmente cada 4 a 8 semanas para ajustes o para recibir nuevos alineadores. Su ortodoncista establecerá un horario basado en su plan de tratamiento."
        }
    ]'::JSONB,
    '12-24 months total treatment',
    'Visits every 4-8 weeks',
    '{"heroKey": "ortho-hero", "stepKeys": ["ortho-consult", "ortho-placement", "ortho-adjustments", "ortho-monitoring", "ortho-retention"]}'::JSONB,
    'orthodontics',
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

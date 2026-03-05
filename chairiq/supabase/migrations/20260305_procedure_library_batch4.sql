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
    'pulpotomy',
    'Pulpotomy',
    'Pulpotomía',
    'A pulpotomy is a procedure to remove the infected or inflamed portion of the tooth''s pulp (nerve tissue) in the crown area while preserving the healthy pulp in the roots. It is most commonly performed on primary (baby) teeth in children but can also be done on permanent teeth as a temporary measure.',
    'Una pulpotomía es un procedimiento para eliminar la porción infectada o inflamada de la pulpa (tejido nervioso) del diente en el área de la corona, preservando la pulpa sana en las raíces. Se realiza más comúnmente en dientes primarios (de leche) en niños, pero también puede hacerse en dientes permanentes como medida temporal.',
    '### Why a Pulpotomy Is Needed

A pulpotomy saves a tooth when decay has reached the pulp but the root pulp is still healthy. This is especially important for baby teeth, which hold space for permanent teeth and guide proper jaw development.

**Common Reasons:**
- Deep cavity that has reached the nerve chamber
- Trauma to a tooth causing pulp inflammation
- Preserving a baby tooth until it naturally falls out
- Avoiding full extraction in young children',
    '### Por Qué Se Necesita una Pulpotomía

Una pulpotomía salva un diente cuando la caries ha llegado a la pulpa pero la pulpa de la raíz aún está sana. Esto es especialmente importante para los dientes de leche, que mantienen el espacio para los dientes permanentes y guían el desarrollo adecuado de la mandíbula.

**Razones Comunes:**
- Caries profunda que ha llegado a la cámara del nervio
- Trauma en un diente que causa inflamación de la pulpa
- Preservar un diente de leche hasta que se caiga naturalmente
- Evitar una extracción completa en niños pequeños',
    'Without a pulpotomy, the infection in the pulp can spread to the root and surrounding bone, potentially causing an abscess. In children, premature loss of a baby tooth can lead to spacing problems, crooked permanent teeth, and the need for orthodontic treatment later.',
    'Sin una pulpotomía, la infección en la pulpa puede extenderse a la raíz y al hueso circundante, causando potencialmente un absceso. En niños, la pérdida prematura de un diente de leche puede provocar problemas de espacio, dientes permanentes torcidos y la necesidad de tratamiento ortodóntico posterior.',
    '[
        {
            "stepTitle": "Numbing the Area",
            "stepBody": "Local anesthesia is administered to completely numb the tooth and surrounding area. For children, a topical numbing gel is often applied first to make the injection more comfortable.",
            "imageKey": "pulpotomy-numbing"
        },
        {
            "stepTitle": "Accessing the Pulp Chamber",
            "stepBody": "The dentist removes the decayed portion of the tooth and opens the pulp chamber to access the infected nerve tissue in the crown of the tooth.",
            "imageKey": "pulpotomy-access"
        },
        {
            "stepTitle": "Removing Infected Pulp",
            "stepBody": "The diseased pulp tissue in the crown portion is carefully removed while the healthy root pulp is left intact. The area is cleaned and any bleeding is controlled.",
            "imageKey": "pulpotomy-removal"
        },
        {
            "stepTitle": "Medication & Seal",
            "stepBody": "A medicated material (such as MTA or formocresol) is placed over the remaining healthy pulp to promote healing and prevent further infection. The tooth is then sealed with a filling or stainless steel crown for protection.",
            "imageKey": "pulpotomy-seal"
        }
    ]'::JSONB,
    '[
        {
            "stepTitle": "Adormecimiento del Área",
            "stepBody": "Se administra anestesia local para adormecer completamente el diente y el área circundante. Para los niños, a menudo se aplica primero un gel anestésico tópico para que la inyección sea más cómoda.",
            "imageKey": "pulpotomy-numbing"
        },
        {
            "stepTitle": "Acceso a la Cámara Pulpar",
            "stepBody": "El dentista retira la porción cariada del diente y abre la cámara pulpar para acceder al tejido nervioso infectado en la corona del diente.",
            "imageKey": "pulpotomy-access"
        },
        {
            "stepTitle": "Eliminación de la Pulpa Infectada",
            "stepBody": "El tejido pulpar enfermo en la porción de la corona se retira cuidadosamente mientras la pulpa sana de la raíz se deja intacta. Se limpia el área y se controla cualquier sangrado.",
            "imageKey": "pulpotomy-removal"
        },
        {
            "stepTitle": "Medicamento y Sellado",
            "stepBody": "Se coloca un material medicado (como MTA o formocresol) sobre la pulpa sana restante para promover la cicatrización y prevenir más infecciones. Luego se sella el diente con un empaste o una corona de acero inoxidable para protección.",
            "imageKey": "pulpotomy-seal"
        }
    ]'::JSONB,
    'Local anesthesia is used to numb the tooth and surrounding tissues. For pediatric patients, nitrous oxide (laughing gas) may also be offered to help with relaxation and comfort during the procedure.',
    'Se usa anestesia local para adormecer el diente y los tejidos circundantes. Para pacientes pediátricos, también se puede ofrecer óxido nitroso (gas de la risa) para ayudar con la relajación y comodidad durante el procedimiento.',
    NULL,
    NULL,
    '### Aftercare Instructions

**First 24 Hours:**
- Avoid eating on the treated side until numbness wears off
- Stick to soft foods for the rest of the day
- Some mild discomfort is normal and can be managed with over-the-counter pain relievers

**Following Days:**
- Brush gently around the treated tooth
- Avoid sticky or very hard foods on the treated side
- Monitor for any swelling, persistent pain, or fever

**Long-Term:**
- Keep regular dental checkups to monitor the treated tooth
- Maintain good oral hygiene with brushing and flossing
- The baby tooth will eventually fall out naturally and be replaced by a permanent tooth',
    '### Instrucciones de Cuidado Posterior

**Primeras 24 Horas:**
- Evite comer del lado tratado hasta que pase el adormecimiento
- Consuma alimentos blandos durante el resto del día
- Es normal sentir una leve molestia que puede manejarse con analgésicos de venta libre

**Días Siguientes:**
- Cepille suavemente alrededor del diente tratado
- Evite alimentos pegajosos o muy duros del lado tratado
- Vigile si hay hinchazón, dolor persistente o fiebre

**A Largo Plazo:**
- Mantenga chequeos dentales regulares para monitorear el diente tratado
- Mantenga una buena higiene oral con cepillado e hilo dental
- El diente de leche eventualmente se caerá naturalmente y será reemplazado por un diente permanente',
    '[
        {
            "q": "Is a pulpotomy the same as a root canal?",
            "a": "No. A pulpotomy only removes the pulp from the crown portion of the tooth, while a root canal removes all the pulp from both the crown and roots. Pulpotomies are less invasive and are most common in baby teeth."
        },
        {
            "q": "Will my child feel pain during the procedure?",
            "a": "No. The area is fully numbed with local anesthesia before the procedure begins. Your child may feel pressure but should not experience pain. Nitrous oxide may also be used for comfort."
        },
        {
            "q": "How long does a pulpotomy take?",
            "a": "The procedure typically takes 30-45 minutes, including the time for anesthesia to take effect and placing the final restoration."
        },
        {
            "q": "Why not just pull the baby tooth?",
            "a": "Baby teeth serve as space holders for permanent teeth. Removing them too early can cause spacing issues, crooked teeth, and bite problems that may require orthodontic correction later."
        }
    ]'::JSONB,
    '[
        {
            "q": "¿Una pulpotomía es lo mismo que un tratamiento de conducto?",
            "a": "No. Una pulpotomía solo retira la pulpa de la porción de la corona del diente, mientras que un tratamiento de conducto retira toda la pulpa tanto de la corona como de las raíces. Las pulpotomías son menos invasivas y son más comunes en dientes de leche."
        },
        {
            "q": "¿Mi hijo sentirá dolor durante el procedimiento?",
            "a": "No. El área se adormece completamente con anestesia local antes de que comience el procedimiento. Su hijo puede sentir presión pero no debería experimentar dolor. También se puede usar óxido nitroso para mayor comodidad."
        },
        {
            "q": "¿Cuánto tiempo toma una pulpotomía?",
            "a": "El procedimiento generalmente toma de 30 a 45 minutos, incluyendo el tiempo para que la anestesia haga efecto y la colocación de la restauración final."
        },
        {
            "q": "¿Por qué no simplemente sacar el diente de leche?",
            "a": "Los dientes de leche sirven como mantenedores de espacio para los dientes permanentes. Retirarlos demasiado pronto puede causar problemas de espacio, dientes torcidos y problemas de mordida que pueden requerir corrección ortodóntica más adelante."
        }
    ]'::JSONB,
    '30-45 minutes',
    '1-2 visits',
    '{"heroKey": "pulpotomy-hero", "stepKeys": ["pulpotomy-numbing", "pulpotomy-access", "pulpotomy-removal", "pulpotomy-seal"]}'::JSONB,
    'endodontic',
    true
),
(
    'apicoectomy',
    'Apicoectomy (Root End Surgery)',
    'Apicectomía (Cirugía del Extremo de la Raíz)',
    'An apicoectomy is a surgical procedure to remove the tip (apex) of a tooth''s root and the surrounding infected tissue. A small filling is then placed to seal the end of the root canal. It is typically performed when a conventional root canal treatment has not resolved an infection.',
    'Una apicectomía es un procedimiento quirúrgico para eliminar la punta (ápice) de la raíz de un diente y el tejido infectado circundante. Luego se coloca un pequeño empaste para sellar el extremo del conducto radicular. Se realiza generalmente cuando un tratamiento de conducto convencional no ha resuelto una infección.',
    '### Why an Apicoectomy Is Needed

An apicoectomy is considered when a root canal treatment has failed or cannot be redone, and persistent infection remains at the root tip. It allows the dentist to directly access and treat the problem area surgically.

**Common Reasons:**
- Persistent infection or cyst at the root tip after root canal treatment
- A root canal that cannot be retreated due to a post or crown
- Blocked or calcified root canals preventing conventional retreatment
- A fractured root tip that needs to be removed
- Diagnostic biopsy of suspicious tissue around the root',
    '### Por Qué Se Necesita una Apicectomía

Una apicectomía se considera cuando un tratamiento de conducto ha fallado o no puede repetirse, y persiste una infección en la punta de la raíz. Permite al dentista acceder directamente y tratar el área problemática quirúrgicamente.

**Razones Comunes:**
- Infección persistente o quiste en la punta de la raíz después del tratamiento de conducto
- Un conducto radicular que no puede ser retratado debido a un poste o corona
- Conductos radiculares bloqueados o calcificados que impiden el retratamiento convencional
- Una punta de raíz fracturada que necesita ser removida
- Biopsia diagnóstica de tejido sospechoso alrededor de la raíz',
    'Without an apicoectomy, the persistent infection at the root tip can spread to the surrounding bone and tissues, forming a larger cyst or abscess. This may eventually lead to tooth loss. The infection can also affect adjacent teeth and, in rare cases, spread to other parts of the body.',
    'Sin una apicectomía, la infección persistente en la punta de la raíz puede extenderse al hueso y tejidos circundantes, formando un quiste o absceso más grande. Esto puede eventualmente llevar a la pérdida del diente. La infección también puede afectar los dientes adyacentes y, en casos raros, extenderse a otras partes del cuerpo.',
    '[
        {
            "stepTitle": "Anesthesia & Preparation",
            "stepBody": "Local anesthesia is administered to thoroughly numb the area around the affected tooth. The surgical site is prepared and an anti-inflammatory medication may be given to minimize post-operative swelling.",
            "imageKey": "apicoectomy-anesthesia"
        },
        {
            "stepTitle": "Incision & Access",
            "stepBody": "A small incision is made in the gum tissue near the root tip to expose the underlying bone. A small window is created in the bone to access the infected root tip area.",
            "imageKey": "apicoectomy-incision"
        },
        {
            "stepTitle": "Root Tip Removal",
            "stepBody": "The last few millimeters of the root tip are carefully removed along with any infected or cystic tissue. The area is thoroughly cleaned and inspected under magnification.",
            "imageKey": "apicoectomy-removal"
        },
        {
            "stepTitle": "Retrograde Filling",
            "stepBody": "A biocompatible filling material (typically MTA or bioceramic cement) is placed into the end of the root canal to create a tight seal and prevent bacteria from re-entering the canal system.",
            "imageKey": "apicoectomy-filling"
        },
        {
            "stepTitle": "Suturing & Closure",
            "stepBody": "The gum tissue is carefully repositioned and sutured closed. The bone around the root tip will regenerate naturally over the following months as healing progresses.",
            "imageKey": "apicoectomy-suturing"
        }
    ]'::JSONB,
    '[
        {
            "stepTitle": "Anestesia y Preparación",
            "stepBody": "Se administra anestesia local para adormecer completamente el área alrededor del diente afectado. Se prepara el sitio quirúrgico y se puede administrar un medicamento antiinflamatorio para minimizar la hinchazón postoperatoria.",
            "imageKey": "apicoectomy-anesthesia"
        },
        {
            "stepTitle": "Incisión y Acceso",
            "stepBody": "Se realiza una pequeña incisión en el tejido de la encía cerca de la punta de la raíz para exponer el hueso subyacente. Se crea una pequeña ventana en el hueso para acceder al área de la punta de la raíz infectada.",
            "imageKey": "apicoectomy-incision"
        },
        {
            "stepTitle": "Eliminación de la Punta de la Raíz",
            "stepBody": "Se retiran cuidadosamente los últimos milímetros de la punta de la raíz junto con cualquier tejido infectado o quístico. El área se limpia a fondo y se inspecciona bajo magnificación.",
            "imageKey": "apicoectomy-removal"
        },
        {
            "stepTitle": "Obturación Retrógrada",
            "stepBody": "Se coloca un material de obturación biocompatible (generalmente MTA o cemento biocerámico) en el extremo del conducto radicular para crear un sellado hermético y evitar que las bacterias reingresen al sistema de conductos.",
            "imageKey": "apicoectomy-filling"
        },
        {
            "stepTitle": "Sutura y Cierre",
            "stepBody": "El tejido de la encía se reposiciona cuidadosamente y se sutura. El hueso alrededor de la punta de la raíz se regenerará naturalmente durante los meses siguientes a medida que avanza la cicatrización.",
            "imageKey": "apicoectomy-suturing"
        }
    ]'::JSONB,
    'Local anesthesia is used to completely numb the surgical area. Sedation options may be available for patients who experience anxiety. You will feel pressure during the procedure but should not feel pain.',
    'Se usa anestesia local para adormecer completamente el área quirúrgica. Opciones de sedación pueden estar disponibles para pacientes que experimentan ansiedad. Sentirá presión durante el procedimiento pero no debería sentir dolor.',
    '**Possible risks include:**
- Post-operative swelling and bruising
- Temporary numbness or tingling if nerves are near the surgical site
- Infection at the surgical site (rare with proper care)
- Root fracture (very rare)
- Procedure may not resolve the infection, requiring extraction',
    '**Los posibles riesgos incluyen:**
- Hinchazón y moretones postoperatorios
- Entumecimiento u hormigueo temporal si los nervios están cerca del sitio quirúrgico
- Infección en el sitio quirúrgico (rara con el cuidado adecuado)
- Fractura de la raíz (muy rara)
- El procedimiento puede no resolver la infección, requiriendo extracción',
    '### Aftercare Instructions

**First 48 Hours:**
- Apply ice packs to the outside of your face (20 min on, 20 min off) to reduce swelling
- Take prescribed pain medication and antibiotics as directed
- Eat soft, cool foods and avoid chewing on the treated side
- Avoid rinsing, spitting, or using a straw forcefully

**First Two Weeks:**
- Rinse gently with warm salt water starting 24 hours after surgery
- Avoid smoking, alcohol, and vigorous physical activity
- Do not brush directly over the suture site; brush other teeth normally
- Sutures are typically removed at a follow-up visit in 7-10 days

**Long-Term:**
- Full bone healing around the root tip takes 3-6 months
- Follow up with your dentist as scheduled for X-rays to confirm healing
- Maintain excellent oral hygiene
- The treated tooth should function normally for many years',
    '### Instrucciones de Cuidado Posterior

**Primeras 48 Horas:**
- Aplique compresas de hielo en el exterior de su cara (20 min sí, 20 min no) para reducir la hinchazón
- Tome los medicamentos para el dolor y antibióticos recetados según las indicaciones
- Coma alimentos blandos y frescos y evite masticar del lado tratado
- Evite enjuagar, escupir o usar un popote con fuerza

**Primeras Dos Semanas:**
- Enjuague suavemente con agua tibia con sal comenzando 24 horas después de la cirugía
- Evite fumar, el alcohol y la actividad física vigorosa
- No cepille directamente sobre el sitio de la sutura; cepille los demás dientes normalmente
- Las suturas generalmente se retiran en una visita de seguimiento en 7-10 días

**A Largo Plazo:**
- La cicatrización completa del hueso alrededor de la punta de la raíz toma de 3 a 6 meses
- Siga con su dentista según lo programado para radiografías que confirmen la cicatrización
- Mantenga una excelente higiene oral
- El diente tratado debería funcionar normalmente por muchos años',
    '[
        {
            "q": "How successful is an apicoectomy?",
            "a": "Apicoectomies have a success rate of approximately 85-95% when performed by an experienced endodontist. Most treated teeth can be preserved for many years or even a lifetime."
        },
        {
            "q": "Is an apicoectomy painful?",
            "a": "The procedure is performed under local anesthesia, so you should not feel pain during surgery. Post-operative discomfort is typically mild to moderate and manageable with prescribed pain medication."
        },
        {
            "q": "How long does the procedure take?",
            "a": "An apicoectomy typically takes 30-90 minutes, depending on the tooth location and complexity. Front teeth are generally quicker than molars."
        },
        {
            "q": "Why not just extract the tooth instead?",
            "a": "An apicoectomy aims to save your natural tooth, which is almost always preferable to extraction. Natural teeth provide better chewing function and maintain bone structure. Extraction would require a bridge or implant to replace the tooth."
        }
    ]'::JSONB,
    '[
        {
            "q": "¿Qué tan exitosa es una apicectomía?",
            "a": "Las apicectomías tienen una tasa de éxito de aproximadamente 85-95% cuando son realizadas por un endodoncista experimentado. La mayoría de los dientes tratados pueden preservarse por muchos años o incluso toda la vida."
        },
        {
            "q": "¿La apicectomía es dolorosa?",
            "a": "El procedimiento se realiza bajo anestesia local, por lo que no debería sentir dolor durante la cirugía. La molestia postoperatoria es generalmente leve a moderada y manejable con medicamentos para el dolor recetados."
        },
        {
            "q": "¿Cuánto tiempo toma el procedimiento?",
            "a": "Una apicectomía generalmente toma de 30 a 90 minutos, dependiendo de la ubicación del diente y la complejidad. Los dientes frontales son generalmente más rápidos que los molares."
        },
        {
            "q": "¿Por qué no simplemente extraer el diente?",
            "a": "Una apicectomía busca salvar su diente natural, lo cual es casi siempre preferible a la extracción. Los dientes naturales proporcionan mejor función masticatoria y mantienen la estructura ósea. La extracción requeriría un puente o implante para reemplazar el diente."
        }
    ]'::JSONB,
    '30-90 minutes',
    '2 visits (surgery + suture removal)',
    '{"heroKey": "apicoectomy-hero", "stepKeys": ["apicoectomy-anesthesia", "apicoectomy-incision", "apicoectomy-removal", "apicoectomy-filling", "apicoectomy-suturing"]}'::JSONB,
    'endodontic',
    true
),
(
    'frenectomy',
    'Frenectomy',
    'Frenectomía',
    'A frenectomy is a simple surgical procedure to remove or modify a frenum — a small fold of tissue that connects the lips, cheeks, or tongue to the gum or floor of the mouth. When a frenum is too tight or thick, it can restrict movement and cause dental or speech problems.',
    'Una frenectomía es un procedimiento quirúrgico simple para eliminar o modificar un frenillo — un pequeño pliegue de tejido que conecta los labios, mejillas o lengua con la encía o el piso de la boca. Cuando un frenillo es demasiado tenso o grueso, puede restringir el movimiento y causar problemas dentales o del habla.',
    '### Why a Frenectomy Is Needed

A frenectomy corrects problems caused by an overly tight or thick frenum. This common procedure can significantly improve oral function, comfort, and dental health.

**Common Reasons:**
- Tongue-tie (ankyloglossia) restricting tongue movement in infants or children
- Lip-tie causing difficulty with breastfeeding in newborns
- A frenum pulling on the gums and contributing to gum recession
- Gap between the front teeth caused by a thick labial frenum
- Denture fit problems caused by frenum interference
- Speech difficulties related to restricted tongue movement',
    '### Por Qué Se Necesita una Frenectomía

Una frenectomía corrige problemas causados por un frenillo demasiado tenso o grueso. Este procedimiento común puede mejorar significativamente la función oral, la comodidad y la salud dental.

**Razones Comunes:**
- Anquiloglosia (lengua atada) que restringe el movimiento de la lengua en bebés o niños
- Frenillo labial que causa dificultad con la lactancia en recién nacidos
- Un frenillo que jala las encías y contribuye a la recesión gingival
- Espacio entre los dientes frontales causado por un frenillo labial grueso
- Problemas de ajuste de dentaduras causados por interferencia del frenillo
- Dificultades del habla relacionadas con el movimiento restringido de la lengua',
    NULL,
    NULL,
    '[
        {
            "stepTitle": "Anesthesia",
            "stepBody": "A topical numbing gel is applied first, followed by a small amount of local anesthesia to completely numb the area around the frenum. For infants, topical anesthesia alone may be sufficient.",
            "imageKey": "frenectomy-anesthesia"
        },
        {
            "stepTitle": "Frenum Release",
            "stepBody": "The frenum is released using a scalpel, surgical scissors, or dental laser. Laser frenectomies are increasingly popular as they cause less bleeding and often require no sutures.",
            "imageKey": "frenectomy-release"
        },
        {
            "stepTitle": "Tissue Adjustment",
            "stepBody": "The tissue is carefully reshaped to allow full range of motion for the tongue or lip. Any excess tissue is removed and the wound edges are smoothed.",
            "imageKey": "frenectomy-adjustment"
        },
        {
            "stepTitle": "Closure",
            "stepBody": "If needed, a few small dissolvable sutures are placed to close the wound. With laser procedures, sutures are often unnecessary. The area heals quickly due to the excellent blood supply in the mouth.",
            "imageKey": "frenectomy-closure"
        }
    ]'::JSONB,
    '[
        {
            "stepTitle": "Anestesia",
            "stepBody": "Primero se aplica un gel anestésico tópico, seguido de una pequeña cantidad de anestesia local para adormecer completamente el área alrededor del frenillo. Para bebés, la anestesia tópica sola puede ser suficiente.",
            "imageKey": "frenectomy-anesthesia"
        },
        {
            "stepTitle": "Liberación del Frenillo",
            "stepBody": "El frenillo se libera usando un bisturí, tijeras quirúrgicas o láser dental. Las frenectomías con láser son cada vez más populares ya que causan menos sangrado y a menudo no requieren suturas.",
            "imageKey": "frenectomy-release"
        },
        {
            "stepTitle": "Ajuste del Tejido",
            "stepBody": "El tejido se remodela cuidadosamente para permitir un rango completo de movimiento para la lengua o el labio. Se retira cualquier exceso de tejido y se alisan los bordes de la herida.",
            "imageKey": "frenectomy-adjustment"
        },
        {
            "stepTitle": "Cierre",
            "stepBody": "Si es necesario, se colocan algunas pequeñas suturas absorbibles para cerrar la herida. Con procedimientos láser, las suturas a menudo no son necesarias. El área cicatriza rápidamente debido al excelente suministro sanguíneo en la boca.",
            "imageKey": "frenectomy-closure"
        }
    ]'::JSONB,
    'Topical numbing gel and local anesthesia are used for children and adults. For very young infants, topical anesthesia alone is often sufficient as the frenum has limited nerve supply. The procedure is quick and well-tolerated.',
    'Se usan gel anestésico tópico y anestesia local para niños y adultos. Para bebés muy pequeños, la anestesia tópica sola suele ser suficiente ya que el frenillo tiene un suministro nervioso limitado. El procedimiento es rápido y bien tolerado.',
    NULL,
    NULL,
    '### Aftercare Instructions

**First 24 Hours:**
- Apply gentle pressure with clean gauze if any bleeding occurs
- For infants: breastfeed or bottle-feed as soon as possible after the procedure
- Use over-the-counter pain relief as recommended by your dentist
- Eat soft foods and avoid hot, spicy, or acidic foods

**First Week:**
- Perform stretching exercises as directed by your dentist or speech therapist (especially important for tongue-tie releases)
- Keep the area clean by rinsing with warm salt water after meals
- Avoid touching the surgical site with fingers

**Long-Term:**
- Full healing typically occurs within 1-2 weeks
- Speech therapy may be recommended following tongue-tie release in older children
- Follow up with your dentist to ensure proper healing and improved function',
    '### Instrucciones de Cuidado Posterior

**Primeras 24 Horas:**
- Aplique presión suave con gasa limpia si ocurre algún sangrado
- Para bebés: amamante o dé biberón lo antes posible después del procedimiento
- Use analgésicos de venta libre según lo recomendado por su dentista
- Coma alimentos blandos y evite alimentos calientes, picantes o ácidos

**Primera Semana:**
- Realice ejercicios de estiramiento según las indicaciones de su dentista o terapeuta del habla (especialmente importante para liberaciones de lengua atada)
- Mantenga el área limpia enjuagando con agua tibia con sal después de las comidas
- Evite tocar el sitio quirúrgico con los dedos

**A Largo Plazo:**
- La cicatrización completa generalmente ocurre dentro de 1-2 semanas
- Se puede recomendar terapia del habla después de la liberación de lengua atada en niños mayores
- Haga seguimiento con su dentista para asegurar una cicatrización adecuada y mejor función',
    '[
        {
            "q": "How long does a frenectomy take?",
            "a": "A frenectomy is a quick procedure, usually taking only 15-30 minutes from start to finish. Laser frenectomies may be even faster."
        },
        {
            "q": "At what age should a frenectomy be done?",
            "a": "It depends on the reason. For breastfeeding difficulties due to tongue-tie, it can be done within days of birth. For speech or dental issues, it is commonly performed in childhood but can be done at any age."
        },
        {
            "q": "Will my child need speech therapy after a frenectomy?",
            "a": "If the frenectomy is performed for speech issues, speech therapy is often recommended to help retrain the tongue muscles and develop proper speech patterns. For infants, stretching exercises are usually sufficient."
        },
        {
            "q": "Is the recovery painful?",
            "a": "Most patients experience only mild discomfort after a frenectomy. Over-the-counter pain relievers are usually sufficient. Infants often feed immediately after with minimal fussiness."
        }
    ]'::JSONB,
    '[
        {
            "q": "¿Cuánto tiempo toma una frenectomía?",
            "a": "Una frenectomía es un procedimiento rápido, que generalmente toma solo 15-30 minutos de principio a fin. Las frenectomías con láser pueden ser aún más rápidas."
        },
        {
            "q": "¿A qué edad se debe hacer una frenectomía?",
            "a": "Depende de la razón. Para dificultades de lactancia debido a lengua atada, puede hacerse dentro de los primeros días de nacimiento. Para problemas del habla o dentales, se realiza comúnmente en la infancia pero puede hacerse a cualquier edad."
        },
        {
            "q": "¿Mi hijo necesitará terapia del habla después de una frenectomía?",
            "a": "Si la frenectomía se realiza por problemas del habla, a menudo se recomienda terapia del habla para ayudar a reentrenar los músculos de la lengua y desarrollar patrones de habla adecuados. Para bebés, los ejercicios de estiramiento suelen ser suficientes."
        },
        {
            "q": "¿La recuperación es dolorosa?",
            "a": "La mayoría de los pacientes experimentan solo una molestia leve después de una frenectomía. Los analgésicos de venta libre suelen ser suficientes. Los bebés a menudo se alimentan inmediatamente después con mínima irritabilidad."
        }
    ]'::JSONB,
    '15-30 minutes',
    '1-2 visits',
    '{"heroKey": "frenectomy-hero", "stepKeys": ["frenectomy-anesthesia", "frenectomy-release", "frenectomy-adjustment", "frenectomy-closure"]}'::JSONB,
    'oral-surgery',
    true
),
(
    'crown-lengthening',
    'Crown Lengthening',
    'Alargamiento de Corona',
    'Crown lengthening is a surgical procedure that reshapes the gum tissue and sometimes the bone around a tooth to expose more of the tooth''s structure. It is performed for both restorative and cosmetic purposes, allowing for proper placement of a crown or improving a "gummy smile."',
    'El alargamiento de corona es un procedimiento quirúrgico que remodela el tejido de la encía y a veces el hueso alrededor de un diente para exponer más estructura del diente. Se realiza tanto con fines restaurativos como cosméticos, permitiendo la colocación adecuada de una corona o mejorando una "sonrisa gingival."',
    '### Why Crown Lengthening Is Needed

Crown lengthening creates space between the supporting bone and the dental crown, ensuring a proper fit for a restoration. It is also used cosmetically to create a more balanced, attractive smile.

**Common Reasons:**
- A tooth is broken or decayed below the gum line and needs a crown
- Not enough tooth structure is exposed above the gum for a crown to attach
- Correcting a "gummy smile" where excess gum tissue covers the teeth
- Evening out an uneven gum line for cosmetic improvement
- Accessing a cavity that extends below the gum line',
    '### Por Qué Se Necesita el Alargamiento de Corona

El alargamiento de corona crea espacio entre el hueso de soporte y la corona dental, asegurando un ajuste adecuado para una restauración. También se usa cosméticamente para crear una sonrisa más equilibrada y atractiva.

**Razones Comunes:**
- Un diente está roto o cariado debajo de la línea de la encía y necesita una corona
- No hay suficiente estructura dental expuesta sobre la encía para que se adhiera una corona
- Corrección de una "sonrisa gingival" donde el exceso de tejido gingival cubre los dientes
- Nivelar una línea de encía desigual para mejora cosmética
- Acceder a una caries que se extiende debajo de la línea de la encía',
    'Without crown lengthening, there may not be enough tooth structure to properly support a dental crown, leading to a restoration that could fail prematurely. A poorly fitting crown can allow bacteria to enter, causing decay and infection underneath. For cosmetic cases, a gummy smile will persist without treatment.',
    'Sin alargamiento de corona, puede no haber suficiente estructura dental para soportar adecuadamente una corona dental, llevando a una restauración que podría fallar prematuramente. Una corona mal ajustada puede permitir que las bacterias entren, causando caries e infección debajo. En casos cosméticos, la sonrisa gingival persistirá sin tratamiento.',
    '[
        {
            "stepTitle": "Anesthesia",
            "stepBody": "Local anesthesia is administered to completely numb the treatment area. You will be comfortable throughout the procedure and will feel pressure but no pain.",
            "imageKey": "crown-lengthening-anesthesia"
        },
        {
            "stepTitle": "Incision & Tissue Reflection",
            "stepBody": "Small incisions are made in the gum tissue to create a flap, which is gently pulled back to expose the underlying tooth root and bone. This gives the periodontist clear access to the treatment area.",
            "imageKey": "crown-lengthening-incision"
        },
        {
            "stepTitle": "Bone & Tissue Reshaping",
            "stepBody": "Excess gum tissue is removed, and if necessary, a small amount of bone is carefully reshaped around the tooth. This exposes more of the natural tooth structure and creates proper contours for healing.",
            "imageKey": "crown-lengthening-reshaping"
        },
        {
            "stepTitle": "Cleaning & Irrigation",
            "stepBody": "The surgical site is thoroughly cleaned and irrigated with sterile solution to remove any debris and reduce the risk of infection before closing.",
            "imageKey": "crown-lengthening-cleaning"
        },
        {
            "stepTitle": "Suturing",
            "stepBody": "The gum tissue is repositioned at the new level and secured with sutures. A periodontal dressing (bandage) may be placed over the area to protect the surgical site during initial healing.",
            "imageKey": "crown-lengthening-suturing"
        }
    ]'::JSONB,
    '[
        {
            "stepTitle": "Anestesia",
            "stepBody": "Se administra anestesia local para adormecer completamente el área de tratamiento. Estará cómodo durante todo el procedimiento y sentirá presión pero no dolor.",
            "imageKey": "crown-lengthening-anesthesia"
        },
        {
            "stepTitle": "Incisión y Reflexión del Tejido",
            "stepBody": "Se realizan pequeñas incisiones en el tejido de la encía para crear un colgajo, que se retira suavemente para exponer la raíz del diente y el hueso subyacentes. Esto le da al periodoncista acceso claro al área de tratamiento.",
            "imageKey": "crown-lengthening-incision"
        },
        {
            "stepTitle": "Remodelación de Hueso y Tejido",
            "stepBody": "Se retira el exceso de tejido gingival y, si es necesario, se remodela cuidadosamente una pequeña cantidad de hueso alrededor del diente. Esto expone más estructura dental natural y crea contornos adecuados para la cicatrización.",
            "imageKey": "crown-lengthening-reshaping"
        },
        {
            "stepTitle": "Limpieza e Irrigación",
            "stepBody": "El sitio quirúrgico se limpia a fondo y se irriga con solución estéril para eliminar cualquier residuo y reducir el riesgo de infección antes del cierre.",
            "imageKey": "crown-lengthening-cleaning"
        },
        {
            "stepTitle": "Sutura",
            "stepBody": "El tejido de la encía se reposiciona al nuevo nivel y se asegura con suturas. Se puede colocar un apósito periodontal (vendaje) sobre el área para proteger el sitio quirúrgico durante la cicatrización inicial.",
            "imageKey": "crown-lengthening-suturing"
        }
    ]'::JSONB,
    'Local anesthesia is used to numb the area completely. Sedation options may be available if you feel anxious about the procedure. The surgery itself is well-tolerated with minimal discomfort.',
    'Se usa anestesia local para adormecer el área completamente. Opciones de sedación pueden estar disponibles si se siente ansioso por el procedimiento. La cirugía en sí es bien tolerada con mínima molestia.',
    '**Possible risks include:**
- Post-operative swelling and mild bruising
- Temporary tooth sensitivity to hot and cold
- The treated teeth may appear longer than neighboring teeth
- Infection at the surgical site (uncommon with proper care)
- Minor gum tissue recession over time',
    '**Los posibles riesgos incluyen:**
- Hinchazón postoperatoria y moretones leves
- Sensibilidad dental temporal al calor y al frío
- Los dientes tratados pueden parecer más largos que los dientes vecinos
- Infección en el sitio quirúrgico (poco común con el cuidado adecuado)
- Recesión menor del tejido gingival con el tiempo',
    '### Aftercare Instructions

**First 48 Hours:**
- Apply ice packs to the outside of your face to minimize swelling (20 min on, 20 min off)
- Take prescribed pain medication and antibiotics as directed
- Eat soft, cool foods and avoid the surgical area when chewing
- Do not brush or floss the surgical site

**First Two Weeks:**
- Rinse gently with prescribed antimicrobial mouthwash or warm salt water
- Avoid smoking, alcohol, and spicy foods
- Do not pull on your lip to examine the area
- Sutures and periodontal dressing will be removed at your follow-up visit (7-10 days)

**Healing Period:**
- Allow 6-8 weeks for the gum tissue to fully heal before a crown is placed
- Gradually return to normal brushing and flossing as directed
- Sensitivity will decrease as healing progresses
- Attend all follow-up appointments to monitor healing',
    '### Instrucciones de Cuidado Posterior

**Primeras 48 Horas:**
- Aplique compresas de hielo en el exterior de su cara para minimizar la hinchazón (20 min sí, 20 min no)
- Tome los medicamentos para el dolor y antibióticos recetados según las indicaciones
- Coma alimentos blandos y frescos y evite el área quirúrgica al masticar
- No cepille ni use hilo dental en el sitio quirúrgico

**Primeras Dos Semanas:**
- Enjuague suavemente con enjuague bucal antimicrobiano recetado o agua tibia con sal
- Evite fumar, el alcohol y los alimentos picantes
- No jale su labio para examinar el área
- Las suturas y el apósito periodontal se retirarán en su visita de seguimiento (7-10 días)

**Período de Cicatrización:**
- Permita de 6 a 8 semanas para que el tejido de la encía cicatrice completamente antes de colocar una corona
- Regrese gradualmente al cepillado y uso de hilo dental normal según las indicaciones
- La sensibilidad disminuirá a medida que avance la cicatrización
- Asista a todas las citas de seguimiento para monitorear la cicatrización',
    '[
        {
            "q": "How long does crown lengthening take?",
            "a": "The procedure typically takes 45-90 minutes, depending on the number of teeth being treated. A single tooth usually takes about 45-60 minutes."
        },
        {
            "q": "How long before I can get my crown after crown lengthening?",
            "a": "You will need to wait approximately 6-8 weeks for the gums to fully heal and stabilize before your dentist places the permanent crown."
        },
        {
            "q": "Is crown lengthening painful?",
            "a": "The procedure is performed under local anesthesia, so you will not feel pain during surgery. Post-operative discomfort is usually mild and well-managed with over-the-counter or prescribed pain medication."
        },
        {
            "q": "Will my teeth look different after crown lengthening?",
            "a": "The treated teeth will appear slightly longer since more tooth structure is exposed. For cosmetic cases, this is the desired result — creating a more balanced and attractive smile. For restorative cases, the final crown will create a natural appearance."
        }
    ]'::JSONB,
    '[
        {
            "q": "¿Cuánto tiempo toma el alargamiento de corona?",
            "a": "El procedimiento generalmente toma de 45 a 90 minutos, dependiendo del número de dientes que se traten. Un solo diente generalmente toma alrededor de 45-60 minutos."
        },
        {
            "q": "¿Cuánto tiempo antes de que pueda obtener mi corona después del alargamiento de corona?",
            "a": "Necesitará esperar aproximadamente de 6 a 8 semanas para que las encías cicatricen completamente y se estabilicen antes de que su dentista coloque la corona permanente."
        },
        {
            "q": "¿El alargamiento de corona es doloroso?",
            "a": "El procedimiento se realiza bajo anestesia local, por lo que no sentirá dolor durante la cirugía. La molestia postoperatoria suele ser leve y se maneja bien con medicamentos para el dolor de venta libre o recetados."
        },
        {
            "q": "¿Mis dientes se verán diferentes después del alargamiento de corona?",
            "a": "Los dientes tratados parecerán ligeramente más largos ya que se expone más estructura dental. Para casos cosméticos, este es el resultado deseado — crear una sonrisa más equilibrada y atractiva. Para casos restaurativos, la corona final creará una apariencia natural."
        }
    ]'::JSONB,
    '45-90 minutes',
    '2-3 visits (surgery + follow-up + crown placement)',
    '{"heroKey": "crown-lengthening-hero", "stepKeys": ["crown-lengthening-anesthesia", "crown-lengthening-incision", "crown-lengthening-reshaping", "crown-lengthening-cleaning", "crown-lengthening-suturing"]}'::JSONB,
    'periodontic',
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

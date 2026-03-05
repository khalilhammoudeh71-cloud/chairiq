-- Location: supabase/migrations/20260305_procedure_library_batch3.sql
-- Schema Analysis: Inserting procedure_library entries for batch 3
-- Integration Type: Enhancement - Bilingual educational content
-- Dependencies: procedure_library table

-- =====================================================
-- PROCEDURE LIBRARY BATCH 3
-- Inlay/Onlay, Core Buildup, Gum Graft
-- Gold Standard Patient Education Format
-- 6th-8th grade reading level, bilingual EN + ES
-- =====================================================

-- =====================================================
-- INLAY / ONLAY
-- =====================================================
INSERT INTO public.procedure_library (
  slug, title_en, title_es, summary_en, summary_es,
  why_en, why_es, what_if_not_en, what_if_not_es,
  steps_en, steps_es,
  aftercare_en, aftercare_es,
  risks_en, risks_es,
  faqs_en, faqs_es,
  time_estimate, visits_estimate, category, is_published
) VALUES (
  'inlay-onlay',

  'Dental Inlay / Onlay',
  'Incrustación Dental (Inlay / Onlay)',

  E'## What this is\n\nAn inlay or onlay is a custom-made filling used to repair a tooth that has moderate decay or damage. Unlike a regular filling that is placed directly in your mouth, an inlay or onlay is crafted in a dental lab to fit your tooth precisely. An **inlay** fits inside the biting surface of your tooth. An **onlay** covers one or more of the cusps (the raised points) on top of your tooth. Both are bonded to your tooth to restore its shape, strength, and function.\n\n## Why you may need it\n\nYou may need an inlay or onlay if:\n- Your tooth has a cavity too large for a regular filling but not large enough for a full crown\n- An old filling has cracked or worn out and needs to be replaced\n- Part of your tooth has chipped or broken\n- You want a long-lasting, natural-looking restoration',

  E'## Qué es esto\n\nUna incrustación dental (inlay u onlay) es un empaste hecho a medida para reparar un diente con caries o daño moderado. A diferencia de un empaste regular que se coloca directamente en su boca, una incrustación se fabrica en un laboratorio dental para ajustarse a su diente con precisión. Un **inlay** encaja dentro de la superficie de mordida de su diente. Un **onlay** cubre una o más de las cúspides (los puntos elevados) en la parte superior de su diente. Ambos se adhieren a su diente para restaurar su forma, fuerza y función.\n\n## Por qué podría necesitarlo\n\nPodría necesitar una incrustación si:\n- Su diente tiene una caries demasiado grande para un empaste regular pero no lo suficientemente grande para una corona completa\n- Un empaste viejo se ha agrietado o desgastado y necesita ser reemplazado\n- Parte de su diente se ha astillado o roto\n- Desea una restauración duradera y de aspecto natural',

  E'## Why you may need it\n\nAn inlay or onlay is the best choice when your tooth needs more than a filling but less than a full crown.\n\n**Moderate decay**: The cavity is too big for a standard filling to hold up well over time\n\n**Cracked or worn filling**: Old fillings can break down and need a stronger replacement\n\n**Tooth fracture**: A chip or crack that weakens part of the tooth but leaves most of it intact\n\n**Preserve tooth structure**: Inlays and onlays remove less healthy tooth than a full crown, keeping more of your natural tooth',

  E'## Por qué podría necesitarlo\n\nUna incrustación es la mejor opción cuando su diente necesita más que un empaste pero menos que una corona completa.\n\n**Caries moderada**: La cavidad es demasiado grande para que un empaste estándar funcione bien a largo plazo\n\n**Empaste agrietado o desgastado**: Los empastes viejos pueden deteriorarse y necesitar un reemplazo más fuerte\n\n**Fractura dental**: Una astilla o grieta que debilita parte del diente pero deja la mayor parte intacta\n\n**Preservar la estructura dental**: Las incrustaciones eliminan menos diente sano que una corona completa, conservando más de su diente natural',

  E'## If you delay\n\nDelaying an inlay or onlay can lead to bigger problems:\n\n**More decay**: Bacteria continue to damage the tooth, making the cavity larger\n\n**Tooth fracture**: A weakened tooth is more likely to crack or break, which may require a crown or extraction\n\n**Pain and sensitivity**: As decay spreads deeper, you may start to feel pain or sensitivity to hot and cold\n\n**Root canal needed**: If decay reaches the nerve, you will need a root canal before the tooth can be restored\n\n**Higher cost**: A small problem today can become a bigger, more expensive problem later',

  E'## Si lo retrasa\n\nRetrasar una incrustación puede causar problemas mayores:\n\n**Más caries**: Las bacterias continúan dañando el diente, haciendo la cavidad más grande\n\n**Fractura dental**: Un diente debilitado tiene más probabilidades de agrietarse o romperse, lo que puede requerir una corona o extracción\n\n**Dolor y sensibilidad**: A medida que la caries se extiende más profundamente, puede comenzar a sentir dolor o sensibilidad al frío y al calor\n\n**Necesidad de endodoncia**: Si la caries llega al nervio, necesitará un tratamiento de conducto antes de poder restaurar el diente\n\n**Mayor costo**: Un problema pequeño hoy puede convertirse en un problema más grande y costoso después',

  jsonb_build_array(
    jsonb_build_object(
      'title', 'Step 1: Tooth Preparation',
      'description', E'**What we do**: We numb the area and remove the decayed or damaged part of your tooth, shaping it so the inlay or onlay will fit perfectly\n\n**What you may feel**: A small pinch from the numbing shot, then pressure or vibration as we work — no pain\n\n**Why it matters**: Proper shaping ensures a precise, tight fit that seals out bacteria'
    ),
    jsonb_build_object(
      'title', 'Step 2: Impression',
      'description', E'**What we do**: We take a detailed mold (impression) of your prepared tooth and send it to a dental lab where your custom inlay or onlay is made\n\n**What you may feel**: Slight pressure as the impression material sits on your teeth for a minute or two\n\n**Why it matters**: An accurate impression means your restoration will fit your tooth exactly'
    ),
    jsonb_build_object(
      'title', 'Step 3: Temporary Filling',
      'description', E'**What we do**: We place a temporary filling to protect your tooth while the lab makes your permanent inlay or onlay (usually 1-2 weeks)\n\n**What you may feel**: Mild pressure as the temporary is placed\n\n**Why it matters**: The temporary protects your tooth from sensitivity and bacteria while you wait'
    ),
    jsonb_build_object(
      'title', 'Step 4: Bonding',
      'description', E'**What we do**: At your second visit, we remove the temporary filling, check the fit and color of your inlay or onlay, and bond it permanently to your tooth\n\n**What you may feel**: Light pressure during placement and polishing\n\n**Why it matters**: A strong bond seals the restoration to your tooth, restoring its full strength and natural appearance'
    )
  ),

  jsonb_build_array(
    jsonb_build_object(
      'title', 'Paso 1: Preparación del Diente',
      'description', E'**Qué hacemos**: Adormecemos el área y eliminamos la parte cariada o dañada de su diente, dándole forma para que la incrustación encaje perfectamente\n\n**Qué puede sentir**: Un pequeño pinchazo de la inyección de anestesia, luego presión o vibración mientras trabajamos — sin dolor\n\n**Por qué es importante**: Una forma adecuada asegura un ajuste preciso y hermético que sella las bacterias fuera'
    ),
    jsonb_build_object(
      'title', 'Paso 2: Impresión',
      'description', E'**Qué hacemos**: Tomamos un molde detallado (impresión) de su diente preparado y lo enviamos a un laboratorio dental donde se fabrica su incrustación personalizada\n\n**Qué puede sentir**: Ligera presión mientras el material de impresión se asienta sobre sus dientes por un minuto o dos\n\n**Por qué es importante**: Una impresión precisa significa que su restauración se ajustará a su diente exactamente'
    ),
    jsonb_build_object(
      'title', 'Paso 3: Empaste Temporal',
      'description', E'**Qué hacemos**: Colocamos un empaste temporal para proteger su diente mientras el laboratorio fabrica su incrustación permanente (generalmente 1-2 semanas)\n\n**Qué puede sentir**: Presión leve mientras se coloca el temporal\n\n**Por qué es importante**: El temporal protege su diente de la sensibilidad y las bacterias mientras espera'
    ),
    jsonb_build_object(
      'title', 'Paso 4: Cementación',
      'description', E'**Qué hacemos**: En su segunda visita, retiramos el empaste temporal, verificamos el ajuste y color de su incrustación, y la adherimos permanentemente a su diente\n\n**Qué puede sentir**: Presión ligera durante la colocación y pulido\n\n**Por qué es importante**: Una adhesión fuerte sella la restauración a su diente, restaurando su fuerza completa y apariencia natural'
    )
  ),

  E'## What to expect after\n\n### First 24 hours\n- Some sensitivity to hot and cold is normal and usually goes away within a few days\n- Avoid chewing on that side until any numbness has fully worn off\n- Take over-the-counter pain medicine if you feel any soreness\n\n### First week\n- Brush and floss normally, including around the inlay or onlay\n- Avoid very sticky or hard foods on that tooth for a few days\n- Your bite should feel normal — if it feels high or uneven, call us for a quick adjustment\n\n### Long term\n- Care for your inlay or onlay the same way you care for your other teeth: brush twice daily and floss every day\n- Visit us for regular checkups so we can monitor the restoration\n- With good care, an inlay or onlay can last 10 to 30 years\n\n### When to call us\n- The inlay or onlay feels loose or falls out\n- You have sharp pain when biting down\n- Sensitivity that lasts more than 2 weeks\n- You notice a crack or chip in the restoration',

  E'## Qué esperar después\n\n### Primeras 24 horas\n- Algo de sensibilidad al frío y al calor es normal y generalmente desaparece en unos días\n- Evite masticar de ese lado hasta que la anestesia haya desaparecido por completo\n- Tome medicamento para el dolor de venta libre si siente alguna molestia\n\n### Primera semana\n- Cepíllese y use hilo dental normalmente, incluyendo alrededor de la incrustación\n- Evite alimentos muy pegajosos o duros en ese diente por unos días\n- Su mordida debería sentirse normal — si se siente alta o desigual, llámenos para un ajuste rápido\n\n### A largo plazo\n- Cuide su incrustación de la misma manera que cuida sus otros dientes: cepíllese dos veces al día y use hilo dental todos los días\n- Visítenos para revisiones regulares para que podamos monitorear la restauración\n- Con buen cuidado, una incrustación puede durar de 10 a 30 años\n\n### Cuándo llamarnos\n- La incrustación se siente suelta o se cae\n- Tiene dolor agudo al morder\n- Sensibilidad que dura más de 2 semanas\n- Nota una grieta o astilla en la restauración',

  E'## Risks and considerations\n\n**Sensitivity**: Mild sensitivity to temperature changes is common for the first few days after placement\n\n**Fit adjustments**: Occasionally the bite may feel slightly off and need a minor adjustment\n\n**Debonding**: In rare cases, the inlay or onlay may come loose and need to be re-cemented\n\n**Tooth fracture**: If the tooth is already weakened, there is a small chance it could crack during preparation, which may require a crown instead',

  E'## Riesgos y consideraciones\n\n**Sensibilidad**: La sensibilidad leve a los cambios de temperatura es común durante los primeros días después de la colocación\n\n**Ajustes de mordida**: Ocasionalmente la mordida puede sentirse ligeramente desalineada y necesitar un ajuste menor\n\n**Desprendimiento**: En casos raros, la incrustación puede aflojarse y necesitar ser recementada\n\n**Fractura dental**: Si el diente ya está debilitado, existe una pequeña posibilidad de que pueda agrietarse durante la preparación, lo que puede requerir una corona en su lugar',

  jsonb_build_array(
    jsonb_build_object('q', 'What is the difference between an inlay and an onlay?', 'a', 'An inlay fits inside the grooves on the biting surface of your tooth. An onlay is larger and covers one or more of the cusps (the raised points) on top of the tooth. Your dentist will recommend which one you need based on the size and location of the damage.'),
    jsonb_build_object('q', 'How long does an inlay or onlay last?', 'a', 'With good oral care, an inlay or onlay can last 10 to 30 years, which is typically longer than a regular filling.'),
    jsonb_build_object('q', 'Is an inlay or onlay better than a filling?', 'a', 'For moderate-sized cavities, yes. Inlays and onlays are stronger than regular fillings and fit more precisely. They are a better option when the damage is too large for a filling but not large enough for a crown.'),
    jsonb_build_object('q', 'Will it look natural?', 'a', 'Yes. Porcelain and tooth-colored composite inlays and onlays are matched to the shade of your natural teeth, so they blend in seamlessly.'),
    jsonb_build_object('q', 'How many visits does it take?', 'a', 'Usually two visits. The first visit is for preparation and taking an impression. The second visit, about 1-2 weeks later, is to bond the permanent inlay or onlay to your tooth.'),
    jsonb_build_object('q', 'Does getting an inlay or onlay hurt?', 'a', 'No. The area is numbed before we begin, so you should not feel pain during the procedure. Some mild sensitivity after is normal.')
  ),

  jsonb_build_array(
    jsonb_build_object('q', '¿Cuál es la diferencia entre un inlay y un onlay?', 'a', 'Un inlay encaja dentro de los surcos en la superficie de mordida de su diente. Un onlay es más grande y cubre una o más de las cúspides (los puntos elevados) en la parte superior del diente. Su dentista le recomendará cuál necesita según el tamaño y la ubicación del daño.'),
    jsonb_build_object('q', '¿Cuánto dura una incrustación?', 'a', 'Con buen cuidado oral, una incrustación puede durar de 10 a 30 años, lo cual es típicamente más que un empaste regular.'),
    jsonb_build_object('q', '¿Es una incrustación mejor que un empaste?', 'a', 'Para cavidades de tamaño moderado, sí. Las incrustaciones son más fuertes que los empastes regulares y se ajustan con más precisión. Son una mejor opción cuando el daño es demasiado grande para un empaste pero no lo suficientemente grande para una corona.'),
    jsonb_build_object('q', '¿Se verá natural?', 'a', 'Sí. Las incrustaciones de porcelana y composite del color del diente se combinan con el tono de sus dientes naturales, por lo que se integran perfectamente.'),
    jsonb_build_object('q', '¿Cuántas visitas se necesitan?', 'a', 'Generalmente dos visitas. La primera visita es para la preparación y toma de impresión. La segunda visita, aproximadamente 1-2 semanas después, es para adherir la incrustación permanente a su diente.'),
    jsonb_build_object('q', '¿Duele ponerse una incrustación?', 'a', 'No. El área se adormece antes de comenzar, por lo que no debería sentir dolor durante el procedimiento. Algo de sensibilidad leve después es normal.')
  ),

  '2 visits, 45-60 minutes each',
  '2 appointments (preparation + bonding)',
  'restorative',
  true
)
ON CONFLICT (slug) DO UPDATE SET
  title_en = EXCLUDED.title_en, title_es = EXCLUDED.title_es,
  summary_en = EXCLUDED.summary_en, summary_es = EXCLUDED.summary_es,
  why_en = EXCLUDED.why_en, why_es = EXCLUDED.why_es,
  what_if_not_en = EXCLUDED.what_if_not_en, what_if_not_es = EXCLUDED.what_if_not_es,
  steps_en = EXCLUDED.steps_en, steps_es = EXCLUDED.steps_es,
  aftercare_en = EXCLUDED.aftercare_en, aftercare_es = EXCLUDED.aftercare_es,
  risks_en = EXCLUDED.risks_en, risks_es = EXCLUDED.risks_es,
  faqs_en = EXCLUDED.faqs_en, faqs_es = EXCLUDED.faqs_es,
  time_estimate = EXCLUDED.time_estimate, visits_estimate = EXCLUDED.visits_estimate,
  category = EXCLUDED.category, is_published = EXCLUDED.is_published,
  updated_at = CURRENT_TIMESTAMP;


-- =====================================================
-- CORE BUILDUP
-- =====================================================
INSERT INTO public.procedure_library (
  slug, title_en, title_es, summary_en, summary_es,
  why_en, why_es,
  steps_en, steps_es,
  aftercare_en, aftercare_es,
  faqs_en, faqs_es,
  time_estimate, visits_estimate, category, is_published
) VALUES (
  'core-buildup',

  'Core Buildup',
  'Reconstrucción de Núcleo',

  E'## What this is\n\nA core buildup is a procedure to rebuild the inner structure of a tooth that has lost a large amount of its original structure due to decay, fracture, or a previous root canal. The dentist uses a strong filling material to build up the core (center) of the tooth so that it can support a crown. Think of it as creating a solid foundation for the crown to sit on.\n\n## Why you may need it\n\nYou may need a core buildup if:\n- Your tooth has had a root canal and most of the inner structure was removed\n- A large portion of the tooth has broken off or been damaged by decay\n- There is not enough tooth left to hold a crown by itself\n- An old, large filling needs to be replaced and the remaining tooth structure is weak',

  E'## Qué es esto\n\nUna reconstrucción de núcleo es un procedimiento para reconstruir la estructura interna de un diente que ha perdido una gran cantidad de su estructura original debido a caries, fractura o un tratamiento de conducto previo. El dentista utiliza un material de empaste resistente para reconstruir el núcleo (centro) del diente para que pueda soportar una corona. Piense en ello como crear una base sólida para que la corona se asiente.\n\n## Por qué podría necesitarlo\n\nPodría necesitar una reconstrucción de núcleo si:\n- Su diente ha tenido un tratamiento de conducto y la mayor parte de la estructura interna fue removida\n- Una gran porción del diente se ha roto o ha sido dañada por caries\n- No queda suficiente diente para sostener una corona por sí solo\n- Un empaste viejo y grande necesita ser reemplazado y la estructura dental restante es débil',

  E'## Why you may need it\n\nA core buildup restores the foundation of your tooth so it can hold a crown securely.\n\n**After a root canal**: Much of the inside of the tooth is removed during a root canal, leaving the tooth hollow and fragile. A core buildup fills it back up.\n\n**Extensive decay**: If a large cavity has destroyed most of the tooth, there may not be enough structure left for a crown to grip onto.\n\n**Broken tooth**: A tooth that has fractured may need to be built back up to its original shape before a crown can be placed.\n\n**Failed restoration**: When a large old filling falls out, the remaining tooth may be too weak without a buildup.',

  E'## Por qué podría necesitarlo\n\nUna reconstrucción de núcleo restaura la base de su diente para que pueda sostener una corona de forma segura.\n\n**Después de una endodoncia**: Gran parte del interior del diente se elimina durante un tratamiento de conducto, dejando el diente hueco y frágil. Una reconstrucción de núcleo lo rellena.\n\n**Caries extensa**: Si una cavidad grande ha destruido la mayor parte del diente, puede que no quede suficiente estructura para que una corona se agarre.\n\n**Diente roto**: Un diente que se ha fracturado puede necesitar ser reconstruido a su forma original antes de que se pueda colocar una corona.\n\n**Restauración fallida**: Cuando un empaste viejo y grande se cae, el diente restante puede ser demasiado débil sin una reconstrucción.',

  jsonb_build_array(
    jsonb_build_object(
      'title', 'Step 1: Preparation',
      'description', E'**What we do**: We numb the area and remove any remaining decay or old filling material. We clean the tooth and assess how much structure is left.\n\n**What you may feel**: A small pinch from the numbing shot, then no pain — just pressure and vibration\n\n**Why it matters**: A clean, solid foundation ensures the buildup material bonds well and the tooth stays healthy under the crown'
    ),
    jsonb_build_object(
      'title', 'Step 2: Post Placement (if needed)',
      'description', E'**What we do**: If the tooth has had a root canal and very little structure remains, we may place a small post (a thin metal or fiber rod) into one of the root canals for extra support\n\n**What you may feel**: Mild pressure as the post is fitted\n\n**Why it matters**: The post acts like an anchor, giving the buildup material something strong to hold onto inside the tooth'
    ),
    jsonb_build_object(
      'title', 'Step 3: Material Placement',
      'description', E'**What we do**: We apply a strong composite or glass ionomer material layer by layer to rebuild the core of your tooth\n\n**What you may feel**: Light pressure as we pack and shape the material\n\n**Why it matters**: Building up the core restores the tooth to a shape and size that can properly support a crown'
    ),
    jsonb_build_object(
      'title', 'Step 4: Shaping',
      'description', E'**What we do**: We shape and trim the buildup material so it has the correct form for a crown to fit over it\n\n**What you may feel**: Vibration and pressure as we smooth and contour the material\n\n**Why it matters**: Precise shaping means the crown will fit securely and your bite will feel natural'
    )
  ),

  jsonb_build_array(
    jsonb_build_object(
      'title', 'Paso 1: Preparación',
      'description', E'**Qué hacemos**: Adormecemos el área y eliminamos cualquier caries restante o material de empaste viejo. Limpiamos el diente y evaluamos cuánta estructura queda.\n\n**Qué puede sentir**: Un pequeño pinchazo de la inyección de anestesia, luego sin dolor — solo presión y vibración\n\n**Por qué es importante**: Una base limpia y sólida asegura que el material de reconstrucción se adhiera bien y el diente se mantenga sano bajo la corona'
    ),
    jsonb_build_object(
      'title', 'Paso 2: Colocación de Poste (si es necesario)',
      'description', E'**Qué hacemos**: Si el diente ha tenido un tratamiento de conducto y queda muy poca estructura, podemos colocar un pequeño poste (una varilla delgada de metal o fibra) en uno de los conductos radiculares para soporte adicional\n\n**Qué puede sentir**: Presión leve mientras se ajusta el poste\n\n**Por qué es importante**: El poste actúa como un ancla, dándole al material de reconstrucción algo fuerte a lo cual adherirse dentro del diente'
    ),
    jsonb_build_object(
      'title', 'Paso 3: Colocación del Material',
      'description', E'**Qué hacemos**: Aplicamos un material resistente de composite o ionómero de vidrio capa por capa para reconstruir el núcleo de su diente\n\n**Qué puede sentir**: Presión ligera mientras empacamos y damos forma al material\n\n**Por qué es importante**: Reconstruir el núcleo restaura el diente a una forma y tamaño que puede soportar adecuadamente una corona'
    ),
    jsonb_build_object(
      'title', 'Paso 4: Modelado',
      'description', E'**Qué hacemos**: Damos forma y recortamos el material de reconstrucción para que tenga la forma correcta para que una corona se ajuste sobre él\n\n**Qué puede sentir**: Vibración y presión mientras alisamos y contorneamos el material\n\n**Por qué es importante**: Un modelado preciso significa que la corona se ajustará de forma segura y su mordida se sentirá natural'
    )
  ),

  E'## What to expect after\n\n### First 24 hours\n- Avoid chewing on that side until the numbness wears off completely\n- Some mild sensitivity is normal and should ease quickly\n- If a temporary crown was placed, be gentle with it — avoid sticky or hard foods\n\n### First week\n- Brush and floss gently around the tooth\n- Return for your crown appointment as scheduled (usually within 1-2 weeks)\n- Do not delay getting the crown — the buildup is not designed to function on its own long-term\n\n### When to call us\n- The temporary crown comes off or the buildup material chips\n- You feel sharp pain when biting\n- The area around the tooth becomes swollen or tender',

  E'## Qué esperar después\n\n### Primeras 24 horas\n- Evite masticar de ese lado hasta que la anestesia desaparezca por completo\n- Algo de sensibilidad leve es normal y debería aliviarse rápidamente\n- Si se colocó una corona temporal, sea cuidadoso — evite alimentos pegajosos o duros\n\n### Primera semana\n- Cepíllese y use hilo dental con cuidado alrededor del diente\n- Regrese para su cita de corona según lo programado (generalmente dentro de 1-2 semanas)\n- No retrase ponerse la corona — la reconstrucción no está diseñada para funcionar sola a largo plazo\n\n### Cuándo llamarnos\n- La corona temporal se sale o el material de reconstrucción se astilla\n- Siente dolor agudo al morder\n- El área alrededor del diente se inflama o se pone sensible',

  jsonb_build_array(
    jsonb_build_object('q', 'What is a core buildup?', 'a', 'It is a procedure to rebuild the inner structure of a tooth using a strong filling material so it can support a crown. It is like building a foundation for a house.'),
    jsonb_build_object('q', 'Does a core buildup hurt?', 'a', 'No. The area is numbed before we start, so you should not feel any pain. Some mild sensitivity afterward is normal.'),
    jsonb_build_object('q', 'Do I always need a crown after a core buildup?', 'a', 'Yes. A core buildup is not strong enough on its own. It is specifically designed to support a crown, which protects the tooth from breaking.'),
    jsonb_build_object('q', 'What is a post and do I need one?', 'a', 'A post is a small rod placed into a root canal for extra support. Not everyone needs one — it depends on how much natural tooth structure is left. Your dentist will let you know.'),
    jsonb_build_object('q', 'How long does a core buildup take?', 'a', 'The buildup itself usually takes about 30 to 45 minutes. It is often done at the same appointment as your crown preparation.'),
    jsonb_build_object('q', 'How long does a core buildup last?', 'a', 'A core buildup with a crown can last many years — often 10 to 15 years or more — with good oral hygiene and regular dental visits.')
  ),

  jsonb_build_array(
    jsonb_build_object('q', '¿Qué es una reconstrucción de núcleo?', 'a', 'Es un procedimiento para reconstruir la estructura interna de un diente usando un material de empaste resistente para que pueda soportar una corona. Es como construir los cimientos de una casa.'),
    jsonb_build_object('q', '¿Duele una reconstrucción de núcleo?', 'a', 'No. El área se adormece antes de comenzar, por lo que no debería sentir dolor. Algo de sensibilidad leve después es normal.'),
    jsonb_build_object('q', '¿Siempre necesito una corona después de una reconstrucción?', 'a', 'Sí. Una reconstrucción de núcleo no es lo suficientemente fuerte por sí sola. Está diseñada específicamente para soportar una corona, que protege el diente de romperse.'),
    jsonb_build_object('q', '¿Qué es un poste y lo necesito?', 'a', 'Un poste es una varilla pequeña que se coloca en un conducto radicular para soporte adicional. No todos lo necesitan — depende de cuánta estructura dental natural quede. Su dentista se lo informará.'),
    jsonb_build_object('q', '¿Cuánto tiempo toma una reconstrucción de núcleo?', 'a', 'La reconstrucción en sí generalmente toma entre 30 y 45 minutos. A menudo se realiza en la misma cita que la preparación de su corona.'),
    jsonb_build_object('q', '¿Cuánto dura una reconstrucción de núcleo?', 'a', 'Una reconstrucción de núcleo con corona puede durar muchos años — a menudo 10 a 15 años o más — con buena higiene oral y visitas dentales regulares.')
  ),

  '1 visit, 30-45 minutes',
  '1 appointment (often combined with crown prep)',
  'restorative',
  true
)
ON CONFLICT (slug) DO UPDATE SET
  title_en = EXCLUDED.title_en, title_es = EXCLUDED.title_es,
  summary_en = EXCLUDED.summary_en, summary_es = EXCLUDED.summary_es,
  why_en = EXCLUDED.why_en, why_es = EXCLUDED.why_es,
  steps_en = EXCLUDED.steps_en, steps_es = EXCLUDED.steps_es,
  aftercare_en = EXCLUDED.aftercare_en, aftercare_es = EXCLUDED.aftercare_es,
  faqs_en = EXCLUDED.faqs_en, faqs_es = EXCLUDED.faqs_es,
  time_estimate = EXCLUDED.time_estimate, visits_estimate = EXCLUDED.visits_estimate,
  category = EXCLUDED.category, is_published = EXCLUDED.is_published,
  updated_at = CURRENT_TIMESTAMP;


-- =====================================================
-- GUM GRAFT / SOFT TISSUE GRAFT
-- =====================================================
INSERT INTO public.procedure_library (
  slug, title_en, title_es, summary_en, summary_es,
  why_en, why_es, what_if_not_en, what_if_not_es,
  steps_en, steps_es,
  aftercare_en, aftercare_es,
  risks_en, risks_es,
  faqs_en, faqs_es,
  time_estimate, visits_estimate, category, is_published
) VALUES (
  'gum-graft',

  'Gum Graft (Soft Tissue Graft)',
  'Injerto de Encía (Injerto de Tejido Blando)',

  E'## What this is\n\nA gum graft is a procedure to cover exposed tooth roots by moving gum tissue from one area of your mouth to another. When gums recede (pull back), the roots of your teeth become exposed, making them sensitive and more vulnerable to decay. During a gum graft, your periodontist takes a small piece of tissue — usually from the roof of your mouth or from nearby gum — and attaches it to the area where the gum has receded. This protects your tooth roots and restores a healthy gum line.\n\n## Why you may need it\n\nYou may need a gum graft if:\n- Your gums have pulled back and exposed the roots of your teeth\n- You have sensitivity to hot, cold, or sweet foods due to exposed roots\n- The recession is getting worse over time\n- You want to prevent further bone and tooth loss\n- You are unhappy with the appearance of your receding gum line',

  E'## Qué es esto\n\nUn injerto de encía es un procedimiento para cubrir las raíces dentales expuestas moviendo tejido de encía de un área de su boca a otra. Cuando las encías se retraen (se retiran), las raíces de sus dientes quedan expuestas, haciéndolas sensibles y más vulnerables a las caries. Durante un injerto de encía, su periodoncista toma un pequeño trozo de tejido — generalmente del paladar o de la encía cercana — y lo adhiere al área donde la encía se ha retraído. Esto protege las raíces de sus dientes y restaura una línea de encía saludable.\n\n## Por qué podría necesitarlo\n\nPodría necesitar un injerto de encía si:\n- Sus encías se han retraído y expuesto las raíces de sus dientes\n- Tiene sensibilidad a alimentos calientes, fríos o dulces debido a raíces expuestas\n- La recesión está empeorando con el tiempo\n- Quiere prevenir mayor pérdida de hueso y dientes\n- No está contento con la apariencia de su línea de encía retraída',

  E'## Why you may need it\n\nA gum graft protects your teeth and restores your gum line when recession has exposed your tooth roots.\n\n**Tooth sensitivity**: Exposed roots lack the protective enamel that covers the crown of your tooth, making them very sensitive to temperature and touch\n\n**Root decay risk**: Exposed roots are softer than enamel and much more prone to cavities\n\n**Progressive recession**: Without treatment, gum recession usually continues to get worse over time\n\n**Bone loss prevention**: As gums recede, the bone that supports your teeth can also start to shrink, eventually leading to loose teeth\n\n**Cosmetic improvement**: Receding gums can make teeth look long or uneven, and a graft restores a more natural appearance',

  E'## Por qué podría necesitarlo\n\nUn injerto de encía protege sus dientes y restaura su línea de encía cuando la recesión ha expuesto las raíces de sus dientes.\n\n**Sensibilidad dental**: Las raíces expuestas carecen del esmalte protector que cubre la corona de su diente, haciéndolas muy sensibles a la temperatura y al tacto\n\n**Riesgo de caries en la raíz**: Las raíces expuestas son más blandas que el esmalte y mucho más propensas a las caries\n\n**Recesión progresiva**: Sin tratamiento, la recesión de encías generalmente continúa empeorando con el tiempo\n\n**Prevención de pérdida ósea**: A medida que las encías se retraen, el hueso que soporta sus dientes también puede comenzar a reducirse, eventualmente causando dientes flojos\n\n**Mejora estética**: Las encías retraídas pueden hacer que los dientes se vean largos o desiguales, y un injerto restaura una apariencia más natural',

  E'## If you delay\n\nDelaying a gum graft when you have significant recession can lead to serious problems:\n\n**Worsening recession**: Gums do not grow back on their own — once they recede, they keep going without treatment\n\n**Tooth sensitivity increases**: As more root surface is exposed, sensitivity to hot, cold, and sweet foods gets worse\n\n**Root cavities**: Exposed roots are very vulnerable to decay, which can be difficult and expensive to treat\n\n**Bone loss**: Continued recession leads to loss of the bone around your teeth, which can cause teeth to become loose\n\n**Tooth loss**: In severe cases, untreated recession can lead to losing teeth\n\n**More complex surgery**: The longer you wait, the more tissue has been lost, which may require a larger or more complex graft',

  E'## Si lo retrasa\n\nRetrasar un injerto de encía cuando tiene recesión significativa puede causar problemas serios:\n\n**Empeoramiento de la recesión**: Las encías no vuelven a crecer por sí solas — una vez que se retraen, continúan sin tratamiento\n\n**Aumento de la sensibilidad dental**: A medida que más superficie de la raíz queda expuesta, la sensibilidad a alimentos calientes, fríos y dulces empeora\n\n**Caries en la raíz**: Las raíces expuestas son muy vulnerables a las caries, que pueden ser difíciles y costosas de tratar\n\n**Pérdida ósea**: La recesión continua lleva a la pérdida del hueso alrededor de sus dientes, lo que puede causar que los dientes se aflojen\n\n**Pérdida dental**: En casos severos, la recesión no tratada puede llevar a la pérdida de dientes\n\n**Cirugía más compleja**: Cuanto más espere, más tejido se habrá perdido, lo que puede requerir un injerto más grande o complejo',

  jsonb_build_array(
    jsonb_build_object(
      'title', 'Step 1: Anesthesia',
      'description', E'**What we do**: We numb the treatment area and the donor site (usually the roof of your mouth) so you are completely comfortable\n\n**What you may feel**: A small pinch from the numbing shots, then complete numbness in both areas\n\n**Why it matters**: Thorough numbing ensures you feel no pain during the procedure'
    ),
    jsonb_build_object(
      'title', 'Step 2: Donor Tissue Harvesting',
      'description', E'**What we do**: We carefully take a small piece of tissue from the donor site — most often the roof of your mouth, or sometimes from tissue near the affected tooth. In some cases, donor tissue material may be used instead.\n\n**What you may feel**: No pain because the area is numb\n\n**Why it matters**: This tissue will become the new gum covering over your exposed roots'
    ),
    jsonb_build_object(
      'title', 'Step 3: Site Preparation',
      'description', E'**What we do**: We gently prepare the area where the gum has receded by cleaning it and creating a small pocket or surface for the graft tissue to attach to\n\n**What you may feel**: Mild pressure\n\n**Why it matters**: Proper preparation helps the graft tissue heal and bond securely to the area'
    ),
    jsonb_build_object(
      'title', 'Step 4: Graft Placement',
      'description', E'**What we do**: We position the donor tissue over the exposed root and carefully shape it to cover the recession area\n\n**What you may feel**: Light pressure as we place and adjust the tissue\n\n**Why it matters**: Correct positioning ensures full coverage of the exposed root and a natural-looking gum line'
    ),
    jsonb_build_object(
      'title', 'Step 5: Suturing',
      'description', E'**What we do**: We secure the graft in place with tiny stitches and may place a protective dressing over the area\n\n**What you may feel**: Mild tugging as the stitches are placed\n\n**Why it matters**: The stitches hold the graft firmly in place while it heals and integrates with your existing tissue'
    )
  ),

  jsonb_build_array(
    jsonb_build_object(
      'title', 'Paso 1: Anestesia',
      'description', E'**Qué hacemos**: Adormecemos el área de tratamiento y el sitio donante (generalmente el paladar) para que esté completamente cómodo\n\n**Qué puede sentir**: Un pequeño pinchazo de las inyecciones de anestesia, luego adormecimiento completo en ambas áreas\n\n**Por qué es importante**: Un adormecimiento completo asegura que no sienta dolor durante el procedimiento'
    ),
    jsonb_build_object(
      'title', 'Paso 2: Obtención del Tejido Donante',
      'description', E'**Qué hacemos**: Tomamos cuidadosamente un pequeño trozo de tejido del sitio donante — más frecuentemente del paladar, o a veces del tejido cerca del diente afectado. En algunos casos, se puede usar material de tejido donante en su lugar.\n\n**Qué puede sentir**: Sin dolor porque el área está adormecida\n\n**Por qué es importante**: Este tejido se convertirá en la nueva cobertura de encía sobre sus raíces expuestas'
    ),
    jsonb_build_object(
      'title', 'Paso 3: Preparación del Sitio',
      'description', E'**Qué hacemos**: Preparamos suavemente el área donde la encía se ha retraído limpiándola y creando un pequeño bolsillo o superficie para que el tejido del injerto se adhiera\n\n**Qué puede sentir**: Presión leve\n\n**Por qué es importante**: Una preparación adecuada ayuda al tejido del injerto a sanar y adherirse de forma segura al área'
    ),
    jsonb_build_object(
      'title', 'Paso 4: Colocación del Injerto',
      'description', E'**Qué hacemos**: Posicionamos el tejido donante sobre la raíz expuesta y lo moldeamos cuidadosamente para cubrir el área de recesión\n\n**Qué puede sentir**: Presión ligera mientras colocamos y ajustamos el tejido\n\n**Por qué es importante**: Una posición correcta asegura cobertura completa de la raíz expuesta y una línea de encía de aspecto natural'
    ),
    jsonb_build_object(
      'title', 'Paso 5: Sutura',
      'description', E'**Qué hacemos**: Aseguramos el injerto en su lugar con pequeñas suturas y podemos colocar un apósito protector sobre el área\n\n**Qué puede sentir**: Ligero tirón mientras se colocan las suturas\n\n**Por qué es importante**: Las suturas mantienen el injerto firmemente en su lugar mientras sana y se integra con su tejido existente'
    )
  ),

  E'## What to expect after\n\n### First 24 hours\n- Apply an ice pack to the outside of your face (20 minutes on, 20 minutes off) to reduce swelling\n- Take prescribed pain medication before the numbness wears off\n- Eat only soft, cool foods — yogurt, smoothies, mashed potatoes, scrambled eggs\n- Do NOT brush or floss near the graft site\n- Avoid hot foods and drinks\n- Do not use straws, spit forcefully, or smoke\n\n### First 1-2 weeks\n- Continue eating soft foods for at least 1-2 weeks\n- Do not pull your lip to look at the graft — this can disturb healing\n- Rinse gently with prescribed mouthwash or warm salt water starting the day after surgery\n- Avoid exercise or heavy physical activity for 3-5 days\n- Sleep with your head elevated on an extra pillow\n- The graft area may look white or yellowish — this is normal healing, not infection\n- Stitches will dissolve on their own or be removed at your follow-up appointment\n\n### Donor site (roof of mouth)\n- The roof of your mouth will be sore for about 1-2 weeks\n- A protective covering or bandage may be placed — do not remove it\n- Avoid crunchy, sharp, or spicy foods that could irritate the area\n\n### Normal vs not normal\n\n**Normal**:\n- Mild to moderate discomfort for 5-7 days\n- Swelling for 2-3 days\n- Bruising around the area\n- Whitish or yellowish appearance of the graft\n- Mild bleeding the first day\n\n**Not normal — call us if you notice**:\n- Heavy bleeding that does not stop with gentle pressure\n- Severe pain that gets worse after 3-4 days\n- Fever over 100°F\n- Pus or foul smell from the graft area\n- The graft tissue appears to be coming loose\n- Swelling that increases after the third day',

  E'## Qué esperar después\n\n### Primeras 24 horas\n- Aplique una bolsa de hielo en el exterior de su cara (20 minutos sí, 20 minutos no) para reducir la hinchazón\n- Tome el medicamento para el dolor recetado antes de que la anestesia desaparezca\n- Coma solo alimentos suaves y frescos — yogur, batidos, puré de papas, huevos revueltos\n- NO se cepille ni use hilo dental cerca del sitio del injerto\n- Evite alimentos y bebidas calientes\n- No use pajillas, escupa con fuerza ni fume\n\n### Primeras 1-2 semanas\n- Continúe comiendo alimentos suaves durante al menos 1-2 semanas\n- No tire de su labio para ver el injerto — esto puede perturbar la curación\n- Enjuague suavemente con el enjuague bucal recetado o agua tibia con sal comenzando el día después de la cirugía\n- Evite ejercicio o actividad física intensa por 3-5 días\n- Duerma con la cabeza elevada sobre una almohada extra\n- El área del injerto puede verse blanca o amarillenta — esto es curación normal, no infección\n- Las suturas se disolverán por sí solas o se retirarán en su cita de seguimiento\n\n### Sitio donante (paladar)\n- El paladar estará adolorido por aproximadamente 1-2 semanas\n- Se puede colocar una cubierta protectora o vendaje — no lo retire\n- Evite alimentos crujientes, afilados o picantes que puedan irritar el área\n\n### Normal vs no normal\n\n**Normal**:\n- Molestia leve a moderada por 5-7 días\n- Hinchazón por 2-3 días\n- Moretones alrededor del área\n- Apariencia blanquecina o amarillenta del injerto\n- Sangrado leve el primer día\n\n**No normal — llámenos si nota**:\n- Sangrado abundante que no se detiene con presión suave\n- Dolor severo que empeora después de 3-4 días\n- Fiebre superior a 100°F\n- Pus u olor desagradable del área del injerto\n- El tejido del injerto parece estar soltándose\n- Hinchazón que aumenta después del tercer día',

  E'## Risks and considerations\n\n**Discomfort at donor site**: The roof of your mouth will be sore for 1-2 weeks; this is the most common source of post-procedure discomfort\n\n**Graft failure**: In rare cases, the graft may not attach properly and may need to be redone\n\n**Infection**: Uncommon but possible; following aftercare instructions closely helps prevent this\n\n**Swelling and bruising**: Normal and temporary, usually resolving within a few days\n\n**Uneven gum line**: Minor touch-up procedures may be needed in some cases to achieve the ideal result\n\n**Sensitivity changes**: You may notice changes in sensitivity as the graft heals; this usually stabilizes within a few weeks',

  E'## Riesgos y consideraciones\n\n**Molestia en el sitio donante**: El paladar estará adolorido por 1-2 semanas; esta es la fuente más común de molestia post-procedimiento\n\n**Fallo del injerto**: En casos raros, el injerto puede no adherirse correctamente y puede necesitar repetirse\n\n**Infección**: Poco común pero posible; seguir las instrucciones de cuidado posterior cuidadosamente ayuda a prevenirlo\n\n**Hinchazón y moretones**: Normal y temporal, generalmente se resuelve dentro de unos días\n\n**Línea de encía desigual**: Pueden ser necesarios procedimientos menores de retoque en algunos casos para lograr el resultado ideal\n\n**Cambios en la sensibilidad**: Puede notar cambios en la sensibilidad mientras el injerto sana; esto generalmente se estabiliza dentro de unas semanas',

  jsonb_build_array(
    jsonb_build_object('q', 'Does a gum graft hurt?', 'a', 'The procedure itself is painless because the area is numbed. Afterward, you can expect some soreness for about a week, especially at the roof of your mouth if tissue was taken from there. Pain medication helps manage this.'),
    jsonb_build_object('q', 'How long does a gum graft take?', 'a', 'The procedure usually takes about 60 to 90 minutes, depending on how many teeth are being treated.'),
    jsonb_build_object('q', 'How long is the recovery?', 'a', 'Most people feel much better within 1-2 weeks. Full healing of the graft takes about 4-6 weeks. You can usually return to work within 1-2 days.'),
    jsonb_build_object('q', 'Will my gums look normal after the graft?', 'a', 'Yes. Once fully healed, the grafted tissue blends in with your natural gum and looks very natural. The final result is usually visible within 2-3 months.'),
    jsonb_build_object('q', 'Can gums grow back on their own without surgery?', 'a', 'No. Once gum tissue is lost, it does not regenerate on its own. A gum graft is the only way to restore coverage over exposed roots.'),
    jsonb_build_object('q', 'What can I eat after a gum graft?', 'a', 'Stick to soft, cool foods for the first 1-2 weeks. Good options include yogurt, smoothies, mashed potatoes, scrambled eggs, and pasta. Avoid anything crunchy, spicy, or hot.'),
    jsonb_build_object('q', 'Will the graft fail?', 'a', 'Graft failure is rare. Following your aftercare instructions carefully — especially avoiding disturbing the graft site — gives you the best chance of success. Success rates are typically over 90%.'),
    jsonb_build_object('q', 'Does insurance cover gum grafts?', 'a', 'Many dental insurance plans cover gum grafts when they are medically necessary to treat recession. Our office can help verify your coverage before the procedure.')
  ),

  jsonb_build_array(
    jsonb_build_object('q', '¿Duele un injerto de encía?', 'a', 'El procedimiento en sí es indoloro porque el área está adormecida. Después, puede esperar algo de dolor por aproximadamente una semana, especialmente en el paladar si se tomó tejido de allí. El medicamento para el dolor ayuda a manejar esto.'),
    jsonb_build_object('q', '¿Cuánto tiempo toma un injerto de encía?', 'a', 'El procedimiento generalmente toma entre 60 y 90 minutos, dependiendo de cuántos dientes se estén tratando.'),
    jsonb_build_object('q', '¿Cuánto dura la recuperación?', 'a', 'La mayoría de las personas se sienten mucho mejor dentro de 1-2 semanas. La curación completa del injerto toma aproximadamente 4-6 semanas. Generalmente puede regresar al trabajo dentro de 1-2 días.'),
    jsonb_build_object('q', '¿Mis encías se verán normales después del injerto?', 'a', 'Sí. Una vez completamente curado, el tejido injertado se integra con su encía natural y se ve muy natural. El resultado final generalmente es visible dentro de 2-3 meses.'),
    jsonb_build_object('q', '¿Pueden las encías volver a crecer solas sin cirugía?', 'a', 'No. Una vez que el tejido de la encía se pierde, no se regenera por sí solo. Un injerto de encía es la única forma de restaurar la cobertura sobre las raíces expuestas.'),
    jsonb_build_object('q', '¿Qué puedo comer después de un injerto de encía?', 'a', 'Coma alimentos suaves y frescos durante las primeras 1-2 semanas. Buenas opciones incluyen yogur, batidos, puré de papas, huevos revueltos y pasta. Evite cualquier cosa crujiente, picante o caliente.'),
    jsonb_build_object('q', '¿Puede fallar el injerto?', 'a', 'El fallo del injerto es raro. Seguir sus instrucciones de cuidado posterior cuidadosamente — especialmente evitar perturbar el sitio del injerto — le da la mejor oportunidad de éxito. Las tasas de éxito son típicamente superiores al 90%.'),
    jsonb_build_object('q', '¿El seguro cubre los injertos de encía?', 'a', 'Muchos planes de seguro dental cubren los injertos de encía cuando son médicamente necesarios para tratar la recesión. Nuestra oficina puede ayudar a verificar su cobertura antes del procedimiento.')
  ),

  '1 visit, 60-90 minutes',
  '1-2 appointments (procedure + follow-up)',
  'periodontics',
  true
)
ON CONFLICT (slug) DO UPDATE SET
  title_en = EXCLUDED.title_en, title_es = EXCLUDED.title_es,
  summary_en = EXCLUDED.summary_en, summary_es = EXCLUDED.summary_es,
  why_en = EXCLUDED.why_en, why_es = EXCLUDED.why_es,
  what_if_not_en = EXCLUDED.what_if_not_en, what_if_not_es = EXCLUDED.what_if_not_es,
  steps_en = EXCLUDED.steps_en, steps_es = EXCLUDED.steps_es,
  aftercare_en = EXCLUDED.aftercare_en, aftercare_es = EXCLUDED.aftercare_es,
  risks_en = EXCLUDED.risks_en, risks_es = EXCLUDED.risks_es,
  faqs_en = EXCLUDED.faqs_en, faqs_es = EXCLUDED.faqs_es,
  time_estimate = EXCLUDED.time_estimate, visits_estimate = EXCLUDED.visits_estimate,
  category = EXCLUDED.category, is_published = EXCLUDED.is_published,
  updated_at = CURRENT_TIMESTAMP;

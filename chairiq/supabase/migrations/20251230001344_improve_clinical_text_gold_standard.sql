-- Migration: Improve Clinical Text for Existing Procedures Using Gold Standard Patient Education Format
-- Timestamp: 20251230001344
-- 
-- CRITICAL RULES FOLLOWED:
-- ✅ Only updates existing procedures (root-canal, dental-crown, dental-bridge, scaling-root-planing, simple-extraction, wisdom-teeth-education, valplast-education)
-- ✅ Does NOT create new procedures
-- ✅ Does NOT modify visuals table or image URLs
-- ✅ Does NOT rename procedure slugs/IDs
-- ✅ Uses Gold Standard Patient Education Format with exact headings
-- ✅ 6th-8th grade reading level, no salesy language
-- ✅ Special requirements for Wisdom Teeth and Valplast

DO $$
BEGIN
    RAISE NOTICE 'Starting clinical text improvements for existing procedures...';

    -- 1. ROOT CANAL - Gold Standard Format
    UPDATE public.procedure_library
    SET
        summary_en = E'## What This Is\n\nA root canal removes infected tissue from inside your tooth and seals it to save the tooth. It''s done when bacteria reach the inner pulp, causing pain or infection. The dentist removes the damaged pulp, cleans the inside, and fills it so the tooth can stay in your mouth.\n\n## Why You May Need It\n\n- Deep cavity that reached the pulp\n- Cracked tooth that exposed the nerve\n- Repeated dental work on the same tooth\n- Trauma or injury to the tooth\n- Severe toothache that won''t go away\n- Swelling or tenderness in nearby gums\n\nWithout treatment, the infection spreads to the bone, causing an abscess. The tooth will likely need to be pulled.',
        
        summary_es = E'## Qué Es Esto\n\nUna endodoncia elimina el tejido infectado del interior de su diente y lo sella para salvarlo. Se hace cuando las bacterias llegan a la pulpa interior, causando dolor o infección. El dentista elimina la pulpa dañada, limpia el interior y lo rellena para que el diente pueda permanecer en su boca.\n\n## Por Qué Puede Necesitarlo\n\n- Cavidad profunda que llegó a la pulpa\n- Diente agrietado que expuso el nervio\n- Trabajo dental repetido en el mismo diente\n- Trauma o lesión en el diente\n- Dolor de muelas severo que no desaparece\n- Hinchazón o sensibilidad en encías cercanas\n\nSin tratamiento, la infección se propaga al hueso, causando un absceso. El diente probablemente necesitará ser extraído.',
        
        steps_en = jsonb_build_array(
            jsonb_build_object(
                'title', 'What We Do',
                'content', 'We make a small opening in the top of your tooth to reach the infected tissue inside.',
                'what_you_feel', 'You won''t feel this because the area is completely numb.',
                'why_it_matters', 'This opening lets us remove the infection without affecting the outside of your tooth.'
            ),
            jsonb_build_object(
                'title', 'What We Do',
                'content', 'We remove the infected pulp and carefully clean each root canal with special tools.',
                'what_you_feel', 'You might feel pressure but no pain. Tell us if anything feels uncomfortable.',
                'why_it_matters', 'Cleaning removes all bacteria so the infection doesn''t come back.'
            ),
            jsonb_build_object(
                'title', 'What We Do',
                'content', 'We fill the cleaned canals with a rubber-like material and seal the opening.',
                'what_you_feel', 'Still numb. No pain during this step.',
                'why_it_matters', 'Sealing prevents new bacteria from entering and reinfecting the tooth.'
            ),
            jsonb_build_object(
                'title', 'What We Do',
                'content', 'We rebuild the inside of the tooth to make it strong again.',
                'what_you_feel', 'The numbness is wearing off, but there''s no pain yet.',
                'why_it_matters', 'This supports the crown that will go on top and protects the tooth long-term.'
            ),
            jsonb_build_object(
                'title', 'What We Do',
                'content', 'At a follow-up visit, we place a custom crown over the tooth to protect it.',
                'what_you_feel', 'Minor adjustments to make sure the crown fits comfortably.',
                'why_it_matters', 'The crown prevents the tooth from cracking and lets you chew normally again.'
            )
        ),
        
        steps_es = jsonb_build_array(
            jsonb_build_object(
                'title', 'Lo Que Hacemos',
                'content', 'Hacemos una pequeña abertura en la parte superior de su diente para alcanzar el tejido infectado en el interior.',
                'what_you_feel', 'No sentirá esto porque el área está completamente adormecida.',
                'why_it_matters', 'Esta abertura nos permite eliminar la infección sin afectar el exterior de su diente.'
            ),
            jsonb_build_object(
                'title', 'Lo Que Hacemos',
                'content', 'Eliminamos la pulpa infectada y limpiamos cuidadosamente cada conducto radicular con herramientas especiales.',
                'what_you_feel', 'Puede sentir presión pero no dolor. Díganos si algo se siente incómodo.',
                'why_it_matters', 'La limpieza elimina todas las bacterias para que la infección no regrese.'
            ),
            jsonb_build_object(
                'title', 'Lo Que Hacemos',
                'content', 'Llenamos los conductos limpios con un material similar al caucho y sellamos la abertura.',
                'what_you_feel', 'Todavía adormecido. No hay dolor durante este paso.',
                'why_it_matters', 'Sellar previene que nuevas bacterias entren y reinfecten el diente.'
            ),
            jsonb_build_object(
                'title', 'Lo Que Hacemos',
                'content', 'Reconstruimos el interior del diente para hacerlo fuerte de nuevo.',
                'what_you_feel', 'El adormecimiento está desapareciendo, pero todavía no hay dolor.',
                'why_it_matters', 'Esto soporta la corona que irá encima y protege el diente a largo plazo.'
            ),
            jsonb_build_object(
                'title', 'Lo Que Hacemos',
                'content', 'En una visita de seguimiento, colocamos una corona personalizada sobre el diente para protegerlo.',
                'what_you_feel', 'Ajustes menores para asegurarse de que la corona se ajuste cómodamente.',
                'why_it_matters', 'La corona previene que el diente se agriete y le permite masticar normalmente de nuevo.'
            )
        ),
        
        time_estimate = '1-2 visits, 60-90 minutes each',
        visits_estimate = '2 appointments (root canal + crown placement)',
        
        aftercare_en = E'## First 24 Hours\n- Take pain medication before numbness wears off\n- Avoid chewing on that side\n- Stick to soft foods\n- No hot drinks or food until feeling returns\n\n## First Week\n- Mild soreness is normal for 3-5 days\n- Brush and floss gently around the tooth\n- Avoid hard, sticky, or crunchy foods\n- Take prescribed antibiotics if given\n\n## Normal vs Not Normal\n**Normal:** Slight tenderness when biting, sensitivity to pressure\n**Not Normal:** Severe pain, visible swelling, fever, foul taste\n\n## When to Call Us\n- Pain gets worse after 3 days\n- Swelling around tooth or face\n- Temporary filling falls out\n- Bite feels uneven or high',
        
        aftercare_es = E'## Primeras 24 Horas\n- Tome medicamento para el dolor antes de que desaparezca el adormecimiento\n- Evite masticar en ese lado\n- Coma alimentos blandos\n- No tome bebidas o alimentos calientes hasta que regrese la sensación\n\n## Primera Semana\n- Dolor leve es normal durante 3-5 días\n- Cepille y use hilo dental suavemente alrededor del diente\n- Evite alimentos duros, pegajosos o crujientes\n- Tome antibióticos recetados si se los dieron\n\n## Normal vs No Normal\n**Normal:** Sensibilidad leve al morder, sensibilidad a la presión\n**No Normal:** Dolor severo, hinchazón visible, fiebre, sabor desagradable\n\n## Cuándo Llamarnos\n- El dolor empeora después de 3 días\n- Hinchazón alrededor del diente o la cara\n- Se cae el empaste temporal\n- La mordida se siente desigual o alta',
        
        what_if_not_en = 'The infection will spread to the bone around the tooth, forming a painful abscess. The swelling can affect your face and jaw. Eventually, the tooth will need to be removed. Replacing a missing tooth costs more and takes longer than a root canal.',
        
        what_if_not_es = 'La infección se propagará al hueso alrededor del diente, formando un absceso doloroso. La hinchazón puede afectar su cara y mandíbula. Eventualmente, el diente necesitará ser extraído. Reemplazar un diente faltante cuesta más y toma más tiempo que una endodoncia.',
        
        faqs_en = jsonb_build_array(
            jsonb_build_object('q', 'Does it hurt?', 'a', 'No. The area is numb throughout the procedure. Most patients say it feels like getting a filling.'),
            jsonb_build_object('q', 'How long does it take?', 'a', '60-90 minutes for the root canal itself. You''ll return for a crown in 1-2 weeks.'),
            jsonb_build_object('q', 'Can I eat after?', 'a', 'Yes, but wait until numbness wears off and stick to soft foods on the other side for 24 hours.'),
            jsonb_build_object('q', 'Will I need pain medication?', 'a', 'Most people manage with over-the-counter ibuprofen. We''ll prescribe stronger medication if needed.'),
            jsonb_build_object('q', 'Is the tooth weaker after?', 'a', 'Without a crown, yes. That''s why we place a crown—it makes the tooth as strong as before.'),
            jsonb_build_object('q', 'Why not just pull the tooth?', 'a', 'Keeping your natural tooth is better for chewing, jaw alignment, and preventing other teeth from shifting.'),
            jsonb_build_object('q', 'Can the infection come back?', 'a', 'Very rarely. If the tooth is properly cleaned and sealed, reinfection is uncommon.'),
            jsonb_build_object('q', 'How long does the tooth last?', 'a', 'With a crown and good care, most root canal treated teeth last a lifetime.')
        ),
        
        faqs_es = jsonb_build_array(
            jsonb_build_object('q', '¿Duele?', 'a', 'No. El área está adormecida durante todo el procedimiento. La mayoría de los pacientes dicen que se siente como obtener un empaste.'),
            jsonb_build_object('q', '¿Cuánto tiempo toma?', 'a', '60-90 minutos para la endodoncia en sí. Regresará para una corona en 1-2 semanas.'),
            jsonb_build_object('q', '¿Puedo comer después?', 'a', 'Sí, pero espere hasta que desaparezca el adormecimiento y coma alimentos blandos en el otro lado durante 24 horas.'),
            jsonb_build_object('q', '¿Necesitaré medicamento para el dolor?', 'a', 'La mayoría de las personas se las arreglan con ibuprofeno de venta libre. Recetaremos medicamento más fuerte si es necesario.'),
            jsonb_build_object('q', '¿El diente está más débil después?', 'a', 'Sin una corona, sí. Por eso colocamos una corona—hace que el diente sea tan fuerte como antes.'),
            jsonb_build_object('q', '¿Por qué no simplemente extraer el diente?', 'a', 'Mantener su diente natural es mejor para masticar, alineación de la mandíbula y prevenir que otros dientes se muevan.'),
            jsonb_build_object('q', '¿Puede la infección regresar?', 'a', 'Muy raramente. Si el diente está limpio y sellado correctamente, la reinfección es poco común.'),
            jsonb_build_object('q', '¿Cuánto tiempo dura el diente?', 'a', 'Con una corona y buen cuidado, la mayoría de los dientes tratados con endodoncia duran toda la vida.')
        ),
        
        updated_at = CURRENT_TIMESTAMP
    WHERE slug = 'root-canal';

    RAISE NOTICE 'Updated root-canal procedure with Gold Standard format';

    -- 2. DENTAL CROWN - Gold Standard Format
    UPDATE public.procedure_library
    SET
        summary_en = E'## What This Is\n\nA dental crown is a tooth-shaped cap that covers a damaged tooth. It protects the tooth and restores its shape, strength, and appearance. Think of it like a helmet for your tooth—it goes over the entire visible part above the gum line.\n\n## Why You May Need It\n\n- Tooth cracked or severely broken\n- Large filling that weakened the tooth\n- Root canal treatment (tooth needs protection)\n- Tooth worn down from grinding\n- Cover a dental implant\n- Improve appearance of misshapen or discolored tooth\n\nWithout a crown, the weakened tooth can break further, leading to infection or tooth loss.',
        
        summary_es = E'## Qué Es Esto\n\nUna corona dental es una tapa en forma de diente que cubre un diente dañado. Protege el diente y restaura su forma, fuerza y apariencia. Piense en ello como un casco para su diente—cubre toda la parte visible sobre la línea de las encías.\n\n## Por Qué Puede Necesitarlo\n\n- Diente agrietado o severamente roto\n- Empaste grande que debilitó el diente\n- Tratamiento de conducto (el diente necesita protección)\n- Diente desgastado por rechinar\n- Cubrir un implante dental\n- Mejorar la apariencia de un diente mal formado o descolorido\n\nSin una corona, el diente debilitado puede romperse más, llevando a infección o pérdida del diente.',
        
        steps_en = jsonb_build_array(
            jsonb_build_object(
                'title', 'What We Do',
                'content', 'We reshape your tooth by removing a thin layer all around it to make room for the crown.',
                'what_you_feel', 'You won''t feel it—the area is numb. You''ll hear the drill sound.',
                'why_it_matters', 'The crown needs to fit snugly without feeling bulky or changing your bite.'
            ),
            jsonb_build_object(
                'title', 'What We Do',
                'content', 'We take a digital scan or mold of your tooth to create a custom crown that matches your other teeth.',
                'what_you_feel', 'No pain. The scanner moves around your mouth, or you bite into a soft tray.',
                'why_it_matters', 'This ensures the crown fits perfectly and looks natural.'
            ),
            jsonb_build_object(
                'title', 'What We Do',
                'content', 'We place a temporary crown over your tooth while the permanent one is being made.',
                'what_you_feel', 'It feels slightly different than your real tooth, but works fine for eating soft foods.',
                'why_it_matters', 'Protects the prepared tooth and lets you eat comfortably while waiting.'
            ),
            jsonb_build_object(
                'title', 'What We Do',
                'content', 'At a second visit, we remove the temporary crown and check the fit of your permanent crown.',
                'what_you_feel', 'No pain. We make small adjustments to ensure it feels comfortable when you bite down.',
                'why_it_matters', 'A proper fit prevents irritation and ensures the crown lasts.'
            ),
            jsonb_build_object(
                'title', 'What We Do',
                'content', 'We cement the permanent crown in place and polish it.',
                'what_you_feel', 'Slight pressure when we press it on. No pain.',
                'why_it_matters', 'The cement bonds the crown permanently so it won''t come off.'
            )
        ),
        
        steps_es = jsonb_build_array(
            jsonb_build_object(
                'title', 'Lo Que Hacemos',
                'content', 'Remodelamos su diente eliminando una capa delgada alrededor para hacer espacio para la corona.',
                'what_you_feel', 'No lo sentirá—el área está adormecida. Escuchará el sonido del taladro.',
                'why_it_matters', 'La corona necesita ajustarse perfectamente sin sentirse voluminosa o cambiar su mordida.'
            ),
            jsonb_build_object(
                'title', 'Lo Que Hacemos',
                'content', 'Tomamos un escaneo digital o molde de su diente para crear una corona personalizada que coincida con sus otros dientes.',
                'what_you_feel', 'Sin dolor. El escáner se mueve alrededor de su boca, o muerde una bandeja suave.',
                'why_it_matters', 'Esto asegura que la corona se ajuste perfectamente y se vea natural.'
            ),
            jsonb_build_object(
                'title', 'Lo Que Hacemos',
                'content', 'Colocamos una corona temporal sobre su diente mientras se hace la permanente.',
                'what_you_feel', 'Se siente ligeramente diferente a su diente real, pero funciona bien para comer alimentos blandos.',
                'why_it_matters', 'Protege el diente preparado y le permite comer cómodamente mientras espera.'
            ),
            jsonb_build_object(
                'title', 'Lo Que Hacemos',
                'content', 'En una segunda visita, quitamos la corona temporal y verificamos el ajuste de su corona permanente.',
                'what_you_feel', 'Sin dolor. Hacemos pequeños ajustes para asegurarnos de que se sienta cómoda cuando muerde.',
                'why_it_matters', 'Un ajuste adecuado previene irritación y asegura que la corona dure.'
            ),
            jsonb_build_object(
                'title', 'Lo Que Hacemos',
                'content', 'Cementamos la corona permanente en su lugar y la pulimos.',
                'what_you_feel', 'Presión leve cuando la presionamos. Sin dolor.',
                'why_it_matters', 'El cemento une la corona permanentemente para que no se caiga.'
            )
        ),
        
        time_estimate = '2 visits, 60-90 minutes each',
        visits_estimate = '2 appointments (prep + placement)',
        
        aftercare_en = E'## First 24 Hours\n- Avoid sticky, hard, or chewy foods\n- Chew on the opposite side\n- If temporary crown, avoid pulling motions (gum, caramels)\n- Brush gently around the crown\n\n## First Week\n- Mild sensitivity to hot/cold is normal\n- Temporary crown may feel slightly rough—this is normal\n- Continue gentle brushing and flossing\n- Crown should start feeling natural within 5-7 days\n\n## Normal vs Not Normal\n**Normal:** Slight sensitivity when biting, minor gum soreness\n**Not Normal:** Sharp pain when biting, swelling around crown, crown feels loose\n\n## When to Call Us\n- Crown feels high or uncomfortable after a few days\n- Temporary or permanent crown comes off\n- Pain increases instead of decreasing\n- Gums around crown are swollen or bleeding',
        
        aftercare_es = E'## Primeras 24 Horas\n- Evite alimentos pegajosos, duros o masticables\n- Mastique en el lado opuesto\n- Si es corona temporal, evite movimientos de jalar (chicle, caramelos)\n- Cepille suavemente alrededor de la corona\n\n## Primera Semana\n- Sensibilidad leve al calor/frío es normal\n- Corona temporal puede sentirse ligeramente áspera—esto es normal\n- Continue cepillando y usando hilo dental suavemente\n- La corona debería comenzar a sentirse natural en 5-7 días\n\n## Normal vs No Normal\n**Normal:** Sensibilidad leve al morder, dolor menor en encías\n**No Normal:** Dolor agudo al morder, hinchazón alrededor de la corona, corona se siente floja\n\n## Cuándo Llamarnos\n- La corona se siente alta o incómoda después de unos días\n- La corona temporal o permanente se cae\n- El dolor aumenta en lugar de disminuir\n- Las encías alrededor de la corona están hinchadas o sangrando',
        
        what_if_not_en = 'The tooth will continue to weaken and may break completely. Bacteria can enter through cracks, leading to decay or infection that requires root canal treatment or extraction. Replacing a missing tooth costs more than a crown.',
        
        what_if_not_es = 'El diente continuará debilitándose y puede romperse completamente. Las bacterias pueden entrar a través de grietas, llevando a caries o infección que requiere tratamiento de conducto o extracción. Reemplazar un diente faltante cuesta más que una corona.',
        
        faqs_en = jsonb_build_array(
            jsonb_build_object('q', 'How long does a crown last?', 'a', 'With proper care, 10-15 years or longer. Avoid chewing ice or hard objects.'),
            jsonb_build_object('q', 'Will it look natural?', 'a', 'Yes. We match the color and shape to your other teeth so it blends in.'),
            jsonb_build_object('q', 'Can I eat normally with it?', 'a', 'Yes, once it''s permanently placed. Avoid very hard foods like ice or hard candy.'),
            jsonb_build_object('q', 'Does it hurt to get a crown?', 'a', 'No. The area is numb during the procedure. You might feel slight soreness for 1-2 days after.'),
            jsonb_build_object('q', 'What if my temporary crown falls off?', 'a', 'Call us right away. Keep the crown safe and avoid chewing on that tooth until we can reattach it.'),
            jsonb_build_object('q', 'Do I still need to floss around it?', 'a', 'Yes. Floss daily to prevent gum disease and decay around the crown edges.'),
            jsonb_build_object('q', 'Can a crown get cavities?', 'a', 'No, but the tooth underneath can. That''s why brushing and flossing are still important.'),
            jsonb_build_object('q', 'Will insurance cover this?', 'a', 'Most plans cover 50% if the crown is medically necessary. We can verify your coverage.')
        ),
        
        faqs_es = jsonb_build_array(
            jsonb_build_object('q', '¿Cuánto tiempo dura una corona?', 'a', 'Con el cuidado adecuado, 10-15 años o más. Evite masticar hielo u objetos duros.'),
            jsonb_build_object('q', '¿Se verá natural?', 'a', 'Sí. Coincidimos con el color y la forma de sus otros dientes para que se mezcle.'),
            jsonb_build_object('q', '¿Puedo comer normalmente con ella?', 'a', 'Sí, una vez que esté colocada permanentemente. Evite alimentos muy duros como hielo o dulces duros.'),
            jsonb_build_object('q', '¿Duele obtener una corona?', 'a', 'No. El área está adormecida durante el procedimiento. Puede sentir dolor leve durante 1-2 días después.'),
            jsonb_build_object('q', '¿Qué pasa si mi corona temporal se cae?', 'a', 'Llámenos de inmediato. Mantenga la corona segura y evite masticar en ese diente hasta que podamos volver a colocarla.'),
            jsonb_build_object('q', '¿Todavía necesito usar hilo dental alrededor de ella?', 'a', 'Sí. Use hilo dental diariamente para prevenir enfermedad de las encías y caries alrededor de los bordes de la corona.'),
            jsonb_build_object('q', '¿Puede una corona tener caries?', 'a', 'No, pero el diente debajo sí puede. Por eso cepillar y usar hilo dental sigue siendo importante.'),
            jsonb_build_object('q', '¿El seguro cubrirá esto?', 'a', 'La mayoría de los planes cubren el 50% si la corona es médicamente necesaria. Podemos verificar su cobertura.')
        ),
        
        updated_at = CURRENT_TIMESTAMP
    WHERE slug = 'dental-crown';

    RAISE NOTICE 'Updated dental-crown procedure with Gold Standard format';

    -- 3. DENTAL BRIDGE - Gold Standard Format
    UPDATE public.procedure_library
    SET
        summary_en = E'## What This Is\n\nA dental bridge replaces one or more missing teeth by anchoring an artificial tooth (or teeth) to the natural teeth next to the gap. The bridge is permanent and cannot be removed. It fills the space, restores your ability to chew, and prevents nearby teeth from shifting.\n\n## Why You May Need It\n\n- One or more teeth missing\n- Gap causing bite problems or jaw pain\n- Difficulty chewing certain foods\n- Teeth next to the gap are shifting\n- You want a permanent solution (not removable)\n- Adjacent teeth are strong enough to support the bridge\n\nWithout treatment, nearby teeth shift into the gap, causing bite misalignment, jaw pain, and further tooth loss.',
        
        summary_es = E'## Qué Es Esto\n\nUn puente dental reemplaza uno o más dientes faltantes anclando un diente artificial (o dientes) a los dientes naturales al lado del espacio. El puente es permanente y no se puede quitar. Llena el espacio, restaura su capacidad para masticar y previene que los dientes cercanos se muevan.\n\n## Por Qué Puede Necesitarlo\n\n- Uno o más dientes faltantes\n- Espacio causando problemas de mordida o dolor de mandíbula\n- Dificultad para masticar ciertos alimentos\n- Dientes al lado del espacio se están moviendo\n- Desea una solución permanente (no removible)\n- Dientes adyacentes son lo suficientemente fuertes para soportar el puente\n\nSin tratamiento, los dientes cercanos se mueven hacia el espacio, causando desalineación de la mordida, dolor de mandíbula y mayor pérdida de dientes.',
        
        steps_en = jsonb_build_array(
            jsonb_build_object(
                'title', 'What We Do',
                'content', 'We reshape the two teeth next to the gap by removing a thin layer to make room for crowns.',
                'what_you_feel', 'The area is numb, so no pain. You''ll hear the drill but won''t feel it cutting.',
                'why_it_matters', 'These "anchor teeth" need crowns to hold the bridge in place securely.'
            ),
            jsonb_build_object(
                'title', 'What We Do',
                'content', 'We take a digital scan or mold of your teeth to design a custom bridge that fits perfectly.',
                'what_you_feel', 'No pain. The scanner moves around your mouth, or you bite into a soft tray.',
                'why_it_matters', 'This ensures the bridge fits snugly and looks natural with your other teeth.'
            ),
            jsonb_build_object(
                'title', 'What We Do',
                'content', 'We place a temporary bridge to protect the prepared teeth while your permanent bridge is being made.',
                'what_you_feel', 'Feels slightly bulky but functional. Avoid hard or sticky foods.',
                'why_it_matters', 'Keeps the prepared teeth safe and lets you chew comfortably while waiting.'
            ),
            jsonb_build_object(
                'title', 'What We Do',
                'content', 'At your second visit, we remove the temporary bridge and check the fit of the permanent one.',
                'what_you_feel', 'No pain. We make small adjustments to ensure it feels comfortable.',
                'why_it_matters', 'A proper fit prevents irritation and ensures the bridge lasts.'
            ),
            jsonb_build_object(
                'title', 'What We Do',
                'content', 'We permanently cement the bridge in place and polish it.',
                'what_you_feel', 'Slight pressure when we press it on. No pain.',
                'why_it_matters', 'The cement bonds the bridge so it won''t move or come off.'
            )
        ),
        
        steps_es = jsonb_build_array(
            jsonb_build_object(
                'title', 'Lo Que Hacemos',
                'content', 'Remodelamos los dos dientes al lado del espacio eliminando una capa delgada para hacer espacio para coronas.',
                'what_you_feel', 'El área está adormecida, así que no hay dolor. Escuchará el taladro pero no lo sentirá cortar.',
                'why_it_matters', 'Estos "dientes de anclaje" necesitan coronas para mantener el puente en su lugar de forma segura.'
            ),
            jsonb_build_object(
                'title', 'Lo Que Hacemos',
                'content', 'Tomamos un escaneo digital o molde de sus dientes para diseñar un puente personalizado que se ajuste perfectamente.',
                'what_you_feel', 'Sin dolor. El escáner se mueve alrededor de su boca, o muerde una bandeja suave.',
                'why_it_matters', 'Esto asegura que el puente se ajuste perfectamente y se vea natural con sus otros dientes.'
            ),
            jsonb_build_object(
                'title', 'Lo Que Hacemos',
                'content', 'Colocamos un puente temporal para proteger los dientes preparados mientras se hace su puente permanente.',
                'what_you_feel', 'Se siente ligeramente voluminoso pero funcional. Evite alimentos duros o pegajosos.',
                'why_it_matters', 'Mantiene los dientes preparados seguros y le permite masticar cómodamente mientras espera.'
            ),
            jsonb_build_object(
                'title', 'Lo Que Hacemos',
                'content', 'En su segunda visita, quitamos el puente temporal y verificamos el ajuste del permanente.',
                'what_you_feel', 'Sin dolor. Hacemos pequeños ajustes para asegurarnos de que se sienta cómodo.',
                'why_it_matters', 'Un ajuste adecuado previene irritación y asegura que el puente dure.'
            ),
            jsonb_build_object(
                'title', 'Lo Que Hacemos',
                'content', 'Cementamos permanentemente el puente en su lugar y lo pulimos.',
                'what_you_feel', 'Presión leve cuando lo presionamos. Sin dolor.',
                'why_it_matters', 'El cemento une el puente para que no se mueva o se caiga.'
            )
        ),
        
        time_estimate = '2-3 visits, 60-90 minutes each',
        visits_estimate = '2-3 appointments (prep + try-in + placement)',
        
        aftercare_en = E'## First 24 Hours\n- Avoid hard, sticky, or chewy foods\n- Chew on the opposite side if possible\n- Brush gently around the temporary bridge\n- No pulling motions (gum, caramels) with temporary bridge\n\n## First Week\n- Mild sensitivity to hot/cold is normal\n- Bridge should start feeling natural within 5-7 days\n- Use a floss threader or water flosser to clean under the bridge daily\n- Continue gentle brushing\n\n## Normal vs Not Normal\n**Normal:** Slight tenderness around anchor teeth, minor gum soreness\n**Not Normal:** Sharp pain when biting, swelling, bridge feels loose or high\n\n## When to Call Us\n- Bridge feels uncomfortable or high after a few days\n- Food gets stuck under the bridge frequently\n- Pain increases instead of decreasing\n- Gums around bridge are swollen or bleeding',
        
        aftercare_es = E'## Primeras 24 Horas\n- Evite alimentos duros, pegajosos o masticables\n- Mastique en el lado opuesto si es posible\n- Cepille suavemente alrededor del puente temporal\n- No haga movimientos de jalar (chicle, caramelos) con puente temporal\n\n## Primera Semana\n- Sensibilidad leve al calor/frío es normal\n- El puente debería comenzar a sentirse natural en 5-7 días\n- Use un enhebrador de hilo dental o irrigador de agua para limpiar debajo del puente diariamente\n- Continue cepillando suavemente\n\n## Normal vs No Normal\n**Normal:** Sensibilidad leve alrededor de dientes de anclaje, dolor menor en encías\n**No Normal:** Dolor agudo al morder, hinchazón, puente se siente flojo o alto\n\n## Cuándo Llamarnos\n- El puente se siente incómodo o alto después de unos días\n- La comida se queda atascada debajo del puente frecuentemente\n- El dolor aumenta en lugar de disminuir\n- Las encías alrededor del puente están hinchadas o sangrando',
        
        what_if_not_en = 'Teeth next to the gap shift and tilt into the space, causing bite problems and jaw pain. The shifting can affect teeth throughout your mouth, leading to crowding or additional tooth loss. Replacing multiple teeth later costs more than a single bridge now.',
        
        what_if_not_es = 'Los dientes al lado del espacio se mueven e inclinan hacia el espacio, causando problemas de mordida y dolor de mandíbula. El movimiento puede afectar los dientes en toda su boca, llevando a apiñamiento o pérdida adicional de dientes. Reemplazar múltiples dientes después cuesta más que un solo puente ahora.',
        
        faqs_en = jsonb_build_array(
            jsonb_build_object('q', 'How long does a bridge last?', 'a', 'With proper care, 10-15 years or longer. Daily flossing under the bridge is key.'),
            jsonb_build_object('q', 'Will it look natural?', 'a', 'Yes. We match the color and shape to your other teeth so it blends in.'),
            jsonb_build_object('q', 'Can I eat normally with it?', 'a', 'Yes, once it''s permanently placed. Avoid very hard or sticky foods.'),
            jsonb_build_object('q', 'How do I clean under the bridge?', 'a', 'Use a floss threader or water flosser daily. We''ll show you the technique.'),
            jsonb_build_object('q', 'Will the anchor teeth be damaged?', 'a', 'No. They''re protected by crowns and will function normally.'),
            jsonb_build_object('q', 'What if my temporary bridge falls off?', 'a', 'Call us right away. Keep it safe and avoid chewing on that side until we reattach it.'),
            jsonb_build_object('q', 'Is a bridge better than an implant?', 'a', 'Depends on your situation. Bridges don''t require surgery, but implants don''t affect adjacent teeth.'),
            jsonb_build_object('q', 'Will insurance cover this?', 'a', 'Most plans cover 50% if the bridge is medically necessary. We can verify your coverage.')
        ),
        
        faqs_es = jsonb_build_array(
            jsonb_build_object('q', '¿Cuánto tiempo dura un puente?', 'a', 'Con el cuidado adecuado, 10-15 años o más. Usar hilo dental diariamente debajo del puente es clave.'),
            jsonb_build_object('q', '¿Se verá natural?', 'a', 'Sí. Coincidimos con el color y la forma de sus otros dientes para que se mezcle.'),
            jsonb_build_object('q', '¿Puedo comer normalmente con él?', 'a', 'Sí, una vez que esté colocado permanentemente. Evite alimentos muy duros o pegajosos.'),
            jsonb_build_object('q', '¿Cómo limpio debajo del puente?', 'a', 'Use un enhebrador de hilo dental o irrigador de agua diariamente. Le mostraremos la técnica.'),
            jsonb_build_object('q', '¿Los dientes de anclaje se dañarán?', 'a', 'No. Están protegidos por coronas y funcionarán normalmente.'),
            jsonb_build_object('q', '¿Qué pasa si mi puente temporal se cae?', 'a', 'Llámenos de inmediato. Manténgalo seguro y evite masticar en ese lado hasta que lo volvamos a colocar.'),
            jsonb_build_object('q', '¿Es un puente mejor que un implante?', 'a', 'Depende de su situación. Los puentes no requieren cirugía, pero los implantes no afectan los dientes adyacentes.'),
            jsonb_build_object('q', '¿El seguro cubrirá esto?', 'a', 'La mayoría de los planes cubren el 50% si el puente es médicamente necesario. Podemos verificar su cobertura.')
        ),
        
        updated_at = CURRENT_TIMESTAMP
    WHERE slug = 'dental-bridge';

    RAISE NOTICE 'Updated dental-bridge procedure with Gold Standard format';

    -- 4. SCALING AND ROOT PLANING - Gold Standard Format
    UPDATE public.procedure_library
    SET
        summary_en = E'## What This Is\n\nScaling and root planing is a deep cleaning that removes hardened plaque (tartar) and bacteria from below your gum line. It treats gum disease by cleaning infected pockets and smoothing root surfaces so gums can heal and reattach to your teeth.\n\n## Why You May Need It\n\n- Gums bleed when you brush or floss\n- Gums are red, swollen, or tender\n- Bad breath that won''t go away\n- Gums pulling away from teeth (receding)\n- Teeth feel loose or shifting\n- Deep pockets measured during your cleaning (4mm or more)\n\nWithout treatment, gum disease progresses, destroying bone that supports your teeth. You could lose teeth even if they don''t have cavities.',
        
        summary_es = E'## Qué Es Esto\n\nEl raspado y alisado radicular es una limpieza profunda que elimina la placa endurecida (sarro) y las bacterias de debajo de la línea de las encías. Trata la enfermedad de las encías limpiando bolsas infectadas y alisando superficies radiculares para que las encías puedan sanar y readherirse a sus dientes.\n\n## Por Qué Puede Necesitarlo\n\n- Las encías sangran cuando se cepilla o usa hilo dental\n- Las encías están rojas, hinchadas o sensibles\n- Mal aliento que no desaparece\n- Encías que se separan de los dientes (retroceso)\n- Dientes se sienten flojos o se mueven\n- Bolsas profundas medidas durante su limpieza (4mm o más)\n\nSin tratamiento, la enfermedad de las encías progresa, destruyendo el hueso que sostiene sus dientes. Podría perder dientes aunque no tengan caries.',
        
        steps_en = jsonb_build_array(
            jsonb_build_object(
                'title', 'What We Do',
                'content', 'We measure pocket depths around each tooth to identify areas of infection.',
                'what_you_feel', 'A small instrument gently probes around your gums. Minor discomfort but no pain.',
                'why_it_matters', 'This tells us exactly where the infection is and how deep it goes.'
            ),
            jsonb_build_object(
                'title', 'What We Do',
                'content', 'We numb the area so the deep cleaning is comfortable.',
                'what_you_feel', 'A small pinch from the numbing injection, then the area goes numb.',
                'why_it_matters', 'You won''t feel the cleaning process, making it much more comfortable.'
            ),
            jsonb_build_object(
                'title', 'What We Do',
                'content', 'We use special tools to remove tartar and bacteria from deep under the gums.',
                'what_you_feel', 'Pressure and vibration but no pain. You might hear scraping sounds.',
                'why_it_matters', 'Removes the infection source so gums can heal and stop bleeding.'
            ),
            jsonb_build_object(
                'title', 'What We Do',
                'content', 'We smooth the root surfaces to help gums reattach and prevent future buildup.',
                'what_you_feel', 'More pressure and vibration. Still no pain thanks to numbing.',
                'why_it_matters', 'Smooth roots make it harder for bacteria to stick, helping gums heal.'
            ),
            jsonb_build_object(
                'title', 'What We Do',
                'content', 'We may apply an antibiotic gel in deep pockets to help fight infection.',
                'what_you_feel', 'Nothing—you won''t feel this step at all.',
                'why_it_matters', 'Kills remaining bacteria and speeds up healing.'
            )
        ),
        
        steps_es = jsonb_build_array(
            jsonb_build_object(
                'title', 'Lo Que Hacemos',
                'content', 'Medimos las profundidades de bolsas alrededor de cada diente para identificar áreas de infección.',
                'what_you_feel', 'Un instrumento pequeño sonda suavemente alrededor de sus encías. Molestia menor pero sin dolor.',
                'why_it_matters', 'Esto nos dice exactamente dónde está la infección y qué tan profunda es.'
            ),
            jsonb_build_object(
                'title', 'Lo Que Hacemos',
                'content', 'Adormecemos el área para que la limpieza profunda sea cómoda.',
                'what_you_feel', 'Un pequeño pinchazo de la inyección adormecedora, luego el área se adormece.',
                'why_it_matters', 'No sentirá el proceso de limpieza, haciéndolo mucho más cómodo.'
            ),
            jsonb_build_object(
                'title', 'Lo Que Hacemos',
                'content', 'Usamos herramientas especiales para eliminar el sarro y las bacterias de profundamente debajo de las encías.',
                'what_you_feel', 'Presión y vibración pero sin dolor. Puede escuchar sonidos de raspado.',
                'why_it_matters', 'Elimina la fuente de infección para que las encías puedan sanar y dejar de sangrar.'
            ),
            jsonb_build_object(
                'title', 'Lo Que Hacemos',
                'content', 'Alisamos las superficies radiculares para ayudar a que las encías se readhieran y prevenir futura acumulación.',
                'what_you_feel', 'Más presión y vibración. Todavía sin dolor gracias al adormecimiento.',
                'why_it_matters', 'Raíces lisas hacen más difícil que las bacterias se adhieran, ayudando a las encías a sanar.'
            ),
            jsonb_build_object(
                'title', 'Lo Que Hacemos',
                'content', 'Podemos aplicar un gel antibiótico en bolsas profundas para ayudar a combatir la infección.',
                'what_you_feel', 'Nada—no sentirá este paso en absoluto.',
                'why_it_matters', 'Mata las bacterias restantes y acelera la sanación.'
            )
        ),
        
        time_estimate = '1-2 hours (may be split over 2-4 visits)',
        visits_estimate = '1-4 appointments (depends on severity)',
        
        aftercare_en = E'## First 24 Hours\n- Gums may be tender and bleed slightly\n- Eat soft, cool foods\n- Avoid hot drinks until numbness wears off\n- Rinse gently with warm salt water (1 tsp salt per cup)\n\n## First Week\n- Brush gently twice daily with soft-bristled toothbrush\n- Use prescribed antimicrobial mouthwash if given\n- Avoid crunchy, spicy, or acidic foods\n- Floss gently once gums feel better (usually day 3-4)\n\n## Normal vs Not Normal\n**Normal:** Tender gums, slight sensitivity to cold, minor bleeding when brushing\n**Not Normal:** Severe pain, heavy bleeding, fever, pus, extreme swelling\n\n## When to Call Us\n- Pain gets worse after 3 days\n- Gums are very swollen or bleeding heavily\n- Fever or feeling sick\n- Persistent bad taste in mouth',
        
        aftercare_es = E'## Primeras 24 Horas\n- Las encías pueden estar sensibles y sangrar ligeramente\n- Coma alimentos blandos y fríos\n- Evite bebidas calientes hasta que desaparezca el adormecimiento\n- Enjuague suavemente con agua salada tibia (1 cucharadita de sal por taza)\n\n## Primera Semana\n- Cepille suavemente dos veces al día con cepillo de cerdas suaves\n- Use enjuague bucal antimicrobiano recetado si se lo dieron\n- Evite alimentos crujientes, picantes o ácidos\n- Use hilo dental suavemente una vez que las encías se sientan mejor (generalmente día 3-4)\n\n## Normal vs No Normal\n**Normal:** Encías sensibles, sensibilidad leve al frío, sangrado menor al cepillar\n**No Normal:** Dolor severo, sangrado abundante, fiebre, pus, hinchazón extrema\n\n## Cuándo Llamarnos\n- El dolor empeora después de 3 días\n- Las encías están muy hinchadas o sangrando mucho\n- Fiebre o sensación de enfermedad\n- Mal sabor persistente en la boca',
        
        what_if_not_en = 'The infection worsens, destroying more bone around your teeth. Pockets deepen, teeth loosen, and eventually fall out. Gum disease bacteria can enter your bloodstream, increasing risk of heart disease and other health problems.',
        
        what_if_not_es = 'La infección empeora, destruyendo más hueso alrededor de sus dientes. Las bolsas se profundizan, los dientes se aflojan y eventualmente se caen. Las bacterias de la enfermedad de las encías pueden entrar en su torrente sanguíneo, aumentando el riesgo de enfermedad cardíaca y otros problemas de salud.',
        
        faqs_en = jsonb_build_array(
            jsonb_build_object('q', 'Does it hurt?', 'a', 'No. The area is numb during the procedure. Gums may be tender for a few days after.'),
            jsonb_build_object('q', 'Is this a regular cleaning?', 'a', 'No. This goes deeper under the gums to treat infection. Regular cleanings are preventive.'),
            jsonb_build_object('q', 'Why do I need multiple visits?', 'a', 'We usually clean one or two sections of your mouth per visit so we can thoroughly treat each area.'),
            jsonb_build_object('q', 'Will my gums stop bleeding?', 'a', 'Yes. Once the infection is gone, healthy gums don''t bleed when you brush or floss.'),
            jsonb_build_object('q', 'Do I still need regular cleanings after?', 'a', 'Yes. Regular cleanings every 3-4 months help prevent gum disease from returning.'),
            jsonb_build_object('q', 'Can gum disease come back?', 'a', 'Yes, if you don''t brush, floss, and get regular cleanings. Home care is essential.'),
            jsonb_build_object('q', 'Will my teeth feel different after?', 'a', 'They may feel slightly sensitive for a week. This goes away as gums heal.'),
            jsonb_build_object('q', 'Is this covered by insurance?', 'a', 'Most plans cover 50-80% if diagnosed with gum disease. We can verify your coverage.')
        ),
        
        faqs_es = jsonb_build_array(
            jsonb_build_object('q', '¿Duele?', 'a', 'No. El área está adormecida durante el procedimiento. Las encías pueden estar sensibles durante algunos días después.'),
            jsonb_build_object('q', '¿Es esto una limpieza regular?', 'a', 'No. Esto va más profundo debajo de las encías para tratar la infección. Las limpiezas regulares son preventivas.'),
            jsonb_build_object('q', '¿Por qué necesito múltiples visitas?', 'a', 'Generalmente limpiamos una o dos secciones de su boca por visita para poder tratar cada área minuciosamente.'),
            jsonb_build_object('q', '¿Mis encías dejarán de sangrar?', 'a', 'Sí. Una vez que la infección desaparezca, las encías sanas no sangran cuando se cepilla o usa hilo dental.'),
            jsonb_build_object('q', '¿Todavía necesito limpiezas regulares después?', 'a', 'Sí. Las limpiezas regulares cada 3-4 meses ayudan a prevenir que la enfermedad de las encías regrese.'),
            jsonb_build_object('q', '¿Puede la enfermedad de las encías regresar?', 'a', 'Sí, si no se cepilla, usa hilo dental y obtiene limpiezas regulares. El cuidado en el hogar es esencial.'),
            jsonb_build_object('q', '¿Mis dientes se sentirán diferentes después?', 'a', 'Pueden sentirse ligeramente sensibles durante una semana. Esto desaparece a medida que las encías sanan.'),
            jsonb_build_object('q', '¿Está cubierto por el seguro?', 'a', 'La mayoría de los planes cubren el 50-80% si se diagnostica con enfermedad de las encías. Podemos verificar su cobertura.')
        ),
        
        updated_at = CURRENT_TIMESTAMP
    WHERE slug = 'scaling-root-planing';

    RAISE NOTICE 'Updated scaling-root-planing procedure with Gold Standard format';

    -- 5. SIMPLE EXTRACTION (Extractions) - Gold Standard Format
    UPDATE public.procedure_library
    SET
        summary_en = E'## What This Is\n\nA tooth extraction is the removal of a tooth that cannot be saved. This happens when a tooth is too damaged by decay, infection, or trauma to be repaired. The dentist gently loosens the tooth and removes it from the socket.\n\n## Why You May Need It\n\n- Tooth too damaged to repair with a filling or crown\n- Severe infection that root canal can''t fix\n- Tooth broken below the gum line\n- Crowding (making space for braces)\n- Baby tooth not falling out on its own\n- Gum disease causing severe bone loss around tooth\n\nWithout extraction, a badly damaged or infected tooth can cause abscess, severe pain, and spread infection to other teeth or your jaw.',
        
        summary_es = E'## Qué Es Esto\n\nUna extracción dental es la eliminación de un diente que no se puede salvar. Esto sucede cuando un diente está demasiado dañado por caries, infección o trauma para ser reparado. El dentista afloja suavemente el diente y lo elimina del alveolo.\n\n## Por Qué Puede Necesitarlo\n\n- Diente demasiado dañado para reparar con empaste o corona\n- Infección severa que el conducto no puede arreglar\n- Diente roto debajo de la línea de las encías\n- Apiñamiento (hacer espacio para frenos)\n- Diente de bebé que no se cae por sí solo\n- Enfermedad de las encías causando pérdida ósea severa alrededor del diente\n\nSin extracción, un diente gravemente dañado o infectado puede causar absceso, dolor severo y propagar infección a otros dientes o su mandíbula.',
        
        steps_en = jsonb_build_array(
            jsonb_build_object(
                'title', 'What We Do',
                'content', 'We inject numbing medication around the tooth so you won''t feel pain.',
                'what_you_feel', 'A small pinch from the needle, then the area goes completely numb within 5 minutes.',
                'why_it_matters', 'You''ll feel pressure during extraction but no sharp pain.'
            ),
            jsonb_build_object(
                'title', 'What We Do',
                'content', 'We gently rock the tooth back and forth to loosen it from the bone and ligaments.',
                'what_you_feel', 'Pressure and movement but no pain. You might hear cracking sounds (this is normal).',
                'why_it_matters', 'Loosening the tooth makes it easier to remove without damaging surrounding bone.'
            ),
            jsonb_build_object(
                'title', 'What We Do',
                'content', 'We lift the tooth out of the socket in one piece.',
                'what_you_feel', 'A pulling sensation and pressure. Still no pain.',
                'why_it_matters', 'Removing the tooth eliminates the infection and pain source.'
            ),
            jsonb_build_object(
                'title', 'What We Do',
                'content', 'We clean the empty socket and may place stitches if needed.',
                'what_you_feel', 'Nothing—you''re still numb. Stitches dissolve on their own.',
                'why_it_matters', 'Cleaning prevents infection. Stitches help the gum heal faster.'
            ),
            jsonb_build_object(
                'title', 'What We Do',
                'content', 'We place gauze over the socket and have you bite down to control bleeding.',
                'what_you_feel', 'Pressure from biting on gauze. No pain yet—numbness is still working.',
                'why_it_matters', 'Pressure helps form a blood clot that protects the socket and starts healing.'
            )
        ),
        
        steps_es = jsonb_build_array(
            jsonb_build_object(
                'title', 'Lo Que Hacemos',
                'content', 'Inyectamos medicamento adormecedor alrededor del diente para que no sienta dolor.',
                'what_you_feel', 'Un pequeño pinchazo de la aguja, luego el área se adormece completamente en 5 minutos.',
                'why_it_matters', 'Sentirá presión durante la extracción pero no dolor agudo.'
            ),
            jsonb_build_object(
                'title', 'Lo Que Hacemos',
                'content', 'Movemos suavemente el diente de un lado a otro para aflojarlo del hueso y ligamentos.',
                'what_you_feel', 'Presión y movimiento pero sin dolor. Puede escuchar sonidos de crujido (esto es normal).',
                'why_it_matters', 'Aflojar el diente hace más fácil eliminarlo sin dañar el hueso circundante.'
            ),
            jsonb_build_object(
                'title', 'Lo Que Hacemos',
                'content', 'Levantamos el diente del alveolo en una sola pieza.',
                'what_you_feel', 'Una sensación de jalar y presión. Todavía sin dolor.',
                'why_it_matters', 'Eliminar el diente elimina la fuente de infección y dolor.'
            ),
            jsonb_build_object(
                'title', 'Lo Que Hacemos',
                'content', 'Limpiamos el alveolo vacío y podemos colocar puntos de sutura si es necesario.',
                'what_you_feel', 'Nada—todavía está adormecido. Los puntos se disuelven por sí solos.',
                'why_it_matters', 'La limpieza previene infección. Los puntos ayudan a que la encía sane más rápido.'
            ),
            jsonb_build_object(
                'title', 'Lo Que Hacemos',
                'content', 'Colocamos gasa sobre el alveolo y le pedimos que muerda hacia abajo para controlar el sangrado.',
                'what_you_feel', 'Presión por morder la gasa. Todavía sin dolor—el adormecimiento sigue funcionando.',
                'why_it_matters', 'La presión ayuda a formar un coágulo de sangre que protege el alveolo y comienza la sanación.'
            )
        ),
        
        time_estimate = '20-40 minutes',
        visits_estimate = '1 appointment',
        
        aftercare_en = E'## First 24 Hours\n- Bite on gauze for 30-45 minutes to stop bleeding\n- Don''t spit, rinse, or use a straw (can dislodge clot)\n- Apply ice pack to cheek (20 min on, 20 min off)\n- Take pain medication before numbness wears off\n- Stick to soft, cool foods (yogurt, applesauce, mashed potatoes)\n- Avoid hot liquids\n\n## First Week\n- Gentle salt water rinses after 24 hours (1 tsp salt per cup)\n- Continue soft foods for 3-5 days\n- Brush other teeth normally, avoid extraction site\n- Sleep with head elevated\n- No smoking or alcohol (delays healing)\n\n## Normal vs Not Normal\n**Normal:** Bleeding stops within 1-2 hours, mild soreness, slight swelling\n**Not Normal:** Heavy bleeding after 3 hours, severe pain after day 3, fever, foul smell, extreme swelling\n\n## When to Call Us\n- Bleeding won''t stop after changing gauze 3 times\n- Severe pain that pain medication doesn''t help\n- Numbness lasts more than 12 hours\n- Fever or feeling very sick\n- Bad smell or taste from socket',
        
        aftercare_es = E'## Primeras 24 Horas\n- Muerda la gasa durante 30-45 minutos para detener el sangrado\n- No escupa, enjuague o use popote (puede desalojar el coágulo)\n- Aplique bolsa de hielo en la mejilla (20 min encendido, 20 min apagado)\n- Tome medicamento para el dolor antes de que desaparezca el adormecimiento\n- Coma alimentos blandos y fríos (yogur, puré de manzana, puré de papas)\n- Evite líquidos calientes\n\n## Primera Semana\n- Enjuagues suaves con agua salada después de 24 horas (1 cucharadita de sal por taza)\n- Continue con alimentos blandos durante 3-5 días\n- Cepille otros dientes normalmente, evite el sitio de extracción\n- Duerma con la cabeza elevada\n- No fume ni tome alcohol (retrasa la sanación)\n\n## Normal vs No Normal\n**Normal:** El sangrado se detiene en 1-2 horas, dolor leve, hinchazón ligera\n**No Normal:** Sangrado abundante después de 3 horas, dolor severo después del día 3, fiebre, mal olor, hinchazón extrema\n\n## Cuándo Llamarnos\n- El sangrado no se detiene después de cambiar gasa 3 veces\n- Dolor severo que el medicamento para el dolor no ayuda\n- El adormecimiento dura más de 12 horas\n- Fiebre o sensación de estar muy enfermo\n- Mal olor o sabor del alveolo',
        
        what_if_not_en = 'A badly infected or damaged tooth doesn''t heal on its own. The infection can form an abscess (pus-filled pocket) that causes severe pain and facial swelling. In rare cases, the infection can spread to other parts of your body, requiring emergency hospital care.',
        
        what_if_not_es = 'Un diente gravemente infectado o dañado no sana por sí solo. La infección puede formar un absceso (bolsa llena de pus) que causa dolor severo e hinchazón facial. En casos raros, la infección puede propagarse a otras partes de su cuerpo, requiriendo atención hospitalaria de emergencia.',
        
        faqs_en = jsonb_build_array(
            jsonb_build_object('q', 'Does it hurt?', 'a', 'No during the extraction—you''re numb. You''ll feel soreness for 2-3 days after as the area heals.'),
            jsonb_build_object('q', 'How long does it take to heal?', 'a', 'The socket takes about 1-2 weeks to close. Complete bone healing takes 3-6 months.'),
            jsonb_build_object('q', 'When can I eat normally?', 'a', 'Soft foods for 3-5 days. Gradually return to normal foods as comfort allows.'),
            jsonb_build_object('q', 'What is dry socket?', 'a', 'When the blood clot dislodges, exposing bone. Very painful. Call us immediately if this happens.'),
            jsonb_build_object('q', 'Can I go to work the next day?', 'a', 'Usually yes. If you have sedation, wait 24 hours before driving or operating machinery.'),
            jsonb_build_object('q', 'Should I replace the missing tooth?', 'a', 'Usually yes, to prevent other teeth from shifting. We can discuss implant, bridge, or partial denture options.'),
            jsonb_build_object('q', 'Will smoking affect healing?', 'a', 'Yes. Smoking greatly increases the risk of dry socket and delays healing. Avoid for at least 72 hours.'),
            jsonb_build_object('q', 'What about pain medication?', 'a', 'Take it before numbness wears off. Over-the-counter ibuprofen usually works well.')
        ),
        
        faqs_es = jsonb_build_array(
            jsonb_build_object('q', '¿Duele?', 'a', 'No durante la extracción—está adormecido. Sentirá dolor durante 2-3 días después mientras el área sana.'),
            jsonb_build_object('q', '¿Cuánto tiempo tarda en sanar?', 'a', 'El alveolo tarda alrededor de 1-2 semanas en cerrarse. La sanación ósea completa tarda 3-6 meses.'),
            jsonb_build_object('q', '¿Cuándo puedo comer normalmente?', 'a', 'Alimentos blandos durante 3-5 días. Regrese gradualmente a alimentos normales según lo permita la comodidad.'),
            jsonb_build_object('q', '¿Qué es el alveolo seco?', 'a', 'Cuando el coágulo de sangre se desaloja, exponiendo el hueso. Muy doloroso. Llámenos inmediatamente si esto sucede.'),
            jsonb_build_object('q', '¿Puedo ir a trabajar al día siguiente?', 'a', 'Generalmente sí. Si tiene sedación, espere 24 horas antes de conducir o operar maquinaria.'),
            jsonb_build_object('q', '¿Debería reemplazar el diente faltante?', 'a', 'Generalmente sí, para prevenir que otros dientes se muevan. Podemos discutir opciones de implante, puente o prótesis parcial.'),
            jsonb_build_object('q', '¿Fumar afectará la sanación?', 'a', 'Sí. Fumar aumenta en gran medida el riesgo de alveolo seco y retrasa la sanación. Evite durante al menos 72 horas.'),
            jsonb_build_object('q', '¿Qué pasa con el medicamento para el dolor?', 'a', 'Tómelo antes de que desaparezca el adormecimiento. El ibuprofeno de venta libre generalmente funciona bien.')
        ),
        
        updated_at = CURRENT_TIMESTAMP
    WHERE slug = 'simple-extraction';

    RAISE NOTICE 'Updated simple-extraction procedure with Gold Standard format';

    -- 6. WISDOM TEETH EDUCATION - Gold Standard Format WITH SPECIAL SECTION
    UPDATE public.procedure_library
    SET
        summary_en = E'## What This Is\n\nWisdom teeth are your third molars—the last teeth to develop, usually appearing between ages 17-25. Most people have four wisdom teeth (one in each back corner). Because modern jaws are often too small to fit them, wisdom teeth frequently cause problems and need to be removed.\n\n## Why You May Need It\n\n- Not enough room for teeth to come in properly (impaction)\n- Partially erupted teeth trapping food and bacteria\n- Crowding or pushing other teeth (though this rarely fixes overcrowding)\n- Cysts forming around impacted teeth\n- Infection around partially erupted teeth (pericoronitis)\n- Difficulty cleaning, leading to decay on the wisdom tooth or the tooth in front\n\n## Why Remove Them Even If They Don''t Hurt?\n\n### Impaction Problems\nWhen wisdom teeth are stuck under the gum or growing sideways, they can''t be cleaned properly. You might not feel pain now, but problems develop over time.\n\n### Cleaning Difficulty\nPartially erupted wisdom teeth create a flap of gum tissue that traps food and bacteria. Even with good brushing, it''s nearly impossible to keep this area clean.\n\n### Decay Risk on 2nd Molar\nImpacted wisdom teeth can cause decay on the tooth in front (your second molar). By the time you feel pain, the decay may be severe enough to require root canal treatment or extraction of that tooth too.\n\n### Gum Infection (Pericoronitis)\nThe gum flap around a partially erupted wisdom tooth gets infected repeatedly. Each infection damages more tissue and bone around both the wisdom tooth and adjacent tooth.\n\n### Cyst Formation (Brief)\nFluid-filled sacs can form around impacted wisdom teeth, slowly destroying jawbone and nerves. These usually don''t cause symptoms until they''re large.\n\n### Why Removal Is Easier When You''re Younger\nRoots aren''t fully formed in your late teens/early 20s, making extraction simpler. The bone is also less dense, so healing is faster with fewer complications. Waiting until you''re older means harder surgery and longer recovery.\n\n**Important Note About Crowding:** Research shows wisdom teeth don''t cause significant crowding of front teeth. If you had braces and your teeth are shifting, it''s usually due to not wearing your retainer, not wisdom teeth. However, removing wisdom teeth prevents other problems listed above.',
        
        summary_es = E'## Qué Es Esto\n\nLas muelas del juicio son sus terceros molares—los últimos dientes en desarrollarse, generalmente aparecen entre los 17-25 años. La mayoría de las personas tienen cuatro muelas del juicio (una en cada esquina trasera). Porque las mandíbulas modernas son a menudo demasiado pequeñas para acomodarlas, las muelas del juicio frecuentemente causan problemas y necesitan ser removidas.\n\n## Por Qué Puede Necesitarlo\n\n- No hay suficiente espacio para que los dientes salgan correctamente (impactación)\n- Dientes parcialmente erupcionados atrapando comida y bacterias\n- Apiñamiento o empuje de otros dientes (aunque esto rara vez arregla el apiñamiento)\n- Quistes formándose alrededor de dientes impactados\n- Infección alrededor de dientes parcialmente erupcionados (pericoronitis)\n- Dificultad para limpiar, llevando a caries en la muela del juicio o el diente de enfrente\n\n## ¿Por Qué Removerlas Aunque No Duelan?\n\n### Problemas de Impactación\nCuando las muelas del juicio están atascadas bajo la encía o creciendo de lado, no se pueden limpiar correctamente. Puede que no sienta dolor ahora, pero los problemas se desarrollan con el tiempo.\n\n### Dificultad de Limpieza\nLas muelas del juicio parcialmente erupcionadas crean una solapa de tejido de encía que atrapa comida y bacterias. Incluso con buen cepillado, es casi imposible mantener esta área limpia.\n\n### Riesgo de Caries en el 2do Molar\nLas muelas del juicio impactadas pueden causar caries en el diente de enfrente (su segundo molar). Para cuando sienta dolor, la caries puede ser lo suficientemente severa como para requerir tratamiento de conducto o extracción de ese diente también.\n\n### Infección de Encías (Pericoronitis)\nLa solapa de encía alrededor de una muela del juicio parcialmente erupcionada se infecta repetidamente. Cada infección daña más tejido y hueso alrededor de la muela del juicio y el diente adyacente.\n\n### Formación de Quistes (Breve)\nSacos llenos de líquido pueden formarse alrededor de muelas del juicio impactadas, destruyendo lentamente el hueso de la mandíbula y los nervios. Estos generalmente no causan síntomas hasta que son grandes.\n\n### Por Qué la Remoción es Más Fácil Cuando Eres Más Joven\nLas raíces no están completamente formadas a finales de la adolescencia/principios de los 20, haciendo la extracción más simple. El hueso también es menos denso, por lo que la sanación es más rápida con menos complicaciones. Esperar hasta que seas mayor significa cirugía más difícil y recuperación más larga.\n\n**Nota Importante Sobre Apiñamiento:** La investigación muestra que las muelas del juicio no causan apiñamiento significativo de los dientes frontales. Si tuvo frenos y sus dientes se están moviendo, generalmente se debe a no usar su retenedor, no a las muelas del juicio. Sin embargo, remover las muelas del juicio previene otros problemas listados arriba.',
        
        time_estimate = 'Educational content - varies if extraction needed',
        visits_estimate = 'Consult + extraction if needed',
        
        steps_en = jsonb_build_array(
            jsonb_build_object(
                'title', 'What Are Wisdom Teeth?',
                'content', 'Wisdom teeth are the last molars to develop, usually appearing in the late teens or early twenties. They are called "wisdom teeth" because they come in when you are older and presumably wiser.',
                'why_it_matters', 'Understanding what wisdom teeth are helps you make informed decisions about their removal.'
            ),
            jsonb_build_object(
                'title', 'Common Problems (Even Without Pain)',
                'content', 'Impaction, infection risk, decay on adjacent teeth, cyst formation, difficulty cleaning, and gum inflammation are all hidden problems that develop slowly.',
                'why_it_matters', 'These problems progress silently. By the time you feel pain, significant damage may already be done.'
            ),
            jsonb_build_object(
                'title', 'Why Earlier Removal Is Better',
                'content', 'Younger patients have shorter roots, less dense bone, and faster healing. Surgery is simpler and recovery is quicker.',
                'why_it_matters', 'Waiting makes the procedure more complicated and recovery longer. Prevention is easier than treatment.'
            ),
            jsonb_build_object(
                'title', 'What to Expect If Removal Is Needed',
                'content', 'The procedure is done with numbing or sedation for comfort. Recovery takes about 1 week with proper care.',
                'why_it_matters', 'Knowing what to expect reduces anxiety and helps you prepare.'
            )
        ),
        
        steps_es = jsonb_build_array(
            jsonb_build_object(
                'title', '¿Qué Son las Muelas del Juicio?',
                'content', 'Las muelas del juicio son los últimos molares en desarrollarse, generalmente aparecen a finales de la adolescencia o principios de los veinte. Se llaman "muelas del juicio" porque salen cuando eres mayor y presuntamente más sabio.',
                'why_it_matters', 'Entender qué son las muelas del juicio le ayuda a tomar decisiones informadas sobre su remoción.'
            ),
            jsonb_build_object(
                'title', 'Problemas Comunes (Incluso Sin Dolor)',
                'content', 'Impactación, riesgo de infección, caries en dientes adyacentes, formación de quistes, dificultad para limpiar e inflamación de encías son todos problemas ocultos que se desarrollan lentamente.',
                'why_it_matters', 'Estos problemas progresan silenciosamente. Para cuando sienta dolor, puede que ya se haya hecho un daño significativo.'
            ),
            jsonb_build_object(
                'title', 'Por Qué la Remoción Temprana Es Mejor',
                'content', 'Los pacientes más jóvenes tienen raíces más cortas, hueso menos denso y sanación más rápida. La cirugía es más simple y la recuperación es más rápida.',
                'why_it_matters', 'Esperar hace el procedimiento más complicado y la recuperación más larga. La prevención es más fácil que el tratamiento.'
            ),
            jsonb_build_object(
                'title', 'Qué Esperar Si Se Necesita Remoción',
                'content', 'El procedimiento se realiza con adormecimiento o sedación para comodidad. La recuperación toma alrededor de 1 semana con el cuidado adecuado.',
                'why_it_matters', 'Saber qué esperar reduce la ansiedad y le ayuda a prepararse.'
            )
        ),
        
        aftercare_en = E'This is educational content. If extraction is recommended, detailed aftercare instructions will be provided at that time.',
        
        aftercare_es = E'Este es contenido educativo. Si se recomienda extracción, se proporcionarán instrucciones detalladas de cuidado posterior en ese momento.',
        
        what_if_not_en = 'Problems develop slowly over time: recurring infections, decay spreading to adjacent teeth, cyst formation damaging jaw bone, and potential need for more complex surgery later. Early removal prevents these complications.',
        
        what_if_not_es = 'Los problemas se desarrollan lentamente con el tiempo: infecciones recurrentes, caries que se propagan a dientes adyacentes, formación de quistes que dañan el hueso de la mandíbula y necesidad potencial de cirugía más compleja más tarde. La remoción temprana previene estas complicaciones.',
        
        faqs_en = jsonb_build_array(
            jsonb_build_object('q', 'Why remove them if they don''t hurt?', 'a', 'Hidden problems develop silently: infection risk, decay on nearby teeth, cyst formation, and bone damage. Prevention is easier than treatment.'),
            jsonb_build_object('q', 'Will they cause crowding?', 'a', 'Research shows wisdom teeth rarely cause front teeth to shift. If you had braces and teeth are moving, it''s usually from not wearing your retainer.'),
            jsonb_build_object('q', 'Is removal harder when I''m older?', 'a', 'Yes. Younger patients have easier surgery, faster healing, and fewer complications because roots and bone aren''t fully developed yet.'),
            jsonb_build_object('q', 'What if I just watch and wait?', 'a', 'Problems may not show up for years. By then, more damage has occurred, requiring more complex treatment.'),
            jsonb_build_object('q', 'Does everyone need them removed?', 'a', 'No. If they come in straight, have room, and can be cleaned properly, they can stay. But this is rare.'),
            jsonb_build_object('q', 'How long is recovery?', 'a', 'About 1 week. Most people return to normal activities in 3-5 days.'),
            jsonb_build_object('q', 'Will I be awake during extraction?', 'a', 'You can choose: local anesthesia (awake but numb), sedation (relaxed/drowsy), or general anesthesia (asleep).'),
            jsonb_build_object('q', 'Can problems happen suddenly?', 'a', 'Yes. Pericoronitis (gum infection) can flare up quickly, causing severe pain and swelling.')
        ),
        
        faqs_es = jsonb_build_array(
            jsonb_build_object('q', '¿Por qué removerlas si no duelen?', 'a', 'Los problemas ocultos se desarrollan silenciosamente: riesgo de infección, caries en dientes cercanos, formación de quistes y daño óseo. La prevención es más fácil que el tratamiento.'),
            jsonb_build_object('q', '¿Causarán apiñamiento?', 'a', 'La investigación muestra que las muelas del juicio rara vez causan que los dientes frontales se muevan. Si tuvo frenos y los dientes se están moviendo, generalmente es por no usar su retenedor.'),
            jsonb_build_object('q', '¿Es la remoción más difícil cuando soy mayor?', 'a', 'Sí. Los pacientes más jóvenes tienen cirugía más fácil, sanación más rápida y menos complicaciones porque las raíces y el hueso no están completamente desarrollados todavía.'),
            jsonb_build_object('q', '¿Qué pasa si solo observo y espero?', 'a', 'Los problemas pueden no aparecer durante años. Para entonces, se ha producido más daño, requiriendo tratamiento más complejo.'),
            jsonb_build_object('q', '¿Todos necesitan que se las remuevan?', 'a', 'No. Si salen rectas, tienen espacio y se pueden limpiar correctamente, pueden quedarse. Pero esto es raro.'),
            jsonb_build_object('q', '¿Cuánto tiempo es la recuperación?', 'a', 'Alrededor de 1 semana. La mayoría de las personas regresan a actividades normales en 3-5 días.'),
            jsonb_build_object('q', '¿Estaré despierto durante la extracción?', 'a', 'Puede elegir: anestesia local (despierto pero adormecido), sedación (relajado/somnoliento), o anestesia general (dormido).'),
            jsonb_build_object('q', '¿Pueden los problemas suceder repentinamente?', 'a', 'Sí. La pericoronitis (infección de encías) puede aparecer rápidamente, causando dolor severo e hinchazón.')
        ),
        
        updated_at = CURRENT_TIMESTAMP
    WHERE slug = 'wisdom-teeth-education';

    RAISE NOTICE 'Updated wisdom-teeth-education procedure with Gold Standard format and special section';

    -- 7. VALPLAST EDUCATION (Flexible Partial Denture) - Gold Standard Format WITH SPECIAL REQUIREMENTS
    UPDATE public.procedure_library
    SET
        summary_en = E'## What This Is\n\nA flexible partial denture (Valplast) is a removable replacement for one or more missing teeth. It''s made from a special flexible plastic that bends slightly, making it comfortable to wear. The base is gum-colored to blend naturally, and it clips onto nearby teeth without metal clasps.\n\n## What It Replaces\n\nFlexible partials replace missing teeth in several situations:\n- One or more missing teeth on one side\n- Several missing teeth in different areas\n- When dental implants aren''t an option\n- As a temporary solution while healing from extractions\n- When you want a removable option instead of a fixed bridge\n\n## How It Stays In\n\nThe partial uses thin, flexible clasps that hug your natural teeth. Because the clasps are tooth-colored or gum-colored, they''re much less visible than metal clasps. The flexible material grips gently without damaging your teeth.\n\n## Who It''s Best For\n\n- People missing several teeth who want a removable option\n- Those allergic to metal (used in traditional partials)\n- People with sensitive gums who find rigid partials uncomfortable\n- When remaining teeth aren''t strong enough for a fixed bridge\n- When you want an affordable, aesthetic solution\n\n## Limitations vs Other Options\n\n**Compared to Dental Implants:**\n- Implants are permanent; partials are removable\n- Implants feel more like natural teeth\n- Partials are much less expensive and don''t require surgery\n\n**Compared to Fixed Bridges:**\n- Bridges are cemented in place; partials can be removed\n- Bridges require grinding down adjacent teeth\n- Partials are easier to clean and less expensive\n\n**Compared to Traditional Rigid Partials:**\n- Flexible partials are more comfortable\n- No visible metal clasps\n- Can''t be relined or adjusted as easily\n- May need replacement sooner (see lifespan below)\n\n## Expected Lifespan\n\n5-8 years with proper care. The flexible material can wear out faster than traditional rigid partials, which can last 10-15 years. However, many people prefer the comfort and appearance of flexible partials despite the shorter lifespan.',
        
        summary_es = E'## Qué Es Esto\n\nUna prótesis parcial flexible (Valplast) es un reemplazo removible para uno o más dientes faltantes. Está hecha de un plástico flexible especial que se dobla ligeramente, haciéndola cómoda de usar. La base es del color de las encías para mezclarse naturalmente, y se sujeta a los dientes cercanos sin ganchos metálicos.\n\n## Qué Reemplaza\n\nLas parciales flexibles reemplazan dientes faltantes en varias situaciones:\n- Uno o más dientes faltantes en un lado\n- Varios dientes faltantes en diferentes áreas\n- Cuando los implantes dentales no son una opción\n- Como solución temporal mientras se sana de extracciones\n- Cuando desea una opción removible en lugar de un puente fijo\n\n## Cómo Se Mantiene En Su Lugar\n\nLa parcial usa ganchos delgados y flexibles que abrazan sus dientes naturales. Porque los ganchos son del color del diente o de la encía, son mucho menos visibles que los ganchos metálicos. El material flexible se agarra suavemente sin dañar sus dientes.\n\n## Para Quién Es Mejor\n\n- Personas que faltan varios dientes y quieren una opción removible\n- Aquellos alérgicos al metal (usado en parciales tradicionales)\n- Personas con encías sensibles que encuentran parciales rígidas incómodas\n- Cuando los dientes restantes no son lo suficientemente fuertes para un puente fijo\n- Cuando desea una solución estética y asequible\n\n## Limitaciones vs Otras Opciones\n\n**Comparado con Implantes Dentales:**\n- Los implantes son permanentes; las parciales son removibles\n- Los implantes se sienten más como dientes naturales\n- Las parciales son mucho menos costosas y no requieren cirugía\n\n**Comparado con Puentes Fijos:**\n- Los puentes están cementados en su lugar; las parciales se pueden quitar\n- Los puentes requieren reducir los dientes adyacentes\n- Las parciales son más fáciles de limpiar y menos costosas\n\n**Comparado con Parciales Rígidas Tradicionales:**\n- Las parciales flexibles son más cómodas\n- No hay ganchos metálicos visibles\n- No se pueden rebasar o ajustar tan fácilmente\n- Pueden necesitar reemplazo antes (vea vida útil abajo)\n\n## Vida Útil Esperada\n\n5-8 años con el cuidado adecuado. El material flexible puede desgastarse más rápido que las parciales rígidas tradicionales, que pueden durar 10-15 años. Sin embargo, muchas personas prefieren la comodidad y apariencia de las parciales flexibles a pesar de la vida útil más corta.',
        
        time_estimate = 'Educational content - varies if fabrication needed',
        visits_estimate = '2-3 appointments (impressions + fittings)',
        
        steps_en = jsonb_build_array(
            jsonb_build_object(
                'title', 'Problem It Solves',
                'content', 'Missing teeth cause remaining teeth to shift, bite problems, difficulty chewing, and jawbone loss over time. A partial prevents these problems.',
                'why_it_matters', 'Replacing missing teeth maintains your bite, chewing ability, and prevents further tooth movement.'
            ),
            jsonb_build_object(
                'title', 'How It''s Made: Impressions',
                'content', 'We take detailed impressions (molds) of your teeth and gums using putty or a digital scanner.',
                'why_it_matters', 'Accurate impressions ensure the partial fits comfortably and looks natural.'
            ),
            jsonb_build_object(
                'title', 'How It''s Made: Lab Fabrication',
                'content', 'A dental lab custom-makes your partial using the impressions. This takes 2-3 weeks.',
                'why_it_matters', 'Custom fabrication ensures proper fit, appearance, and comfort.'
            ),
            jsonb_build_object(
                'title', 'How It''s Made: Final Fitting',
                'content', 'At your final appointment, we place the partial and make any needed adjustments for comfort.',
                'why_it_matters', 'A proper fit prevents sore spots and ensures the partial stays in place when you chew.'
            )
        ),
        
        steps_es = jsonb_build_array(
            jsonb_build_object(
                'title', 'Problema Que Resuelve',
                'content', 'Los dientes faltantes causan que los dientes restantes se muevan, problemas de mordida, dificultad para masticar y pérdida de hueso de la mandíbula con el tiempo. Una parcial previene estos problemas.',
                'why_it_matters', 'Reemplazar los dientes faltantes mantiene su mordida, capacidad de masticar y previene mayor movimiento de dientes.'
            ),
            jsonb_build_object(
                'title', 'Cómo Se Hace: Impresiones',
                'content', 'Tomamos impresiones detalladas (moldes) de sus dientes y encías usando masilla o un escáner digital.',
                'why_it_matters', 'Las impresiones precisas aseguran que la parcial se ajuste cómodamente y se vea natural.'
            ),
            jsonb_build_object(
                'title', 'Cómo Se Hace: Fabricación en Laboratorio',
                'content', 'Un laboratorio dental hace su parcial a medida usando las impresiones. Esto toma 2-3 semanas.',
                'why_it_matters', 'La fabricación personalizada asegura ajuste, apariencia y comodidad adecuados.'
            ),
            jsonb_build_object(
                'title', 'Cómo Se Hace: Ajuste Final',
                'content', 'En su cita final, colocamos la parcial y hacemos cualquier ajuste necesario para comodidad.',
                'why_it_matters', 'Un ajuste adecuado previene puntos dolorosos y asegura que la parcial se mantenga en su lugar cuando mastica.'
            )
        ),
        
        aftercare_en = E'## Daily Care\n\n**Cleaning:**\n- Remove and rinse after every meal\n- Brush with soft toothbrush and non-abrasive cleanser (NOT toothpaste—it''s too scratchy)\n- Soak overnight in denture cleanser\n- Rinse thoroughly before wearing again\n\n**What NOT to Do:**\n- Don''t use hot water (warps the material)\n- Don''t use toothpaste (scratches the surface)\n- Don''t use bleach or harsh chemicals\n- Don''t try to adjust it yourself\n- Don''t sleep with it in (give your gums a rest)\n\n## Adjustment Period\n\nExpect 2-4 weeks to get used to wearing it:\n- May feel bulky at first\n- Speaking might sound different for a few days\n- Increased saliva production (temporary)\n- Practice eating soft foods first\n- Remove if it causes sore spots; call us for adjustment\n\n## When to Call Us\n- Persistent sore spots after 1 week\n- Partial feels loose or doesn''t stay in place\n- Clasps break or come loose\n- Cracks or chips appear\n- Fit changes significantly (may indicate bone loss)',
        
        aftercare_es = E'## Cuidado Diario\n\n**Limpieza:**\n- Quitar y enjuagar después de cada comida\n- Cepillar con cepillo de cerdas suaves y limpiador no abrasivo (NO pasta de dientes—es demasiado áspera)\n- Remojar durante la noche en limpiador de dentaduras\n- Enjuagar completamente antes de usar de nuevo\n\n**Qué NO Hacer:**\n- No use agua caliente (deforma el material)\n- No use pasta de dientes (raya la superficie)\n- No use lejía o químicos fuertes\n- No intente ajustarla usted mismo\n- No duerma con ella puesta (dé un descanso a sus encías)\n\n## Período de Ajuste\n\nEspere 2-4 semanas para acostumbrarse a usarla:\n- Puede sentirse voluminosa al principio\n- Hablar puede sonar diferente durante algunos días\n- Producción aumentada de saliva (temporal)\n- Practique comer alimentos blandos primero\n- Quítela si causa puntos dolorosos; llámenos para ajuste\n\n## Cuándo Llamarnos\n- Puntos dolorosos persistentes después de 1 semana\n- La parcial se siente floja o no se mantiene en su lugar\n- Los ganchos se rompen o se aflojan\n- Aparecen grietas o astillas\n- El ajuste cambia significativamente (puede indicar pérdida ósea)',
        
        what_if_not_en = 'Without replacing missing teeth, remaining teeth shift and tilt into the gaps, causing bite problems and jaw pain. The jawbone in the gap area slowly shrinks (resorbs), making future tooth replacement more difficult and expensive. Chewing becomes harder, affecting nutrition.',
        
        what_if_not_es = 'Sin reemplazar los dientes faltantes, los dientes restantes se mueven e inclinan hacia los espacios, causando problemas de mordida y dolor de mandíbula. El hueso de la mandíbula en el área del espacio se encoge lentamente (resorbe), haciendo el reemplazo futuro de dientes más difícil y costoso. Masticar se vuelve más difícil, afectando la nutrición.',
        
        faqs_en = jsonb_build_array(
            jsonb_build_object('q', 'Will people notice I''m wearing it?', 'a', 'No. The gum-colored base and tooth-colored clasps blend naturally. Most people can''t tell you''re wearing one.'),
            jsonb_build_object('q', 'Can I eat normally with it?', 'a', 'Yes, but start with soft foods for the first week. Avoid very hard or sticky foods that could dislodge it.'),
            jsonb_build_object('q', 'Do I need to remove it to sleep?', 'a', 'Yes. Removing it at night gives your gums a rest and allows proper saliva flow to keep your mouth healthy.'),
            jsonb_build_object('q', 'How do I clean it?', 'a', 'Brush with soft toothbrush and non-abrasive cleanser. Soak overnight in denture cleanser. Never use toothpaste or hot water.'),
            jsonb_build_object('q', 'What if it breaks?', 'a', 'Call us immediately. Some repairs are possible, but cracks often require replacement. Don''t try to fix it with glue.'),
            jsonb_build_object('q', 'How long does it last?', 'a', '5-8 years with proper care. The flexible material wears out faster than rigid partials.'),
            jsonb_build_object('q', 'Can it be adjusted if my mouth changes?', 'a', 'Minor adjustments are possible, but flexible partials can''t be relined like rigid ones. Significant changes may require a new partial.'),
            jsonb_build_object('q', 'Is it covered by insurance?', 'a', 'Most plans cover 50% of partial dentures. We can verify your specific coverage.')
        ),
        
        faqs_es = jsonb_build_array(
            jsonb_build_object('q', '¿La gente notará que la estoy usando?', 'a', 'No. La base del color de la encía y los ganchos del color del diente se mezclan naturalmente. La mayoría de la gente no puede decir que la está usando.'),
            jsonb_build_object('q', '¿Puedo comer normalmente con ella?', 'a', 'Sí, pero comience con alimentos blandos durante la primera semana. Evite alimentos muy duros o pegajosos que puedan desalojarla.'),
            jsonb_build_object('q', '¿Necesito quitarla para dormir?', 'a', 'Sí. Quitarla por la noche da un descanso a sus encías y permite el flujo apropiado de saliva para mantener su boca saludable.'),
            jsonb_build_object('q', '¿Cómo la limpio?', 'a', 'Cepille con cepillo de cerdas suaves y limpiador no abrasivo. Remoje durante la noche en limpiador de dentaduras. Nunca use pasta de dientes o agua caliente.'),
            jsonb_build_object('q', '¿Qué pasa si se rompe?', 'a', 'Llámenos inmediatamente. Algunas reparaciones son posibles, pero las grietas a menudo requieren reemplazo. No intente arreglarla con pegamento.'),
            jsonb_build_object('q', '¿Cuánto tiempo dura?', 'a', '5-8 años con el cuidado adecuado. El material flexible se desgasta más rápido que las parciales rígidas.'),
            jsonb_build_object('q', '¿Se puede ajustar si mi boca cambia?', 'a', 'Los ajustes menores son posibles, pero las parciales flexibles no se pueden rebasar como las rígidas. Los cambios significativos pueden requerir una nueva parcial.'),
            jsonb_build_object('q', '¿Está cubierta por el seguro?', 'a', 'La mayoría de los planes cubren el 50% de dentaduras parciales. Podemos verificar su cobertura específica.')
        ),
        
        updated_at = CURRENT_TIMESTAMP
    WHERE slug = 'valplast-education';

    RAISE NOTICE 'Updated valplast-education procedure with Gold Standard format and special requirements';

    RAISE NOTICE 'Successfully updated all 7 procedures with Gold Standard Patient Education Format';
    RAISE NOTICE 'Updated: root-canal, dental-crown, dental-bridge, scaling-root-planing, simple-extraction, wisdom-teeth-education, valplast-education';

END $$;
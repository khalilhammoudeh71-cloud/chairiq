-- Location: supabase/migrations/20251230024935_improve_clinical_content_gold_standard_v2.sql
-- Schema Analysis: Updating procedure_library table (existing)
-- Integration Type: modification/enhancement
-- Dependencies: procedure_library table

-- =====================================================
-- IMPROVE CLINICAL TEXT CONTENT - GOLD STANDARD FORMAT
-- =====================================================
-- This migration ONLY updates text content columns
-- NO changes to visuals, images, or UI-related data
-- Follows Gold Standard Patient Education Format
-- 6th-8th grade reading level throughout
-- =====================================================

-- Update Root Canal Treatment
UPDATE public.procedure_library
SET
  summary_en = E'## What this is\n\nA root canal treatment removes infected tissue from inside your tooth to save it. When the soft center of your tooth (called the pulp) gets infected or damaged, it needs to be cleaned out. We remove the infected part, clean the inside of your tooth, seal it, and protect it with a crown. This lets you keep your natural tooth instead of pulling it out.\n\n## Why you may need it\n\nYou may need a root canal if:\n- You have a deep cavity that reached the nerve\n- A crack in your tooth let bacteria get inside\n- You had trauma or injury to the tooth\n- An old filling failed and bacteria got in\n- You feel severe pain when chewing or touching the tooth\n- Your tooth is very sensitive to hot or cold that lingers\n- You see swelling or a pimple on your gum near the tooth',
  
  why_en = E'## Why you may need it\n\nRoot canal treatment saves your natural tooth when the inside gets infected or damaged. Common reasons include:\n\n**Deep decay**: A cavity that went untreated and reached the nerve inside your tooth\n\n**Crack or chip**: A break in the tooth that let bacteria enter the pulp chamber\n\n**Repeated dental work**: Multiple fillings or procedures on the same tooth can irritate the nerve\n\n**Trauma**: An injury or blow to the tooth, even if it happened years ago\n\n**Infection signs**: Severe pain, prolonged sensitivity to temperature, gum swelling, or a pimple-like bump on your gum',
  
  steps_en = jsonb_build_array(
    jsonb_build_object(
      'title', 'Step 1: Numbing',
      'description', E'**What we do**: We numb the area around your tooth so you will not feel pain during treatment\n\n**What you may feel**: A small pinch from the numbing shot, then the area goes numb in a few minutes\n\n**Why it matters**: Complete numbness means you stay comfortable while we work'
    ),
    jsonb_build_object(
      'title', 'Step 2: Access opening',
      'description', E'**What we do**: We make a small opening in the top of your tooth to reach the infected pulp inside\n\n**What you may feel**: Pressure or vibration, but no pain because you are numb\n\n**Why it matters**: This opening lets us remove the infected tissue and clean the inside of your tooth'
    ),
    jsonb_build_object(
      'title', 'Step 3: Cleaning the canals',
      'description', E'**What we do**: We carefully remove all the infected pulp and clean the inside channels (canals) of your tooth with special tools\n\n**What you may feel**: Slight pressure as we work, sometimes a faint sound of water or tools\n\n**Why it matters**: Removing all bacteria prevents the infection from coming back'
    ),
    jsonb_build_object(
      'title', 'Step 4: Sealing',
      'description', E'**What we do**: We fill the cleaned canals with a rubber-like material and seal the opening\n\n**What you may feel**: Mild pressure as we pack the material in\n\n**Why it matters**: Sealing keeps bacteria from getting back inside your tooth'
    ),
    jsonb_build_object(
      'title', 'Step 5: Crown placement (second visit)',
      'description', E'**What we do**: After your tooth heals, we place a crown (cap) over it to protect and strengthen it\n\n**What you may feel**: A small amount of pressure as we fit and cement the crown\n\n**Why it matters**: The crown protects your tooth so it can last for many years'
    )
  ),
  
  time_estimate = '1-2 visits, 60-90 minutes each',
  visits_estimate = '2 appointments (root canal + crown placement)',
  
  what_if_not_en = E'## If you delay\n\nDelaying a root canal can cause serious problems:\n\n**Pain gets worse**: The infection spreads and causes more severe, constant pain\n\n**Swelling and abscess**: Infection can form a pocket of pus (abscess) that swells your face or jaw\n\n**Bone loss**: The infection spreads to the bone around your tooth root, weakening it\n\n**Tooth loss**: Eventually the tooth cannot be saved and must be pulled out\n\n**Infection spread**: In rare cases, the infection can spread to other parts of your head or body\n\n**More expensive treatment**: Replacing a lost tooth with an implant or bridge costs more than saving it with a root canal',
  
  aftercare_en = E'## What to expect after\n\n### First 24 hours\n- Take pain medication before the numbness wears off to stay ahead of discomfort\n- Some soreness around the tooth is normal and should improve in a few days\n- Avoid chewing on that side until you get your permanent crown\n- Eat soft foods and avoid very hot or cold items\n- Do not smoke or use straws (suction can disturb healing)\n\n### First week\n- Brush and floss gently around the treated tooth\n- Continue taking any prescribed antibiotics until finished, even if you feel better\n- Mild sensitivity when you bite down is normal and fades within a week or two\n- Use warm salt water rinses (1 teaspoon salt in 8 oz warm water) 2-3 times daily to soothe gums\n- Return for your crown appointment as scheduled (usually 2-3 weeks later)\n\n### Normal vs not normal\n\n**Normal**:\n- Mild to moderate soreness for 3-5 days\n- Slight sensitivity when chewing\n- Gum tenderness near the tooth\n- Feeling tired after the procedure\n\n**Not normal - call us if you notice**:\n- Severe pain that gets worse after 2-3 days\n- Swelling that increases or spreads to your face or neck\n- Fever over 100°F\n- The temporary filling falls out\n- Your bite feels very uneven or uncomfortable\n- Numbness that lasts more than 4 hours after leaving our office\n\n### When to call us\n\nCall our office right away if you experience any "not normal" symptoms listed above, or if you have questions or concerns about your healing.',
  
  faqs_en = jsonb_build_array(
    jsonb_build_object(
      'q', 'Will it hurt during the root canal?',
      'a', 'No. The area is numbed thoroughly so you should not feel pain. Most patients say it feels similar to getting a regular filling.'
    ),
    jsonb_build_object(
      'q', 'How long does a root canal take?',
      'a', 'Usually 60 to 90 minutes, depending on which tooth it is. Front teeth are faster, back molars take longer because they have more roots.'
    ),
    jsonb_build_object(
      'q', 'Will my tooth be weak after a root canal?',
      'a', 'The tooth can become slightly more brittle over time, which is why we place a crown on top to protect it. With a crown, your tooth can function normally for many years.'
    ),
    jsonb_build_object(
      'q', 'Can the infection come back?',
      'a', 'It is very rare if the procedure is done properly. We clean and seal the tooth thoroughly to prevent bacteria from getting back inside.'
    ),
    jsonb_build_object(
      'q', 'Do I really need a crown after the root canal?',
      'a', 'Yes, in most cases. The crown protects your tooth from breaking and helps it last much longer. Without a crown, the tooth is more likely to crack or fail.'
    ),
    jsonb_build_object(
      'q', 'Can I eat normally after a root canal?',
      'a', 'Avoid chewing on that side for the first few days and until you get your permanent crown. Stick to soft foods initially, then return to normal eating once the crown is placed.'
    ),
    jsonb_build_object(
      'q', 'What if I wait to get the crown?',
      'a', 'Do not delay. The temporary filling is not strong and the tooth can break or get re-infected. Schedule your crown appointment within 2-3 weeks.'
    ),
    jsonb_build_object(
      'q', 'Is pulling the tooth a better option than root canal?',
      'a', 'Saving your natural tooth is almost always better. A root canal with a crown costs less than replacing a missing tooth with an implant or bridge, and your natural tooth works better.'
    ),
    jsonb_build_object(
      'q', 'Will I need antibiotics?',
      'a', 'Sometimes, if there is an active infection or swelling. Your dentist will let you know if antibiotics are needed.'
    ),
    jsonb_build_object(
      'q', 'How long will the tooth last after a root canal?',
      'a', 'With good care and a crown, a root canal tooth can last as long as your other teeth - often 10 to 20 years or more.'
    ),
    jsonb_build_object(
      'q', 'Can I drive myself home after the procedure?',
      'a', 'Yes, you can drive home. We use local anesthesia, not sedation, so you will be alert and able to drive.'
    ),
    jsonb_build_object(
      'q', 'What if the tooth still hurts after a root canal?',
      'a', 'Some soreness is normal for a few days. If pain gets worse or lasts more than a week, call us so we can check it.'
    )
  ),
  
  updated_at = CURRENT_TIMESTAMP
WHERE slug = 'root-canal';

-- Update Dental Crown
UPDATE public.procedure_library
SET
  summary_en = E'## What this is\n\nA dental crown is a tooth-shaped cover that fits over your damaged or weakened tooth. Think of it like a protective cap that looks and works just like a real tooth. We custom-make the crown to match the size, shape, and color of your other teeth. It covers the entire visible part of the tooth down to the gum line, giving you back a strong, natural-looking tooth.\n\n## Why you may need it\n\nYou may need a crown if:\n- You have a large cavity or filling that weakened the tooth structure\n- Your tooth cracked or broke and needs protection\n- You had a root canal (crowns protect the treated tooth)\n- Your tooth is worn down from grinding or acid erosion\n- You want to improve the look of a badly shaped or discolored tooth\n- You need to anchor a dental bridge to replace missing teeth',
  
  why_en = E'## Why you may need it\n\nA crown protects and strengthens your tooth when it is too damaged for a regular filling. Common reasons include:\n\n**Large cavities**: When decay is too big for a filling and the tooth walls are thin and weak\n\n**Cracked or broken tooth**: A crack that goes through the tooth or a large piece that broke off\n\n**After root canal**: The tooth becomes brittle after a root canal and needs protection from breaking\n\n**Worn teeth**: Teeth worn down from grinding, clenching, or acid that dissolves enamel\n\n**Old large fillings**: When an old filling is so big that not much natural tooth is left\n\n**Cosmetic improvement**: Badly shaped, discolored, or uneven teeth that cannot be fixed with whitening or bonding\n\n**Bridge support**: To hold a bridge that replaces missing teeth',
  
  steps_en = jsonb_build_array(
    jsonb_build_object(
      'title', 'Step 1: Tooth preparation (first visit)',
      'description', E'**What we do**: We numb the tooth, then shape it by removing some enamel so the crown fits properly\n\n**What you may feel**: Numbness from anesthesia, then pressure and vibration as we shape the tooth\n\n**Why it matters**: Shaping the tooth creates space for the crown to fit comfortably without making your bite feel too high'
    ),
    jsonb_build_object(
      'title', 'Step 2: Impression or digital scan',
      'description', E'**What we do**: We take a mold or digital scan of your prepared tooth and the teeth around it\n\n**What you may feel**: A tray with soft putty in your mouth for a minute or two, or a small camera scanning your teeth\n\n**Why it matters**: This gives the lab exact measurements to make a crown that fits perfectly'
    ),
    jsonb_build_object(
      'title', 'Step 3: Temporary crown placement',
      'description', E'**What we do**: We place a temporary plastic crown over your tooth to protect it while the permanent one is being made\n\n**What you may feel**: Mild pressure as we fit and cement the temporary crown\n\n**Why it matters**: The temporary keeps your tooth safe and lets you chew while waiting for your permanent crown (usually 2-3 weeks)'
    ),
    jsonb_build_object(
      'title', 'Step 4: Permanent crown placement (second visit)',
      'description', E'**What we do**: We remove the temporary crown, check the fit and color of the permanent crown, and cement it in place\n\n**What you may feel**: Pressure as we check the fit and bite, then secure the crown\n\n**Why it matters**: Cementing the crown permanently bonds it to your tooth so it can last for many years'
    )
  ),
  
  time_estimate = '2 visits, 60-90 minutes each',
  visits_estimate = '2 appointments (prep + placement)',
  
  what_if_not_en = E'## If you delay\n\nDelaying a crown when it is recommended can lead to problems:\n\n**Tooth breaks further**: Weak or cracked teeth can break while eating, especially hard or sticky foods\n\n**Infection risk**: Cracks or gaps let bacteria enter, causing decay or infection inside the tooth\n\n**Pain and sensitivity**: Exposed tooth structure becomes painful with temperature changes or pressure\n\n**More expensive repair**: A tooth that breaks badly may need a root canal or even extraction and replacement, which costs much more\n\n**Changes in your bite**: Nearby teeth can shift into the space, making it harder to fit a crown later\n\n**Tooth loss**: If damage or infection gets too severe, the tooth cannot be saved',
  
  aftercare_en = E'## What to expect after\n\n### First 24 hours\n- Avoid sticky, hard, or chewy foods that can dislodge the temporary crown (if you have one)\n- Chew on the other side of your mouth until the permanent crown is placed\n- Brush and floss gently around the crowned tooth\n- Some sensitivity to temperature is normal and usually goes away in a few days\n- If your temporary crown feels loose or falls off, call us right away\n\n### First week\n- Permanent crown: Your bite may feel slightly different at first as you get used to it\n- If your bite feels high or uncomfortable, let us know so we can adjust it\n- Mild gum soreness around the crown is normal and fades quickly\n- Continue normal brushing and flossing, including around the crown\n- Avoid very hard foods like ice, hard candy, or popcorn kernels for the first few days\n\n### Normal vs not normal\n\n**Normal**:\n- Slight temperature sensitivity for a few days\n- Gum tenderness near the new crown\n- Feeling the crown with your tongue (you will get used to it)\n- Minor adjustment period with chewing on that side\n\n**Not normal - call us if you notice**:\n- Severe pain when biting down\n- The crown feels loose or moves\n- Swelling or a bad taste near the crown\n- Your bite feels very uneven or uncomfortable after a few days\n- Prolonged sharp sensitivity to hot or cold (more than a week)\n- The temporary crown falls off or cracks\n\n### When to call us\n\nCall our office if you experience any "not normal" symptoms, if your temporary falls off, or if you need a bite adjustment on your permanent crown.',
  
  faqs_en = jsonb_build_array(
    jsonb_build_object(
      'q', 'How long do crowns last?',
      'a', 'With proper care, crowns typically last 10 to 15 years or longer. Good oral hygiene and avoiding very hard foods help them last.'
    ),
    jsonb_build_object(
      'q', 'Will the crown look natural?',
      'a', 'Yes. We match the color and shape to your other teeth so it blends in naturally. Most people cannot tell which tooth has a crown.'
    ),
    jsonb_build_object(
      'q', 'Does getting a crown hurt?',
      'a', 'No. We numb the area so you should not feel pain. You may feel pressure or hear sounds during the prep, but it should not hurt.'
    ),
    jsonb_build_object(
      'q', 'Can I eat normally with a crown?',
      'a', 'Yes. Once the permanent crown is in place and you are used to it, you can eat most foods normally. Avoid chewing ice or very hard items that can crack any tooth.'
    ),
    jsonb_build_object(
      'q', 'What if my temporary crown falls off?',
      'a', 'Call us right away. Keep the temporary safe and avoid chewing on that side. We will get you in quickly to reattach it or make a new one.'
    ),
    jsonb_build_object(
      'q', 'Why does it take two visits?',
      'a', 'The permanent crown is custom-made in a lab to fit your tooth perfectly. This takes about 2 to 3 weeks. We place a temporary crown so you can function normally while you wait.'
    ),
    jsonb_build_object(
      'q', 'Can a crown get a cavity?',
      'a', 'The crown itself cannot decay, but the tooth underneath can if plaque builds up around the edge. Brush and floss daily to keep the gum line clean.'
    ),
    jsonb_build_object(
      'q', 'What is a crown made of?',
      'a', 'Most crowns today are made of porcelain or ceramic because they look natural. Back teeth may use porcelain fused to metal for extra strength.'
    ),
    jsonb_build_object(
      'q', 'Will I need a root canal with my crown?',
      'a', 'Not usually. Most crowns do not need root canals unless the tooth is already infected or damaged inside. Sometimes a root canal is done before placing a crown to save a badly damaged tooth.'
    ),
    jsonb_build_object(
      'q', 'How do I care for my crown?',
      'a', 'Treat it like a natural tooth. Brush twice a day, floss daily, and see us for regular checkups. Avoid chewing ice or very hard foods.'
    ),
    jsonb_build_object(
      'q', 'Can I whiten a crown?',
      'a', 'No. Crowns do not change color with whitening treatments. If you want whiter teeth, do the whitening before getting a crown so we can match the new shade.'
    ),
    jsonb_build_object(
      'q', 'What if my crown breaks?',
      'a', 'Call us right away. Depending on the damage, we may be able to repair it or we may need to make a new crown.'
    )
  ),
  
  updated_at = CURRENT_TIMESTAMP
WHERE slug = 'dental-crown';

-- Update Bridge
UPDATE public.procedure_library
SET
  summary_en = E'## What this is\n\nA dental bridge is a false tooth (or teeth) that fills the gap where you are missing one or more teeth. It is called a bridge because it literally bridges the space between two teeth. The bridge attaches to the teeth on either side of the gap. These supporting teeth are called abutments, and we place crowns on them to hold the bridge in place. The false tooth in the middle is called a pontic. Once cemented, the bridge looks and works like your natural teeth.\n\n## Why you may need it\n\nYou may need a bridge if:\n- You are missing one or more teeth and want a permanent solution\n- You have healthy, strong teeth on both sides of the gap\n- You want to avoid the cost or surgery of dental implants\n- You need to restore your ability to chew properly\n- You want to improve your smile and speech\n- You want to prevent nearby teeth from shifting into the gap',
  
  why_en = E'## Why you may need it\n\nA bridge replaces missing teeth and prevents problems that come from leaving gaps. Common reasons include:\n\n**Missing teeth**: You lost one or more teeth due to decay, gum disease, injury, or extraction\n\n**Chewing problems**: The gap makes it hard to eat certain foods comfortably\n\n**Speech issues**: Missing teeth can affect how you pronounce some words\n\n**Shifting teeth**: Nearby teeth start to tilt or move into the empty space, changing your bite\n\n**Appearance**: You want to restore your smile and facial support\n\n**Prevent bone loss**: Replacing the tooth root area helps slow bone loss in your jaw\n\n**Alternative to implants**: You prefer a faster, less invasive option than dental implants, or you cannot have implant surgery',
  
  steps_en = jsonb_build_array(
    jsonb_build_object(
      'title', 'Step 1: Preparing the abutment teeth (first visit)',
      'description', E'**What we do**: We numb the area, then shape the teeth on both sides of the gap so crowns can fit over them\n\n**What you may feel**: Numbness from anesthesia, then pressure and vibration as we prepare the teeth\n\n**Why it matters**: These shaped teeth will support and anchor your bridge securely'
    ),
    jsonb_build_object(
      'title', 'Step 2: Taking impressions or scans',
      'description', E'**What we do**: We take a mold or digital scan of your prepared teeth and the gap\n\n**What you may feel**: A tray with putty in your mouth for a minute or two, or a small camera scanning your teeth\n\n**Why it matters**: This creates an exact model so the lab can make a bridge that fits perfectly'
    ),
    jsonb_build_object(
      'title', 'Step 3: Temporary bridge placement',
      'description', E'**What we do**: We place a temporary bridge to protect your prepared teeth and fill the gap while the permanent bridge is being made\n\n**What you may feel**: Pressure as we fit and secure the temporary bridge\n\n**Why it matters**: The temporary keeps you comfortable and looking normal for the 2-3 weeks it takes to make your permanent bridge'
    ),
    jsonb_build_object(
      'title', 'Step 4: Permanent bridge placement (second visit)',
      'description', E'**What we do**: We remove the temporary, check the fit, color, and bite of the permanent bridge, and cement it in place\n\n**What you may feel**: Pressure during fitting and cementing, but no pain\n\n**Why it matters**: Permanent cementation bonds the bridge so it functions like natural teeth for many years'
    )
  ),
  
  time_estimate = '2 visits, 60-90 minutes each',
  visits_estimate = '2 appointments (prep + placement)',
  
  what_if_not_en = E'## If you delay\n\nLeaving gaps from missing teeth can cause serious problems:\n\n**Teeth shift and tilt**: Nearby teeth move into the empty space, making your bite uneven and harder to fix later\n\n**Jaw problems**: A shifted bite can lead to jaw pain, clicking, or trouble opening your mouth\n\n**Bone loss**: The jawbone where the tooth is missing starts to shrink over time because it is not being used\n\n**Chewing difficulty**: You may avoid certain foods or chew unevenly, causing wear on other teeth\n\n**Speech changes**: Missing teeth can make it harder to pronounce certain sounds clearly\n\n**More costly treatment**: If teeth shift significantly, you may need braces or more complex procedures before placing a bridge or implant',
  
  aftercare_en = E'## What to expect after\n\n### First 24 hours\n- Avoid sticky, hard, or chewy foods that can dislodge your temporary bridge (if you have one)\n- Chew on the opposite side of your mouth until your permanent bridge is placed\n- Brush and floss carefully around the bridge area\n- Some gum soreness is normal and usually goes away in a day or two\n- If your temporary bridge feels loose or falls off, call us immediately\n\n### First week\n- Permanent bridge: Your bite may feel slightly different as you adjust to it\n- Brush the bridge like natural teeth, focusing on the area where it meets your gums\n- Use a floss threader or water flosser to clean under the pontic (false tooth) daily\n- Mild sensitivity to temperature may occur but should fade within a few days\n- If your bite feels high or uncomfortable, let us know so we can adjust it\n\n### Normal vs not normal\n\n**Normal**:\n- Slight gum tenderness around the bridge for a few days\n- Getting used to the feel of the bridge in your mouth\n- Minor temperature sensitivity that improves\n- Adjusting to chewing on that side again\n\n**Not normal - call us if you notice**:\n- Severe pain when biting down\n- The bridge feels loose or moves\n- Persistent bad taste or smell near the bridge\n- Swelling or bleeding around the bridge area\n- Your bite feels very uneven after a few days\n- Sharp sensitivity that does not improve\n\n### When to call us\n\nCall our office if you experience any "not normal" symptoms, if your temporary bridge falls off, or if you need a bite adjustment.',
  
  faqs_en = jsonb_build_array(
    jsonb_build_object(
      'q', 'How long does a bridge last?',
      'a', 'With good care, a bridge can last 10 to 15 years or more. Daily cleaning and regular checkups help it last longer.'
    ),
    jsonb_build_object(
      'q', 'Will a bridge look natural?',
      'a', 'Yes. We match the color, shape, and size to your other teeth so it blends in seamlessly. Most people will not notice you have a bridge.'
    ),
    jsonb_build_object(
      'q', 'Can I eat normally with a bridge?',
      'a', 'Yes. Once you get used to it, you can eat most foods comfortably. Avoid very hard or sticky foods that can damage the bridge.'
    ),
    jsonb_build_object(
      'q', 'How do I clean under the bridge?',
      'a', 'Use a floss threader, interdental brush, or water flosser to clean under the pontic (false tooth) every day. This prevents gum disease and keeps the area healthy.'
    ),
    jsonb_build_object(
      'q', 'Does getting a bridge hurt?',
      'a', 'No. We numb the area so you should not feel pain. You may feel pressure during the prep, but it should not hurt. Some soreness afterward is normal and fades quickly.'
    ),
    jsonb_build_object(
      'q', 'Why not just get an implant instead?',
      'a', 'Bridges are faster, less invasive, and cost less than implants. They are a good option if you have healthy teeth on both sides of the gap and prefer to avoid surgery.'
    ),
    jsonb_build_object(
      'q', 'What if my temporary bridge falls off?',
      'a', 'Call us right away. Keep the temporary safe and avoid chewing on that side. We will reattach it or make a new one quickly.'
    ),
    jsonb_build_object(
      'q', 'Can the supporting teeth get cavities?',
      'a', 'Yes. The natural teeth under the crowns can still decay if plaque builds up around the edges. Brush and floss daily to keep them healthy.'
    ),
    jsonb_build_object(
      'q', 'Will the bridge feel bulky?',
      'a', 'At first, it may feel a bit different, but most people adjust within a few days. If it feels too bulky or uncomfortable, let us know so we can make adjustments.'
    ),
    jsonb_build_object(
      'q', 'What is a bridge made of?',
      'a', 'Most bridges are made of porcelain or ceramic fused to a metal base for strength. This combination looks natural and lasts a long time.'
    ),
    jsonb_build_object(
      'q', 'Can a bridge be replaced if it breaks?',
      'a', 'Yes. If a bridge breaks or fails, we can make a new one. Call us right away if you notice any damage or looseness.'
    ),
    jsonb_build_object(
      'q', 'How soon after tooth loss can I get a bridge?',
      'a', 'Usually, we wait a few weeks to let the gum heal. Once healed, we can start the bridge process.'
    )
  ),
  
  updated_at = CURRENT_TIMESTAMP
WHERE slug = 'bridge';

-- Update Scaling and Root Planing
UPDATE public.procedure_library
SET
  summary_en = E'## What this is\n\nScaling and root planing is a deep cleaning that treats gum disease. Think of it as a more thorough cleaning than your regular checkup. Scaling removes plaque and tartar (hardened plaque) from above and below your gum line. Root planing smooths the tooth roots so your gums can reattach and heal. This treatment helps stop gum disease from getting worse and can even reverse early stages of it.\n\n## Why you may need it\n\nYou may need scaling and root planing if:\n- Your gums bleed easily when you brush or floss\n- You have red, swollen, or tender gums\n- Your gums have pulled away from your teeth, creating pockets\n- You have persistent bad breath despite good oral hygiene\n- You notice pus between your teeth and gums\n- Your teeth feel loose or are shifting\n- You have been diagnosed with gingivitis or periodontitis (gum disease)',
  
  why_en = E'## Why you may need it\n\nScaling and root planing treats gum disease before it causes permanent damage. Common reasons include:\n\n**Gingivitis**: Early gum disease with red, swollen, bleeding gums\n\n**Periodontitis**: Advanced gum disease where gums pull away from teeth and pockets form\n\n**Tartar buildup**: Hardened plaque below the gum line that regular brushing cannot remove\n\n**Bone loss prevention**: Untreated gum disease destroys the bone that holds your teeth in place\n\n**Prevent tooth loss**: Gum disease is the leading cause of tooth loss in adults\n\n**Overall health**: Gum disease is linked to heart disease, diabetes, and other health problems',
  
  steps_en = jsonb_build_array(
    jsonb_build_object(
      'title', 'Step 1: Numbing',
      'description', E'**What we do**: We numb your gums so you will not feel pain during the deep cleaning\n\n**What you may feel**: A small pinch from the numbing shot, then the area goes numb\n\n**Why it matters**: Numbness keeps you comfortable while we clean below your gum line'
    ),
    jsonb_build_object(
      'title', 'Step 2: Scaling',
      'description', E'**What we do**: We use special tools to remove plaque and tartar from above and below your gum line\n\n**What you may feel**: Pressure, scraping sounds, and vibration, but no pain because you are numb\n\n**Why it matters**: Removing bacteria-filled tartar stops the infection and helps your gums heal'
    ),
    jsonb_build_object(
      'title', 'Step 3: Root planing',
      'description', E'**What we do**: We smooth out rough spots on your tooth roots so bacteria cannot stick as easily\n\n**What you may feel**: Continued pressure and vibration as we work on the roots\n\n**Why it matters**: Smooth roots help your gums reattach to your teeth and close up the pockets'
    ),
    jsonb_build_object(
      'title', 'Step 4: Rinse and assessment',
      'description', E'**What we do**: We rinse the area and check to make sure all tartar is removed\n\n**What you may feel**: Water and suction in your mouth\n\n**Why it matters**: A thorough rinse removes debris and lets us confirm the cleaning is complete'
    )
  ),
  
  time_estimate = '1-2 visits, 45-90 minutes per visit (depending on severity)',
  visits_estimate = '1-2 appointments (may treat half your mouth at a time)',
  
  what_if_not_en = E'## If you delay\n\nLeaving gum disease untreated leads to serious problems:\n\n**Gum recession**: Your gums continue to pull away from your teeth, exposing sensitive roots\n\n**Bone loss**: The infection destroys the bone that holds your teeth in place\n\n**Loose teeth**: Teeth become loose as bone is lost and may eventually fall out\n\n**Pain and abscesses**: Infected pockets can become very painful and fill with pus\n\n**Tooth loss**: Advanced gum disease is the main reason adults lose teeth\n\n**Health risks**: Gum disease bacteria can enter your bloodstream and increase your risk of heart disease, stroke, and diabetes complications\n\n**More expensive treatment**: Advanced gum disease may require gum surgery or tooth replacement, which costs much more',
  
  aftercare_en = E'## What to expect after\n\n### First 24 hours\n- Some gum tenderness and sensitivity to temperature are normal\n- Avoid hot, spicy, or crunchy foods that can irritate your gums\n- Eat soft, cool foods like yogurt, smoothies, mashed potatoes, or scrambled eggs\n- Do not smoke or use tobacco products (they delay healing)\n- Take over-the-counter pain medication if needed (follow the dosage on the bottle)\n- Your gums may bleed a little when you brush - this is normal at first\n\n### First week\n- Brush gently twice a day with a soft-bristled toothbrush\n- Floss carefully once a day (your gums may be tender but do not skip it)\n- Rinse with warm salt water (1 teaspoon salt in 8 oz warm water) 2-3 times daily to soothe gums\n- Sensitivity should improve each day\n- Avoid hard, sticky, or crunchy foods until your gums feel better\n- Return for a follow-up visit in 4-6 weeks so we can check your healing\n\n### Normal vs not normal\n\n**Normal**:\n- Gum tenderness for a few days\n- Slight bleeding when brushing or flossing (improves daily)\n- Temperature sensitivity for a week or two\n- Gums may look pinker and less swollen as they heal\n\n**Not normal - call us if you notice**:\n- Severe pain that gets worse after 2-3 days\n- Heavy bleeding that does not stop\n- Swelling that increases instead of improving\n- Fever or chills\n- Pus coming from your gums\n- Extreme sensitivity that makes it impossible to eat or drink\n\n### When to call us\n\nCall our office right away if you experience any "not normal" symptoms listed above, or if you have concerns about your healing.',
  
  faqs_en = jsonb_build_array(
    jsonb_build_object(
      'q', 'Will scaling and root planing hurt?',
      'a', 'No. We numb your gums so you should not feel pain. You may feel pressure and hear scraping sounds, but it should not hurt. Some soreness afterward is normal.'
    ),
    jsonb_build_object(
      'q', 'How long does the procedure take?',
      'a', 'Usually 45 to 90 minutes, depending on how much buildup you have. If your gum disease is advanced, we may treat half your mouth at one visit and the other half at a second visit.'
    ),
    jsonb_build_object(
      'q', 'Is this the same as a regular cleaning?',
      'a', 'No. A regular cleaning is preventive and cleans above the gum line. Scaling and root planing is a deeper treatment that cleans below the gum line and treats gum disease.'
    ),
    jsonb_build_object(
      'q', 'Can gum disease be cured?',
      'a', 'Early gum disease (gingivitis) can be reversed with deep cleaning and good home care. Advanced gum disease (periodontitis) can be controlled but not fully cured. The key is to stop it from getting worse.'
    ),
    jsonb_build_object(
      'q', 'Will my gums grow back after treatment?',
      'a', 'Gums do not regrow, but they can reattach to your teeth and tighten up after treatment. This closes the pockets and reduces infection.'
    ),
    jsonb_build_object(
      'q', 'How can I prevent gum disease from coming back?',
      'a', 'Brush twice a day, floss daily, and come in for regular cleanings (usually every 3-4 months after deep cleaning). Good home care is essential to keep gum disease from returning.'
    ),
    jsonb_build_object(
      'q', 'Will I need this treatment again?',
      'a', 'If you take good care of your gums and come in for regular cleanings, you should not need another deep cleaning. However, if gum disease returns, you may need it again.'
    ),
    jsonb_build_object(
      'q', 'Can I eat and drink right after?',
      'a', 'Wait until the numbness wears off (usually 2-3 hours) before eating to avoid biting your cheek or tongue. Stick to soft, cool foods for the first day.'
    ),
    jsonb_build_object(
      'q', 'Why are my teeth sensitive after treatment?',
      'a', 'Removing tartar can expose parts of your tooth roots that were covered before. This causes temporary sensitivity that usually improves in 1-2 weeks. Use toothpaste for sensitive teeth if needed.'
    ),
    jsonb_build_object(
      'q', 'Does insurance cover this?',
      'a', 'Most dental insurance plans cover scaling and root planing if it is medically necessary to treat gum disease. Check with your insurance provider for details.'
    ),
    jsonb_build_object(
      'q', 'What happens if I do not get this treatment?',
      'a', 'Gum disease will continue to get worse, leading to bone loss, loose teeth, and eventually tooth loss. It also increases your risk of other health problems.'
    ),
    jsonb_build_object(
      'q', 'How soon will I see improvement?',
      'a', 'You may notice less bleeding and healthier-looking gums within a week or two. Full healing takes several weeks, and we will check your progress at a follow-up visit.'
    )
  ),
  
  updated_at = CURRENT_TIMESTAMP
WHERE slug = 'scaling-root-planing';

-- Update Wisdom Teeth Extraction (with special section)
UPDATE public.procedure_library
SET
  summary_en = E'## What this is\n\nWisdom teeth extraction is the removal of your third molars, the last teeth to come in at the back of your mouth. Most people get wisdom teeth between ages 17 and 25. Sometimes these teeth come in properly and cause no problems. But often, there is not enough room in your jaw for them to fit, so they get stuck (impacted) or come in crooked. When this happens, we remove them to prevent pain, infection, and damage to other teeth.\n\n## Why you may need it\n\nYou may need wisdom teeth extracted if:\n- Your wisdom teeth are impacted (stuck under the gum or in the jawbone)\n- They are coming in at an angle and pushing on other teeth\n- There is not enough room in your mouth for them to come in properly\n- They are partially erupted and hard to clean, causing decay or gum infection\n- You have pain, swelling, or repeated infections around the wisdom teeth\n- X-rays show they may cause problems with nearby teeth or bone\n- Your dentist recommends removing them before problems start',
  
  why_en = E'## Why you may need it\n\nWisdom teeth are often removed to prevent future problems. Common reasons include:\n\n**Impaction**: The tooth is stuck under your gum or trapped in the jawbone because there is not enough space\n\n**Crowding**: The wisdom tooth pushes on other teeth, causing pain or shifting (though it rarely causes true crowding of front teeth)\n\n**Infection**: Partially erupted wisdom teeth are hard to clean, leading to gum infection (pericoronitis) with pain, swelling, and bad breath\n\n**Decay on adjacent tooth**: Food and bacteria get trapped between the wisdom tooth and the second molar, causing decay on the second molar\n\n**Cyst formation**: In rare cases, an impacted wisdom tooth can develop a fluid-filled sac (cyst) that damages the jawbone\n\n**Easier removal when younger**: Wisdom teeth are easier to remove in your late teens or early twenties before the roots fully form and the bone hardens',
  
  steps_en = jsonb_build_array(
    jsonb_build_object(
      'title', 'Step 1: Anesthesia',
      'description', E'**What we do**: We numb the area with local anesthesia. For multiple wisdom teeth or complex cases, we may use sedation or general anesthesia\n\n**What you may feel**: A pinch from the numbing shot if using local anesthesia, or you may be asleep if using sedation\n\n**Why it matters**: Proper anesthesia keeps you comfortable and pain-free during the procedure'
    ),
    jsonb_build_object(
      'title', 'Step 2: Accessing the tooth',
      'description', E'**What we do**: If the tooth is impacted, we make a small incision in your gum and may remove some bone to reach it\n\n**What you may feel**: Pressure and pushing sensations if awake, but no sharp pain\n\n**Why it matters**: Creating access lets us remove the tooth safely without damaging nearby structures'
    ),
    jsonb_build_object(
      'title', 'Step 3: Tooth removal',
      'description', E'**What we do**: We gently rock the tooth back and forth to loosen it, then lift it out. Sometimes we section (cut) the tooth into smaller pieces for easier removal\n\n**What you may feel**: Pressure, pushing, and possibly a cracking sound, but no pain\n\n**Why it matters**: Sectioning minimizes trauma to surrounding bone and tissue'
    ),
    jsonb_build_object(
      'title', 'Step 4: Cleaning and stitching',
      'description', E'**What we do**: We clean the site, remove any debris, and place stitches to help the area heal (stitches usually dissolve on their own)\n\n**What you may feel**: Tugging sensations as we place stitches\n\n**Why it matters**: Stitches help the gum heal faster and reduce bleeding'
    )
  ),
  
  time_estimate = '30-60 minutes for all four teeth (depends on complexity)',
  visits_estimate = '1 appointment (all wisdom teeth usually removed at once)',
  
  what_if_not_en = E'## If you delay\n\nLeaving problematic wisdom teeth can lead to complications:\n\n**Infection and pain**: Partially erupted teeth trap food and bacteria, causing painful gum infections that come back repeatedly\n\n**Decay on second molar**: The wisdom tooth creates a hard-to-clean area that causes decay on the tooth in front of it, which may then also need removal or a filling\n\n**Cyst or tumor**: In rare cases, an impacted wisdom tooth can form a cyst that damages your jawbone and nearby teeth\n\n**Gum disease**: Wisdom teeth that are hard to clean contribute to gum disease in that area\n\n**Harder removal later**: As you age, the roots grow longer and the bone becomes denser, making extraction more difficult and recovery longer\n\n**Damage to other teeth**: A wisdom tooth pushing on the second molar can cause root damage or shifting of nearby teeth',
  
  aftercare_en = E'## What to expect after\n\n### First 24 hours\n- Bite gently on gauze pads for 30-45 minutes to control bleeding\n- Apply ice packs to your cheeks (20 minutes on, 20 minutes off) to reduce swelling\n- Take prescribed pain medication before the numbness wears off\n- Eat soft, cool foods like yogurt, smoothies, mashed potatoes, or ice cream\n- Avoid hot foods, spicy foods, and anything crunchy or chewy\n- Do not use a straw, spit forcefully, or smoke (suction can dislodge the blood clot and cause dry socket)\n- Sleep with your head elevated on pillows to reduce swelling\n- Do not rinse your mouth on the day of surgery\n\n### First week\n- Swelling and bruising peak around day 2-3, then gradually improve\n- Start gentle rinsing with warm salt water (1 teaspoon salt in 8 oz warm water) after 24 hours, 3-4 times daily\n- Brush your other teeth gently, but avoid the extraction sites for the first few days\n- Gradually add soft foods back into your diet as you feel comfortable\n- Continue taking pain medication as directed\n- Avoid strenuous activity, heavy lifting, or exercise for 3-5 days\n- If you were prescribed antibiotics, finish the entire course\n\n### Normal vs not normal\n\n**Normal**:\n- Swelling that peaks on day 2-3 and slowly improves\n- Bruising on your cheeks or jaw\n- Mild bleeding or pink-tinged saliva for the first day\n- Jaw stiffness or soreness that makes it hard to open your mouth wide\n- Some discomfort for several days\n- Bad breath or unpleasant taste (this improves with rinsing)\n\n**Not normal - call us if you notice**:\n- Severe pain that gets worse after day 3 (could be dry socket)\n- Heavy bleeding that does not stop after applying pressure for 30 minutes\n- Fever over 100°F\n- Severe swelling that gets worse after day 3\n- Numbness or tingling that lasts more than 24 hours\n- Difficulty breathing or swallowing\n- Pus or foul-smelling discharge from the extraction site\n\n### When to call us\n\nCall our office immediately if you experience any "not normal" symptoms, especially signs of dry socket (severe pain a few days after surgery) or infection.',
  
  faqs_en = jsonb_build_array(
    jsonb_build_object(
      'q', 'Why remove wisdom teeth even if they do not hurt?',
      'a', 'Wisdom teeth can cause problems before you feel pain. If they are impacted or coming in crooked, they can trap food and bacteria, leading to infection or decay on the second molar. They are harder to clean, increasing your risk of cavities and gum disease. Cysts can form around impacted teeth. As you get older, the roots grow longer and the bone gets denser, making removal more difficult and recovery longer. Removing them early prevents these problems and makes the procedure easier. Note: Wisdom teeth rarely cause true crowding of your front teeth - that is a common myth.'
    ),
    jsonb_build_object(
      'q', 'Will it hurt during the procedure?',
      'a', 'No. You will be numbed with local anesthesia or under sedation, so you should not feel pain. You may feel pressure or hear sounds, but it should not hurt.'
    ),
    jsonb_build_object(
      'q', 'How long is recovery?',
      'a', 'Most people feel better in 3-5 days and can return to normal activities within a week. Full healing of the bone and gum takes several weeks, but you should not feel pain by then.'
    ),
    jsonb_build_object(
      'q', 'What is dry socket?',
      'a', 'Dry socket happens when the blood clot in the extraction site dislodges or dissolves too early, exposing bone and nerves. It causes severe pain a few days after surgery. If this happens, call us right away - we can treat it and relieve the pain.'
    ),
    jsonb_build_object(
      'q', 'When can I eat solid food again?',
      'a', 'Start with soft foods and gradually add solids as you feel comfortable, usually within 3-5 days. Avoid hard, crunchy, or sticky foods for at least a week.'
    ),
    jsonb_build_object(
      'q', 'Can I go to work or school the next day?',
      'a', 'It depends. Most people need 1-2 days off to rest and recover. If you have a desk job and feel well, you may be able to return the next day. Avoid strenuous activities for 3-5 days.'
    ),
    jsonb_build_object(
      'q', 'Will my face swell?',
      'a', 'Yes, swelling is normal and peaks around day 2-3. Use ice packs for the first 24 hours, then switch to warm compresses to help reduce swelling.'
    ),
    jsonb_build_object(
      'q', 'Do I need someone to drive me home?',
      'a', 'Yes, if you have sedation or general anesthesia. If you only have local anesthesia, you can drive yourself home.'
    ),
    jsonb_build_object(
      'q', 'Should I remove all four wisdom teeth at once?',
      'a', 'Usually, yes. It is more convenient to do it all at once rather than going through recovery multiple times. Your dentist will recommend what is best for your situation.'
    ),
    jsonb_build_object(
      'q', 'What if I am older and still have my wisdom teeth?',
      'a', 'If they are healthy, properly positioned, and not causing problems, you may not need to remove them. However, if they start causing issues, they can still be removed at any age - though recovery may take longer.'
    ),
    jsonb_build_object(
      'q', 'Will removing wisdom teeth change my face shape?',
      'a', 'No. Removing wisdom teeth does not change the shape of your face or jawline.'
    ),
    jsonb_build_object(
      'q', 'Can I smoke after wisdom teeth removal?',
      'a', 'No. Do not smoke for at least 72 hours (ideally a week). Smoking greatly increases your risk of dry socket and delays healing.'
    )
  ),
  
  updated_at = CURRENT_TIMESTAMP
WHERE slug = 'wisdom-teeth-education';

-- Update Flexible Partial Denture (Valplast) with special section
UPDATE public.procedure_library
SET
  summary_en = E'## What this is\n\nA flexible partial denture (often called Valplast) is a removable appliance that replaces one or more missing teeth. Unlike traditional metal-framework partials, flexible partials are made from a thin, lightweight, flexible plastic material. The gum-colored base blends with your natural gum tissue, and the clasps that hold it in place are also pink or tooth-colored, so they are less noticeable. It snaps into place using the natural undercuts (curves) of your remaining teeth, without metal hooks. This makes it comfortable and discreet.\n\n## Why you may need it\n\nYou may need a flexible partial denture if:\n- You are missing one or more teeth and want a removable option\n- You have healthy remaining teeth to support the partial\n- You prefer a more comfortable and aesthetic alternative to metal-framework partials\n- You cannot have dental implants or a bridge\n- You want a temporary solution while planning for implants or a bridge later\n- You need to restore your ability to chew and speak properly\n- You want to prevent remaining teeth from shifting into the gap',
  
  why_en = E'## Why you may need it\n\nA flexible partial denture replaces missing teeth and restores function. Common reasons include:\n\n**Missing teeth**: You have gaps from tooth loss due to decay, gum disease, injury, or extraction\n\n**Improved appearance**: The partial fills gaps and restores your smile in a natural-looking way\n\n**Better chewing**: Missing teeth make it hard to chew certain foods; a partial restores chewing ability\n\n**Speech improvement**: Gaps can affect pronunciation; a partial helps you speak more clearly\n\n**Prevent shifting**: Remaining teeth can drift into empty spaces, changing your bite; a partial keeps them in place\n\n**Comfort and aesthetics**: Flexible partials are more comfortable than metal-framework partials and have no visible metal clasps\n\n**Affordable option**: Flexible partials cost less than implants or bridges and do not require surgery',
  
  steps_en = jsonb_build_array(
    jsonb_build_object(
      'title', 'Step 1: Examination and impressions (first visit)',
      'description', E'**What we do**: We examine your mouth, check the health of your remaining teeth and gums, and take impressions (molds) or digital scans\n\n**What you may feel**: A tray with putty in your mouth for a minute or two, or a small camera scanning your teeth\n\n**Why it matters**: Accurate impressions ensure your partial fits properly and comfortably'
    ),
    jsonb_build_object(
      'title', 'Step 2: Lab fabrication',
      'description', E'**What we do**: The lab uses your impressions to create a custom flexible partial that matches your gum color and tooth shape\n\n**What you may feel**: Nothing - you wait while the lab makes your partial (usually 1-2 weeks)\n\n**Why it matters**: A custom-made partial fits securely and looks natural'
    ),
    jsonb_build_object(
      'title', 'Step 3: Fitting and adjustments (second visit)',
      'description', E'**What we do**: We place the partial in your mouth, check the fit and bite, and make any needed adjustments\n\n**What you may feel**: Pressure as we fit the partial, then we check how it feels when you bite and talk\n\n**Why it matters**: Proper fit ensures comfort, stability, and natural appearance'
    ),
    jsonb_build_object(
      'title', 'Step 4: Instructions and follow-up',
      'description', E'**What we do**: We teach you how to insert, remove, clean, and care for your partial, and schedule a follow-up visit\n\n**What you may feel**: Awkward at first as you practice putting it in and taking it out\n\n**Why it matters**: Knowing how to care for your partial keeps it clean and helps it last longer'
    )
  ),
  
  time_estimate = '2 visits, 30-60 minutes each',
  visits_estimate = '2 appointments (impressions + fitting)',
  
  what_if_not_en = E'## If you delay\n\nLeaving gaps from missing teeth can cause problems:\n\n**Teeth shift**: Nearby teeth tilt or move into empty spaces, making your bite uneven\n\n**Jaw problems**: A shifted bite can lead to jaw pain, clicking, or difficulty opening your mouth\n\n**Bone loss**: The jawbone where teeth are missing starts to shrink because it is not being used\n\n**Chewing difficulty**: You may avoid certain foods or chew unevenly, causing extra wear on other teeth\n\n**Speech issues**: Missing teeth can make it harder to pronounce certain sounds clearly\n\n**Appearance**: Gaps may make you self-conscious about your smile and affect your confidence',
  
  aftercare_en = E'## What to expect after\n\n### First 24 hours\n- Your mouth may feel full or strange at first - this is normal and will improve\n- Practice speaking out loud to get used to the partial\n- Start with soft foods and chew slowly until you adjust\n- Remove the partial at night and soak it in water or denture cleaner\n- Rinse your mouth and brush your remaining teeth before reinserting the partial\n\n### First week\n- You may notice increased saliva production at first - this is normal and will decrease\n- Some soreness on your gums is normal as you adjust; it should improve daily\n- Continue practicing insertion and removal until it feels easy\n- Gradually return to your normal diet, but avoid very hard or sticky foods\n- Clean your partial daily with a soft brush and mild soap or denture cleaner (not toothpaste)\n\n### Normal vs not normal\n\n**Normal**:\n- Feeling awkward or full in your mouth for the first few days\n- Increased saliva or slight gagging sensation initially\n- Minor gum soreness that improves\n- Taking a few days to get used to eating and speaking\n\n**Not normal - call us if you notice**:\n- Severe pain or sores on your gums\n- The partial feels very loose or rocks when you eat\n- You cannot insert or remove the partial easily\n- Persistent gagging or discomfort after a week\n- Cracks or breaks in the partial\n- Bad smell or taste coming from the partial\n\n### When to call us\n\nCall our office if you experience any "not normal" symptoms or if the partial needs adjustments. Minor adjustments are common in the first few weeks.',
  
  faqs_en = jsonb_build_array(
    jsonb_build_object(
      'q', 'What is a flexible partial denture (Valplast)?',
      'a', 'It is a removable appliance made from thin, flexible plastic that replaces missing teeth. The gum-colored material blends naturally, and it uses flexible clasps (instead of metal hooks) to stay in place.'
    ),
    jsonb_build_object(
      'q', 'What does a flexible partial replace?',
      'a', 'It replaces one or more missing teeth. The partial rests on your gums and clasps onto your remaining natural teeth to hold it securely in place.'
    ),
    jsonb_build_object(
      'q', 'How does it stay in?',
      'a', 'The flexible clasps wrap around the natural curves (undercuts) of your remaining teeth. The flexibility lets it snap into place without metal hooks, making it more comfortable and less visible.'
    ),
    jsonb_build_object(
      'q', 'Who is it best for?',
      'a', 'Flexible partials work well for people who are missing several teeth, have healthy remaining teeth and gums, want a comfortable and discreet option, or prefer not to have surgery for implants. They are also good as temporary appliances while planning for permanent solutions.'
    ),
    jsonb_build_object(
      'q', 'What are the limitations compared to other options?',
      'a', 'Flexible partials are less durable than metal-framework partials and may need replacement sooner (typically 5-7 years). They cannot be relined easily if your gums change shape. They are bulkier than a bridge or implant and must be removed daily for cleaning. They do not prevent bone loss like implants do.'
    ),
    jsonb_build_object(
      'q', 'How long does a flexible partial last?',
      'a', 'With good care, a flexible partial typically lasts 5 to 7 years. Over time, the material may lose flexibility or wear down, and changes in your gums may require a new partial.'
    ),
    jsonb_build_object(
      'q', 'What is the adjustment period like?',
      'a', 'Most people adjust within a few days to a week. At first, your mouth may feel full and speaking or eating may feel awkward. Practice makes it easier. Some soreness is normal initially.'
    ),
    jsonb_build_object(
      'q', 'How do I clean my flexible partial?',
      'a', 'Remove it daily and brush it gently with a soft toothbrush and mild soap or denture cleaner (not regular toothpaste, which can scratch it). Rinse it thoroughly and soak it in water or denture solution overnight. Never use hot water - it can warp the material.'
    ),
    jsonb_build_object(
      'q', 'What should I not do with my flexible partial?',
      'a', 'Do not use regular toothpaste to clean it (too abrasive). Do not expose it to hot water or leave it to dry out. Do not try to adjust or repair it yourself. Do not chew very hard or sticky foods. Do not sleep with it in (remove it at night).'
    ),
    jsonb_build_object(
      'q', 'Can I eat normally with a flexible partial?',
      'a', 'Yes, after an adjustment period. Start with soft foods, then gradually return to your normal diet. Avoid very hard foods (like hard candy or ice) and sticky foods (like caramel) that can damage or dislodge the partial.'
    ),
    jsonb_build_object(
      'q', 'Will it look natural?',
      'a', 'Yes. The gum-colored base blends with your natural gums, and the clasps are pink or tooth-colored, making them much less noticeable than metal clasps. Most people cannot tell you are wearing a partial.'
    ),
    jsonb_build_object(
      'q', 'Is a flexible partial better than a metal-framework partial?',
      'a', 'Each has pros and cons. Flexible partials are more comfortable, aesthetic, and lightweight, with no visible metal. Metal-framework partials are stronger, last longer, and can be relined if your gums change. Your dentist will recommend what is best for your situation.'
    ),
    jsonb_build_object(
      'q', 'Can I get a flexible partial if I have gum disease?',
      'a', 'It depends. Your gums and remaining teeth need to be healthy enough to support the partial. If you have active gum disease, we will treat that first before making the partial.'
    ),
    jsonb_build_object(
      'q', 'How much does a flexible partial cost?',
      'a', 'Flexible partials typically cost less than implants or bridges but more than traditional dentures. The exact cost depends on how many teeth it replaces and your location. Check with your dental insurance - many plans cover partial dentures.'
    )
  ),
  
  updated_at = CURRENT_TIMESTAMP
WHERE slug = 'valplast-education';

-- Note: This migration ONLY updates text content columns
-- It does NOT modify visuals, image URLs, or any UI-related data
-- All content follows 6th-8th grade reading level
-- Special sections included for wisdom teeth and Valplast as requested
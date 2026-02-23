// Centralized Procedure Library
// All procedures with bilingual content, visual guide steps, duration estimates, and REALISTIC dental illustrations

// IMPORTANT: This data structure now uses realistic dental illustrations instead of procedurally generated SVG
// Visual assets should be sourced from:
// 1. Licensed dental education libraries (e.g., DentalTap, Vecteezy medical collections)
// 2. Professional dental illustration services
// 3. Dental textbook publishers with licensing agreements
// 4. Stock photo sites with medical/dental categories (Shutterstock Medical, Getty Medical)

const proceduresLibrary = [
{
  id: 'root-canal',
  name_en: 'Root Canal',
  name_es: 'Endodoncia',
  category: 'restorative',
  duration: '60-90 minutes',
  heroImage: "/assets/images/root-canal-hero.jpeg",
  heroImageAlt: 'Root canal procedure illustration showing four stages: infected tooth with abscess, tooth cleaned and shaped, root filling replaced, and permanent filling or crown replaced',
  description_en: 'A root canal is a treatment to repair and save a badly damaged or infected tooth...',
  description_es: 'Una endodoncia es un tratamiento para reparar y salvar un diente gravemente dañado o infectado...',
  why_needed_en: 'Saves your natural tooth when pulp becomes infected, prevents spread to surrounding bone and tissue, eliminates pain.',
  why_needed_es: 'Salva su diente natural cuando la pulpa se infecta, previene la propagación al hueso y tejido circundantes, elimina el dolor.',
  what_to_expect_en: 'Local anesthesia ensures comfort. Dentist removes infected pulp, cleans canals, seals tooth. Crown placed in follow-up visit.',
  what_to_expect_es: 'La anestesia local garantiza comodidad. El dentista elimina la pulpa infectada, limpia los conductos, sella el diente. Corona colocada en visita de seguimiento.',
  aftercare_en: 'Mild sensitivity for few days. Use over-the-counter pain medication. Maintain good oral hygiene.',
  aftercare_es: 'Sensibilidad leve durante algunos días. Use medicamentos de venta libre. Mantenga buena higiene oral.',
  visualGuideSteps: [
  {
    title_en: 'Access Opening',
    title_es: 'Apertura de Acceso',
    description_en: 'A small opening is created on the chewing surface of the tooth so the dentist can reach the infected tissue inside.',
    description_es: 'Se crea una pequeña abertura en la superficie de masticación del diente para que el dentista pueda alcanzar el tejido infectado en el interior.',
    visualType: 'realistic-illustration',
    visualSrc: "/assets/images/root-canal-1-access-opening.png-1765907492802.PNG",
    visualAlt: 'Ultra-realistic 3D dental illustration, top-down occlusal view of a molar tooth with a clean access cavity through enamel and dentin into the pulp chamber. Natural tooth anatomy, smooth cavity walls, no instruments inside canals, simplified rubber dam isolation, neutral background.'
  },
  {
    title_en: 'Canal Cleaning',
    title_es: 'Limpieza de Conductos',
    description_en: 'The infected tissue is removed, and the canals are carefully cleaned and shaped.',
    description_es: 'El tejido infectado se elimina y los conductos se limpian y moldean cuidadosamente.',
    visualType: 'realistic-illustration',
    visualSrc: "/assets/images/root-canal-2-canal-cleaning.png-1765907556946.PNG",
    visualAlt: 'Ultra-realistic 3D dental illustration showing a vertical cross-section of a molar tooth with an access opening already completed. An endodontic file is cleaning and shaping the root canal. Canals appear smooth and disinfected, no debris or blood, natural enamel and dentin colors.'
  },
  {
    title_en: 'Canal Obturation',
    title_es: 'Obturación de Conductos',
    description_en: 'The cleaned canals are permanently filled to prevent reinfection.',
    description_es: 'Los conductos limpios se rellenan permanentemente para prevenir reinfección.',
    visualType: 'realistic-illustration',
    visualSrc: "/assets/images/root-canal-3-canal-obturation.png-1765907638967.PNG",
    visualAlt: 'Ultra-realistic 3D dental illustration showing a vertical cross-section of a molar tooth with root canals completely filled and sealed with gutta-percha material from the pulp chamber to the root tips. Clean, finished appearance, no instruments.'
  },
  {
    title_en: 'Build-Up',
    title_es: 'Reconstrucción',
    description_en: 'The inside of the tooth is rebuilt to restore strength and support the final crown.',
    description_es: 'El interior del diente se reconstruye para restaurar la fuerza y soportar la corona final.',
    visualType: 'realistic-illustration',
    visualSrc: "/assets/images/root-canal-4-build-up.png-1765907699761.PNG",
    visualAlt: 'Ultra-realistic 3D dental illustration showing a vertical cross-section of a tooth after root canal treatment with canals filled and a composite core build-up placed in the pulp chamber. Tooth appears internally solid. No crown present yet. Clean, natural anatomy.'
  },
  {
    title_en: 'Crown Placement',
    title_es: 'Colocación de Corona',
    description_en: 'A custom crown is placed over the tooth to protect it and restore normal function.',
    description_es: 'Se coloca una corona personalizada sobre el diente para protegerlo y restaurar la función normal.',
    visualType: 'realistic-illustration',
    visualSrc: "https://img.rocket.new/generatedImages/rocket_gen_img_1fb11b33f-1767700282644.png",
    visualAlt: 'Realistic dental crown being placed over root canal treated tooth, showing proper fit and restoration of tooth structure'
  }]

},

{
  id: 'dental-crown',
  name_en: 'Dental Crown',
  name_es: 'Corona Dental',
  category: 'restorative',
  duration: '2 visits, 60 minutes each',
  heroImage: "/assets/images/tmpwr8m23i8-1766117845028.jpg",
  heroImageAlt: 'Porcelain dental crown seated on prepared tooth abutment showing natural tooth color and anatomical contours',
  description_en: 'A dental crown is a tooth-shaped cap that is placed over a tooth...',
  description_es: 'Una corona dental es una cubierta en forma de diente que se coloca sobre un diente...',
  why_needed_en: 'Protects weakened tooth from large filling or root canal, prevents breaking, restores chewing function.',
  why_needed_es: 'Protege el diente debilitado de empaste grande o conducto radicular, previene roturas, restaura la función de masticación.',
  what_to_expect_en: 'Tooth shaped for crown fit. Impressions taken. Temporary crown protects tooth while permanent one is crafted.',
  what_to_expect_es: 'Diente moldeado para ajuste de corona. Se toman impresiones. Corona temporal protege el diente mientras se fabrica la permanente.',
  aftercare_en: 'Slight sensitivity normal for few days. Crown should feel like natural tooth within a week.',
  aftercare_es: 'Sensibilidad leve normal durante algunos días. La corona debe sentirse como diente natural en una semana.',
  visualGuideSteps: [
  {
    title_en: 'Tooth Preparation',
    title_es: 'Preparación del Diente',
    description_en: 'Tooth carefully reshaped and reduced to make room for crown',
    description_es: 'Diente cuidadosamente remodelado y reducido para hacer espacio para la corona',
    visualType: 'realistic-illustration',
    visualSrc: "/assets/images/25A0FFC5-8659-43A7-8EF9-AD803D48B187-1766118077465.png",
    visualAlt: 'Side-by-side comparison showing intact premolar next to prepared tooth with chamfer margin and occlusal reduction'
  },
  {
    title_en: 'Take Impressions',
    title_es: 'Tomar Impresiones',
    description_en: 'Digital scan or traditional molds capture exact shape of prepared tooth',
    description_es: 'Escaneo digital o moldes tradicionales capturan forma exacta del diente preparado',
    visualType: 'realistic-illustration',
    visualSrc: "/assets/images/tmpgdzbk4d1-1766118746902.jpg",
    visualAlt: 'Intraoral scanner capturing 3D digital impression of prepared tooth with surrounding dentition visible'
  },
  {
    title_en: 'Temporary Crown',
    title_es: 'Corona Temporal',
    description_en: 'Temporary crown placed to protect prepared tooth during lab fabrication',
    description_es: 'Corona temporal colocada para proteger diente preparado durante fabricación en laboratorio',
    visualType: 'realistic-illustration',
    visualSrc: "/assets/images/tmphv4468q1-1766118848890.jpg",
    visualAlt: 'Acrylic temporary crown placed on prepared tooth abutment, showing interim restoration'
  },
  {
    title_en: 'Lab Fabrication',
    title_es: 'Fabricación en Laboratorio',
    description_en: 'Custom crown crafted in dental lab to match color and shape of natural teeth',
    description_es: 'Corona personalizada fabricada en laboratorio dental para coincidir con color y forma de dientes naturales',
    visualType: 'realistic-illustration',
    visualSrc: "/assets/images/crown-4-lab-fabrication.png-1766118384254.PNG",
    visualAlt: 'Dental technician working on porcelain crown in laboratory with shade guide for color matching'
  },
  {
    title_en: 'Final Placement',
    title_es: 'Colocación Final',
    description_en: 'Permanent crown checked for fit, adjusted, and permanently cemented in place',
    description_es: 'Corona permanente verificada para ajuste, ajustada y cementada permanentemente en su lugar',
    visualType: 'realistic-illustration',
    visualSrc: "/assets/images/crown-5-crown-placement.png-1766118464418.PNG",
    visualAlt: 'Permanent porcelain crown being cemented onto prepared tooth with perfect marginal fit and occlusion'
  }]

},
{
  id: 'dental-bridge',
  name_en: 'Dental Bridge',
  name_es: 'Puente Dental',
  category: 'restorative',
  duration: '2-3 visits, 60-90 minutes each',
  heroImage: "/assets/images/bridge_hero.png-1766897529584.PNG",
  heroImageAlt: '3D dental illustration showing two prepared abutment teeth with missing tooth space between them for dental bridge placement',
  description_en: 'A dental bridge replaces one or more missing teeth by anchoring an artificial tooth to the healthy teeth next to the gap. This restores chewing ability, appearance, and helps prevent nearby teeth from shifting.',
  description_es: 'Un puente dental reemplaza uno o más dientes faltantes anclando un diente artificial a los dientes sanos al lado del espacio. Esto restaura la capacidad de masticar, la apariencia y ayuda a prevenir que los dientes cercanos se desplacen.',
  why_needed_en: 'Fills gaps from missing teeth, prevents neighboring teeth from shifting, maintains bite alignment.',
  why_needed_es: 'Llena espacios de dientes faltantes, previene que dientes vecinos se desplacen, mantiene alineación de mordida.',
  what_to_expect_en: 'Adjacent teeth prepared with crowns. Impressions taken. Temporary bridge protects while permanent one is made.',
  what_to_expect_es: 'Dientes adyacentes preparados con coronas. Se toman impresiones. Puente temporal protege mientras se hace el permanente.',
  aftercare_en: 'Clean under bridge with floss threader. Regular dental check-ups essential.',
  aftercare_es: 'Limpie debajo del puente con enhebrador de hilo dental. Chequeos dentales regulares esenciales.',
  visualGuideSteps: [
  {
    title_en: 'Prepare the Supporting Teeth',
    title_es: 'Preparar los Dientes de Soporte',
    description_en: 'The teeth next to the missing space are gently reshaped so they can securely support the bridge.',
    description_es: 'Los dientes al lado del espacio faltante se remodelan suavemente para que puedan soportar de manera segura el puente.',
    visualType: 'realistic-illustration',
    visualSrc: "/assets/images/bridge_prep.png-1766897587843.jpg",
    visualAlt: 'Educational dental illustration showing tooth preparation process with two abutment teeth being prepared for dental bridge placement'
  },
  {
    title_en: 'Digital Scan or Impression',
    title_es: 'Escaneo Digital o Impresión',
    description_en: 'A precise digital scan or impression is taken to design a bridge that fits comfortably and looks natural.',
    description_es: 'Se toma un escaneo digital preciso o impresión para diseñar un puente que se ajuste cómodamente y se vea natural.',
    visualType: 'realistic-illustration',
    visualSrc: "/assets/images/tmp9a4a1lel-1766897727621.jpg",
    visualAlt: 'Comparison image showing traditional PVS impression tray and modern digital scanning methods for dental bridge fabrication'
  },
  {
    title_en: 'Temporary Bridge',
    title_es: 'Puente Temporal',
    description_en: 'A temporary bridge may be placed to protect the teeth while the final bridge is being made.',
    description_es: 'Se puede colocar un puente temporal para proteger los dientes mientras se fabrica el puente final.',
    visualType: 'realistic-illustration',
    visualSrc: "/assets/images/IMG_0216-1766898254084.jpeg",
    visualAlt: 'Clinical photograph showing temporary dental bridge placement protecting prepared abutment teeth during permanent bridge fabrication'
  },
  {
    title_en: 'Final Bridge Placement',
    title_es: 'Colocación del Puente Final',
    description_en: 'The custom-made bridge is carefully placed and adjusted to restore function, comfort, and appearance.',
    description_es: 'El puente hecho a medida se coloca cuidadosamente y se ajusta para restaurar la función, comodidad y apariencia.',
    visualType: 'realistic-illustration',
    visualSrc: "/assets/images/tmp2uauywul-1766898047949.jpg",
    visualAlt: 'Dental bridge cementation illustration showing cement application process with abutment teeth and pontic placement'
  }]

},

{
  id: 'composite-filling',
  name_en: 'Composite Filling',
  name_es: 'Relleno Compuesto',
  category: 'restorative',
  duration: '30-60 minutes',
  heroImage: "https://img.rocket.new/generatedImages/rocket_gen_img_1391cb420-1765784564717.png",
  description_en: 'Tooth-colored filling material repairs cavities and restores tooth structure.',
  description_es: 'Material de empaste del color del diente repara caries y restaura estructura dental.',
  why_needed_en: 'Removes decay, prevents cavity growth, restores tooth function and appearance.',
  why_needed_es: 'Elimina caries, previene crecimiento de cavidad, restaura función y apariencia del diente.',
  what_to_expect_en: 'Area numbed, decay removed, filling placed and shaped to match tooth, hardened with special light.',
  what_to_expect_es: 'Área adormecida, caries eliminada, empaste colocado y moldeado para coincidir con diente, endurecido con luz especial.',
  aftercare_en: 'Avoid hard foods for 24 hours. Sensitivity normal for few days.',
  aftercare_es: 'Evite alimentos duros durante 24 horas. Sensibilidad normal durante algunos días.',
  visualGuideSteps: [
  {
    title_en: 'Numb Area',
    title_es: 'Adormecer Área',
    description_en: 'Local anesthesia administered to ensure comfortable, pain-free procedure',
    description_es: 'Anestesia local administrada para asegurar procedimiento cómodo y sin dolor',
    visualType: 'realistic-illustration',
    visualSrc: "https://img.rocket.new/generatedImages/rocket_gen_img_1147d5918-1765863792272.png",
    visualAlt: 'Dental illustration showing local anesthesia being administered to tooth preparation area'
  },
  {
    title_en: 'Remove Decay',
    title_es: 'Eliminar Caries',
    description_en: 'Decayed tooth material carefully removed using dental drill',
    description_es: 'Material dental cariado cuidadosamente eliminado usando taladro dental',
    visualType: 'realistic-illustration',
    visualSrc: "https://img.rocket.new/generatedImages/rocket_gen_img_16bfe0079-1765863788735.png",
    visualAlt: 'Cross-section showing decayed tooth material being removed with dental drill and curette'
  },
  {
    title_en: 'Place Filling',
    title_es: 'Colocar Empaste',
    description_en: 'Tooth-colored composite resin applied in layers and shaped to fit',
    description_es: 'Resina compuesta del color del diente aplicada en capas y moldeada para ajustar',
    visualType: 'realistic-illustration',
    visualSrc: "https://images.unsplash.com/photo-1675516161546-1894798c71de",
    visualAlt: 'Dental technician applying composite resin in layers to restore tooth structure'
  },
  {
    title_en: 'Shape & Polish',
    title_es: 'Moldear y Pulir',
    description_en: 'Filling shaped and polished to match natural tooth contours',
    description_es: 'Empaste moldeado y pulido para coincidir con contornos naturales del diente',
    visualType: 'realistic-illustration',
    visualSrc: "https://img.rocket.new/generatedImages/rocket_gen_img_1165a0645-1768278928659.png",
    visualAlt: 'Final restoration showing composite filling polished to match natural tooth surface'
  },
  {
    title_en: 'Bite Check',
    title_es: 'Verificar Mordida',
    description_en: 'Bite alignment checked and adjusted for comfortable chewing',
    description_es: 'Alineación de mordida verificada y ajustada para masticación cómoda',
    visualType: 'realistic-illustration',
    visualSrc: "https://img.rocket.new/generatedImages/rocket_gen_img_1f848bad7-1770493517256.png",
    visualAlt: 'Final bite check showing proper occlusion and natural tooth contact'
  }]

},
{
  id: 'scaling-root-planing',
  category: 'periodontal',
  duration: '1-2 hours per quadrant',
  name_en: 'Scaling and Root Planing',
  name_es: 'Raspado y Alisado Radicular',
  heroImage: "/assets/images/tmp0tsr_pqb-1766898771416.jpg",
  heroImageAlt: 'Educational illustration showing normal healthy tooth versus tooth with periodontitis, demonstrating gum disease progression and deep cleaning needs',
  description_en: 'This deep cleaning treatment removes plaque and hardened buildup below the gumline to treat gum infection and prevent bone loss.',
  description_es: 'Este tratamiento de limpieza profunda elimina la placa y la acumulación endurecida debajo de la línea de las encías para tratar la infección de las encías y prevenir la pérdida ósea.',
  why_needed_en: 'Treats gum disease, prevents bone loss, helps gums reattach to teeth.',
  why_needed_es: 'Trata enfermedad de las encías, previene pérdida ósea, ayuda a que encías se readhieran a los dientes.',
  what_to_expect_en: 'Area numbed. Special tools clean deep under gums. May need multiple visits for full mouth.',
  what_to_expect_es: 'Área adormecida. Herramientas especiales limpian profundamente bajo encías. Puede necesitar múltiples visitas para boca completa.',
  aftercare_en: 'Gums may be tender for few days. Use prescribed mouth rinse. Avoid hard foods initially.',
  aftercare_es: 'Encías pueden estar sensibles durante algunos días. Use enjuague bucal recetado. Evite alimentos duros inicialmente.',
  visualGuideSteps: [
  {
    title_en: 'Assessment',
    title_es: 'Evaluación',
    description_en: 'Measurements are taken to evaluate gum health and identify areas that need deep cleaning.',
    description_es: 'Se toman medidas para evaluar la salud de las encías e identificar áreas que necesitan limpieza profunda.',
    visualType: 'realistic-illustration',
    visualSrc: "/assets/images/Untitled-1766943572520.jpeg",
    visualAlt: 'Medical illustration showing periodontal probe measuring pocket depth for gum disease assessment, comparing healthy gum tissue versus inflamed tissue with tartar buildup and bone loss'
  },
  {
    title_en: 'Deep Scaling',
    title_es: 'Raspado Profundo',
    description_en: 'Bacteria and hardened deposits are carefully removed from below the gums.',
    description_es: 'Las bacterias y los depósitos endurecidos se eliminan cuidadosamente de debajo de las encías.',
    visualType: 'realistic-illustration',
    visualSrc: "/assets/images/tmpy7d80heh-1766899473515.jpg",
    visualAlt: 'Educational illustration showing ultrasonic scaler removing calculus deposits from below the gumline'
  },
  {
    title_en: 'Root Planing',
    title_es: 'Alisado Radicular',
    description_en: 'The root surface is smoothed to help gums heal and reattach.',
    description_es: 'La superficie de la raíz se alisa para ayudar a las encías a sanar y readherirse.',
    visualType: 'realistic-illustration',
    visualSrc: "/assets/images/tmpnwze4ns6-1766899834988.jpg",
    visualAlt: 'Educational illustration comparing scaling versus root planing procedures showing difference between removing deposits and smoothing root surface'
  },
  {
    title_en: 'Antimicrobial Rinse',
    title_es: 'Enjuague Antimicrobiano',
    description_en: 'A medicated rinse may be used to reduce bacteria and promote healing.',
    description_es: 'Se puede usar un enjuague medicado para reducir las bacterias y promover la sanación.',
    visualType: 'realistic-illustration',
    visualSrc: "/assets/images/IMG_0240-1766900366584.jpeg",
    visualAlt: 'Clinical photograph showing patient using antimicrobial mouthwash rinse as part of scaling and root planing treatment'
  }]

},

{
  id: 'simple-extraction',
  category: 'surgery',
  duration: '20-40 minutes',
  name_en: 'Extractions',
  name_es: 'Extracción Simple',
  heroImage: "/assets/images/IMG_0242-1766900986056.png",
  heroImageAlt: '3D dental illustration showing dental forceps removing damaged tooth for patient education',
  description_en: 'A tooth may need to be removed if it is too damaged or infected to be saved.',
  description_es: 'Es posible que sea necesario extraer un diente si está demasiado dañado o infectado para salvarlo.',
  why_needed_en: 'Tooth too damaged to repair, severe decay, overcrowding, or infection risk.',
  why_needed_es: 'Diente demasiado dañado para reparar, caries severa, apiñamiento o riesgo de infección.',
  what_to_expect_en: 'Area numbed, tooth loosened and removed gently. Gauze placed to control bleeding.',
  what_to_expect_es: 'Área adormecida, diente aflojado y eliminado suavemente. Gasa colocada para controlar sangrado.',
  aftercare_en: 'Bite on gauze for 30 minutes. Avoid hot liquids and straws. Soft foods for few days.',
  aftercare_es: 'Morder gasa durante 30 minutos. Evitar líquidos calientes y popotes. Alimentos blandos durante algunos días.',
  visualGuideSteps: [
  {
    title_en: 'Numb the Area',
    title_es: 'Adormecer el Área',
    description_en: 'Local anesthesia is used to ensure the area is completely numb and comfortable.',
    description_es: 'Se utiliza anestesia local para asegurar que el área esté completamente adormecida y cómoda.',
    visualType: 'realistic-illustration',
    visualSrc: "/assets/images/IMG_0245-1766902074372.png",
    visualAlt: '3D illustration showing local anesthesia injection being administered for tooth extraction procedure'
  },
  {
    title_en: 'Loosen the Tooth',
    title_es: 'Aflojar el Diente',
    description_en: 'The tooth is gently loosened from its supporting structures.',
    description_es: 'El diente se afloja suavemente de sus estructuras de soporte.',
    visualType: 'realistic-illustration',
    visualSrc: "/assets/images/IMG_0248-1766901936140.png",
    visualAlt: 'Cross-sectional illustration showing progressive loosening of periodontal ligaments during tooth extraction'
  },
  {
    title_en: 'Remove the Tooth',
    title_es: 'Extraer el Diente',
    description_en: 'The tooth is carefully removed in one piece.',
    description_es: 'El diente se extrae cuidadosamente en una sola pieza.',
    visualType: 'realistic-illustration',
    visualSrc: "https://img.rocket.new/generatedImages/rocket_gen_img_17de7ff13-1766892620571.png",
    visualAlt: 'Clean schematic illustration showing a tooth lifted from the socket without instruments'
  },
  {
    title_en: 'Gauze and Aftercare',
    title_es: 'Gasa y Cuidados Posteriores',
    description_en: 'Gauze is placed to control bleeding and healing instructions are provided.',
    description_es: 'Se coloca gasa para controlar el sangrado y se proporcionan instrucciones de sanación.',
    visualType: 'realistic-illustration',
    visualSrc: "/assets/images/tmphcsiivbp-1766902495195.jpg",
    visualAlt: 'Aftercare instruction guide showing first 24 hours post-extraction care including bleeding control, pain management, activity restrictions, and follow-up care guidelines'
  }]
},

{
  id: 'wisdom-teeth-education',
  name_en: 'Why Wisdom Teeth Are Often Removed',
  name_es: 'Por Qué Se Extraen las Muelas del Juicio',
  category: 'education',
  duration: 'Educational content',
  heroImage: "/assets/images/Untitled-1766948442145.jpeg",
  heroImageAlt: '3D illustration showing wisdom teeth crowding and their impact on adjacent teeth with anatomical cross-section for patient education',
  description_en: 'Understanding why wisdom teeth often need to be removed and what to expect from the process.',
  description_es: 'Comprender por qué las muelas del juicio a menudo necesitan ser extraídas y qué esperar del proceso.',
  why_needed_en: 'Educational resource to help patients understand wisdom teeth problems and removal benefits.',
  why_needed_es: 'Recurso educativo para ayudar a los pacientes a comprender los problemas de las muelas del juicio y los beneficios de la extracción.',
  what_to_expect_en: 'Learn about wisdom teeth development, common problems, and treatment options.',
  what_to_expect_es: 'Aprenda sobre el desarrollo de las muelas del juicio, problemas comunes y opciones de tratamiento.',
  aftercare_en: 'This is educational content to help you make informed decisions about wisdom teeth care.',
  aftercare_es: 'Este es contenido educativo para ayudarle a tomar decisiones informadas sobre el cuidado de las muelas del juicio.',
  visualGuideSteps: [
  {
    title_en: 'What Are Wisdom Teeth?',
    title_es: '¿Qué Son las Muelas del Juicio?',
    description_en: 'Wisdom teeth are the last molars to develop, usually appearing in the late teens or early twenties.',
    description_es: 'Las muelas del juicio son los últimos molares en desarrollarse, generalmente aparecen a finales de la adolescencia o principios de los veinte.',
    visualType: 'realistic-illustration',
    visualSrc: "/assets/images/IMG_0252-1766977947312.png",
    visualAlt: 'Panoramic dental X-ray showing wisdom teeth locations marked with red arrows indicating third molars at the back of both upper and lower jaws'
  },
  {
    title_en: 'What common problems can they cause (Even without pain)',
    title_es: 'Qué problemas comunes pueden causar (Incluso sin dolor)',
    description_en: 'Wisdom teeth often do not have enough room to fully erupt, which can lead to hidden problems even if they don\'t hurt. Problems may include infection, decay, damage to nearby teeth, cyst formation, food trapping, and pressure on adjacent teeth.',
    description_es: 'Las muelas del juicio a menudo no tienen suficiente espacio para erupcionar completamente, lo que puede llevar a problemas ocultos incluso si no duelen. Los problemas pueden incluir infección, caries, daño a los dientes cercanos, formación de quistes, atrapamiento de alimentos y presión sobre dientes adyacentes.',
    visualType: 'realistic-illustration',
    visualSrc: "/assets/images/tmpfnm2uoms-1766979080322.jpg",
    visualAlt: 'Panoramic dental X-ray showing impacted wisdom tooth with red arrow indicating potential problems including crowding, decay risk, and impact on adjacent teeth even without pain'
  },
  {
    title_en: 'Why Removing Them Earlier Is Often Better',
    title_es: 'Por Qué Extraerlas Temprano Es Mejor',
    description_en: 'Removing wisdom teeth earlier often leads to easier healing and fewer complications.',
    description_es: 'Extraer las muelas del juicio temprano a menudo conduce a una sanación más fácil y menos complicaciones.',
    visualType: 'realistic-illustration',
    visualSrc: "https://img.rocket.new/generatedImages/rocket_gen_img_1cd6184c4-1766892761605.png",
    visualAlt: 'Comparison diagram showing younger jaw with shorter roots versus older jaw with fully developed roots to illustrate age-related healing differences'
  },
  {
    title_en: 'What to Expect',
    title_es: 'Qué Esperar',
    description_en: 'The procedure is performed with comfort-focused anesthesia followed by a healing period.',
    description_es: 'El procedimiento se realiza con anestesia enfocada en la comodidad seguida de un período de sanación.',
    visualType: 'realistic-illustration',
    visualSrc: "https://img.rocket.new/generatedImages/rocket_gen_img_1babbe4f9-1766892727421.png",
    visualAlt: 'Timeline-style icons showing sedation consultation, removal day, and healing recovery phases without showing surgical instruments or procedures'
  }]
},

{
  id: 'valplast-education',
  name_en: 'Flexible Partial Denture (Valplast)',
  name_es: 'Prótesis Parcial Flexible (Valplast)',
  category: 'education',
  duration: 'Educational content',
  heroImage: "/assets/images/IMG_0260-1766980471593.png",
  heroImageAlt: 'Actual Valplast flexible partial denture with pink gum-colored base and natural-looking artificial teeth, showing flexible thermoplastic material design',
  description_en: 'Understanding flexible partial dentures and how they replace missing teeth with comfort and natural appearance.',
  description_es: 'Comprender las prótesis parciales flexibles y cómo reemplazan los dientes faltantes con comodidad y apariencia natural.',
  why_needed_en: 'Educational resource to help patients understand flexible partial denture benefits and what to expect.',
  why_needed_es: 'Recurso educativo para ayudar a los pacientes a comprender los beneficios de las prótesis parciales flexibles y qué esperar.',
  what_to_expect_en: 'Learn about flexible partial dentures, their advantages, fabrication process, and comfort.',
  what_to_expect_es: 'Aprenda sobre las prótesis parciales flexibles, sus ventajas, proceso de fabricación y comodidad.',
  aftercare_en: 'This is educational content to help you make informed decisions about flexible partial dentures.',
  aftercare_es: 'Este es contenido educativo para ayudarle a tomar decisiones informadas sobre prótesis parciales flexibles.',
  visualGuideSteps: [
  {
    title_en: 'What Problem Does It Solve?',
    title_es: '¿Qué Problema Resuelve?',
    description_en: 'Missing teeth can cause shifting, bite problems, and difficulty chewing.',
    description_es: 'Los dientes faltantes pueden causar desplazamiento, problemas de mordida y dificultad para masticar.',
    visualType: 'realistic-illustration',
    visualSrc: "/assets/images/tmpe572ld59-1766981055272.jpg",
    visualAlt: '3D dental illustration showing tooth crowding, shifting, and positioning problems caused by missing teeth with red arrows indicating problem areas for patient education'
  },
  {
    title_en: 'What Is a Flexible Partial Denture?',
    title_es: '¿Qué Es una Prótesis Parcial Flexible?',
    description_en: 'A flexible partial denture replaces missing teeth using a lightweight, gum-colored base for a natural appearance.',
    description_es: 'Una prótesis parcial flexible reemplaza los dientes faltantes usando una base ligera del color de las encías para una apariencia natural.',
    visualType: 'realistic-illustration',
    visualSrc: "/assets/images/IMG_0266-1766981361304.png",
    visualAlt: '3D rendering showing upper and lower flexible partial dentures with pink gum-colored bases and natural-looking replacement teeth demonstrating how they fit in the mouth'
  },
  {
    title_en: 'Why Choose a Flexible Partial?',
    title_es: '¿Por Qué Elegir una Parcial Flexible?',
    description_en: 'Flexible partials are comfortable, lightweight, metal-free, and blend naturally.',
    description_es: 'Las parciales flexibles son cómodas, ligeras, libres de metal y se mezclan naturalmente.',
    visualType: 'realistic-illustration',
    visualSrc: "/assets/images/IMG_0261-1766981134015.png",
    visualAlt: 'Hands holding flexible partial dentures demonstrating their flexibility and natural appearance showing the comfort and adaptability of the thermoplastic material'
  },
  {
    title_en: 'How It\'s Made',
    title_es: 'Cómo Se Hace',
    description_en: 'Custom impressions are taken, followed by lab fabrication and final fitting.',
    description_es: 'Se toman impresiones personalizadas, seguidas de fabricación en laboratorio y ajuste final.',
    visualType: 'realistic-illustration',
    visualSrc: "/assets/images/tmp7ifvjca9-1766981484800.jpg",
    visualAlt: 'Side-by-side comparison showing traditional PVS impression tray method versus modern digital scanning technology for dental impression taking'
  },
  {
    title_en: 'What Wearing It Feels Like',
    title_es: 'Cómo Se Siente Usarla',
    description_en: 'Most patients adjust quickly and enjoy improved comfort and function.',
    description_es: 'La mayoría de los pacientes se ajustan rápidamente y disfrutan de mayor comodidad y función.',
    visualType: 'realistic-illustration',
    visualSrc: "https://images.unsplash.com/photo-1663182245833-7dd667277043",
    visualAlt: 'Friendly illustration of a natural smile without close-up mouth photography'
  }]
}];

// Helper function to get procedure by ID with fallback
export const getProcedureById = (id) => {
  const procedure = proceduresLibrary?.find((p) => p?.id === id);

  // Return procedure if found
  if (procedure) return procedure;

  // Fallback for unknown procedures
  return {
    id: id || 'unknown',
    category: 'general',
    duration: '30-60 minutes',
    name_en: 'Dental Procedure',
    name_es: 'Procedimiento Dental',
    heroImage: "https://img.rocket.new/generatedImages/rocket_gen_img_13710147d-1770493515884.png",
    heroImageAlt: 'General dental procedure illustration',
    description_en: 'This dental procedure will be explained by your dentist.',
    description_es: 'Este procedimiento dental será explicado por su dentista.',
    visualGuideSteps: []
  };
};

// Get all procedures
export const getAllProcedures = () => proceduresLibrary;

// Get procedures by category
export const getProceduresByCategory = (category) => {
  return proceduresLibrary?.filter((p) => p?.category === category);
};

export default proceduresLibrary;
function procedures(...args) {
  // eslint-disable-next-line no-console
  console.warn('Placeholder: procedures is not implemented yet.', args);
  return null;
}

export { procedures };
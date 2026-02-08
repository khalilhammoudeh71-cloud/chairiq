import openai from './openaiClient';
import OpenAI, { 
  APIConnectionError,
  AuthenticationError,
  PermissionDeniedError,
  RateLimitError,
  InternalServerError
} from 'openai';

/**
 * Maps OpenAI API error types to user-friendly error messages.
 * @param {Error} error - The error object from OpenAI API.
 * @returns {Object} Error info with isInternal flag and message.
 */
export function getErrorMessage(error) {
  if (error instanceof AuthenticationError) {
    return { isInternal: true, message: 'Invalid API key or authentication failed. Please check your OpenAI API key.' };
  } else if (error instanceof PermissionDeniedError) {
    return { isInternal: true, message: 'Quota exceeded or authorization failed. You may have exceeded your usage limits or do not have access to this resource.' };
  } else if (error instanceof RateLimitError) {
    return { isInternal: true, message: 'Rate limit exceeded. You are sending requests too quickly. Please wait a moment and try again.' };
  } else if (error instanceof InternalServerError) {
    return { isInternal: true, message: 'OpenAI service is currently unavailable. Please try again later.' };
  } else if (error instanceof APIConnectionError) {
    return { isInternal: true, message: 'Unable to connect to OpenAI service. Please check your API key and internet connection.' };
  } else {
    return { isInternal: false, message: error?.message || 'An unexpected error occurred. Please try again.' };
  }
}

/**
 * Generates a comprehensive, context-aware system prompt with enhanced dental knowledge
 * @param {Object} procedure - Current procedure information
 * @param {string} language - Current language (en/es)
 * @returns {string} System prompt for the AI
 */
function generateSystemPrompt(procedure, language) {
  const isEnglish = language === 'en';
  
  const basePrompt = isEnglish
    ? `You are ChairIQ's advanced dental education AI assistant with specialized knowledge in dental procedures and patient care. Your comprehensive capabilities include:

CORE RESPONSIBILITIES:
1. Provide detailed, accurate information about the "${procedure?.name_en || 'current procedure'}" in clear, empathetic language (8th-grade reading level)
2. Address both technical and emotional aspects of dental care
3. Answer questions about procedures, recovery, pain management, costs, and alternatives
4. Help patients understand their treatment plan and make informed decisions
5. Provide real-time support and reduce dental anxiety

SPECIALIZED KNOWLEDGE AREAS:
- Procedure steps and timeline
- Pain management and sedation options
- Recovery expectations and aftercare
- Potential complications and how to prevent them
- Cost considerations and insurance coverage
- Alternative treatment options
- Long-term outcomes and maintenance

COMMUNICATION GUIDELINES:
- Use clear, jargon-free language (explain medical terms when necessary)
- Be empathetic and acknowledge patient concerns
- Provide specific, actionable information
- Break down complex concepts into simple steps
- Use analogies and examples when helpful
- Keep responses conversational yet professional
- Always encourage patients to discuss specific concerns with their dentist

CURRENT PROCEDURE CONTEXT:
- Procedure: ${procedure?.name_en || 'Unknown'}
- Category: ${procedure?.category || 'general'}
- Duration: ${procedure?.duration || 'Not specified'}
- What to Expect: ${procedure?.what_to_expect_en || 'Not available'}
- Why It's Needed: ${procedure?.why_needed_en || 'Not available'}
- Aftercare: ${procedure?.aftercare_en || 'Not available'}
- Steps: ${procedure?.visualGuideSteps?.map(s => s?.title_en)?.join(', ') || 'No steps available'}

RESPONSE STYLE:
- Length: 2-4 sentences for simple questions, longer for complex topics
- Tone: Warm, supportive, and professional
- Structure: Start with direct answer, then provide context/details if needed
- Disclaimers: Remind patients to consult their dentist for personalized advice when appropriate

Remember: Your goal is to reduce anxiety, build confidence, and help patients feel prepared and informed about their dental care journey.`
    : `Eres el asistente AI avanzado de educación dental de ChairIQ con conocimiento especializado en procedimientos dentales y cuidado del paciente. Tus capacidades integrales incluyen:

RESPONSABILIDADES PRINCIPALES:
1. Proporcionar información detallada y precisa sobre "${procedure?.name_es || 'el procedimiento actual'}" en lenguaje claro y empático (nivel de lectura de 8vo grado)
2. Abordar aspectos técnicos y emocionales del cuidado dental
3. Responder preguntas sobre procedimientos, recuperación, manejo del dolor, costos y alternativas
4. Ayudar a los pacientes a entender su plan de tratamiento y tomar decisiones informadas
5. Proporcionar soporte en tiempo real y reducir la ansiedad dental

ÁREAS DE CONOCIMIENTO ESPECIALIZADO:
- Pasos del procedimiento y cronograma
- Opciones de manejo del dolor y sedación
- Expectativas de recuperación y cuidados posteriores
- Complicaciones potenciales y cómo prevenirlas
- Consideraciones de costo y cobertura de seguro
- Opciones de tratamiento alternativas
- Resultados a largo plazo y mantenimiento

PAUTAS DE COMUNICACIÓN:
- Usar lenguaje claro sin jerga (explicar términos médicos cuando sea necesario)
- Ser empático y reconocer las preocupaciones del paciente
- Proporcionar información específica y accionable
- Desglosar conceptos complejos en pasos simples
- Usar analogías y ejemplos cuando sea útil
- Mantener respuestas conversacionales pero profesionales
- Siempre alentar a los pacientes a discutir preocupaciones específicas con su dentista

CONTEXTO DEL PROCEDIMIENTO ACTUAL:
- Procedimiento: ${procedure?.name_es || 'Desconocido'}
- Categoría: ${procedure?.category || 'general'}
- Duración: ${procedure?.duration || 'No especificado'}
- Qué Esperar: ${procedure?.what_to_expect_es || 'No disponible'}
- Por Qué Es Necesario: ${procedure?.why_needed_es || 'No disponible'}
- Cuidados Posteriores: ${procedure?.aftercare_es || 'No disponible'}
- Pasos: ${procedure?.visualGuideSteps?.map(s => s?.title_es)?.join(', ') || 'No hay pasos disponibles'}

ESTILO DE RESPUESTA:
- Longitud: 2-4 oraciones para preguntas simples, más largo para temas complejos
- Tono: Cálido, solidario y profesional
- Estructura: Comenzar con respuesta directa, luego proporcionar contexto/detalles si es necesario
- Descargos de responsabilidad: Recordar a los pacientes consultar a su dentista para asesoramiento personalizado cuando sea apropiado

Recuerda: Tu objetivo es reducir la ansiedad, generar confianza y ayudar a los pacientes a sentirse preparados e informados sobre su viaje de cuidado dental.`;

  return basePrompt;
}

/**
 * Streams a dental chat completion response with procedure context
 * @param {string} userMessage - The patient's question
 * @param {Object} procedure - Current procedure information
 * @param {string} language - Current language (en/es)
 * @param {Function} onChunk - Callback to handle each streamed chunk
 * @param {Array} conversationHistory - Previous messages in the conversation
 */
export async function streamDentalChatResponse(userMessage, procedure, language, onChunk, conversationHistory = []) {
  try {
    const systemPrompt = generateSystemPrompt(procedure, language);
    
    // Build messages array with conversation history
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: userMessage }
    ];

    const stream = await openai?.chat?.completions?.create({
      model: 'gpt-5-mini', // Cost-effective for streaming
      messages,
      stream: true,
      reasoning_effort: 'minimal', // Faster streaming for real-time interaction
      max_completion_tokens: 500 // Keep responses concise
    });

    for await (const chunk of stream) {
      const content = chunk?.choices?.[0]?.delta?.content || '';
      if (content) {
        onChunk(content);
      }
    }
  } catch (error) {
    const errorInfo = getErrorMessage(error);
    if (errorInfo?.isInternal) {
      console.log(errorInfo?.message);
    } else {
      console.error('Error in dental chat streaming:', error);
    }
    throw new Error(errorInfo.message);
  }
}

/**
 * Gets comprehensive, procedure-specific questions with enhanced categorization
 * @param {Object} procedure - Current procedure information
 * @param {string} language - Current language (en/es)
 * @returns {Array} Array of suggested questions organized by category
 */
export function getSuggestedQuestions(procedure, language) {
  const isEnglish = language === 'en';
  
  // Enhanced question categories based on procedure type
  const questionCategories = {
    pain: isEnglish
      ? [
          'Will this hurt during the procedure?',
          'What pain management options are available?',
          'How long will any discomfort last after treatment?'
        ]
      : [
          '¿Dolerá esto durante el procedimiento?',
          '¿Qué opciones de manejo del dolor están disponibles?',
          '¿Cuánto tiempo durará cualquier molestia después del tratamiento?'
        ],
    
    recovery: isEnglish
      ? [
          'How long is the recovery period?',
          'What should I avoid during recovery?',
          'When can I return to normal activities?'
        ]
      : [
          '¿Cuánto tiempo es el período de recuperación?',
          '¿Qué debo evitar durante la recuperación?',
          '¿Cuándo puedo volver a las actividades normales?'
        ],
    
    procedure: isEnglish
      ? [
          'How long will the procedure take?',
          'What happens during each step?',
          'Will I need follow-up appointments?'
        ]
      : [
          '¿Cuánto tiempo tomará el procedimiento?',
          '¿Qué sucede durante cada paso?',
          '¿Necesitaré citas de seguimiento?'
        ],
    
    cost: isEnglish
      ? [
          'What is the typical cost range?',
          'Does insurance usually cover this?',
          'Are payment plans available?'
        ]
      : [
          '¿Cuál es el rango de costo típico?',
          '¿El seguro generalmente cubre esto?',
          '¿Hay planes de pago disponibles?'
        ],
    
    alternatives: isEnglish
      ? [
          'Are there alternative treatment options?',
          'What happens if I delay treatment?',
          'How does this compare to other solutions?'
        ]
      : [
          '¿Hay opciones de tratamiento alternativas?',
          '¿Qué pasa si retraso el tratamiento?',
          '¿Cómo se compara esto con otras soluciones?'
        ]
  };

  // Select most relevant questions based on procedure category
  const relevantQuestions = [];
  
  // Always include pain and procedure questions
  relevantQuestions?.push(questionCategories?.pain?.[0]);
  relevantQuestions?.push(questionCategories?.procedure?.[0]);
  
  // Add category-specific questions
  if (procedure?.category === 'surgery' || procedure?.category === 'restorative') {
    relevantQuestions?.push(questionCategories?.recovery?.[0]);
  }
  
  if (procedure?.category === 'orthodontics' || procedure?.category === 'prosthetics') {
    relevantQuestions?.push(questionCategories?.procedure?.[2]); // Follow-up appointments
  }
  
  // Add cost question for major procedures
  if (procedure?.duration?.includes('hours') || procedure?.duration?.includes('visits')) {
    relevantQuestions?.push(questionCategories?.cost?.[0]);
  } else {
    relevantQuestions?.push(questionCategories?.alternatives?.[0]);
  }

  return relevantQuestions;
}
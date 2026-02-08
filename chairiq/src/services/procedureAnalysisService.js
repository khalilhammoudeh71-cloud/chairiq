import openai from './openaiClient';
import { getErrorMessage } from './dentalChatService';

/**
 * Analyzes a dental procedure and generates comprehensive patient-facing insights
 * @param {Object} procedure - Procedure information
 * @param {string} language - Language for the response (en/es)
 * @returns {Promise<Object>} Analysis results with key insights
 */
export async function analyzeProcedure(procedure, language = 'en') {
  const isEnglish = language === 'en';
  
  const systemPrompt = isEnglish
    ? `You are an expert dental educator. Analyze the following dental procedure and provide:
1. A brief overview (2-3 sentences)
2. Three key benefits for the patient
3. Three common concerns patients have
4. Three important preparation steps
5. Three post-procedure care tips

Return the response as a JSON object with keys: overview, benefits, concerns, preparation, aftercare (each as arrays except overview).`
    : `Eres un educador dental experto. Analiza el siguiente procedimiento dental y proporciona:
1. Una breve descripción general (2-3 oraciones)
2. Tres beneficios clave para el paciente
3. Tres preocupaciones comunes que tienen los pacientes
4. Tres pasos importantes de preparación
5. Tres consejos de cuidado posterior al procedimiento

Devuelve la respuesta como un objeto JSON con claves: overview, benefits, concerns, preparation, aftercare (cada uno como matrices excepto overview).`;

  const procedureContext = isEnglish
    ? `Procedure: ${procedure?.name_en}
Duration: ${procedure?.duration}
What to Expect: ${procedure?.what_to_expect_en}
Why It's Needed: ${procedure?.why_needed_en}
Steps: ${procedure?.visualGuideSteps?.map(s => s?.description_en)?.join(', ')}`
    : `Procedimiento: ${procedure?.name_es}
Duración: ${procedure?.duration}
Qué Esperar: ${procedure?.what_to_expect_es}
Por Qué Es Necesario: ${procedure?.why_needed_es}
Pasos: ${procedure?.visualGuideSteps?.map(s => s?.description_es)?.join(', ')}`;

  try {
    const response = await openai?.chat?.completions?.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: procedureContext }
      ],
      reasoning_effort: 'high', // Enhanced analysis quality
      max_completion_tokens: 1000,
      response_format: { type: 'json_object' }
    });

    const content = response?.choices?.[0]?.message?.content;
    return JSON.parse(content);
  } catch (error) {
    console.error('Error analyzing procedure:', error);
    throw new Error(getErrorMessage(error)?.message);
  }
}

/**
 * Generates personalized pre-procedure questions based on patient context
 * @param {Object} procedure - Procedure information
 * @param {Object} patientContext - Patient-specific information (age, concerns, etc.)
 * @param {string} language - Language for questions (en/es)
 * @returns {Promise<Array>} Array of personalized questions
 */
export async function generatePersonalizedQuestions(procedure, patientContext = {}, language = 'en') {
  const isEnglish = language === 'en';
  
  const systemPrompt = isEnglish
    ? `You are a dental patient advocate. Generate 5 personalized questions a patient should ask their dentist about this procedure. 
Consider the patient's context and make questions practical, anxiety-reducing, and empowering.
Return as a JSON array of strings.`
    : `Eres un defensor del paciente dental. Genera 5 preguntas personalizadas que un paciente debería hacerle a su dentista sobre este procedimiento.
Considera el contexto del paciente y haz preguntas prácticas, que reduzcan la ansiedad y empoderen.
Devuelve como una matriz JSON de cadenas.`;

  const contextPrompt = isEnglish
    ? `Procedure: ${procedure?.name_en}
Patient Context: ${JSON.stringify(patientContext)}
Focus on questions about: timing, pain management, recovery, costs, and alternatives.`
    : `Procedimiento: ${procedure?.name_es}
Contexto del Paciente: ${JSON.stringify(patientContext)}
Enfócate en preguntas sobre: tiempo, manejo del dolor, recuperación, costos y alternativas.`;

  try {
    const response = await openai?.chat?.completions?.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: contextPrompt }
      ],
      reasoning_effort: 'medium',
      max_completion_tokens: 500,
      response_format: { type: 'json_object' }
    });

    const content = response?.choices?.[0]?.message?.content;
    const result = JSON.parse(content);
    return result?.questions || [];
  } catch (error) {
    console.error('Error generating questions:', error);
    throw new Error(getErrorMessage(error)?.message);
  }
}

/**
 * Gets intelligent follow-up questions based on conversation context
 * @param {Array} conversationHistory - Previous messages in the conversation
 * @param {Object} procedure - Current procedure information
 * @param {string} language - Current language (en/es)
 * @returns {Promise<Array>} Array of contextual follow-up questions
 */
export async function getIntelligentFollowUps(conversationHistory, procedure, language = 'en') {
  const isEnglish = language === 'en';
  
  const systemPrompt = isEnglish
    ? `You are an AI assistant analyzing a dental consultation conversation. Based on what the patient has asked so far, suggest 3 relevant follow-up questions they might want to ask next. 
Make these questions natural, conversational, and directly related to topics already discussed.
Return as a JSON array of strings.`
    : `Eres un asistente AI analizando una conversación de consulta dental. Basándote en lo que el paciente ha preguntado hasta ahora, sugiere 3 preguntas de seguimiento relevantes que podrían querer hacer a continuación.
Haz estas preguntas naturales, conversacionales y directamente relacionadas con temas ya discutidos.
Devuelve como una matriz JSON de cadenas.`;

  const contextPrompt = isEnglish
    ? `Procedure: ${procedure?.name_en}
Recent conversation:
${conversationHistory?.slice(-4)?.map(msg => `${msg?.role}: ${msg?.content}`)?.join('\n')}`
    : `Procedimiento: ${procedure?.name_es}
Conversación reciente:
${conversationHistory?.slice(-4)?.map(msg => `${msg?.role}: ${msg?.content}`)?.join('\n')}`;

  try {
    const response = await openai?.chat?.completions?.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: contextPrompt }
      ],
      reasoning_effort: 'low',
      max_completion_tokens: 300,
      response_format: { type: 'json_object' }
    });

    const content = response?.choices?.[0]?.message?.content;
    const result = JSON.parse(content);
    return result?.questions || [];
  } catch (error) {
    console.error('Error generating follow-up questions:', error);
    return []; // Return empty array on error instead of throwing
  }
}
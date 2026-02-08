import openai from './openaiClient';
import { 
  APIConnectionError,
  AuthenticationError,
  PermissionDeniedError,
  RateLimitError,
  InternalServerError
} from 'openai';

/**
 * Maps OpenAI API error types to user-friendly error messages.
 * @param {Error} error - The error object from OpenAI API.
 * @returns {Object} Error information with isInternal flag and message.
 */
function getErrorMessage(error) {
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
 * Cache for storing generated visual descriptions to avoid redundant API calls
 * Key format: `${procedureName}_${stepTitle}_${language}`
 */
const visualDescriptionCache = new Map();

/**
 * Generates an AI-powered visual description for a procedure step when image is missing.
 * This helps patients understand what they would normally see visually during placeholder states.
 * 
 * @param {Object} params - Parameters for generating visual description
 * @param {string} params.procedureName - Name of the procedure (e.g., "Crown", "Root Canal")
 * @param {string} params.stepTitle - Title of the specific step
 * @param {string} params.stepBody - Detailed body text of the step
 * @param {string} params.language - Language code ('EN' or 'ES')
 * @returns {Promise<string>} AI-generated visual description
 */
export async function generateVisualDescription({ 
  procedureName, 
  stepTitle, 
  stepBody, 
  language = 'EN' 
}) {
  try {
    // Check cache first
    const cacheKey = `${procedureName}_${stepTitle}_${language}`;
    if (visualDescriptionCache?.has(cacheKey)) {
      return visualDescriptionCache?.get(cacheKey);
    }

    const systemPrompt = language === 'EN' 
      ? `You are a dental education specialist creating visual descriptions for patients. 
         When an educational image is unavailable, provide a clear, calm, and descriptive text 
         that helps patients visualize what they would normally see in the image.
         
         Guidelines:
         - Be specific and descriptive about what patients would see
         - Use calm, reassuring language (avoid alarming terms)
         - Focus on visual elements: colors, shapes, positioning, instruments
         - Keep descriptions concise (2-3 sentences max)
         - Make it educational but not technical
         - Help patients mentally picture the procedure step`
      : `Eres un especialista en educación dental que crea descripciones visuales para pacientes.
         Cuando no hay una imagen educativa disponible, proporciona un texto claro, tranquilo y descriptivo
         que ayude a los pacientes a visualizar lo que normalmente verían en la imagen.
         
         Pautas:
         - Sé específico y descriptivo sobre lo que los pacientes verían
         - Usa un lenguaje tranquilo y reconfortante (evita términos alarmantes)
         - Enfócate en elementos visuales: colores, formas, posicionamiento, instrumentos
         - Mantén las descripciones concisas (máximo 2-3 oraciones)
         - Hazlo educativo pero no técnico
         - Ayuda a los pacientes a imaginar mentalmente el paso del procedimiento`;

    const userPrompt = language === 'EN'
      ? `Create a visual description for this dental procedure step:
         
         Procedure: ${procedureName}
         Step: ${stepTitle}
         Details: ${stepBody}
         
         Describe what patients would see in an educational image for this step.
         Focus on helping them visualize the procedure clearly and calmly.`
      : `Crea una descripción visual para este paso del procedimiento dental:
         
         Procedimiento: ${procedureName}
         Paso: ${stepTitle}
         Detalles: ${stepBody}
         
         Describe lo que los pacientes verían en una imagen educativa para este paso.
         Enfócate en ayudarles a visualizar el procedimiento de manera clara y tranquila.`;

    const response = await openai?.chat?.completions?.create({
      model: 'gpt-5-mini', // Cost-effective for fast generation
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      reasoning_effort: 'minimal', // Fast generation for descriptions
      verbosity: 'low', // Concise, patient-friendly descriptions
      max_completion_tokens: 150, // Limit description length
    });

    const visualDescription = response?.choices?.[0]?.message?.content;

    // Cache the result
    visualDescriptionCache?.set(cacheKey, visualDescription);

    return visualDescription;
  } catch (error) {
    const errorInfo = getErrorMessage(error);
    if (errorInfo?.isInternal) {
      console.log(errorInfo?.message);
    } else {
      console.error('Error generating visual description:', error);
    }
    
    // Return a friendly fallback instead of throwing
    return language === 'EN' ?'Visual description temporarily unavailable. Please refer to the detailed text explanation above.' :'Descripción visual temporalmente no disponible. Por favor, consulte la explicación detallada del texto arriba.';
  }
}

/**
 * Generates visual descriptions for multiple steps in batch.
 * More efficient than calling generateVisualDescription individually.
 * 
 * @param {Object} params - Parameters for batch generation
 * @param {string} params.procedureName - Name of the procedure
 * @param {Array} params.steps - Array of step objects with title and body
 * @param {string} params.language - Language code ('EN' or 'ES')
 * @returns {Promise<Object>} Object mapping step titles to visual descriptions
 */
export async function generateVisualDescriptionsBatch({ 
  procedureName, 
  steps, 
  language = 'EN' 
}) {
  try {
    const descriptions = {};
    
    // Generate descriptions for each step
    await Promise.all(
      steps?.map(async (step) => {
        const description = await generateVisualDescription({
          procedureName,
          stepTitle: step?.title,
          stepBody: step?.body,
          language,
        });
        descriptions[step?.title] = description;
      })
    );

    return descriptions;
  } catch (error) {
    console.error('Error generating batch visual descriptions:', error);
    return {};
  }
}

/**
 * Clears the visual description cache.
 * Useful for testing or forcing regeneration.
 */
export function clearVisualDescriptionCache() {
  visualDescriptionCache?.clear();
}

export default {
  generateVisualDescription,
  generateVisualDescriptionsBatch,
  clearVisualDescriptionCache,
};
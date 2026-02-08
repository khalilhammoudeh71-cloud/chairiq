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
    return { isInternal: true, message: 'Quota exceeded or authorization failed. You may have exceeded your usage limits.' };
  } else if (error instanceof RateLimitError) {
    return { isInternal: true, message: 'Rate limit exceeded. Please wait a moment and try again.' };
  } else if (error instanceof InternalServerError) {
    return { isInternal: true, message: 'OpenAI service is currently unavailable. Please try again later.' };
  } else if (error instanceof APIConnectionError) {
    return { isInternal: true, message: 'Unable to connect to OpenAI service. Please check your API key and internet connection.' };
  } else {
    return { isInternal: false, message: error?.message || 'An unexpected error occurred. Please try again.' };
  }
}

/**
 * Generates speech audio from text using OpenAI's TTS API with natural-sounding female voice.
 * @param {string} text - The text to convert to speech.
 * @param {string} language - Language code ('en' or 'es').
 * @returns {Promise<string>} URL to the generated audio file.
 */
export async function generateSpeechAudio(text, language = 'en') {
  if (!text) {
    throw new Error('Text is required for speech generation');
  }

  try {
    // Use gpt-4o-mini-tts for natural, human-quality audio with professional female voice
    const voiceInstructions = language === 'es' ?'Habla con un tono cálido, profesional y tranquilizador, adecuado para un entorno médico dental. Enfatiza la compasión y usa pausas naturales para permitir que la información sea procesada. Evita la jerga técnica a menos que sea necesario, y cuando se use, explícala de manera simple.' :'Speak in a warm, friendly, and professional tone suitable for a dental medical setting. Emphasize compassion and use natural pauses to allow information to be processed. Avoid technical jargon unless necessary, and when used, explain it simply.';

    const response = await openai?.audio?.speech?.create({
      model: 'gpt-4o-mini-tts',
      voice: 'nova', // Warm, professional female voice - ideal for healthcare
      input: text,
      response_format: 'mp3',
      voice_instructions: voiceInstructions
    });

    // Convert the response to a blob and create an object URL
    const audioBlob = new Blob([await response.arrayBuffer()], { type: 'audio/mpeg' });
    const audioUrl = URL.createObjectURL(audioBlob);

    return audioUrl;
  } catch (error) {
    const errorInfo = getErrorMessage(error);
    if (errorInfo?.isInternal) {
      console.log(errorInfo?.message);
    } else {
      console.error('Error generating speech:', error);
    }
    throw new Error(errorInfo.message);
  }
}

/**
 * Cleans up audio URL to free memory.
 * @param {string} audioUrl - The audio URL to revoke.
 */
export function revokeAudioUrl(audioUrl) {
  if (audioUrl && audioUrl?.startsWith('blob:')) {
    URL.revokeObjectURL(audioUrl);
  }
}
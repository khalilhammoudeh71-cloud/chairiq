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
 * Generates dental procedure description using OpenAI GPT-5.
 * @param {Object} params - Generation parameters
 * @param {string} params.procedureTitle - Title of the procedure
 * @param {string} params.clinicalSpecs - Clinical specifications
 * @param {string} params.language - Language code (en/es)
 * @param {string} params.tone - Content tone (professional/friendly/simple)
 * @param {string} params.complexity - Complexity level (basic/detailed/comprehensive)
 * @returns {Promise<string>} Generated procedure description
 */
export async function generateProcedureDescription(params) {
  const { procedureTitle, clinicalSpecs, language = 'en', tone = 'professional', complexity = 'detailed' } = params;
  
  const systemPrompt = `You are a dental content expert creating patient-friendly procedure descriptions.
Language: ${language === 'en' ? 'English' : 'Spanish'}
Tone: ${tone}
Complexity: ${complexity}

Create a comprehensive procedure description that includes:
1. Brief overview (2-3 sentences)
2. What the procedure involves
3. Expected duration and number of visits
4. Who needs this procedure
5. Benefits and outcomes

Use ${language === 'en' ? 'English' : 'Spanish'} language and maintain a ${tone} tone suitable for ${complexity} understanding.`;

  try {
    const response = await openai?.chat?.completions?.create({
      model: 'gpt-5-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Generate a patient-friendly description for: ${procedureTitle}\n\nClinical specifications: ${clinicalSpecs}` },
      ],
      reasoning_effort: 'medium',
      verbosity: 'medium',
      max_completion_tokens: 1000
    });

    return response?.choices?.[0]?.message?.content;
  } catch (error) {
    const errorInfo = getErrorMessage(error);
    if (errorInfo?.isInternal) {
      console.log(errorInfo?.message);
    } else {
      console.error('Error generating procedure description:', error);
    }
    throw new Error(errorInfo.message);
  }
}

/**
 * Generates risk assessment and contraindications.
 * @param {Object} params - Generation parameters
 * @param {string} params.procedureTitle - Title of the procedure
 * @param {string} params.clinicalSpecs - Clinical specifications
 * @param {string} params.language - Language code (en/es)
 * @returns {Promise<string>} Generated risk assessment
 */
export async function generateRiskAssessment(params) {
  const { procedureTitle, clinicalSpecs, language = 'en' } = params;
  
  const systemPrompt = `You are a dental risk assessment specialist.
Language: ${language === 'en' ? 'English' : 'Spanish'}

Create a comprehensive risk assessment that includes:
1. Common risks and side effects (with likelihood)
2. Rare but serious complications
3. Contraindications
4. Who should avoid this procedure
5. Special considerations

Format with clear headings and bullet points. Use ${language === 'en' ? 'English' : 'Spanish'} language.`;

  try {
    const response = await openai?.chat?.completions?.create({
      model: 'gpt-5-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Generate risk assessment for: ${procedureTitle}\n\nClinical specifications: ${clinicalSpecs}` },
      ],
      reasoning_effort: 'high',
      verbosity: 'high',
      max_completion_tokens: 1200
    });

    return response?.choices?.[0]?.message?.content;
  } catch (error) {
    const errorInfo = getErrorMessage(error);
    if (errorInfo?.isInternal) {
      console.log(errorInfo?.message);
    } else {
      console.error('Error generating risk assessment:', error);
    }
    throw new Error(errorInfo.message);
  }
}

/**
 * Generates aftercare instructions.
 * @param {Object} params - Generation parameters
 * @param {string} params.procedureTitle - Title of the procedure
 * @param {string} params.clinicalSpecs - Clinical specifications
 * @param {string} params.language - Language code (en/es)
 * @returns {Promise<string>} Generated aftercare instructions
 */
export async function generateAftercareInstructions(params) {
  const { procedureTitle, clinicalSpecs, language = 'en' } = params;
  
  const systemPrompt = `You are a dental aftercare specialist.
Language: ${language === 'en' ? 'English' : 'Spanish'}

Create comprehensive aftercare instructions that include:
1. Immediate post-procedure care (first 24 hours)
2. First week care guidelines
3. Pain management
4. Diet restrictions
5. Oral hygiene instructions
6. Warning signs to watch for
7. When to contact the dentist
8. Follow-up appointment timeline

Use clear headings and actionable bullet points. Use ${language === 'en' ? 'English' : 'Spanish'} language.`;

  try {
    const response = await openai?.chat?.completions?.create({
      model: 'gpt-5-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Generate aftercare instructions for: ${procedureTitle}\n\nClinical specifications: ${clinicalSpecs}` },
      ],
      reasoning_effort: 'medium',
      verbosity: 'high',
      max_completion_tokens: 1500
    });

    return response?.choices?.[0]?.message?.content;
  } catch (error) {
    const errorInfo = getErrorMessage(error);
    if (errorInfo?.isInternal) {
      console.log(errorInfo?.message);
    } else {
      console.error('Error generating aftercare instructions:', error);
    }
    throw new Error(errorInfo.message);
  }
}

/**
 * Generates frequently asked questions with answers.
 * @param {Object} params - Generation parameters
 * @param {string} params.procedureTitle - Title of the procedure
 * @param {string} params.clinicalSpecs - Clinical specifications
 * @param {string} params.language - Language code (en/es)
 * @param {number} params.numberOfFAQs - Number of FAQs to generate (default: 8)
 * @returns {Promise<Array>} Array of FAQ objects {q, a}
 */
export async function generateFAQs(params) {
  const { procedureTitle, clinicalSpecs, language = 'en', numberOfFAQs = 8 } = params;
  
  const systemPrompt = `You are a dental education specialist creating patient FAQs.
Language: ${language === 'en' ? 'English' : 'Spanish'}

Generate ${numberOfFAQs} frequently asked questions with comprehensive answers about the procedure.

Questions should cover:
- Procedure basics and what to expect
- Cost and insurance considerations
- Pain and recovery
- Alternative treatments
- Long-term outcomes
- Common patient concerns

Return ONLY a valid JSON array with this exact structure:
[{"q": "question text", "a": "detailed answer"}]

Use ${language === 'en' ? 'English' : 'Spanish'} language. Ensure answers are evidence-based and patient-friendly.`;

  try {
    const response = await openai?.chat?.completions?.create({
      model: 'gpt-5-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Generate ${numberOfFAQs} FAQs for: ${procedureTitle}\n\nClinical specifications: ${clinicalSpecs}` },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'faq_response',
          schema: {
            type: 'object',
            properties: {
              faqs: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    q: { type: 'string' },
                    a: { type: 'string' }
                  },
                  required: ['q', 'a']
                }
              }
            },
            required: ['faqs'],
            additionalProperties: false
          }
        }
      },
      reasoning_effort: 'medium',
      verbosity: 'medium',
      max_completion_tokens: 2000
    });

    const result = JSON.parse(response?.choices?.[0]?.message?.content);
    return result?.faqs;
  } catch (error) {
    const errorInfo = getErrorMessage(error);
    if (errorInfo?.isInternal) {
      console.log(errorInfo?.message);
    } else {
      console.error('Error generating FAQs:', error);
    }
    throw new Error(errorInfo.message);
  }
}

/**
 * Generates all content types in batch for a procedure.
 * @param {Object} params - Generation parameters
 * @param {string} params.procedureTitle - Title of the procedure
 * @param {string} params.clinicalSpecs - Clinical specifications
 * @param {string} params.language - Language code (en/es)
 * @param {string} params.tone - Content tone
 * @param {string} params.complexity - Complexity level
 * @returns {Promise<Object>} Object containing all generated content
 */
export async function generateAllContent(params) {
  try {
    const [description, risks, aftercare, faqs] = await Promise.all([
      generateProcedureDescription(params),
      generateRiskAssessment(params),
      generateAftercareInstructions(params),
      generateFAQs(params)
    ]);

    return {
      description,
      risks,
      aftercare,
      faqs,
      generatedAt: new Date()?.toISOString()
    };
  } catch (error) {
    const errorInfo = getErrorMessage(error);
    throw new Error(errorInfo.message);
  }
}
import openai from './openaiClient';
import genAI from './geminiClient';
import {
  APIConnectionError,
  AuthenticationError,
  PermissionDeniedError,
  RateLimitError,
  InternalServerError,
} from 'openai';

/**
 * AI Personalization Service
 * Uses OpenAI and Gemini to dynamically adapt content based on patient engagement patterns
 */

/**
 * Maps OpenAI API error types to user-friendly error messages.
 * @param {Error} error - The error object from OpenAI API.
 * @returns {Object} Error information with isInternal flag and message.
 */
function getOpenAIErrorMessage(error) {
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
 * Handles common Gemini API errors with user-friendly messages.
 * @param {Error} error - The error object from the API.
 * @returns {Object} Error information with message, isInternal flag, and status code.
 */
function handleGeminiError(error) {
  if (error?.status === 401 || error?.message?.toLowerCase()?.includes('api key')) {
    return { isInternal: true, message: error?.message };
  }

  if (error?.status === 403 || error?.message?.toLowerCase()?.includes('forbidden')) {
    return { isInternal: true, message: error?.message };
  }

  if (error?.status === 404 || error?.message?.toLowerCase()?.includes('not found')) {
    return { isInternal: true, message: error?.message };
  }

  if (error?.status === 429 || error?.message?.toLowerCase()?.includes('rate limit exceeded')) {
    return { isInternal: true, message: error?.message };
  }

  if (error?.status >= 500) {
    return { isInternal: true, message: error?.message };
  }

  return {
    isInternal: false,
    message: error?.message,
  };
}

export const aiPersonalizationService = {
  /**
   * Adapt procedure explanation based on patient learning profile (OpenAI)
   * @param {Object} params - Personalization parameters
   * @returns {Promise<string>} Personalized explanation
   */
  async adaptProcedureExplanation(params) {
    const {
      procedureName,
      baseExplanation,
      learningProfile,
      language = 'en',
    } = params;

    try {
      const systemPrompt = `You are a dental education specialist adapting procedure explanations based on patient learning patterns.

Patient Learning Profile:
- Engagement Level: ${learningProfile?.engagementPatterns?.engagementLevel}
- Learning Pace: ${learningProfile?.engagementPatterns?.learningPace}
- Content Preference: ${learningProfile?.engagementPatterns?.contentPreference}
- Attention Span: ${learningProfile?.engagementPatterns?.attentionSpan}
- Total Engagement Time: ${Math.round((learningProfile?.totalEngagementTime || 0) / 60)} minutes
- Procedures Viewed: ${learningProfile?.totalProceduresViewed}
- Procedures Completed: ${learningProfile?.totalProceduresCompleted}

Adaptation Guidelines:
- For LOW engagement: Use shorter, simpler sentences with more encouragement
- For HIGH engagement: Provide more detailed technical information
- For VISUAL preference: Include more descriptive imagery and spatial references
- For TEXT preference: Focus on clear, detailed written explanations
- For SHORT attention span: Break into smaller, digestible chunks
- For LONG attention span: Provide comprehensive, interconnected information
- For SLOW learning pace: Add more context, analogies, and reassurance
- For FAST learning pace: Be concise and focus on key clinical details

Language: ${language === 'en' ? 'English' : 'Spanish'}

Adapt the explanation to match the patient's learning style while maintaining medical accuracy.`;

      const userPrompt = `Adapt this procedure explanation for "${procedureName}":

${baseExplanation}

Provide an adapted version that matches the patient's learning profile.`;

      const response = await openai?.chat?.completions?.create({
        model: 'gpt-5-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        reasoning_effort: 'medium',
        verbosity: learningProfile?.engagementPatterns?.attentionSpan === 'long' ? 'high' : 'medium',
        max_completion_tokens: learningProfile?.engagementPatterns?.attentionSpan === 'short' ? 500 : 1000,
      });

      return response?.choices?.[0]?.message?.content;
    } catch (error) {
      const errorInfo = getOpenAIErrorMessage(error);
      if (errorInfo?.isInternal) {
        console.log('Error adapting procedure explanation:', errorInfo?.message);
      } else {
        console.error('Error adapting procedure explanation:', error);
      }
      throw new Error(errorInfo.message);
    }
  },

  /**
   * Adapt complexity level and expectations based on learning history (Gemini)
   * @param {Object} params - Personalization parameters
   * @returns {Promise<Array>} Adapted expectation steps
   */
  async adaptComplexityLevel(params) {
    const {
      procedureName,
      baseExpectations,
      learningProfile,
      procedureEngagementHistory,
      language = 'en',
    } = params;

    try {
      const model = genAI?.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const prompt = `You are a dental education specialist adapting procedure complexity levels based on patient learning history.

Patient Learning Profile:
- Engagement Level: ${learningProfile?.engagementPatterns?.engagementLevel}
- Learning Pace: ${learningProfile?.engagementPatterns?.learningPace}
- Attention Span: ${learningProfile?.engagementPatterns?.attentionSpan}
- Total Procedures Completed: ${learningProfile?.totalProceduresCompleted}

Procedure-Specific History:
- Times Viewed: ${procedureEngagementHistory?.viewCount || 0}
- Total Time Spent: ${Math.round((procedureEngagementHistory?.totalTimeSpent || 0) / 60)} minutes
- Sections Viewed: ${procedureEngagementHistory?.sectionsViewed?.join(', ') || 'None'}

Adaptation Rules:
- First-time viewers: Provide comprehensive, step-by-step details
- Repeat viewers: Focus on key points they may have missed
- High engagement + repeat views: Add advanced details and clinical context
- Low engagement: Simplify and add more reassurance
- Fast learners: Increase technical depth
- Slow learners: Add more analogies and everyday comparisons

Language: ${language === 'en' ? 'English' : 'Spanish'}

Adapt these "What to Expect" steps for "${procedureName}":

${JSON.stringify(baseExpectations, null, 2)}

Return a JSON array of adapted steps with this structure:
[
  {
    "phase": "Phase name",
    "description": "Adapted description",
    "duration": "Time estimate"
  }
]

Provide ONLY the JSON array, no additional text.`;

      const result = await model?.generateContent(prompt);
      const response = await result?.response;
      const text = response?.text();

      // Extract JSON from response
      const jsonMatch = text?.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch?.[0]);
      }

      // Fallback: return base expectations if parsing fails
      return baseExpectations;
    } catch (error) {
      const errorInfo = handleGeminiError(error);
      if (errorInfo?.isInternal) {
        console.log('Error adapting complexity level:', errorInfo?.message);
      } else {
        console.error('Error adapting complexity level:', error);
      }
      // Return base expectations on error
      return baseExpectations;
    }
  },

  /**
   * Adapt aftercare instructions based on patient engagement patterns (OpenAI)
   * @param {Object} params - Personalization parameters
   * @returns {Promise<string>} Personalized aftercare instructions
   */
  async adaptAftercareInstructions(params) {
    const {
      procedureName,
      baseAftercare,
      learningProfile,
      language = 'en',
    } = params;

    try {
      const systemPrompt = `You are a dental care specialist adapting aftercare instructions based on patient learning patterns.

Patient Learning Profile:
- Engagement Level: ${learningProfile?.engagementPatterns?.engagementLevel}
- Learning Pace: ${learningProfile?.engagementPatterns?.learningPace}
- Content Preference: ${learningProfile?.engagementPatterns?.contentPreference}
- Attention Span: ${learningProfile?.engagementPatterns?.attentionSpan}

Adaptation Guidelines:
- For LOW engagement: Use bullet points, simple language, and clear action items
- For HIGH engagement: Provide detailed explanations of WHY each step matters
- For VISUAL preference: Include descriptive references ("swelling should look like...")
- For TEXT preference: Provide comprehensive written instructions
- For SHORT attention span: Prioritize the 3-5 most critical instructions
- For LONG attention span: Include comprehensive care timeline and what to expect each day
- For SLOW learning pace: Add more reassurance and "this is normal" statements
- For FAST learning pace: Focus on clinical precision and warning signs

Language: ${language === 'en' ? 'English' : 'Spanish'}

Adapt the aftercare instructions to match the patient's learning style while ensuring all critical safety information is included.`;

      const userPrompt = `Adapt these aftercare instructions for "${procedureName}":

${baseAftercare}

Provide adapted aftercare instructions that match the patient's learning profile.`;

      const response = await openai?.chat?.completions?.create({
        model: 'gpt-5-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        reasoning_effort: 'medium',
        verbosity: learningProfile?.engagementPatterns?.attentionSpan === 'long' ? 'high' : 'medium',
        max_completion_tokens: learningProfile?.engagementPatterns?.attentionSpan === 'short' ? 400 : 800,
      });

      return response?.choices?.[0]?.message?.content;
    } catch (error) {
      const errorInfo = getOpenAIErrorMessage(error);
      if (errorInfo?.isInternal) {
        console.log('Error adapting aftercare instructions:', errorInfo?.message);
      } else {
        console.error('Error adapting aftercare instructions:', error);
      }
      throw new Error(errorInfo.message);
    }
  },

  /**
   * Generate personalized procedure summary using both AI services
   * @param {Object} params - Personalization parameters
   * @returns {Promise<Object>} Comprehensive personalized content
   */
  async generatePersonalizedContent(params) {
    const {
      procedureName,
      baseContent,
      learningProfile,
      procedureEngagementHistory,
      language = 'en',
    } = params;

    try {
      // Use OpenAI for explanation and aftercare (text-heavy)
      const [adaptedExplanation, adaptedAftercare] = await Promise.all([
        this.adaptProcedureExplanation({
          procedureName,
          baseExplanation: baseContent?.explanation,
          learningProfile,
          language,
        }),
        this.adaptAftercareInstructions({
          procedureName,
          baseAftercare: baseContent?.aftercare,
          learningProfile,
          language,
        }),
      ]);

      // Use Gemini for complexity level (structured data)
      const adaptedExpectations = await this.adaptComplexityLevel({
        procedureName,
        baseExpectations: baseContent?.expectations,
        learningProfile,
        procedureEngagementHistory,
        language,
      });

      return {
        explanation: adaptedExplanation,
        expectations: adaptedExpectations,
        aftercare: adaptedAftercare,
        personalizedAt: new Date()?.toISOString(),
        adaptedFor: {
          engagementLevel: learningProfile?.engagementPatterns?.engagementLevel,
          learningPace: learningProfile?.engagementPatterns?.learningPace,
          contentPreference: learningProfile?.engagementPatterns?.contentPreference,
        },
      };
    } catch (error) {
      console.error('Error generating personalized content:', error);
      throw error;
    }
  },
};
import OpenAI, {
  APIConnectionError,
  AuthenticationError,
  PermissionDeniedError,
  RateLimitError,
  InternalServerError,
} from 'openai';
import openai from './openaiClient';
import { getAllConversations, getConversationsByProcedure } from './conversationHistoryService';
import { getProcedureById } from '../data/procedures';

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
 * Generates a personalized learning journey summary for a specific procedure.
 * @param {string} procedureId - The procedure identifier.
 * @returns {Promise<Object>} Summary with key insights, progress, and recommendations.
 */
export async function generateProcedureSummary(procedureId) {
  try {
    // Get procedure details
    const procedure = getProcedureById(procedureId);
    if (!procedure) {
      throw new Error('Procedure not found');
    }

    // Get conversation history for this procedure
    const conversations = getConversationsByProcedure(procedureId);
    
    // Prepare conversation context
    const conversationContext = conversations
      ?.map((conv) => {
        const messages = conv?.messages
          ?.map((msg) => `${msg?.role === 'user' ? 'Patient' : 'AI'}: ${msg?.content}`)
          ?.join('\n');
        return `Conversation (${new Date(conv?.createdAt)?.toLocaleDateString()}):\n${messages}`;
      })
      ?.join('\n\n');

    // Create structured prompt
    const systemPrompt = `You are a dental education specialist analyzing a patient's learning journey for the "${procedure?.name_en}" procedure. 
    
Your task is to create a personalized summary that helps patients understand their learning progress and retention.

Focus on:
1. Key concepts the patient has understood well
2. Topics where they asked multiple questions (indicating areas of concern)
3. Evolution of their understanding over time
4. Practical tips based on their specific concerns
5. Encouraging insights about their engagement`;

    const userPrompt = `Analyze this patient's learning journey for "${procedure?.name_en}":

Procedure Overview:
- Description: ${procedure?.description_en}
- Why Needed: ${procedure?.why_needed_en}
- Duration: ${procedure?.duration}

Patient's Conversation History:
${conversationContext || 'No conversations yet.'}

Generate a personalized learning journey summary in this exact JSON structure.`;

    const response = await openai?.chat?.completions?.create({
      model: 'gpt-5',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'learning_journey_summary',
          schema: {
            type: 'object',
            properties: {
              overallProgress: {
                type: 'string',
                description: 'Brief overview of the patient\'s learning journey and engagement level',
              },
              keyInsights: {
                type: 'array',
                items: { type: 'string' },
                description: 'List of 3-5 key concepts the patient has learned or mastered',
              },
              areasOfFocus: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    topic: { type: 'string', description: 'Area where patient showed particular interest or concern' },
                    summary: { type: 'string', description: 'Brief explanation of what they learned' },
                  },
                  required: ['topic', 'summary'],
                },
                description: 'Topics the patient focused on with explanations',
              },
              recommendations: {
                type: 'array',
                items: { type: 'string' },
                description: 'Personalized recommendations for continued learning or preparation',
              },
              retentionScore: {
                type: 'number',
                description: 'Estimated retention score from 0-100 based on conversation depth and engagement',
              },
              encouragement: {
                type: 'string',
                description: 'Personalized encouraging message about their learning journey',
              },
            },
            required: ['overallProgress', 'keyInsights', 'areasOfFocus', 'recommendations', 'retentionScore', 'encouragement'],
            additionalProperties: false,
          },
        },
      },
      reasoning_effort: 'high',
      verbosity: 'medium',
    });

    const summaryData = JSON?.parse(response?.choices?.[0]?.message?.content);

    return {
      procedureId,
      procedureName: procedure?.name_en,
      generatedAt: new Date()?.toISOString(),
      conversationCount: conversations?.length || 0,
      ...summaryData,
    };
  } catch (error) {
    const errorInfo = getErrorMessage(error);
    if (errorInfo?.isInternal) {
      console?.log(errorInfo?.message);
    } else {
      console?.error('Error generating procedure summary:', error);
    }
    throw new Error(errorInfo?.message);
  }
}

/**
 * Generates a comprehensive learning journey summary across all procedures.
 * @returns {Promise<Object>} Overall learning journey summary with procedure-specific insights.
 */
export async function generateOverallLearningSummary() {
  try {
    // Get all conversations
    const allConversations = getAllConversations();
    const procedureIds = Object?.keys(allConversations);

    if (procedureIds?.length === 0) {
      return {
        message: 'No conversations found yet. Start chatting to build your learning journey!',
        procedureSummaries: [],
      };
    }

    // Generate summaries for each procedure with conversations
    const procedureSummaries = await Promise?.all(
      procedureIds?.map(async (procedureId) => {
        try {
          return await generateProcedureSummary(procedureId);
        } catch (error) {
          console?.error(`Error generating summary for procedure ${procedureId}:`, error);
          return null;
        }
      })
    );

    // Filter out failed summaries
    const validSummaries = procedureSummaries?.filter((summary) => summary !== null);

    // Calculate overall stats
    const totalConversations = validSummaries?.reduce((sum, s) => sum + s?.conversationCount, 0);
    const avgRetention = validSummaries?.length > 0
      ? validSummaries?.reduce((sum, s) => sum + s?.retentionScore, 0) / validSummaries?.length
      : 0;

    return {
      generatedAt: new Date()?.toISOString(),
      totalProcedures: validSummaries?.length,
      totalConversations,
      averageRetention: Math?.round(avgRetention),
      procedureSummaries: validSummaries,
    };
  } catch (error) {
    const errorInfo = getErrorMessage(error);
    if (errorInfo?.isInternal) {
      console?.log(errorInfo?.message);
    } else {
      console?.error('Error generating overall learning summary:', error);
    }
    throw new Error(errorInfo?.message);
  }
}

/**
 * Generates a quick retention insight for a specific conversation.
 * @param {string} procedureId - The procedure identifier.
 * @param {string} conversationId - The conversation identifier.
 * @returns {Promise<string>} Quick insight about this conversation.
 */
export async function generateConversationInsight(procedureId, conversationId) {
  try {
    const conversations = getConversationsByProcedure(procedureId);
    const conversation = conversations?.find((c) => c?.id === conversationId);

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    const procedure = getProcedureById(procedureId);
    const messages = conversation?.messages
      ?.map((msg) => `${msg?.role === 'user' ? 'Patient' : 'AI'}: ${msg?.content}`)
      ?.join('\n');

    const response = await openai?.chat?.completions?.create({
      model: 'gpt-5-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a dental education specialist. Provide a brief, encouraging insight about this patient conversation in 1-2 sentences.',
        },
        {
          role: 'user',
          content: `Procedure: ${procedure?.name_en}\n\nConversation:\n${messages}\n\nProvide a brief insight about what the patient learned or their engagement.`,
        },
      ],
      reasoning_effort: 'low',
      verbosity: 'low',
    });

    return response?.choices?.[0]?.message?.content;
  } catch (error) {
    const errorInfo = getErrorMessage(error);
    if (errorInfo?.isInternal) {
      console?.log(errorInfo?.message);
    } else {
      console?.error('Error generating conversation insight:', error);
    }
    throw new Error(errorInfo?.message);
  }
}
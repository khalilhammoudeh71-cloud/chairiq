import openai from './openaiClient';
import OpenAI, { 
  APIConnectionError,
  AuthenticationError,
  PermissionDeniedError,
  RateLimitError,
  InternalServerError
} from 'openai';
import { supabase } from '../lib/supabase';
import { getDisplayNameForCanonicalSlug } from '../utils/adaCodeMappings';

/**
 * Maps OpenAI API error types to user-friendly error messages.
 * @param {Error} error - The error object from OpenAI API.
 * @returns {Object} Error info with isInternal flag and message.
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
 * Procedure Education Content Generator Service
 * Generates high-quality patient education content using OpenAI GPT-5
 */
export const procedureEducationGeneratorService = {
  /**
   * Generate complete patient education content for a dental procedure
   * @param {string} canonicalSlug - Canonical procedure slug
   * @param {string} procedureName - Human-readable procedure name
   * @param {string} adaCode - ADA code (optional, for context)
   * @returns {Promise<Object>} Generated content in Gold Standard format (EN/ES)
   */
  async generateProcedureEducation(canonicalSlug, procedureName, adaCode = null) {
    try {
      const displayName = procedureName || getDisplayNameForCanonicalSlug(canonicalSlug);
      
      // Construct comprehensive prompt for GPT-5
      const systemPrompt = `You are an expert dental educator creating patient-friendly educational content.

CRITICAL REQUIREMENTS:
- Reading level: 6th-8th grade (simple, clear language)
- Tone: Professional but warm, NOT salesy
- Accuracy: Clinically accurate dental information
- Disclaimer: NEVER claim this is personalized medical advice
- Format: Structured sections matching the Gold Standard Patient Education Format

Generate content that helps patients understand their dental procedure clearly and builds confidence.`;

      const userPrompt = `Generate comprehensive patient education content for this dental procedure:

**Procedure:** ${displayName}
**Canonical Slug:** ${canonicalSlug}
${adaCode ? `**ADA Code:** ${adaCode}` : ''}

**Required Sections (in this exact order):**

1. **What this is** (2-3 sentences)
   - Simple definition of the procedure
   - What it accomplishes

2. **Why you need it** (3-4 sentences)
   - Common reasons for this treatment
   - Benefits to oral health
   - What problems it prevents/solves

3. **How it works** (4-5 sentences)
   - Brief overview of the procedure steps
   - What the patient experiences
   - Duration and visits typically required

4. **Time and visits** (1-2 sentences)
   - Typical duration per visit
   - Number of appointments usually needed

5. **Benefits** (3-4 bullet points)
   - Key advantages of this treatment
   - What patients gain

6. **If you delay** (2-3 sentences)
   - Potential consequences of postponing treatment
   - Why timely treatment matters
   - (Keep this factual, not fear-based)

7. **What to expect after** (4-5 sentences)
   - Post-procedure care instructions
   - Normal healing timeline
   - When to contact the dentist

8. **FAQ** (8-10 questions)
   - Common patient concerns
   - Questions about pain, cost, alternatives, etc.
   - Each answer: 2-3 sentences max

**CRITICAL CONSTRAINTS:**
- 6th-8th grade reading level
- NO medical jargon without simple explanations
- NO graphic descriptions of procedures
- NO salesy language ("amazing results", "best choice", etc.)
- Include disclaimer that this is general information, not personalized medical advice
- Be accurate and clinically sound
- Use a warm, reassuring tone

**IMPORTANT:** Return content in a structured JSON format with both English (EN) and Spanish (ES) versions.`;

      // Generate content using GPT-5 with structured output
      const response = await openai?.chat?.completions?.create({
        model: 'gpt-5-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'procedure_education_content',
            schema: {
              type: 'object',
              properties: {
                title_en: { type: 'string' },
                title_es: { type: 'string' },
                summary_en: { type: 'string' },
                summary_es: { type: 'string' },
                why_en: { type: 'string' },
                why_es: { type: 'string' },
                steps_en: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      title: { type: 'string' },
                      description: { type: 'string' }
                    },
                    required: ['title', 'description']
                  }
                },
                steps_es: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      title: { type: 'string' },
                      description: { type: 'string' }
                    },
                    required: ['title', 'description']
                  }
                },
                aftercare_en: { type: 'string' },
                aftercare_es: { type: 'string' },
                what_if_not_en: { type: 'string' },
                what_if_not_es: { type: 'string' },
                faqs_en: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      q: { type: 'string' },
                      a: { type: 'string' }
                    },
                    required: ['q', 'a']
                  }
                },
                faqs_es: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      q: { type: 'string' },
                      a: { type: 'string' }
                    },
                    required: ['q', 'a']
                  }
                },
                time_estimate: { type: 'string' },
                visits_estimate: { type: 'string' }
              },
              required: [
                'title_en', 'title_es', 'summary_en', 'summary_es',
                'why_en', 'why_es', 'steps_en', 'steps_es',
                'aftercare_en', 'aftercare_es', 'what_if_not_en', 'what_if_not_es',
                'faqs_en', 'faqs_es', 'time_estimate', 'visits_estimate'
              ],
              additionalProperties: false
            }
          }
        },
        reasoning_effort: 'medium',
        verbosity: 'medium',
      });

      const generatedContent = JSON.parse(response?.choices?.[0]?.message?.content);

      return {
        success: true,
        content: generatedContent
      };
    } catch (error) {
      const errorInfo = getErrorMessage(error);
      if (errorInfo?.isInternal) {
        console.log(errorInfo?.message);
      } else {
        console.error('Error generating procedure education:', error);
      }
      return {
        success: false,
        error: errorInfo?.message
      };
    }
  },

  /**
   * Generate and save procedure education content to Supabase
   * @param {string} canonicalSlug - Canonical procedure slug
   * @param {string} procedureName - Human-readable procedure name
   * @param {string} adaCode - ADA code
   * @param {string} userId - User ID (dentist creating content)
   * @returns {Promise<Object>} Saved procedure library entry
   */
  async generateAndSaveProcedureEducation(canonicalSlug, procedureName, adaCode, userId = null) {
    try {
      // Generate content
      const generationResult = await this.generateProcedureEducation(
        canonicalSlug,
        procedureName,
        adaCode
      );

      if (!generationResult?.success) {
        throw new Error(generationResult.error);
      }

      const content = generationResult?.content;

      // Prepare data for Supabase
      const procedureData = {
        slug: canonicalSlug,
        canonical_slug: canonicalSlug,
        title_en: content?.title_en,
        title_es: content?.title_es,
        summary_en: content?.summary_en,
        summary_es: content?.summary_es,
        why_en: content?.why_en,
        why_es: content?.why_es,
        steps_en: content?.steps_en,
        steps_es: content?.steps_es,
        aftercare_en: content?.aftercare_en,
        aftercare_es: content?.aftercare_es,
        what_if_not_en: content?.what_if_not_en,
        what_if_not_es: content?.what_if_not_es,
        faqs_en: content?.faqs_en,
        faqs_es: content?.faqs_es,
        time_estimate: content?.time_estimate,
        visits_estimate: content?.visits_estimate,
        is_published: true,
        created_by: userId,
        category: 'AI-generated'
      };

      // UPSERT to procedure_library (update if exists, insert if not)
      const { data: savedProcedure, error: upsertError } = await supabase?.from('procedure_library')?.upsert(procedureData, {
          onConflict: 'canonical_slug',
          ignoreDuplicates: false
        })?.select()?.single();

      if (upsertError) {
        console.error('Error saving generated content to Supabase:', upsertError);
        throw upsertError;
      }

      return {
        success: true,
        procedure: {
          id: savedProcedure?.id,
          canonicalSlug: savedProcedure?.canonical_slug,
          titleEn: savedProcedure?.title_en,
          titleEs: savedProcedure?.title_es,
          summaryEn: savedProcedure?.summary_en,
          summaryEs: savedProcedure?.summary_es,
          whyEn: savedProcedure?.why_en,
          whyEs: savedProcedure?.why_es,
          stepsEn: savedProcedure?.steps_en,
          stepsEs: savedProcedure?.steps_es,
          aftercareEn: savedProcedure?.aftercare_en,
          aftercareEs: savedProcedure?.aftercare_es,
          whatIfNotEn: savedProcedure?.what_if_not_en,
          whatIfNotEs: savedProcedure?.what_if_not_es,
          faqsEn: savedProcedure?.faqs_en,
          faqsEs: savedProcedure?.faqs_es,
          timeEstimate: savedProcedure?.time_estimate,
          visitsEstimate: savedProcedure?.visits_estimate
        }
      };
    } catch (error) {
      console.error('Error in generateAndSaveProcedureEducation:', error);
      return {
        success: false,
        error: error?.message || 'Failed to generate and save procedure education'
      };
    }
  }
};
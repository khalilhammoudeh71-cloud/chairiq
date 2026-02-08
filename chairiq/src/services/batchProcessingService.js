import { supabase } from '../lib/supabase';
import { 
  generateProcedureDescription,
  generateRiskAssessment,
  generateAftercareInstructions,
  generateFAQs,
  generateAllContent
} from './aiContentGenerationService';

/**
 * Creates a new batch job for content generation
 * @param {Object} params - Batch job parameters
 * @param {string} params.name - Name of the batch job
 * @param {Array} params.procedureIds - Array of procedure IDs to process
 * @param {Array} params.contentTypes - Array of content types to generate
 * @param {Object} params.configuration - Generation configuration
 * @param {string} params.priority - Job priority (low, normal, high, urgent)
 * @param {Date} params.scheduledAt - Optional scheduled execution time
 * @returns {Promise<Object>} Created batch job
 */
export async function createBatchJob(params) {
  const {
    name,
    procedureIds = [],
    contentTypes = ['all'],
    configuration = {},
    priority = 'normal',
    scheduledAt = null
  } = params;

  try {
    const { data: { user } } = await supabase?.auth?.getUser();
    if (!user) throw new Error('User not authenticated');

    // Create the batch job
    const { data: batchJob, error: jobError } = await supabase?.from('batch_jobs')?.insert({
        name,
        created_by: user?.id,
        total_items: procedureIds?.length,
        priority,
        scheduled_at: scheduledAt,
        configuration
      })?.select()?.single();

    if (jobError) throw jobError;

    // Create batch job items
    const batchItems = procedureIds?.map(procedureId => ({
      batch_job_id: batchJob?.id,
      procedure_id: procedureId,
      content_types: contentTypes,
      language: configuration?.language || 'en',
      clinical_specs: configuration?.clinicalSpecs || '',
      tone: configuration?.tone || 'professional',
      complexity: configuration?.complexity || 'detailed',
      target_audience: configuration?.targetAudience || 'general'
    }));

    const { error: itemsError } = await supabase?.from('batch_job_items')?.insert(batchItems);

    if (itemsError) throw itemsError;

    return batchJob;
  } catch (error) {
    console.error('Error creating batch job:', error);
    throw error;
  }
}

/**
 * Gets all batch jobs for the current user
 * @param {Object} filters - Optional filters
 * @returns {Promise<Array>} Array of batch jobs
 */
export async function getBatchJobs(filters = {}) {
  try {
    let query = supabase?.from('batch_jobs')?.select('*')?.order('created_at', { ascending: false });

    if (filters?.status) {
      query = query?.eq('status', filters?.status);
    }

    if (filters?.priority) {
      query = query?.eq('priority', filters?.priority);
    }

    const { data, error } = await query;
    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error fetching batch jobs:', error);
    throw error;
  }
}

/**
 * Gets a single batch job with its items
 * @param {string} jobId - Batch job ID
 * @returns {Promise<Object>} Batch job with items
 */
export async function getBatchJobWithItems(jobId) {
  try {
    const { data: job, error: jobError } = await supabase?.from('batch_jobs')?.select('*')?.eq('id', jobId)?.single();

    if (jobError) throw jobError;

    const { data: items, error: itemsError } = await supabase?.from('batch_job_items')?.select(`
        *,
        procedure:procedure_library(id, title_en, title_es, slug)
      `)?.eq('batch_job_id', jobId)?.order('created_at', { ascending: true });

    if (itemsError) throw itemsError;

    return {
      ...job,
      items: items || []
    };
  } catch (error) {
    console.error('Error fetching batch job details:', error);
    throw error;
  }
}

/**
 * Processes a batch job item
 * @param {string} itemId - Batch job item ID
 * @returns {Promise<Object>} Processing result
 */
export async function processBatchJobItem(itemId) {
  try {
    // Get the item details
    const { data: item, error: fetchError } = await supabase?.from('batch_job_items')?.select(`
        *,
        procedure:procedure_library(title_en, title_es)
      `)?.eq('id', itemId)?.single();

    if (fetchError) throw fetchError;

    // Update status to in_progress
    await supabase?.from('batch_job_items')?.update({ 
        status: 'in_progress',
        processing_started_at: new Date()?.toISOString()
      })?.eq('id', itemId);

    const startTime = Date?.now();

    try {
      // Prepare generation parameters
      const params = {
        procedureTitle: item?.language === 'en' ? item?.procedure?.title_en : item?.procedure?.title_es,
        clinicalSpecs: item?.clinical_specs,
        language: item?.language,
        tone: item?.tone,
        complexity: item?.complexity,
        targetAudience: item?.target_audience
      };

      let generatedContent = {};

      // Generate content based on content types
      if (item?.content_types?.includes('all')) {
        generatedContent = await generateAllContent(params);
      } else {
        const promises = [];
        if (item?.content_types?.includes('description')) {
          promises?.push(generateProcedureDescription(params)?.then(result => ({ description: result })));
        }
        if (item?.content_types?.includes('risks')) {
          promises?.push(generateRiskAssessment(params)?.then(result => ({ risks: result })));
        }
        if (item?.content_types?.includes('aftercare')) {
          promises?.push(generateAftercareInstructions(params)?.then(result => ({ aftercare: result })));
        }
        if (item?.content_types?.includes('faqs')) {
          promises?.push(generateFAQs(params)?.then(result => ({ faqs: result })));
        }

        const results = await Promise.all(promises);
        generatedContent = Object.assign({}, ...results);
      }

      const processingDuration = Math?.floor((Date?.now() - startTime) / 1000);

      // Update item with generated content
      const { error: updateError } = await supabase?.from('batch_job_items')?.update({
          status: 'completed',
          generated_content: generatedContent,
          processing_completed_at: new Date()?.toISOString(),
          processing_duration_seconds: processingDuration
        })?.eq('id', itemId);

      if (updateError) throw updateError;

      // Log success
      await logBatchJobEvent(item?.batch_job_id, itemId, 'info', 'Item processed successfully', {
        duration_seconds: processingDuration,
        content_types: item?.content_types
      });

      return { success: true, generatedContent };
    } catch (generationError) {
      // Update item with error
      await supabase?.from('batch_job_items')?.update({
          status: 'failed',
          error_message: generationError?.message,
          retry_count: item?.retry_count + 1,
          processing_completed_at: new Date()?.toISOString()
        })?.eq('id', itemId);

      // Log error
      await logBatchJobEvent(item?.batch_job_id, itemId, 'error', 'Item processing failed', {
        error: generationError?.message,
        retry_count: item?.retry_count + 1
      });

      throw generationError;
    }
  } catch (error) {
    console.error('Error processing batch job item:', error);
    throw error;
  }
}

/**
 * Starts processing a batch job
 * @param {string} jobId - Batch job ID
 * @returns {Promise<void>}
 */
export async function startBatchJobProcessing(jobId) {
  try {
    // Update job status
    await supabase?.from('batch_jobs')?.update({
        status: 'in_progress',
        started_at: new Date()?.toISOString()
      })?.eq('id', jobId);

    // Get all pending items
    const { data: items, error } = await supabase?.from('batch_job_items')?.select('id')?.eq('batch_job_id', jobId)?.eq('status', 'pending')?.order('created_at', { ascending: true });

    if (error) throw error;

    // Process items sequentially to avoid rate limits
    for (const item of items || []) {
      try {
        await processBatchJobItem(item?.id);
      } catch (itemError) {
        console.error(`Error processing item ${item?.id}:`, itemError);
        // Continue processing other items even if one fails
      }
    }

    await logBatchJobEvent(jobId, null, 'info', 'Batch job processing completed');
  } catch (error) {
    console.error('Error starting batch job processing:', error);
    
    // Update job status to failed
    await supabase?.from('batch_jobs')?.update({
        status: 'failed',
        error_message: error?.message
      })?.eq('id', jobId);

    throw error;
  }
}

/**
 * Cancels a batch job
 * @param {string} jobId - Batch job ID
 * @returns {Promise<boolean>} Success status
 */
export async function cancelBatchJob(jobId) {
  try {
    const { data, error } = await supabase?.rpc('cancel_batch_job', { job_id: jobId });

    if (error) throw error;

    await logBatchJobEvent(jobId, null, 'info', 'Batch job cancelled by user');

    return data;
  } catch (error) {
    console.error('Error cancelling batch job:', error);
    throw error;
  }
}

/**
 * Gets the next scheduled batch job
 * @returns {Promise<Object>} Next scheduled job
 */
export async function getNextScheduledJob() {
  try {
    const { data, error } = await supabase?.rpc('get_next_scheduled_batch_job');

    if (error) throw error;

    return data?.[0] || null;
  } catch (error) {
    console.error('Error getting next scheduled job:', error);
    throw error;
  }
}

/**
 * Applies generated content to procedure library
 * @param {string} itemId - Batch job item ID
 * @returns {Promise<boolean>} Success status
 */
export async function applyGeneratedContent(itemId) {
  try {
    const { data: item, error: fetchError } = await supabase?.from('batch_job_items')?.select('procedure_id, language, generated_content')?.eq('id', itemId)?.single();

    if (fetchError) throw fetchError;

    const langSuffix = item?.language === 'en' ? '_en' : '_es';
    const updates = {};

    if (item?.generated_content?.description) {
      updates[`summary${langSuffix}`] = item?.generated_content?.description;
    }
    if (item?.generated_content?.risks) {
      updates[`risks${langSuffix}`] = item?.generated_content?.risks;
    }
    if (item?.generated_content?.aftercare) {
      updates[`aftercare${langSuffix}`] = item?.generated_content?.aftercare;
    }
    if (item?.generated_content?.faqs) {
      updates[`faqs${langSuffix}`] = item?.generated_content?.faqs;
    }

    const { error: updateError } = await supabase?.from('procedure_library')?.update(updates)?.eq('id', item?.procedure_id);

    if (updateError) throw updateError;

    return true;
  } catch (error) {
    console.error('Error applying generated content:', error);
    throw error;
  }
}

/**
 * Logs a batch job event
 * @param {string} jobId - Batch job ID
 * @param {string} itemId - Batch job item ID (optional)
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {Object} metadata - Additional metadata
 * @returns {Promise<void>}
 */
async function logBatchJobEvent(jobId, itemId, level, message, metadata = {}) {
  try {
    await supabase?.from('batch_job_logs')?.insert({
        batch_job_id: jobId,
        batch_job_item_id: itemId,
        log_level: level,
        message,
        metadata
      });
  } catch (error) {
    console.error('Error logging batch job event:', error);
  }
}

/**
 * Gets logs for a batch job
 * @param {string} jobId - Batch job ID
 * @param {Object} filters - Optional filters
 * @returns {Promise<Array>} Array of log entries
 */
export async function getBatchJobLogs(jobId, filters = {}) {
  try {
    let query = supabase?.from('batch_job_logs')?.select('*')?.eq('batch_job_id', jobId)?.order('created_at', { ascending: false });

    if (filters?.level) {
      query = query?.eq('log_level', filters?.level);
    }

    if (filters?.itemId) {
      query = query?.eq('batch_job_item_id', filters?.itemId);
    }

    const { data, error } = await query;
    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error fetching batch job logs:', error);
    throw error;
  }
}
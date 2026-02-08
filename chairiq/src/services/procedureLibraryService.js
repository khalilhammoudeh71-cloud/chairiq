import { supabase } from '../lib/supabase';

/**
 * Service for managing procedure library CRUD operations
 * Handles snake_case <-> camelCase conversion
 */
export const procedureLibraryService = {
  /**
   * Get all procedures from library
   * @param {Object} filters - Optional filters (category, isPublished, searchQuery)
   * @returns {Promise<Array>} Array of procedure objects
   */
  async getAll(filters = {}) {
    try {
      let query = supabase?.from('procedure_library')?.select('*')?.order('title_en', { ascending: true });

      // Apply filters
      if (filters?.category) {
        query = query?.eq('category', filters?.category);
      }

      if (filters?.isPublished !== undefined) {
        query = query?.eq('is_published', filters?.isPublished);
      }

      if (filters?.searchQuery) {
        query = query?.or(
          `title_en.ilike.%${filters?.searchQuery}%,title_es.ilike.%${filters?.searchQuery}%,slug.ilike.%${filters?.searchQuery}%`
        );
      }

      const { data, error } = await query;

      if (error) throw error;

      // Convert snake_case to camelCase
      return data?.map((row) => ({
        id: row?.id,
        slug: row?.slug,
        titleEn: row?.title_en,
        titleEs: row?.title_es,
        summaryEn: row?.summary_en,
        summaryEs: row?.summary_es,
        whyEn: row?.why_en,
        whyEs: row?.why_es,
        whatIfNotEn: row?.what_if_not_en,
        whatIfNotEs: row?.what_if_not_es,
        stepsEn: row?.steps_en,
        stepsEs: row?.steps_es,
        anesthesiaEn: row?.anesthesia_en,
        anesthesiaEs: row?.anesthesia_es,
        risksEn: row?.risks_en,
        risksEs: row?.risks_es,
        aftercareEn: row?.aftercare_en,
        aftercareEs: row?.aftercare_es,
        faqsEn: row?.faqs_en,
        faqsEs: row?.faqs_es,
        timeEstimate: row?.time_estimate,
        visitsEstimate: row?.visits_estimate,
        visuals: row?.visuals,
        category: row?.category,
        isPublished: row?.is_published,
        createdAt: row?.created_at,
        updatedAt: row?.updated_at,
        createdBy: row?.created_by,
      })) || [];
    } catch (error) {
      console.error('Error fetching procedures:', error);
      throw error;
    }
  },

  /**
   * Get single procedure by slug
   * @param {string} slug - Procedure slug
   * @returns {Promise<Object>} Procedure object
   */
  async getBySlug(slug) {
    try {
      const { data, error } = await supabase?.from('procedure_library')?.select('*')?.eq('slug', slug)?.single();

      if (error) throw error;

      // Convert snake_case to camelCase
      return {
        id: data?.id,
        slug: data?.slug,
        titleEn: data?.title_en,
        titleEs: data?.title_es,
        summaryEn: data?.summary_en,
        summaryEs: data?.summary_es,
        whyEn: data?.why_en,
        whyEs: data?.why_es,
        whatIfNotEn: data?.what_if_not_en,
        whatIfNotEs: data?.what_if_not_es,
        stepsEn: data?.steps_en,
        stepsEs: data?.steps_es,
        anesthesiaEn: data?.anesthesia_en,
        anesthesiaEs: data?.anesthesia_es,
        risksEn: data?.risks_en,
        risksEs: data?.risks_es,
        aftercareEn: data?.aftercare_en,
        aftercareEs: data?.aftercare_es,
        faqsEn: data?.faqs_en,
        faqsEs: data?.faqs_es,
        timeEstimate: data?.time_estimate,
        visitsEstimate: data?.visits_estimate,
        visuals: data?.visuals,
        category: data?.category,
        isPublished: data?.is_published,
        createdAt: data?.created_at,
        updatedAt: data?.updated_at,
        createdBy: data?.created_by,
      };
    } catch (error) {
      console.error('Error fetching procedure:', error);
      throw error;
    }
  },

  /**
   * Create new procedure
   * @param {Object} procedure - Procedure data (camelCase)
   * @returns {Promise<Object>} Created procedure
   */
  async create(procedure) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      // Convert camelCase to snake_case for database
      const { data, error } = await supabase?.from('procedure_library')?.insert({
          slug: procedure?.slug,
          title_en: procedure?.titleEn,
          title_es: procedure?.titleEs,
          summary_en: procedure?.summaryEn,
          summary_es: procedure?.summaryEs,
          why_en: procedure?.whyEn,
          why_es: procedure?.whyEs,
          what_if_not_en: procedure?.whatIfNotEn,
          what_if_not_es: procedure?.whatIfNotEs,
          steps_en: procedure?.stepsEn,
          steps_es: procedure?.stepsEs,
          anesthesia_en: procedure?.anesthesiaEn,
          anesthesia_es: procedure?.anesthesiaEs,
          risks_en: procedure?.risksEn,
          risks_es: procedure?.risksEs,
          aftercare_en: procedure?.aftercareEn,
          aftercare_es: procedure?.aftercareEs,
          faqs_en: procedure?.faqsEn,
          faqs_es: procedure?.faqsEs,
          time_estimate: procedure?.timeEstimate,
          visits_estimate: procedure?.visitsEstimate,
          visuals: procedure?.visuals,
          category: procedure?.category,
          is_published: procedure?.isPublished ?? true,
          created_by: user?.id,
        })?.select()?.single();

      if (error) throw error;

      // Convert back to camelCase
      return {
        id: data?.id,
        slug: data?.slug,
        titleEn: data?.title_en,
        titleEs: data?.title_es,
        summaryEn: data?.summary_en,
        summaryEs: data?.summary_es,
        whyEn: data?.why_en,
        whyEs: data?.why_es,
        whatIfNotEn: data?.what_if_not_en,
        whatIfNotEs: data?.what_if_not_es,
        stepsEn: data?.steps_en,
        stepsEs: data?.steps_es,
        anesthesiaEn: data?.anesthesia_en,
        anesthesiaEs: data?.anesthesia_es,
        risksEn: data?.risks_en,
        risksEs: data?.risks_es,
        aftercareEn: data?.aftercare_en,
        aftercareEs: data?.aftercare_es,
        faqsEn: data?.faqs_en,
        faqsEs: data?.faqs_es,
        timeEstimate: data?.time_estimate,
        visitsEstimate: data?.visits_estimate,
        visuals: data?.visuals,
        category: data?.category,
        isPublished: data?.is_published,
        createdAt: data?.created_at,
        updatedAt: data?.updated_at,
        createdBy: data?.created_by,
      };
    } catch (error) {
      console.error('Error creating procedure:', error);
      throw error;
    }
  },

  /**
   * Update existing procedure
   * @param {string} id - Procedure ID
   * @param {Object} updates - Updated fields (camelCase)
   * @returns {Promise<Object>} Updated procedure
   */
  async update(id, updates) {
    try {
      // Convert camelCase to snake_case
      const dbUpdates = {};
      if (updates?.titleEn !== undefined) dbUpdates.title_en = updates?.titleEn;
      if (updates?.titleEs !== undefined) dbUpdates.title_es = updates?.titleEs;
      if (updates?.summaryEn !== undefined) dbUpdates.summary_en = updates?.summaryEn;
      if (updates?.summaryEs !== undefined) dbUpdates.summary_es = updates?.summaryEs;
      if (updates?.whyEn !== undefined) dbUpdates.why_en = updates?.whyEn;
      if (updates?.whyEs !== undefined) dbUpdates.why_es = updates?.whyEs;
      if (updates?.whatIfNotEn !== undefined) dbUpdates.what_if_not_en = updates?.whatIfNotEn;
      if (updates?.whatIfNotEs !== undefined) dbUpdates.what_if_not_es = updates?.whatIfNotEs;
      if (updates?.stepsEn !== undefined) dbUpdates.steps_en = updates?.stepsEn;
      if (updates?.stepsEs !== undefined) dbUpdates.steps_es = updates?.stepsEs;
      if (updates?.anesthesiaEn !== undefined) dbUpdates.anesthesia_en = updates?.anesthesiaEn;
      if (updates?.anesthesiaEs !== undefined) dbUpdates.anesthesia_es = updates?.anesthesiaEs;
      if (updates?.risksEn !== undefined) dbUpdates.risks_en = updates?.risksEn;
      if (updates?.risksEs !== undefined) dbUpdates.risks_es = updates?.risksEs;
      if (updates?.aftercareEn !== undefined) dbUpdates.aftercare_en = updates?.aftercareEn;
      if (updates?.aftercareEs !== undefined) dbUpdates.aftercare_es = updates?.aftercareEs;
      if (updates?.faqsEn !== undefined) dbUpdates.faqs_en = updates?.faqsEn;
      if (updates?.faqsEs !== undefined) dbUpdates.faqs_es = updates?.faqsEs;
      if (updates?.timeEstimate !== undefined) dbUpdates.time_estimate = updates?.timeEstimate;
      if (updates?.visitsEstimate !== undefined) dbUpdates.visits_estimate = updates?.visitsEstimate;
      if (updates?.visuals !== undefined) dbUpdates.visuals = updates?.visuals;
      if (updates?.category !== undefined) dbUpdates.category = updates?.category;
      if (updates?.isPublished !== undefined) dbUpdates.is_published = updates?.isPublished;

      const { data, error } = await supabase?.from('procedure_library')?.update(dbUpdates)?.eq('id', id)?.select()?.single();

      if (error) throw error;

      // Convert back to camelCase
      return {
        id: data?.id,
        slug: data?.slug,
        titleEn: data?.title_en,
        titleEs: data?.title_es,
        summaryEn: data?.summary_en,
        summaryEs: data?.summary_es,
        whyEn: data?.why_en,
        whyEs: data?.why_es,
        whatIfNotEn: data?.what_if_not_en,
        whatIfNotEs: data?.what_if_not_es,
        stepsEn: data?.steps_en,
        stepsEs: data?.steps_es,
        anesthesiaEn: data?.anesthesia_en,
        anesthesiaEs: data?.anesthesia_es,
        risksEn: data?.risks_en,
        risksEs: data?.risks_es,
        aftercareEn: data?.aftercare_en,
        aftercareEs: data?.aftercare_es,
        faqsEn: data?.faqs_en,
        faqsEs: data?.faqs_es,
        timeEstimate: data?.time_estimate,
        visitsEstimate: data?.visits_estimate,
        visuals: data?.visuals,
        category: data?.category,
        isPublished: data?.is_published,
        createdAt: data?.created_at,
        updatedAt: data?.updated_at,
        createdBy: data?.created_by,
      };
    } catch (error) {
      console.error('Error updating procedure:', error);
      throw error;
    }
  },

  /**
   * Delete procedure
   * @param {string} id - Procedure ID
   * @returns {Promise<void>}
   */
  async delete(id) {
    try {
      const { error } = await supabase?.from('procedure_library')?.delete()?.eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting procedure:', error);
      throw error;
    }
  },

  /**
   * Duplicate procedure (creates copy with new slug)
   * @param {string} id - Procedure ID to duplicate
   * @param {string} newSlug - New slug for duplicated procedure
   * @returns {Promise<Object>} Duplicated procedure
   */
  async duplicate(id, newSlug) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      // Fetch original procedure
      const original = await this.getBySlug(id);

      // Create copy with new slug
      return await this.create({
        ...original,
        slug: newSlug,
        titleEn: `${original?.titleEn} (Copy)`,
        titleEs: `${original?.titleEs} (Copia)`,
      });
    } catch (error) {
      console.error('Error duplicating procedure:', error);
      throw error;
    }
  },
};

export default procedureLibraryService;
function getAllProcedures(...args) {
  // eslint-disable-next-line no-console
  console.warn('Placeholder: getAllProcedures is not implemented yet.', args);
  return null;
}

export { getAllProcedures };
function updateProcedure(...args) {
  // eslint-disable-next-line no-console
  console.warn('Placeholder: updateProcedure is not implemented yet.', args);
  return null;
}

export { updateProcedure };
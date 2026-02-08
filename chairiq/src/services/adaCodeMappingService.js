import { supabase } from '../lib/supabase';

/**
 * Service for ADA code to canonical procedure mapping operations
 */
export const adaCodeMappingService = {
  /**
   * Get all ADA codes grouped by their canonical procedure
   * Returns a map of canonical_slug -> array of ADA codes
   * 
   * Example return:
   * {
   *   'crown': [
   *     { code: 'D2740', description: 'Crown - porcelain/ceramic substrate', canonical_slug: 'crown' },
   *     { code: 'D2750', description: 'Crown - porcelain fused to high noble metal', canonical_slug: 'crown' }
   *   ],
   *   'root-canal': [...]
   * }
   */
  async getAdaCodesByCanonicalSlug() {
    try {
      const { data, error } = await supabase?.from('ada_codes')?.select(`
          code,
          description,
          canonical_slug,
          canonical_procedures!inner(
            slug,
            display_name_en,
            display_name_es,
            category
          )
        `)?.eq('is_active', true)?.order('code');

      if (error) throw error;

      // Group codes by canonical_slug
      const groupedCodes = {};
      
      data?.forEach(adaCode => {
        const canonicalSlug = adaCode?.canonical_slug;
        
        if (!groupedCodes?.[canonicalSlug]) {
          groupedCodes[canonicalSlug] = {
            canonicalSlug: canonicalSlug,
            displayNameEn: adaCode?.canonical_procedures?.display_name_en,
            displayNameEs: adaCode?.canonical_procedures?.display_name_es,
            category: adaCode?.canonical_procedures?.category,
            adaCodes: []
          };
        }

        groupedCodes?.[canonicalSlug]?.adaCodes?.push({
          code: adaCode?.code,
          description: adaCode?.description
        });
      });

      return { data: groupedCodes, error: null };
    } catch (error) {
      console.error('Error fetching ADA code mappings:', error);
      return { data: null, error: error?.message };
    }
  },

  /**
   * Get canonical procedure information for a specific ADA code
   * 
   * @param {string} adaCode - The ADA code to look up (e.g., 'D2740')
   * @returns {Promise<{data: object|null, error: string|null}>}
   */
  async getCanonicalProcedureByAdaCode(adaCode) {
    try {
      const { data, error } = await supabase?.from('ada_codes')?.select(`
          code,
          description,
          canonical_slug,
          canonical_procedures!inner(
            slug,
            display_name_en,
            display_name_es,
            category
          )
        `)?.eq('code', adaCode)?.eq('is_active', true)?.single();

      if (error) throw error;

      return {
        data: {
          adaCode: data?.code,
          adaDescription: data?.description,
          canonicalSlug: data?.canonical_slug,
          canonicalNameEn: data?.canonical_procedures?.display_name_en,
          canonicalNameEs: data?.canonical_procedures?.display_name_es,
          category: data?.canonical_procedures?.category
        },
        error: null
      };
    } catch (error) {
      console.error(`Error fetching canonical procedure for ADA code ${adaCode}:`, error);
      return { data: null, error: error?.message };
    }
  },

  /**
   * Get all ADA codes that map to the same canonical procedure as the given code
   * Useful for showing dentists which codes share the same education content
   * 
   * @param {string} adaCode - The ADA code to find related codes for
   * @returns {Promise<{data: Array|null, error: string|null}>}
   */
  async getRelatedAdaCodes(adaCode) {
    try {
      // First, get the canonical_slug for the given ADA code
      const { data: sourceCode, error: sourceError } = await supabase?.from('ada_codes')?.select('canonical_slug')?.eq('code', adaCode)?.eq('is_active', true)?.single();

      if (sourceError) throw sourceError;

      // Then, get all other codes with the same canonical_slug
      const { data, error } = await supabase?.from('ada_codes')?.select(`
          code,
          description,
          canonical_slug,
          canonical_procedures!inner(
            display_name_en,
            display_name_es
          )
        `)?.eq('canonical_slug', sourceCode?.canonical_slug)?.eq('is_active', true)?.order('code');

      if (error) throw error;

      return {
        data: {
          canonicalSlug: sourceCode?.canonical_slug,
          canonicalNameEn: data?.[0]?.canonical_procedures?.display_name_en,
          canonicalNameEs: data?.[0]?.canonical_procedures?.display_name_es,
          relatedCodes: data?.map(code => ({
            code: code?.code,
            description: code?.description,
            isOriginal: code?.code === adaCode
          }))
        },
        error: null
      };
    } catch (error) {
      console.error(`Error fetching related ADA codes for ${adaCode}:`, error);
      return { data: null, error: error?.message };
    }
  },

  /**
   * Get summary statistics about canonical mappings
   * Shows how many ADA codes map to each canonical procedure
   * 
   * @returns {Promise<{data: Array|null, error: string|null}>}
   */
  async getCanonicalMappingSummary() {
    try {
      const { data, error } = await supabase?.from('ada_codes')?.select(`
          canonical_slug,
          canonical_procedures!inner(
            display_name_en,
            display_name_es,
            category
          )
        `)?.eq('is_active', true);

      if (error) throw error;

      // Count codes per canonical procedure
      const summary = {};
      
      data?.forEach(item => {
        const slug = item?.canonical_slug;
        if (!summary?.[slug]) {
          summary[slug] = {
            canonicalSlug: slug,
            displayNameEn: item?.canonical_procedures?.display_name_en,
            displayNameEs: item?.canonical_procedures?.display_name_es,
            category: item?.canonical_procedures?.category,
            codeCount: 0
          };
        }
        summary[slug].codeCount++;
      });

      // Convert to array and sort by code count (descending)
      const summaryArray = Object.values(summary)?.sort((a, b) => b?.codeCount - a?.codeCount);

      return { data: summaryArray, error: null };
    } catch (error) {
      console.error('Error fetching canonical mapping summary:', error);
      return { data: null, error: error?.message };
    }
  }
};
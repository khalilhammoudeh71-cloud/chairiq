import { supabase } from '../lib/supabase';

export const procedureCodesService = {
  /**
   * Get all active procedure codes
   * @param {string} searchTerm - Optional search term
   * @param {string} category - Optional category filter
   */
  async getAllCodes(searchTerm = '', category = '') {
    let query = supabase?.from('procedure_codes')?.select('*')?.eq('is_active', true)?.order('code', { ascending: true });

    if (searchTerm) {
      query = query?.or(`code.ilike.%${searchTerm}%,title.ilike.%${searchTerm}%`);
    }

    if (category) {
      query = query?.eq('category', category);
    }

    const { data, error } = await query;
    if (error) throw error;

    return data?.map(row => ({
      id: row?.id,
      code: row?.code,
      title: row?.title,
      category: row?.category,
      isActive: row?.is_active,
      createdAt: row?.created_at,
      updatedAt: row?.updated_at
    }));
  },

  /**
   * Get procedure code by code
   * @param {string} code - ADA code
   */
  async getByCode(code) {
    const { data, error } = await supabase?.from('procedure_codes')?.select('*')?.eq('code', code)?.eq('is_active', true)?.single();

    if (error) throw error;

    return {
      id: data?.id,
      code: data?.code,
      title: data?.title,
      category: data?.category,
      isActive: data?.is_active,
      createdAt: data?.created_at,
      updatedAt: data?.updated_at
    };
  },

  /**
   * Get all categories
   */
  async getCategories() {
    const { data, error } = await supabase?.from('procedure_codes')?.select('category')?.eq('is_active', true)?.order('category', { ascending: true });

    if (error) throw error;

    const uniqueCategories = [...new Set(data?.map(row => row?.category)?.filter(Boolean))];
    return uniqueCategories;
  },

  /**
   * Import codes from CSV data
   * @param {Array} csvData - Array of objects with code, title, category
   */
  async importFromCSV(csvData) {
    const rows = csvData?.map(item => ({
      code: item?.code,
      title: item?.title,
      category: item?.category || null,
      is_active: true
    }));

    const { data, error } = await supabase?.from('procedure_codes')?.upsert(rows, { onConflict: 'code' })?.select();

    if (error) throw error;

    return data?.map(row => ({
      id: row?.id,
      code: row?.code,
      title: row?.title,
      category: row?.category,
      isActive: row?.is_active
    }));
  },

  /**
   * Get user's favorite procedures
   * @param {string} userId - User ID
   */
  async getFavorites(userId) {
    const { data, error } = await supabase?.from('procedure_favorites')?.select('*')?.eq('user_id', userId)?.order('created_at', { ascending: false });

    if (error) throw error;

    return data?.map(row => ({
      id: row?.id,
      userId: row?.user_id,
      procedureSlug: row?.procedure_slug,
      adaCode: row?.ada_code,
      createdAt: row?.created_at
    }));
  },

  /**
   * Add procedure to favorites
   * @param {string} userId - User ID
   * @param {string} procedureSlug - Procedure library slug
   * @param {string} adaCode - ADA code
   */
  async addFavorite(userId, procedureSlug, adaCode) {
    const { data, error } = await supabase?.from('procedure_favorites')?.insert({
        user_id: userId,
        procedure_slug: procedureSlug,
        ada_code: adaCode
      })?.select()?.single();

    if (error) throw error;

    return {
      id: data?.id,
      userId: data?.user_id,
      procedureSlug: data?.procedure_slug,
      adaCode: data?.ada_code,
      createdAt: data?.created_at
    };
  },

  /**
   * Remove procedure from favorites
   * @param {string} favoriteId - Favorite ID
   */
  async removeFavorite(favoriteId) {
    const { error } = await supabase?.from('procedure_favorites')?.delete()?.eq('id', favoriteId);

    if (error) throw error;
  },

  /**
   * Get user's recent procedures
   * @param {string} userId - User ID
   * @param {number} limit - Number of recents to retrieve
   */
  async getRecents(userId, limit = 10) {
    const { data, error } = await supabase?.from('procedure_recents')?.select('*')?.eq('user_id', userId)?.order('last_used_at', { ascending: false })?.limit(limit);

    if (error) throw error;

    return data?.map(row => ({
      id: row?.id,
      userId: row?.user_id,
      procedureSlug: row?.procedure_slug,
      adaCode: row?.ada_code,
      lastUsedAt: row?.last_used_at
    }));
  },

  /**
   * Add or update procedure in recents
   * @param {string} userId - User ID
   * @param {string} procedureSlug - Procedure library slug
   * @param {string} adaCode - ADA code
   */
  async addRecent(userId, procedureSlug, adaCode) {
    // Check if already exists
    const { data: existing } = await supabase?.from('procedure_recents')?.select('id')?.eq('user_id', userId)?.or(`procedure_slug.eq.${procedureSlug},ada_code.eq.${adaCode}`)?.maybeSingle();

    if (existing) {
      // Update timestamp
      const { data, error } = await supabase?.from('procedure_recents')?.update({ last_used_at: new Date()?.toISOString() })?.eq('id', existing?.id)?.select()?.single();

      if (error) throw error;

      return {
        id: data?.id,
        userId: data?.user_id,
        procedureSlug: data?.procedure_slug,
        adaCode: data?.ada_code,
        lastUsedAt: data?.last_used_at
      };
    } else {
      // Insert new
      const { data, error } = await supabase?.from('procedure_recents')?.insert({
          user_id: userId,
          procedure_slug: procedureSlug,
          ada_code: adaCode
        })?.select()?.single();

      if (error) throw error;

      return {
        id: data?.id,
        userId: data?.user_id,
        procedureSlug: data?.procedure_slug,
        adaCode: data?.ada_code,
        lastUsedAt: data?.last_used_at
      };
    }
  }
};
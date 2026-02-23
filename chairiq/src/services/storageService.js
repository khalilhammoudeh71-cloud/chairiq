import { supabase } from '../lib/supabase';

const BUCKET_NAME = 'treatment-images';

const storageService = {
  getPublicUrl(filePath) {
    if (!supabase || !filePath) return null;
    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
    return data?.publicUrl || null;
  },

  async upload(filePath, file, options = {}) {
    if (!supabase) throw new Error('Supabase not initialized');
    const { data, error } = await supabase.storage.from(BUCKET_NAME).upload(filePath, file, {
      cacheControl: '3600',
      upsert: options.upsert !== false,
      contentType: file.type || 'image/png',
      ...options,
    });
    if (error) throw error;
    return {
      path: data?.path,
      publicUrl: this.getPublicUrl(data?.path),
    };
  },

  async uploadFromUrl(filePath, sourceUrl) {
    const response = await fetch(sourceUrl);
    if (!response.ok) throw new Error(`Failed to fetch ${sourceUrl}: ${response.status}`);
    const blob = await response.blob();
    return this.upload(filePath, blob, { upsert: true });
  },

  async list(folder) {
    if (!supabase) return [];
    const { data, error } = await supabase.storage.from(BUCKET_NAME).list(folder || '', {
      limit: 100,
      sortBy: { column: 'name', order: 'asc' },
    });
    if (error) {
      console.error('[StorageService] List error:', error);
      return [];
    }
    return data || [];
  },

  async remove(filePaths) {
    if (!supabase || !filePaths?.length) return;
    const { error } = await supabase.storage.from(BUCKET_NAME).remove(filePaths);
    if (error) throw error;
  },

  async exists(filePath) {
    if (!supabase || !filePath) return false;
    const folder = filePath.substring(0, filePath.lastIndexOf('/'));
    const fileName = filePath.substring(filePath.lastIndexOf('/') + 1);
    const files = await this.list(folder);
    return files.some(f => f.name === fileName);
  },

  buildStoragePath(canonicalSlug, stepKey, extension = 'png') {
    if (stepKey === 'hero') {
      return `${canonicalSlug}/hero.${extension}`;
    }
    return `${canonicalSlug}/${stepKey}.${extension}`;
  },

  async uploadVisualAndCreateRecord(canonicalSlug, stepKey, file, sortOrder = 0) {
    if (!supabase) throw new Error('Supabase not initialized');

    const ext = file.name?.split('.')?.pop()?.toLowerCase() || 'png';
    const storagePath = this.buildStoragePath(canonicalSlug, stepKey, ext);

    const { publicUrl } = await this.upload(storagePath, file);

    const record = {
      canonical_slug: canonicalSlug,
      step_key: stepKey,
      image_url: publicUrl,
      sort_order: sortOrder,
      alt_text_en: `${canonicalSlug.replace(/-/g, ' ')} - ${stepKey.replace(/_/g, ' ')}`,
      alt_text_es: `${canonicalSlug.replace(/-/g, ' ')} - ${stepKey.replace(/_/g, ' ')}`,
    };

    const { data: existing } = await supabase
      .from('procedure_visuals')
      .select('id')
      .eq('canonical_slug', canonicalSlug)
      .eq('step_key', stepKey)
      .maybeSingle();

    let result;
    if (existing?.id) {
      const { data, error } = await supabase
        .from('procedure_visuals')
        .update({ image_url: publicUrl, updated_at: new Date().toISOString() })
        .eq('id', existing.id)
        .select()
        .single();
      if (error) throw error;
      result = data;
    } else {
      const { data, error } = await supabase
        .from('procedure_visuals')
        .insert(record)
        .select()
        .single();
      if (error) throw error;
      result = data;
    }

    return { publicUrl, record: result };
  },

  async syncLocalImageToStorage(canonicalSlug, stepKey, localPath, sortOrder = 0) {
    if (!supabase) throw new Error('Supabase not initialized');

    const ext = localPath.split('.').pop().toLowerCase().replace(/[^a-z]/g, '') || 'png';
    const validExt = ['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext) ? ext : 'png';
    const storagePath = this.buildStoragePath(canonicalSlug, stepKey, validExt);

    const alreadyExists = await this.exists(storagePath);
    if (alreadyExists) {
      const publicUrl = this.getPublicUrl(storagePath);
      const { data: existing } = await supabase
        .from('procedure_visuals')
        .select('id')
        .eq('canonical_slug', canonicalSlug)
        .eq('step_key', stepKey)
        .maybeSingle();

      if (existing?.id) {
        return { publicUrl, skipped: true };
      }

      const { data, error } = await supabase
        .from('procedure_visuals')
        .insert({
          canonical_slug: canonicalSlug,
          step_key: stepKey,
          image_url: publicUrl,
          sort_order: sortOrder,
          alt_text_en: `${canonicalSlug.replace(/-/g, ' ')} - ${stepKey.replace(/_/g, ' ')}`,
          alt_text_es: `${canonicalSlug.replace(/-/g, ' ')} - ${stepKey.replace(/_/g, ' ')}`,
        })
        .select()
        .single();
      if (error) throw error;
      return { publicUrl, record: data, skipped: false };
    }

    const { publicUrl } = await this.uploadFromUrl(storagePath, localPath);

    const { data, error } = await supabase
      .from('procedure_visuals')
      .upsert({
        canonical_slug: canonicalSlug,
        step_key: stepKey,
        image_url: publicUrl,
        sort_order: sortOrder,
        alt_text_en: `${canonicalSlug.replace(/-/g, ' ')} - ${stepKey.replace(/_/g, ' ')}`,
        alt_text_es: `${canonicalSlug.replace(/-/g, ' ')} - ${stepKey.replace(/_/g, ' ')}`,
      }, { onConflict: 'canonical_slug,step_key' })
      .select()
      .single();

    if (error) throw error;
    return { publicUrl, record: data };
  },
};

export default storageService;

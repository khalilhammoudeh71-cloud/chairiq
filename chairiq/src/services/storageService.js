import { supabase, downloadPatientImage } from '../lib/supabase';

const BUCKET_NAME = 'treatment-images';
const PATIENT_BUCKET = 'patient-images';

async function imageDataUrl(blob) {
  if (!['image/png','image/jpeg','image/webp','image/gif'].includes(blob.type) || blob.size > 10485760) {
    throw new Error('Unsupported patient image');
  }
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let binary = '';
  for (let i = 0; i < bytes.length; i += 8192) binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
  return `data:${blob.type};base64,${btoa(binary)}`;
}

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

  async uploadVisualAndCreateRecord(canonicalSlug, stepKey, file, sortOrder = 0, options = {}) {
    if (!supabase) throw new Error('Supabase not initialized');

    const ext = file.name?.split('.')?.pop()?.toLowerCase() || 'png';
    const storagePath = this.buildStoragePath(canonicalSlug, stepKey, ext);

    const { publicUrl } = await this.upload(storagePath, file);

    const fallbackAlt = `${canonicalSlug.replace(/-/g, ' ')} - ${stepKey.replace(/_/g, ' ')}`;
    const altEn = options.altTextEn || fallbackAlt;
    const altEs = options.altTextEs || options.altTextEn || fallbackAlt;

    const record = {
      canonical_slug: canonicalSlug,
      step_key: stepKey,
      image_url: publicUrl,
      sort_order: sortOrder,
      alt_text_en: altEn,
      alt_text_es: altEs,
    };

    const { data: existing } = await supabase
      .from('procedure_visuals')
      .select('id')
      .eq('canonical_slug', canonicalSlug)
      .eq('step_key', stepKey)
      .maybeSingle();

    let result;
    if (existing?.id) {
      const updates = { image_url: publicUrl, updated_at: new Date().toISOString() };
      if (options.altTextEn) {
        updates.alt_text_en = altEn;
        updates.alt_text_es = altEs;
      }
      const { data, error } = await supabase
        .from('procedure_visuals')
        .update(updates)
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

  async uploadPatientImage(planProcedureId, file, note, sortOrder) {
    if (!supabase) throw new Error('Supabase not initialized');

    const ext = file.name?.split('.')?.pop()?.toLowerCase() || 'png';
    const validExt = ['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext) ? ext : 'png';
    const stepKey = `patient_img_${sortOrder}`;
    const storagePath = `patient-specific/${planProcedureId}/${stepKey}.${validExt}`;

    const { error: uploadError } = await supabase.storage.from(PATIENT_BUCKET).upload(storagePath, file, { upsert: true, cacheControl: '0', contentType: file.type });
    if (uploadError) throw uploadError;

    const record = {
      plan_procedure_id: planProcedureId,
      step_key: stepKey,
      image_url: storagePath,
      sort_order: sortOrder,
      alt_text_en: note || '',
      alt_text_es: note || '',
    };

    const { data: existing } = await supabase
      .from('patient_plan_images')
      .select('id')
      .eq('plan_procedure_id', planProcedureId)
      .eq('step_key', stepKey)
      .maybeSingle();

    let result;
    if (existing?.id) {
      const { data, error } = await supabase
        .from('patient_plan_images')
        .update({ image_url: storagePath, alt_text_en: note || '', alt_text_es: note || '' })
        .eq('id', existing.id)
        .select()
        .single();
      if (error) throw error;
      result = data;
    } else {
      const { data, error } = await supabase
        .from('patient_plan_images')
        .insert(record)
        .select()
        .single();
      if (error) throw error;
      result = data;
    }

    return { path: storagePath, record: result };
  },

  async fetchPatientImages(planProcedureId, options = {}) {
    if (!supabase) return [];
    // Staff library previews use synthetic IDs and have no patient images.
    if (!options.token && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(planProcedureId || '')) return [];
    let rows = options.rows;
    if (!options.token) {
      const { data, error } = await supabase.from('patient_plan_images').select('*')
        .eq('plan_procedure_id', planProcedureId).order('sort_order', { ascending: true });
      if (error) throw error;
      rows = data || [];
    }
    if (!rows?.length) return [];
    return Promise.all(rows.map(async row => {
      // A patient row must reference an object in this procedure's private folder.
      // Never load an old public URL or arbitrary external URL as a patient image.
      if (!row.image_url?.startsWith(`patient-specific/${planProcedureId}/`)) throw new Error('Invalid patient image path');
      const { data, error } = options.token
        ? { data: await downloadPatientImage(options.token, planProcedureId, row.image_url) }
        : await supabase.storage.from(PATIENT_BUCKET).download(row.image_url);
      if (error) throw new Error('Unable to load patient image');
      return { imageUrl: await imageDataUrl(data), note: row.alt_text_en || '', sortOrder: row.sort_order };
    }));
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

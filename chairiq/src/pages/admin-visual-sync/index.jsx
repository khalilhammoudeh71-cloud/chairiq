import React, { useState, useEffect } from 'react';
import { ArrowLeft, Upload, Check, AlertCircle, RefreshCw, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DentistNavigation from '../../components/DentistNavigation';
import { supabase } from '../../lib/supabase';
import storageService from '../../services/storageService';
import proceduresLibrary from '../../data/procedures';

const BUCKET_NAME = 'treatment-images';

export default function AdminVisualSync() {
  const navigate = useNavigate();
  const [syncStatus, setSyncStatus] = useState({});
  const [isSyncing, setIsSyncing] = useState(false);
  const [globalProgress, setGlobalProgress] = useState({ done: 0, total: 0 });
  const [existingVisuals, setExistingVisuals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExistingVisuals();
  }, []);

  async function loadExistingVisuals() {
    try {
      if (!supabase) return;
      const { data } = await supabase
        .from('procedure_visuals')
        .select('canonical_slug, step_key, image_url');
      setExistingVisuals(data || []);
    } catch (err) {
      console.error('Failed to load existing visuals:', err);
    } finally {
      setLoading(false);
    }
  }

  function getVisualKey(slug, stepKey) {
    return `${slug}__${stepKey}`;
  }

  function isAlreadySynced(slug, stepKey) {
    return existingVisuals.some(v => v.canonical_slug === slug && v.step_key === stepKey);
  }

  function isExternalUrl(src) {
    return src?.startsWith('http://') || src?.startsWith('https://');
  }

  async function uploadImageFromSrc(src, storagePath) {
    if (isExternalUrl(src)) {
      try {
        const response = await fetch(src, { mode: 'cors' });
        if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
        const blob = await response.blob();
        if (blob.size < 100) throw new Error('Image too small, likely invalid');
        const { data, error } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(storagePath, blob, {
            cacheControl: '3600',
            upsert: true,
            contentType: blob.type || 'image/png',
          });
        if (error) throw error;
        const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path);
        return urlData.publicUrl;
      } catch (fetchErr) {
        console.warn(`Could not re-upload external image, using original URL: ${src}`);
        return src;
      }
    }

    const response = await fetch(src);
    if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
    const blob = await response.blob();
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(storagePath, blob, {
        cacheControl: '3600',
        upsert: true,
        contentType: blob.type || 'image/png',
      });
    if (error) throw error;
    const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path);
    return urlData.publicUrl;
  }

  async function syncProcedure(procedure) {
    const slug = procedure.id;
    const results = {};

    if (procedure.heroImage) {
      const heroKey = getVisualKey(slug, 'hero');
      try {
        setSyncStatus(prev => ({ ...prev, [heroKey]: 'uploading' }));
        const ext = guessExtension(procedure.heroImage);
        const storagePath = `${slug}/hero.${ext}`;
        const publicUrl = await uploadImageFromSrc(procedure.heroImage, storagePath);

        const existing = existingVisuals.find(v => v.canonical_slug === slug && v.step_key === 'hero');
        if (existing) {
          await supabase.from('procedure_visuals')
            .update({ image_url: publicUrl, updated_at: new Date().toISOString() })
            .eq('canonical_slug', slug)
            .eq('step_key', 'hero');
        } else {
          await supabase.from('procedure_visuals').insert({
            canonical_slug: slug,
            step_key: 'hero',
            image_url: publicUrl,
            sort_order: 0,
            alt_text_en: procedure.heroImageAlt || `${procedure.name_en} hero image`,
            alt_text_es: procedure.heroImageAlt || `${procedure.name_es} imagen principal`,
          });
        }
        setSyncStatus(prev => ({ ...prev, [heroKey]: 'done' }));
        results[heroKey] = 'done';
      } catch (err) {
        console.error(`Failed to sync hero for ${slug}:`, err);
        setSyncStatus(prev => ({ ...prev, [heroKey]: 'error' }));
        results[heroKey] = 'error';
      }
    }

    for (let i = 0; i < (procedure.visualGuideSteps || []).length; i++) {
      const step = procedure.visualGuideSteps[i];
      const stepKey = `step_${i + 1}`;
      const key = getVisualKey(slug, stepKey);

      if (!step.visualSrc) continue;

      try {
        setSyncStatus(prev => ({ ...prev, [key]: 'uploading' }));
        const ext = guessExtension(step.visualSrc);
        const storagePath = `${slug}/${stepKey}.${ext}`;
        const publicUrl = await uploadImageFromSrc(step.visualSrc, storagePath);

        const existing = existingVisuals.find(v => v.canonical_slug === slug && v.step_key === stepKey);
        if (existing) {
          await supabase.from('procedure_visuals')
            .update({ image_url: publicUrl, updated_at: new Date().toISOString() })
            .eq('canonical_slug', slug)
            .eq('step_key', stepKey);
        } else {
          await supabase.from('procedure_visuals').insert({
            canonical_slug: slug,
            step_key: stepKey,
            image_url: publicUrl,
            sort_order: i + 1,
            alt_text_en: step.visualAlt || `${procedure.name_en} - Step ${i + 1}`,
            alt_text_es: step.visualAlt || `${procedure.name_es} - Paso ${i + 1}`,
          });
        }
        setSyncStatus(prev => ({ ...prev, [key]: 'done' }));
        results[key] = 'done';
      } catch (err) {
        console.error(`Failed to sync ${key}:`, err);
        setSyncStatus(prev => ({ ...prev, [key]: 'error' }));
        results[key] = 'error';
      }

      setGlobalProgress(prev => ({ ...prev, done: prev.done + 1 }));
    }

    return results;
  }

  async function syncAllProcedures() {
    setIsSyncing(true);
    const totalImages = proceduresLibrary.reduce((acc, p) => {
      return acc + (p.heroImage ? 1 : 0) + (p.visualGuideSteps?.length || 0);
    }, 0);
    setGlobalProgress({ done: 0, total: totalImages });

    for (const procedure of proceduresLibrary) {
      await syncProcedure(procedure);
    }

    await loadExistingVisuals();
    setIsSyncing(false);
  }

  async function syncSingleProcedure(procedure) {
    setIsSyncing(true);
    const total = (procedure.heroImage ? 1 : 0) + (procedure.visualGuideSteps?.length || 0);
    setGlobalProgress({ done: 0, total });
    await syncProcedure(procedure);
    await loadExistingVisuals();
    setIsSyncing(false);
  }

  function guessExtension(url) {
    if (!url) return 'png';
    const lower = url.toLowerCase();
    if (lower.includes('.jpg') || lower.includes('.jpeg')) return 'jpg';
    if (lower.includes('.gif')) return 'gif';
    if (lower.includes('.webp')) return 'webp';
    return 'png';
  }

  function getStatusIcon(key) {
    const status = syncStatus[key];
    if (status === 'uploading') return <Loader2 className="w-4 h-4 animate-spin text-accent" />;
    if (status === 'done') return <Check className="w-4 h-4 text-success" />;
    if (status === 'error') return <AlertCircle className="w-4 h-4 text-danger" />;
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bg0">
        <DentistNavigation />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg0">
      <DentistNavigation />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-bg2 text-t2">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-t1">Visual Storage Sync</h1>
            <p className="text-t3 text-sm mt-1">
              Upload treatment images to Supabase storage and populate the visuals database
            </p>
          </div>
          <button
            onClick={syncAllProcedures}
            disabled={isSyncing}
            className="flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-lg hover:brightness-110 disabled:opacity-50 transition-all"
          >
            {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {isSyncing ? 'Syncing...' : 'Sync All'}
          </button>
        </div>

        {isSyncing && globalProgress.total > 0 && (
          <div className="mb-6 bg-bg2 rounded-lg p-4 border border-bd">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-t2">Progress</span>
              <span className="text-sm text-t1 font-mono">{globalProgress.done}/{globalProgress.total}</span>
            </div>
            <div className="w-full bg-bg3 rounded-full h-2">
              <div
                className="bg-accent h-2 rounded-full transition-all"
                style={{ width: `${(globalProgress.done / globalProgress.total) * 100}%` }}
              />
            </div>
          </div>
        )}

        <div className="mb-4 bg-bg2 rounded-lg p-4 border border-bd">
          <div className="flex items-center gap-3">
            <ImageIcon className="w-5 h-5 text-accent" />
            <span className="text-t1 font-medium">
              {existingVisuals.length} visuals in database
            </span>
            <span className="text-t3 text-sm">
              across {new Set(existingVisuals.map(v => v.canonical_slug)).size} procedures
            </span>
            <button
              onClick={loadExistingVisuals}
              className="ml-auto p-1.5 rounded hover:bg-bg3 text-t3"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {proceduresLibrary.map((procedure) => {
            const slug = procedure.id;
            const totalSteps = (procedure.visualGuideSteps || []).length;
            const syncedCount = existingVisuals.filter(v => v.canonical_slug === slug).length;
            const totalExpected = (procedure.heroImage ? 1 : 0) + totalSteps;

            return (
              <div key={slug} className="bg-bg1 rounded-xl border border-bd overflow-hidden">
                <div className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-bg2 overflow-hidden flex-shrink-0">
                    {procedure.heroImage && (
                      <img
                        src={procedure.heroImage}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-t1 font-semibold truncate">{procedure.name_en}</h3>
                    <p className="text-t3 text-xs mt-0.5">
                      {slug} &bull; {totalSteps} steps &bull;{' '}
                      <span className={syncedCount >= totalExpected ? 'text-success' : 'text-warning'}>
                        {syncedCount}/{totalExpected} synced
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={() => syncSingleProcedure(procedure)}
                    disabled={isSyncing}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-bg2 text-t1 rounded-lg hover:bg-bg3 disabled:opacity-50 border border-bd"
                  >
                    {isSyncing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    Sync
                  </button>
                </div>

                <div className="px-4 pb-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {procedure.heroImage && (
                      <div className={`rounded-lg border p-2 text-xs ${
                        isAlreadySynced(slug, 'hero') ? 'border-success/30 bg-success/5' : 'border-bd bg-bg2'
                      }`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-t2 font-medium">Hero</span>
                          <span>{isAlreadySynced(slug, 'hero') ? <Check className="w-3.5 h-3.5 text-success" /> : getStatusIcon(getVisualKey(slug, 'hero'))}</span>
                        </div>
                        <div className="aspect-video rounded bg-bg3 overflow-hidden">
                          <img src={procedure.heroImage} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                        </div>
                      </div>
                    )}
                    {(procedure.visualGuideSteps || []).map((step, idx) => {
                      const stepKey = `step_${idx + 1}`;
                      const synced = isAlreadySynced(slug, stepKey);
                      return (
                        <div key={stepKey} className={`rounded-lg border p-2 text-xs ${
                          synced ? 'border-success/30 bg-success/5' : 'border-bd bg-bg2'
                        }`}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-t2 font-medium">Step {idx + 1}</span>
                            <span>{synced ? <Check className="w-3.5 h-3.5 text-success" /> : getStatusIcon(getVisualKey(slug, stepKey))}</span>
                          </div>
                          <div className="aspect-video rounded bg-bg3 overflow-hidden">
                            {step.visualSrc && (
                              <img src={step.visualSrc} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                            )}
                          </div>
                          <p className="text-t3 mt-1 truncate">{step.title_en}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ArrowLeft, Upload, Check, AlertCircle, RefreshCw, Image as ImageIcon, Loader2, Plus, X, Search, Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DentistNavigation from '../../components/DentistNavigation';
import { supabase } from '../../lib/supabase';
import storageService from '../../services/storageService';
import proceduresLibrary from '../../data/procedures';
import { procedureCodesService } from '../../services/procedureCodesService';
import { adaCodeMappingService } from '../../services/adaCodeMappingService';

const BUCKET_NAME = 'treatment-images';

export default function AdminVisualSync() {
  const navigate = useNavigate();
  const [syncStatus, setSyncStatus] = useState({});
  const [isSyncing, setIsSyncing] = useState(false);
  const [globalProgress, setGlobalProgress] = useState({ done: 0, total: 0 });
  const [existingVisuals, setExistingVisuals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadPanel, setShowUploadPanel] = useState(false);
  const [uploadProcedure, setUploadProcedure] = useState('');
  const [uploadStepKey, setUploadStepKey] = useState('hero');
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadPreview, setUploadPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [adaCodes, setAdaCodes] = useState([]);
  const [canonicalMap, setCanonicalMap] = useState({});
  const [coverageFilter, setCoverageFilter] = useState('all');
  const [coverageSearch, setCoverageSearch] = useState('');
  const [expandedCoverage, setExpandedCoverage] = useState(null);
  const fileInputRef = useRef(null);
  const uploadPanelRef = useRef(null);

  useEffect(() => {
    loadExistingVisuals();
    loadAdaCodes();
    loadCanonicalMap();
  }, []);

  async function loadAdaCodes() {
    try {
      const codes = await procedureCodesService?.getAllCodes();
      setAdaCodes(codes || []);
    } catch (err) {
      console.error('Failed to load ADA codes:', err);
    }
  }

  async function loadCanonicalMap() {
    try {
      const { data } = await adaCodeMappingService.getAdaCodesByCanonicalSlug();
      setCanonicalMap(data || {});
    } catch (err) {
      console.error('Failed to load canonical map:', err);
    }
  }

  const coverageData = useMemo(() => {
    const slugs = Object.keys(canonicalMap);
    return slugs.map(slug => {
      const info = canonicalMap[slug];
      const visuals = existingVisuals.filter(v => v.canonical_slug === slug);
      const hasHero = visuals.some(v => v.step_key === 'hero');
      const stepVisuals = visuals.filter(v => v.step_key !== 'hero');
      return {
        slug,
        displayName: info.displayNameEn || slug,
        category: info.category || 'general',
        adaCodes: info.adaCodes || [],
        totalVisuals: visuals.length,
        hasHero,
        stepCount: stepVisuals.length,
        visuals,
        heroUrl: visuals.find(v => v.step_key === 'hero')?.image_url || null
      };
    }).sort((a, b) => {
      if (a.totalVisuals === 0 && b.totalVisuals > 0) return -1;
      if (a.totalVisuals > 0 && b.totalVisuals === 0) return 1;
      return a.displayName.localeCompare(b.displayName);
    });
  }, [canonicalMap, existingVisuals]);

  const filteredCoverage = useMemo(() => {
    let items = coverageData;
    if (coverageFilter === 'missing') {
      items = items.filter(c => c.totalVisuals === 0);
    } else if (coverageFilter === 'has') {
      items = items.filter(c => c.totalVisuals > 0);
    }
    if (coverageSearch) {
      const term = coverageSearch.toLowerCase();
      items = items.filter(c =>
        c.displayName.toLowerCase().includes(term) ||
        c.slug.toLowerCase().includes(term) ||
        c.adaCodes.some(ac => ac.code?.toLowerCase()?.includes(term) || ac.description?.toLowerCase()?.includes(term))
      );
    }
    return items;
  }, [coverageData, coverageFilter, coverageSearch]);

  const coverageStats = useMemo(() => {
    const total = coverageData.length;
    const withVisuals = coverageData.filter(c => c.totalVisuals > 0).length;
    const missing = total - withVisuals;
    return { total, withVisuals, missing };
  }, [coverageData]);

  function handleUploadForSlug(slug) {
    const libProc = proceduresLibrary.find(p => p.id === slug);
    if (libProc) {
      setUploadProcedure(libProc.id);
    } else {
      const info = canonicalMap[slug];
      if (info?.adaCodes?.length > 0) {
        setUploadProcedure(info.adaCodes[0].code);
      } else {
        setUploadProcedure(slug);
      }
    }
    setUploadStepKey('hero');
    setShowUploadPanel(true);
    setUploadResult(null);
    setTimeout(() => {
      uploadPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

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

  async function ensureCanonicalProcedure(procedure) {
    const slug = procedure.id;
    const { data } = await supabase
      .from('canonical_procedures')
      .select('slug')
      .eq('slug', slug)
      .maybeSingle();
    if (!data) {
      const { error } = await supabase
        .from('canonical_procedures')
        .insert({
          slug,
          display_name_en: procedure.name_en || procedure.id,
          display_name_es: procedure.name_es || procedure.id,
          category: procedure.category || 'general',
        });
      if (error) {
        console.error(`Failed to create canonical procedure ${slug}:`, error);
        throw error;
      }
    }
  }

  async function syncProcedure(procedure) {
    const slug = procedure.id;
    const results = {};

    await ensureCanonicalProcedure(procedure);

    async function upsertVisual(canonicalSlug, stepKey, imageUrl, sortOrder, altEn, altEs) {
      const { error: upsertError } = await supabase
        .from('procedure_visuals')
        .upsert({
          canonical_slug: canonicalSlug,
          step_key: stepKey,
          image_url: imageUrl,
          sort_order: sortOrder,
          alt_text_en: altEn,
          alt_text_es: altEs,
        }, { onConflict: 'canonical_slug,step_key' });
      if (upsertError) {
        console.error(`DB upsert failed for ${canonicalSlug}/${stepKey}:`, upsertError);
        throw upsertError;
      }
    }

    if (procedure.heroImage) {
      const heroKey = getVisualKey(slug, 'hero');
      try {
        setSyncStatus(prev => ({ ...prev, [heroKey]: 'uploading' }));
        const ext = guessExtension(procedure.heroImage);
        const storagePath = `${slug}/hero.${ext}`;
        const publicUrl = await uploadImageFromSrc(procedure.heroImage, storagePath);

        await upsertVisual(
          slug, 'hero', publicUrl, 0,
          procedure.heroImageAlt || `${procedure.name_en} hero image`,
          procedure.heroImageAlt || `${procedure.name_es} imagen principal`
        );
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

        await upsertVisual(
          slug, stepKey, publicUrl, i + 1,
          step.visualAlt || `${procedure.name_en} - Step ${i + 1}`,
          step.visualAlt || `${procedure.name_es} - Paso ${i + 1}`
        );
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

  function handleFileSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadFile(file);
    setUploadResult(null);
    const reader = new FileReader();
    reader.onload = (ev) => setUploadPreview(ev.target.result);
    reader.readAsDataURL(file);
  }

  function resetUploadForm() {
    setUploadFile(null);
    setUploadPreview(null);
    setUploadResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function getSelectedProcedure() {
    const libProc = proceduresLibrary.find(p => p.id === uploadProcedure);
    if (libProc) return libProc;
    const adaCode = adaCodes.find(c => c.code === uploadProcedure);
    if (adaCode) {
      return {
        id: adaCode.code,
        name_en: adaCode.title,
        name_es: adaCode.title,
        category: adaCode.category || 'general',
        visualGuideSteps: []
      };
    }
    return null;
  }

  function getStepOptions() {
    const proc = getSelectedProcedure();
    if (!proc) return [{ value: 'hero', label: 'Hero Image' }];
    const steps = [{ value: 'hero', label: 'Hero Image' }];
    (proc.visualGuideSteps || []).forEach((step, idx) => {
      steps.push({ value: `step_${idx + 1}`, label: `Step ${idx + 1}${step.title_en ? ` - ${step.title_en}` : ''}` });
    });
    for (let i = (proc.visualGuideSteps || []).length + 1; i <= 10; i++) {
      steps.push({ value: `step_${i}`, label: `Step ${i} (new)` });
    }
    return steps;
  }

  async function resolveCanonicalSlug(selectedValue) {
    const libProc = proceduresLibrary.find(p => p.id === selectedValue);
    if (libProc) return { slug: libProc.id, name: libProc.name_en };

    try {
      const { data } = await adaCodeMappingService.getCanonicalProcedureByAdaCode(selectedValue);
      if (data?.canonicalSlug) {
        return { slug: data.canonicalSlug, name: data.canonicalNameEn || data.canonicalSlug };
      }
    } catch (err) {
      console.warn(`No canonical mapping for ${selectedValue}, using as-is`);
    }

    const adaCode = adaCodes.find(c => c.code === selectedValue);
    return { slug: selectedValue, name: adaCode?.title || selectedValue };
  }

  async function handleCustomUpload() {
    if (!uploadFile || !uploadProcedure) return;
    setIsUploading(true);
    setUploadResult(null);
    try {
      const { slug: canonicalSlug, name: procName } = await resolveCanonicalSlug(uploadProcedure);

      const proc = getSelectedProcedure();
      const canonicalProc = proc ? { ...proc, id: canonicalSlug } : { id: canonicalSlug, name_en: procName, name_es: procName, category: 'general' };
      await ensureCanonicalProcedure(canonicalProc);

      const ext = uploadFile.name.split('.').pop()?.toLowerCase() || 'png';
      const storagePath = `${canonicalSlug}/${uploadStepKey}.${ext}`;

      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(storagePath, uploadFile, {
          cacheControl: '3600',
          upsert: true,
          contentType: uploadFile.type || 'image/png',
        });
      if (error) throw error;

      const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path);
      const publicUrl = urlData.publicUrl;

      const sortOrder = uploadStepKey === 'hero' ? 0 : parseInt(uploadStepKey.replace('step_', ''), 10);
      const altEn = uploadStepKey === 'hero' ? `${procName} hero image` : `${procName} - ${uploadStepKey.replace('_', ' ')}`;

      const { error: upsertError } = await supabase
        .from('procedure_visuals')
        .upsert({
          canonical_slug: canonicalSlug,
          step_key: uploadStepKey,
          image_url: publicUrl,
          sort_order: sortOrder,
          alt_text_en: altEn,
          alt_text_es: altEn,
        }, { onConflict: 'canonical_slug,step_key' });
      if (upsertError) throw upsertError;

      const slugNote = canonicalSlug !== uploadProcedure ? ` (mapped to "${canonicalSlug}")` : '';
      setUploadResult({ success: true, message: `Image uploaded and saved successfully${slugNote}` });
      resetUploadForm();
      await loadExistingVisuals();
    } catch (err) {
      console.error('Custom upload failed:', err);
      setUploadResult({ success: false, message: err.message || 'Upload failed' });
    } finally {
      setIsUploading(false);
    }
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
            className="flex items-center gap-2 px-5 py-2.5 bg-accent text-accent-foreground rounded-lg hover:brightness-110 disabled:opacity-50 transition-all"
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
              onClick={() => { setShowUploadPanel(p => !p); setUploadResult(null); }}
              className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-sm bg-accent text-accent-foreground rounded-lg hover:brightness-110 transition-all"
            >
              {showUploadPanel ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              {showUploadPanel ? 'Close' : 'Upload Image'}
            </button>
            <button
              onClick={loadExistingVisuals}
              className="p-1.5 rounded hover:bg-bg3 text-t3"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {showUploadPanel && (
          <div ref={uploadPanelRef} className="mb-6 bg-bg1 rounded-xl border border-accent/30 p-5">
            <h3 className="text-t1 font-semibold mb-4 flex items-center gap-2">
              <Upload className="w-4 h-4 text-accent" />
              Upload Custom Image
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-t2 text-sm mb-1.5">Procedure</label>
                <select
                  value={uploadProcedure}
                  onChange={(e) => { setUploadProcedure(e.target.value); setUploadStepKey('hero'); }}
                  className="w-full bg-bg2 border border-bd rounded-lg px-3 py-2 text-t1 text-sm focus-visible:outline focus-visible:outline-accent/30"
                >
                  <option value="">Select a procedure...</option>
                  {proceduresLibrary.length > 0 && (
                    <optgroup label="Library Procedures">
                      {proceduresLibrary.map(p => (
                        <option key={p.id} value={p.id}>{p.name_en}</option>
                      ))}
                    </optgroup>
                  )}
                  {adaCodes.length > 0 && (
                    <optgroup label="ADA Codes">
                      {adaCodes.map(c => (
                        <option key={c.code} value={c.code}>{c.code} — {c.title}</option>
                      ))}
                    </optgroup>
                  )}
                </select>
              </div>
              <div>
                <label className="block text-t2 text-sm mb-1.5">Step</label>
                <select
                  value={uploadStepKey}
                  onChange={(e) => setUploadStepKey(e.target.value)}
                  disabled={!uploadProcedure}
                  className="w-full bg-bg2 border border-bd rounded-lg px-3 py-2 text-t1 text-sm focus-visible:outline focus-visible:outline-accent/30 disabled:opacity-50"
                >
                  {getStepOptions().map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {uploadProcedure && (() => {
              const procVisualsForUpload = existingVisuals.filter(v => {
                const libProc = proceduresLibrary.find(p => p.id === uploadProcedure);
                if (libProc) return v.canonical_slug === libProc.id;
                const mapped = Object.entries(canonicalMap).find(([, info]) =>
                  info.adaCodes?.some(ac => ac.code === uploadProcedure)
                );
                return mapped ? v.canonical_slug === mapped[0] : v.canonical_slug === uploadProcedure;
              });
              if (procVisualsForUpload.length === 0) return null;
              const currentStepExists = procVisualsForUpload.find(v => v.step_key === uploadStepKey);
              return (
                <div className="mb-4 p-3 bg-bg2 rounded-lg border border-bd">
                  <p className="text-xs text-t2 font-medium mb-2">
                    Existing images for this procedure ({procVisualsForUpload.length})
                    {currentStepExists && (
                      <span className="text-warning ml-2">— uploading will replace the current {uploadStepKey === 'hero' ? 'hero' : uploadStepKey.replace('_', ' ')} image</span>
                    )}
                  </p>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {procVisualsForUpload
                      .sort((a, b) => (a.step_key === 'hero' ? -1 : b.step_key === 'hero' ? 1 : a.step_key.localeCompare(b.step_key)))
                      .map(v => (
                      <div
                        key={`${v.canonical_slug}-${v.step_key}`}
                        className={`flex-shrink-0 w-20 rounded-lg border overflow-hidden ${
                          v.step_key === uploadStepKey ? 'border-warning ring-2 ring-warning/30' : 'border-bd'
                        }`}
                      >
                        <div className="aspect-video bg-bg3 overflow-hidden">
                          <img src={v.image_url} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                        </div>
                        <p className={`text-[10px] text-center py-0.5 ${v.step_key === uploadStepKey ? 'text-warning font-semibold' : 'text-t3'}`}>
                          {v.step_key === 'hero' ? 'Hero' : v.step_key.replace('step_', 'Step ')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            <div className="mb-4">
              <label className="block text-t2 text-sm mb-1.5">Image File</label>
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <label className="flex items-center justify-center gap-2 px-4 py-3 bg-bg2 border-2 border-dashed border-bd rounded-lg cursor-pointer hover:border-accent/50 hover:bg-bg3 transition-all">
                    <Upload className="w-4 h-4 text-t3" />
                    <span className="text-t2 text-sm">{uploadFile ? uploadFile.name : 'Choose an image...'}</span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                </div>
                {uploadPreview && (
                  <div className="w-20 h-20 rounded-lg overflow-hidden border border-bd flex-shrink-0">
                    <img src={uploadPreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            {uploadResult && (
              <div className={`mb-4 px-4 py-2.5 rounded-lg text-sm flex items-center gap-2 ${
                uploadResult.success
                  ? 'bg-success/10 border border-success/30 text-success'
                  : 'bg-danger/10 border border-danger/30 text-danger'
              }`}>
                {uploadResult.success ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                {uploadResult.message}
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                onClick={handleCustomUpload}
                disabled={!uploadFile || !uploadProcedure || isUploading}
                className="flex items-center gap-2 px-5 py-2.5 bg-accent text-accent-foreground rounded-lg hover:brightness-110 disabled:opacity-50 transition-all text-sm font-medium"
              >
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {isUploading ? 'Uploading...' : 'Upload & Save'}
              </button>
              {uploadFile && (
                <button
                  onClick={resetUploadForm}
                  className="px-3 py-2.5 text-t3 text-sm hover:text-t1 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        )}

        {coverageData.length > 0 && (
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-3">
              <div>
                <h2 className="text-lg font-bold text-t1">Visual Coverage</h2>
                <p className="text-t3 text-xs mt-0.5">
                  {coverageStats.withVisuals}/{coverageStats.total} procedures have images
                  {coverageStats.missing > 0 && (
                    <span className="text-warning ml-1">• {coverageStats.missing} missing</span>
                  )}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-t3" />
                  <input
                    type="text"
                    placeholder="Search by name or ADA code..."
                    value={coverageSearch}
                    onChange={(e) => setCoverageSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 bg-bg2 border border-bd rounded-lg text-t1 text-sm w-56 focus:border-accent focus:outline-none"
                  />
                </div>
                <div className="flex gap-1 bg-bg2 rounded-lg p-0.5 border border-bd">
                  {[
                    { key: 'all', label: `All (${coverageStats.total})` },
                    { key: 'missing', label: `Missing (${coverageStats.missing})` },
                    { key: 'has', label: `Has (${coverageStats.withVisuals})` }
                  ].map(f => (
                    <button
                      key={f.key}
                      onClick={() => setCoverageFilter(f.key)}
                      className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                        coverageFilter === f.key
                          ? f.key === 'missing' ? 'bg-warning text-bg0' : f.key === 'has' ? 'bg-success text-bg0' : 'bg-accent text-accent-foreground'
                          : 'text-t2 hover:bg-bg3'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredCoverage.map(item => (
                <div
                  key={item.slug}
                  className={`bg-bg1 rounded-xl border overflow-hidden transition-all ${
                    item.totalVisuals === 0 ? 'border-warning/40' : 'border-bd'
                  }`}
                >
                  <div className="p-3 flex items-start gap-3">
                    <div className="w-14 h-14 rounded-lg bg-bg2 overflow-hidden flex-shrink-0 border border-bd">
                      {item.heroUrl ? (
                        <img src={item.heroUrl} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-5 h-5 text-t3/40" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-t1 font-semibold text-sm truncate">{item.displayName}</h4>
                      <p className="text-t3 text-xs mt-0.5">{item.slug}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {item.totalVisuals === 0 ? (
                          <span className="text-xs px-1.5 py-0.5 rounded bg-warning/10 text-warning font-medium">No visuals</span>
                        ) : (
                          <span className="text-xs px-1.5 py-0.5 rounded bg-success/10 text-success font-medium">
                            {item.totalVisuals} image{item.totalVisuals !== 1 ? 's' : ''}
                            {item.hasHero ? ' (hero ✓)' : ''}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleUploadForSlug(item.slug)}
                      className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 text-xs bg-accent text-accent-foreground rounded-lg hover:brightness-110 transition-all"
                    >
                      <Upload className="w-3 h-3" />
                      Upload
                    </button>
                  </div>

                  {item.adaCodes.length > 0 && (
                    <div className="px-3 pb-2">
                      <button
                        onClick={() => setExpandedCoverage(expandedCoverage === item.slug ? null : item.slug)}
                        className="text-[11px] text-t3 hover:text-t2 flex items-center gap-1"
                      >
                        {expandedCoverage === item.slug ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        {item.adaCodes.length} ADA code{item.adaCodes.length !== 1 ? 's' : ''}
                      </button>
                      {expandedCoverage === item.slug && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {item.adaCodes.map(ac => (
                            <span key={ac.code} className="text-[10px] font-mono px-1.5 py-0.5 bg-bg2 border border-bd rounded text-t2">
                              {ac.code}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {item.totalVisuals > 0 && expandedCoverage === item.slug && (
                    <div className="px-3 pb-3 pt-1">
                      <div className="flex gap-1.5 overflow-x-auto pb-1">
                        {item.visuals
                          .sort((a, b) => (a.step_key === 'hero' ? -1 : b.step_key === 'hero' ? 1 : a.step_key.localeCompare(b.step_key)))
                          .map(v => (
                          <div key={v.step_key} className="flex-shrink-0 w-16 rounded border border-bd overflow-hidden">
                            <div className="aspect-video bg-bg3 overflow-hidden">
                              <img src={v.image_url} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                            </div>
                            <p className="text-[9px] text-t3 text-center py-0.5">{v.step_key === 'hero' ? 'Hero' : v.step_key.replace('step_', 'S')}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredCoverage.length === 0 && (
              <div className="text-center py-8 bg-bg1 rounded-xl border border-bd">
                <ImageIcon className="w-8 h-8 text-t3/40 mx-auto mb-2" />
                <p className="text-t2 text-sm">No procedures match your filter</p>
              </div>
            )}
          </div>
        )}

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

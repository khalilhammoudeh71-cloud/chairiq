import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Search, Copy, Eye, EyeOff, CheckCircle, AlertCircle, BookOpen, Upload, Image as ImageIcon, ChevronDown, Loader2, Check, X } from 'lucide-react';
import { procedureLibraryService } from '../../services/procedureLibraryService';
import { procedureCodesService } from '../../services/procedureCodesService';
import { adaCodeMappingService } from '../../services/adaCodeMappingService';
import { supabase } from '../../lib/supabase';
import DentistNavigation from '../../components/DentistNavigation';
import Card from '../../components/ui/Card';
import ButtonPrimary from '../../components/ui/ButtonPrimary';
import ButtonSecondary from '../../components/ui/ButtonSecondary';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Badge from '../../components/ui/Badge';

const ALL_CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'preventive', label: 'Preventive' },
  { value: 'restorative', label: 'Restorative' },
  { value: 'endodontics', label: 'Endodontics' },
  { value: 'endodontic', label: 'Endodontic' },
  { value: 'periodontics', label: 'Periodontics' },
  { value: 'periodontic', label: 'Periodontic' },
  { value: 'prosthodontics', label: 'Prosthodontics' },
  { value: 'surgery', label: 'Surgery' },
  { value: 'oral-surgery', label: 'Oral Surgery' },
  { value: 'orthodontics', label: 'Orthodontics' },
  { value: 'cosmetic', label: 'Cosmetic' },
  { value: 'adjunctive', label: 'Adjunctive' },
  { value: 'diagnostic', label: 'Diagnostic' },
  { value: 'implants', label: 'Implants' },
  { value: 'pediatric', label: 'Pediatric' },
  { value: 'emergency', label: 'Emergency' },
];

function getContentCompleteness(proc) {
  const fields = [
    proc?.titleEn, proc?.titleEs,
    proc?.summaryEn, proc?.summaryEs,
    proc?.whyEn, proc?.whyEs,
    proc?.aftercareEn, proc?.aftercareEs,
  ];
  const jsonFields = [
    proc?.stepsEn, proc?.stepsEs,
    proc?.faqsEn, proc?.faqsEs,
  ];
  let filled = 0;
  let total = fields.length + jsonFields.length;
  fields.forEach(f => { if (f && f.trim?.() !== '') filled++; });
  jsonFields.forEach(f => { if (f && Array.isArray(f) && f.length > 0) filled++; });
  return Math.round((filled / total) * 100);
}

const BUCKET_NAME = 'treatment-images';

export default function ProcedureLibraryManagement() {
  const navigate = useNavigate();
  const [procedures, setProcedures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [adaCodes, setAdaCodes] = useState([]);
  const [selectedAdaCode, setSelectedAdaCode] = useState('');
  const [adaDropdownOpen, setAdaDropdownOpen] = useState(false);
  const [adaSearchTerm, setAdaSearchTerm] = useState('');
  const adaDropdownRef = useRef(null);

  const [showVisualUpload, setShowVisualUpload] = useState(false);
  const [uploadStepKey, setUploadStepKey] = useState('hero');
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadPreview, setUploadPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [existingVisuals, setExistingVisuals] = useState([]);
  const fileInputRef = useRef(null);
  const uploadSectionRef = useRef(null);

  useEffect(() => {
    loadProcedures();
    loadAdaCodes();
    loadExistingVisuals();
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (adaDropdownRef.current && !adaDropdownRef.current.contains(e.target)) {
        setAdaDropdownOpen(false);
        setAdaSearchTerm('');
      }
    }
    if (adaDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [adaDropdownOpen]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const loadProcedures = async () => {
    try {
      setLoading(true);
      const data = await procedureLibraryService?.getAll();
      setProcedures(data || []);
      setError('');
    } catch (err) {
      setError(err?.message || 'Failed to load procedures');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    navigate('/markdown-content-editor', { state: { mode: 'create' } });
  };

  const handleEdit = (procedure) => {
    navigate('/markdown-content-editor', { state: { mode: 'edit', procedureId: procedure?.id } });
  };

  const handleDuplicate = async (procedure) => {
    try {
      const newSlug = `${procedure?.slug}-copy-${Date.now()}`;
      await procedureLibraryService?.duplicate(procedure?.id, newSlug);
      setSuccess(`Duplicated "${procedure?.titleEn}" successfully`);
      await loadProcedures();
    } catch (err) {
      setError(err?.message || 'Failed to duplicate procedure');
    }
  };

  const handleTogglePublish = async (procedure) => {
    try {
      await procedureLibraryService?.update(procedure?.id, {
        isPublished: !procedure?.isPublished
      });
      setSuccess(`${procedure?.titleEn} ${procedure?.isPublished ? 'unpublished' : 'published'}`);
      await loadProcedures();
    } catch (err) {
      setError(err?.message || 'Failed to toggle publish status');
    }
  };

  const handleDelete = async (procedureId) => {
    try {
      await procedureLibraryService?.delete(procedureId);
      setDeleteConfirm(null);
      setSuccess('Procedure deleted successfully');
      await loadProcedures();
    } catch (err) {
      setError(err?.message || 'Failed to delete procedure');
    }
  };

  const handleReset = () => {
    setSearchTerm('');
    setFilterCategory('all');
    setFilterStatus('all');
    setSelectedAdaCode('');
  };

  async function loadAdaCodes() {
    try {
      const codes = await procedureCodesService?.getAllCodes();
      setAdaCodes(codes || []);
    } catch (err) {
      console.error('Failed to load ADA codes:', err);
    }
  }

  async function loadExistingVisuals() {
    try {
      if (!supabase) return;
      const { data } = await supabase
        .from('procedure_visuals')
        .select('canonical_slug, step_key, image_url');
      setExistingVisuals(data || []);
    } catch (err) {
      console.error('Failed to load visuals:', err);
    }
  }

  const filteredAdaCodes = useMemo(() => {
    if (!adaSearchTerm) return adaCodes;
    const term = adaSearchTerm.toLowerCase();
    return adaCodes.filter(c =>
      c?.code?.toLowerCase()?.includes(term) ||
      c?.title?.toLowerCase()?.includes(term)
    );
  }, [adaCodes, adaSearchTerm]);

  function handleSelectAdaCode(code) {
    setSelectedAdaCode(code);
    setAdaDropdownOpen(false);
    setAdaSearchTerm('');
    if (code) {
      setShowVisualUpload(true);
      setUploadStepKey('hero');
      setUploadFile(null);
      setUploadPreview(null);
      setUploadResult(null);
      setTimeout(() => {
        uploadSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else {
      setShowVisualUpload(false);
    }
  }

  async function resolveCanonicalSlug(adaCode) {
    try {
      const { data } = await adaCodeMappingService.getCanonicalProcedureByAdaCode(adaCode);
      if (data?.canonicalSlug) {
        return { slug: data.canonicalSlug, name: data.canonicalNameEn || data.canonicalSlug, category: data.category || 'general' };
      }
    } catch (err) {
      console.warn(`No canonical mapping for ${adaCode}`);
    }
    const code = adaCodes.find(c => c.code === adaCode);
    return { slug: adaCode, name: code?.title || adaCode, category: code?.category || 'general' };
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

  const selectedVisualsForCode = useMemo(() => {
    if (!selectedAdaCode) return [];
    const code = adaCodes.find(c => c.code === selectedAdaCode);
    if (!code) return [];
    const possibleSlugs = new Set();
    possibleSlugs.add(selectedAdaCode);
    possibleSlugs.add(selectedAdaCode.toLowerCase());
    if (code.title) {
      const slug = code.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      possibleSlugs.add(slug);
    }
    const allMapped = existingVisuals.filter(v => possibleSlugs.has(v.canonical_slug));
    if (allMapped.length > 0) return allMapped;
    return [];
  }, [selectedAdaCode, adaCodes, existingVisuals]);

  const [resolvedSlugForSelected, setResolvedSlugForSelected] = useState(null);

  useEffect(() => {
    if (!selectedAdaCode) {
      setResolvedSlugForSelected(null);
      return;
    }
    let cancelled = false;
    resolveCanonicalSlug(selectedAdaCode).then(result => {
      if (!cancelled) setResolvedSlugForSelected(result);
    });
    return () => { cancelled = true; };
  }, [selectedAdaCode]);

  const resolvedVisuals = useMemo(() => {
    if (!resolvedSlugForSelected) return selectedVisualsForCode;
    return existingVisuals.filter(v => v.canonical_slug === resolvedSlugForSelected.slug);
  }, [resolvedSlugForSelected, existingVisuals, selectedVisualsForCode]);

  async function handleVisualUpload() {
    if (!uploadFile || !selectedAdaCode) return;
    setIsUploading(true);
    setUploadResult(null);
    try {
      const { slug: canonicalSlug, name: procName, category } = await resolveCanonicalSlug(selectedAdaCode);

      const { data: existingProc } = await supabase
        .from('canonical_procedures')
        .select('slug')
        .eq('slug', canonicalSlug)
        .maybeSingle();
      if (!existingProc) {
        const { error: insertErr } = await supabase.from('canonical_procedures').insert({
          slug: canonicalSlug,
          display_name_en: procName,
          display_name_es: procName,
          category: category,
        });
        if (insertErr) {
          console.error('Failed to create canonical procedure:', insertErr);
          throw insertErr;
        }
      }

      const ext = uploadFile.name.split('.').pop()?.toLowerCase() || 'png';
      const storagePath = `${canonicalSlug}/${uploadStepKey}.${ext}`;

      const { data, error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(storagePath, uploadFile, {
          cacheControl: '3600',
          upsert: true,
          contentType: uploadFile.type || 'image/png',
        });
      if (uploadError) throw uploadError;

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

      const slugNote = canonicalSlug !== selectedAdaCode ? ` (mapped to "${canonicalSlug}")` : '';
      setUploadResult({ success: true, message: `Image uploaded successfully${slugNote}` });
      setUploadFile(null);
      setUploadPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      await loadExistingVisuals();
    } catch (err) {
      console.error('Visual upload failed:', err);
      setUploadResult({ success: false, message: err.message || 'Upload failed' });
    } finally {
      setIsUploading(false);
    }
  }

  const filteredProcedures = procedures?.filter(proc => {
    const matchesSearch = !searchTerm ||
      proc?.titleEn?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      proc?.titleEs?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      proc?.slug?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    const matchesCategory = filterCategory === 'all' || proc?.category === filterCategory;
    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'published' && proc?.isPublished) ||
      (filterStatus === 'draft' && !proc?.isPublished);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const stats = {
    total: procedures?.length || 0,
    published: procedures?.filter(p => p?.isPublished)?.length || 0,
    draft: procedures?.filter(p => !p?.isPublished)?.length || 0,
    complete: procedures?.filter(p => getContentCompleteness(p) === 100)?.length || 0,
  };

  if (loading) {
    return (
      <>
        <DentistNavigation />
        <div className="min-h-screen bg-bg0 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-accent border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-t2">Loading procedure library...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <DentistNavigation />

      <div className="min-h-screen bg-bg0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-t1 mb-1">Procedure Library</h1>
              <p className="text-t2">Manage bilingual educational content for patient treatment plans</p>
            </div>
            <ButtonPrimary onClick={handleCreateNew}>
              <Plus className="mr-2" size={20} />
              Add Procedure
            </ButtonPrimary>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4 text-center">
              <p className="text-3xl font-bold text-t1">{stats.total}</p>
              <p className="text-sm text-t2">Total Procedures</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-3xl font-bold text-success">{stats.published}</p>
              <p className="text-sm text-t2">Published</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-3xl font-bold text-warning">{stats.draft}</p>
              <p className="text-sm text-t2">Drafts</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-3xl font-bold text-accent">{stats.complete}</p>
              <p className="text-sm text-t2">Fully Complete</p>
            </Card>
          </div>

          {error && (
            <div className="bg-danger/10 border border-danger/20 rounded-lg p-4 mb-6 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-danger flex-shrink-0" />
              <p className="text-danger">{error}</p>
              <button onClick={() => setError('')} className="ml-auto text-danger hover:text-danger/80 text-sm">Dismiss</button>
            </div>
          )}
          {success && (
            <div className="bg-success/10 border border-success/20 rounded-lg p-4 mb-6 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
              <p className="text-success">{success}</p>
            </div>
          )}

          <Card className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-t3" />
                <Input
                  type="search"
                  placeholder="Search by title or slug..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e?.target?.value)}
                  className="pl-10"
                />
              </div>
              <Select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e?.target?.value)}
              >
                {ALL_CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </Select>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e?.target?.value)}
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </Select>
              <ButtonSecondary onClick={handleReset} className="w-full">
                Reset Filters
              </ButtonSecondary>
            </div>
          </Card>

          <Card className="mb-6">
            <div className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 relative" ref={adaDropdownRef}>
                  <label className="block text-t2 text-xs font-medium mb-1.5">Upload Visuals by ADA Code</label>
                  <div
                    onClick={() => setAdaDropdownOpen(!adaDropdownOpen)}
                    className="w-full px-4 py-2.5 border border-bd rounded-lg bg-bg2 text-t1 cursor-pointer flex items-center justify-between hover:border-accent/50 transition-colors"
                  >
                    <span className={selectedAdaCode ? 'text-t1' : 'text-t3'}>
                      {selectedAdaCode
                        ? `${selectedAdaCode} — ${adaCodes.find(c => c.code === selectedAdaCode)?.title || ''}`
                        : 'Select an ADA code to upload visuals...'}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-t3 transition-transform ${adaDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>
                  {adaDropdownOpen && (
                    <div className="absolute z-50 mt-1 w-full bg-bg1 border border-bd rounded-lg shadow-xl max-h-72 overflow-hidden flex flex-col">
                      <div className="p-2 border-b border-bd">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-t3" />
                          <input
                            type="text"
                            autoFocus
                            placeholder="Type to filter codes..."
                            value={adaSearchTerm}
                            onChange={(e) => setAdaSearchTerm(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full pl-9 pr-3 py-2 bg-bg2 border border-bd rounded-lg text-t1 text-sm focus:border-accent focus:outline-none"
                          />
                        </div>
                      </div>
                      <div className="overflow-y-auto flex-1">
                        {selectedAdaCode && (
                          <button
                            onClick={() => handleSelectAdaCode('')}
                            className="w-full text-left px-4 py-2.5 text-sm text-t3 hover:bg-bg2 transition-colors"
                          >
                            Clear selection
                          </button>
                        )}
                        {filteredAdaCodes.map(c => (
                          <button
                            key={c.code}
                            onClick={() => handleSelectAdaCode(c.code)}
                            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-bg2 transition-colors flex items-center gap-2 ${selectedAdaCode === c.code ? 'bg-accent/10 text-accent font-medium' : 'text-t1'}`}
                          >
                            <span className="font-mono text-xs text-accent bg-accent/10 px-1.5 py-0.5 rounded flex-shrink-0">{c.code}</span>
                            <span className="truncate">{c.title}</span>
                          </button>
                        ))}
                        {filteredAdaCodes.length === 0 && (
                          <div className="px-4 py-6 text-center text-t3 text-sm">No ADA codes match your search</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                {selectedAdaCode && (
                  <div className="flex items-end gap-2">
                    <button
                      onClick={() => { setShowVisualUpload(!showVisualUpload); setUploadResult(null); }}
                      className="flex items-center gap-1.5 px-4 py-2.5 bg-accent text-white rounded-lg hover:brightness-110 transition-all text-sm font-medium"
                    >
                      {showVisualUpload ? <X className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
                      {showVisualUpload ? 'Close' : 'Upload Visual'}
                    </button>
                  </div>
                )}
              </div>

              {showVisualUpload && selectedAdaCode && (
                <div ref={uploadSectionRef} className="mt-4 p-4 bg-bg2 rounded-xl border border-accent/20">
                  <h4 className="text-t1 font-semibold text-sm mb-3 flex items-center gap-2">
                    <Upload className="w-4 h-4 text-accent" />
                    Upload Visual for {selectedAdaCode} — {adaCodes.find(c => c.code === selectedAdaCode)?.title}
                    {resolvedSlugForSelected && resolvedSlugForSelected.slug !== selectedAdaCode && (
                      <span className="text-xs text-t3 font-normal">(saves to "{resolvedSlugForSelected.slug}")</span>
                    )}
                  </h4>

                  {resolvedVisuals.length > 0 && (
                    <div className="mb-3 p-2.5 bg-bg1 rounded-lg border border-bd">
                      <p className="text-xs text-t2 font-medium mb-2">
                        Existing images ({resolvedVisuals.length})
                        {resolvedVisuals.find(v => v.step_key === uploadStepKey) && (
                          <span className="text-warning ml-1.5">— will replace {uploadStepKey === 'hero' ? 'hero' : uploadStepKey.replace('_', ' ')}</span>
                        )}
                      </p>
                      <div className="flex gap-2 overflow-x-auto pb-1">
                        {resolvedVisuals
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
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-t2 text-xs mb-1">Step</label>
                      <select
                        value={uploadStepKey}
                        onChange={(e) => setUploadStepKey(e.target.value)}
                        className="w-full bg-bg1 border border-bd rounded-lg px-3 py-2 text-t1 text-sm focus:border-accent focus:outline-none"
                      >
                        <option value="hero">Hero Image</option>
                        {[1,2,3,4,5,6,7,8,9,10].map(i => (
                          <option key={i} value={`step_${i}`}>Step {i}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-t2 text-xs mb-1">Image File</label>
                      <label className="flex items-center justify-center gap-2 px-3 py-2 bg-bg1 border-2 border-dashed border-bd rounded-lg cursor-pointer hover:border-accent/50 hover:bg-bg3 transition-all">
                        <Upload className="w-3.5 h-3.5 text-t3" />
                        <span className="text-t2 text-sm truncate">{uploadFile ? uploadFile.name : 'Choose image...'}</span>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {uploadPreview && (
                    <div className="mb-3 flex items-center gap-3">
                      <div className="w-24 h-16 rounded-lg overflow-hidden border border-bd">
                        <img src={uploadPreview} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-xs text-t3">Preview</span>
                    </div>
                  )}

                  {uploadResult && (
                    <div className={`mb-3 px-4 py-2 rounded-lg text-sm flex items-center gap-2 ${
                      uploadResult.success
                        ? 'bg-success/10 border border-success/30 text-success'
                        : 'bg-danger/10 border border-danger/30 text-danger'
                    }`}>
                      {uploadResult.success ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                      {uploadResult.message}
                    </div>
                  )}

                  <button
                    onClick={handleVisualUpload}
                    disabled={!uploadFile || isUploading}
                    className="flex items-center gap-2 px-5 py-2 bg-accent text-white rounded-lg hover:brightness-110 disabled:opacity-50 transition-all text-sm font-medium"
                  >
                    {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {isUploading ? 'Uploading...' : 'Upload & Save'}
                  </button>
                </div>
              )}
            </div>
          </Card>

          {filteredProcedures?.length === 0 ? (
            <Card className="p-12 text-center">
              <BookOpen className="w-12 h-12 text-t3 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-t1 mb-2">
                {procedures?.length === 0 ? 'No procedures yet' : 'No matching procedures'}
              </h3>
              <p className="text-t2 mb-6">
                {procedures?.length === 0
                  ? 'Create your first procedure to get started.'
                  : 'Try adjusting your search or filters.'}
              </p>
              {procedures?.length === 0 && (
                <ButtonPrimary onClick={handleCreateNew}>
                  <Plus className="mr-2" size={16} />
                  Create First Procedure
                </ButtonPrimary>
              )}
            </Card>
          ) : (
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-bd">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-t2 uppercase tracking-wider">
                        Procedure
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-t2 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-t2 uppercase tracking-wider">
                        Content
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-t2 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-t2 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-bd">
                    {filteredProcedures?.map((procedure) => {
                      const completeness = getContentCompleteness(procedure);
                      const hasSpanish = !!(procedure?.titleEs && procedure?.summaryEs);
                      return (
                        <tr key={procedure?.id} className="hover:bg-bg1 transition-colors">
                          <td className="px-6 py-4">
                            <div className="text-t1 font-medium">{procedure?.titleEn || 'Untitled'}</div>
                            <div className="text-t3 text-sm font-mono">{procedure?.slug}</div>
                            {hasSpanish && (
                              <div className="text-t3 text-xs mt-0.5">{procedure?.titleEs}</div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant="neutral">
                              {procedure?.category || 'uncategorized'}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-20 h-2 bg-bg3 rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full transition-all"
                                  style={{
                                    width: `${completeness}%`,
                                    backgroundColor: completeness === 100 ? 'var(--success)' : completeness >= 50 ? 'var(--warning)' : 'var(--danger)',
                                  }}
                                />
                              </div>
                              <span className="text-xs text-t3">{completeness}%</span>
                            </div>
                            <div className="flex gap-1 mt-1">
                              {hasSpanish && (
                                <span className="text-xs px-1.5 py-0.5 rounded bg-accent/10 text-accent">EN+ES</span>
                              )}
                              {!hasSpanish && (
                                <span className="text-xs px-1.5 py-0.5 rounded bg-warning/10 text-warning">EN only</span>
                              )}
                              {procedure?.stepsEn?.length > 0 && (
                                <span className="text-xs px-1.5 py-0.5 rounded bg-bg3 text-t3">{procedure?.stepsEn?.length} steps</span>
                              )}
                              {procedure?.faqsEn?.length > 0 && (
                                <span className="text-xs px-1.5 py-0.5 rounded bg-bg3 text-t3">{procedure?.faqsEn?.length} FAQs</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleTogglePublish(procedure)}
                              className="flex items-center gap-1.5 cursor-pointer"
                              title={procedure?.isPublished ? 'Click to unpublish' : 'Click to publish'}
                            >
                              {procedure?.isPublished ? (
                                <Badge variant="success">
                                  <Eye className="w-3 h-3 mr-1" />
                                  Published
                                </Badge>
                              ) : (
                                <Badge variant="warning">
                                  <EyeOff className="w-3 h-3 mr-1" />
                                  Draft
                                </Badge>
                              )}
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleEdit(procedure)}
                                className="p-2 text-t2 hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDuplicate(procedure)}
                                className="p-2 text-t2 hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"
                                title="Duplicate"
                              >
                                <Copy size={16} />
                              </button>
                              {deleteConfirm === procedure?.id ? (
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => handleDelete(procedure?.id)}
                                    className="px-2 py-1 text-xs bg-danger text-white rounded hover:brightness-110"
                                  >
                                    Confirm
                                  </button>
                                  <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className="px-2 py-1 text-xs bg-bg3 text-t2 rounded hover:bg-bg2"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setDeleteConfirm(procedure?.id)}
                                  className="p-2 text-t2 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 size={16} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-3 border-t border-bd text-sm text-t3">
                Showing {filteredProcedures?.length} of {procedures?.length} procedures
              </div>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}

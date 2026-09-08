import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Save, Eye, Languages, Plus, X, Upload, Loader2, MonitorSmartphone, Image as ImageIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { procedureLibraryService } from '../../services/procedureLibraryService';
import DentistNavigation from '../../components/DentistNavigation';
import { supabase } from '../../lib/supabase';
import ProcedureThumb from '../../components/ProcedureThumb';
import storageService from '../../services/storageService';
import { trackEvent } from '../../utils/analytics';

export default function MarkdownContentEditor() {
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, procedureId } = location?.state || { mode: 'create' };

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [language, setLanguage] = useState('en');
  const [previewMode, setPreviewMode] = useState(false);
  const [stepVisuals, setStepVisuals] = useState([]);
  const [visualSlug, setVisualSlug] = useState(null);
  const [uploadingKey, setUploadingKey] = useState(null);
  const [visualMessage, setVisualMessage] = useState(null);

  const [formData, setFormData] = useState({
    slug: '',
    category: '',
    titleEn: '',
    titleEs: '',
    summaryEn: '',
    summaryEs: '',
    whyEn: '',
    whyEs: '',
    whatIfNotEn: '',
    whatIfNotEs: '',
    stepsEn: [],
    stepsEs: [],
    anesthesiaEn: '',
    anesthesiaEs: '',
    risksEn: '',
    risksEs: '',
    aftercareEn: '',
    aftercareEs: '',
    faqsEn: [],
    faqsEs: [],
    timeEstimate: '',
    visitsEstimate: '',
    isPublished: false
  });

  useEffect(() => {
    if (mode === 'edit' && procedureId) {
      loadProcedure();
    }
  }, [mode, procedureId]);

  const loadProcedure = async () => {
    try {
      setLoading(true);
      let data;
      try {
        data = await procedureLibraryService?.getBySlug(procedureId);
      } catch (_) {
        // procedureId is a UUID, not a slug — fall through to ID lookup
      }
      if (!data) {
        const all = await procedureLibraryService?.getAll();
        data = all?.find(p => p?.id === procedureId);
      }
      if (data) {
        setFormData({
          slug: data.slug ?? '',
          category: data.category ?? '',
          titleEn: data.titleEn ?? '',
          titleEs: data.titleEs ?? '',
          summaryEn: data.summaryEn ?? '',
          summaryEs: data.summaryEs ?? '',
          whyEn: data.whyEn ?? '',
          whyEs: data.whyEs ?? '',
          whatIfNotEn: data.whatIfNotEn ?? '',
          whatIfNotEs: data.whatIfNotEs ?? '',
          stepsEn: data.stepsEn ?? [],
          stepsEs: data.stepsEs ?? [],
          anesthesiaEn: data.anesthesiaEn ?? '',
          anesthesiaEs: data.anesthesiaEs ?? '',
          risksEn: data.risksEn ?? '',
          risksEs: data.risksEs ?? '',
          aftercareEn: data.aftercareEn ?? '',
          aftercareEs: data.aftercareEs ?? '',
          faqsEn: data.faqsEn ?? [],
          faqsEs: data.faqsEs ?? [],
          timeEstimate: data.timeEstimate ?? '',
          visitsEstimate: data.visitsEstimate ?? '',
          isPublished: data.isPublished ?? false,
        });

        // Load step visuals from procedure_visuals table
        const canonicalSlug = data.canonicalSlug || data.slug;
        setVisualSlug(canonicalSlug || null);
        if (canonicalSlug) {
          await reloadVisuals(canonicalSlug);
        }
      }
      setError('');
    } catch (err) {
      setError(err?.message || 'Failed to load procedure');
    } finally {
      setLoading(false);
    }
  };

  const reloadVisuals = async (slug = visualSlug) => {
    if (!slug || !supabase) return;
    const { data: visRows } = await supabase
      .from('procedure_visuals')
      .select('*')
      .eq('canonical_slug', slug)
      .order('sort_order', { ascending: true });
    setStepVisuals(visRows || []);
  };

  const handleVisualUpload = async (stepKey, file, sortOrder, stepTitle) => {
    if (!file || !visualSlug) return;
    setUploadingKey(stepKey);
    setVisualMessage(null);
    try {
      await storageService.uploadVisualAndCreateRecord(visualSlug, stepKey, file, sortOrder, {
        altTextEn: stepTitle || undefined,
      });
      trackEvent('step_image_uploaded', {
        step_key: stepKey,
        location: 'content_editor',
      });
      await reloadVisuals();
      setVisualMessage({ success: true, text: `Image for ${stepKey === 'hero' ? 'hero' : stepKey.replace('_', ' ')} updated. Patients see it immediately — check it with "Preview as patient".` });
    } catch (err) {
      console.error('Visual upload failed:', err);
      setVisualMessage({ success: false, text: err?.message || 'Upload failed' });
    } finally {
      setUploadingKey(null);
    }
  };

  const handleSave = async (publish = false) => {
    try {
      setSaving(true);
      setError('');

      const dataToSave = { ...formData, isPublished: publish };

      if (mode === 'create') {
        await procedureLibraryService?.create(dataToSave);
        setSuccess('Procedure created successfully!');
      } else {
        await procedureLibraryService?.update(procedureId, dataToSave);
        setSuccess('Procedure updated successfully!');
      }

      trackEvent('procedure_saved', {
        mode,
        published: publish,
      });
      if (formData?.isPublished !== publish) {
        trackEvent('procedure_publish_changed', {
          published: publish,
          location: 'content_editor',
        });
      }

      setTimeout(() => navigate('/procedure-library-management'), 1500);
    } catch (err) {
      setError(err?.message || 'Failed to save procedure');
    } finally {
      setSaving(false);
    }
  };

  const addStep = () => {
    const key = language === 'en' ? 'stepsEn' : 'stepsEs';
    setFormData(prev => ({
      ...prev,
      [key]: [...prev?.[key], { stepTitle: '', stepBody: '', imageKey: '' }]
    }));
  };

  const updateStep = (index, field, value) => {
    const key = language === 'en' ? 'stepsEn' : 'stepsEs';
    setFormData(prev => ({
      ...prev,
      [key]: prev?.[key]?.map((step, i) => i === index ? { ...step, [field]: value } : step)
    }));
  };

  const removeStep = (index) => {
    const key = language === 'en' ? 'stepsEn' : 'stepsEs';
    setFormData(prev => ({
      ...prev,
      [key]: prev?.[key]?.filter((_, i) => i !== index)
    }));
  };

  const addFaq = () => {
    const key = language === 'en' ? 'faqsEn' : 'faqsEs';
    setFormData(prev => ({
      ...prev,
      [key]: [...prev?.[key], { q: '', a: '' }]
    }));
  };

  const updateFaq = (index, field, value) => {
    const key = language === 'en' ? 'faqsEn' : 'faqsEs';
    setFormData(prev => ({
      ...prev,
      [key]: prev?.[key]?.map((faq, i) => i === index ? { ...faq, [field]: value } : faq)
    }));
  };

  const removeFaq = (index) => {
    const key = language === 'en' ? 'faqsEn' : 'faqsEs';
    setFormData(prev => ({
      ...prev,
      [key]: prev?.[key]?.filter((_, i) => i !== index)
    }));
  };

  const getFieldKey = (base) => language === 'en' ? `${base}En` : `${base}Es`;

  if (loading) {
    return (
      <div className="min-h-screen bg-bg0 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-accent border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-t2">Loading procedure...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg0">
      <DentistNavigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-bg1 rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate('/procedure-library-management')}
              className="flex items-center gap-2 text-t2 hover:text-t1"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Library
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
                className="flex items-center gap-2 px-4 py-2 border border-bd rounded-lg hover:bg-bg2"
              >
                <Languages className="w-5 h-5" />
                {language === 'en' ? 'English' : 'Español'}
              </button>
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:brightness-110"
              >
                <Eye className="w-5 h-5" />
                {previewMode ? 'Edit' : 'Preview'}
              </button>
              <button
                onClick={() => handleSave(false)}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-bg3 text-t1 rounded-lg hover:brightness-110 disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                Save Draft
              </button>
              <button
                onClick={() => handleSave(true)}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-success text-white dark:text-accent-foreground rounded-lg hover:brightness-110 disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                Publish
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {mode !== 'create' && (
              <ProcedureThumb
                canonicalSlug={formData?.canonicalSlug}
                slug={formData?.slug}
                name={formData?.title_en || formData?.titleEn}
                size="md"
                className="!w-20 !h-12"
                glow={false}
              />
            )}
            <h1 className="text-2xl font-bold text-t1 mb-0">
              {mode === 'create' ? 'Create New Procedure' : 'Edit Procedure'}
            </h1>
          </div>
        </div>

        {error && (
          <div className="bg-danger/10 border border-danger/20 rounded-lg p-4 mb-6">
            <p className="text-danger">{error}</p>
          </div>
        )}
        {success && (
          <div className="bg-success/10 border border-success/20 rounded-lg p-4 mb-6">
            <p className="text-success">{success}</p>
          </div>
        )}

        {previewMode ? (
          (<div className="bg-bg1 rounded-xl shadow-sm p-8">
            <div className="prose max-w-none">
              <h1>{formData?.[getFieldKey('title')]}</h1>
              {formData?.[getFieldKey('summary')] && <p className="lead">{formData?.[getFieldKey('summary')]}</p>}
              
              {formData?.[getFieldKey('why')] && (
                <div>
                  <h2>Why This Treatment?</h2>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{formData?.[getFieldKey('why')]}</ReactMarkdown>
                </div>
              )}
              
              {formData?.[getFieldKey('whatIfNot')] && (
                <div>
                  <h2>What If Not Treated?</h2>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{formData?.[getFieldKey('whatIfNot')]}</ReactMarkdown>
                </div>
              )}
              
              {formData?.[getFieldKey('steps')]?.length > 0 && (
                <div>
                  <h2>Procedure Steps</h2>
                  {formData?.[getFieldKey('steps')]?.map((step, i) => {
                    const visual = stepVisuals.find(v => v?.step_key === `step_${i + 1}`);
                    return (
                      <div key={i} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                        {visual && (
                          <div style={{ flexShrink: 0 }}>
                            <img
                              src={visual.image_url}
                              alt={language === 'en' ? visual.alt_text_en : visual.alt_text_es}
                              style={{ width: 200, height: 'auto', borderRadius: 8, border: '1px solid #e2e8f0' }}
                            />
                          </div>
                        )}
                        <div style={{ flex: 1, minWidth: 200 }}>
                          <h3>{step?.stepTitle}</h3>
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{step?.stepBody}</ReactMarkdown>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {stepVisuals?.length > 0 && formData?.[getFieldKey('steps')]?.length === 0 && (
                <div>
                  <h2>Procedure Steps</h2>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    {stepVisuals.filter(v => v?.step_key !== 'hero').map((vis, i) => (
                      <div key={vis?.step_key || i} style={{ textAlign: 'center' }}>
                        <img
                          src={vis.image_url}
                          alt={language === 'en' ? vis.alt_text_en : vis.alt_text_es}
                          style={{ width: 180, height: 'auto', borderRadius: 8, border: '1px solid #e2e8f0' }}
                        />
                        <p style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{vis?.step_key === `step_${i + 1}` ? `Step ${i + 1}` : (vis?.step_key || `Step ${i + 1}`).replace('step_', 'Step ')}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {formData?.[getFieldKey('anesthesia')] && (
                <div>
                  <h2>Anesthesia</h2>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{formData?.[getFieldKey('anesthesia')]}</ReactMarkdown>
                </div>
              )}
              
              {formData?.[getFieldKey('risks')] && (
                <div>
                  <h2>Risks & Considerations</h2>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{formData?.[getFieldKey('risks')]}</ReactMarkdown>
                </div>
              )}
              
              {formData?.[getFieldKey('aftercare')] && (
                <div>
                  <h2>Aftercare</h2>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{formData?.[getFieldKey('aftercare')]}</ReactMarkdown>
                </div>
              )}
              
              {formData?.[getFieldKey('faqs')]?.length > 0 && (
                <div>
                  <h2>Frequently Asked Questions</h2>
                  {formData?.[getFieldKey('faqs')]?.map((faq, i) => (
                    <div key={i}>
                      <h3>{faq?.q}</h3>
                      <p>{faq?.a}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>)
        ) : (
          (<div className="space-y-6">
            <div className="bg-bg1 rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-t1 mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-t2 mb-2">Slug (URL identifier)</label>
                    <input
                      type="text"
                      value={formData?.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e?.target?.value })}
                      placeholder="e.g., dental-crown"
                      className="w-full px-4 py-2 border border-bd rounded-lg bg-bg0 text-t1 focus:border-accent focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-t2 mb-2">Category</label>
                    <select
                      value={formData?.category || ''}
                      onChange={(e) => setFormData({ ...formData, category: e?.target?.value })}
                      className="w-full px-4 py-2 border border-bd rounded-lg bg-bg0 text-t1 focus:border-accent focus:outline-none"
                    >
                      <option value="">Select category...</option>
                      <option value="preventive">Preventive</option>
                      <option value="restorative">Restorative</option>
                      <option value="endodontics">Endodontics</option>
                      <option value="endodontic">Endodontic</option>
                      <option value="periodontics">Periodontics</option>
                      <option value="periodontic">Periodontic</option>
                      <option value="prosthodontics">Prosthodontics</option>
                      <option value="surgery">Surgery</option>
                      <option value="oral-surgery">Oral Surgery</option>
                      <option value="orthodontics">Orthodontics</option>
                      <option value="cosmetic">Cosmetic</option>
                      <option value="adjunctive">Adjunctive</option>
                      <option value="diagnostic">Diagnostic</option>
                      <option value="implants">Implants</option>
                      <option value="pediatric">Pediatric</option>
                      <option value="emergency">Emergency</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-t2 mb-2">Title</label>
                  <input
                    type="text"
                    value={formData?.[getFieldKey('title')]}
                    onChange={(e) => setFormData({ ...formData, [getFieldKey('title')]: e?.target?.value })}
                    placeholder="Procedure title"
                    className="w-full px-4 py-2 border border-bd rounded-lg bg-bg0 text-t1 focus:border-accent focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-t2 mb-2">Summary</label>
                  <textarea
                    value={formData?.[getFieldKey('summary')]}
                    onChange={(e) => setFormData({ ...formData, [getFieldKey('summary')]: e?.target?.value })}
                    placeholder="Brief summary"
                    rows="2"
                    className="w-full px-4 py-2 border border-bd rounded-lg bg-bg0 text-t1 focus:border-accent focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-t2 mb-2">Time Estimate</label>
                    <input
                      type="text"
                      value={formData?.timeEstimate}
                      onChange={(e) => setFormData({ ...formData, timeEstimate: e?.target?.value })}
                      placeholder="e.g., 1-2 hours"
                      className="w-full px-4 py-2 border border-bd rounded-lg bg-bg0 text-t1 focus:border-accent focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-t2 mb-2">Visits Estimate</label>
                    <input
                      type="text"
                      value={formData?.visitsEstimate}
                      onChange={(e) => setFormData({ ...formData, visitsEstimate: e?.target?.value })}
                      placeholder="e.g., 2-3 visits"
                      className="w-full px-4 py-2 border border-bd rounded-lg bg-bg0 text-t1 focus:border-accent focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-bg1 rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-t1 mb-4">Content</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-t2 mb-2">Why This Treatment? (Markdown)</label>
                  <textarea
                    value={formData?.[getFieldKey('why')]}
                    onChange={(e) => setFormData({ ...formData, [getFieldKey('why')]: e?.target?.value })}
                    placeholder="Explain why this treatment is needed..."
                    rows="4"
                    className="w-full px-4 py-2 border border-bd rounded-lg bg-bg0 text-t1 focus:border-accent focus:outline-none font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-t2 mb-2">What If Not Treated? (Markdown)</label>
                  <textarea
                    value={formData?.[getFieldKey('whatIfNot')]}
                    onChange={(e) => setFormData({ ...formData, [getFieldKey('whatIfNot')]: e?.target?.value })}
                    placeholder="Explain consequences of not treating..."
                    rows="4"
                    className="w-full px-4 py-2 border border-bd rounded-lg bg-bg0 text-t1 focus:border-accent focus:outline-none font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-t2 mb-2">Anesthesia (Markdown)</label>
                  <textarea
                    value={formData?.[getFieldKey('anesthesia')]}
                    onChange={(e) => setFormData({ ...formData, [getFieldKey('anesthesia')]: e?.target?.value })}
                    placeholder="Describe anesthesia options..."
                    rows="3"
                    className="w-full px-4 py-2 border border-bd rounded-lg bg-bg0 text-t1 focus:border-accent focus:outline-none font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-t2 mb-2">Risks & Considerations (Markdown)</label>
                  <textarea
                    value={formData?.[getFieldKey('risks')]}
                    onChange={(e) => setFormData({ ...formData, [getFieldKey('risks')]: e?.target?.value })}
                    placeholder="List risks and considerations..."
                    rows="4"
                    className="w-full px-4 py-2 border border-bd rounded-lg bg-bg0 text-t1 focus:border-accent focus:outline-none font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-t2 mb-2">Aftercare (Markdown)</label>
                  <textarea
                    value={formData?.[getFieldKey('aftercare')]}
                    onChange={(e) => setFormData({ ...formData, [getFieldKey('aftercare')]: e?.target?.value })}
                    placeholder="Describe aftercare instructions..."
                    rows="4"
                    className="w-full px-4 py-2 border border-bd rounded-lg bg-bg0 text-t1 focus:border-accent focus:outline-none font-mono text-sm"
                  />
                </div>
              </div>
            </div>
            <div className="bg-bg1 rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-t1">Procedure Steps</h2>
                <button
                  onClick={addStep}
                  className="flex items-center gap-2 px-4 py-2 bg-success text-white dark:text-accent-foreground rounded-lg hover:brightness-110"
                >
                  <Plus className="w-4 h-4" />
                  Add Step
                </button>
              </div>
              <div className="space-y-4">
                {formData?.[getFieldKey('steps')]?.map((step, index) => (
                  <div key={index} className="border border-bd rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-t2">Step {index + 1}</span>
                      <button
                        onClick={() => removeStep(index)}
                        className="text-danger hover:bg-danger/10 p-1 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={step?.stepTitle}
                      onChange={(e) => updateStep(index, 'stepTitle', e?.target?.value)}
                      placeholder="Step title"
                      className="w-full px-4 py-2 border border-bd rounded-lg bg-bg0 text-t1 mb-2 focus:border-accent focus:outline-none"
                    />
                    <textarea
                      value={step?.stepBody}
                      onChange={(e) => updateStep(index, 'stepBody', e?.target?.value)}
                      placeholder="Step description (Markdown)"
                      rows="3"
                      className="w-full px-4 py-2 border border-bd rounded-lg bg-bg0 text-t1 mb-2 focus:border-accent focus:outline-none font-mono text-sm"
                    />
                    <input
                      type="text"
                      value={step?.imageKey}
                      onChange={(e) => updateStep(index, 'imageKey', e?.target?.value)}
                      placeholder="Image key (optional)"
                      className="w-full px-4 py-2 border border-bd rounded-lg bg-bg0 text-t1 focus:border-accent focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
            {mode === 'edit' && (
              <div className="bg-bg1 rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-xl font-bold text-t1">Step Images</h2>
                  {visualSlug && (
                    <button
                      onClick={() => navigate(`/preview-patient-page/${encodeURIComponent(visualSlug)}`)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-bg0 text-t1 border border-bd hover:bg-bg2 transition-colors"
                    >
                      <MonitorSmartphone size={14} />
                      Preview as patient
                    </button>
                  )}
                </div>
                <p className="text-t3 text-sm mb-4">
                  Upload a replacement image for any step below (e.g. an anatomically accurate render). It replaces what patients see for that step immediately — no publishing needed.
                </p>
                {!visualSlug ? (
                  <p className="text-t3 text-sm">Save the procedure first, then reopen it to manage step images.</p>
                ) : (
                  <>
                    {visualMessage && (
                      <div className={`rounded-lg p-3 mb-4 text-sm ${visualMessage.success ? 'bg-success/10 text-success border border-success/20' : 'bg-danger/10 text-danger border border-danger/20'}`}>
                        {visualMessage.text}
                      </div>
                    )}
                    <div className="space-y-3">
                      {[
                        { stepKey: 'hero', sortOrder: 0, label: 'Hero image (top of patient page)', title: formData?.titleEn },
                        ...(formData?.stepsEn || []).map((step, i) => ({
                          stepKey: `step_${i + 1}`,
                          sortOrder: i + 1,
                          label: `Step ${i + 1}: ${step?.stepTitle || step?.title || 'Untitled'}`,
                          title: step?.stepTitle || step?.title,
                        })),
                      ].map(({ stepKey, sortOrder, label, title }) => {
                        const visual = stepVisuals.find(v => v?.step_key === stepKey);
                        const cacheBuster = visual?.updated_at ? `?v=${new Date(visual.updated_at).getTime()}` : '';
                        const isUploading = uploadingKey === stepKey;
                        return (
                          <div key={stepKey} className="flex items-center gap-4 border border-bd rounded-lg p-3">
                            <div className="w-24 h-16 rounded-lg overflow-hidden bg-bg0 border border-bd flex items-center justify-center flex-shrink-0">
                              {visual?.image_url ? (
                                <img src={`${visual.image_url}${cacheBuster}`} alt={visual?.alt_text_en || label} className="w-full h-full object-cover" />
                              ) : (
                                <ImageIcon size={20} className="text-t3" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-t1 text-sm font-medium truncate">{label}</p>
                              <p className="text-t3 text-xs">{visual ? 'Current image shown to patients' : 'No image yet for this step'}</p>
                            </div>
                            <label className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer flex-shrink-0 ${isUploading ? 'bg-bg2 text-t3 border-bd cursor-wait' : 'bg-accent/10 text-accent border-accent/25 hover:bg-accent/20'}`}>
                              {isUploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                              {visual ? 'Replace' : 'Upload'}
                              <input
                                type="file"
                                accept="image/png,image/jpeg,image/webp,image/gif"
                                className="hidden"
                                disabled={isUploading || uploadingKey !== null}
                                onChange={(e) => {
                                  const file = e?.target?.files?.[0];
                                  e.target.value = '';
                                  if (file) handleVisualUpload(stepKey, file, sortOrder, title);
                                }}
                              />
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            )}
            <div className="bg-bg1 rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-t1">FAQs</h2>
                <button
                  onClick={addFaq}
                  className="flex items-center gap-2 px-4 py-2 bg-success text-white dark:text-accent-foreground rounded-lg hover:brightness-110"
                >
                  <Plus className="w-4 h-4" />
                  Add FAQ
                </button>
              </div>
              <div className="space-y-4">
                {formData?.[getFieldKey('faqs')]?.map((faq, index) => (
                  <div key={index} className="border border-bd rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-t2">FAQ {index + 1}</span>
                      <button
                        onClick={() => removeFaq(index)}
                        className="text-danger hover:bg-danger/10 p-1 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={faq?.q}
                      onChange={(e) => updateFaq(index, 'q', e?.target?.value)}
                      placeholder="Question"
                      className="w-full px-4 py-2 border border-bd rounded-lg bg-bg0 text-t1 mb-2 focus:border-accent focus:outline-none"
                    />
                    <textarea
                      value={faq?.a}
                      onChange={(e) => updateFaq(index, 'a', e?.target?.value)}
                      placeholder="Answer"
                      rows="2"
                      className="w-full px-4 py-2 border border-bd rounded-lg bg-bg0 text-t1 focus:border-accent focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>)
        )}
      </div>
    </div>
  );
}
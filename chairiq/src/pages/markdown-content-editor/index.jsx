import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Save, Eye, Languages, Plus, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { procedureLibraryService } from '../../services/procedureLibraryService';
import DentistNavigation from '../../components/DentistNavigation';

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

  const [formData, setFormData] = useState({
    slug: '',
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
      const data = (await procedureLibraryService?.getBySlug(procedureId)) || 
                   (await procedureLibraryService?.getAll())?.find(p => p?.id === procedureId);
      if (data) {
        setFormData(data);
      }
      setError('');
    } catch (err) {
      setError(err?.message || 'Failed to load procedure');
    } finally {
      setLoading(false);
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
                className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:brightness-110"
              >
                <Eye className="w-5 h-5" />
                {previewMode ? 'Edit' : 'Preview'}
              </button>
              <button
                onClick={() => handleSave(false)}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-bg3 text-white rounded-lg hover:brightness-110 disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                Save Draft
              </button>
              <button
                onClick={() => handleSave(true)}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-success text-white rounded-lg hover:brightness-110 disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                Publish
              </button>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-t1">
            {mode === 'create' ? 'Create New Procedure' : 'Edit Procedure'}
          </h1>
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
                  {formData?.[getFieldKey('steps')]?.map((step, i) => (
                    <div key={i}>
                      <h3>{step?.stepTitle}</h3>
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{step?.stepBody}</ReactMarkdown>
                    </div>
                  ))}
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
                  className="flex items-center gap-2 px-4 py-2 bg-success text-white rounded-lg hover:brightness-110"
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
            <div className="bg-bg1 rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-t1">FAQs</h2>
                <button
                  onClick={addFaq}
                  className="flex items-center gap-2 px-4 py-2 bg-success text-white rounded-lg hover:brightness-110"
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
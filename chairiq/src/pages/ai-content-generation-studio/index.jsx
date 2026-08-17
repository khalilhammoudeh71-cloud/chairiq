import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, AlertTriangle, Heart, HelpCircle, Save, Wand2, Settings, Layers } from 'lucide-react';
import ContentGenerationPanel from './components/ContentGenerationPanel';
import BatchProcessingPanel from './components/BatchProcessingPanel';
import BatchJobsList from './components/BatchJobsList';
import {
  generateProcedureDescription,
  generateRiskAssessment,
  generateAftercareInstructions,
  generateFAQs,
  generateAllContent
} from '../../services/aiContentGenerationService';
import { getAllProcedures, updateProcedure } from '../../services/procedureLibraryService';
import { useToast } from '../../hooks/useToast';
import { 
  createBatchJob, 
  getBatchJobs, 
  startBatchJobProcessing,
  cancelBatchJob 
} from '../../services/batchProcessingService';

const AIContentGenerationStudio = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [selectedProcedure, setSelectedProcedure] = useState('');
  const [procedures, setProcedures] = useState([]);
  const [clinicalSpecs, setClinicalSpecs] = useState('');
  const [language, setLanguage] = useState('en');
  const [tone, setTone] = useState('professional');
  const [complexity, setComplexity] = useState('detailed');
  const [targetAudience, setTargetAudience] = useState('general');

  const [generatedContent, setGeneratedContent] = useState({
    description: '',
    risks: '',
    aftercare: '',
    faqs: []
  });

  const [isGenerating, setIsGenerating] = useState({
    description: false,
    risks: false,
    aftercare: false,
    faqs: false,
    all: false
  });

  const [showBatchView, setShowBatchView] = useState(false);
  const [batchJobs, setBatchJobs] = useState([]);
  const [isCreatingBatch, setIsCreatingBatch] = useState(false);

  useEffect(() => {
    loadProcedures();
  }, []);

  const loadProcedures = async () => {
    try {
      const data = await getAllProcedures();
      setProcedures(data || []);
    } catch (error) {
      showToast('Failed to load procedures', 'error');
    }
  };

  useEffect(() => {
    if (selectedProcedure) {
      const procedure = procedures?.find(p => p?.id === selectedProcedure);
      if (procedure) {
        const langSuffix = language === 'en' ? '_en' : '_es';
        setClinicalSpecs(procedure?.[`summary${langSuffix}`] || '');
        setGeneratedContent({
          description: procedure?.[`summary${langSuffix}`] || '',
          risks: procedure?.[`risks${langSuffix}`] || '',
          aftercare: procedure?.[`aftercare${langSuffix}`] || '',
          faqs: procedure?.[`faqs${langSuffix}`] || []
        });
      }
    }
  }, [selectedProcedure, language, procedures]);

  useEffect(() => {
    if (showBatchView) {
      loadBatchJobs();
    }
  }, [showBatchView]);

  const loadBatchJobs = async () => {
    try {
      const jobs = await getBatchJobs();
      setBatchJobs(jobs);
    } catch (error) {
      showToast('Failed to load batch jobs', 'error');
    }
  };

  const handleCreateBatchJob = async (batchConfig) => {
    setIsCreatingBatch(true);
    try {
      const job = await createBatchJob(batchConfig);
      showToast('Batch job created successfully', 'success');
      
      if (!batchConfig?.scheduledAt) {
        await startBatchJobProcessing(job?.id);
        showToast('Batch processing started', 'info');
      } else {
        showToast('Batch job scheduled successfully', 'info');
      }
      
      await loadBatchJobs();
    } catch (error) {
      showToast(error?.message || 'Failed to create batch job', 'error');
    } finally {
      setIsCreatingBatch(false);
    }
  };

  const handleViewBatchDetails = (jobId) => {
    navigate(`/admin/batch-jobs/${jobId}`);
  };

  const handleCancelBatchJob = async (jobId) => {
    try {
      await cancelBatchJob(jobId);
      showToast('Batch job cancelled successfully', 'success');
      await loadBatchJobs();
    } catch (error) {
      showToast('Failed to cancel batch job', 'error');
    }
  };

  const handleGenerate = async (contentType) => {
    if (!selectedProcedure || !clinicalSpecs?.trim()) {
      showToast('Please select a procedure and provide clinical specifications', 'error');
      return;
    }

    const procedure = procedures?.find(p => p?.id === selectedProcedure);
    if (!procedure) return;

    const params = {
      procedureTitle: language === 'en' ? procedure?.title_en : procedure?.title_es,
      clinicalSpecs,
      language,
      tone,
      complexity,
      targetAudience
    };

    setIsGenerating(prev => ({ ...prev, [contentType]: true }));

    try {
      let result;
      switch (contentType) {
        case 'description':
          result = await generateProcedureDescription(params);
          setGeneratedContent(prev => ({ ...prev, description: result }));
          break;
        case 'risks':
          result = await generateRiskAssessment(params);
          setGeneratedContent(prev => ({ ...prev, risks: result }));
          break;
        case 'aftercare':
          result = await generateAftercareInstructions(params);
          setGeneratedContent(prev => ({ ...prev, aftercare: result }));
          break;
        case 'faqs':
          result = await generateFAQs(params);
          setGeneratedContent(prev => ({ ...prev, faqs: result }));
          break;
        default:
          break;
      }
      showToast(`${contentType?.charAt(0)?.toUpperCase() + contentType?.slice(1)} generated successfully`, 'success');
    } catch (error) {
      showToast(error?.message || `Failed to generate ${contentType}`, 'error');
    } finally {
      setIsGenerating(prev => ({ ...prev, [contentType]: false }));
    }
  };

  const handleGenerateAll = async () => {
    if (!selectedProcedure || !clinicalSpecs?.trim()) {
      showToast('Please select a procedure and provide clinical specifications', 'error');
      return;
    }

    const procedure = procedures?.find(p => p?.id === selectedProcedure);
    if (!procedure) return;

    const params = {
      procedureTitle: language === 'en' ? procedure?.title_en : procedure?.title_es,
      clinicalSpecs,
      language,
      tone,
      complexity,
      targetAudience
    };

    setIsGenerating({
      description: true,
      risks: true,
      aftercare: true,
      faqs: true,
      all: true
    });

    try {
      let result = await generateAllContent(params);
      setGeneratedContent({
        description: result?.description,
        risks: result?.risks,
        aftercare: result?.aftercare,
        faqs: result?.faqs
      });
      showToast('All content generated successfully', 'success');
    } catch (error) {
      showToast(error?.message || 'Failed to generate content', 'error');
    } finally {
      setIsGenerating({
        description: false,
        risks: false,
        aftercare: false,
        faqs: false,
        all: false
      });
    }
  };

  const handleSave = async () => {
    if (!selectedProcedure) {
      showToast('Please select a procedure', 'error');
      return;
    }

    try {
      const procedure = procedures?.find(p => p?.id === selectedProcedure);
      const langSuffix = language === 'en' ? '_en' : '_es';

      const updates = {
        [`summary${langSuffix}`]: generatedContent?.description,
        [`risks${langSuffix}`]: generatedContent?.risks,
        [`aftercare${langSuffix}`]: generatedContent?.aftercare,
        [`faqs${langSuffix}`]: generatedContent?.faqs
      };

      await updateProcedure(selectedProcedure, updates);
      showToast('Content saved to procedure library successfully', 'success');
      
      await loadProcedures();
    } catch (error) {
      showToast('Failed to save content', 'error');
    }
  };

  const handleCopyContent = (content) => {
    const textContent = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
    navigator.clipboard?.writeText(textContent);
    showToast('Content copied to clipboard', 'success');
  };

  return (
    <div className="min-h-screen bg-bg0">
      <div className="bg-bg1 border-b border-bd sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin/procedure-library')}
                className="p-2 hover:bg-bg2 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5 text-t2" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-t1 flex items-center gap-2">
                  <Wand2 className="w-7 h-7 text-accent" />
                  AI Content Generation Studio
                </h1>
                <p className="text-sm text-t2 mt-1">
                  Auto-generate dentist-grade procedure content using OpenAI
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowBatchView(!showBatchView)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  showBatchView
                    ? 'bg-accent text-accent-foreground' : 'bg-bg2 text-t2 hover:bg-bg3'
                }`}
              >
                <Layers className="w-4 h-4" />
                {showBatchView ? 'Single Generation' : 'Batch Processing'}
              </button>
              {!showBatchView && (
                <button
                  onClick={handleSave}
                  disabled={!selectedProcedure}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedProcedure
                      ? 'bg-success text-accent-foreground hover:brightness-110' : 'bg-bg2 text-t3 cursor-not-allowed'
                  }`}
                >
                  <Save className="w-4 h-4" />
                  Save to Library
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showBatchView ? (
          <div className="space-y-6">
            <BatchProcessingPanel
              procedures={procedures}
              onCreateBatchJob={handleCreateBatchJob}
              isCreating={isCreatingBatch}
            />
            <BatchJobsList
              jobs={batchJobs}
              onRefresh={loadBatchJobs}
              onViewDetails={handleViewBatchDetails}
              onCancelJob={handleCancelBatchJob}
            />
          </div>
        ) : (
          <>
            <div className="bg-bg1 rounded-xl shadow-sm border border-bd p-6 mb-8">
              <div className="flex items-center gap-2 mb-6">
                <Settings className="w-5 h-5 text-t2" />
                <h2 className="text-lg font-semibold text-t1">Configuration</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-t2 mb-2">
                      Select Procedure *
                    </label>
                    <select
                      value={selectedProcedure}
                      onChange={(e) => setSelectedProcedure(e?.target?.value)}
                      className="w-full px-4 py-2 border border-bd rounded-lg bg-bg0 text-t1 focus:border-accent focus:outline-none"
                    >
                      <option value="">Choose a procedure...</option>
                      {procedures?.map((proc) => (
                        <option key={proc?.id} value={proc?.id}>
                          {language === 'en' ? proc?.title_en : proc?.title_es}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-t2 mb-2">
                      Clinical Specifications *
                    </label>
                    <textarea
                      value={clinicalSpecs}
                      onChange={(e) => setClinicalSpecs(e?.target?.value)}
                      placeholder="Enter clinical specifications, indications, contraindications, and key details..."
                      className="w-full px-4 py-3 border border-bd rounded-lg bg-bg0 text-t1 focus:border-accent focus:outline-none resize-none"
                      rows={4}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-t2 mb-2">
                      Content Language
                    </label>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setLanguage('en')}
                        className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                          language === 'en' ? 'bg-accent text-accent-foreground' : 'bg-bg2 text-t2 hover:bg-bg3'
                        }`}
                      >
                        English
                      </button>
                      <button
                        onClick={() => setLanguage('es')}
                        className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                          language === 'es' ? 'bg-accent text-accent-foreground' : 'bg-bg2 text-t2 hover:bg-bg3'
                        }`}
                      >
                        Spanish
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-t2 mb-2">
                      Content Tone
                    </label>
                    <select
                      value={tone}
                      onChange={(e) => setTone(e?.target?.value)}
                      className="w-full px-4 py-2 border border-bd rounded-lg bg-bg0 text-t1 focus:border-accent focus:outline-none"
                    >
                      <option value="professional">Professional</option>
                      <option value="friendly">Friendly & Approachable</option>
                      <option value="simple">Simple & Clear</option>
                      <option value="technical">Technical & Detailed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-t2 mb-2">
                      Complexity Level
                    </label>
                    <select
                      value={complexity}
                      onChange={(e) => setComplexity(e?.target?.value)}
                      className="w-full px-4 py-2 border border-bd rounded-lg bg-bg0 text-t1 focus:border-accent focus:outline-none"
                    >
                      <option value="basic">Basic - Simple explanations</option>
                      <option value="detailed">Detailed - Comprehensive information</option>
                      <option value="comprehensive">Comprehensive - Expert-level detail</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-t2 mb-2">
                      Target Audience
                    </label>
                    <select
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e?.target?.value)}
                      className="w-full px-4 py-2 border border-bd rounded-lg bg-bg0 text-t1 focus:border-accent focus:outline-none"
                    >
                      <option value="general">General Public</option>
                      <option value="anxious">Anxious Patients</option>
                      <option value="informed">Well-Informed Patients</option>
                      <option value="pediatric">Pediatric Patients</option>
                    </select>
                  </div>

                  <button
                    onClick={handleGenerateAll}
                    disabled={isGenerating?.all || !selectedProcedure || !clinicalSpecs?.trim()}
                    className={`w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                      isGenerating?.all || !selectedProcedure || !clinicalSpecs?.trim()
                        ? 'bg-bg2 text-t3 cursor-not-allowed' : 'bg-accent text-accent-foreground hover:brightness-110 shadow-md'
                    }`}
                  >
                    <Wand2 className="w-5 h-5" />
                    {isGenerating?.all ? 'Generating All Content...' : 'Generate All Content'}
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ContentGenerationPanel
                title="Procedure Description"
                description="Patient-friendly explanation with clinical accuracy"
                content={generatedContent?.description}
                isGenerating={isGenerating?.description}
                onGenerate={() => handleGenerate('description')}
                onCopy={() => handleCopyContent(generatedContent?.description)}
                icon={FileText}
                color="bg-accent/10"
                disabled={!selectedProcedure || !clinicalSpecs?.trim()}
              />

              <ContentGenerationPanel
                title="Risk Assessment"
                description="Comprehensive risk factors and contraindications"
                content={generatedContent?.risks}
                isGenerating={isGenerating?.risks}
                onGenerate={() => handleGenerate('risks')}
                onCopy={() => handleCopyContent(generatedContent?.risks)}
                icon={AlertTriangle}
                color="bg-warning/10"
                disabled={!selectedProcedure || !clinicalSpecs?.trim()}
              />

              <ContentGenerationPanel
                title="Aftercare Instructions"
                description="Detailed post-treatment care protocols"
                content={generatedContent?.aftercare}
                isGenerating={isGenerating?.aftercare}
                onGenerate={() => handleGenerate('aftercare')}
                onCopy={() => handleCopyContent(generatedContent?.aftercare)}
                icon={Heart}
                color="bg-success/10"
                disabled={!selectedProcedure || !clinicalSpecs?.trim()}
              />

              <ContentGenerationPanel
                title="FAQ Generation"
                description="Common patient questions with evidence-based answers"
                content={generatedContent?.faqs?.map(faq => `Q: ${faq?.q}\nA: ${faq?.a}`)?.join('\n\n')}
                isGenerating={isGenerating?.faqs}
                onGenerate={() => handleGenerate('faqs')}
                onCopy={() => handleCopyContent(generatedContent?.faqs)}
                icon={HelpCircle}
                color="bg-bg3"
                disabled={!selectedProcedure || !clinicalSpecs?.trim()}
              />
            </div>

            <div className="mt-8 bg-accent/10 border border-accent/20 rounded-lg p-4">
              <div className="flex gap-3">
                <Wand2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div className="text-sm text-t1">
                  <p className="font-medium mb-1">AI-Powered Content Generation</p>
                  <p className="text-t2">
                    Content is generated using OpenAI's GPT-5 model with clinical terminology validation.
                    Review and edit all generated content before saving to the procedure library.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AIContentGenerationStudio;
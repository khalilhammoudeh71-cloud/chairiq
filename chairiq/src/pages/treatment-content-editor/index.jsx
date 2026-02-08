import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Save, Eye, Check, AlertCircle } from 'lucide-react';

import 'react-quill/dist/quill.snow.css';
import { procedures } from '../../data/procedures';
import DentistNavigation from '../../components/DentistNavigation';
import RichTextEditor from './components/RichTextEditor';
import StepEditor from './components/StepEditor';
import ImageManager from './components/ImageManager';
import PreviewModal from './components/PreviewModal';
import { useToast } from '../../hooks/useToast';

const TreatmentContentEditor = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const procedureId = searchParams?.get('id');
  const { showToast } = useToast();

  const [selectedProcedure, setSelectedProcedure] = useState(null);
  const [language, setLanguage] = useState('en');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  // Form state
  const [formData, setFormData] = useState({
    title: { en: '', es: '' },
    description: { en: '', es: '' },
    whyNeeded: { en: '', es: '' },
    whatToExpect: { en: '', es: '' },
    steps: [],
    images: []
  });

  useEffect(() => {
    if (procedureId) {
      const procedure = procedures?.find(p => p?.id === parseInt(procedureId));
      if (procedure) {
        setSelectedProcedure(procedure);
        setFormData({
          title: { 
            en: procedure?.name, 
            es: procedure?.nameEs || procedure?.name 
          },
          description: { 
            en: procedure?.description, 
            es: procedure?.descriptionEs || procedure?.description 
          },
          whyNeeded: { 
            en: procedure?.whyNeeded || '', 
            es: procedure?.whyNeededEs || '' 
          },
          whatToExpect: { 
            en: procedure?.whatToExpect || '', 
            es: procedure?.whatToExpectEs || '' 
          },
          steps: procedure?.steps || [],
          images: procedure?.images || []
        });
      }
    }
  }, [procedureId]);

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: {
        ...prev?.[field],
        [language]: value
      }
    }));
    setHasUnsavedChanges(true);
  };

  const handleStepsUpdate = (updatedSteps) => {
    setFormData(prev => ({
      ...prev,
      steps: updatedSteps
    }));
    setHasUnsavedChanges(true);
  };

  const handleImagesUpdate = (updatedImages) => {
    setFormData(prev => ({
      ...prev,
      images: updatedImages
    }));
    setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showToast('Treatment content saved successfully', 'success');
      setHasUnsavedChanges(false);
    } catch (error) {
      showToast('Failed to save changes. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    if (hasUnsavedChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        navigate('/treatment-content-management-dashboard');
      }
    } else {
      navigate('/treatment-content-management-dashboard');
    }
  };

  if (!selectedProcedure) {
    return (
      <div className="min-h-screen bg-gray-900">
        <DentistNavigation />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Procedure Not Found</h2>
            <p className="text-gray-400 mb-6">The requested procedure could not be found.</p>
            <button
              onClick={() => navigate('/treatment-content-management-dashboard')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-0">
      <DentistNavigation />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="card mb-8 p-6">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-bg-1 rounded-lg"
            >
              <ArrowLeft className="w-6 h-6 text-text-2" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Edit Treatment Content
              </h1>
              <p className="text-gray-400 mt-1">
                {selectedProcedure?.name} - Customize educational materials
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <div className="flex bg-bg-1 rounded-lg p-1">
              <button
                onClick={() => setLanguage('en')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  language === 'en' ?'bg-blue-600 text-white' :'text-gray-400 hover:text-white'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('es')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  language === 'es' ?'bg-blue-600 text-white' :'text-gray-400 hover:text-white'
                }`}
              >
                Español
              </button>
            </div>

            {/* Preview Button */}
            <button
              onClick={() => setShowPreview(true)}
              className="flex items-center gap-2 px-4 py-2 bg-bg-1 text-text-1 rounded-lg hover:bg-bg-2"
            >
              <Eye className="w-5 h-5" />
              Preview
            </button>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={!hasUnsavedChanges || isSaving}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                hasUnsavedChanges && !isSaving
                  ? 'bg-blue-600 text-white hover:bg-blue-700' :'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isSaving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>

        {/* Unsaved Changes Indicator */}
        {hasUnsavedChanges && (
          <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-500" />
            <p className="text-yellow-200 text-sm">
              You have unsaved changes. Make sure to save before leaving this page.
            </p>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Procedure Selection */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-text-1 mb-4">
                Select Procedure
              </h3>
              <div className="space-y-2">
                {procedures?.map(proc => (
                  <button
                    key={proc?.id}
                    onClick={() => {
                      if (hasUnsavedChanges) {
                        if (window.confirm('You have unsaved changes. Switch procedure?')) {
                          navigate(`/treatment-content-editor?id=${proc?.id}`);
                        }
                      } else {
                        navigate(`/treatment-content-editor?id=${proc?.id}`);
                      }
                    }}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      proc?.id === selectedProcedure?.id
                        ? 'bg-blue-600 text-white' :'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <div className="font-medium text-sm">{proc?.name}</div>
                    <div className="text-xs opacity-75 mt-1">{proc?.category}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Editor Area */}
          <div className="lg:col-span-3">
            {/* Tabs */}
            <div className="card rounded-t-xl border-b border-gray-200">
              <div className="flex gap-1 p-1">
                {[
                  { id: 'description', label: 'Description' },
                  { id: 'steps', label: 'Step-by-Step' },
                  { id: 'images', label: 'Images' },
                  { id: 'details', label: 'Additional Details' }
                ]?.map(tab => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`px-6 py-3 rounded-lg text-sm font-medium ${
                      activeTab === tab?.id
                        ? 'bg-bg-1 text-text-1' :'text-text-3 hover:text-text-1 hover:bg-bg-0'
                    }`}
                  >
                    {tab?.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="card rounded-b-xl p-6">
              {activeTab === 'description' && (
                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Treatment Title ({language === 'en' ? 'English' : 'Spanish'})
                    </label>
                    <input
                      type="text"
                      value={formData?.title?.[language]}
                      onChange={(e) => handleFieldChange('title', e?.target?.value)}
                      className="input-field w-full"
                      placeholder="Enter treatment title"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Main Description ({language === 'en' ? 'English' : 'Spanish'})
                    </label>
                    <RichTextEditor
                      value={formData?.description?.[language]}
                      onChange={(value) => handleFieldChange('description', value)}
                      placeholder="Enter detailed description of the treatment..."
                    />
                  </div>
                </div>
              )}

              {activeTab === 'steps' && (
                <StepEditor
                  steps={formData?.steps}
                  language={language}
                  onUpdate={handleStepsUpdate}
                />
              )}

              {activeTab === 'images' && (
                <ImageManager
                  images={formData?.images}
                  onUpdate={handleImagesUpdate}
                  procedureName={selectedProcedure?.name}
                />
              )}

              {activeTab === 'details' && (
                <div className="space-y-6">
                  {/* Why This Treatment */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Why This Treatment is Needed ({language === 'en' ? 'English' : 'Spanish'})
                    </label>
                    <RichTextEditor
                      value={formData?.whyNeeded?.[language]}
                      onChange={(value) => handleFieldChange('whyNeeded', value)}
                      placeholder="Explain why this treatment is necessary..."
                    />
                  </div>

                  {/* What to Expect */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      What to Expect ({language === 'en' ? 'English' : 'Spanish'})
                    </label>
                    <RichTextEditor
                      value={formData?.whatToExpect?.[language]}
                      onChange={(value) => handleFieldChange('whatToExpect', value)}
                      placeholder="Describe what patients should expect..."
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Auto-save Indicator */}
        <div className="fixed bottom-6 right-6 card px-4 py-2">
          <div className="flex items-center gap-2">
            {hasUnsavedChanges ? (
              <>
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                <span className="text-sm text-gray-300">Unsaved changes</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-300">All changes saved</span>
              </>
            )}
          </div>
        </div>
      </div>
      {/* Preview Modal */}
      {showPreview && (
        <PreviewModal
          procedure={selectedProcedure}
          formData={formData}
          language={language}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
};

export default TreatmentContentEditor;
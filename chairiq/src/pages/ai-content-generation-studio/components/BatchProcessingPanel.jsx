import React, { useState } from 'react';
import { Layers, Play, X, Clock, Calendar, AlertCircle } from 'lucide-react';

const BatchProcessingPanel = ({ 
  procedures = [], 
  onCreateBatchJob,
  isCreating = false
}) => {
  const [showBatchPanel, setShowBatchPanel] = useState(false);
  const [selectedProcedures, setSelectedProcedures] = useState([]);
  const [batchConfig, setBatchConfig] = useState({
    name: '',
    language: 'en',
    tone: 'professional',
    complexity: 'detailed',
    targetAudience: 'general',
    contentTypes: ['all'],
    priority: 'normal',
    scheduleNow: true,
    scheduledDate: '',
    scheduledTime: ''
  });

  const handleProcedureToggle = (procedureId) => {
    setSelectedProcedures(prev =>
      prev?.includes(procedureId)
        ? prev?.filter(id => id !== procedureId)
        : [...prev, procedureId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProcedures?.length === procedures?.length) {
      setSelectedProcedures([]);
    } else {
      setSelectedProcedures(procedures?.map(p => p?.id));
    }
  };

  const handleCreateBatch = async () => {
    if (selectedProcedures?.length === 0) return;

    const scheduledAt = batchConfig?.scheduleNow
      ? null
      : new Date(`${batchConfig?.scheduledDate}T${batchConfig?.scheduledTime}`)?.toISOString();

    await onCreateBatchJob({
      name: batchConfig?.name || `Batch Job - ${new Date()?.toLocaleDateString()}`,
      procedureIds: selectedProcedures,
      contentTypes: batchConfig?.contentTypes,
      configuration: {
        language: batchConfig?.language,
        tone: batchConfig?.tone,
        complexity: batchConfig?.complexity,
        targetAudience: batchConfig?.targetAudience
      },
      priority: batchConfig?.priority,
      scheduledAt
    });

    // Reset form
    setSelectedProcedures([]);
    setBatchConfig({
      name: '',
      language: 'en',
      tone: 'professional',
      complexity: 'detailed',
      targetAudience: 'general',
      contentTypes: ['all'],
      priority: 'normal',
      scheduleNow: true,
      scheduledDate: '',
      scheduledTime: ''
    });
    setShowBatchPanel(false);
  };

  const contentTypeOptions = [
    { value: 'all', label: 'All Content' },
    { value: 'description', label: 'Description Only' },
    { value: 'risks', label: 'Risks Only' },
    { value: 'aftercare', label: 'Aftercare Only' },
    { value: 'faqs', label: 'FAQs Only' }
  ];

  if (!showBatchPanel) {
    return (
      <button
        onClick={() => setShowBatchPanel(true)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 active:scale-95 transition-all shadow-lg"
      >
        <Layers className="w-5 h-5" />
        Batch Process Multiple Procedures
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Layers className="w-6 h-6" />
            <h2 className="text-xl font-bold">Batch Content Generation</h2>
          </div>
          <button
            onClick={() => setShowBatchPanel(false)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Job Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Name
            </label>
            <input
              type="text"
              value={batchConfig?.name}
              onChange={(e) => setBatchConfig(prev => ({ ...prev, name: e?.target?.value }))}
              placeholder="e.g., Generate all endodontic content"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Procedure Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Select Procedures ({selectedProcedures?.length} selected)
              </label>
              <button
                onClick={handleSelectAll}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                {selectedProcedures?.length === procedures?.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            <div className="border border-gray-300 rounded-lg max-h-60 overflow-y-auto">
              {procedures?.map((procedure) => (
                <label
                  key={procedure?.id}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                >
                  <input
                    type="checkbox"
                    checked={selectedProcedures?.includes(procedure?.id)}
                    onChange={() => handleProcedureToggle(procedure?.id)}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-900">
                    {batchConfig?.language === 'en' ? procedure?.title_en : procedure?.title_es}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Content Configuration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Type
              </label>
              <select
                value={batchConfig?.contentTypes?.[0]}
                onChange={(e) => setBatchConfig(prev => ({ ...prev, contentTypes: [e?.target?.value] }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {contentTypeOptions?.map(option => (
                  <option key={option?.value} value={option?.value}>
                    {option?.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select
                value={batchConfig?.language}
                onChange={(e) => setBatchConfig(prev => ({ ...prev, language: e?.target?.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tone
              </label>
              <select
                value={batchConfig?.tone}
                onChange={(e) => setBatchConfig(prev => ({ ...prev, tone: e?.target?.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="professional">Professional</option>
                <option value="friendly">Friendly & Approachable</option>
                <option value="simple">Simple & Clear</option>
                <option value="technical">Technical & Detailed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Complexity
              </label>
              <select
                value={batchConfig?.complexity}
                onChange={(e) => setBatchConfig(prev => ({ ...prev, complexity: e?.target?.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="basic">Basic</option>
                <option value="detailed">Detailed</option>
                <option value="comprehensive">Comprehensive</option>
              </select>
            </div>
          </div>

          {/* Priority & Scheduling */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={batchConfig?.priority}
                onChange={(e) => setBatchConfig(prev => ({ ...prev, priority: e?.target?.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Execution
              </label>
              <select
                value={batchConfig?.scheduleNow ? 'now' : 'later'}
                onChange={(e) => setBatchConfig(prev => ({ ...prev, scheduleNow: e?.target?.value === 'now' }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="now">Start Immediately</option>
                <option value="later">Schedule for Later</option>
              </select>
            </div>
          </div>

          {!batchConfig?.scheduleNow && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Schedule Date
                </label>
                <input
                  type="date"
                  value={batchConfig?.scheduledDate}
                  onChange={(e) => setBatchConfig(prev => ({ ...prev, scheduledDate: e?.target?.value }))}
                  min={new Date()?.toISOString()?.split('T')?.[0]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Schedule Time
                </label>
                <input
                  type="time"
                  value={batchConfig?.scheduledTime}
                  onChange={(e) => setBatchConfig(prev => ({ ...prev, scheduledTime: e?.target?.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Warning */}
          {selectedProcedures?.length > 10 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-900">
                <p className="font-medium mb-1">Large Batch Job</p>
                <p>
                  You have selected {selectedProcedures?.length} procedures. This may take several minutes to complete.
                  Consider scheduling this job for off-peak hours to avoid rate limits.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 flex items-center justify-between bg-gray-50">
          <div className="text-sm text-gray-600">
            {selectedProcedures?.length === 0 && (
              <span>Select at least one procedure to continue</span>
            )}
            {selectedProcedures?.length > 0 && (
              <span>
                {selectedProcedures?.length} procedure{selectedProcedures?.length !== 1 ? 's' : ''} selected
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowBatchPanel(false)}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateBatch}
              disabled={selectedProcedures?.length === 0 || isCreating}
              className={`inline-flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${
                selectedProcedures?.length === 0 || isCreating
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' :'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 active:scale-95 shadow-lg'
              }`}
            >
              <Play className="w-4 h-4" />
              {isCreating ? 'Creating...' : (batchConfig?.scheduleNow ? 'Start Batch Job' : 'Schedule Batch Job')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchProcessingPanel;
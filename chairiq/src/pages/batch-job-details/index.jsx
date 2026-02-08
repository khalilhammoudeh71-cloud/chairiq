import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Clock, AlertCircle, RefreshCw, Save } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import { 
  getBatchJobWithItems, 
  getBatchJobLogs,
  applyGeneratedContent 
} from '../../services/batchProcessingService';

const BatchJobDetails = () => {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const { showToast } = useToast();

  const [job, setJob] = useState(null);
  const [logs, setLogs] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    loadJobDetails();
    loadLogs();
  }, [jobId]);

  const loadJobDetails = async () => {
    try {
      setIsLoading(true);
      const jobData = await getBatchJobWithItems(jobId);
      setJob(jobData);
    } catch (error) {
      showToast('Failed to load job details', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const loadLogs = async () => {
    try {
      const logData = await getBatchJobLogs(jobId);
      setLogs(logData);
    } catch (error) {
      console.error('Error loading logs:', error);
    }
  };

  const handleApplyContent = async (itemId) => {
    setIsApplying(true);
    try {
      await applyGeneratedContent(itemId);
      showToast('Content applied to procedure library successfully', 'success');
      await loadJobDetails();
    } catch (error) {
      showToast('Failed to apply content', 'error');
    } finally {
      setIsApplying(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-600 animate-pulse" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-gray-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'completed':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'failed':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'in_progress':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'pending':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-0 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-bg-0 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-text-3 mx-auto mb-4" />
          <p className="text-text-2">Batch job not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-0">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin/ai-content-generation')}
                className="p-2 hover:bg-bg-1 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5 text-text-2" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-text-1">{job?.name}</h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className={getStatusBadge(job?.status)}>
                    {job?.status?.replace('_', ' ')}
                  </span>
                  <span className="text-sm text-text-2">
                    {job?.completed_items} of {job?.total_items} items completed
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => loadJobDetails()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Job Items List */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Job Items</h2>
            {job?.items?.map((item) => (
              <div
                key={item?.id}
                className={`bg-white rounded-lg border-2 transition-all cursor-pointer ${
                  selectedItem?.id === item?.id
                    ? 'border-blue-500 shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedItem(item)}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 flex-1">
                      {getStatusIcon(item?.status)}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">
                          {item?.language === 'en' ? item?.procedure?.title_en : item?.procedure?.title_es}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {item?.content_types?.join(', ')}
                        </p>
                      </div>
                    </div>
                    <span className={getStatusBadge(item?.status)}>
                      {item?.status?.replace('_', ' ')}
                    </span>
                  </div>

                  {item?.status === 'completed' && (
                    <button
                      onClick={(e) => {
                        e?.stopPropagation();
                        handleApplyContent(item?.id);
                      }}
                      disabled={isApplying}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      Apply to Library
                    </button>
                  )}

                  {item?.error_message && (
                    <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm text-red-900">{item?.error_message}</p>
                    </div>
                  )}

                  {item?.processing_duration_seconds && (
                    <p className="text-xs text-gray-500 mt-2">
                      Processing time: {item?.processing_duration_seconds}s
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Selected Item Details */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-24">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  {selectedItem ? 'Item Details' : 'Select an Item'}
                </h2>
              </div>

              {selectedItem ? (
                <div className="p-4 space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Procedure</h3>
                    <p className="text-gray-900">
                      {selectedItem?.language === 'en' 
                        ? selectedItem?.procedure?.title_en 
                        : selectedItem?.procedure?.title_es}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
                    <span className={getStatusBadge(selectedItem?.status)}>
                      {selectedItem?.status?.replace('_', ' ')}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Content Types</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem?.content_types?.map((type) => (
                        <span
                          key={type}
                          className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>

                  {selectedItem?.generated_content && Object?.keys(selectedItem?.generated_content)?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Generated Content</h3>
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {Object?.entries(selectedItem?.generated_content)?.map(([key, value]) => (
                          <div key={key} className="border border-gray-200 rounded-lg p-3">
                            <h4 className="text-xs font-medium text-gray-600 mb-1 uppercase">
                              {key}
                            </h4>
                            <p className="text-sm text-gray-900 whitespace-pre-wrap">
                              {typeof value === 'string' 
                                ? value?.substring(0, 200) + (value?.length > 200 ? '...' : '')
                                : JSON.stringify(value, null, 2)?.substring(0, 200) + '...'}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedItem?.error_message && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Error</h3>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-red-900">{selectedItem?.error_message}</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Select an item to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Logs Section */}
        {logs?.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Activity Logs</h2>
            </div>
            <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
              {logs?.map((log) => (
                <div
                  key={log?.id}
                  className={`p-3 rounded-lg border ${
                    log?.log_level === 'error' ?'bg-red-50 border-red-200'
                      : log?.log_level === 'warning' ?'bg-amber-50 border-amber-200' :'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <p className="text-sm text-gray-900 flex-1">{log?.message}</p>
                    <span className="text-xs text-gray-500 ml-4 whitespace-nowrap">
                      {new Date(log?.created_at)?.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BatchJobDetails;
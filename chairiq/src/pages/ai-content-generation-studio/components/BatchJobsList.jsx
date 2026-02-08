import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, AlertCircle, Play, X, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BatchJobsList = ({ 
  jobs = [], 
  onRefresh, 
  onViewDetails,
  onCancelJob 
}) => {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState('all');

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'in_progress':
        return <Play className="w-5 h-5 text-blue-600 animate-pulse" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-gray-400" />;
      case 'cancelled':
        return <X className="w-5 h-5 text-gray-600" />;
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
      case 'cancelled':
        return `${baseClasses} bg-gray-100 text-gray-600`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getPriorityBadge = (priority) => {
    const baseClasses = "px-2 py-0.5 rounded text-xs font-medium";
    switch (priority) {
      case 'urgent':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'high':
        return `${baseClasses} bg-orange-100 text-orange-800`;
      case 'normal':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'low':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const filteredJobs = selectedFilter === 'all' 
    ? jobs 
    : jobs?.filter(job => job?.status === selectedFilter);

  const statusCounts = {
    all: jobs?.length,
    pending: jobs?.filter(j => j?.status === 'pending')?.length,
    in_progress: jobs?.filter(j => j?.status === 'in_progress')?.length,
    completed: jobs?.filter(j => j?.status === 'completed')?.length,
    failed: jobs?.filter(j => j?.status === 'failed')?.length
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Batch Jobs</h3>
          <button
            onClick={onRefresh}
            className="text-sm text-purple-600 hover:text-purple-700 font-medium"
          >
            Refresh
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {[
            { key: 'all', label: 'All' },
            { key: 'pending', label: 'Pending' },
            { key: 'in_progress', label: 'In Progress' },
            { key: 'completed', label: 'Completed' },
            { key: 'failed', label: 'Failed' }
          ]?.map(filter => (
            <button
              key={filter?.key}
              onClick={() => setSelectedFilter(filter?.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                selectedFilter === filter?.key
                  ? 'bg-purple-600 text-white' :'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filter?.label} ({statusCounts?.[filter?.key] || 0})
            </button>
          ))}
        </div>
      </div>

      {/* Jobs List */}
      <div className="divide-y divide-gray-200">
        {filteredJobs?.length === 0 ? (
          <div className="p-12 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No batch jobs found</p>
            <p className="text-sm text-gray-500 mt-1">
              Create a batch job to generate content for multiple procedures
            </p>
          </div>
        ) : (
          filteredJobs?.map((job) => (
            <div key={job?.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  {getStatusIcon(job?.status)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-base font-semibold text-gray-900 truncate">
                        {job?.name}
                      </h4>
                      <span className={getStatusBadge(job?.status)}>
                        {job?.status?.replace('_', ' ')}
                      </span>
                      <span className={getPriorityBadge(job?.priority)}>
                        {job?.priority}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      {/* Progress Bar */}
                      <div>
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                          <span>
                            {job?.completed_items} of {job?.total_items} items
                          </span>
                          <span className="font-medium">
                            {job?.progress_percentage?.toFixed(0)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              job?.status === 'completed'
                                ? 'bg-green-600'
                                : job?.status === 'failed' ?'bg-red-600' :'bg-blue-600'
                            }`}
                            style={{ width: `${job?.progress_percentage}%` }}
                          />
                        </div>
                      </div>

                      {/* Job Info */}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>
                          Created {new Date(job?.created_at)?.toLocaleDateString()}
                        </span>
                        {job?.started_at && (
                          <span>
                            Started {new Date(job?.started_at)?.toLocaleTimeString()}
                          </span>
                        )}
                        {job?.completed_at && (
                          <span>
                            Completed {new Date(job?.completed_at)?.toLocaleTimeString()}
                          </span>
                        )}
                        {job?.scheduled_at && new Date(job?.scheduled_at) > new Date() && (
                          <span className="text-blue-600 font-medium">
                            Scheduled for {new Date(job?.scheduled_at)?.toLocaleString()}
                          </span>
                        )}
                      </div>

                      {/* Error Message */}
                      {job?.error_message && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                          <p className="text-sm text-red-900">
                            <span className="font-medium">Error: </span>
                            {job?.error_message}
                          </p>
                        </div>
                      )}

                      {/* Failed Items */}
                      {job?.failed_items > 0 && (
                        <p className="text-sm text-amber-600">
                          {job?.failed_items} item{job?.failed_items !== 1 ? 's' : ''} failed
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => onViewDetails(job?.id)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  {(job?.status === 'pending' || job?.status === 'in_progress') && (
                    <button
                      onClick={() => onCancelJob(job?.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Cancel Job"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BatchJobsList;
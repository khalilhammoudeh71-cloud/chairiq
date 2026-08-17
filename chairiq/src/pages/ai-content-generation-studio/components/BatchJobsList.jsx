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
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-danger" />;
      case 'in_progress':
        return <Play className="w-5 h-5 text-accent animate-pulse" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-t3" />;
      case 'cancelled':
        return <X className="w-5 h-5 text-t2" />;
      default:
        return <AlertCircle className="w-5 h-5 text-t3" />;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'completed':
        return `${baseClasses} bg-success/10 text-success`;
      case 'failed':
        return `${baseClasses} bg-danger/10 text-danger`;
      case 'in_progress':
        return `${baseClasses} bg-accent/10 text-accent`;
      case 'pending':
        return `${baseClasses} bg-bg2 text-t1`;
      case 'cancelled':
        return `${baseClasses} bg-bg2 text-t2`;
      default:
        return `${baseClasses} bg-bg2 text-t1`;
    }
  };

  const getPriorityBadge = (priority) => {
    const baseClasses = "px-2 py-0.5 rounded text-xs font-medium";
    switch (priority) {
      case 'urgent':
        return `${baseClasses} bg-danger/10 text-danger`;
      case 'high':
        return `${baseClasses} bg-warning/10 text-warning`;
      case 'normal':
        return `${baseClasses} bg-accent/10 text-accent`;
      case 'low':
        return `${baseClasses} bg-bg2 text-t1`;
      default:
        return `${baseClasses} bg-bg2 text-t1`;
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
    <div className="bg-bg1 rounded-xl shadow-sm border border-bd">
      <div className="p-6 border-b border-bd">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-t1">Batch Jobs</h3>
          <button
            onClick={onRefresh}
            className="text-sm text-accent hover:brightness-110 font-medium"
          >
            Refresh
          </button>
        </div>

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
                  ? 'bg-accent text-accent-foreground' :'bg-bg2 text-t2 hover:bg-bg3'
              }`}
            >
              {filter?.label} ({statusCounts?.[filter?.key] || 0})
            </button>
          ))}
        </div>
      </div>

      <div className="divide-y divide-bd">
        {filteredJobs?.length === 0 ? (
          <div className="p-12 text-center">
            <AlertCircle className="w-12 h-12 text-t3 mx-auto mb-4" />
            <p className="text-t2">No batch jobs found</p>
            <p className="text-sm text-t3 mt-1">
              Create a batch job to generate content for multiple procedures
            </p>
          </div>
        ) : (
          filteredJobs?.map((job) => (
            <div key={job?.id} className="p-6 hover:bg-bg2 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  {getStatusIcon(job?.status)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-base font-semibold text-t1 truncate">
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
                      <div>
                        <div className="flex items-center justify-between text-sm text-t2 mb-1">
                          <span>
                            {job?.completed_items} of {job?.total_items} items
                          </span>
                          <span className="font-medium">
                            {job?.progress_percentage?.toFixed(0)}%
                          </span>
                        </div>
                        <div className="w-full bg-bg2 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              job?.status === 'completed'
                                ? 'bg-success'
                                : job?.status === 'failed' ?'bg-danger' :'bg-accent'
                            }`}
                            style={{ width: `${job?.progress_percentage}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-t3">
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
                          <span className="text-accent font-medium">
                            Scheduled for {new Date(job?.scheduled_at)?.toLocaleString()}
                          </span>
                        )}
                      </div>

                      {job?.error_message && (
                        <div className="bg-danger/10 border border-danger/20 rounded-lg p-3">
                          <p className="text-sm text-danger">
                            <span className="font-medium">Error: </span>
                            {job?.error_message}
                          </p>
                        </div>
                      )}

                      {job?.failed_items > 0 && (
                        <p className="text-sm text-warning">
                          {job?.failed_items} item{job?.failed_items !== 1 ? 's' : ''} failed
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => onViewDetails(job?.id)}
                    className="p-2 text-t2 hover:bg-bg3 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  {(job?.status === 'pending' || job?.status === 'in_progress') && (
                    <button
                      onClick={() => onCancelJob(job?.id)}
                      className="p-2 text-danger hover:bg-danger/10 rounded-lg transition-colors"
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
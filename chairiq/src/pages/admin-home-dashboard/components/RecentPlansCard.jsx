import React, { useState, useRef, useEffect } from 'react';
import { Calendar, Eye, MoreVertical, Edit, ListPlus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import ModifyTreatmentPlanModal from './ModifyTreatmentPlanModal';
import DeletePatientModal from './DeletePatientModal';
import { patientSearchService } from '../../../services/patientSearchService';
import { useToast } from '../../../hooks/useToast';

export default function RecentPlansCard({ plans = [], onRefresh }) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const handleViewPlan = (publicToken) => {
    navigate(`/p/${publicToken}`);
  };

  const handleModifyPlan = (planId) => {
    setSelectedPlanId(planId);
    setShowModifyModal(true);
  };

  const handleDeleteClick = (plan) => {
    setSelectedPatient({
      id: plan?.patientId,
      firstName: plan?.patientName?.split(' ')?.[0] || '',
      lastName: plan?.patientName?.split(' ')?.slice(1)?.join(' ') || '',
      phone: plan?.patientPhone || 'N/A'
    });
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const result = await patientSearchService?.deletePatient(selectedPatient?.id);
      if (!result?.success) throw new Error(result?.message || 'Delete failed');
      showToast('Patient profile deleted successfully', 'success');
      setShowDeleteModal(false);
      setSelectedPatient(null);
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      showToast(error?.message || 'Failed to delete patient', 'error');
    }
  };

  const handleModalClose = () => {
    setShowModifyModal(false);
    setSelectedPlanId(null);
  };

  const handleModalSuccess = () => {
    // Refresh the plans list after successful modification
    if (onRefresh) {
      onRefresh();
    }
  };

  if (!plans || plans?.length === 0) {
    return (
      <Card>
        <h2 className="text-2xl font-bold text-t1 mb-6">Recent Patient Plans</h2>
        <div className="text-center py-8 text-t2">
          <p>No patient plans created yet.</p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <h2 className="text-2xl font-bold text-t1 mb-6">Recent Patient Plans</h2>
        <div className="space-y-4">
          {plans?.map((plan) => (
            <Card
              key={plan?.id}
              padding="p-4"
              hover={true}
              className="bg-bg1 cursor-pointer"
              onClick={() => handleViewPlan(plan?.publicToken)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-t1 font-semibold text-lg">{plan?.patientName}</h3>
                  <div className="flex items-center gap-2 mt-2 text-t2 text-sm">
                    <Calendar size={14} />
                    <span>{formatDate(plan?.createdAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => handleViewPlan(plan?.publicToken)}
                    className="px-3 py-1.5 text-sm font-medium rounded-lg bg-accent text-white hover:bg-accent/90 transition-all duration-200 flex items-center gap-1.5"
                  >
                    <Eye size={14} />
                    View
                  </button>
                  <div className="relative" ref={openMenuId === plan?.id ? menuRef : null}>
                    <button
                      onClick={() => setOpenMenuId(openMenuId === plan?.id ? null : plan?.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-full text-t2 hover:bg-bg2 transition-all duration-200"
                    >
                      <MoreVertical size={16} />
                    </button>
                    {openMenuId === plan?.id && (
                      <div className="absolute right-0 top-full mt-1 w-48 bg-bg2 border border-bd rounded-lg shadow-lg z-20 py-1">
                        <button
                          onClick={() => { navigate('/dentist-admin-analytics-dashboard'); setOpenMenuId(null); }}
                          className="w-full px-3 py-2 text-sm text-t1 hover:bg-bg1 flex items-center gap-2 transition-colors"
                        >
                          <Edit size={14} />
                          View Analytics
                        </button>
                        <button
                          onClick={() => { handleModifyPlan(plan?.id); setOpenMenuId(null); }}
                          className="w-full px-3 py-2 text-sm text-t1 hover:bg-bg1 flex items-center gap-2 transition-colors"
                        >
                          <ListPlus size={14} />
                          Modify Plan
                        </button>
                        <div className="border-t border-bd my-1"></div>
                        <button
                          onClick={() => { handleDeleteClick(plan); setOpenMenuId(null); }}
                          className="w-full px-3 py-2 text-sm text-danger hover:bg-danger/10 flex items-center gap-2 transition-colors"
                        >
                          <Trash2 size={14} />
                          Delete Patient
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Modify Treatment Plan Modal */}
      {showModifyModal && selectedPlanId && (
        <ModifyTreatmentPlanModal
          treatmentPlanId={selectedPlanId}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
        />
      )}

      {/* Delete Patient Modal */}
      {showDeleteModal && selectedPatient && (
        <DeletePatientModal
          patient={selectedPatient}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedPatient(null);
          }}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </>
  );
}
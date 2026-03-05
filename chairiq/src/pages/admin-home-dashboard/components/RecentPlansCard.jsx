import React, { useState } from 'react';
import { Calendar, Eye, Edit, ListPlus, Trash2 } from 'lucide-react';
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
              className="bg-bg1"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-t1 font-semibold text-lg">{plan?.patientName}</h3>
                  <div className="flex items-center gap-2 mt-2 text-t2 text-sm">
                    <Calendar size={14} />
                    <span>{formatDate(plan?.createdAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleViewPlan(plan?.publicToken)}
                    title="View Plan"
                    className="w-9 h-9 flex items-center justify-center rounded-full text-t2 hover:bg-accent/15 hover:text-accent transition-all duration-200"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => navigate('/dentist-admin-analytics-dashboard')}
                    title="View Analytics"
                    className="w-9 h-9 flex items-center justify-center rounded-full text-t2 hover:bg-accent/15 hover:text-accent transition-all duration-200"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleModifyPlan(plan?.id)}
                    title="Modify Treatment Plan"
                    className="w-9 h-9 flex items-center justify-center rounded-full text-t2 hover:bg-accent/15 hover:text-accent transition-all duration-200"
                  >
                    <ListPlus size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(plan)}
                    title="Delete Patient Profile"
                    className="w-9 h-9 flex items-center justify-center rounded-full text-t2 hover:bg-danger/15 hover:text-danger transition-all duration-200"
                  >
                    <Trash2 size={18} />
                  </button>
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
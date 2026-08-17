import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, Send, Edit, Trash2, ClipboardList } from 'lucide-react';
import { patientSearchService } from '../../../services/patientSearchService';
import { patientPlanService } from '../../../services/patientPlanService';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import ModifyTreatmentPlanModal from './ModifyTreatmentPlanModal';
import DeletePatientModal from './DeletePatientModal';


export default function TreatmentDetailsCard({ selectedPatient, onPatientDeleted }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [patientDetails, setPatientDetails] = useState(null);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [selectedTreatmentPlanId, setSelectedTreatmentPlanId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  useEffect(() => {
    if (selectedPatient?.id) {
      fetchPatientDetails();
    } else {
      setPatientDetails(null);
    }
  }, [selectedPatient]);

  const fetchPatientDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const details = await patientSearchService?.getPatientDetails(selectedPatient?.id);
      setPatientDetails(details);
    } catch (err) {
      console.error('Error fetching patient details:', err);
      setError(err?.message || 'Failed to load patient details');
    } finally {
      setLoading(false);
    }
  };

  const handleModifyPlan = (planId) => {
    setSelectedTreatmentPlanId(planId);
    setShowModifyModal(true);
  };

  const handleModifySuccess = () => {
    // Refresh patient details after modification
    fetchPatientDetails();
  };

  const handleResendLink = async (publicToken) => {
    if (!publicToken) {
      setError('No treatment plan link available to resend');
      setTimeout(() => setError(null), 3000);
      return;
    }

    try {
      setResending(true);
      setError(null);
      setResendSuccess(false);

      const result = await patientPlanService?.resendTreatmentPlanLink(publicToken);

      if (result?.success) {
        setResendSuccess(true);
        setTimeout(() => setResendSuccess(false), 3000);
      } else {
        setError(result?.userMessage || 'Failed to resend link');
        setTimeout(() => setError(null), 5000);
      }
    } catch (err) {
      console.error('Error resending treatment plan link:', err);
      setError(err?.message || 'Failed to resend link');
      setTimeout(() => setError(null), 5000);
    } finally {
      setResending(false);
    }
  };

  const handleDeletePatient = async () => {
    try {
      setError(null);
      const result = await patientSearchService?.deletePatient(selectedPatient?.id);

      if (result?.success) {
        setDeleteSuccess(true);
        setShowDeleteModal(false);
        
        // Show success message briefly
        setTimeout(() => {
          setDeleteSuccess(false);
          setPatientDetails(null);
          // Notify parent component to refresh or clear selection
          if (onPatientDeleted) {
            onPatientDeleted();
          }
        }, 2000);
      } else {
        setError(result?.message || 'Failed to delete patient profile');
        setShowDeleteModal(false);
        setTimeout(() => setError(null), 5000);
      }
    } catch (err) {
      console.error('Error deleting patient:', err);
      setError(err?.message || 'Failed to delete patient profile');
      setShowDeleteModal(false);
      setTimeout(() => setError(null), 5000);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (seconds) => {
    if (!seconds) return '0m';
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m`;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      Urgent: 'bg-danger/10 text-danger border-danger/30',
      Soon: 'bg-warning/10 text-warning border-warning/30',
      Later: 'bg-accent/10 text-accent border-accent/30',
    };
    return colors?.[priority] || colors?.Soon;
  };

  const getCompletionStatus = (completion) => {
    if (!completion) {
      return { text: 'Not Started', color: 'text-t3', icon: Clock };
    }
    if (completion?.completedAt) {
      return { text: 'Completed', color: 'text-success', icon: CheckCircle };
    }
    if (completion?.viewedAt) {
      return { text: `${completion?.completionPercentage}% Complete`, color: 'text-warning', icon: Clock };
    }
    return { text: 'Not Started', color: 'text-t3', icon: Clock };
  };

  if (!selectedPatient) {
    return (
      <Card>
        <h2 className="text-base font-semibold text-t1 mb-4">Treatment Details</h2>
        <div className="relative overflow-hidden flex flex-col items-center justify-center py-10 border border-bd rounded-xl bg-bg2/40 panel-glow">
          <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/25 flex items-center justify-center mb-3">
            <ClipboardList className="w-5 h-5 text-accent" />
          </div>
          <p className="text-t2 text-sm font-medium">Select a patient to view their treatment details</p>
          <p className="text-t3 text-xs mt-1">Use the search above to find a patient</p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <h2 className="text-base font-semibold text-t1 mb-4">Treatment Details</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-danger/10 border border-danger rounded-lg">
            <p className="text-danger text-sm">{error}</p>
          </div>
        )}

        {resendSuccess && (
          <div className="mb-4 p-3 bg-success/10 border border-success rounded-lg">
            <p className="text-success text-sm">SMS link resent successfully!</p>
          </div>
        )}

        {deleteSuccess && (
          <div className="mb-4 p-3 bg-success/10 border border-success rounded-lg">
            <p className="text-success text-sm">Patient profile deleted successfully!</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-t1 mx-auto"></div>
            <p className="text-t2 mt-4">Loading treatment details...</p>
          </div>
        ) : patientDetails?.treatmentPlans?.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-t1 font-semibold text-lg mb-2">
                  {patientDetails?.patient?.firstName} {patientDetails?.patient?.lastName}
                </h3>
                <Badge variant="success">Active Treatment</Badge>
              </div>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-4 py-2 bg-danger hover:brightness-110 text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                title="Permanently delete patient profile and all associated data"
              >
                <Trash2 className="w-4 h-4" />
                Delete Profile
              </button>
            </div>

            {/* Treatment Plans List */}
            <div className="space-y-3">
              {patientDetails?.treatmentPlans?.map((plan) => (
                <div key={plan?.id} className="p-4 bg-bg3 rounded-lg border border-bd">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <p className="text-t1 font-medium">{plan?.practiceName}</p>
                      <p className="text-t2 text-sm">Dr. {plan?.dentistName}</p>
                      <p className="text-t3 text-xs mt-1">
                        {plan?.procedures?.length} procedure(s)
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleModifyPlan(plan?.id)}
                        className="px-4 py-2 bg-accent hover:brightness-110 text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                        title="Modify treatment plan by adding or removing procedures"
                      >
                        <Edit className="w-4 h-4" />
                        Modify Plan
                      </button>
                      {plan?.publicToken && (
                        <button
                          onClick={() => handleResendLink(plan?.publicToken)}
                          disabled={resending}
                          className="px-4 py-2 bg-accent hover:bg-accent-hover text-bg-0 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Resend treatment plan link to patient via SMS"
                        >
                          {resending ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              Resend Link
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Procedures Summary */}
                  {plan?.procedures?.length > 0 && (
                    <div className="space-y-2 mt-3 pt-3 border-t border-bd">
                      {plan?.procedures?.slice(0, 3)?.map((proc) => (
                        <div key={proc?.id} className="flex items-center justify-between text-sm">
                          <span className="text-t2">{proc?.procedureName}</span>
                          <Badge
                            variant={
                              proc?.priority === 'Urgent' ? 'danger'
                                : proc?.priority === 'Soon' ? 'warning' : 'default'
                            }
                          >
                            {proc?.priority}
                          </Badge>
                        </div>
                      ))}
                      {plan?.procedures?.length > 3 && (
                        <p className="text-t3 text-xs">
                          +{plan?.procedures?.length - 3} more procedure(s)
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="relative overflow-hidden flex flex-col items-center justify-center py-10 border border-bd rounded-xl bg-bg2/40 panel-glow">
            <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/25 flex items-center justify-center mb-3">
              <ClipboardList className="w-5 h-5 text-accent" />
            </div>
            <p className="text-t2 text-sm font-medium">No treatment plans found for this patient</p>
            <p className="text-t3 text-xs mt-1">Create a new plan to get started</p>
          </div>
        )}
      </Card>

      {/* Modify Treatment Plan Modal */}
      {showModifyModal && selectedTreatmentPlanId && (
        <ModifyTreatmentPlanModal
          treatmentPlanId={selectedTreatmentPlanId}
          onClose={() => {
            setShowModifyModal(false);
            setSelectedTreatmentPlanId(null);
          }}
          onSuccess={handleModifySuccess}
        />
      )}

      {/* Delete Patient Confirmation Modal */}
      {showDeleteModal && (
        <DeletePatientModal
          patient={patientDetails?.patient}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeletePatient}
        />
      )}
    </>
  );
}
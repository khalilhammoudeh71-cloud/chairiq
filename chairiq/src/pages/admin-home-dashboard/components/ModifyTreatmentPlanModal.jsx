import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Loader } from 'lucide-react';
import { patientPlanService } from '../../../services/patientPlanService';
import Card from '../../../components/ui/Card';
import ButtonPrimary from '../../../components/ui/ButtonPrimary';
import ButtonSecondary from '../../../components/ui/ButtonSecondary';
import Badge from '../../../components/ui/Badge';
import AddProcedureDrawer from '../../create-patient-plan/components/AddProcedureDrawer';

export default function ModifyTreatmentPlanModal({ treatmentPlanId, onClose, onSuccess }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [treatmentPlan, setTreatmentPlan] = useState(null);
  const [procedures, setProcedures] = useState([]);
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (treatmentPlanId) {
      fetchTreatmentPlan();
    }
  }, [treatmentPlanId]);

  // Add mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fetchTreatmentPlan = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await patientPlanService?.getTreatmentPlanById(treatmentPlanId);
      setTreatmentPlan(data);
      setProcedures(data?.procedures || []);
    } catch (err) {
      console.error('Error fetching treatment plan:', err);
      setError(err?.message || 'Failed to load treatment plan');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProcedureClick = () => {
    setIsDrawerOpen(true);
  };

  const handleSaveProcedureFromDrawer = async (procedureData) => {
    try {
      setSaving(true);
      setError(null);

      const newProcedure = await patientPlanService?.addProcedureToTreatmentPlan(
        treatmentPlanId,
        {
          procedureName: procedureData?.procedureName || procedureData?.displayTitle,
          procedureSlug: procedureData?.procedureSlug || null,
          displayTitle: procedureData?.displayTitle,
          adaCode: procedureData?.adaCode || null,
          priority: procedureData?.priority,
          toothNumbers: procedureData?.toothNumbers || null,
          notesForPatient: procedureData?.notesForPatient || null,
          estTime: procedureData?.estTime || null
        }
      );

      setProcedures([...procedures, newProcedure]);
      setIsDrawerOpen(false);
    } catch (err) {
      console.error('Error adding procedure:', err);
      setError(err?.message || 'Failed to add procedure');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveProcedure = async (procedureId) => {
    if (!confirm('Are you sure you want to remove this procedure from the treatment plan?')) {
      return;
    }

    try {
      setRemoving(procedureId);
      setError(null);

      await patientPlanService?.removeProcedureFromTreatmentPlan(procedureId);
      setProcedures(procedures?.filter(p => p?.id !== procedureId));
    } catch (err) {
      console.error('Error removing procedure:', err);
      setError(err?.message || 'Failed to remove procedure');
    } finally {
      setRemoving(null);
    }
  };

  const handleSaveChanges = () => {
    if (onSuccess) {
      onSuccess();
    }
    onClose();
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[var(--overlay)] flex items-center justify-center z-50">
        <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 animate-spin text-accent" />
            <span className="ml-3 text-t1">Loading treatment plan...</span>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-[var(--overlay)] flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-bd">
            <div>
              <h2 className="text-2xl font-bold text-t1">Modify Treatment Plan</h2>
              <p className="text-t2 text-sm mt-1">
                {treatmentPlan?.patient?.firstName} {treatmentPlan?.patient?.lastName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-t2 hover:text-t1 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-danger/10 border border-danger rounded-lg">
              <p className="text-danger text-sm">{error}</p>
            </div>
          )}

          {/* Current Procedures */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-t1">Current Procedures</h3>
              <ButtonSecondary
                onClick={handleAddProcedureClick}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Procedure
              </ButtonSecondary>
            </div>

            {procedures?.length === 0 ? (
              <div className="text-center py-8 text-t2">
                <p>No procedures in this treatment plan</p>
              </div>
            ) : (
              <div className="space-y-3">
                {procedures?.map((proc) => (
                  <div
                    key={proc?.id}
                    className="p-4 bg-bg3 rounded-lg border border-bd flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="text-t1 font-medium">{proc?.displayTitle || proc?.procedureName}</p>
                        {proc?.adaCode && (
                          <Badge variant="default" className="text-xs">
                            {proc?.adaCode}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <Badge
                          variant={
                            proc?.priority === 'Immediate' || proc?.priority === 'Urgent' ? 'danger'
                              : proc?.priority === 'Soon'? 'warning' :'default'
                          }
                        >
                          {proc?.priority}
                        </Badge>
                        {proc?.toothNumbers && (
                          <span className="text-t2 text-sm">Tooth: {proc?.toothNumbers}</span>
                        )}
                        {proc?.estTime && (
                          <span className="text-t2 text-sm">{proc?.estTime}</span>
                        )}
                      </div>
                      {proc?.notesForPatient && (
                        <p className="text-t2 text-sm mt-2">{proc?.notesForPatient}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleRemoveProcedure(proc?.id)}
                      disabled={removing === proc?.id}
                      className="ml-4 p-2 text-danger hover:text-danger hover:bg-danger/10 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {removing === proc?.id ? (
                        <Loader className="w-5 h-5 animate-spin" />
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-bd">
            <ButtonSecondary onClick={onClose}>
              Cancel
            </ButtonSecondary>
            <ButtonPrimary onClick={handleSaveChanges}>
              Save Changes
            </ButtonPrimary>
          </div>
        </Card>
      </div>

      {/* Add Procedure Drawer - Same as create plan workflow */}
      <AddProcedureDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSave={handleSaveProcedureFromDrawer}
        isMobile={isMobile}
      />
    </>
  );
}
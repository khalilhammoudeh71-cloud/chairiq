import { supabase } from '../lib/supabase';

export const patientSearchService = {
  /**
   * Search patients by name or phone
   * @param {string} query - Search query (name or phone)
   * @returns {Promise<Array>} List of matching patients
   */
  async searchPatients(query) {
    try {
      if (!query || query?.trim()?.length < 2) {
        return [];
      }

      const searchTerm = query?.trim()?.toLowerCase();

      const { data, error } = await supabase?.from('patients')?.select('*')?.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`)?.order('created_at', { ascending: false })?.limit(10);

      if (error) throw error;

      // Convert snake_case to camelCase
      return data?.map(patient => ({
        id: patient?.id,
        firstName: patient?.first_name,
        lastName: patient?.last_name,
        phone: patient?.phone,
        preferredLanguage: patient?.preferred_language,
        createdAt: patient?.created_at,
        updatedAt: patient?.updated_at,
      }));
    } catch (error) {
      console.error('Error searching patients:', error);
      throw error;
    }
  },

  /**
   * Get patient's treatment plans with procedures
   * @param {string} patientId - Patient UUID
   * @returns {Promise<Array>} List of treatment plans with procedures
   */
  async getPatientTreatmentPlans(patientId) {
    try {
      if (!patientId) {
        throw new Error('Patient ID is required');
      }

      // Fetch treatment plans for the patient
      const { data: plans, error: plansError } = await supabase?.from('treatment_plans')?.select('*')?.eq('patient_id', patientId)?.order('created_at', { ascending: false });

      if (plansError) throw plansError;

      if (!plans || plans?.length === 0) {
        return [];
      }

      // Fetch procedures for each treatment plan
      const plansWithProcedures = await Promise.all(
        plans?.map(async (plan) => {
          const { data: procedures, error: proceduresError } = await supabase?.from('plan_procedures')?.select('*')?.eq('treatment_plan_id', plan?.id)?.order('sort_order', { ascending: true });

          if (proceduresError) {
            console.error('Error fetching procedures:', proceduresError);
            return {
              ...this.convertPlanToCommonCase(plan),
              procedures: [],
            };
          }

          // Fetch completion tracking for each procedure
          const proceduresWithCompletion = await Promise.all(
            procedures?.map(async (procedure) => {
              const { data: completion, error: completionError } = await supabase?.from('procedure_completion_tracking')?.select('*')?.eq('procedure_id', procedure?.id)?.eq('patient_id', patientId)?.single();

              if (completionError && completionError?.code !== 'PGRST116') {
                console.error('Error fetching completion:', completionError);
              }

              return {
                ...this.convertProcedureToCommonCase(procedure),
                completion: completion ? this.convertCompletionToCommonCase(completion) : null,
              };
            })
          );

          return {
            ...this.convertPlanToCommonCase(plan),
            procedures: proceduresWithCompletion,
          };
        })
      );

      return plansWithProcedures;
    } catch (error) {
      console.error('Error fetching patient treatment plans:', error);
      throw error;
    }
  },

  /**
   * Get detailed patient information including all treatment data
   * @param {string} patientId - Patient UUID
   * @returns {Promise<Object>} Complete patient details
   */
  async getPatientDetails(patientId) {
    try {
      if (!patientId) {
        throw new Error('Patient ID is required');
      }

      // Fetch patient data
      const { data: patient, error: patientError } = await supabase?.from('patients')?.select('*')?.eq('id', patientId)?.single();

      if (patientError) throw patientError;

      // Fetch treatment plans with procedures
      const treatmentPlans = await this.getPatientTreatmentPlans(patientId);

      return {
        patient: {
          id: patient?.id,
          firstName: patient?.first_name,
          lastName: patient?.last_name,
          phone: patient?.phone,
          preferredLanguage: patient?.preferred_language,
          createdAt: patient?.created_at,
          updatedAt: patient?.updated_at,
        },
        treatmentPlans,
      };
    } catch (error) {
      console.error('Error fetching patient details:', error);
      throw error;
    }
  },

  /**
   * Delete patient and all associated data
   * @param {string} patientId - Patient UUID
   * @returns {Promise<Object>} Deletion result with success status and message
   */
  async deletePatient(patientId) {
    try {
      if (!patientId) {
        throw new Error('Patient ID is required');
      }

      // Delete patient (cascade will handle related records due to foreign key constraints)
      const { error: deleteError } = await supabase
        ?.from('patients')
        ?.delete()
        ?.eq('id', patientId);

      if (deleteError) throw deleteError;

      return {
        success: true,
        message: 'Patient profile and all associated data deleted successfully',
      };
    } catch (error) {
      console.error('Error deleting patient:', error);
      
      // Return user-friendly error message
      return {
        success: false,
        message: error?.message || 'Failed to delete patient profile',
        error: error,
      };
    }
  },

  // Helper methods for case conversion
  convertPlanToCommonCase(plan) {
    return {
      id: plan?.id,
      patientId: plan?.patient_id,
      dentistName: plan?.dentist_name,
      practiceName: plan?.practice_name,
      publicToken: plan?.public_token,
      createdAt: plan?.created_at,
      updatedAt: plan?.updated_at,
    };
  },

  convertProcedureToCommonCase(procedure) {
    return {
      id: procedure?.id,
      treatmentPlanId: procedure?.treatment_plan_id,
      procedureName: procedure?.procedure_name,
      adaCode: procedure?.ada_code,
      priority: procedure?.priority,
      estTime: procedure?.est_time,
      notesForPatient: procedure?.notes_for_patient,
      sortOrder: procedure?.sort_order,
      createdAt: procedure?.created_at,
    };
  },

  convertCompletionToCommonCase(completion) {
    return {
      id: completion?.id,
      patientId: completion?.patient_id,
      procedureId: completion?.procedure_id,
      treatmentPlanId: completion?.treatment_plan_id,
      viewedAt: completion?.viewed_at,
      completedAt: completion?.completed_at,
      completionPercentage: completion?.completion_percentage,
      timeSpentSeconds: completion?.time_spent_seconds,
      createdAt: completion?.created_at,
      updatedAt: completion?.updated_at,
    };
  },
};
function deletePatient(...args) {
  // eslint-disable-next-line no-console
  console.warn('Placeholder: deletePatient is not implemented yet.', args);
  return null;
}

export { deletePatient };
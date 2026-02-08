import { supabase } from '../lib/supabase';

export const dashboardAnalyticsService = {
  /**
   * Get dashboard statistics for dentist
   * @returns {Promise<Object>} Dashboard statistics
   */
  getDashboardStats: async () => {
    try {
      // Get total active patients
      const { count: totalPatients, error: patientsError } = await supabase?.from('patients')?.select('*', { count: 'exact', head: true });

      if (patientsError) throw patientsError;

      // Get treatment plans created this month
      const startOfMonth = new Date();
      startOfMonth?.setDate(1);
      startOfMonth?.setHours(0, 0, 0, 0);

      const { count: monthlyPlans, error: plansError } = await supabase?.from('treatment_plans')?.select('*', { count: 'exact', head: true })?.gte('created_at', startOfMonth?.toISOString());

      if (plansError) throw plansError;

      // Get completion rate
      const { data: completionData, error: completionError } = await supabase?.from('procedure_completion_tracking')?.select('completion_percentage');

      if (completionError) throw completionError;

      const completionRate = completionData?.length > 0
        ? Math.round(
            completionData?.reduce((sum, item) => sum + (item?.completion_percentage || 0), 0) /
              completionData?.length
          )
        : 0;

      // Get average engagement time
      const { data: engagementData, error: engagementError } = await supabase?.from('procedure_completion_tracking')?.select('time_spent_seconds');

      if (engagementError) throw engagementError;

      const avgEngagementMinutes = engagementData?.length > 0
        ? Math.round(
            engagementData?.reduce((sum, item) => sum + (item?.time_spent_seconds || 0), 0) /
              engagementData?.length / 60
          )
        : 0;

      return {
        totalPatients: totalPatients || 0,
        monthlyPlans: monthlyPlans || 0,
        completionRate,
        avgEngagementMinutes,
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  /**
   * Get recent patient plans
   * @param {number} limit - Number of plans to fetch
   * @returns {Promise<Array>} Recent patient plans
   */
  getRecentPatientPlans: async (limit = 5) => {
    try {
      const { data, error } = await supabase?.from('treatment_plans')?.select(`
          id,
          created_at,
          public_token,
          dentist_name,
          patient_id,
          patients (
            id,
            first_name,
            last_name,
            phone
          )
        `)?.order('created_at', { ascending: false })?.limit(limit);

      if (error) {
        console.error('Supabase query error:', error);
        throw error;
      }

      if (!data) {
        return [];
      }

      return data?.map(plan => {
        // Handle cases where patient data might be null
        const patientData = plan?.patients || {};
        return {
          id: plan?.id,
          patientId: patientData?.id || plan?.patient_id,
          patientName: `${patientData?.first_name || 'Unknown'} ${patientData?.last_name || 'Patient'}`,
          patientPhone: patientData?.phone || 'N/A',
          createdAt: plan?.created_at,
          publicToken: plan?.public_token,
          dentistName: plan?.dentist_name,
        };
      }) || [];
    } catch (error) {
      console.error('Error fetching recent patient plans:', error);
      throw error;
    }
  },

  /**
   * Get pending actions
   * @returns {Promise<Array>} Pending actions
   */
  getPendingActions: async () => {
    try {
      // Get incomplete procedures
      const { data: incompleteData, error: incompleteError } = await supabase?.from('procedure_completion_tracking')?.select(`
          id,
          completion_percentage,
          patients (
            first_name,
            last_name
          ),
          treatment_plans (
            public_token
          )
        `)?.lt('completion_percentage', 100)?.is('completed_at', null)?.order('created_at', { ascending: false })?.limit(10);

      if (incompleteError) throw incompleteError;

      const pendingActions = incompleteData?.map(item => ({
        id: item?.id,
        type: 'incomplete_procedure',
        message: `${item?.patients?.first_name} ${item?.patients?.last_name} - ${item?.completion_percentage}% complete`,
        priority: item?.completion_percentage < 25 ? 'high' : item?.completion_percentage < 50 ? 'medium' : 'low',
        publicToken: item?.treatment_plans?.public_token,
      })) || [];

      return pendingActions;
    } catch (error) {
      console.error('Error fetching pending actions:', error);
      throw error;
    }
  },
};
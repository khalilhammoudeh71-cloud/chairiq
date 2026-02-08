import { supabase } from '../lib/supabase';

export const patientAnalyticsService = {
  // Get comprehensive analytics for all treatment plans
  async getOverallAnalytics() {
    try {
      // Get total patients count
      const { count: totalPatients } = await supabase?.from('patients')?.select('*', { count: 'exact', head: true });

      // Get active treatment plans count
      const { count: activePlans } = await supabase?.from('treatment_plans')?.select('*', { count: 'exact', head: true });

      // Get completion statistics
      const { data: completionData } = await supabase?.from('procedure_completion_tracking')?.select('completion_percentage, completed_at');

      const completionRate = completionData?.length > 0
        ? (completionData?.filter(c => c?.completed_at !== null)?.length / completionData?.length) * 100
        : 0;

      // Get average engagement time
      const { data: sessionData } = await supabase?.from('patient_session_analytics')?.select('total_time_seconds');

      const avgEngagementTime = sessionData?.length > 0
        ? Math.round(sessionData?.reduce((sum, s) => sum + (s?.total_time_seconds || 0), 0) / sessionData?.length)
        : 0;

      return {
        totalPatients: totalPatients || 0,
        activePlans: activePlans || 0,
        completionRate: Math.round(completionRate),
        avgEngagementTime
      };
    } catch (error) {
      console.error('Error fetching overall analytics:', error);
      throw error;
    }
  },

  // Get engagement trends over time
  async getEngagementTrends(days = 30) {
    try {
      const startDate = new Date();
      startDate?.setDate(startDate?.getDate() - days);

      const { data, error } = await supabase?.from('patient_engagement_events')?.select('created_at, event_type')?.gte('created_at', startDate?.toISOString())?.order('created_at', { ascending: true });

      if (error) throw error;

      // Group by date
      const trendsByDate = {};
      data?.forEach(event => {
        const date = new Date(event.created_at)?.toLocaleDateString();
        if (!trendsByDate?.[date]) {
          trendsByDate[date] = { date, planViews: 0, procedureViews: 0, completions: 0 };
        }
        
        if (event?.event_type === 'plan_view') trendsByDate[date].planViews++;
        if (event?.event_type === 'procedure_view') trendsByDate[date].procedureViews++;
        if (event?.event_type === 'procedure_completion') trendsByDate[date].completions++;
      });

      return Object.values(trendsByDate);
    } catch (error) {
      console.error('Error fetching engagement trends:', error);
      throw error;
    }
  },

  // Get detailed patient engagement list
  async getPatientEngagementList(filters = {}) {
    try {
      let query = supabase?.from('patients')?.select(`
          id,
          first_name,
          last_name,
          preferred_language,
          treatment_plans!inner (
            id,
            public_token,
            created_at,
            patient_session_analytics (
              total_time_seconds,
              procedures_viewed
            ),
            procedure_completion_tracking (
              completion_percentage,
              completed_at
            )
          )
        `);

      if (filters?.language) {
        query = query?.eq('preferred_language', filters?.language);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform data for display
      return data?.map(patient => {
        const plan = patient?.treatment_plans?.[0];
        const session = plan?.patient_session_analytics?.[0];
        const completions = plan?.procedure_completion_tracking || [];
        
        const completedCount = completions?.filter(c => c?.completed_at !== null)?.length;
        const totalCount = completions?.length;

        return {
          patientId: patient?.id,
          patientName: `${patient?.first_name} ${patient?.last_name}`,
          language: patient?.preferred_language,
          publicToken: plan?.public_token,
          timeSpent: session?.total_time_seconds || 0,
          proceduresViewed: session?.procedures_viewed || 0,
          completionStatus: totalCount > 0 
            ? `${completedCount}/${totalCount}` 
            : '0/0',
          completionPercentage: totalCount > 0 
            ? Math.round((completedCount / totalCount) * 100) 
            : 0
        };
      }) || [];
    } catch (error) {
      console.error('Error fetching patient engagement list:', error);
      throw error;
    }
  },

  // Get language distribution
  async getLanguageDistribution() {
    try {
      const { data, error } = await supabase?.from('patient_language_preferences')?.select('language_code, patient_id');

      if (error) throw error;

      const distribution = {};
      data?.forEach(pref => {
        distribution[pref.language_code] = (distribution?.[pref?.language_code] || 0) + 1;
      });

      return Object.entries(distribution)?.map(([language, count]) => ({
        language,
        count,
        percentage: Math.round((count / data?.length) * 100)
      }));
    } catch (error) {
      console.error('Error fetching language distribution:', error);
      throw error;
    }
  },

  // Get dropout analysis
  async getDropoutAnalysis() {
    try {
      const { data, error } = await supabase?.from('patient_session_analytics')?.select('dropout_point')?.not('dropout_point', 'is', null);

      if (error) throw error;

      const dropoutCounts = {};
      data?.forEach(session => {
        const point = session?.dropout_point;
        dropoutCounts[point] = (dropoutCounts?.[point] || 0) + 1;
      });

      return Object.entries(dropoutCounts)?.map(([point, count]) => ({ point, count }))?.sort((a, b) => b?.count - a?.count);
    } catch (error) {
      console.error('Error fetching dropout analysis:', error);
      throw error;
    }
  },

  // Get procedure-specific analytics
  async getProcedureAnalytics() {
    try {
      const { data, error } = await supabase?.from('plan_procedures')?.select(`
          id,
          procedure_name,
          procedure_completion_tracking (
            viewed_at,
            completed_at,
            time_spent_seconds
          )
        `);

      if (error) throw error;

      return data?.map(procedure => {
        const tracking = procedure?.procedure_completion_tracking || [];
        const viewCount = tracking?.filter(t => t?.viewed_at !== null)?.length;
        const completionCount = tracking?.filter(t => t?.completed_at !== null)?.length;
        const avgTimeSpent = tracking?.length > 0
          ? Math.round(tracking?.reduce((sum, t) => sum + (t?.time_spent_seconds || 0), 0) / tracking?.length)
          : 0;

        return {
          procedureName: procedure?.procedure_name,
          viewCount,
          completionCount,
          avgTimeSpent,
          completionRate: viewCount > 0 ? Math.round((completionCount / viewCount) * 100) : 0
        };
      }) || [];
    } catch (error) {
      console.error('Error fetching procedure analytics:', error);
      throw error;
    }
  }
};
import { supabase } from '../lib/supabase';

/**
 * Patient Learning Profile Service
 * Tracks engagement patterns and learning history for AI personalization
 */

export const patientLearningProfileService = {
  /**
   * Get comprehensive learning profile for a patient
   * @param {string} patientId - Patient UUID
   * @param {string} treatmentPlanId - Treatment plan UUID
   * @returns {Promise<Object>} Learning profile with engagement patterns
   */
  async getPatientLearningProfile(patientId, treatmentPlanId) {
    try {
      // Get patient basic info
      const { data: patient, error: patientError } = await supabase
        ?.from('patients')
        ?.select('id, first_name, last_name, preferred_language')
        ?.eq('id', patientId)
        ?.maybeSingle();

      if (patientError) throw patientError;

      // Get engagement events
      const { data: engagementEvents, error: eventsError } = await supabase
        ?.from('patient_engagement_events')
        ?.select('event_type, event_data, time_spent_seconds, created_at, procedure_id')
        ?.eq('patient_id', patientId)
        ?.eq('treatment_plan_id', treatmentPlanId)
        ?.order('created_at', { ascending: false });

      if (eventsError) throw eventsError;

      // Get session analytics
      const { data: sessions, error: sessionsError } = await supabase
        ?.from('patient_session_analytics')
        ?.select('total_time_seconds, pages_viewed, procedures_viewed, session_start, session_end')
        ?.eq('patient_id', patientId)
        ?.eq('treatment_plan_id', treatmentPlanId)
        ?.order('session_start', { ascending: false });

      if (sessionsError) throw sessionsError;

      // Get procedure completion tracking
      const { data: completions, error: completionsError } = await supabase
        ?.from('procedure_completion_tracking')
        ?.select('procedure_id, viewed_at, completed_at, time_spent_seconds, completion_percentage')
        ?.eq('patient_id', patientId)
        ?.eq('treatment_plan_id', treatmentPlanId);

      if (completionsError) throw completionsError;

      // Get language preferences history
      const { data: languagePrefs, error: langError } = await supabase
        ?.from('patient_language_preferences')
        ?.select('language_code, changed_at')
        ?.eq('patient_id', patientId)
        ?.eq('treatment_plan_id', treatmentPlanId)
        ?.order('changed_at', { ascending: false });

      if (langError) throw langError;

      // Analyze engagement patterns
      const engagementPatterns = this.analyzeEngagementPatterns(engagementEvents, sessions, completions);

      return {
        patientId: patient?.id,
        patientName: `${patient?.first_name} ${patient?.last_name}`,
        preferredLanguage: patient?.preferred_language,
        engagementPatterns,
        sessions: sessions || [],
        completions: completions || [],
        languageHistory: languagePrefs || [],
        totalEngagementTime: sessions?.reduce((sum, s) => sum + (s?.total_time_seconds || 0), 0) || 0,
        totalProceduresViewed: completions?.filter(c => c?.viewed_at)?.length || 0,
        totalProceduresCompleted: completions?.filter(c => c?.completed_at)?.length || 0,
      };
    } catch (error) {
      console.error('Error fetching patient learning profile:', error);
      throw error;
    }
  },

  /**
   * Analyze engagement patterns from raw data
   * @param {Array} events - Engagement events
   * @param {Array} sessions - Session analytics
   * @param {Array} completions - Completion tracking
   * @returns {Object} Analyzed patterns
   */
  analyzeEngagementPatterns(events, sessions, completions) {
    const patterns = {
      engagementLevel: 'medium', // low, medium, high
      learningPace: 'moderate', // slow, moderate, fast
      contentPreference: 'balanced', // visual, text, balanced
      attentionSpan: 'average', // short, average, long
      repeatViewPatterns: [],
      dropoffPoints: [],
      peakEngagementTimes: [],
    };

    // Calculate engagement level based on total time and sessions
    const totalTime = sessions?.reduce((sum, s) => sum + (s?.total_time_seconds || 0), 0) || 0;
    const sessionCount = sessions?.length || 0;
    const avgSessionTime = sessionCount > 0 ? totalTime / sessionCount : 0;

    if (avgSessionTime > 600) { // 10+ minutes average
      patterns.engagementLevel = 'high';
      patterns.attentionSpan = 'long';
    } else if (avgSessionTime < 180) { // Less than 3 minutes
      patterns.engagementLevel = 'low';
      patterns.attentionSpan = 'short';
    }

    // Calculate learning pace based on completion rate
    const viewedCount = completions?.filter(c => c?.viewed_at)?.length || 0;
    const completedCount = completions?.filter(c => c?.completed_at)?.length || 0;
    const completionRate = viewedCount > 0 ? completedCount / viewedCount : 0;

    if (completionRate > 0.7) {
      patterns.learningPace = 'fast';
    } else if (completionRate < 0.3) {
      patterns.learningPace = 'slow';
    }

    // Detect repeat view patterns (procedures viewed multiple times)
    const procedureViewCounts = {};
    events?.forEach(event => {
      if (event?.event_type === 'procedure_view' && event?.procedure_id) {
        procedureViewCounts[event.procedure_id] = (procedureViewCounts?.[event?.procedure_id] || 0) + 1;
      }
    });

    patterns.repeatViewPatterns = Object.entries(procedureViewCounts)?.filter(([_, count]) => count > 2)?.map(([procedureId, count]) => ({ procedureId, viewCount: count }));

    // Detect content preference based on time spent on different event types
    const sectionViewEvents = events?.filter(e => e?.event_type === 'section_view') || [];
    const visualViewTime = sectionViewEvents?.filter(e => e?.event_data?.section?.includes('visual') || e?.event_data?.section?.includes('image'))?.reduce((sum, e) => sum + (e?.time_spent_seconds || 0), 0);
    const textViewTime = sectionViewEvents?.filter(e => e?.event_data?.section?.includes('explanation') || e?.event_data?.section?.includes('description'))?.reduce((sum, e) => sum + (e?.time_spent_seconds || 0), 0);

    if (visualViewTime > textViewTime * 1.5) {
      patterns.contentPreference = 'visual';
    } else if (textViewTime > visualViewTime * 1.5) {
      patterns.contentPreference = 'text';
    }

    return patterns;
  },

  /**
   * Get procedure-specific engagement history
   * @param {string} patientId - Patient UUID
   * @param {string} procedureId - Procedure UUID
   * @returns {Promise<Object>} Procedure engagement details
   */
  async getProcedureEngagementHistory(patientId, procedureId) {
    try {
      const { data: events, error } = await supabase
        ?.from('patient_engagement_events')
        ?.select('event_type, event_data, time_spent_seconds, created_at')
        ?.eq('patient_id', patientId)
        ?.eq('procedure_id', procedureId)
        ?.order('created_at', { ascending: false });

      if (error) throw error;

      const viewCount = events?.filter(e => e?.event_type === 'procedure_view')?.length || 0;
      const totalTimeSpent = events?.reduce((sum, e) => sum + (e?.time_spent_seconds || 0), 0) || 0;
      const sectionsViewed = events
        ?.filter(e => e?.event_type === 'section_view')
        ?.map(e => e?.event_data?.section)
        ?.filter(Boolean) || [];

      return {
        procedureId,
        viewCount,
        totalTimeSpent,
        sectionsViewed,
        lastViewedAt: events?.[0]?.created_at || null,
        events: events || [],
      };
    } catch (error) {
      console.error('Error fetching procedure engagement history:', error);
      throw error;
    }
  },

  /**
   * Record engagement event
   * @param {Object} eventData - Event details
   * @returns {Promise<void>}
   */
  async recordEngagementEvent(eventData) {
    try {
      const { error } = await supabase
        ?.from('patient_engagement_events')
        ?.insert({
          patient_id: eventData?.patientId,
          treatment_plan_id: eventData?.treatmentPlanId,
          procedure_id: eventData?.procedureId || null,
          event_type: eventData?.eventType,
          event_data: eventData?.eventData || {},
          session_id: eventData?.sessionId,
          page_url: eventData?.pageUrl || window?.location?.href,
          time_spent_seconds: eventData?.timeSpentSeconds || 0,
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error recording engagement event:', error);
      // Don't throw - engagement tracking should not break user experience
    }
  },
};
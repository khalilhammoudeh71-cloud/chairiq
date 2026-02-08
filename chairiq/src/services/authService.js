import { supabase } from '../lib/supabase';

export const authService = {
  /**
   * Sign in with email and password
   */
  async signIn(email, password) {
    try {
      const { data, error } = await supabase?.auth?.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message || 'Sign in failed' } };
    }
  },

  /**
   * Sign out current user
   */
  async signOut() {
    try {
      const { error } = await supabase?.auth?.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: { message: error?.message || 'Sign out failed' } };
    }
  },

  /**
   * Get current user session
   */
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase?.auth?.getUser();
      if (error) throw error;
      return { user, error: null };
    } catch (error) {
      return { user: null, error: { message: error?.message } };
    }
  },

  /**
   * Get user profile with role information
   */
  async getUserProfile(userId) {
    try {
      const { data, error } = await supabase?.from('user_profiles')?.select('*')?.eq('id', userId)?.single();
      
      if (error) throw error;
      
      return {
        userProfile: {
          id: data?.id,
          email: data?.email,
          fullName: data?.full_name,
          role: data?.role,
          practiceName: data?.practice_name,
          phone: data?.phone,
          createdAt: data?.created_at,
          updatedAt: data?.updated_at
        },
        error: null
      };
    } catch (error) {
      return { userProfile: null, error: { message: error?.message } };
    }
  },

  /**
   * Check if current user is a dentist
   */
  async isDentist() {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) return false;

      const { data, error } = await supabase?.from('user_profiles')?.select('role')?.eq('id', user?.id)?.single();
      
      if (error) throw error;
      
      return data?.role === 'dentist';
    } catch (error) {
      console.error('Error checking dentist role:', error);
      return false;
    }
  }
};
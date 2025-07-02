import { supabase } from './supabase';

export interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  full_name?: string;
  date_of_birth?: string;
  gender?: string;
  is_head_of_household?: boolean;
  house_id?: string;
  verification_status?: 'pending' | 'verified' | 'skipped' | 'failed';
  created_at: string;
  updated_at: string;
}

// User Profile Management Service
export const profileService = {
  // Create a new user profile
  createProfile: async (profileData: {
    user_id: string;
    email: string;
    full_name?: string;
    date_of_birth?: string;
    gender?: string;
    is_head_of_household?: boolean;
    house_id?: string;
    verification_status?: 'pending' | 'verified' | 'skipped' | 'failed';
  }) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert([{
        ...profileData,
        verification_status: profileData.verification_status || 'pending',
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating profile:', error);
      throw error;
    }

    return data as UserProfile;
  },

  // Get user profile by user ID
  getProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No profile found
        return null;
      }
      console.error('Error fetching profile:', error);
      throw error;
    }

    return data as UserProfile;
  },

  // Update user profile
  updateProfile: async (userId: string, updates: Partial<UserProfile>) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }

    return data as UserProfile;
  },

  // Delete user profile
  deleteProfile: async (userId: string) => {
    const { error } = await supabase
      .from('user_profiles')
      .delete()
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting profile:', error);
      throw error;
    }
  },

  // Update verification status
  updateVerificationStatus: async (
    userId: string, 
    status: 'pending' | 'verified' | 'skipped' | 'failed'
  ) => {
    return await profileService.updateProfile(userId, {
      verification_status: status,
    });
  },
};
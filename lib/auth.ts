import { supabase } from './supabase';
import { profileService } from './profiles';
import { houseService } from './houses';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  date_of_birth?: string;
  gender?: string;
  is_head_of_household?: boolean;
  verification_status?: 'pending' | 'verified' | 'failed';
  created_at: string;
  updated_at: string;
}

export interface SignUpData {
  email: string;
  password: string;
  fullName?: string;
  dateOfBirth?: string;
  gender?: string;
  isHeadOfHousehold?: boolean;
  existingHouseId?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

// Check if Supabase is properly configured
const isSupabaseConfigured = () => {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  return url && url !== 'https://placeholder.supabase.co' && key && key !== 'placeholder-anon-key';
};

// Authentication functions
export const authService = {
  // Sign up with email and password
  signUp: async (data: SignUpData) => {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured - using mock response');
      return { user: null, session: null };
    }
    const { email, password, ...profileData } = data;
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: profileData.fullName,
        }
      }
    });

    if (authError) throw authError;

    // If user is created successfully, handle house management and create profile
    if (authData.user) {
      let houseId: string | undefined;
      
      try {
        // Handle house creation or joining
        if (profileData.isHeadOfHousehold) {
          // Create new house for head of household
          const house = await houseService.createHouse(authData.user.id);
          houseId = house.id;
        } else if (profileData.existingHouseId) {
          // Join existing house
          const result = await houseService.joinHouse(authData.user.id, profileData.existingHouseId);
          houseId = result.house.id;
        }

        // Create user profile with house ID
        await profileService.createProfile({
          user_id: authData.user.id,
          email: authData.user.email!,
          full_name: profileData.fullName,
          date_of_birth: profileData.dateOfBirth,
          gender: profileData.gender,
          is_head_of_household: profileData.isHeadOfHousehold,
          house_id: houseId,
          verification_status: 'pending',
        });
      } catch (error) {
        console.error('Error with house management or profile creation:', error);
        // Re-throw the error since house/profile creation is critical
        throw error;
      }
    }

    return { user: authData.user, session: authData.session };
  },

  // Sign in with email and password
  signIn: async (data: SignInData) => {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured - using mock response');
      return { user: null, session: null };
    }
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) throw error;

    return { user: authData.user, session: authData.session };
  },

  // Sign out
  signOut: async () => {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured - mock sign out');
      return;
    }
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  },

  // Get current session
  getSession: async () => {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured - returning null session');
      return null;
    }
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  },

  // Get current user
  getCurrentUser: async () => {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured - returning null user');
      return null;
    }
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  // Update user profile
  updateProfile: async (updates: Partial<UserProfile>) => {
    const { data, error } = await supabase.auth.updateUser({
      data: updates
    });

    if (error) throw error;
    return data;
  },

  // Reset password
  resetPassword: async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  },

  // Verify OTP for email confirmation
  verifyOtp: async (email: string, token: string) => {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured - mock OTP verification');
      return { data: null, error: null };
    }
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'signup',
    });
    return { data, error };
  },

  // Resend OTP
  resendOtp: async (email: string) => {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured - mock resend OTP');
      return { error: null };
    }
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    });
    return { error };
  },

  // Listen to auth state changes
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  },
};
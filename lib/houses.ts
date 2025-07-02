import { supabase } from './supabase';

export interface House {
  id: string;
  house_code: string; // Human readable code for joining
  head_of_household_id: string;
  house_name?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface HouseMember {
  id: string;
  house_id: string;
  user_id: string;
  is_head: boolean;
  joined_at: string;
}

// House Management Service
export const houseService = {
  // Generate a unique house code (e.g., "ECO-2024-ABC123")
  generateHouseCode: (): string => {
    const year = new Date().getFullYear();
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `ECO-${year}-${randomPart}`;
  },

  // Create a new house with the user as head of household
  createHouse: async (headOfHouseholdId: string, houseName?: string, address?: string) => {
    const houseCode = houseService.generateHouseCode();
    
    // Create the house
    const { data: house, error: houseError } = await supabase
      .from('houses')
      .insert([{
        house_code: houseCode,
        head_of_household_id: headOfHouseholdId,
        house_name: houseName,
        address: address,
      }])
      .select()
      .single();

    if (houseError) {
      console.error('Error creating house:', houseError);
      throw houseError;
    }

    // Add the head of household as a member
    const { error: memberError } = await supabase
      .from('house_members')
      .insert([{
        house_id: house.id,
        user_id: headOfHouseholdId,
        is_head: true,
      }]);

    if (memberError) {
      console.error('Error adding head of household as member:', memberError);
      throw memberError;
    }

    return house as House;
  },

  // Join an existing house using house code
  joinHouse: async (userId: string, houseCode: string) => {
    // First, find the house by code
    const { data: house, error: houseError } = await supabase
      .from('houses')
      .select('*')
      .eq('house_code', houseCode.toUpperCase())
      .single();

    if (houseError) {
      if (houseError.code === 'PGRST116') {
        throw new Error('House code not found. Please check the code and try again.');
      }
      console.error('Error finding house:', houseError);
      throw houseError;
    }

    // Check if user is already a member
    const { data: existingMember } = await supabase
      .from('house_members')
      .select('*')
      .eq('house_id', house.id)
      .eq('user_id', userId)
      .single();

    if (existingMember) {
      throw new Error('You are already a member of this house.');
    }

    // Add user as a house member
    const { data: member, error: memberError } = await supabase
      .from('house_members')
      .insert([{
        house_id: house.id,
        user_id: userId,
        is_head: false,
      }])
      .select()
      .single();

    if (memberError) {
      console.error('Error joining house:', memberError);
      throw memberError;
    }

    return { house: house as House, member: member as HouseMember };
  },

  // Get house information by house code
  getHouseByCode: async (houseCode: string) => {
    const { data, error } = await supabase
      .from('houses')
      .select(`
        *,
        house_members!inner(
          user_id,
          is_head,
          joined_at,
          user_profiles!inner(
            full_name,
            email
          )
        )
      `)
      .eq('house_code', houseCode.toUpperCase())
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // House not found
      }
      console.error('Error fetching house:', error);
      throw error;
    }

    return data;
  },

  // Get user's house information
  getUserHouse: async (userId: string) => {
    const { data, error } = await supabase
      .from('house_members')
      .select(`
        *,
        houses!inner(
          id,
          house_code,
          house_name,
          address,
          head_of_household_id,
          created_at
        )
      `)
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // User not in any house
      }
      console.error('Error fetching user house:', error);
      throw error;
    }

    return data;
  },

  // Get all members of a house
  getHouseMembers: async (houseId: string) => {
    const { data, error } = await supabase
      .from('house_members')
      .select(`
        *,
        user_profiles!inner(
          full_name,
          email,
          date_of_birth,
          gender
        )
      `)
      .eq('house_id', houseId)
      .order('is_head', { ascending: false }); // Head of household first

    if (error) {
      console.error('Error fetching house members:', error);
      throw error;
    }

    return data;
  },

  // Validate house code format
  isValidHouseCode: (houseCode: string): boolean => {
    const houseCodeRegex = /^ECO-\d{4}-[A-Z0-9]{6}$/;
    return houseCodeRegex.test(houseCode.toUpperCase());
  },

  // Leave house (for non-heads)
  leaveHouse: async (userId: string) => {
    const { error } = await supabase
      .from('house_members')
      .delete()
      .eq('user_id', userId)
      .eq('is_head', false); // Only non-heads can leave

    if (error) {
      console.error('Error leaving house:', error);
      throw error;
    }
  },

  // Update house information (head of household only)
  updateHouse: async (houseId: string, updates: Partial<House>) => {
    const { data, error } = await supabase
      .from('houses')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', houseId)
      .select()
      .single();

    if (error) {
      console.error('Error updating house:', error);
      throw error;
    }

    return data as House;
  },
};
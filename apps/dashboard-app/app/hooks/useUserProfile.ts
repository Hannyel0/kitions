'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/providers/auth-provider';
import { createSupabaseBrowserClient } from '@/app/utils/supabase';

export type UserProfile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  businessName: string;
  role: string;
  profilePictureUrl: string | null;
  loading: boolean;
  error: string | null;
};

export default function useUserProfile(): UserProfile {
  const { user } = useAuth();
  const supabase = createSupabaseBrowserClient();
  const [profile, setProfile] = useState<Omit<UserProfile, 'loading' | 'error'>>({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    businessName: '',
    role: '',
    profilePictureUrl: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserProfile() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, first_name, last_name, email, phone, business_name, role, profile_picture_url')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        setProfile({
          id: data.id,
          firstName: data.first_name || '',
          lastName: data.last_name || '',
          email: data.email || '',
          phone: data.phone || '',
          businessName: data.business_name || '',
          role: data.role || '',
          profilePictureUrl: data.profile_picture_url || null,
        });
        setError(null);
      } catch (err: any) {
        console.error('Error fetching user profile:', err?.message || err);
        setError('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    }

    fetchUserProfile();
  }, [user, supabase]);

  return {
    ...profile,
    loading,
    error,
  };
} 
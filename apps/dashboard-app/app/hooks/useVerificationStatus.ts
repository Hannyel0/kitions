import { useState, useEffect, useCallback } from 'react';
import { createSupabaseBrowserClient } from '@/app/utils/supabase';
import { User } from '@supabase/supabase-js';

export interface VerificationStatus {
  status: 'pending' | 'verified' | 'rejected' | 'approved';
  updated_at: string;
}

interface UseVerificationStatusReturn {
  user: User | null;
  verificationStatus: VerificationStatus | null;
  loading: boolean;
  error: Error | null;
  isVerified: boolean;
  refreshStatus: () => Promise<void>;
}

export function useVerificationStatus(): UseVerificationStatusReturn {
  const [user, setUser] = useState<User | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createSupabaseBrowserClient();

  const fetchVerificationStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current user session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw new Error(`Session error: ${sessionError.message}`);
      }

      if (session?.user) {
        setUser(session.user);
        
        // Fetch verification status
        const { data: statusData, error: statusError } = await supabase
          .from('user_verification_statuses')
          .select('status, updated_at')
          .eq('user_id', session.user.id)
          .single();
        
        if (statusError && statusError.code !== 'PGRST116') { // PGRST116 = no rows found
          throw new Error(`Verification status error: ${statusError.message}`);
        }
        
        setVerificationStatus(statusData);
      } else {
        setUser(null);
        setVerificationStatus(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchVerificationStatus();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event) => {
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
          await fetchVerificationStatus();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [fetchVerificationStatus, supabase]);

  // Determine if user is verified
  const isVerified = verificationStatus?.status === 'verified' || verificationStatus?.status === 'approved';

  return {
    user,
    verificationStatus,
    loading,
    error,
    isVerified,
    refreshStatus: fetchVerificationStatus,
  };
} 
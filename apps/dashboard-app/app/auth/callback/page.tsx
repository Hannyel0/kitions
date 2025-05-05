'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { createSupabaseBrowserClient } from '@/app/utils/supabase';

export default function AuthCallback() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    if (typeof window === 'undefined') {
        console.log("AuthCallback: Skipping useEffect on server.");
        return;
    }
    
    console.log('AuthCallback: useEffect running on client.');

    const run = async () => {
      console.log('AuthCallback: run() started.');
      const urlParams = new URLSearchParams(window.location.search);
      const access_token = urlParams.get('access_token');
      const refresh_token = urlParams.get('refresh_token');

      if (!access_token || !refresh_token) {
        console.error('AuthCallback: Missing access_token or refresh_token in URL.');
        // --- Use updated public URL ---
        window.location.href = 'http://localhost:3000/login?error=missing_tokens'; 
        return; 
      }

      console.log('AuthCallback: Both tokens found, attempting to set session.');
      const { error } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });

      if (error) {
        console.error('AuthCallback: Error setting session:', error);
        // --- Use updated public URL ---
        window.location.href = 'http://localhost:3000/login?error=session_error'; 
        return; 
      }

      console.log('AuthCallback: Session set successfully. Fetching user...');
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
         console.error('AuthCallback: Failed to fetch user after setting session:', userError);
         // --- Use updated public URL ---
         window.location.href = 'http://localhost:3000/login?error=user_fetch_error'; 
         return; 
      }

      console.log('AuthCallback: User fetched successfully. Determining redirect path...');
      const role = user?.user_metadata?.role;
      const path = role === 'retailer' ? '/retailer/home' : '/distributor/home';
      
      // --- Re-enable final redirect --- 
      console.log(`AuthCallback: ALL CHECKS PASSED. User Role: ${role}. Forcing reload to: ${path}.`);
      window.location.href = path; 
    };

    run();
    console.log('AuthCallback: run() called.');

  }, []); 

  // Restore original loading message
  return <div className="p-6 text-center">Authenticating... Please wait.</div>;
}
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/app/utils/supabase';
import { URLs } from '@/app/config/urls';
import { usePageTitle } from '@/app/hooks/usePageTitle';

export default function AuthCallback() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [statusMessage, setStatusMessage] = useState("Initializing authentication...");
  
  // Use our custom hook to set the page title
  usePageTitle('Authenticating');

  useEffect(() => {
    if (typeof window === 'undefined') {
        console.log("AuthCallback: Skipping useEffect on server.");
        return;
    }
    
    console.log('AuthCallback: useEffect running on client.');

    const run = async () => {
      console.log('AuthCallback: run() started.');
      setStatusMessage("Verifying your credentials...");
      
      // Check if we're in development mode with tokens in URL
      if (process.env.NODE_ENV === 'development') {
        const urlParams = new URLSearchParams(window.location.search);
        const access_token = urlParams.get('access_token');
        const refresh_token = urlParams.get('refresh_token');
  
        if (access_token && refresh_token) {
          console.log('AuthCallback: Development mode - tokens found in URL, attempting to set session.');
          setStatusMessage("Setting up your session...");
          const { error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });
  
          if (error) {
            console.error('AuthCallback: Error setting session:', error);
            window.location.href = URLs.getPublicUrl(`${URLs.public.login}?error=session_error`);
            return; 
          }
        }
      }

      // For both production and development, get the session
      console.log('AuthCallback: Fetching session...');
      setStatusMessage("Retrieving your session...");
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        console.error('AuthCallback: No session found:', sessionError);
        window.location.href = URLs.getPublicUrl(`${URLs.public.login}?error=no_session`);
        return;
      }

      console.log('AuthCallback: Session found successfully. Fetching user...');
      setStatusMessage("Loading your account information...");
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
         console.error('AuthCallback: Failed to fetch user after setting session:', userError);
         window.location.href = URLs.getPublicUrl(`${URLs.public.login}?error=user_fetch_error`);
         return; 
      }

      console.log('AuthCallback: User fetched successfully. Determining redirect path...');
      setStatusMessage("Preparing your dashboard...");
      const role = user?.user_metadata?.role;
      
      // Determine the target URL based on role
      let targetPath = '';
      if (role === 'retailer') {
        console.log(`AuthCallback: Valid role found: ${role}. Redirecting to retailer home.`);
        targetPath = URLs.dashboard.retailerHome;
      } else if (role === 'distributor') {
        console.log(`AuthCallback: Valid role found: ${role}. Redirecting to distributor home.`);
        targetPath = URLs.dashboard.distributorHome;
      } else {
        // Invalid or missing role - redirect to error page
        console.warn(`AuthCallback: Invalid or missing role: ${role}. Redirecting to error page.`);
        targetPath = URLs.dashboard.errorAuth;
      }
      
      // Get the full URL with the correct base (localhost:3001 in development)
      const targetUrl = URLs.getDashboardUrl(targetPath);
      console.log(`AuthCallback: Full target URL: ${targetUrl}`);
      
      // Add a delay before redirecting to ensure localStorage session is properly established
      console.log('AuthCallback: Adding delay before navigation to allow session to propagate...');
      setStatusMessage("Finalizing your session...");
      
      // Force a session refresh to ensure the session is completely ready
      await supabase.auth.refreshSession();
      
      // Get the session one more time to verify it's really there
      const { data: finalCheck } = await supabase.auth.getSession();
      console.log('AuthCallback: Final session check before redirect:', { 
        hasSession: !!finalCheck.session,
        user: finalCheck.session?.user?.email 
      });
      
      // Extra safety timeout to ensure cookies have time to propagate
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Use window.location for direct navigation instead of Next.js router
      // This ensures we get a full page load and avoid stale state issues
      console.log(`AuthCallback: Navigating to: ${targetUrl}`);
      setStatusMessage("Redirecting to your dashboard...");
      
      // Set a cookie to mark this as a post-auth redirect
      // This helps the middleware identify this navigation as authenticated
      document.cookie = `kitions_post_auth_redirect=true; path=/; max-age=60; SameSite=Strict`;
      
      // Direct navigation to avoid Next.js router
      window.location.href = targetUrl;
      
      // No need to call router.refresh() as we're doing a full page navigation
    };

    run();
    console.log('AuthCallback: run() called.');

  }, [router, supabase.auth]); 

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center p-6">
        <div className="mb-6">
          <div className="w-16 h-16 border-t-4 border-[#8982cf] border-solid rounded-full animate-spin mx-auto"></div>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Authenticating...</h2>
        <p className="text-gray-600">{statusMessage}</p>
      </div>
    </div>
  );
}
'use client';

import { useAuth } from '@/app/providers/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { DashboardLayout } from '@/app/components/layout';
import useUserProfile from '@/app/hooks/useUserProfile';
import { ProfileAvatar } from '@/app/components/user';
import { Statistics, QuickActions } from '@/app/components/dashboard';
import { RecentOrders } from '@/app/components/dashboard/RecentOrders';

export default function DistributorHomeContent() {
  const { user, loading: authLoading } = useAuth();
  const { firstName, lastName, profilePictureUrl, loading: profileLoading } = useUserProfile();
  const router = useRouter();
  
  const loading = authLoading || profileLoading;

  useEffect(() => {
    console.log('Distributor Home - Auth state:', { user, loading });
    
    // Set a timeout to check for authentication after a short delay
    const timeoutId = setTimeout(() => {
      // Check again inside the timeout
      if (!loading && user === null) { 
        console.log('Distributor Home: No user found after delay. Redirecting...');
        const loginUrl = process.env.NODE_ENV === 'development'
          ? 'http://localhost:3000/login'
          : '/login'; // In production, assume it's on the same domain
        // Re-enable the redirect, but delayed
        router.replace(loginUrl); 
      }
    }, 300); // Wait 300ms

    // Cleanup function to clear the timeout if the component unmounts
    // or if dependencies change before the timeout executes
    return () => clearTimeout(timeoutId);

  }, [user, loading, router]); // Dependencies remain the same

  // If user is null after loading, return null
  if (user === null && !loading) {
    return null;
  }

  // --- Get user's name (fallback to email if name not in metadata) ---
  const userName = loading ? '' : (firstName || user?.email || '');

  // Always render the layout, regardless of loading state
  return (
    <DashboardLayout userType="distributor">
      {loading ? (
        <div className="container mx-auto px-4 py-6 flex items-center justify-center" style={{ minHeight: '600px' }}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8982cf]"></div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-6">
        {/* Header with welcome message and profile */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div className="flex items-center">
            <ProfileAvatar 
              profilePictureUrl={profilePictureUrl}
              firstName={firstName}
              lastName={lastName}
              size="lg"
              className="mr-4"
            />
            <div>
              <h1 className="text-2xl text-gray-800 font-bold mb-1">Welcome back, {userName}!</h1>
              <p className="text-gray-600">Here&apos;s what&apos;s happening with your business today.</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-[#8982cf] text-white rounded-md hover:bg-[#7a73c0] transition-colors">
              Add New Product
            </button>
          </div>
        </div>
        
        {/* Quick Actions Section */}
        <QuickActions />
        
        {/* Statistics Section */}
        <Statistics />
        
        {/* Recent Orders */}
        <section className="mb-8">
          <h2 className="text-gray-800 text-xl font-semibold mb-4">Recent Orders</h2>
          <RecentOrders />
        </section>
      </div>
      )}
    </DashboardLayout>
  );
} 
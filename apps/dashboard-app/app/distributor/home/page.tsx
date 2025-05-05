'use client';

import { useAuth } from '@/app/providers/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import DashboardLayout from '@/app/components/DashboardLayout';
import useUserProfile from '@/app/hooks/useUserProfile';
import ProfileAvatar from '@/app/components/ProfileAvatar';

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

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8982cf]"></div>
      </div>
    );
  }

  // If user is null after loading, return null 
  // (The timeout might still redirect, but this prevents rendering the dashboard briefly)
  if (user === null) {
    return null;
  }

  // --- Get user's name (fallback to email if name not in metadata) ---
  const userName = firstName || user.email;

  // If loading is done and we have a user, render the content
  // (Implicitly handles the case where user is defined)
  return (
    <DashboardLayout userType="distributor">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center mb-8">
          <ProfileAvatar 
            profilePictureUrl={profilePictureUrl}
            firstName={firstName}
            lastName={lastName}
            size="lg"
            className="mr-4"
          />
          <div>
            <h1 className="text-2xl text-gray-800 font-bold mb-1">Welcome, {userName}!</h1>
            <p className="text-gray-600">This is your distributor dashboard.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Orders</h2>
            <p className="text-gray-600 mb-4">No pending orders</p>
            <div className="text-sm text-indigo-600 hover:text-indigo-800 cursor-pointer">
              View all orders →
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Products</h2>
            <p className="text-gray-600 mb-4">You have 0 products listed</p>
            <div className="text-sm text-indigo-600 hover:text-indigo-800 cursor-pointer">
              Add new products →
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Analytics</h2>
            <p className="text-gray-600 mb-4">View your store performance</p>
            <div className="text-sm text-indigo-600 hover:text-indigo-800 cursor-pointer">
              See analytics →
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 
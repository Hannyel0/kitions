'use client';

import { useAuth } from '@/app/providers/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import DashboardLayout from '@/app/components/DashboardLayout';
import useUserProfile from '@/app/hooks/useUserProfile';
import ProfileAvatar from '@/app/components/ProfileAvatar';

export default function RetailerHomeContent() {
  const { user, loading: authLoading } = useAuth();
  const { firstName, lastName, profilePictureUrl, loading: profileLoading } = useUserProfile();
  const router = useRouter();
  
  const loading = authLoading || profileLoading;

  useEffect(() => {
    console.log('Retailer Home - Auth state on initial render:', { user, loading, authLoading, profileLoading });
    
    // With cookie-based authentication, this is much simpler
    // We just check if we're in a loading state or missing a user
    if (!loading && !user) { 
      console.log('Retailer Home: No user found after loading is complete, redirecting to login');
      const loginUrl = process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000/login'
        : '/login';
      router.replace(loginUrl);
    }
    
    // No need for timeout with cookie-based auth - middleware handles initial session validation

    // No cleanup needed since we don't use a timeout anymore
    return () => {};
  }, [user, loading, authLoading, profileLoading, router]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8982cf]"></div>
      </div>
    );
  }

  // If user is null after loading, return null because redirect is happening
  if (user === null) {
    return null;
  }

  // --- Get user's name (fallback to email if name not in metadata) ---
  const userName = firstName || user.email;

  // If loading is done and we have a user, render the content
  // (Implicitly handles the case where user is defined)
  return (
    <DashboardLayout userType="retailer">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <ProfileAvatar 
            profilePictureUrl={profilePictureUrl}
            firstName={firstName}
            lastName={lastName}
            size="lg"
            className="mr-4"
          />
          <div>
            <h1 className="text-2xl font-bold">Welcome, {userName}!</h1>
            <p className="text-gray-600">This is your retailer dashboard.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">My Orders</h2>
            <p className="text-gray-600">You have no active orders.</p>
            <button className="mt-4 px-4 py-2 bg-[#8982cf] text-white rounded-md">Place New Order</button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">My Suppliers</h2>
            <p className="text-gray-600">You haven&apos;t added any suppliers yet.</p>
            <button className="mt-4 px-4 py-2 bg-[#8982cf] text-white rounded-md">Browse Suppliers</button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <ul className="space-y-2">
              <li><button className="text-[#8982cf] hover:underline">Browse Products</button></li>
              <li><button className="text-[#8982cf] hover:underline">View Order History</button></li>
              <li><button className="text-[#8982cf] hover:underline">Edit My Profile</button></li>
            </ul>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Verification Status</h2>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Your account is pending verification. Some features may be limited until verification is complete.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 
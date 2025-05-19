'use client';

import { useAuth } from '@/app/providers/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { DashboardLayout } from '@/app/components/layout';
import useUserProfile from '@/app/hooks/useUserProfile';
import { ProfileAvatar } from '@/app/components/user';
import { Statistics, QuickActions, WaitingList } from '@/app/components/dashboard';

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
              <p className="text-gray-600">Here's what's happening with your business today.</p>
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
        
        {/* Orders Overview */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Retailer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Sample order data - replace with real data */}
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#8982cf]">ORD-2025-001</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Corner Market</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">15 May 2025</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">$1,250.00</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#8982cf]">ORD-2025-002</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Urban Grocery</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">14 May 2025</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">$3,420.00</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        Shipped
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#8982cf]">ORD-2025-003</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Fresh Foods</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">12 May 2025</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">$980.00</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Delivered
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
        
        {/* Waiting List */}
        <WaitingList />
      </div>
      )}
    </DashboardLayout>
  );
} 
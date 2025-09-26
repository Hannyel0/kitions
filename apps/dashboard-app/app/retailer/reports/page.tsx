'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/providers/auth-provider';
import { DashboardLayout } from '@/app/components/layout';
import { Reports } from '@/app/components/reports/Reports';
import useUserProfile from '@/app/hooks/useUserProfile';

export default function DistributorReportsPage() {
  const { user, loading: authLoading } = useAuth();
  const { loading: profileLoading } = useUserProfile();
  const router = useRouter();
  
  const loading = authLoading || profileLoading;

  useEffect(() => {
    console.log('Distributor Reports - Auth state:', { user, loading });
    
    // Check authentication status and redirect if needed
    if (!loading && !user) { 
      console.log('Distributor Reports: No user found after loading is complete, redirecting to login');
      const loginUrl = process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000/login'
        : '/login';
      router.replace(loginUrl);
    }
    
  }, [user, loading, router]);

  // If user is null after loading, return null
  if (user === null && !loading) {
    return null;
  }

  // Always render the layout, regardless of loading state
  return (
    <DashboardLayout userType="retailer">
      {loading ? (
        <div className="container mx-auto px-4 py-6 flex items-center justify-center" style={{ minHeight: '600px' }}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8982cf]"></div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-6">
          <Reports />
        </div>
      )}
    </DashboardLayout>
  );
}

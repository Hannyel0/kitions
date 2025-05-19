'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/providers/auth-provider';
import { DashboardLayout } from '@/app/components/layout';
import { PersonalSettings } from '@/app/components/user/personal/PersonalSettings';

export default function DistributorPersonalSettingsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    console.log('Distributor Personal Settings Page - Auth state:', { user, loading: authLoading });
    
    // Check authentication status and redirect if needed
    if (!authLoading && !user) { 
      console.log('Distributor Personal Settings Page: No user found after loading is complete, redirecting to login');
      const loginUrl = process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000/login'
        : '/login';
      router.replace(loginUrl);
    }
    
  }, [user, authLoading, router]);

  // If user is null after loading, return null
  if (user === null && !authLoading) {
    return null;
  }

  // Always render the layout, regardless of loading state
  return (
    <DashboardLayout userType="distributor">
      {authLoading ? (
        <div className="container mx-auto px-4 py-6 flex items-center justify-center" style={{ minHeight: '600px' }}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8982cf]"></div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-6">
          <PersonalSettings />
        </div>
      )}
    </DashboardLayout>
  );
}

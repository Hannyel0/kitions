'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/providers/auth-provider';
import { DashboardLayout } from '@/app/components/layout';
import { Settings } from '@/app/components/user';
import useUserProfile from '@/app/hooks/useUserProfile';

export default function RetailerSettingsPage() {
  const { user, loading: authLoading } = useAuth();
  const { loading: profileLoading } = useUserProfile();
  const router = useRouter();
  
  const loading = authLoading || profileLoading;
  
  useEffect(() => {
    console.log('Retailer Settings Page - Auth state:', { user, loading });
    
    // Check authentication status and redirect if needed
    if (!loading && !user) { 
      console.log('Retailer Settings Page: No user found after loading is complete, redirecting to login');
      const loginUrl = process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000/login'
        : '/login';
      router.replace(loginUrl);
    }
    
  }, [user, loading, router]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8982cf]"></div>
      </div>
    );
  }

  // If user is null after loading, return null
  if (user === null) {
    return null;
  }

  return (
    <DashboardLayout userType="retailer">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
        <Settings />
      </div>
    </DashboardLayout>
  );
}

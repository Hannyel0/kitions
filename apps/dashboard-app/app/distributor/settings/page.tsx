'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/providers/auth-provider';
import { DashboardLayout } from '@/app/components/layout';
import { Settings } from '@/app/components/user';

export default function SettingsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    console.log('Settings Page - Auth state:', { user, loading: authLoading });
    
    // With cookie-based authentication, this is much simpler
    // We just check if we're in a loading state or missing a user
    if (!authLoading && !user) { 
      console.log('Settings Page: No user found after loading is complete, redirecting to login');
      const loginUrl = process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000/login'
        : '/login';
      router.replace(loginUrl);
    }
    
  }, [user, authLoading, router]);

  // Show loading state while checking authentication
  if (authLoading) {
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
    <DashboardLayout userType="distributor">
      <Settings />
    </DashboardLayout>
  );
}

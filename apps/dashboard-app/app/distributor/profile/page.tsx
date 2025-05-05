'use client';

import { useAuth } from '@/app/providers/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import DashboardLayout from '@/app/components/DashboardLayout';
import ProfileForm from '@/app/components/ProfileForm';

export default function DistributorProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Set a timeout to check for authentication after a short delay
    const timeoutId = setTimeout(() => {
      // Check again inside the timeout
      if (!loading && user === null) { 
        console.log('Profile Page: No user found after delay. Redirecting...');
        const loginUrl =
          process.env.NODE_ENV === 'development'
            ? 'http://localhost:3000/login'
            : '/login';
        router.replace(loginUrl);
      }
    }, 300); // Wait 300ms

    // Cleanup function
    return () => clearTimeout(timeoutId);
  }, [user, loading, router]);

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

  return (
    <DashboardLayout userType="distributor">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <ProfileForm />
        </div>
      </div>
    </DashboardLayout>
  );
} 
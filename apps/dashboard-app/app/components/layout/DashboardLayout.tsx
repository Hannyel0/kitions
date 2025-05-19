'use client';

import React from 'react';
import { useAuth } from '@/app/providers/auth-provider';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

type DashboardLayoutProps = {
  children: React.ReactNode;
  userType: 'retailer' | 'distributor' | 'admin';
};

export default function DashboardLayout({ children, userType }: DashboardLayoutProps) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Fixed sidebar */}
      <div className="h-screen sticky top-0">
        <Sidebar userType={userType} />
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
        {/* Fixed header */}
        <div className="sticky top-0 z-10">
          <Header />
        </div>
        
        {/* Scrollable main content */}
        <main className="flex-1 overflow-y-auto py-6 px-6 bg-gray-50">
          {user ? children : null}
        </main>
      </div>
    </div>
  );
} 
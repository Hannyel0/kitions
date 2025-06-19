'use client';

import React from 'react';
import { useAuth } from '@/app/providers/auth-provider';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';

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
    <SidebarProvider>
      <AppSidebar userType={userType} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
              <span className="text-white text-sm font-bold">K</span>
            </div>
            <span className="text-gray-800 text-sm font-medium">
              {userType === 'retailer' ? 'Retailer Dashboard' : 
               userType === 'admin' ? 'Admin Dashboard' : 
               'Distributor Dashboard'}
            </span>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">
          {user ? children : null}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
} 
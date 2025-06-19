'use client';

import React from 'react';
import { useAuth } from '@/app/providers/auth-provider';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { Menu } from 'lucide-react';

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
        <header className="flex h-16 shrink-0 items-center gap-4 border-b px-4 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          {/* Mobile Hamburger Menu */}
          <SidebarTrigger className="lg:hidden p-2">
            <Menu className=" h-6 w-6 text-gray-800" />
          </SidebarTrigger>
          
          {/* Desktop Sidebar Toggle */}
          <SidebarTrigger className="hidden lg:flex -ml-1" />
          
          {/* Header Content */}
          <div className="flex items-center gap-3 flex-1">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
              <span className="text-white text-sm font-bold">K</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-900 text-sm font-semibold leading-none">
                {userType === 'retailer' ? 'Retailer Dashboard' : 
                 userType === 'admin' ? 'Admin Dashboard' : 
                 'Distributor Dashboard'}
              </span>
              <span className="text-gray-500 text-xs mt-0.5 hidden sm:block">
                Manage your {userType === 'retailer' ? 'store' : userType === 'admin' ? 'platform' : 'distribution'} operations
              </span>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">
          {user ? children : null}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
} 
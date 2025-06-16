'use client';

import React, { useState } from 'react';
import { useAuth } from '@/app/providers/auth-provider';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

type DashboardLayoutProps = {
  children: React.ReactNode;
  userType: 'retailer' | 'distributor' | 'admin';
};

export default function DashboardLayout({ children, userType }: DashboardLayoutProps) {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar 
          userType={userType} 
          isCollapsed={false}
          onClose={() => setSidebarOpen(false)}
        />
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
        {/* Header */}
        <div className="sticky top-0 z-30">
          <Header 
            userType={userType} 
            onMenuClick={() => setSidebarOpen(true)}
          />
        </div>
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto py-4 px-4 sm:py-6 sm:px-6 bg-gray-50">
          {user ? children : null}
        </main>
      </div>
    </div>
  );
} 
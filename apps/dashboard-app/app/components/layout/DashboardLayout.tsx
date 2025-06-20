'use client';

import React from 'react';
import { useAuth } from '@/app/providers/auth-provider';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { Menu, Home, Package, Users, Settings, ShoppingCart, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type DashboardLayoutProps = {
  children: React.ReactNode;
  userType: 'retailer' | 'distributor' | 'admin';
};

// Bottom Navigation Component
function BottomNavigation({ userType }: { userType: 'retailer' | 'distributor' | 'admin' }) {
  const pathname = usePathname();

  const getNavigationItems = () => {
    const baseItems = [
      {
        icon: Home,
        label: 'Dashboard',
        path: `/${userType}/home`,
        active: pathname === `/${userType}/home`,
      },
    ];

    if (userType === 'distributor' || userType === 'admin') {
      baseItems.push(
        {
          icon: Package,
          label: 'Products',
          path: `/${userType}/products`,
          active: pathname === `/${userType}/products`,
        },
        {
          icon: ShoppingCart,
          label: 'Orders',
          path: `/${userType}/orders`,
          active: pathname === `/${userType}/orders`,
        },
        {
          icon: Users,
          label: 'Customers',
          path: `/${userType}/distributors`,
          active: pathname === `/${userType}/distributors`,
        }
      );
    } else if (userType === 'retailer') {
      baseItems.push(
        {
          icon: ShoppingCart,
          label: 'Orders',
          path: `/${userType}/orders`,
          active: pathname === `/${userType}/orders`,
        },
        {
          icon: BarChart3,
          label: 'Reports',
          path: `/${userType}/reports`,
          active: pathname === `/${userType}/reports`,
        }
      );
    }

    baseItems.push({
      icon: Settings,
      label: 'Settings',
      path: `/${userType}/settings`,
      active: pathname === `/${userType}/settings`,
    });

    return baseItems;
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="fixed bottom-4 left-6 right-6 z-50 lg:hidden">
      <nav className="bg-gray-50 rounded-xl shadow-md border border-gray-100 px-1 py-2 relative overflow-visible">
        <div className="flex items-center justify-around">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.active;

            return (
              <Link
                key={item.path}
                href={item.path}
                className="relative flex flex-col items-center justify-start min-w-0 flex-1 py-1 px-1 transition-all duration-300"
                aria-label={item.label}
              >
                {/* Icon container - same position for both active and inactive */}
                <div className="flex items-center justify-center w-5 h-5 mb-1 relative">
                  {/* Circular background for active item */}
                  {isActive && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-white rounded-full shadow-md border border-gray-50 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-gray-700 stroke-[1.5]" />
                    </div>
                  )}

                  {/* Regular icon for non-active items */}
                  {!isActive && (
                    <Icon className="w-4 h-4 text-gray-500 stroke-[1.5] hover:text-gray-600 transition-colors duration-200" />
                  )}
                </div>

                {/* Label - only show for non-active items */}
                {!isActive && (
                  <span className="text-xs font-medium text-gray-500 hover:text-gray-600 transition-all duration-300">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

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
            <Menu className="h-6 w-6 text-gray-800" />
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
        <main className="flex-1 overflow-auto p-6 pb-20 lg:pb-6">
          {user ? children : null}
        </main>
      </SidebarInset>
      
      {/* Bottom Navigation - Mobile Only */}
      <BottomNavigation userType={userType} />
    </SidebarProvider>
  );
} 
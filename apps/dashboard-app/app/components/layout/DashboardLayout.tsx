'use client';

import React from 'react';
import { useAuth } from '@/app/providers/auth-provider';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { Menu, Home, Package, Boxes, Users, Settings, ShoppingCart, BarChart3 } from 'lucide-react';
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
          icon: Boxes,
          label: 'Inventory',
          path: `/${userType}/inventory`,
          active: pathname === `/${userType}/inventory`,
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

  // Find active item index for positioning the cut-out
  const activeIndex = navigationItems.findIndex(item => item.active);
  const hasActiveItem = activeIndex !== -1;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 lg:hidden max-w-[400px] min-w-[320px] w-[90%]">
      <div className="relative">
        {/* Active item floating circle - positioned absolutely */}
        {hasActiveItem && (
          <div 
            className="absolute -top-6 w-12 h-12 bg-black rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.25)] flex items-center justify-center z-20 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
            style={{
              left: `calc(${(activeIndex + 0.5) / navigationItems.length * 100}% - 24px)`
            }}
          >
            {React.createElement(navigationItems[activeIndex].icon, {
              className: "w-6 h-6 text-white stroke-[1.5]"
            })}
          </div>
        )}

        {/* Navigation container with circular cut-out */}
        <div 
          className="bg-white rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.1)] px-4 py-3 relative overflow-visible"
          style={{
            clipPath: hasActiveItem 
              ? `polygon(0 0, ${(activeIndex + 0.5) / navigationItems.length * 100 - 6}% 0, ${(activeIndex + 0.5) / navigationItems.length * 100 - 6}% 20px, ${(activeIndex + 0.5) / navigationItems.length * 100 - 3}% 20px, ${(activeIndex + 0.5) / navigationItems.length * 100}% 0px, ${(activeIndex + 0.5) / navigationItems.length * 100 + 3}% 20px, ${(activeIndex + 0.5) / navigationItems.length * 100 + 6}% 20px, ${(activeIndex + 0.5) / navigationItems.length * 100 + 6}% 0, 100% 0, 100% 100%, 0 100%)`
              : 'none'
          }}
        >
          {/* Circular notch cut-out */}
          {hasActiveItem && (
            <div 
              className="absolute -top-3 w-8 h-8 rounded-full"
              style={{
                left: `calc(${(activeIndex + 0.5) / navigationItems.length * 100}% - 16px)`,
                background: 'transparent',
                boxShadow: 'inset 0 0 0 20px white'
              }}
            />
          )}

          <nav className="flex items-center justify-around relative" role="navigation">
            {navigationItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`relative flex flex-col items-center justify-center min-w-[44px] py-2 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group ${
                    !item.active ? 'hover:bg-gray-100/50 rounded-lg px-2' : ''
                  }`}
                  aria-label={item.label}
                >
                  {!item.active && (
                    <>
                      {/* Default state icon and label */}
                      <Icon className="w-5 h-5 text-[#CCCCCC] stroke-[1.5] group-hover:text-[#999999] transition-colors duration-200" />
                      <span className="text-xs font-normal text-[#CCCCCC] group-hover:text-[#999999] leading-[1.2] tracking-[0.5px] text-center mt-1 transition-colors duration-200">
                        {item.label}
                      </span>
                    </>
                  )}
                  
                  {/* Active state label - positioned below the cut-out */}
                  {item.active && (
                    <span className="text-xs font-medium text-[#1A1A1A] leading-[1.2] tracking-[0.5px] text-center mt-1">
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
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
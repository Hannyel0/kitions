"use client"

import React from 'react'
import {
  Home,
  // ClipboardList, // Unused import
  ShoppingCart,
  Truck,
  Users,
  FileText,
  Package,
  PackageCheck as Boxes,
  // HelpCircle, // Unused import
  Settings,
  // LogOut, // Unused import
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'


interface SidebarProps {
  userType?: 'retailer' | 'distributor' | 'admin';
  isCollapsed?: boolean;
  onClose?: () => void;
}

export function Sidebar({ userType = 'distributor', isCollapsed = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  
  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-60'} h-screen bg-white border-r border-gray-200 flex flex-col overflow-hidden transition-all duration-300`}>
      <div className="p-3 border-b border-gray-200 flex items-center justify-between">
        <Link href={`/${userType}/home`} className="block">
          <div className={`relative h-10 ${isCollapsed ? 'w-10' : 'w-32'} transition-all duration-300`}>
            <Image 
              src={isCollapsed ? "/black-logo-kitions.svg" : "/default-monochrome-black.svg"}
              alt="Kitions Logo" 
              fill
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
        </Link>
        {/* Mobile close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto">
        <nav className="py-6">
          {[
            {
              icon: <Home size={18} />,
              label: 'Home',
              path: `/${userType}/home`,
              active: pathname === `/${userType}/home`,
            },
            {
              icon: <Package size={18} />,
              label: 'Products',
              path: `/${userType}/products`,
              active: pathname === `/${userType}/products`,
            },
            {
              icon: <Boxes size={18} />,
              label: 'Inventory',
              path: `/${userType}/inventory`,
              active: pathname === `/${userType}/inventory`,
            },
            {
              icon: <ShoppingCart size={18} />,
              label: 'Orders',
              path: `/${userType}/orders`,
              active: pathname === `/${userType}/orders` || pathname.startsWith(`/${userType}/orders/`),
            },
            {
              icon: <Truck size={18} />,
              label: 'Shipment',
              path: `/${userType}/shipment`,
              active: pathname === `/${userType}/shipment`,
            },
            {
              icon: <Users size={18} />,
              label: 'Customer Management',
              path: `/${userType}/customers`,
              active: pathname === `/${userType}/customers`,
            },
            {
              icon: <FileText size={18} />,
              label: 'Reports',
              path: `/${userType}/reports`,
              active: pathname === `/${userType}/reports`,
            },
            {
              icon: <Settings size={18} />,
              label: 'Settings',
              path: `/${userType}/settings`,
              active: pathname === `/${userType}/settings`,
            },
          ].map((item, index) => (
            <Link
              key={index}
              href={item.path}
              className={`text-gray-800 flex items-center ${isCollapsed ? 'px-3 justify-center' : 'px-6'} py-3 cursor-pointer ${item.active ? 'bg-gray-100 border-l-4 border-[#8982cf]' : 'hover:bg-gray-50'} transition-all duration-300`}
              title={isCollapsed ? item.label : undefined}
              onClick={onClose}
            >
              <span
                className={`${isCollapsed ? 'mr-0' : 'mr-3'} ${item.active ? 'text-[#8982cf]' : 'text-gray-500'} transition-all duration-300`}
              >
                {item.icon}
              </span>
              {!isCollapsed && (
                <span className={`${item.active ? 'font-medium' : 'text-gray-700'} transition-all duration-300`}>
                  {item.label}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200">
          <div className="p-4 bg-gray-50 rounded-lg mb-1">
            <h3 className="text-gray-800 font-medium">Upgrade to Pro</h3>
            <p className="text-xs text-gray-500">
              Upgrade now to access advanced tools and analytics.
            </p>
            <button className="cursor-pointer text-gray-800 mt-3 w-full py-2 bg-white border border-gray-300 rounded text-sm font-medium">
              Upgrade
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

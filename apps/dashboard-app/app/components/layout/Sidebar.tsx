"use client"

import React from 'react'
import {
  Home,
  ClipboardList,
  TrendingUp,
  Truck,
  Users,
  FileText,
  Package,
  HelpCircle,
  Settings,
  LogOut,
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'


interface SidebarProps {
  userType?: 'retailer' | 'distributor' | 'admin';
}

export function Sidebar({ userType = 'distributor' }: SidebarProps) {
  const pathname = usePathname();
  
  return (
    <div className="w-60 h-screen bg-white border-r border-gray-200 flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="h-8 w-8 bg-black flex items-center justify-center">
            <div className="text-white font-bold text-lg">K</div>
          </div>
          <span className="text-gray-800 ml-2 text-xl font-bold">Kitions</span>
        </div>
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
              icon: <ClipboardList size={18} />,
              label: 'Waiting List',
              path: `/${userType}/waiting-list`,
              active: pathname === `/${userType}/waiting-list`,
            },
            {
              icon: <Package size={18} />,
              label: 'Products',
              path: `/${userType}/products`,
              active: pathname === `/${userType}/products`,
            },
            {
              icon: <TrendingUp size={18} />,
              label: 'Sales',
              path: `/${userType}/sales`,
              active: pathname === `/${userType}/sales`,
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
              icon: <HelpCircle size={18} />,
              label: 'Help Center',
              path: `/${userType}/help`,
              active: pathname === `/${userType}/help`,
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
              className={` text-gray-800 flex items-center px-6 py-3 cursor-pointer ${item.active ? 'bg-gray-100 border-l-4 border-[#8982cf]' : 'hover:bg-gray-50'}`}
            >
              <span
                className={`mr-3 ${item.active ? 'text-[#8982cf]' : 'text-gray-500'}`}
              >
                {item.icon}
              </span>
              <span className={item.active ? 'font-medium' : 'text-gray-700'}>
                {item.label}
              </span>
            </Link>
          ))}
        </nav>
      </div>
      <div className="p-4 border-t border-gray-200">
        <div className="p-4 bg-gray-50 rounded-lg mb-1">
          <h3 className="text-gray-800 font-medium">Upgrade to Pro</h3>
          <p className="text-xs text-gray-500">
            Upgrade now to access advanced tools and analytics.
          </p>
          <button className=" cursor-pointer text-gray-800 mt-3 w-full py-2 bg-white border border-gray-300 rounded text-sm font-medium">
            Upgrade
          </button>
        </div>
      </div>
    </div>
  )
}

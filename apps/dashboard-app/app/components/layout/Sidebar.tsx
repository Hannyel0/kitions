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
}

export function Sidebar({ userType = 'distributor' }: SidebarProps) {
  const pathname = usePathname();
  
  return (
    <div className="w-60 h-screen bg-white border-r border-gray-200 flex flex-col overflow-hidden">
      <div className="p-3 border-b border-gray-200">
        <Link href="/distributor/home" className="block">
          <div className="relative h-10 w-32">
            <Image 
              src="/default-monochrome-black.svg" 
              alt="Kitions Logo" 
              fill
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
        </Link>
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

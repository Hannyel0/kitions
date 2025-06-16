"use client"

import React, { useState } from 'react'
import {
  Home,
  ShoppingCart,
  Truck,
  Users,
  FileText,
  Package,
  PackageCheck as Boxes,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
  Zap,
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'


interface SidebarProps {
  userType?: 'retailer' | 'distributor' | 'admin';
  isCollapsed?: boolean;
  onClose?: () => void;
}

export function Sidebar({ userType = 'distributor', isCollapsed: externalCollapsed = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  
  // Always collapsed by default, expands on hover (except on mobile)
  const isExpanded = onClose ? !externalCollapsed : isHovered;
  
  return (
    <motion.div 
      initial={false}
      animate={{ width: isExpanded ? 240 : 70 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-screen bg-white border-r border-gray-200 flex flex-col overflow-hidden relative shadow-sm"
      onMouseEnter={() => !onClose && setIsHovered(true)}
      onMouseLeave={() => !onClose && setIsHovered(false)}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <Link href={`/${userType}/home`} className="block">
          <motion.div 
            className="relative h-8 flex items-center justify-center"
            animate={{ width: isExpanded ? 140 : 40 }}
            transition={{ duration: 0.3 }}
          >
            <Image 
              src={isExpanded ? "/default-monochrome-black.svg" : "/black-logo-kitions.svg"}
              alt="Kitions Logo" 
              width={isExpanded ? 140 : 40}
              height={32}
              style={{ objectFit: 'contain' }}
              priority
            />
          </motion.div>
        </Link>
        
        {/* Mobile close button */}
        {onClose && (
          <motion.button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <X size={20} />
          </motion.button>
        )}
      </div>
      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-3">
        <nav className="space-y-1 px-2">
          {[
            {
              icon: <Home size={20} />,
              label: 'Dashboard',
              path: `/${userType}/home`,
              active: pathname === `/${userType}/home`,
              color: 'from-blue-500 to-blue-600',
            },
            {
              icon: <Package size={20} />,
              label: 'Products',
              path: `/${userType}/products`,
              active: pathname === `/${userType}/products`,
              color: 'from-emerald-500 to-emerald-600',
            },
            {
              icon: <Boxes size={20} />,
              label: 'Inventory',
              path: `/${userType}/inventory`,
              active: pathname === `/${userType}/inventory`,
              color: 'from-amber-500 to-amber-600',
            },
            {
              icon: <ShoppingCart size={20} />,
              label: 'Orders',
              path: `/${userType}/orders`,
              active: pathname === `/${userType}/orders` || pathname.startsWith(`/${userType}/orders/`),
              color: 'from-purple-500 to-purple-600',
            },
            {
              icon: <Truck size={20} />,
              label: 'Shipments',
              path: `/${userType}/shipment`,
              active: pathname === `/${userType}/shipment`,
              color: 'from-orange-500 to-orange-600',
            },
            {
              icon: <Users size={20} />,
              label: 'Customers',
              path: `/${userType}/customers`,
              active: pathname === `/${userType}/customers`,
              color: 'from-pink-500 to-pink-600',
            },
            {
              icon: <FileText size={20} />,
              label: 'Reports',
              path: `/${userType}/reports`,
              active: pathname === `/${userType}/reports`,
              color: 'from-indigo-500 to-indigo-600',
            },
            {
              icon: <Settings size={20} />,
              label: 'Settings',
              path: `/${userType}/settings`,
              active: pathname === `/${userType}/settings`,
              color: 'from-gray-500 to-gray-600',
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href={item.path}
                className={`
                  group relative flex items-center rounded-lg transition-all duration-200
                  ${!isExpanded ? 'px-2 py-2 justify-center' : 'px-3 py-2'}
                  ${item.active 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                  }
                `}
                title={!isExpanded ? item.label : undefined}
                onClick={onClose}
              >
                {/* Active indicator */}
                {item.active && (
                  <motion.div
                    layoutId="activeTab"
                    className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-lg`}
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                
                {/* Icon with gradient background when active */}
                <div className={`
                  relative z-10 flex items-center justify-center rounded-md transition-all duration-200
                  ${item.active 
                    ? `bg-white/20 p-1.5 shadow-lg` 
                    : 'p-1.5 group-hover:bg-gray-200/50'
                  }
                  ${!isExpanded ? 'w-6 h-6' : 'w-6 h-6 mr-2'}
                `}>
                  <span className={item.active ? 'text-white' : 'text-current'}>
                    {React.cloneElement(item.icon, { size: 16 })}
                  </span>
                </div>
                
                {/* Label with animation */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className={`
                        relative z-10 font-medium text-sm transition-all duration-200
                        ${item.active ? 'text-white' : 'text-current'}
                      `}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                
                {/* Hover effect */}
                {!item.active && (
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-gray-100/0 to-gray-200/0 group-hover:from-gray-100/50 group-hover:to-gray-200/50 transition-all duration-200" />
                )}
              </Link>
            </motion.div>
          ))}
        </nav>
      </div>
      {/* Bottom Section */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 border-t border-gray-200"
          >
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-4">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-xl" />
              
              <div className="relative z-10">
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-white/20 rounded-lg mr-3">
                    <Zap size={16} className="text-white" />
                  </div>
                  <h3 className="text-white font-semibold text-sm">Upgrade to Pro</h3>
                </div>
                <p className="text-white/80 text-xs mb-4 leading-relaxed">
                  Unlock advanced analytics, unlimited products, and priority support.
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-2.5 bg-white text-slate-800 rounded-lg text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Upgrade Now
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

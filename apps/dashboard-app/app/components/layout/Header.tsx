"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Search, Bell, ChevronDown, User, Settings2, LogOut, AlertTriangle, CheckCircle, Info, Menu } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/app/providers/auth-provider'
import useUserProfile from '@/app/hooks/useUserProfile'
import ProfileAvatar from '@/app/components/user/ProfileAvatar'
import Link from 'next/link'

type HeaderProps = {
  userType?: 'retailer' | 'distributor' | 'admin';
  onMenuClick?: () => void;
};

export function Header({ userType = 'distributor', onMenuClick }: HeaderProps) {
  const { user, signOut } = useAuth();
  const { firstName, lastName, profilePictureUrl } = useUserProfile();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  
  // Sample notifications data
  const notifications = [
    {
      id: '1',
      type: 'alert',
      title: 'Low Stock Alert',
      message: 'Premium Coffee Beans is running low on stock (85 units remaining).',
      timestamp: '5 min ago',
      read: false
    },
    {
      id: '2',
      type: 'success',
      title: 'Order Completed',
      message: 'Order #1234 has been successfully delivered to Customer A.',
      timestamp: '2 hours ago',
      read: false
    },
    {
      id: '3',
      type: 'info',
      title: 'New Feature Available',
      message: 'Check out the new inventory management tools in your dashboard.',
      timestamp: 'Yesterday',
      read: true
    },
    {
      id: '4',
      type: 'alert',
      title: 'Payment Required',
      message: 'Your subscription will expire in 3 days. Please renew to avoid service interruption.',
      timestamp: '2 days ago',
      read: true
    }
  ];
  
  const unreadCount = notifications.filter((n) => !n.read).length;
  
  // Get user's name (fallback to email if name not in metadata)
  const userName = firstName || (user?.email?.split('@')[0]) || 'User';
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle size={16} className="text-yellow-500" />
      case 'success':
        return <CheckCircle size={16} className="text-green-500" />
      case 'info':
        return <Info size={16} className="text-blue-500" />
      default:
        return null
    }
  }
  
  const handleSignOut = async () => {
    await signOut();
  };
  return (
    <header className="h-16 border-b border-gray-200 bg-white px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      <div className="flex items-center">
        {/* Mobile menu button */}
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 mr-2"
          >
            <Menu size={20} />
          </button>
        )}
        
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
          <span className="text-white text-sm font-bold">K</span>
        </div>
        <span className="mx-2 text-gray-400 hidden sm:inline">/</span>
        <div className="flex items-center">
          <span className="text-gray-800 text-sm font-medium hidden sm:inline">
            {userType === 'retailer' ? 'Retailer Dashboard' : 
             userType === 'admin' ? 'Admin Dashboard' : 
             'Distributor Dashboard'}
          </span>
        </div>
      </div>
      <div className="flex items-center">
        <div className="relative mr-2 sm:mr-4 hidden md:block">
          <input
            type="text"
            placeholder="Search"
            className="pl-9 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-sm w-48 lg:w-64 placeholder-gray-400"
          />
          <Search
            size={16}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 hidden lg:inline">
            ⌘S
          </span>
        </div>
        <a
          href={process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://kitions.com'}
          className="hidden sm:flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors border border-gray-200 mr-2 sm:mr-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="hidden lg:inline">Back to Kitions</span>
        </a>
        <div className="relative mr-2 sm:mr-4" ref={notificationsRef}>
          <button
            className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
          >
            <Bell size={20} className="text-gray-600" />
            {unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">{unreadCount}</span>
              </div>
            )}
          </button>
          
          <AnimatePresence>
            {isNotificationsOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-lg border border-gray-100 z-50"
              >
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold">Notifications</h3>
                    <span className="text-xs text-gray-500">
                      {unreadCount} unread
                    </span>
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50/50' : ''}`}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900">
                              {notification.title}
                            </p>
                            <span className="text-xs text-gray-500">
                              {notification.timestamp}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {notification.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <button className="text-sm text-gray-600 hover:text-gray-900">
                      Mark all as read
                    </button>
                    <button className="text-sm text-blue-600 hover:text-blue-700">
                      View all
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="relative" ref={dropdownRef}>
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <ProfileAvatar 
              profilePictureUrl={profilePictureUrl}
              firstName={firstName}
              lastName={lastName}
              size="sm"
              className="h-8 w-8"
            />
            <span className="text-gray-800 ml-2 text-sm font-medium hidden sm:inline">{userName}</span>
            <ChevronDown 
              size={16} 
              className={`ml-1 text-gray-500 transform transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''} hidden sm:inline`} 
            />
          </div>
          
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-800">{firstName && lastName ? `${firstName} ${lastName}` : userName}</p>
                <p className="text-xs text-gray-500">
                  {user?.email || 'No email available'}
                </p>
              </div>
              <div className="py-2">
                <Link
                  href={`/${userType}/profile`}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <User size={16} className="mr-3 text-gray-400" />
                  My Profile
                </Link>
                <Link
                  href={`/${userType}/settings`}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <Settings2 size={16} className="mr-3 text-gray-400" />
                  Settings
                </Link>
                <button 
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer text-left"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setIsNotificationsOpen(true);
                  }}
                >
                  <Bell size={16} className="mr-3 text-gray-400" />
                  Notifications
                  {unreadCount > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <Link
                  href="/help-support"
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <Info size={16} className="mr-3 text-gray-400" />
                  Help/Support
                </Link>
              </div>
              <div className="py-2 border-t border-gray-100">
                <button 
                  onClick={handleSignOut}
                  className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-50 cursor-pointer text-left"
                >
                  <LogOut size={16} className="mr-3 text-red-400" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

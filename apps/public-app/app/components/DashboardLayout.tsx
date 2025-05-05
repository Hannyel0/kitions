'use client';

import React from 'react';
import { useState } from 'react';
import DashboardSidebar from './DashboardSidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  userType: 'retailer' | 'distributor' | 'admin';
}

export default function DashboardLayout({ children, userType }: DashboardLayoutProps) {
  const [userName] = useState('Hannyel Jimenez'); // This would typically come from auth context
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar userType={userType} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between h-16 px-6">
            {/* Left - Homepage link */}
            <div className="flex items-center">
              <a href="#" className="flex items-center text-gray-700 hover:text-indigo-600">
                <i className="fas fa-home text-gray-500 mr-1.5"></i>
                <span>Homepage</span>
              </a>
            </div>
            
            {/* Right - Search, notification, user menu */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <div className="flex items-center">
                  <button
                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                    className="p-1.5 text-gray-500 focus:outline-none"
                  >
                    <i className="fas fa-search"></i>
                  </button>
                  
                  {isSearchOpen && (
                    <div className="absolute top-full right-0 mt-1 w-80 bg-white rounded-lg shadow-lg overflow-hidden z-50">
                      <div className="flex items-center p-2 border-b border-gray-200">
                        <i className="fas fa-search text-gray-400 mx-2"></i>
                        <input
                          type="text"
                          placeholder="Search"
                          className="w-full px-2 py-1.5 focus:outline-none"
                          autoFocus
                        />
                        <button
                          onClick={() => setIsSearchOpen(false)}
                          className="p-1.5 text-gray-500 hover:text-gray-700"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                      <div className="p-2 text-xs text-gray-500">
                        <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded-md shadow-sm">⌘K</kbd>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Notification bell */}
              <div className="relative">
                <button
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className="p-1 text-gray-500 focus:outline-none relative"
                >
                  <i className="fas fa-bell"></i>
                  <span className="absolute top-0 right-0 h-2 w-2 bg-indigo-600 rounded-full"></span>
                </button>
                
                {isNotificationOpen && (
                  <div className="absolute top-full right-0 mt-1 w-80 bg-white rounded-lg shadow-lg overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      <div className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                            <i className="fas fa-box text-indigo-600"></i>
                          </div>
                          <div className="ml-3 flex-1">
                            <p className="text-sm text-gray-900">New order received</p>
                            <p className="text-xs text-gray-500">10 minutes ago</p>
                          </div>
                        </div>
                      </div>
                      <div className="px-4 py-3 hover:bg-gray-50">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                            <i className="fas fa-check text-green-600"></i>
                          </div>
                          <div className="ml-3 flex-1">
                            <p className="text-sm text-gray-900">Account verification complete</p>
                            <p className="text-xs text-gray-500">2 hours ago</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-2 border-t border-gray-200">
                      <a href="#" className="text-xs text-indigo-600 hover:text-indigo-800">View all notifications</a>
                    </div>
                  </div>
                )}
              </div>
              
              {/* User menu */}
              <div className="relative">
                <button 
                  className="flex items-center space-x-2 focus:outline-none"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <span className="text-sm text-gray-700">{userName}</span>
                  <i className={`fas fa-chevron-down text-xs text-gray-500 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}></i>
                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                    {userName.charAt(0)}
                  </div>
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute top-full right-0 mt-1 w-56 bg-white rounded-lg shadow-lg overflow-hidden z-50">
                    <div className="relative">
                      <a href="#" className="block px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-indigo-600 border-b border-gray-100">
                        Dashboard
                      </a>
                      <a href="#" className="block px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-indigo-600 border-b border-gray-100">
                        Profile
                      </a>
                      <a href="#" className="block px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-indigo-600 border-b border-gray-100">
                        Orders
                      </a>
                      <a href="/logout" className="block px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-indigo-600">
                        Sign out
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto py-6 px-6">
          {children}
        </main>
      </div>
    </div>
  );
} 
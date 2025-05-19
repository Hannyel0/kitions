"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Search, Bell, ChevronDown, User, Settings2, Palette, LogOut } from 'lucide-react'
import { useAuth } from '@/app/providers/auth-provider'
import useUserProfile from '@/app/hooks/useUserProfile'
import ProfileAvatar from '@/app/components/user/ProfileAvatar'
import Link from 'next/link'

export function Header() {
  const { user, signOut } = useAuth();
  const { firstName, lastName, profilePictureUrl } = useUserProfile();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Get user's name (fallback to email if name not in metadata)
  const userName = firstName || (user?.email?.split('@')[0]) || 'User';
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleSignOut = async () => {
    await signOut();
  };
  return (
    <header className="h-16 border-b border-gray-200 bg-white px-8 flex items-center justify-between">
      <div className="flex items-center">
        <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
          <span className="text-white text-sm">K</span>
        </div>
        <span className="mx-2 text-gray-400">/</span>
        <div className="flex items-center">
          <span className=" text-gray-800 text-sm font-medium">Homepage</span>
        </div>
      </div>
      <div className="flex items-center">
        <div className="relative mr-4">
          <input
            type="text"
            placeholder="Search"
            className="pl-9 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-sm w-64 placeholder-gray-400"
          />
          <Search
            size={16}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
            ⌘S
          </span>
        </div>
        <div className="flex items-center mr-4 cursor-pointer">
          <div className="relative">
            <Bell size={20} className="text-gray-600" />
            <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">1</span>
            </div>
          </div>
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
            <span className="text-gray-800 ml-2 text-sm font-medium">{userName}</span>
            <ChevronDown 
              size={16} 
              className={`ml-1 text-gray-500 transform transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
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
                  href="/distributor/profile"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <User size={16} className="mr-3 text-gray-400" />
                  Your Profile
                </Link>
                <Link
                  href="/distributor/settings"
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <Settings2 size={16} className="mr-3 text-gray-400" />
                  Account Settings
                </Link>
                <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <Palette size={16} className="mr-3 text-gray-400" />
                  Theme
                </button>
              </div>
              <div className="py-2 border-t border-gray-100">
                <button 
                  onClick={handleSignOut}
                  className="cursor-pointer  w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
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

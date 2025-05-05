'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/providers/auth-provider';
import DashboardSidebar from './DashboardSidebar';
import ProfileAvatar from './ProfileAvatar';
import useUserProfile from '@/app/hooks/useUserProfile';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, faSearch, faTimes, faChevronDown, 
  faBox, faCheck, faBell, faUser, faSignOutAlt, 
  faClipboardList, faCog, faQuestionCircle 
} from '@fortawesome/free-solid-svg-icons';

// Animation variants for dropdown menus
const dropdownVariants = {
  hidden: { 
    opacity: 0, 
    y: -20,
    scale: 0.95,
    transition: { 
      duration: 0.2,
      ease: "easeInOut"
    }
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { 
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0, 
    y: -10,
    scale: 0.95,
    transition: { 
      duration: 0.2,
      ease: "easeInOut"
    }
  }
};

type DashboardLayoutProps = {
  children: React.ReactNode;
  userType: 'retailer' | 'distributor' | 'admin';
};

export default function DashboardLayout({ children, userType }: DashboardLayoutProps) {
  const { user, signOut, loading: authLoading } = useAuth();
  const { firstName, lastName, profilePictureUrl, loading: profileLoading } = useUserProfile();
  
  const loading = authLoading || profileLoading;

  const derivedUserName = React.useMemo(() => {
    if (loading) return 'Loading...';
    if (!user) return 'Guest';
    if (firstName && lastName) return `${firstName} ${lastName}`;
    if (firstName) return firstName;
    return user.email || 'User';
  }, [user, loading, firstName, lastName]);

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  const handleSignOutClick = async () => {
    setIsUserMenuOpen(false);
    await signOut();
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
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
                <FontAwesomeIcon icon={faHome} className="text-gray-500 mr-1.5" />
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
                    <FontAwesomeIcon icon={faSearch} />
                  </button>
                  
                  <AnimatePresence>
                    {isSearchOpen && (
                      <motion.div 
                        className="absolute top-full right-0 mt-1 w-80 bg-white rounded-lg shadow-lg overflow-hidden z-50"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={dropdownVariants}
                      >
                        <div className="flex items-center p-2 border-b border-gray-200">
                          <FontAwesomeIcon icon={faSearch} className="text-gray-400 mx-2" />
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
                            <FontAwesomeIcon icon={faTimes} />
                          </button>
                        </div>
                        <div className="p-2 text-xs text-gray-500">
                          <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded-md shadow-sm">⌘K</kbd>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              
              {/* Notification bell */}
              <div className="relative">
                <button
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className="p-1 text-gray-500 focus:outline-none relative"
                >
                  <FontAwesomeIcon icon={faBell} />
                  <span className="absolute top-0 right-0 h-2 w-2 bg-indigo-600 rounded-full"></span>
                </button>
                
                <AnimatePresence>
                  {isNotificationOpen && (
                    <motion.div 
                      className="absolute top-full right-0 mt-1 w-80 bg-white rounded-lg shadow-lg overflow-hidden z-50"
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={dropdownVariants}
                    >
                      <div className="px-4 py-3 border-b border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        <div className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                              <FontAwesomeIcon icon={faBox} className="text-indigo-600" />
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
                              <FontAwesomeIcon icon={faCheck} className="text-green-600" />
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* User menu */}
              <div className="relative">
                <button 
                  className="flex items-center space-x-2 focus:outline-none"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  disabled={!user}
                >
                  <span className="text-sm text-gray-700">{derivedUserName}</span>
                  <FontAwesomeIcon 
                    icon={faChevronDown} 
                    className={`text-xs text-gray-500 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}
                  />
                  <ProfileAvatar 
                    profilePictureUrl={profilePictureUrl}
                    firstName={firstName}
                    lastName={lastName}
                    size="sm"
                  />
                </button>
                
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div 
                      className="absolute top-full right-0 mt-1 w-56 bg-white rounded-lg shadow-lg overflow-hidden z-50"
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={dropdownVariants}
                    >
                      <div className="relative">
                        <Link 
                          href={`/${userType}/home`}
                          className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-indigo-600 border-b border-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <FontAwesomeIcon icon={faHome} className="mr-3 w-4 text-gray-500" />
                          Dashboard
                        </Link>
                        <Link 
                          href={`/${userType}/profile`}
                          className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-indigo-600 border-b border-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <FontAwesomeIcon icon={faUser} className="mr-3 w-4 text-gray-500" />
                          Profile
                        </Link>
                        <Link 
                          href={`/${userType}/orders`}
                          className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-indigo-600 border-b border-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <FontAwesomeIcon icon={faClipboardList} className="mr-3 w-4 text-gray-500" />
                          Orders
                        </Link>
                        <Link 
                          href={`/${userType}/settings`}
                          className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-indigo-600 border-b border-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <FontAwesomeIcon icon={faCog} className="mr-3 w-4 text-gray-500" />
                          Settings
                        </Link>
                        <Link 
                          href="/help"
                          className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-indigo-600 border-b border-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <FontAwesomeIcon icon={faQuestionCircle} className="mr-3 w-4 text-gray-500" />
                          Help
                        </Link>
                        <button 
                          onClick={handleSignOutClick}
                          className="flex items-center w-full text-left px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                        >
                          <FontAwesomeIcon icon={faSignOutAlt} className="mr-3 w-4 text-gray-500" />
                          Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto py-6 px-6">
          {user ? children : null}
        </main>
      </div>
    </div>
  );
} 
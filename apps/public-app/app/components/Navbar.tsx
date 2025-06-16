'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../providers/auth-provider';
import { createSupabaseBrowserClient } from '../utils/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ProfileAvatar from './ProfileAvatar';
import { 
  faHome, faChevronDown, faSignOutAlt, 
  faShoppingCart, faStore, faBox, faBlog, 
  faUserCircle, faSignIn, faBars, faTimes,
  faGlobe, faLaptopCode
} from '@fortawesome/free-solid-svg-icons';

// Animation variants for dropdown menus
const dropdownVariants = {
  hidden: { 
    opacity: 0, 
    y: -10,
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
    y: -5,
    scale: 0.95,
    transition: { 
      duration: 0.2,
      ease: "easeInOut"
    }
  }
};

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [profilePicUrl, setProfilePicUrl] = useState('');
  const [userRole, setUserRole] = useState('');
  
  const resourcesDropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { user, loading, signOut } = useAuth();

  // Helper function to get the Websites app URL based on environment
  const getWebsitesAppUrl = () => {
    if (process.env.NODE_ENV === 'development') {
      return 'http://localhost:3002';
    }
    return 'https://websites.kitions.com';
  };

  // Helper function to get the Website Creation Service URL based on environment
  const getWebsiteCreationServiceUrl = () => {
    if (process.env.NODE_ENV === 'development') {
      return 'http://localhost:3002/';
    }
    return 'https://websites.kitions.com/';
  };

  // Fetch user details when user is authenticated
  useEffect(() => {
    async function fetchUserDetails() {
      if (user) {
        try {
          const supabase = createSupabaseBrowserClient();
          const { data, error } = await supabase
            .from('users')
            .select('first_name, last_name, profile_picture_url, role')
            .eq('id', user.id)
            .single();
            
          if (data && !error) {
            setUserName(`${data.first_name} ${data.last_name}`);
            setProfilePicUrl(data.profile_picture_url || '');
            setUserRole(data.role || '');
          } else if (error) {
            console.log('User details not found in database yet, using auth metadata');
            // Fallback to user metadata if database record doesn't exist yet
            const metadata = user.user_metadata;
            if (metadata) {
              setUserName(`${metadata.first_name || ''} ${metadata.last_name || ''}`.trim());
              setUserRole(metadata.role || '');
            }
          }
        } catch (err) {
          console.error('Error fetching user details:', err);
          // Fallback to user metadata
          const metadata = user.user_metadata;
          if (metadata) {
            setUserName(`${metadata.first_name || ''} ${metadata.last_name || ''}`.trim());
            setUserRole(metadata.role || '');
          }
        }
      }
    }
    
    fetchUserDetails();
  }, [user]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (resourcesDropdownRef.current && !resourcesDropdownRef.current.contains(event.target as Node)) {
        setIsResourcesOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setIsUserMenuOpen(false);
  };

  // Get the dashboard URL based on user role
  const getDashboardUrl = () => {
    let path = '/'; // Default path
    if (userRole === 'retailer') path = '/retailer/home';
    else if (userRole === 'distributor') path = '/distributor/home';
    else if (userRole === 'admin') path = '/admin/home';

    // Return the correct dashboard URL based on environment
    if (process.env.NODE_ENV === 'development') {
      return `http://localhost:3001${path}`;
    }
    return `https://dashboard.kitions.com${path}`;
  };

  return (
    <nav className="w-full px-3 sm:px-4 md:px-8 lg:px-16 py-3 flex items-center justify-between bg-white/80 backdrop-blur-xl border-b border-gray-200/50 fixed top-0 left-0 right-0 z-50 shadow-sm">
      {/* Logo Section */}
      <div className="flex items-center">
        <Link href="/" className="flex items-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 451 90" 
            className="h-6 sm:h-7 w-auto"
          >
            <g id="bd2d34dc-d0db-4587-b0c2-6aff471e143b" fill="#8982cf" transform="matrix(5.529953722625812,0,0,5.529953722625812,168.68250220721873,0.9953910539748669)">
              <path d="M6.71 5.94L9.97 10.50L6.82 10.50L4.17 6.85L3.51 6.85L3.51 10.50L0.91 10.50L0.91 1.34L3.51 1.34L3.51 5.00L4.19 5.00L6.69 1.34L9.87 1.34L6.71 5.94ZM13.75 10.50L11.23 10.50L11.23 3.22L13.75 3.22L13.75 10.50ZM13.73 1.04L13.73 1.04Q13.73 1.30 13.64 1.53Q13.54 1.76 13.37 1.93Q13.20 2.10 12.98 2.20Q12.75 2.30 12.50 2.30L12.50 2.30Q11.97 2.30 11.61 1.93Q11.24 1.57 11.24 1.04L11.24 1.04Q11.24 0.78 11.34 0.56Q11.44 0.34 11.61 0.17Q11.77 0.01 12.01-0.08Q12.24-0.18 12.50-0.18L12.50-0.18Q13.01-0.18 13.37 0.17Q13.73 0.53 13.73 1.04ZM19.54 8.97L19.54 8.97Q19.74 8.97 19.94 8.96Q20.13 8.95 20.29 8.92L20.29 8.92Q20.47 8.89 20.64 8.85L20.64 8.85L20.61 10.43Q20.37 10.49 20.10 10.54L20.10 10.54Q19.87 10.58 19.55 10.62Q19.24 10.65 18.87 10.65L18.87 10.65Q18.17 10.61 17.61 10.36L17.61 10.36Q17.37 10.25 17.15 10.08Q16.93 9.91 16.75 9.66Q16.58 9.41 16.47 9.08Q16.37 8.75 16.37 8.30L16.37 8.30L16.37 5.53L14.94 5.53L14.94 3.75L16.41 3.75L16.86 1.46L18.87 1.46L18.87 3.75L20.66 3.75L20.66 5.53L18.90 5.53L18.90 8.33Q18.93 8.68 19.09 8.83Q19.25 8.97 19.54 8.97ZM24.51 10.50L21.99 10.50L21.99 3.22L24.51 3.22L24.51 10.50ZM24.50 1.04L24.50 1.04Q24.50 1.30 24.40 1.53Q24.30 1.76 24.14 1.93Q23.97 2.10 23.74 2.20Q23.52 2.30 23.27 2.30L23.27 2.30Q22.74 2.30 22.37 1.93Q22.01 1.57 22.01 1.04L22.01 1.04Q22.01 0.78 22.11 0.56Q22.20 0.34 22.37 0.17Q22.54 0.01 22.77-0.08Q23.00-0.18 23.27-0.18L23.27-0.18Q23.77-0.18 24.14 0.17Q24.50 0.53 24.50 1.04ZM30.24 3.04L30.24 3.04Q30.87 3.04 31.63 3.21Q32.38 3.39 33.03 3.83Q33.68 4.27 34.12 5.01Q34.55 5.75 34.55 6.89L34.55 6.89Q34.55 8.02 34.12 8.75Q33.68 9.48 33.03 9.90Q32.38 10.32 31.63 10.49Q30.87 10.65 30.24 10.65L30.24 10.65Q29.61 10.65 28.87 10.49Q28.13 10.32 27.49 9.90Q26.85 9.48 26.42 8.75Q25.98 8.02 25.98 6.89L25.98 6.89Q25.98 6.13 26.19 5.56Q26.39 4.98 26.72 4.56Q27.05 4.13 27.49 3.84Q27.93 3.54 28.40 3.37Q28.87 3.19 29.34 3.12Q29.82 3.04 30.24 3.04ZM30.24 8.90L30.24 8.90Q31.01 8.90 31.46 8.46Q31.91 8.01 31.91 6.89L31.91 6.89Q31.91 5.75 31.47 5.27Q31.02 4.79 30.24 4.79L30.24 4.79Q29.46 4.79 29.04 5.27Q28.63 5.75 28.63 6.89L28.63 6.89Q28.63 8.01 29.04 8.46Q29.46 8.90 30.24 8.90ZM40.40 3.04L40.40 3.04Q40.96 3.04 41.52 3.15Q42.07 3.26 42.51 3.61Q42.95 3.96 43.23 4.61Q43.51 5.26 43.51 6.33L43.51 6.33L43.51 10.50L41.17 10.50L41.17 7.17Q41.17 6.13 40.84 5.59Q40.50 5.05 39.87 5.05L39.87 5.05Q39.42 5.05 39.12 5.25Q38.81 5.45 38.62 5.80Q38.43 6.15 38.35 6.62Q38.26 7.08 38.26 7.64L38.26 7.64L38.26 10.50L35.74 10.50L35.74 3.22L37.63 3.22L38.05 4.56Q38.05 4.56 38.18 4.33Q38.30 4.09 38.58 3.80Q38.86 3.51 39.31 3.28Q39.76 3.04 40.40 3.04ZM48.01 3.02L48.01 3.02Q48.68 3.02 49.37 3.21Q50.06 3.39 50.74 3.81L50.74 3.81L49.88 5.21Q49.77 5.14 49.53 5.03Q49.29 4.93 49.01 4.84Q48.72 4.75 48.41 4.69Q48.09 4.63 47.84 4.66Q47.59 4.69 47.43 4.82Q47.26 4.94 47.26 5.22L47.26 5.22Q47.26 5.43 47.59 5.57Q47.92 5.71 48.34 5.85L48.34 5.85Q48.76 5.98 49.21 6.16Q49.66 6.34 50.03 6.62Q50.40 6.90 50.64 7.31Q50.88 7.73 50.88 8.33L50.88 8.33Q50.88 8.95 50.63 9.39Q50.39 9.83 49.98 10.11Q49.57 10.39 49.03 10.53Q48.48 10.67 47.89 10.67L47.89 10.67Q47.08 10.67 46.23 10.44Q45.37 10.22 44.70 9.65L44.70 9.65L45.57 8.16Q45.72 8.33 46.00 8.48Q46.27 8.64 46.59 8.75Q46.90 8.86 47.24 8.92Q47.57 8.97 47.84 8.95Q48.10 8.92 48.28 8.81Q48.45 8.69 48.45 8.46L48.45 8.46Q48.45 8.13 48.20 7.94Q47.95 7.74 47.57 7.59Q47.19 7.45 46.75 7.31Q46.30 7.17 45.92 6.93Q45.54 6.69 45.29 6.31Q45.04 5.94 45.04 5.33L45.04 5.33Q45.04 4.73 45.29 4.30Q45.54 3.86 45.96 3.58Q46.38 3.29 46.91 3.16Q47.45 3.02 48.01 3.02Z"></path>
            </g>
            <defs>
              <linearGradient gradientTransform="rotate(25)" id="cf3a6857-a14f-4c19-9e1c-8fb15bdb8c2d" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8982cf" stopOpacity="1"></stop>
                <stop offset="100%" stopColor="#dbc1d0" stopOpacity="1"></stop>
              </linearGradient>
            </defs>
            <g id="94ab25f2-641f-4f0f-9189-ad53a45f0aeb" transform="matrix(4.803586662404586,0,0,4.803586662404586,0.14261340152661717,-31.22538662899096)" stroke="none" fill="url(#cf3a6857-a14f-4c19-9e1c-8fb15bdb8c2d)">
              <path d="M16 19.586l7.496-12.954H8.504zM7.496 12.414L0 25.368h14.992zM24.504 12.414l-7.496 12.954H32z"></path>
            </g>
          </svg>
        </Link>
        
        {/* Desktop Navigation Links */}
        <div className="ml-8 sm:ml-12 hidden lg:flex items-center space-x-1">
          <Link href="/for-retailers" className="relative group px-4 py-2 rounded-lg text-gray-700 font-medium hover:text-[#8982cf] transition-all duration-300">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faStore} className="w-4 h-4" />
              <span>For Retailers</span>
            </div>
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-[#8982cf]/5 to-[#ABD4AB]/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
          </Link>
          
          <Link href="/for-distributors" className="relative group px-4 py-2 rounded-lg text-gray-700 font-medium hover:text-[#ABD4AB] transition-all duration-300">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faBox} className="w-4 h-4" />
              <span>For Distributors</span>
            </div>
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-[#ABD4AB]/5 to-[#8982cf]/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
          </Link>
          
          {/* Elegant Separator */}
          <div className="h-6 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent mx-3" />
          
          {/* Resources Dropdown */}
          <div className="relative" ref={resourcesDropdownRef}>
            <motion.button 
              className="relative group px-4 py-2 rounded-lg text-gray-700 font-medium hover:text-[#8982cf] transition-all duration-300 flex items-center gap-2"
              onClick={() => setIsResourcesOpen(!isResourcesOpen)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Resources</span>
              <FontAwesomeIcon 
                icon={faChevronDown} 
                className={`w-3 h-3 transition-transform duration-300 ${isResourcesOpen ? 'rotate-180' : ''}`}
              />
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-[#8982cf]/5 to-[#ABD4AB]/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            </motion.button>
            
            <AnimatePresence>
              {isResourcesOpen && (
                <motion.div 
                  className="absolute top-full mt-2 left-0 w-80 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden z-50"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={dropdownVariants}
                >
                  <div className="p-6 space-y-4">
                    <Link 
                      href="/blog" 
                      className="group flex items-start p-4 rounded-xl hover:bg-gradient-to-r hover:from-[#8982cf]/5 hover:to-[#ABD4AB]/5 transition-all duration-300"
                      onClick={() => setIsResourcesOpen(false)}
                    >
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#8982cf]/10 to-[#7873b3]/10 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                        <FontAwesomeIcon icon={faBlog} className="w-5 h-5 text-[#8982cf]" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-gray-900 mb-1 group-hover:text-[#8982cf] transition-colors">Blog</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">Latest insights and trends in the food industry</p>
                      </div>
                    </Link>
                    
                    <a 
                      href={getWebsitesAppUrl()} 
                      className="group flex items-start p-4 rounded-xl hover:bg-gradient-to-r hover:from-[#ABD4AB]/5 hover:to-[#9BC49B]/5 transition-all duration-300"
                    >
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#ABD4AB]/10 to-[#9BC49B]/10 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                        <FontAwesomeIcon icon={faGlobe} className="w-5 h-5 text-[#ABD4AB]" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-gray-900 mb-1 group-hover:text-[#ABD4AB] transition-colors">Website Builder</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">Create beautiful websites for your business</p>
                      </div>
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      {/* Right Side - Auth & User Menu */}
      <div className="flex items-center space-x-4">
        {loading ? (
          <div className="animate-pulse flex space-x-2">
            <div className="h-10 w-20 bg-gray-200 rounded-lg"></div>
            <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
          </div>
        ) : user ? (
          <>
            {/* Dashboard Button */}
            <motion.a
              href={getDashboardUrl()}
              className="hidden md:flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#8982cf] via-[#8982cf] to-[#8982cf]/90  text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Dashboard</span>
              <FontAwesomeIcon icon={faHome} className="w-4 h-4" />
            </motion.a>
            
            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <motion.button 
                className="flex items-center gap-3 p-2 pr-4 rounded-lg hover:bg-gray-50 border border-gray-200/50 transition-all duration-300 group"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ProfileAvatar 
                  firstName={userName?.split(' ')[0]}
                  lastName={userName?.split(' ')[1]}
                  email={user?.email}
                  profilePictureUrl={profilePicUrl}
                  size="sm"
                />
                <div className="hidden md:flex items-center gap-2">
                  <span className="text-gray-700 font-medium group-hover:text-[#8982cf] transition-colors">
                    {userName?.split(' ')[0]}
                  </span>
                  <FontAwesomeIcon 
                    icon={faChevronDown} 
                    className={`w-3 h-3 text-gray-500 transition-all duration-300 ${isUserMenuOpen ? 'rotate-180 text-[#8982cf]' : ''}`}
                  />
                </div>
              </motion.button>
            
              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    className="absolute top-full mt-2 right-0 w-56 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden z-50"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={dropdownVariants}
                  >
                    <div className="p-4 space-y-2">
                      <a 
                        href={process.env.NODE_ENV === 'development' ? 'http://localhost:3001/profile' : '/profile'} 
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-[#8982cf] hover:bg-gradient-to-r hover:from-[#8982cf]/5 hover:to-transparent rounded-lg transition-all duration-300 group"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <FontAwesomeIcon icon={faUserCircle} className="w-4 h-4 text-gray-500 group-hover:text-[#8982cf]" />
                        <span>Profile</span>
                      </a>
                      <a 
                        href={process.env.NODE_ENV === 'development' ? 'http://localhost:3001/orders' : '/orders'} 
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-[#ABD4AB] hover:bg-gradient-to-r hover:from-[#ABD4AB]/5 hover:to-transparent rounded-lg transition-all duration-300 group"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <FontAwesomeIcon icon={faShoppingCart} className="w-4 h-4 text-gray-500 group-hover:text-[#ABD4AB]" />
                        <span>Orders</span>
                      </a>
                      <div className="border-t border-gray-200/50 my-2"></div>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-300 w-full text-left group"
                      >
                        <FontAwesomeIcon icon={faSignOutAlt} className="w-4 h-4 text-gray-500 group-hover:text-red-500" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        ) : (
          <>
            <Link href="/login/" className="hidden md:flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-[#8982cf] font-medium rounded-lg transition-all duration-300">
              <FontAwesomeIcon icon={faSignIn} className="w-4 h-4" />
              <span>Login</span>
            </Link>
            <Link 
              href="/signup/" 
              className="bg-[#8982cf] text-white font-medium px-5 py-2.5 rounded-full hover:bg-[#7873b3] transition-colors shadow-sm border border-[#7873b3] flex items-center"
            >
              Sell now
            </Link>
          </>
        )}
        
        {/* Mobile menu button */}
        <motion.button
          type="button"
          className="lg:hidden p-2 text-gray-700 hover:text-[#8982cf] hover:bg-gray-50 rounded-lg transition-all duration-300"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} className="h-5 w-5" />
        </motion.button>
      </div>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl shadow-xl border-b border-gray-200/50 lg:hidden z-40"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={dropdownVariants}
          >
            <div className="px-6 py-6 space-y-4">
              <Link 
                href="/for-retailers" 
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-[#8982cf] hover:bg-gradient-to-r hover:from-[#8982cf]/5 hover:to-transparent rounded-lg transition-all duration-300 group"
                onClick={() => setIsMenuOpen(false)}
              >
                <FontAwesomeIcon icon={faStore} className="w-5 h-5 text-gray-500 group-hover:text-[#8982cf]" />
                <span className="font-medium">For Retailers</span>
              </Link>
              <Link 
                href="/for-distributors" 
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-[#ABD4AB] hover:bg-gradient-to-r hover:from-[#ABD4AB]/5 hover:to-transparent rounded-lg transition-all duration-300 group"
                onClick={() => setIsMenuOpen(false)}
              >
                <FontAwesomeIcon icon={faBox} className="w-5 h-5 text-gray-500 group-hover:text-[#ABD4AB]" />
                <span className="font-medium">For Distributors</span>
              </Link>
              
              <div className="border-t border-gray-200/50 my-4"></div>
              
              {/* Mobile Resources */}
              <div>
                <button 
                  className="flex items-center justify-between w-full px-4 py-3 text-gray-700 hover:text-[#8982cf] hover:bg-gradient-to-r hover:from-[#8982cf]/5 hover:to-transparent rounded-lg transition-all duration-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsResourcesOpen(!isResourcesOpen);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium">Resources</span>
                  </div>
                  <FontAwesomeIcon 
                    icon={faChevronDown} 
                    className={`w-4 h-4 transition-transform ${isResourcesOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                <AnimatePresence>
                  {isResourcesOpen && (
                    <motion.div 
                      className="mt-2 ml-4 space-y-2"
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={dropdownVariants}
                    >
                      <Link 
                        href="/blog" 
                        className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-[#8982cf] hover:bg-gradient-to-r hover:from-[#8982cf]/5 hover:to-transparent rounded-lg transition-all duration-300"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <FontAwesomeIcon icon={faBlog} className="w-4 h-4 text-[#8982cf]" />
                        <span>Blog</span>
                      </Link>
                      <a 
                        href={getWebsitesAppUrl()} 
                        className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-[#ABD4AB] hover:bg-gradient-to-r hover:from-[#ABD4AB]/5 hover:to-transparent rounded-lg transition-all duration-300"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <FontAwesomeIcon icon={faGlobe} className="w-4 h-4 text-[#ABD4AB]" />
                        <span>Website Builder</span>
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {user ? (
                <>
                  <div className="border-t border-gray-200/50 my-4"></div>
                  <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-[#8982cf]/5 to-[#ABD4AB]/5 rounded-lg">
                    <ProfileAvatar 
                      firstName={userName?.split(' ')[0]}
                      lastName={userName?.split(' ')[1]}
                      email={user?.email}
                      profilePictureUrl={profilePicUrl}
                      size="sm"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">{userName}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  
                  <Link 
                    href={getDashboardUrl()} 
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-[#8982cf] hover:bg-gradient-to-r hover:from-[#8982cf]/5 hover:to-transparent rounded-lg transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FontAwesomeIcon icon={faHome} className="w-5 h-5 text-gray-500" />
                    <span className="font-medium">Dashboard</span>
                  </Link>
                  
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-300 w-full text-left"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="w-5 h-5 text-gray-500" />
                    <span className="font-medium">Sign out</span>
                  </button>
                </>
              ) : (
                <>
                  <div className="border-t border-gray-200/50 my-4"></div>
                  <Link 
                    href="/login/" 
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-[#8982cf] hover:bg-gradient-to-r hover:from-[#8982cf]/5 hover:to-transparent rounded-lg transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FontAwesomeIcon icon={faSignIn} className="w-5 h-5 text-gray-500" />
                    <span className="font-medium">Login</span>
                  </Link>
                  <Link 
                    href="/signup/" 
                    className="flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-[#8982cf] to-[#ABD4AB] text-white font-semibold rounded-lg shadow-lg transition-all duration-300 mt-4"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FontAwesomeIcon icon={faStore} className="w-5 h-5" />
                    <span>Start Selling Now</span>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
} 
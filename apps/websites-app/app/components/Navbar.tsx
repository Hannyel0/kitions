'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChevronDown, 
  faLaptopCode, 
  faImages,
  faEnvelope,
  faBars, 
  faTimes,
  faStore,
  faTools,
  faGlobe,
  faQuestionCircle,
  faBlog
} from '@fortawesome/free-solid-svg-icons';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import LanguageSwitcher from './LanguageSwitcher';

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

// Custom hook to handle client-side only rendering
function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false);
  
  useEffect(() => {
    setHasMounted(true);
  }, []);
  
  return hasMounted;
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  
  const servicesDropdownRef = useRef<HTMLDivElement | null>(null);
  const t = useTranslations('common.nav');
  const router = useRouter();
  const pathname = usePathname();
  const hasMounted = useHasMounted();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (servicesDropdownRef.current && !servicesDropdownRef.current.contains(event.target as Node)) {
        setIsServicesOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Helper function to get the Kitions app URL based on environment
  const getKitionsAppUrl = () => {
    if (process.env.NODE_ENV === 'development') {
      return 'http://localhost:3000';
    }
    return 'https://kitions.com';
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsMenuOpen(false);
    setIsServicesOpen(false);
  };

  return (
    <nav className="w-full px-4 md:px-16 py-3 flex items-center justify-between bg-white/95 backdrop-blur-sm shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center">
        <button onClick={() => handleNavigation('/')} className="flex items-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 451 90" 
            className="h-7 w-auto"
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
          <span className="ml-2 font-bold text-gray-800">Websites</span>
        </button>
        <div className="ml-16 hidden md:flex space-x-6">
          <button 
            onClick={() => handleNavigation('/')} 
            className="text-gray-700 font-semibold hover:text-[#8982cf] flex items-center"
          >
            {t('home')}
          </button>
          <div className="relative pl-2" ref={servicesDropdownRef}>
            {/* Use a static structure during SSR to prevent hydration errors */}
            {!hasMounted ? (
              <div className="text-gray-700 font-semibold flex items-center">
                <FontAwesomeIcon icon={faLaptopCode} className="mr-2" />
                {t('services')}
                <FontAwesomeIcon 
                  icon={faChevronDown} 
                  className="ml-1 h-4 w-4"
                />
              </div>
            ) : (
              <button 
                className="cursor-pointer text-gray-700 font-semibold hover:text-[#8982cf] flex items-center"
                onClick={() => setIsServicesOpen(!isServicesOpen)}
              >
                <FontAwesomeIcon icon={faLaptopCode} className="mr-2" />
                {t('services')}
                <FontAwesomeIcon 
                  icon={faChevronDown} 
                  className={`ml-1 h-4 w-4 transition-transform ${isServicesOpen ? 'rotate-180' : ''}`}
                />
              </button>
            )}
            {hasMounted && isServicesOpen && (
              <motion.div 
                className="absolute z-50 w-[400px] bg-white rounded-xl shadow-lg overflow-hidden p-6 top-full left-0"
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-6">
                  {/* Kitions Platform Option */}
                  <div className="group">
                    <button
                      onClick={() => {
                        window.open('https://kitions.com', '_blank');
                        setIsServicesOpen(false);
                      }}
                      className="flex items-start p-3 rounded-lg hover:bg-gray-50 w-full text-left group-hover:bg-[#f9f8ff] transition-colors"
                    >
                      <div className="bg-[#f5f3ff] p-3 rounded-lg mr-4 group-hover:bg-[#eceafd] transition-colors">
                        <FontAwesomeIcon icon={faStore} className="h-6 w-6 text-[#8982cf]" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-1">Kitions Platform</h4>
                        <p className="text-sm text-gray-600">Connect your retail business with premium e-commerce solutions.</p>
                      </div>
                    </button>
                  </div>
                  
                  {/* FAQ Option */}
                  <div className="group">
                    <button
                      onClick={() => {
                        handleNavigation('/faq');
                        setIsServicesOpen(false);
                      }}
                      className="flex items-start p-3 rounded-lg hover:bg-gray-50 w-full text-left group-hover:bg-[#f9f8ff] transition-colors"
                    >
                      <div className="bg-[#f5f3ff] p-3 rounded-lg mr-4 group-hover:bg-[#eceafd] transition-colors">
                        <FontAwesomeIcon icon={faQuestionCircle} className="h-6 w-6 text-[#8982cf]" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-1">FAQ</h4>
                        <p className="text-sm text-gray-600">Find answers to common questions about our services.</p>
                      </div>
                    </button>
                  </div>
                  
                  {/* Blog Option */}
                  <div className="group">
                    <button
                      onClick={() => {
                        handleNavigation('/blog');
                        setIsServicesOpen(false);
                      }}
                      className="flex items-start p-3 rounded-lg hover:bg-gray-50 w-full text-left group-hover:bg-[#f9f8ff] transition-colors"
                    >
                      <div className="bg-[#f5f3ff] p-3 rounded-lg mr-4 group-hover:bg-[#eceafd] transition-colors">
                        <FontAwesomeIcon icon={faBlog} className="h-6 w-6 text-[#8982cf]" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-1">Blog</h4>
                        <p className="text-sm text-gray-600">Read our latest articles about retail industry trends and strategies.</p>
                      </div>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      
      <div className="hidden md:flex items-center">
        <button 
          onClick={() => handleNavigation('/contact')}
          className="cursor-pointer ml-6 inline-flex items-center justify-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-[#8982cf] hover:bg-[#7269c0]"
        >
          <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
          {t('contact')}
        </button>
        <LanguageSwitcher />
      </div>
      
      {/* Mobile menu button */}
      <div className="md:hidden flex items-center">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-[#8982cf] focus:outline-none"
        >
          <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} className="h-6 w-6" />
        </button>
      </div>
      
      {/* Mobile menu */}
      {hasMounted && (
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-4 pt-2 pb-4 space-y-3">
                <button 
                  onClick={() => handleNavigation('/')}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#8982cf] hover:bg-gray-50"
                >
                  {t('home')}
                </button>
                <div>
                  <button
                    onClick={() => setIsServicesOpen(!isServicesOpen)}
                    className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#8982cf] hover:bg-gray-50"
                  >
                    <FontAwesomeIcon icon={faLaptopCode} className="mr-2" />
                    {t('services')}
                    <FontAwesomeIcon 
                      icon={faChevronDown} 
                      className={`ml-auto h-4 w-4 transition-transform ${isServicesOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {isServicesOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pl-6"
                    >
                      <a 
                        href="https://kitions.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-3 py-2 text-sm text-gray-700 hover:text-[#8982cf]"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Kitions Platform
                      </a>
                      <button 
                        onClick={() => {
                          handleNavigation('/faq');
                          setIsMenuOpen(false);
                        }}
                        className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:text-[#8982cf]"
                      >
                        FAQ
                      </button>
                      <button 
                        onClick={() => {
                          handleNavigation('/blog');
                          setIsMenuOpen(false);
                        }}
                        className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:text-[#8982cf]"
                      >
                        Blog
                      </button>
                    </motion.div>
                  )}
                </div>
                <button 
                  onClick={() => handleNavigation('/contact')}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-[#8982cf] hover:bg-[#7269c0]"
                >
                  <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                  {t('contact')}
                </button>
                <div className="px-3 py-2">
                  <LanguageSwitcher />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </nav>
  );
} 
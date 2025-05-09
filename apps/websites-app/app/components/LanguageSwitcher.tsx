'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useTransition, useState, useRef, useEffect } from 'react';
import { locales } from '../../next-intl.config';
import { motion, AnimatePresence } from 'framer-motion';

// Map locale codes to display text
const localeLabels: Record<string, string> = {
  'en': 'ENG',
  'es': 'ESP',
};

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const switchLocale = (newLocale: string) => {
    if (newLocale === locale) {
      setIsOpen(false);
      return;
    }

    const segments = pathname.split('/');

    // Replace the current locale in the URL
    if (segments[1] && locales.includes(segments[1] as typeof locales[number])) {
      segments[1] = newLocale;
    } else {
      // Just in case locale is missing in the path (rare edge case)
      segments.splice(1, 0, newLocale);
    }

    const newPath = segments.join('/') || '/';

    startTransition(() => {
      router.replace(newPath);
      setIsOpen(false);
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className="px-4 py-2 text-lg font-medium flex items-center cursor-pointer"
      >
        {localeLabels[locale] || 'EST'}
        <svg 
          className={`ml-2 w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Dropdown menu with animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-36 bg-white shadow-lg rounded-md overflow-hidden z-50"
          >
            {locales.map((code) => (
              <button
                key={code}
                onClick={() => switchLocale(code)}
                disabled={isPending}
                className={`w-full text-left px-4 py-3 font-medium ${
                  locale === code 
                    ? 'text-blue-600 bg-white' 
                    : 'text-gray-400 hover:bg-gray-50'
                }`}
              >
                {localeLabels[code] || code.toUpperCase()}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 
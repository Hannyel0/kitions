'use client';

import { useEffect, useRef } from 'react';
import { APP_NAME } from '../lib/metadata';

/**
 * Custom hook for dynamically updating the page title in client components
 * 
 * @param title - The page title to set (without the app name suffix)
 * @param includeAppName - Whether to include the app name as a suffix (default: true)
 * @param overrideServerTitle - Whether to force override the server-generated title (default: false)
 */
export function usePageTitle(title: string, includeAppName: boolean = true, overrideServerTitle: boolean = false) {
  const hasSetTitle = useRef(false);

  useEffect(() => {
    // Only set the title if we're explicitly overriding or if it's the first mount
    if (overrideServerTitle || !hasSetTitle.current) {
      // Update the document title when the component mounts or title changes
      const formattedTitle = includeAppName ? `${title} | ${APP_NAME}` : title;
      document.title = formattedTitle; 
      hasSetTitle.current = true;
    }
    
    // Restore the default title when the component unmounts
    return () => {
      // Only reset if we're navigating away (not just updating the title)
      if (document.visibilityState !== 'hidden') {
        document.title = APP_NAME;
      }
    };
  }, [title, includeAppName, overrideServerTitle]);
}

/**
 * Dynamic title updater that can be used without a hook
 * Useful for changing titles in response to events
 * 
 * @param title - The page title to set (without the app name suffix)
 * @param includeAppName - Whether to include the app name as a suffix (default: true)
 */
export function updatePageTitle(title: string, includeAppName: boolean = true) {
  const formattedTitle = includeAppName ? `${title} | ${APP_NAME}` : title;
  document.title = formattedTitle;
} 
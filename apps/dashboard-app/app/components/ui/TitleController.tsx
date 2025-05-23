'use client';

import { ReactNode, createContext, useContext, useState, useEffect } from 'react';
import { APP_NAME } from '../../lib/metadata';

// Create a context for title management
interface TitleContextType {
  setTitle: (title: string) => void;
  resetTitle: () => void;
}

const TitleContext = createContext<TitleContextType | undefined>(undefined);

interface TitleControllerProps {
  defaultTitle?: string;
  children: ReactNode;
}

/**
 * TitleController component
 * 
 * Allows dynamic title changes from any child component through context.
 * Useful for complex UIs where title might need to change based on app state
 * rather than just route changes.
 */
export function TitleController({ defaultTitle = APP_NAME, children }: TitleControllerProps) {
  const [title, setTitleState] = useState<string>(defaultTitle);

  useEffect(() => {
    // Set the title when it changes
    document.title = title;
    
    // Reset the title when the component unmounts
    return () => {
      document.title = APP_NAME;
    };
  }, [title]);

  const setTitle = (newTitle: string) => {
    setTitleState(newTitle.includes(APP_NAME) ? newTitle : `${newTitle} | ${APP_NAME}`);
  };

  const resetTitle = () => {
    setTitleState(defaultTitle);
  };

  const value = {
    setTitle,
    resetTitle,
  };

  return <TitleContext.Provider value={value}>{children}</TitleContext.Provider>;
}

/**
 * Hook to use the title controller
 */
export function useTitleController() {
  const context = useContext(TitleContext);
  
  if (context === undefined) {
    throw new Error('useTitleController must be used within a TitleController');
  }
  
  return context;
}

/**
 * Example usage:
 * 
 * 1. Wrap a section of your app with the controller:
 * <TitleController defaultTitle="Dashboard | Kitions">
 *   <YourComponents />
 * </TitleController>
 * 
 * 2. Inside any component under that provider:
 * 
 * function ProductDetail({ product }) {
 *   const { setTitle } = useTitleController();
 *   
 *   useEffect(() => {
 *     setTitle(`${product.name} - Product Details`);
 *     return () => resetTitle();
 *   }, [product]);
 *   
 *   // ... rest of component
 * }
 */ 
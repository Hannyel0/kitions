'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Define auth pages that should not have navbar/footer
  const authPages = ['/login', '/signup', '/forgot-password', '/reset-password', '/verification'];
  
  // Check if current page is an auth page
  const isAuthPage = authPages.some(page => pathname.startsWith(page));
  
  if (isAuthPage) {
    // Auth pages: no navbar/footer, full screen
    return (
      <div className="min-h-screen bg-white">
        {children}
      </div>
    );
  }
  
  // Regular pages: include navbar and footer
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow pt-16">{children}</main>
      <Footer />
    </div>
  );
} 
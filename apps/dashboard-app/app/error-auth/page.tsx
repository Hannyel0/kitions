'use client';

import Image from 'next/image';
import { URLs } from '@/app/config/urls';
import { usePageTitle } from '@/app/hooks/usePageTitle';

export default function AuthErrorPage() {
  // Get login URL from the centralized configuration
  const loginUrl = URLs.getPublicUrl(URLs.public.login);
  
  // Set the page title
  usePageTitle('Authentication Error');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-center mb-6">
            {/* Replace with your actual logo */}
            <Image 
              src="/logo.png" 
              alt="Kitions Logo" 
              width={180} 
              height={50}
              // Display a placeholder if image fails to load
              onError={(e) => {
                e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="180" height="50" viewBox="0 0 180 50"><rect width="180" height="50" fill="%23f0f0f0"/><text x="50%" y="50%" font-family="Arial" font-size="16" fill="%23999" text-anchor="middle" dominant-baseline="middle">Kitions</text></svg>';
              }}
            />
          </div>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-2">Authentication Error</h1>
            <div className="border border-red-200 bg-red-50 rounded-md p-4 mb-6">
              <p className="text-gray-800 mb-4">
                We couldn&apos;t verify your user account properly. This could be due to:
              </p>
              <ul className="text-left text-gray-700 list-disc pl-5 mb-4">
                <li>Missing or invalid user role</li>
                <li>Authentication session expired</li>
                <li>Account hasn&apos;t been fully set up</li>
              </ul>
            </div>
            
            <p className="text-gray-600 mb-6">
              Please try logging in again or contact support if the problem persists.
            </p>
            
            <div className="flex flex-col space-y-3">
              <a 
                href={loginUrl}
                className="block w-full px-4 py-2 bg-[#8982cf] hover:bg-[#7873b3] text-white font-medium rounded-md transition-colors"
              >
                Return to Login
              </a>
              
              <a 
                href="mailto:support@kitions.com"
                className="block w-full px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-md transition-colors"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
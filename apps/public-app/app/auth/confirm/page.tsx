'use client';

import Image from 'next/image';
import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/app/utils/supabase';

function ConfirmEmailContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      console.log(`🌐 Current URL: ${window.location.href}`)
      const code = searchParams.get('code');

      if (code) {
        try {
          const supabase = createSupabaseBrowserClient();
          
          // Exchange the code for a session using PKCE flow
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);

          if (error) {
            console.error('Email verification error:', error.message);
          } else {
            console.log('✅ Email verified successfully', data);
          }
        } catch (err) {
          console.error('Verification error:', err);
        }
      }
    };

    handleEmailConfirmation();
  }, [searchParams]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <div className="flex justify-center mb-8">
          <Image 
            src="/default-monochrome-black.svg" 
            alt="Kitions" 
            width={180} 
            height={60}
          />
        </div>

        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Email Verification
          </h2>
          
          <p className="text-gray-600 mb-8">
            Your email verification has been processed. You can now go back to the previous page to continue with your registration.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800 text-sm">
              <strong>Next Step:</strong> Go back to the previous tab/window to continue your signup process.
            </p>
          </div>
          
          <button
            onClick={() => window.close()}
            className="inline-block w-full bg-[#8982cf] text-white py-3 px-6 rounded-lg hover:bg-[#7873b3] transition-colors font-medium"
          >
            Close This Tab
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmEmail() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConfirmEmailContent />
    </Suspense>
  );
} 
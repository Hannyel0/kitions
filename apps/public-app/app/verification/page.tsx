'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Verification() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-4xl overflow-hidden bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Image 
              src="/default-monochrome-black.svg" 
              alt="Kitions" 
              width={150} 
              height={50}
            />
          </div>

          <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold mb-4 text-gray-900">Account Created Successfully!</h1>
          
          <div className="max-w-2xl mx-auto mb-8">
            <p className="text-gray-600 mb-4">
              Thank you for registering with Kitions! We need to verify your account before you can fully access our platform.
            </p>
            <p className="text-gray-600 mb-4">
              Please check your email for a verification link. Once verified, our team will review your business information before fully activating your account.
            </p>
            <p className="text-gray-600">
              If you have any questions, please contact our support team at <a href="mailto:support@kitions.com" className="text-[#8982cf]">support@kitions.com</a>.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 max-w-md mx-auto mb-8">
            <h2 className="font-semibold text-blue-800 mb-2">What happens next?</h2>
            <ol className="text-left text-blue-700 space-y-2">
              <li>1. Verify your email by clicking the link we sent you</li>
              <li>2. Our team will review your business details</li>
              <li>3. Once approved, you&apos;ll receive a confirmation email</li>
              <li>4. Log in to access the full platform</li>
            </ol>
          </div>

          <Link 
            href="/login" 
            className="inline-block bg-[#8982cf] text-white px-8 py-3 rounded-md hover:bg-[#7873b3] transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
} 
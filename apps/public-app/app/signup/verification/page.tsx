'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Mail, Clock, CheckCircle, ArrowRight, RefreshCw } from 'lucide-react';
import { useState } from 'react';

export default function EmailVerification() {
  const [isResending, setIsResending] = useState(false);

  const handleResendEmail = async () => {
    setIsResending(true);
    // Simulate API call - you can implement actual resend logic here
    setTimeout(() => {
      setIsResending(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-12 md:p-16 text-center">
        <div className="flex justify-center mb-8">
          <Image 
            src="/default-monochrome-black.svg" 
            alt="Kitions" 
            width={150} 
            height={50}
          />
        </div>

        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 rounded-full p-4">
            <Mail className="w-16 h-16 text-blue-600" />
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Check Your Email
        </h1>
        
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          We&apos;ve sent a verification link to your email address. Please check your inbox and click the link to verify your account.
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-center mb-3">
            <Clock className="w-6 h-6 text-amber-600 mr-2" />
            <h3 className="text-lg font-semibold text-amber-900">What happens next?</h3>
          </div>
          <div className="text-amber-800 text-sm leading-relaxed space-y-2">
            <p>1. <strong>Check your email</strong> (including spam/junk folder)</p>
            <p>2. <strong>Click the verification link</strong> in the email</p>
            <p>3. <strong>Complete your account setup</strong></p>
            <p>4. <strong>Wait for manual review</strong> (24-48 hours)</p>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <button
            onClick={handleResendEmail}
            disabled={isResending}
            className="w-full bg-[#8982cf] text-white py-4 px-6 rounded-lg hover:bg-[#7873b3] transition-all duration-200 font-medium text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 inline-flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isResending ? (
              <>
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="w-5 h-5 mr-2" />
                Resend Verification Email
              </>
            )}
          </button>
          
          <Link
            href="/login"
            className="w-full border-2 border-gray-300 text-gray-700 py-4 px-6 rounded-lg hover:border-[#8982cf] hover:text-[#8982cf] transition-all duration-200 font-medium text-lg inline-flex items-center justify-center group"
          >
            Already verified? Log In
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>

        <div className="text-sm text-gray-500 space-y-2">
          <p>
            Didn&apos;t receive the email? Check your spam folder or{' '}
            <button 
              onClick={handleResendEmail}
              className="text-[#8982cf] hover:underline font-medium"
            >
              resend verification email
            </button>
          </p>
          <p>
            Need help? <Link href="/contact" className="text-[#8982cf] hover:underline font-medium">Contact our support team</Link>
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Account Verification Process</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <h5 className="font-medium text-gray-900 mb-1">Email Verification</h5>
              <p className="text-gray-600">Click the link in your email</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <h5 className="font-medium text-gray-900 mb-1">Manual Review</h5>
              <p className="text-gray-600">We verify your business information</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h5 className="font-medium text-gray-900 mb-1">Account Activated</h5>
              <p className="text-gray-600">Start using Kitions platform</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
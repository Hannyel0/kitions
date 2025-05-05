'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle password reset logic here
    console.log({ email });
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image 
              src="/default-monochrome-black.svg" 
              alt="Kitions" 
              width={150} 
              height={50}
            />
          </Link>
        </div>

        {!submitted ? (
          <>
            <h1 className="text-2xl font-bold text-center mb-2">Forgot your password?</h1>
            <p className="text-gray-600 text-center mb-6">
              Enter your email address and we&apos;ll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm text-gray-600 mb-1">Email</label>
                <input
                  id="email"
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#8982cf] text-white py-3 rounded-md hover:bg-[#7873b3] transition-colors"
              >
                Send Reset Link
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="mb-4 text-[#8982cf]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Check your email</h2>
            <p className="text-gray-600 mb-6">
              We&apos;ve sent a password reset link to <strong>{email}</strong>
            </p>
            <p className="text-sm text-gray-500">
              Didn&apos;t receive the email? Check your spam folder or{' '}
              <button 
                onClick={() => setSubmitted(false)}
                className="text-[#8982cf] hover:text-[#7873b3]"
              >
                try again
              </button>.
            </p>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link href="/login" className="text-[#8982cf] hover:text-[#7873b3]">
            Return to login
          </Link>
        </div>
      </div>
    </div>
  );
} 
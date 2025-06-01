'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/providers/auth-provider';
import { createSupabaseBrowserClient } from '@/app/utils/supabase';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validatingToken, setValidatingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  
  const { resetPassword, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    const validateResetToken = async () => {
      try {
        // Check if we have the token_hash parameter from the email link
        const tokenHash = searchParams.get('token_hash');
        const type = searchParams.get('type');
        const next = searchParams.get('next');

        if (!tokenHash) {
          setError('Invalid or expired reset link. Please request a new password reset.');
          setValidatingToken(false);
          return;
        }

        if (type !== 'recovery') {
          setError('Invalid reset link type. Please request a new password reset.');
          setValidatingToken(false);
          return;
        }

        // Verify the OTP token for password reset (recovery flow)
        const { data, error: verifyError } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: 'recovery'
        });

        if (verifyError) {
          setError('Invalid or expired reset link. Please request a new password reset.');
          setValidatingToken(false);
          return;
        }

        if (!data.session || !data.user) {
          setError('Invalid or expired reset link. Please request a new password reset.');
          setValidatingToken(false);
          return;
        }

        // Verify the session is valid by making an authenticated request
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          setError('Invalid or expired reset link. Please request a new password reset.');
          setValidatingToken(false);
          return;
        }

        setTokenValid(true);
        setValidatingToken(false);

      } catch (err) {
        setError('An error occurred while validating your reset link. Please try again.');
        setValidatingToken(false);
      }
    };

    validateResetToken();
  }, [searchParams, supabase.auth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password.trim()) {
      setError('Please enter a new password');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const { error: resetError } = await resetPassword(password);
      
      if (resetError) {
        setError(resetError.message);
        return;
      }

      setSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login?message=password_updated');
      }, 3000);

    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    }
  };

  if (validatingToken) {
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
          
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8982cf] mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Validating Reset Link</h2>
            <p className="text-gray-600">Please wait while we verify your password reset link...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
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
          
          <div className="text-center">
            <div className="mb-4 text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.88-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Invalid Reset Link</h2>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm mb-4">
                {error}
              </div>
            )}
            <p className="text-gray-600 mb-6">
              This password reset link is invalid or has expired. Please request a new one.
            </p>
            <Link 
              href="/forgot-password"
              className="inline-block w-full bg-[#8982cf] text-white py-3 px-6 rounded-lg hover:bg-[#7873b3] transition-colors font-medium"
            >
              Request New Reset Link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
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
          
          <div className="text-center">
            <div className="mb-4 text-green-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Password Updated!</h2>
            <p className="text-gray-600 mb-6">
              Your password has been successfully updated. You can now sign in with your new password.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Redirecting to login page in a few seconds...
            </p>
            <Link 
              href="/login"
              className="inline-block w-full bg-[#8982cf] text-white py-3 px-6 rounded-lg hover:bg-[#7873b3] transition-colors font-medium"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

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

        <h1 className="text-2xl font-bold text-center mb-2">Set New Password</h1>
        <p className="text-gray-600 text-center mb-6">
          Please enter your new password below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="password" className="block text-sm text-gray-600 mb-1">New Password</label>
            <input
              id="password"
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8982cf] focus:border-transparent"
              placeholder="Enter your new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
              minLength={6}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm text-gray-600 mb-1">Confirm New Password</label>
            <input
              id="confirmPassword"
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8982cf] focus:border-transparent"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !password.trim() || !confirmPassword.trim()}
            className="w-full bg-[#8982cf] text-white py-3 rounded-md hover:bg-[#7873b3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Updating Password...
              </>
            ) : (
              'Update Password'
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link href="/login" className="text-[#8982cf] hover:text-[#7873b3]">
            Return to login
          </Link>
        </div>
      </div>
    </div>
  );
} 
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/providers/auth-provider';
import { usePageTitle } from '../hooks/usePageTitle';
import { motion, AnimatePresence } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  
  const searchParams = useSearchParams();
  
  // Use the dynamic title hook for client-side title updates
  usePageTitle('Log In');

  const { signIn } = useAuth();

  useEffect(() => {
    // Check for success messages from URL params
    const message = searchParams.get('message');
    if (message === 'password_updated') {
      setSuccessMessage('Your password has been successfully updated. You can now log in with your new password.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const { error } = await signIn(email, password);

      if (error) {
        setError(error.message);
        setFailedAttempts(prev => prev + 1); // Increment failed attempts
        setLoading(false);
        return;
      }
      
      // Reset failed attempts on successful login
      setFailedAttempts(0);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError(message);
      setFailedAttempts(prev => prev + 1); // Increment failed attempts
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-5xl overflow-hidden bg-white rounded-2xl shadow-xl">
        <div className="md:flex">
          {/* Left side with image */}
          <div className="hidden md:block md:w-1/2 relative">
            <div className="absolute inset-0">
              <Image
                src="/login-image.jpg"
                alt="Person using Kitions"
                fill
                sizes="50vw"
                className="object-cover"
                priority
              />
            </div>
            <div className="absolute inset-0 bg-black/20 flex flex-col justify-end p-8 z-10">
              <div className="text-white max-w-md">
                <p className="text-2xl font-semibold mb-2">
                  &quot;Simply all the tools that my team and I need.&quot;
                </p>
                <div className="mt-3">
                  <p className="font-semibold">John Smith</p>
                  <p className="text-sm text-gray-300">Director of Procurement, Fresh Foods Co.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side with login form */}
          <div className="w-full md:w-1/2 py-10 px-8 md:px-12">
            <div className="flex justify-center mb-6">
              <Link href="/" className="flex-shrink-0">
                <Image 
                  src="/default-monochrome-black.svg" 
                  alt="Kitions" 
                  width={150} 
                  height={50}
                />
              </Link>
            </div>

            <h1 className="text-2xl font-bold text-center mb-2 text-gray-900">Welcome back</h1>
            <p className="text-gray-600 text-center mb-8">
              Connect with suppliers and retailers in our trusted network.
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-md py-3 px-4 mb-6 text-amber-700 shadow-sm">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p className="text-sm font-medium">Login is currently unavailable to the public</p>
              </div>
              <p className="text-xs mt-1 ml-7">Our platform is in private beta. Please contact us for access.</p>
            </div>

            <AnimatePresence mode="wait">
              {successMessage && (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-4"
                >
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {successMessage}
                  </div>
                </motion.div>
              )}

              {error && (
                <motion.div 
                  key="error"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm text-gray-600 mb-1">Email</label>
                <input
                  id="email"
                  type="email"
                  className="text-black w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm text-gray-600 mb-1">Password</label>
                <input
                  id="password"
                  type="password"
                  className="text-black w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-[#8982cf] border-gray-300 rounded"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600">
                    Remember me
                  </label>
                </div>
                <div>
                  <AnimatePresence>
                    {failedAttempts > 0 && (
                      <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      >
                        <Link href="/forgot-password" className="text-sm text-[#8982cf] hover:text-[#7873b3]">
                          Forgot password?
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#8982cf] text-white py-3 rounded-md hover:bg-[#7873b3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Logging in...' : 'Log in'}
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">OR</span>
                </div>
              </div>

              <button
                type="button"
                className="w-full flex items-center justify-center border border-gray-300 rounded-md py-2 px-4 hover:bg-gray-50 transition-colors text-gray-800 font-medium"
              >
                <svg width="20" height="20" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                  <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
                  <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
                  <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
                  <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
                </svg>
                Continue with Microsoft
              </button>

              <p className="mt-8 text-center text-gray-600">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="text-[#8982cf] hover:text-[#7873b3]">
                  Sign up
                </Link>
              </p>

              <div className="flex justify-center mt-4">
                <Link href="/" className="inline-flex items-center text-gray-600 hover:text-[#8982cf] transition-colors text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Home
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 
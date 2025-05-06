'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/app/providers/auth-provider';
import { usePageTitle } from '../hooks/usePageTitle';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Use the dynamic title hook for client-side title updates
  usePageTitle('Log In');

  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await signIn(email, password);

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError(message);
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
              <Image 
                src="/default-monochrome-black.svg" 
                alt="Kitions" 
                width={150} 
                height={50}
              />
            </div>

            <h1 className="text-2xl font-bold text-center mb-2 text-gray-900">Welcome back</h1>
            <p className="text-gray-600 text-center mb-8">
              Connect with suppliers and retailers in our trusted network.
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
                {error}
              </div>
            )}

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

              <div>
                <label htmlFor="password" className="block text-sm text-gray-600 mb-1">Password</label>
                <input
                  id="password"
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
                  <Link href="/forgot-password" className="text-sm text-[#8982cf] hover:text-[#7873b3]">
                    Forgot password?
                  </Link>
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
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 
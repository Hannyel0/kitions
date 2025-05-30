'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validate passwords match
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Clear password error if passwords match
    setPasswordError(null);

    try {
      // Store user data in sessionStorage
      const userData = {
        firstName,
        lastName,
        email,
        password,
      };
      
      sessionStorage.setItem('signupData', JSON.stringify(userData));
      
      // Redirect to role selection page
      router.push('/signup/role');
    } catch (err) {
      console.error('Error storing signup data:', err);
      setError('An unexpected error occurred. Please try again.');
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
                src="/orderDelivery.jpg" 
                alt="Business person using Kitions"
                fill
                sizes="50vw"
                className="object-cover"
                priority
              />
            </div>
            <div className="absolute inset-0 bg-black/20 flex flex-col justify-end p-8 z-10">
              <div className="text-white max-w-md">
                <p className="text-2xl font-semibold mb-2">
                  &quot;Kitions streamlined our procurement process and saved us thousands.&quot;
                </p>
                <div className="mt-3">
                  <p className="font-semibold">Sarah Johnson</p>
                  <p className="text-sm text-gray-300">Owner, Urban Grocery</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side with signup form */}
          <div className="w-full md:w-1/2 py-10 px-8 md:px-12">
            <div className="flex justify-center mb-6">
              <Image 
                src="/default-monochrome-black.svg" 
                alt="Kitions" 
                width={160} 
                height={54}
              />
            </div>

            <h1 className="text-2xl font-bold text-center mb-2 text-gray-900">Create your account</h1>
            <p className="text-gray-600 text-center mb-8">
              Join our trusted network of suppliers and retailers.
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-md py-3 px-4 mb-6 text-amber-700 shadow-sm">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p className="text-sm font-medium">Registration is currently unavailable to the public</p>
              </div>
              <p className="text-xs mt-1 ml-7">Our platform is in private beta. Please contact us for early access.</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label htmlFor="firstName" className="block text-sm text-gray-600 mb-1">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="John"
                    />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="lastName" className="block text-sm text-gray-600 mb-1">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm text-gray-600 mb-1">
                    Business Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="business@company.com"
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label htmlFor="password" className="block text-sm text-gray-600 mb-1">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setPasswordError(null);
                      }}
                      required
                      minLength={8}
                      className={`w-full px-3 py-2 border rounded-md ${
                        password && confirmPassword && password !== confirmPassword
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:border-[#8982cf] focus:ring-[#8982cf]'
                      }`}
                      placeholder="8+ characters"
                    />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="confirmPassword" className="block text-sm text-gray-600 mb-1">
                      Confirm Password
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setPasswordError(null);
                      }}
                      required
                      minLength={8}
                      className={`w-full px-3 py-2 border rounded-md ${
                        password && confirmPassword && password !== confirmPassword
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:border-[#8982cf] focus:ring-[#8982cf]'
                      }`}
                      placeholder="8+ characters"
                    />
                  </div>
                </div>
                {passwordError && (
                  <p className="text-sm text-red-500">{passwordError}</p>
                )}

                <div className="flex items-start mt-4">
                  <input
                    id="agreeTerms"
                    type="checkbox"
                    className="h-4 w-4 mt-1 text-[#8982cf]"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    required
                  />
                  <label htmlFor="agreeTerms" className="ml-2 block text-sm text-gray-600">
                    I agree to the <Link href="/terms" className="text-[#8982cf] hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-[#8982cf] hover:underline">Privacy Policy</Link>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={!agreeTerms || loading || (password !== confirmPassword && password.length > 0 && confirmPassword.length > 0)}
                  className="w-full bg-[#8982cf] text-white py-3 rounded-md hover:bg-[#7873b3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                >
                  {loading ? 'Processing...' : 'Next'}
                </button>
              </div>
              
              <div className="text-center pt-4">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link href="/login" className="text-[#8982cf] hover:underline">
                    Log In
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 
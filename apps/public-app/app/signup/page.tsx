'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/app/providers/auth-provider';
import { useRouter } from 'next/navigation';

export default function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<'retailer' | 'distributor'>('retailer');
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [showRoleSpecificFields, setShowRoleSpecificFields] = useState(false);
  
  // Retailer-specific fields
  const [storeAddress, setStoreAddress] = useState('');
  const [storeType, setStoreType] = useState('');
  const [inventoryNeeds, setInventoryNeeds] = useState('');
  
  // Distributor-specific fields
  const [minOrderAmount, setMinOrderAmount] = useState<string>('0.00');
  const [minOrderError, setMinOrderError] = useState<string | null>(null);

  const { signUp, signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMinOrderError(null);
    setLoading(true);

    // If role selector hasn't been shown yet, show it
    if (!showRoleSelector) {
      setShowRoleSelector(true);
      setLoading(false);
      return;
    }
    
    // If role-specific fields haven't been shown yet, show them
    if (showRoleSelector && !showRoleSpecificFields) {
      setShowRoleSpecificFields(true);
      setLoading(false);
      return;
    }

    // Validate distributor-specific fields
    if (role === 'distributor') {
      const orderAmount = parseFloat(minOrderAmount);
      if (isNaN(orderAmount)) {
        setMinOrderError('Please enter a valid number');
        setLoading(false);
        return;
      }
      if (orderAmount <= 0) {
        setMinOrderError('Minimum order amount must be greater than zero');
        setLoading(false);
        return;
      }
    }

    try {
      const userData = {
        firstName,
        lastName,
        businessName, 
        phone: phoneNumber,
        role,
        ...(role === 'retailer' ? {
          storeAddress,
          storeType,
          inventoryNeeds
        } : {
          minOrderAmount: parseFloat(minOrderAmount)
        })
      };
      
      const { error: signUpError, data: signUpData } = await signUp(email, password, userData);

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }
      
      if (!signUpData?.user) {
          setError('Signup successful, but user creation failed. Please contact support.');
          setLoading(false);
          return;
      }
      
      // After successful signup, sign in the user to get the session/token
      const { error: signInError, data: signInData } = await signIn(email, password);
      
      if (signInError || !signInData?.session?.access_token) {
          setError(signInError?.message || 'Failed to log in after signup. Please try logging in manually.');
          setLoading(false);
          // Redirect to login even if sign-in fails after signup, as account exists
          router.push('/login'); 
          return;
      }
      
      const token = signInData.session.access_token;

      // In development, redirect to dashboard app with token
      if (process.env.NODE_ENV === 'development') {
        window.location.href = `http://localhost:3001/auth/callback?token=${token}`;
        // No need to setLoading(false) here as the page is navigating away
        return;
      }

      // If signup is successful in non-dev env, redirect to verification page (or other desired flow)
      router.push('/verification');
    } catch (err) {
      console.error('Signup error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMinOrderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMinOrderAmount(value);
    setMinOrderError(null);
    
    // Validate as the user types, but don't block empty field for usability
    if (value !== '' && parseFloat(value) <= 0) {
      setMinOrderError('Minimum order amount must be greater than zero');
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
                width={150} 
                height={50}
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
              {showRoleSelector && showRoleSpecificFields ? (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-center mb-2">
                    {role === 'retailer' ? 'Retailer Information' : 'Distributor Information'}
                  </h2>
                  <p className="text-sm text-gray-600 text-center mb-4">
                    Please provide additional information about your business.
                  </p>
                  
                  {role === 'retailer' ? (
                    <>
                      <div>
                        <label htmlFor="storeAddress" className="block text-sm text-gray-600 mb-1">Store Address</label>
                        <input
                          id="storeAddress"
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          placeholder="123 Main St, City, State, ZIP"
                          value={storeAddress}
                          onChange={(e) => setStoreAddress(e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="storeType" className="block text-sm text-gray-600 mb-1">Store Type</label>
                        <select
                          id="storeType"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          value={storeType}
                          onChange={(e) => setStoreType(e.target.value)}
                        >
                          <option value="">Select store type</option>
                          <option value="grocery">Grocery</option>
                          <option value="convenience">Convenience</option>
                          <option value="specialty">Specialty</option>
                          <option value="restaurant">Restaurant</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="inventoryNeeds" className="block text-sm text-gray-600 mb-1">Inventory Needs</label>
                        <textarea
                          id="inventoryNeeds"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          placeholder="Describe your inventory requirements"
                          value={inventoryNeeds}
                          onChange={(e) => setInventoryNeeds(e.target.value)}
                          rows={3}
                        />
                      </div>
                    </>
                  ) : (
                    <div>
                      <label htmlFor="minOrderAmount" className="block text-sm text-gray-600 mb-1">Minimum Order Amount ($)</label>
                      <input
                        id="minOrderAmount"
                        type="number"
                        min="0.01"
                        step="0.01"
                        className={`w-full px-3 py-2 border rounded-md ${minOrderError ? 'border-red-300' : 'border-gray-300'}`}
                        placeholder="Enter minimum order amount"
                        value={minOrderAmount}
                        onChange={handleMinOrderChange}
                      />
                      {minOrderError && (
                        <p className="text-red-500 text-xs mt-1">{minOrderError}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">Must be greater than zero</p>
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    disabled={loading || (role === 'distributor' && !!minOrderError)}
                    className="w-full bg-[#8982cf] text-white py-3 rounded-md hover:bg-[#7873b3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </button>
                  
                  <button
                    type="button"
                    className="w-full text-gray-600 py-2 hover:text-gray-900 transition-colors"
                    onClick={() => setShowRoleSpecificFields(false)}
                  >
                    Back
                  </button>
                </div>
              ) : showRoleSelector ? (
                <div className="space-y-6">
                  <div className="text-center mb-4">
                    <h2 className="text-lg font-semibold mb-2">I am a...</h2>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      className={`aspect-video flex flex-col items-center justify-center p-4 border rounded-lg ${
                        role === 'retailer' ? 'border-purple-300 bg-purple-50' : 'border-gray-200'
                      }`}
                      onClick={() => setRole('retailer')}
                    >
                      <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                      <span className="font-medium">Retailer</span>
                      <span className="text-xs text-gray-500 mt-1">I want to buy products</span>
                    </button>
                    
                    <button
                      type="button"
                      className={`aspect-video flex flex-col items-center justify-center p-4 border rounded-lg ${
                        role === 'distributor' ? 'border-purple-300 bg-purple-50' : 'border-gray-200'
                      }`}
                      onClick={() => setRole('distributor')}
                    >
                      <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                      </div>
                      <span className="font-medium">Distributor</span>
                      <span className="text-xs text-gray-500 mt-1">I want to sell products</span>
                    </button>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-[#8982cf] text-white py-3 rounded-md hover:bg-[#7873b3] transition-colors"
                  >
                    Next
                  </button>
                  
                  <button
                    type="button"
                    className="w-full text-gray-600 py-2 hover:text-gray-900 transition-colors"
                    onClick={() => setShowRoleSelector(false)}
                  >
                    Back
                  </button>
                </div>
              ) : (
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
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="businessName" className="block text-sm text-gray-600 mb-1">
                      Business Name
                    </label>
                    <input
                      id="businessName"
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Your Business Name"
                    />
                  </div>

                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm text-gray-600 mb-1">
                      Phone Number
                    </label>
                    <input
                      id="phoneNumber"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="(123) 456-7890"
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm text-gray-600 mb-1">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="8+ characters"
                    />
                  </div>

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
                    disabled={!agreeTerms || loading}
                    className="w-full bg-[#8982cf] text-white py-3 rounded-md hover:bg-[#7873b3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                  >
                    Next
                  </button>
                </div>
              )}
              
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
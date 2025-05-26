'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/app/providers/auth-provider';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Store, Building2, Building, MapPin, Phone, Tag, ChevronDown, Check } from 'lucide-react';

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
  const [role, setRole] = useState<'retailer' | 'distributor'>('retailer');
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [showBusinessInfo, setShowBusinessInfo] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Business information fields
  const [businessName, setBusinessName] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [businessType, setBusinessType] = useState('');

  const { signUp, signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // If role selector hasn't been shown yet, show it
    if (!showRoleSelector) {
      setShowRoleSelector(true);
      setLoading(false);
      return;
    }
    
    // If business info hasn't been shown yet, show it
    if (showRoleSelector && !showBusinessInfo) {
      setShowBusinessInfo(true);
      setLoading(false);
      return;
    }

    try {
      // Validate passwords match
      if (password !== confirmPassword) {
        setPasswordError('Passwords do not match');
        setLoading(false);
        return;
      }

      const userData = {
        firstName,
        lastName,
        businessName,
        phone: businessPhone,
        role,
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
      
      // Redirect to success page instead of dashboard
      router.push('/signup/success');
    } catch (err) {
      console.error('Signup error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers, spaces, parentheses, and dashes
    const phoneRegex = /^[0-9\s\(\)\-\+]*$/;
    
    if (phoneRegex.test(value)) {
      setBusinessPhone(value);
    }
  };

  const handleRoleSelect = (selectedRole: 'retailer' | 'distributor') => {
    setRole(selectedRole);
    setShowBusinessInfo(true);
  };

  const getBusinessTypeOptions = () => {
    return [
      { value: 'sole_proprietorship', label: 'Sole Proprietorship', description: 'Individual ownership' },
      { value: 'partnership', label: 'Partnership', description: 'Shared ownership' },
      { value: 'llc', label: 'LLC', description: 'Limited Liability Company' },
      { value: 'corporation', label: 'Corporation', description: 'Corporate entity' }
    ];
  };

  // Business information layout (full width, no image)
  if (showBusinessInfo) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-12 md:p-16">
          <div className="flex justify-center mb-12">
            <Image 
              src="/default-monochrome-black.svg" 
              alt="Kitions" 
              width={150} 
              height={50}
            />
          </div>

          <div className="text-center mb-8">
            <button
              type="button"
              onClick={() => setShowBusinessInfo(false)}
              className="cursor-pointer inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-8 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to role selection
            </button>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Tell us about your business
            </h2>
            <p className="text-base text-gray-600 mb-8 max-w-lg mx-auto leading-relaxed">
              Help us customize your experience by providing some basic information about your {role === 'retailer' ? 'store' : 'distribution business'}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
                Business Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="businessName"
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8982cf] focus:border-transparent transition-all duration-200"
                  placeholder="Enter your business name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="businessAddress" className="block text-sm font-medium text-gray-700 mb-2">
                Business Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="businessAddress"
                  type="text"
                  value={businessAddress}
                  onChange={(e) => setBusinessAddress(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8982cf] focus:border-transparent transition-all duration-200"
                  placeholder="123 Business St, City, State, ZIP"
                />
              </div>
            </div>

            <div>
              <label htmlFor="businessPhone" className="block text-sm font-medium text-gray-700 mb-2">
                Business Phone Number *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="businessPhone"
                  type="tel"
                  value={businessPhone}
                  onChange={handlePhoneChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8982cf] focus:border-transparent transition-all duration-200"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            <div>
              <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 mb-2">
                Business Type *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <Tag className="h-5 w-5 text-gray-400" />
                </div>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8982cf] focus:border-transparent transition-all duration-200 bg-white text-left flex items-center justify-between"
                >
                  <span className={businessType ? 'text-gray-900' : 'text-gray-500'}>
                    {businessType ? getBusinessTypeOptions().find(option => option.value === businessType)?.label : 'Select your business type'}
                  </span>
                  <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Custom Dropdown */}
                <div className={`absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg transition-all duration-200 origin-top ${
                  isDropdownOpen 
                    ? 'opacity-100 scale-y-100 translate-y-0' 
                    : 'opacity-0 scale-y-95 -translate-y-2 pointer-events-none'
                }`}>
                  <div className="py-2">
                    {getBusinessTypeOptions().map((option, index) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setBusinessType(option.value);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 flex items-center justify-between group ${
                          businessType === option.value ? 'bg-[#8982cf]/5 text-[#8982cf]' : 'text-gray-900'
                        }`}
                        style={{
                          animationDelay: `${index * 50}ms`
                        }}
                      >
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-sm text-gray-500">{option.description}</div>
                        </div>
                        {businessType === option.value && (
                          <Check className="h-4 w-4 text-[#8982cf]" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Backdrop to close dropdown */}
                {isDropdownOpen && (
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsDropdownOpen(false)}
                  />
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={!businessName || !businessAddress || !businessPhone || !businessType || loading}
              className="w-full bg-[#8982cf] text-white py-4 rounded-lg hover:bg-[#7873b3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              {loading ? 'Processing...' : 'Continue to Next Step'}
            </button>
          </form>

          <div className="text-center pt-6">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-[#8982cf] hover:underline font-medium">
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Role selection layout (full width, no image)
  if (showRoleSelector && !showBusinessInfo) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-12 md:p-16">
          <div className="flex justify-center mb-12">
            <Image 
              src="/default-monochrome-black.svg" 
              alt="Kitions" 
              width={150} 
              height={50}
            />
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setShowRoleSelector(false)}
              className="cursor-pointer inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-12 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to previous step
            </button>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              How will you use Kitions?
            </h2>
            <p className="text-base text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Choose your role to help us customize your experience and get you started with the right tools
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <button
                type="button"
                onClick={() => handleRoleSelect('retailer')}
                className="cursor-pointer group relative bg-white p-8 rounded-2xl shadow-lg border-2 border-transparent hover:border-[#8982cf] transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="bg-blue-50 rounded-full p-4 border-8 border-white shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <Store className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    I'm a Retailer
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    I want to source products from distributors and manage
                    my inventory efficiently
                  </p>
                </div>
                <div className="text-[#8982cf] font-medium group-hover:underline transition-all duration-200">
                  Continue as Retailer →
                </div>
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect('distributor')}
                className="cursor-pointer group relative bg-white p-8 rounded-2xl shadow-lg border-2 border-transparent hover:border-[#8982cf] transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="bg-purple-50 rounded-full p-4 border-8 border-white shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <Building2 className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    I'm a Distributor
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    I want to sell my products to retailers and grow my
                    distribution network
                  </p>
                </div>
                <div className="text-[#8982cf] font-medium group-hover:underline transition-all duration-200">
                  Continue as Distributor →
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
                  disabled={!agreeTerms || loading}
                  className="w-full bg-[#8982cf] text-white py-3 rounded-md hover:bg-[#7873b3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                >
                  Next
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
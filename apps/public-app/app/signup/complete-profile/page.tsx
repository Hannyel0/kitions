'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/app/providers/auth-provider';
import { useRouter } from 'next/navigation';
import { Building, Phone, Tag, ChevronDown, Check } from 'lucide-react';
import AddressAutocomplete from '@/components/AddressAutocomplete';
import { createSupabaseBrowserClient } from '@/app/utils/supabase';

function CompleteProfileContent() {
  const [businessName, setBusinessName] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState<'retailer' | 'distributor'>('retailer');
  const [authCheckComplete, setAuthCheckComplete] = useState(false);
  const [fromDashboard, setFromDashboard] = useState(false);

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Check if this is a cross-app redirect from dashboard (client-side only)
    if (typeof window !== 'undefined') {
      const fromDash = new URLSearchParams(window.location.search).get('from') === 'dashboard';
      setFromDashboard(fromDash);
    }
    
    // Give more time for cross-app authentication to establish if coming from dashboard
    const authCheckDelay = fromDashboard ? 3000 : 1000; // 3 seconds for cross-app, 1 second for normal
    
    console.log('🔍 Setting up auth check...', { fromDashboard, delay: authCheckDelay });
    
    const authCheckTimer = setTimeout(() => {
      console.log('🔍 Auth check timer completed, user state:', user);
      setAuthCheckComplete(true);
    }, authCheckDelay);

    return () => clearTimeout(authCheckTimer);
  }, [user, fromDashboard]);

  useEffect(() => {
    // Only run redirect logic after auth check is complete
    if (!authCheckComplete) {
      return;
    }

    // Check if user is authenticated and get their role
    if (user) {
      console.log('✅ User authenticated:', user.id);
      
      // Check if user has already completed onboarding
      const checkOnboardingStatus = async () => {
        try {
          const supabase = createSupabaseBrowserClient();
          const { data: userData, error } = await supabase
            .from('users')
            .select('role, onboarding_completed')
            .eq('id', user.id)
            .single();
          
          if (error) {
            console.error('Error fetching user data:', error);
            return;
          }

          // If user has already completed onboarding, redirect to dashboard
          if (userData?.onboarding_completed) {
            console.log('✅ User has already completed onboarding, redirecting to dashboard...');
            const dashboardUrl = getDashboardUrl();
            window.location.href = dashboardUrl;
            return;
          }

          // Set user role from database
          if (userData?.role) {
            setUserRole(userData.role);
          }
        } catch (error) {
          console.error('Error checking onboarding status:', error);
        }
      };

      if (user.user_metadata?.role) {
        setUserRole(user.user_metadata.role);
        // Still check onboarding status even if we have role in metadata
        checkOnboardingStatus();
      } else {
        // If no role in metadata, get it from database and check onboarding
        checkOnboardingStatus();
      }
    } else {
      // No authenticated user found after waiting
      console.log('❌ No authenticated user after auth check delay, redirecting to signup...');
      router.push('/signup');
    }
  }, [user, router, authCheckComplete]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Remove all non-numeric characters
    const numbersOnly = value.replace(/\D/g, '');
    
    // Limit to 10 digits
    const limitedNumbers = numbersOnly.slice(0, 10);
    
    // Format the phone number
    let formattedPhone = '';
    if (limitedNumbers.length > 0) {
      if (limitedNumbers.length <= 3) {
        formattedPhone = `(${limitedNumbers}`;
      } else if (limitedNumbers.length <= 6) {
        formattedPhone = `(${limitedNumbers.slice(0, 3)})-${limitedNumbers.slice(3)}`;
      } else {
        formattedPhone = `(${limitedNumbers.slice(0, 3)})-${limitedNumbers.slice(3, 6)}-${limitedNumbers.slice(6)}`;
      }
    }
    
    setBusinessPhone(formattedPhone);
  };

  const getBusinessTypeOptions = () => {
    return [
      { value: 'sole_proprietorship', label: 'Sole Proprietorship', description: 'Individual ownership' },
      { value: 'partnership', label: 'Partnership', description: 'Shared ownership' },
      { value: 'llc', label: 'LLC', description: 'Limited Liability Company' },
      { value: 'corporation', label: 'Corporation', description: 'Corporate entity' }
    ];
  };

  const getDashboardUrl = () => {
    let path = '/'; // Default path
    if (userRole === 'retailer') path = '/retailer/home';
    else if (userRole === 'distributor') path = '/distributor/home';
    else if (userRole === 'admin') path = '/admin/home';

    // Return the correct dashboard URL based on environment
    if (process.env.NODE_ENV === 'development') {
      return `http://localhost:3001${path}`;
    }
    return `https://dashboard.kitions.com${path}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!user) {
      setError('User not authenticated. Please try again.');
      setLoading(false);
      return;
    }

    try {
      const supabase = createSupabaseBrowserClient();
      
      console.log('📝 Updating user business information...');
      
      // Update the users table with business information
      const { error: userUpdateError } = await supabase
        .from('users')
        .update({
          business_name: businessName,
          business_address: businessAddress,
          phone: businessPhone,
          business_type: businessType,
          onboarding_completed: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (userUpdateError) {
        console.error('❌ Error updating user business info:', userUpdateError.message);
        throw new Error(userUpdateError.message);
      }

      console.log('✅ User business information updated successfully');

      // Update role-specific table based on user role
      if (userRole === 'retailer') {
        console.log('📝 Updating retailer information...');
        const { error: retailerUpdateError } = await supabase
          .from('retailers')
          .update({
            store_address: businessAddress,
            store_type: businessType,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);

        if (retailerUpdateError) {
          console.error('❌ Error updating retailer info:', retailerUpdateError.message);
          throw new Error(retailerUpdateError.message);
        }
        console.log('✅ Retailer information updated successfully');
        
      } else if (userRole === 'distributor') {
        console.log('📝 Updating distributor information...');
        const { error: distributorUpdateError } = await supabase
          .from('distributors')
          .update({
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);

        if (distributorUpdateError) {
          console.error('❌ Error updating distributor info:', distributorUpdateError.message);
          throw new Error(distributorUpdateError.message);
        }
        console.log('✅ Distributor information updated successfully');
      }

      console.log('🎉 Profile completion successful, cleaning up and redirecting to dashboard...');
      
      // Clear sessionStorage only after successful completion
      sessionStorage.removeItem('signupData');
      sessionStorage.removeItem('selectedRole');
      
      // Redirect to the appropriate dashboard
      window.location.href = getDashboardUrl();
      
    } catch (err) {
      console.error('Profile completion error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking authentication from cross-app redirect
  if (!authCheckComplete || (!user && authCheckComplete === true)) {
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
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8982cf]"></div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {fromDashboard ? 'Redirecting from Dashboard' : 'Loading Your Profile'}
            </h2>
            <p className="text-gray-600">
              {fromDashboard 
                ? 'Please wait while we transfer your session...' 
                : 'Please wait while we verify your authentication...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-12 md:p-16">
        <div className="flex justify-center mb-12">
          <Image 
            src="/default-monochrome-black.svg" 
            alt="Kitions" 
            width={180} 
            height={60}
          />
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Complete Your Business Profile
          </h2>
          <p className="text-base text-gray-600 mb-8 max-w-lg mx-auto leading-relaxed">
            Great! Your email has been verified. Now let&apos;s complete your business information to finish setting up your {userRole} account.
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
            <AddressAutocomplete
              value={businessAddress}
              onChange={(value) => setBusinessAddress(value)}
              required
              placeholder="123 Business St, City, State, ZIP"
            />
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
                placeholder="(555)-123-4567"
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
            className="w-full bg-[#8982cf] text-white py-4 rounded-lg hover:bg-[#7873b3] disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            {loading ? 'Completing Profile...' : 'Complete Profile & Continue'}
          </button>
        </form>

        <div className="text-center pt-6">
          <p className="text-sm text-gray-600">
            Need help? <Link href="/contact" className="text-[#8982cf] hover:underline font-medium">Contact our support team</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CompleteProfile() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CompleteProfileContent />
    </Suspense>
  );
} 
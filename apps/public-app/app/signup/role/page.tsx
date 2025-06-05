'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/providers/auth-provider';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Store, Building2 } from 'lucide-react';

interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export default function SignupRole() {
  const [signupData, setSignupData] = useState<SignupData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingVerification, setCheckingVerification] = useState(true);
  
  const { signUp, user, completeUserProfile } = useAuth();
  const router = useRouter();

  // Load signup data from sessionStorage and check verification status
  useEffect(() => {
    const checkUserAndLoadData = async () => {
      setCheckingVerification(true);
      
      if (user) {
        console.log('👤 User found, checking verification status...');
        
        // Check if user is verified
        if (user.email_confirmed_at) {
          console.log('✅ Email confirmed, completing profile and redirecting...');
          
          try {
            await completeUserProfile();
            router.push('/signup/complete-profile');
            return;
          } catch (error) {
            console.error('Error completing profile:', error);
            setError('Failed to complete profile setup. Please try again.');
            setCheckingVerification(false);
            return;
          }
        } else {
          // If user exists but not verified, check if they already have a role
          // If they do, redirect to verification. If not, let them select role first
          console.log('📧 Email not yet confirmed, checking if role was already selected...');
          
          const storedRole = sessionStorage.getItem('selectedRole');
          if (storedRole && user.user_metadata?.role) {
            // Role already selected, go to verification
            console.log('✅ Role already selected, redirecting to verification page');
            router.push('/signup/verification');
            return;
          } else {
            // No role selected yet, stay on this page to complete role selection
            console.log('📋 No role selected yet, allowing role selection');
            setCheckingVerification(false);
            return;
          }
        }
      } else {
        console.log('👤 No authenticated user found');
        
        // Only check for signup data if user is not authenticated
        try {
          const storedData = sessionStorage.getItem('signupData');
          if (storedData) {
            const parsedData = JSON.parse(storedData);
            setSignupData(parsedData);
            console.log('✅ Loaded signup data from sessionStorage');
            setCheckingVerification(false);
          } else {
            console.log('❌ No signup data found, redirecting to signup...');
            router.push('/signup');
            return;
          }
        } catch (err) {
          console.error('Error loading signup data:', err);
          router.push('/signup');
          return;
        }
      }
    };

    checkUserAndLoadData();
  }, [user, router, completeUserProfile]);

  // Show loading while checking verification status
  if (checkingVerification) {
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
              Checking Verification Status
            </h2>
            <p className="text-gray-600">
              Please wait while we check your email verification status...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleRoleSelect = async (selectedRole: 'retailer' | 'distributor') => {
    // If user is already authenticated, we don't need signupData
    if (!user && !signupData) {
      setError('Signup data not found. Please start over.');
      router.push('/signup');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // If user is not authenticated, create account first
      if (!user) {
        if (!signupData) {
          setError('Signup data not found. Please start over.');
          setLoading(false);
          return;
        }

        // Create user account with basic info
        const userData = {
          firstName: signupData.firstName,
          lastName: signupData.lastName,
          businessName: '', // Will be filled later
          businessAddress: '',
          businessType: '',
          phone: '', // Will be filled later
          role: selectedRole,
        };
        
        const { error: signUpError, data: signUpData } = await signUp(signupData.email, signupData.password, userData);

        if (signUpError) {
          setError(signUpError.message);
          setLoading(false);
          return;
        }
        
        if (!signUpData?.user) {
          setError('Account creation failed. Please try again.');
          setLoading(false);
          return;
        }
      }
      
      // Store the selected role in sessionStorage for the verification page
      sessionStorage.setItem('selectedRole', selectedRole);
      
      // DON'T clear signup data yet - keep it for potential use in verification page
      // We'll clear it only after successful profile completion
      
      // Redirect to verification page
      router.push('/signup/verification');
    } catch (err) {
      console.error('Account creation error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToSignup = () => {
    // Clear sessionStorage and go back to signup
    sessionStorage.removeItem('signupData');
    sessionStorage.removeItem('selectedRole');
    router.push('/signup');
  };

  // Role selection layout (full width, no image) - show if user is not authenticated and has signup data, OR if user is authenticated but not verified
  if ((!user && signupData) || (user && !user.email_confirmed_at)) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-12 md:p-16">
          <div className="flex justify-center mb-12">
            <Image 
              src="/default-monochrome-black.svg" 
              alt="Kitions" 
              width={180} 
              height={60}
            />
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={handleBackToSignup}
              className="cursor-pointer inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-12 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to previous step
            </button>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6 max-w-2xl mx-auto">
                {error}
              </div>
            )}
            
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
                disabled={loading}
                className="cursor-pointer group relative bg-white p-8 rounded-2xl shadow-lg border-2 border-transparent hover:border-[#8982cf] transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="bg-blue-50 rounded-full p-4 border-8 border-white shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <Store className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    I&apos;m a Retailer
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    I want to source products from distributors and manage
                    my inventory efficiently
                  </p>
                </div>
                <div className="text-[#8982cf] font-medium group-hover:underline transition-all duration-200">
                  {loading ? 'Creating account...' : 'Continue as Retailer →'}
                </div>
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect('distributor')}
                disabled={loading}
                className="cursor-pointer group relative bg-white p-8 rounded-2xl shadow-lg border-2 border-transparent hover:border-[#8982cf] transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="bg-purple-50 rounded-full p-4 border-8 border-white shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <Building2 className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    I&apos;m a Distributor
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    I want to sell my products to retailers and grow my
                    distribution network
                  </p>
                </div>
                <div className="text-[#8982cf] font-medium group-hover:underline transition-all duration-200">
                  {loading ? 'Creating account...' : 'Continue as Distributor →'}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading state while data is being loaded
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
            Loading...
          </h2>
          <p className="text-gray-600">
            Please wait while we prepare your role selection...
          </p>
        </div>
      </div>
    </div>
  );
} 
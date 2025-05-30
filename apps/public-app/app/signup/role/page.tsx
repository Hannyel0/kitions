'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/providers/auth-provider';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Store, Building2 } from 'lucide-react';
import { createSupabaseBrowserClient } from '@/app/utils/supabase';

interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export default function SignupRole() {
  const [signupData, setSignupData] = useState<SignupData | null>(null);
  const [role, setRole] = useState<'retailer' | 'distributor'>('retailer');
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingVerification, setCheckingVerification] = useState(true);
  
  const { signUp, user, completeUserProfile } = useAuth();
  const router = useRouter();

  // Load signup data from sessionStorage and check verification status
  useEffect(() => {
    const checkUserAndLoadData = async () => {
      // If we're already showing email verification, don't do any checks
      if (showEmailVerification) {
        console.log('📧 Already showing email verification screen, skipping checks');
        return;
      }
      
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
          console.log('📧 Email not yet confirmed, staying on email verification screen');
          setCheckingVerification(false);
          // Don't redirect authenticated users - they should see the email verification screen
          return;
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
  }, [user, router, completeUserProfile, showEmailVerification]);

  // Add polling for email verification status
  useEffect(() => {
    let pollInterval: NodeJS.Timeout;
    
    // Only poll if we're showing email verification screen and user exists but isn't verified
    if ((showEmailVerification || (user && !user.email_confirmed_at)) && user) {
      console.log('🔄 Starting email verification polling...');
      
      pollInterval = setInterval(async () => {
        try {
          const { data: { user: currentUser } } = await createSupabaseBrowserClient().auth.getUser();
          
          if (currentUser?.email_confirmed_at) {
            console.log('✅ Email verification detected via polling!');
            // Clear the interval
            clearInterval(pollInterval);
            
            // Instead of reloading, trigger the completion flow directly
            try {
              await completeUserProfile();
              router.push('/signup/complete-profile');
            } catch (error) {
              console.error('Error completing profile after verification:', error);
              setError('Failed to complete profile setup. Please try again.');
            }
          } else {
            console.log('⏳ Email not yet verified, continuing to poll...');
          }
        } catch (error) {
          console.error('❌ Error during verification polling:', error);
        }
      }, 3000); // Check every 3 seconds
    }
    
    return () => {
      if (pollInterval) {
        console.log('🛑 Stopping email verification polling');
        clearInterval(pollInterval);
      }
    };
  }, [showEmailVerification, user, completeUserProfile, router]);

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
    if (!signupData) {
      setError('Signup data not found. Please start over.');
      router.push('/signup');
      return;
    }

    setRole(selectedRole);
    setLoading(true);
    setError(null);

    try {
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
      
      // Clear signup data from sessionStorage since account is created
      sessionStorage.removeItem('signupData');
      
      // Show email verification screen
      setShowEmailVerification(true);
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
    router.push('/signup');
  };

  // Email verification layout (full width, no image)
  if (showEmailVerification || (user && !user.email_confirmed_at)) {
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
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 rounded-full p-4">
                <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Account Created Successfully!
            </h2>
            <p className="text-base text-gray-600 mb-8 max-w-lg mx-auto leading-relaxed">
              We&apos;ve created your {role} account and sent a verification email to <strong>{signupData?.email || user?.email}</strong>. Please check your email and click the verification link, then return to this page to complete your registration.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-blue-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">What happens next?</h3>
                <div className="text-blue-800 text-sm leading-relaxed space-y-1">
                  <p>1. Check your email inbox (including spam/junk folder)</p>
                  <p>2. Click the verification link in the email</p>
                  <p>3. Return to this page (it will detect your verification)</p>
                  <p>4. Complete your business information</p>
                  <p>5. Start using your Kitions account</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center space-y-4">
            <Link
              href="/login"
              className="w-full bg-[#8982cf] text-white py-4 rounded-lg hover:bg-[#7873b3] transition-colors font-medium text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 inline-block text-center"
            >
              Go to Login Page
            </Link>
          </div>

          <div className="text-center pt-6">
            <p className="text-sm text-gray-600">
              Didn&apos;t receive the email? Check your spam folder or contact{' '}
              <Link href="/contact" className="text-[#8982cf] hover:underline font-medium">
                our support team
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Role selection layout (full width, no image) - only show if user is not authenticated and has signup data
  if (!user && signupData) {
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
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/providers/auth-provider';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/app/utils/supabase';

interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export default function EmailVerification() {
  const [signupData, setSignupData] = useState<SignupData | null>(null);
  const [role, setRole] = useState<'retailer' | 'distributor'>('retailer');
  const [error, setError] = useState<string | null>(null);
  const [checkingVerification, setCheckingVerification] = useState(true);
  
  const { user, completeUserProfile } = useAuth();
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
          console.log('📧 Email not yet confirmed, staying on email verification screen');
          
          // Try to get role from sessionStorage or user metadata
          const storedRole = sessionStorage.getItem('selectedRole');
          const userRole = user.user_metadata?.role;
          
          if (storedRole) {
            setRole(storedRole as 'retailer' | 'distributor');
          } else if (userRole) {
            setRole(userRole as 'retailer' | 'distributor');
            // Store it in sessionStorage for consistency
            sessionStorage.setItem('selectedRole', userRole);
          }
          
          setCheckingVerification(false);
          // Don't redirect authenticated users - they should see the email verification screen
          return;
        }
      } else {
        console.log('👤 No authenticated user found');
        
        // Check for signup data and role in sessionStorage
        try {
          const storedData = sessionStorage.getItem('signupData');
          const storedRole = sessionStorage.getItem('selectedRole');
          
          if (storedRole) {
            setRole(storedRole as 'retailer' | 'distributor');
          }
          
          if (storedData) {
            const parsedData = JSON.parse(storedData);
            setSignupData(parsedData);
            console.log('✅ Loaded signup data from sessionStorage');
          }
          
          // We need either user authentication or both signup data and role
          if (!storedData && !storedRole) {
            console.log('❌ No signup data or role found, redirecting to signup...');
            router.push('/signup');
            return;
          }
          
          setCheckingVerification(false);
        } catch (err) {
          console.error('Error loading signup data:', err);
          router.push('/signup');
          return;
        }
      }
    };

    checkUserAndLoadData();
  }, [user, router, completeUserProfile]);

  // Add polling for email verification status
  useEffect(() => {
    let pollInterval: NodeJS.Timeout;
    
    // Only poll if user exists but isn't verified
    if (user && !user.email_confirmed_at) {
      console.log('🔄 Starting email verification polling...');
      
      pollInterval = setInterval(async () => {
        try {
          const { data: { user: currentUser } } = await createSupabaseBrowserClient().auth.getUser();
          
          if (currentUser?.email_confirmed_at) {
            console.log('✅ Email verification detected via polling!');
            // Clear the interval immediately
            clearInterval(pollInterval);
            
            console.log('📝 Starting automatic profile completion with session data...');
            
            try {
              const supabase = createSupabaseBrowserClient();
              
              // Get data from session storage
              const storedData = sessionStorage.getItem('signupData');
              const storedRole = sessionStorage.getItem('selectedRole');
              
              console.log('📦 Retrieved session data:', { 
                hasSignupData: !!storedData, 
                role: storedRole 
              });
              
              // Get user role from metadata or session storage
              const userRole = currentUser.user_metadata?.role || storedRole || 'retailer';
              
              // Create user profile data with session storage info
              const profileData = {
                id: currentUser.id,
                email: currentUser.email!,
                first_name: currentUser.user_metadata?.first_name || (storedData ? JSON.parse(storedData).firstName : ''),
                last_name: currentUser.user_metadata?.last_name || (storedData ? JSON.parse(storedData).lastName : ''),
                phone: currentUser.user_metadata?.phone || '',
                business_name: currentUser.user_metadata?.business_name || '',
                business_type: currentUser.user_metadata?.business_type || '',
                role: userRole,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                profile_picture_url: '',
                onboarding_completed: false
              };
              
              console.log('📝 Upserting user profile:', profileData.email);
              
              // Upsert user record (handles existing users gracefully)
              const { data: userData, error: usersError } = await supabase
                .from('users')
                .upsert(profileData, {
                  onConflict: 'id'
                })
                .select('id, email, unique_identifier');

              if (usersError) {
                console.error('❌ Users upsert error:', usersError.message);
                throw new Error(usersError.message);
              }
              
              console.log('✅ User record upserted successfully');
              if (userData && userData[0]) {
                console.log('✅ Generated unique identifier:', userData[0].unique_identifier);
              }

              // Upsert verification status
              console.log('📝 Upserting verification status');
              const { error: verificationError } = await supabase
                .from('user_verification_statuses')
                .upsert({
                  user_id: currentUser.id,
                  status: 'pending',
                  updated_at: new Date().toISOString()
                }, {
                  onConflict: 'user_id'
                });

              if (verificationError) {
                console.error('❌ Verification status upsert error:', verificationError.message);
                throw new Error(verificationError.message);
              }
              
              console.log('✅ Verification status upserted successfully');

              // Handle role-specific record
              if (userRole === 'retailer') {
                console.log('📝 Handling retailer record for user ID:', currentUser.id);
                
                // Check if retailer record already exists
                const { data: existingRetailer, error: checkError } = await supabase
                  .from('retailers')
                  .select('user_id')
                  .eq('user_id', currentUser.id)
                  .single();

                if (checkError && checkError.code !== 'PGRST116') {
                  // PGRST116 is "not found" error, which is expected for new users
                  console.error('❌ Error checking existing retailer:', checkError.message);
                  throw new Error(checkError.message);
                }

                if (existingRetailer) {
                  console.log('✅ Retailer record already exists, skipping insert');
                } else {
                  console.log('📝 Inserting new retailer record');
                  const { error: retailerError } = await supabase
                    .from('retailers')
                    .insert({
                      user_id: currentUser.id,
                      store_address: '',
                      store_type: '',
                      inventory_needs: '',
                      created_at: new Date().toISOString(),
                      updated_at: new Date().toISOString()
                    });

                  if (retailerError) {
                    console.error('❌ Retailer insert error:', retailerError.message);
                    throw new Error(retailerError.message);
                  }
                  console.log('✅ Retailer record inserted successfully');
                }
                
              } else if (userRole === 'distributor') {
                console.log('📝 Handling distributor record for user ID:', currentUser.id);
                
                // Check if distributor record already exists
                const { data: existingDistributor, error: checkError } = await supabase
                  .from('distributors')
                  .select('user_id')
                  .eq('user_id', currentUser.id)
                  .single();

                if (checkError && checkError.code !== 'PGRST116') {
                  // PGRST116 is "not found" error, which is expected for new users
                  console.error('❌ Error checking existing distributor:', checkError.message);
                  throw new Error(checkError.message);
                }

                if (existingDistributor) {
                  console.log('✅ Distributor record already exists, skipping insert');
                } else {
                  console.log('📝 Inserting new distributor record');
                  const { error: distributorError } = await supabase
                    .from('distributors')
                    .insert({
                      user_id: currentUser.id,
                      min_order_amount: 0,
                      created_at: new Date().toISOString(),
                      updated_at: new Date().toISOString()
                    });

                  if (distributorError) {
                    console.error('❌ Distributor insert error:', distributorError.message);
                    throw new Error(distributorError.message);
                  }
                  console.log('✅ Distributor record inserted successfully');
                }
              }
              
              console.log('🧹 Clearing session storage data...');
              // Clear session storage now that data is in database
              sessionStorage.removeItem('signupData');
              sessionStorage.removeItem('selectedRole');
              
              console.log('✅ All database operations completed successfully, redirecting to profile completion...');
              
              // Redirect to profile completion
              router.push('/signup/complete-profile');
              
            } catch (profileError) {
              console.error('❌ Error during automatic profile completion:', profileError);
              // If automatic profile completion fails, still try the manual approach
              try {
                await completeUserProfile();
                router.push('/signup/complete-profile');
              } catch (fallbackError) {
                console.error('❌ Fallback profile completion also failed:', fallbackError);
                setError('Failed to complete profile setup. Please try again.');
              }
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
  }, [user, completeUserProfile, router]);

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

  // Email verification layout (full width, no image)
  return (
    <div className="min-h-screen w-full flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-10">
        <div className="flex justify-center mb-10">
          <Image 
            src="/default-monochrome-black.svg" 
            alt="Kitions" 
            width={160} 
            height={54}
          />
        </div>

        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 rounded-full p-4">
              <svg className="w-14 h-14 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Account Created Successfully!
          </h2>
          <p className="text-base text-gray-600 mb-8 leading-relaxed">
            We&apos;ve created your {role} account and sent a verification email to <strong>{signupData?.email || user?.email}</strong>. Please check your email and click the verification link.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-8">
          <div className="flex items-start">
            <svg className="w-6 h-6 text-blue-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-base font-semibold text-blue-900 mb-2">What happens next?</h3>
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
            className="w-full bg-[#8982cf] text-white py-3 rounded-lg hover:bg-[#7873b3] font-medium text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 inline-block text-center"
          >
            Go to Login Page
          </Link>
        </div>

        <div className="text-center pt-5">
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
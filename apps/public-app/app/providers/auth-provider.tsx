'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { createSupabaseBrowserClient } from '../utils/supabase';
import { useRouter } from 'next/navigation';

type SignUpResponse = {
  error: Error | AuthError | null;
  data: { user: User | null; session: Session | null } | null;
};

type SignInResponse = {
  error: Error | AuthError | null;
  data: { session: Session | null; user: User | null };
};

type AuthContextType = {
  user: User | null;
  session: Session | null;
  signUp: (email: string, password: string, userData: UserData) => Promise<SignUpResponse>;
  signIn: (email: string, password: string) => Promise<SignInResponse>;
  signOut: () => Promise<void>;
  loading: boolean;
  completeUserProfile: () => Promise<{ error: Error | null }>;
  handleEmailVerification: (code: string) => Promise<{ error: Error | null; user: User | null }>;
  forgotPassword: (email: string) => Promise<{ error: Error | null }>;
  resetPassword: (password: string) => Promise<{ error: Error | null }>;
};

type UserData = {
  firstName: string;
  lastName: string;
  businessName: string;
  businessAddress?: string;
  businessType?: string;
  phone: string;
  role: 'retailer' | 'distributor';
  storeAddress?: string;
  storeType?: string;
  inventoryNeeds?: string;
  minOrderAmount?: number;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    const getSessionAndUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(user);
      setLoading(false);
    };

    getSessionAndUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        supabase.auth.getUser().then(({ data: { user } }) => {
          setUser(user);
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const signUp = async (email: string, password: string, userData: UserData): Promise<SignUpResponse> => {
    console.log('🔐 SIGNUP START - Creating account for:', email);
    setLoading(true);
    
    // Cache the client instance to ensure we use the same one throughout
    const authClient = supabase;
    console.log('🔶 Using Supabase client instance:', authClient ? 'Valid' : 'Invalid');
    
    const { data, error } = await authClient.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
        data: {
          first_name: userData.firstName,
          last_name: userData.lastName,
          role: userData.role,
          business_name: userData.businessName,
          business_type: userData.businessType,
          phone: userData.phone,
        }
      }
    });

    console.log('🔶 SignUp response received:', 
      data ? 'Success' : 'Failed',
      error ? `Error: ${error.message}` : 'No errors'
    );
    console.log('🔶 User data:', data?.user ? 'User created' : 'No user');
    console.log('🔶 Session data:', data?.session ? 'Session created' : 'No session');
    console.log('🔗 EMAIL REDIRECT URL USED:', `${window.location.origin}/auth/confirm`);

    if (error) {
      console.error('❌ SIGNUP ERROR:', error.message);
      setLoading(false);
      return { error, data: null };
    }

    if (!data.user) {
      console.error('❌ SIGNUP ERROR: No user returned from signup');
      setLoading(false);
      return { error: new Error('No user returned from signup'), data: null };
    }
    
    console.log('✅ Auth signup successful, user created with ID:', data.user.id);
    console.log('✅ User email:', data.user.email);
    console.log('✅ Session present:', data.session ? 'Yes' : 'No');
    console.log('📧 Email confirmation required - user will verify email and return to signup page');
    
    // If we have a session (email confirmation disabled), set it
    if (data.session) {
      console.log('🍪 Setting session with authClient...');
      setSession(data.session);
      setUser(data.session.user);
    }

    console.log('⭐ SIGNUP COMPLETED SUCCESSFULLY - User will verify email and return ⭐');
    setLoading(false);
    return { data, error: null };
  };

  const completeUserProfile = async (): Promise<{ error: Error | null }> => {
    console.log('🔐 COMPLETE PROFILE START - Setting up user profile after email verification');
    
    const authClient = supabase;
    const { data: { user } } = await authClient.auth.getUser();
    
    if (!user) {
      console.error('❌ No authenticated user found');
      return { error: new Error('No authenticated user found') };
    }

    console.log('✅ Authenticated user found:', user.id);
    console.log('📝 User metadata:', user.user_metadata);

    try {
      // Get user data from metadata
      const userData = user.user_metadata;
      
      // DATABASE OPERATIONS - INSERT USER RECORDS
      console.log('📝 BEGINNING DATABASE OPERATIONS -----');
      
      console.log('📝 Inserting user with ID:', user.id);
      // Note: unique_identifier will be automatically generated by database trigger
      const { data: userData1, error: usersError } = await authClient
        .from('users')
        .insert({
          id: user.id,
          email: user.email!,
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          phone: userData.phone || '',
          business_name: userData.business_name || '',
          business_type: userData.business_type || '',
          role: userData.role || 'retailer',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          profile_picture_url: ''
        })
        .select('id, email, unique_identifier');

      if (usersError) {
        console.error('❌ Users insert error:', usersError.message);
        console.error('❌ Error details:', usersError);
        throw new Error(usersError.message);
      }
      console.log('✅ User record inserted successfully:', userData1 ? 'Data returned' : 'No data returned');
      if (userData1 && userData1[0]) {
        console.log('✅ Generated unique identifier:', userData1[0].unique_identifier);
      }

      console.log('📝 Inserting verification status with user ID:', user.id);
      const { data: verificationData, error: verificationError } = await authClient
        .from('user_verification_statuses')
        .insert({
          user_id: user.id,
          status: 'pending',
          updated_at: new Date().toISOString()
        })
        .select();

      if (verificationError) {
        console.error('❌ Verification status insert error:', verificationError.message);
        console.error('❌ Error details:', verificationError);
        throw new Error(verificationError.message);
      }
      console.log('✅ Verification status inserted successfully:', verificationData ? 'Data returned' : 'No data returned');

      if (userData.role === 'retailer') {
        console.log('📝 Inserting retailer with user ID:', user.id);
        const { data: retailerData, error: retailerError } = await authClient
          .from('retailers')
          .insert({
            user_id: user.id,
            store_address: '',
            store_type: '',
            inventory_needs: '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select();

        if (retailerError) {
          console.error('❌ Retailer insert error:', retailerError.message);
          console.error('❌ Error details:', retailerError);
          throw new Error(retailerError.message);
        }
        console.log('✅ Retailer record inserted successfully:', retailerData ? 'Data returned' : 'No data returned');
      } else if (userData.role === 'distributor') {
        console.log('📝 Inserting distributor with user ID:', user.id);
        const { data: distributorData, error: distributorError } = await authClient
          .from('distributors')
          .insert({
            user_id: user.id,
            min_order_amount: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select();

        if (distributorError) {
          console.error('❌ Distributor insert error:', distributorError.message);
          console.error('❌ Error details:', distributorError);
          throw new Error(distributorError.message);
        }
        console.log('✅ Distributor record inserted successfully:', distributorData ? 'Data returned' : 'No data returned');
      }
      
      console.log('✅ ALL DATABASE OPERATIONS COMPLETED SUCCESSFULLY -----');
      return { error: null };

    } catch (err: unknown) {
      console.error('❌ PROFILE COMPLETION ERROR:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error completing user profile';
      console.error('❌ Error message:', errorMessage);
      return { error: new Error(errorMessage) };
    }
  };

  const handleEmailVerification = async (code: string): Promise<{ error: Error | null; user: User | null }> => {
    console.log('🔐 HANDLE EMAIL VERIFICATION START - Using PKCE code exchange');
    setLoading(true);
    
    const authClient = supabase;
    
    try {
      // Exchange the code for a session using PKCE flow
      const { data, error } = await authClient.auth.exchangeCodeForSession(code);

      if (error) {
        console.error('❌ Error exchanging code for session:', error.message);
        setLoading(false);
        return { error, user: null };
      }

      if (!data.session || !data.user) {
        console.error('❌ No session or user returned from code exchange');
        setLoading(false);
        return { error: new Error('No session created from code exchange'), user: null };
      }

      console.log('✅ Code exchanged for session successfully:', data.user.id);
      
      // Update the auth state
      setSession(data.session);
      setUser(data.user);
      
      // Wait a moment for state to update
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Verify the session is working by making an authenticated request
      const { data: { user: verifiedUser }, error: verifyError } = await authClient.auth.getUser();
      
      if (verifyError || !verifiedUser) {
        console.error('❌ Session verification failed:', verifyError?.message);
        setLoading(false);
        return { error: new Error('Session verification failed'), user: null };
      }
      
      console.log('✅ Email verification completed successfully with PKCE flow');
      setLoading(false);
      return { error: null, user: verifiedUser };
      
    } catch (err) {
      console.error('❌ Email verification error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Email verification failed';
      setLoading(false);
      return { error: new Error(errorMessage), user: null };
    }
  };

  const signIn = async (email: string, password: string): Promise<SignInResponse> => {
    console.log('🔐 SIGNIN START - Authenticating user:', email);
    setLoading(true);
    
    // Cache the client instance to ensure we use the same one throughout
    const authClient = supabase;
    console.log('🔶 Using Supabase client instance:', authClient ? 'Valid' : 'Invalid');
    
    // Use redirectTo option for both dev and production
    const { data, error } = await authClient.auth.signInWithPassword({ 
      email, 
      password
    });
    
    console.log('🔶 SignIn response received:', 
      data ? 'Success' : 'Failed',
      error ? `Error: ${error.message}` : 'No errors'
    );
    
    if (error) {
      console.error('❌ SIGNIN ERROR:', error.message);
      setLoading(false);
      return { data, error };
    }
    
    console.log('✅ Auth signin successful, session:', data.session ? 'Present' : 'Missing');
    
    // For development only - manual token handling
    if (data?.session && process.env.NODE_ENV === 'development') {
      const accessToken = data.session.access_token;
      const refreshToken = data.session.refresh_token;
      
      console.log('🧪 Testing Access Token:', 
        accessToken ? `Valid (${accessToken.substring(0, 10)}...)` : 'Missing');
      console.log('🧪 Testing Refresh Token:', 
        refreshToken ? `Valid (${refreshToken.substring(0, 10)}...)` : 'Missing');
      
      if (accessToken && refreshToken) {
        console.log("✅ SignIn: Redirecting with access_token & refresh_token to dashboard.");
        window.location.href = `http://localhost:3001/auth/callback?access_token=${accessToken}&refresh_token=${refreshToken}`;
        return { data, error: null };
      } else {
        console.error("❌ SignIn Dev Error: Missing access or refresh token in session.");
      }
    } 
    
    // Production code - session will be handled by Supabase's cookie mechanism
    if (process.env.NODE_ENV === 'production') {
      const baseURL = 'https://dashboard.kitions.com';
      console.log("✅ SignIn: Production environment, redirecting to dashboard.");
      window.location.href = `${baseURL}/auth/callback`;
      return { data, error: null };
    }
    
    // Fallback for non-dev environments or if the redirects don't happen
    console.log("✅ SignIn: Handling non-dev login or fallback.");
    setSession(data.session);
    setUser(data.session.user);
    router.push('/'); 
    router.refresh();
    setLoading(false);
    
    return { data, error };
  };

  const signOut = async () => {
    console.log('🚪 SIGNOUT - Logging out user');
    // Cache the client instance to ensure we use the same one throughout
    const authClient = supabase;
    
    await authClient.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const forgotPassword = async (email: string): Promise<{ error: Error | null }> => {
    console.log('🔐 FORGOT PASSWORD START - Sending reset email to:', email);
    setLoading(true);
    
    try {
      const authClient = supabase;
      const { error } = await authClient.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        console.error('❌ FORGOT PASSWORD ERROR:', error.message);
        setLoading(false);
        return { error };
      }

      console.log('✅ Password reset email sent successfully');
      setLoading(false);
      return { error: null };
    } catch (err) {
      console.error('❌ Unexpected error during forgot password:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to send reset email';
      setLoading(false);
      return { error: new Error(errorMessage) };
    }
  };

  const resetPassword = async (password: string): Promise<{ error: Error | null }> => {
    console.log('🔐 AUTH PROVIDER - RESET PASSWORD START');
    console.log('🔍 Password length:', password.length);
    setLoading(true);
    
    try {
      const authClient = supabase;
      console.log('🔧 Using Supabase client for password update');
      
      // Check current session before attempting update
      const { data: { session }, error: sessionError } = await authClient.auth.getSession();
      console.log('🔍 Current session check:', {
        hasSession: !!session,
        userId: session?.user?.id,
        sessionError: sessionError?.message
      });

      if (!session) {
        console.error('❌ No active session found for password reset');
        setLoading(false);
        return { error: new Error('No active session. Please use a fresh password reset link.') };
      }

      console.log('✅ Active session found, proceeding with password update...');
      
      const { error } = await authClient.auth.updateUser({
        password: password
      });

      if (error) {
        console.error('❌ RESET PASSWORD ERROR from Supabase:', {
          message: error.message,
          status: error.status,
          details: error
        });
        setLoading(false);
        return { error };
      }

      console.log('✅ Password reset successfully in Supabase');
      
      // Verify the update by getting the user again
      const { data: { user }, error: userError } = await authClient.auth.getUser();
      console.log('🔍 Post-update user check:', {
        hasUser: !!user,
        userId: user?.id,
        userError: userError?.message
      });

      setLoading(false);
      return { error: null };
    } catch (err) {
      console.error('❌ Unexpected error during password reset in auth provider:', {
        error: err,
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined
      });
      const errorMessage = err instanceof Error ? err.message : 'Failed to reset password';
      setLoading(false);
      return { error: new Error(errorMessage) };
    }
  };

  const value = {
    user,
    session,
    signUp,
    signIn,
    signOut,
    loading,
    completeUserProfile,
    handleEmailVerification,
    forgotPassword,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 
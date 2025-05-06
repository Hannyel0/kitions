'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { createSupabaseBrowserClient } from '../utils/supabase';
import { useRouter } from 'next/navigation';
import { URLs } from '../config/urls';

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
};

type UserData = {
  firstName: string;
  lastName: string;
  businessName: string;
  phone: string;
  role: 'retailer' | 'distributor';
  // For retailers
  storeAddress?: string;
  storeType?: string;
  inventoryNeeds?: string;
  // For distributors
  minOrderAmount?: number;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  if (typeof window !== 'undefined') { // Ensure it only runs client-side
    console.log('Dashboard Origin Check (AuthProvider):', window.location.origin);
  }

  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    const getSession = async () => {
      // Get session and user in a single call, avoiding redundant API requests
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    // Helper function to refresh session state
    const refreshSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
    };

    getSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Set up periodic session refresh to handle expiry gracefully
    const interval = setInterval(() => {
      refreshSession();
    }, 1000 * 60 * 10); // Refresh every 10 minutes

    return () => {
      subscription.unsubscribe();
      clearInterval(interval);
    };
  }, [supabase.auth]);

  const signUp = async (email: string, password: string, userData: UserData): Promise<SignUpResponse> => {
    console.log('⭐ DASHBOARD SIGNUP START ⭐ - Creating account for:', email);
    setLoading(true);
    
    // Cache the client instance to ensure we use the same one throughout
    const authClient = supabase;
    console.log('🔶 Using Supabase client instance:', authClient ? 'Valid' : 'Invalid');
    
    // First, sign up the user with Supabase Auth
    const { data, error } = await authClient.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          first_name: userData.firstName,
          last_name: userData.lastName,
          role: userData.role,
        }
      }
    });

    console.log('🔶 SignUp response received:', 
      data ? 'Success' : 'Failed',
      error ? `Error: ${error.message}` : 'No errors'
    );

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
    
    try {
      // Add delay before setting session to allow cookies to be processed
      console.log('⏱️ Adding small delay before updating session state...');
      await new Promise(res => setTimeout(res, 100));
      
      // If we have a session, set it explicitly
      if (data.session) {
        console.log('🍪 Setting session with authClient...');
        setSession(data.session);
        setUser(data.session.user);
      }
      
      // Verify session with retries to ensure cookies are properly set
      const maxRetries = 5;
      let retryCount = 0;
      let sessionConfirmed = false;
      
      while (retryCount < maxRetries && !sessionConfirmed) {
        try {
          console.log(`🔄 Verifying session - attempt ${retryCount + 1}/${maxRetries}`);
          await new Promise(res => setTimeout(res, 200)); // Wait between retries
          
          const { data: sessionData } = await authClient.auth.getSession();
          
          if (sessionData?.session) {
            console.log('✅ Session verified successfully!');
            console.log('🍪 Session cookie should now be set');
            sessionConfirmed = true;
            setSession(sessionData.session);
            setUser(sessionData.session.user);
          } else {
            console.log('⚠️ Session not found, retrying...');
            retryCount++;
          }
        } catch (sessionError) {
          console.error('❌ Error verifying session:', sessionError);
          retryCount++;
        }
      }
      
      // Store original user ID for database operations
      const originalUserId = data.user.id;
      console.log('📝 Original user ID for DB operations:', originalUserId);
      
      // DATABASE OPERATIONS - INSERT USER RECORDS
      console.log('📝 BEGINNING DATABASE OPERATIONS -----');
      
      // Perform database operations only if we have a user ID
      if (originalUserId) {
        // Insert user record
        console.log('📝 Inserting user with ID:', originalUserId);
        const { data: userData1, error: usersError } = await authClient
          .from('users')
          .insert({
            id: originalUserId,
            email: email,
            first_name: userData.firstName,
            last_name: userData.lastName,
            phone: userData.phone,
            business_name: userData.businessName,
            role: userData.role,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            profile_picture_url: ''
          })
          .select();

        if (usersError) {
          console.error('❌ Users insert error:', usersError.message);
          console.error('❌ Error details:', usersError);
          throw new Error(usersError.message);
        }
        console.log('✅ User record inserted successfully:', userData1 ? 'Data returned' : 'No data returned');

        // 2. Create entry in user_verification_statuses table
        console.log('📝 Inserting verification status with user ID:', originalUserId);
        const { data: verificationData, error: verificationError } = await authClient
          .from('user_verification_statuses')
          .insert({
            user_id: originalUserId,
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

        // 3. Create role-specific entry
        if (userData.role === 'retailer') {
          console.log('📝 Inserting retailer with user ID:', originalUserId);
          const { data: retailerData, error: retailerError } = await authClient
            .from('retailers')
            .insert({
              user_id: originalUserId,
              store_address: userData.storeAddress || '',
              store_type: userData.storeType || '',
              inventory_needs: userData.inventoryNeeds || '',
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
        } else {
          // Distributor
          console.log('📝 Inserting distributor with user ID:', originalUserId);
          const { data: distributorData, error: distributorError } = await authClient
            .from('distributors')
            .insert({
              user_id: originalUserId,
              min_order_amount: userData.minOrderAmount || 0,
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
      }
    } catch (err: unknown) {
      console.error('❌ SIGNUP PROCESS ERROR:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error creating user profile';
      console.error('❌ Error message:', errorMessage);
      setLoading(false);
      return { error: new Error(errorMessage), data: null };
    }

    console.log('⭐ SIGNUP COMPLETED SUCCESSFULLY ⭐');
    setLoading(false);
    return { data, error: null };
  };

  const signIn = async (email: string, password: string): Promise<SignInResponse> => {
    console.log('🔐 DASHBOARD SIGNIN START - Authenticating user:', email);
    setLoading(true);
    
    // Cache the client instance to ensure we use the same one throughout
    const authClient = supabase;
    console.log('🔶 Using Supabase client instance:', authClient ? 'Valid' : 'Invalid');
    
    const { data, error } = await authClient.auth.signInWithPassword({ email, password });
    
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
    
    if (data?.session) {
      // After small delay, explicitly set the session to ensure it's registered
      console.log('⏱️ Adding small delay before updating session state...');
      await new Promise(res => setTimeout(res, 50));
      
      // Refresh the session
      setSession(data.session);
      setUser(data.session.user);
      
      // After successful sign in, refresh the browser to ensure we have the latest data
      router.refresh();
    }
    
    setLoading(false);
    return { data, error };
  };

  const signOut = async () => {
    console.log('🚪 DASHBOARD SIGNOUT - Logging out user');
    // Cache the client instance to ensure we use the same one throughout
    const authClient = supabase;
    
    await authClient.auth.signOut();
    
    // Use the centralized URL configuration
    window.location.href = URLs.getPublicUrl(URLs.public.login);
  };

  const value = {
    user,
    session,
    signUp,
    signIn,
    signOut,
    loading,
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
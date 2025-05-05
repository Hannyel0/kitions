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
    const getSessionAndUser = async () => {
      // Get the authenticated user data using getUser() which is more secure
      const { data: { user }, error } = await supabase.auth.getUser();
      
      // Still get the session for token management, but don't rely on it for user data
      const { data: { session } } = await supabase.auth.getSession();
      
      setSession(session);
      setUser(user);
      setLoading(false);
    };

    getSessionAndUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      // Update authenticated user data when session changes
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
    setLoading(true);
    
    // First, sign up the user with Supabase Auth
    const { data, error } = await supabase.auth.signUp({ 
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

    if (error) {
      setLoading(false);
      return { error, data: null };
    }

    // If sign up successful, add user data to our custom tables
    if (data.user) {
      try {
        // 1. Create entry in users table
        const { error: usersError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: email,
            first_name: userData.firstName,
            last_name: userData.lastName,
            phone: userData.phone,
            business_name: userData.businessName,
            role: userData.role,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            profile_picture_url: ''
          });

        if (usersError) {
          throw new Error(usersError.message);
        }

        // 2. Create entry in user_verification_statuses table
        const { error: verificationError } = await supabase
          .from('user_verification_statuses')
          .insert({
            user_id: data.user.id,
            status: 'pending',
            updated_at: new Date().toISOString()
          });

        if (verificationError) {
          throw new Error(verificationError.message);
        }

        // 3. Create role-specific entry
        if (userData.role === 'retailer') {
          const { error: retailerError } = await supabase
            .from('retailers')
            .insert({
              user_id: data.user.id,
              store_address: userData.storeAddress || '',
              store_type: userData.storeType || '',
              inventory_needs: userData.inventoryNeeds || '',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });

          if (retailerError) {
            throw new Error(retailerError.message);
          }
        } else {
          // Distributor
          const { error: distributorError } = await supabase
            .from('distributors')
            .insert({
              user_id: data.user.id,
              min_order_amount: userData.minOrderAmount || 0,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });

          if (distributorError) {
            throw new Error(distributorError.message);
          }
        }
      } catch (err: unknown) {
        setLoading(false);
        const errorMessage = err instanceof Error ? err.message : 'Error creating user profile';
        return { error: new Error(errorMessage), data: null };
      }
    }

    setLoading(false);
    return { data, error: null };
  };

  const signIn = async (email: string, password: string): Promise<SignInResponse> => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    
    if (data?.session) {
      // Refresh the session
      setSession(data.session);
      setUser(data.session.user);
      
      // After successful sign in, refresh the browser to ensure we have the latest data
      router.refresh();
    }
    
    return { data, error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    // Redirect to the public login page, not relative /login
    const publicLoginUrl = process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000/login'
      : '/login'; // In production, assume it's on the same domain
    
    // Use window.location for cross-origin redirect after sign out
    window.location.href = publicLoginUrl; 
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
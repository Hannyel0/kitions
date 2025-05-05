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
    setLoading(true);
    
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

    if (data.user) {
      try {
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

        const currentSession = data.session; 
        if (currentSession && process.env.NODE_ENV === 'development') {
          const accessToken = currentSession.access_token;
          const refreshToken = currentSession.refresh_token;
          if (accessToken && refreshToken) { 
            console.log("SignUp: Redirecting with CORRECT access_token & refresh_token to dashboard.");
            window.location.href = `http://localhost:3001/auth/callback?access_token=${accessToken}&refresh_token=${refreshToken}`;
            return { data, error: null };
          } else {
            console.warn("SignUp: Session received but missing access or refresh token.");
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
    
    if (error) {
      setLoading(false);
      return { data, error };
    }
    
    if (data?.session) {
      if (process.env.NODE_ENV === 'development') {
        const accessToken = data.session.access_token;
        const refreshToken = data.session.refresh_token;
        
        if (accessToken && refreshToken) {
          console.log("SignIn: Redirecting with CORRECT access_token & refresh_token to dashboard.");
          window.location.href = `http://localhost:3001/auth/callback?access_token=${accessToken}&refresh_token=${refreshToken}`;
          return { data, error: null };
        } else {
          console.error("SignIn Dev Error: Missing access or refresh token in session.");
        }
      } 
      
      console.log("SignIn: Handling non-dev login or fallback.");
      setSession(data.session);
      setUser(data.session.user);
      router.push('/'); 
      router.refresh();
      setLoading(false);
      
    } else {
      setLoading(false);
    }
    
    return { data, error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
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
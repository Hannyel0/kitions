import { createBrowserClient, createServerClient, type CookieOptions } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server' // Needed for Route Handler client
import { sharedCookieOptions } from './cookies'

// For client-side usage
export const createSupabaseBrowserClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false
      },
      cookieOptions: sharedCookieOptions
    }
  );
};

// For Server Components/Actions, create client directly using cookies() from 'next/headers'
// Example: 
// import { createServerClient, type CookieOptions } from '@supabase/ssr'
// import { cookies } from 'next/headers'
// const cookieStore = cookies()
// const supabase = createServerClient( ... , { cookies: { ... cookieStore methods ... } })

/**
 * Helper function for creating a Supabase client in Server Components
 * Usage:
 * 
 * import { cookies } from 'next/headers'
 * import { createSupabaseServerClient } from '@/app/utils/supabase'
 * 
 * const cookieStore = cookies()
 * const supabase = createSupabaseServerClient(cookieStore)
 */
export const createSupabaseServerComponentClient = (cookieStore: any) => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // Apply shared cookie options in production
          if (process.env.NODE_ENV !== 'development') {
            options = { 
              ...options, 
              domain: sharedCookieOptions.domain,
              path: sharedCookieOptions.path,
              sameSite: sharedCookieOptions.sameSite,
              secure: sharedCookieOptions.secure 
            };
          }
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          // Apply shared cookie options in production
          if (process.env.NODE_ENV !== 'development') {
            options = { 
              ...options, 
              domain: sharedCookieOptions.domain,
              path: sharedCookieOptions.path,
              sameSite: sharedCookieOptions.sameSite,
              secure: sharedCookieOptions.secure 
            };
          }
          cookieStore.delete({ name, ...options });
        },
      },
    }
  );
};

// Define a function to create a Supabase client for Route Handlers
export const createSupabaseRouteHandlerClient = (req: NextRequest, res: NextResponse) => {
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return req.cookies.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    // Apply shared cookie options in production
                    if (process.env.NODE_ENV !== 'development') {
                        options = { 
                            ...options, 
                            domain: sharedCookieOptions.domain,
                            path: sharedCookieOptions.path,
                            sameSite: sharedCookieOptions.sameSite,
                            secure: sharedCookieOptions.secure 
                        };
                    }
                    res.cookies.set({ name, value, ...options });
                },
                remove(name: string, options: CookieOptions) {
                    // Apply shared cookie options in production
                    if (process.env.NODE_ENV !== 'development') {
                        options = { 
                            ...options, 
                            domain: sharedCookieOptions.domain,
                            path: sharedCookieOptions.path,
                            sameSite: sharedCookieOptions.sameSite,
                            secure: sharedCookieOptions.secure 
                        };
                    }
                    res.cookies.delete({ name, ...options });
                },
            },
        }
    );
};

// Export database types for type safety
export type Database = {
  public: {
    Tables: {
      distributor_product_categories: {
        Row: {
          distributor_id: string;
          category_id: string;
        };
        Insert: {
          distributor_id?: string;
          category_id?: string;
        };
        Update: {
          distributor_id?: string;
          category_id?: string;
        };
      };

      distributors: {
        Row: {
          user_id: string;
          min_order_amount: number;
          created_at: string;
          updated_at: string;
          id: string;
        };
        Insert: {
          user_id?: string;
          min_order_amount?: number;
          created_at?: string;
          updated_at?: string;
          id?: string;
        };
        Update: {
          user_id?: string;
          min_order_amount?: number;
          created_at?: string;
          updated_at?: string;
          id?: string;
        };
      };

      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          quantity: number;
          price: number;
        };
        Insert: {
          id?: string;
          order_id?: string;
          product_id?: string;
          quantity?: number;
          price?: number;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string;
          quantity?: number;
          price?: number;
        };
      };

      orders: {
        Row: {
          id: string;
          status: string;
          total_amount: number;
          created_at: string;
          updated_at: string;
          distributor_id: string;
          retailer_id: string;
        };
        Insert: {
          id?: string;
          status?: string;
          total_amount?: number;
          created_at?: string;
          updated_at?: string;
          distributor_id?: string;
          retailer_id?: string;
        };
        Update: {
          id?: string;
          status?: string;
          total_amount?: number;
          created_at?: string;
          updated_at?: string;
          distributor_id?: string;
          retailer_id?: string;
        };
      };

      product_categories: {
        Row: {
          id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          created_at?: string;
        };
      };

      products: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          image_url: string;
          case_quantity: number;
          created_at: string;
          updated_at: string;
          distributor_id: string;
        };
        Insert: {
          id?: string;
          name?: string;
          description?: string;
          price?: number;
          image_url?: string;
          case_quantity?: number;
          created_at?: string;
          updated_at?: string;
          distributor_id?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          price?: number;
          image_url?: string;
          case_quantity?: number;
          created_at?: string;
          updated_at?: string;
          distributor_id?: string;
        };
      };

      retailers: {
        Row: {
          user_id: string;
          store_address: string;
          store_type: string;
          inventory_needs: string;
          created_at: string;
          updated_at: string;
          id: string;
        };
        Insert: {
          user_id?: string;
          store_address?: string;
          store_type?: string;
          inventory_needs?: string;
          created_at?: string;
          updated_at?: string;
          id?: string;
        };
        Update: {
          user_id?: string;
          store_address?: string;
          store_type?: string;
          inventory_needs?: string;
          created_at?: string;
          updated_at?: string;
          id?: string;
        };
      };

      user_verification_statuses: {
        Row: {
          user_id: string;
          status: 'pending' | 'verified' | 'rejected';
          updated_at: string;
        };
        Insert: {
          user_id?: string;
          status?: 'pending' | 'verified' | 'rejected';
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          status?: 'pending' | 'verified' | 'rejected';
          updated_at?: string;
        };
      };

      users: {
        Row: {
          id: string;
          email: string;
          first_name: string;
          last_name: string;
          phone: string;
          business_name: string;
          role: 'retailer' | 'distributor' | 'admin';
          created_at: string;
          updated_at: string;
          profile_picture_url: string;
        };
        Insert: {
          id?: string;
          email?: string;
          first_name?: string;
          last_name?: string;
          phone?: string;
          business_name?: string;
          role?: 'retailer' | 'distributor' | 'admin';
          created_at?: string;
          updated_at?: string;
          profile_picture_url?: string;
        };
        Update: {
          id?: string;
          email?: string;
          first_name?: string;
          last_name?: string;
          phone?: string;
          business_name?: string;
          role?: 'retailer' | 'distributor' | 'admin';
          created_at?: string;
          updated_at?: string;
          profile_picture_url?: string;
        };
      };
    };
  };
}; 
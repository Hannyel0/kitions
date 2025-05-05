import { CookieOptions as SupabaseCookieOptions } from '@supabase/ssr';

// Define a type that matches the structure Supabase expects for cookieOptions
export type CookieConfig = {
  name: string;
  domain?: string;
  path?: string;
  maxAge?: number;
  sameSite?: 'strict' | 'lax' | 'none';
  secure?: boolean;
  httpOnly?: boolean;
};

export const sharedCookieOptions: CookieConfig = {
  name: 'sb',
  domain: process.env.NODE_ENV === 'development' ? undefined : '.kitions.com',
  path: '/',
  maxAge: 60 * 60 * 24 * 7, // 7 days
  sameSite: 'lax',
  secure: process.env.NODE_ENV !== 'development',
  httpOnly: true, // Prevents client-side JavaScript from accessing cookies
}; 
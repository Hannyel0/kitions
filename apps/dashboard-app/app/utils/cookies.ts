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
  // In development, don't specify domain to allow cookies to work on localhost
  domain: process.env.NODE_ENV === 'development' ? undefined : '.kitions.com',
  path: '/',
  maxAge: 60 * 60 * 24 * 7, // 7 days
  // Always use 'lax' for sameSite to ensure cookies work across subdomains
  sameSite: 'lax',
  // Don't require secure cookies in development
  secure: process.env.NODE_ENV !== 'development',
  // Make cookies httpOnly in production for security, but visible in development for debugging
  httpOnly: process.env.NODE_ENV !== 'development',
}; 
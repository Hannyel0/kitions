import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { sharedCookieOptions } from './app/utils/cookies'

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({
    request: {
      headers: new Headers(req.headers),
    },
  })

  // Create a Supabase client configured for middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // Override httpOnly in development to help with debugging
          if (process.env.NODE_ENV === 'development') {
            options = {
              ...options,
              httpOnly: false, // Make cookies visible to JavaScript in dev
              sameSite: 'lax',
              secure: false,
              domain: undefined, // Use default domain in dev
              path: '/',
            };
          } else {
            // For production, use shared cookie config
            options = { 
              ...options, 
              domain: sharedCookieOptions.domain,
              path: sharedCookieOptions.path,
              sameSite: sharedCookieOptions.sameSite,
              secure: sharedCookieOptions.secure,
              httpOnly: true, // Use httpOnly in production for security
            };
          }
          
          // Set cookie in both request and response
          req.cookies.set({
            name,
            value,
            ...options,
          });
          
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          
          res.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          if (process.env.NODE_ENV === 'development') {
            options = {
              ...options,
              httpOnly: false,
              sameSite: 'lax',
              secure: false,
              domain: undefined,
              path: '/',
            };
          } else {
            options = { 
              ...options, 
              domain: sharedCookieOptions.domain,
              path: sharedCookieOptions.path,
              sameSite: sharedCookieOptions.sameSite,
              secure: sharedCookieOptions.secure,
              httpOnly: true,
            };
          }
          
          req.cookies.delete(name);
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          res.cookies.delete(name);
        },
      },
    }
  )

  try {
    // Check session but don't need to do anything with it in public app
    await supabase.auth.getSession();
  } catch (error) {
    // Silent error handling in production
  }

  return res;
}

// Ensure the middleware is only called for relevant paths.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (assets)
     */
    '/((?!_next/static|_next/image|favicon.ico|images/|fonts/|public/).*)',
  ],
} 
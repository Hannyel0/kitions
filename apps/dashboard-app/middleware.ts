import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { sharedCookieOptions } from './app/utils/cookies'

// import type { Database } from '@/lib/database.types' // Import your database types if you have them

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
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
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
            // For production, use shared cookie config with httpOnly: false
            options = { 
              ...options, 
              domain: sharedCookieOptions.domain,
              path: sharedCookieOptions.path,
              sameSite: sharedCookieOptions.sameSite,
              secure: sharedCookieOptions.secure,
              httpOnly: false, // Make cookies accessible to JavaScript in all environments
            }
          }
          req.cookies.set({ name, value, ...options })
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          res.cookies.set({ name, value, ...options })
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
            // For production, use shared cookie config with httpOnly: false
            options = { 
              ...options, 
              domain: sharedCookieOptions.domain,
              path: sharedCookieOptions.path,
              sameSite: sharedCookieOptions.sameSite,
              secure: sharedCookieOptions.secure,
              httpOnly: false,
            }
          }
          req.cookies.delete(name)
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          res.cookies.delete(name)
        },
      },
    }
  )

  // Check if the current request has auth tokens in the URL (for callback handling)
  const hasAuthTokensInUrl = req.nextUrl.searchParams.has('access_token') && 
                            req.nextUrl.searchParams.has('refresh_token');

  // Define paths that should be accessible without authentication
  const isAuthCallback = req.nextUrl.pathname === '/auth/callback';
  const isErrorAuth = req.nextUrl.pathname === '/error-auth';
  // Add any static assets or API routes that should be public
  const isStaticAsset = req.nextUrl.pathname.startsWith('/_next/') || 
                       req.nextUrl.pathname.includes('favicon.ico');
  const isPublicRoute = isAuthCallback || isErrorAuth || isStaticAsset;
  
  // Only attempt to get the session if we're not on the callback page with tokens
  // This prevents trying to validate a session before it's properly set up
  let session = null;
  if (!hasAuthTokensInUrl) {
    const { data } = await supabase.auth.getSession();
    session = data.session;
  }

  // Redirect to public app login
  const loginUrl = process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000/login'
    : 'https://www.kitions.com/login'; 

  // If no session and the path is not a public route and there are no tokens in URL
  if (!session && !isPublicRoute && !hasAuthTokensInUrl) {
    console.log('Middleware: No session, redirecting to public login:', loginUrl);
    return NextResponse.redirect(loginUrl);
  }

  // Allow the request to proceed if:
  // 1. User is authenticated (has session)
  // 2. Path is a public route (auth callback or error page)
  // 3. URL contains auth tokens (we're in the process of setting up the session)
  console.log(`Middleware: Allowing request for: ${req.nextUrl.pathname} (${session ? 'Authenticated' : isPublicRoute ? 'Public Route' : 'Has Auth Tokens'})`);
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
     * - auth/callback (allow auth callback route)
     * - api/auth (allow any auth api routes if they exist)
     */
    '/((?!_next/static|_next/image|favicon.ico|auth/callback|api/auth).*)',
  ],
} 
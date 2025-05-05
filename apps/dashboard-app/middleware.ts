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
          // Apply shared cookie options in production
          if (process.env.NODE_ENV !== 'development') {
            options = { 
              ...options, 
              domain: sharedCookieOptions.domain,
              path: sharedCookieOptions.path,
              sameSite: sharedCookieOptions.sameSite,
              secure: sharedCookieOptions.secure 
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
          // Apply shared cookie options in production
          if (process.env.NODE_ENV !== 'development') {
            options = { 
              ...options, 
              domain: sharedCookieOptions.domain,
              path: sharedCookieOptions.path,
              sameSite: sharedCookieOptions.sameSite,
              secure: sharedCookieOptions.secure 
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

  // Refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/server-side-rendering#securing-server-side-rendered-pages
  const { data: { session } } = await supabase.auth.getSession();

  const isAuthCallback = req.nextUrl.pathname === '/auth/callback';

  // Redirect to public app login
  const loginUrl = process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000/login'
    : 'https://www.kitions.com/login'; 

  // If no session and the path is not the auth callback, redirect to public login
  if (!session && !isAuthCallback) {
    console.log('Middleware: No session, redirecting to public login:', loginUrl);
    return NextResponse.redirect(loginUrl);
  }

  // Allow the request to proceed if authenticated or on the auth callback path
  console.log('Middleware: Session exists or path is /auth/callback, allowing request for:', req.nextUrl.pathname);
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
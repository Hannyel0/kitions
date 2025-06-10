import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

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
          // Use simple cookie options for edge runtime compatibility
          const cookieOptions: CookieOptions = {
            ...options,
            path: '/',
            sameSite: 'lax',
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
          };
          
          // Set cookie in both request and response
          req.cookies.set({
            name,
            value,
            ...cookieOptions,
          });
          
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          
          res.cookies.set({
            name,
            value,
            ...cookieOptions,
          });
        },
        remove(name: string, options: CookieOptions) {
          const cookieOptions: CookieOptions = {
            ...options,
            path: '/',
            sameSite: 'lax',
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
          };
          
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
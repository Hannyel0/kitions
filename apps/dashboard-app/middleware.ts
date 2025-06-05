import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { sharedCookieOptions } from './app/utils/cookies'

// import type { Database } from '@/lib/database.types' // Import your database types if you have them

// Helper function for consistent logging
function logMiddleware(message: string, data?: any) {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] MIDDLEWARE:`;
  
  if (data) {
    console.log(`${prefix} ${message}`, data);
  } else {
    console.log(`${prefix} ${message}`);
  }
}

export async function middleware(req: NextRequest) {
  const startTime = Date.now();
  logMiddleware(`🚀 Processing request: ${req.method} ${req.nextUrl.pathname}`);
  logMiddleware(`🌐 User-Agent: ${req.headers.get('user-agent')?.substring(0, 50)}...`);
  logMiddleware(`🍪 Cookies present: ${req.cookies.getAll().length} cookies`);
  
  // Log cookies (safely)
  const cookieNames = req.cookies.getAll().map(c => c.name);
  logMiddleware(`🍪 Cookie names: ${cookieNames.join(', ')}`);
  const hasSupabaseCookies = cookieNames.some(name => name.startsWith('sb-'));
  logMiddleware(`🔐 Has Supabase cookies: ${hasSupabaseCookies}`);

  let res = NextResponse.next({
    request: {
      headers: new Headers(req.headers),
    },
  })

  logMiddleware('🔧 Creating Supabase client...');
  
  // Create a Supabase client configured for middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const value = req.cookies.get(name)?.value;
          if (name.startsWith('sb-')) {
            logMiddleware(`🍪 Getting cookie: ${name} = ${value ? '[EXISTS]' : '[MISSING]'}`);
          }
          return value;
        },
        set(name: string, value: string, options: CookieOptions) {
          if (name.startsWith('sb-')) {
            logMiddleware(`🍪 Setting cookie: ${name} = [VALUE] with options:`, {
              domain: options.domain,
              path: options.path,
              sameSite: options.sameSite,
              secure: options.secure,
              httpOnly: options.httpOnly
            });
          }
          
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
          if (name.startsWith('sb-')) {
            logMiddleware(`🍪 Removing cookie: ${name}`);
          }
          
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

  logMiddleware('✅ Supabase client created');

  // Check if the current request has auth tokens in the URL (for callback handling)
  const hasAuthTokensInUrl = req.nextUrl.searchParams.has('access_token') && 
                            req.nextUrl.searchParams.has('refresh_token');
  
  logMiddleware(`🔑 Has auth tokens in URL: ${hasAuthTokensInUrl}`);

  // Define paths that should be accessible without authentication or verification
  const isAuthCallback = req.nextUrl.pathname === '/auth/callback';
  const isErrorAuth = req.nextUrl.pathname === '/error-auth';
  const isPendingVerification = req.nextUrl.pathname === '/pending-verification';
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
  // Add any static assets or API routes that should be public
  const isStaticAsset = req.nextUrl.pathname.startsWith('/_next/') || 
                       req.nextUrl.pathname.includes('favicon.ico');
  const isPublicRoute = isAuthCallback || isErrorAuth || isStaticAsset || isPendingVerification;
  
  logMiddleware(`🛣️ Route analysis:`, {
    path: req.nextUrl.pathname,
    isAuthCallback,
    isErrorAuth,
    isPendingVerification,
    isAdminRoute,
    isStaticAsset,
    isPublicRoute
  });
  
  // Only attempt to get the session if we're not on the callback page with tokens
  // This prevents trying to validate a session before it's properly set up
  let session = null;
  if (!hasAuthTokensInUrl) {
    logMiddleware('👤 Fetching session...');
    const sessionStart = Date.now();
    
    try {
      const { data, error } = await supabase.auth.getSession();
      const sessionDuration = Date.now() - sessionStart;
      
      logMiddleware(`⏱️ Session fetch took: ${sessionDuration}ms`);
      
      if (error) {
        logMiddleware(`❌ Session error:`, {
          message: error.message,
          status: error.status
        });
      } else {
        session = data.session;
        if (session) {
          logMiddleware(`✅ Session found:`, {
            userId: session.user.id,
            email: session.user.email,
            expiresAt: new Date(session.expires_at! * 1000).toISOString(),
            hasAccessToken: !!session.access_token,
            hasRefreshToken: !!session.refresh_token
          });
        } else {
          logMiddleware('❌ No session found');
        }
      }
    } catch (sessionError) {
      logMiddleware(`💥 Unexpected session error:`, sessionError);
    }
  } else {
    logMiddleware('⏭️ Skipping session fetch due to auth tokens in URL');
  }

  // Redirect to public app login
  const loginUrl = process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000/login'
    : 'https://www.kitions.com/login'; 

  logMiddleware(`🔗 Login URL configured: ${loginUrl}`);

  // If no session and the path is not a public route and there are no tokens in URL
  if (!session && !isPublicRoute && !hasAuthTokensInUrl) {
    logMiddleware(`🚫 Access denied - redirecting to login:`, {
      reason: 'No session',
      path: req.nextUrl.pathname,
      isPublicRoute,
      hasAuthTokensInUrl
    });
    return NextResponse.redirect(loginUrl);
  }

  // If user is authenticated, check their onboarding and verification status (except for public routes)
  if (session && !isPublicRoute) {
    logMiddleware('🔍 Checking user status for authenticated user...');
    
    try {
      // First, try to check onboarding completion status
      logMiddleware('🔍 Checking onboarding completion status...');
      const onboardingStart = Date.now();
      const { data: userData, error: onboardingError } = await supabase
        .from('users')
        .select('onboarding_completed, role')
        .eq('id', session.user.id)
        .single();
        
      const onboardingDuration = Date.now() - onboardingStart;
      logMiddleware(`⏱️ Onboarding query took: ${onboardingDuration}ms`);

      if (!onboardingError && userData) {
        logMiddleware(`✅ User data retrieved:`, {
          onboardingCompleted: userData.onboarding_completed,
          userRole: userData.role,
          userId: session.user.id
        });

        // If onboarding is not completed, redirect to complete profile regardless of verification status
        if (!userData.onboarding_completed) {
          logMiddleware(`🚫 Onboarding not completed - redirecting to complete profile:`, {
            onboardingCompleted: userData.onboarding_completed,
            userRole: userData.role,
            currentPath: req.nextUrl.pathname
          });
          
          const completeProfileUrl = process.env.NODE_ENV === 'development'
            ? 'http://localhost:3000/signup/complete-profile?from=dashboard'
            : 'https://www.kitions.com/signup/complete-profile?from=dashboard';
          return NextResponse.redirect(completeProfileUrl);
        }

        logMiddleware(`✅ Onboarding completed, checking verification status...`);
      } else {
        logMiddleware(`⚠️ Could not retrieve user data, falling back to verification check:`, onboardingError);
      }

      // Now check verification status (only if onboarding is complete or we couldn't check onboarding)
      const verificationStart = Date.now();
      logMiddleware(`📊 Querying user_verification_statuses for user_id: ${session.user.id}`);
      
      const { data: verificationStatus, error: verificationError } = await supabase
        .from('user_verification_statuses')
        .select('status')
        .eq('user_id', session.user.id)
        .single();
      
      const verificationDuration = Date.now() - verificationStart;
      logMiddleware(`⏱️ Verification query took: ${verificationDuration}ms`);

      if (verificationError) {
        logMiddleware(`⚠️ Verification status error:`, {
          message: verificationError.message,
          code: verificationError.code,
          details: verificationError.details,
          hint: verificationError.hint
        });
        
        // If there's an error fetching verification status, redirect to pending verification
        // This handles cases where the user doesn't have a verification record yet
        if (!isPendingVerification) {
          logMiddleware(`🔀 Redirecting to pending verification due to verification error`);
          return NextResponse.redirect(new URL('/pending-verification', req.url));
        }
      } else {
        logMiddleware(`✅ Verification status retrieved:`, {
          status: verificationStatus?.status,
          userId: session.user.id
        });
        
        // Check if user is verified/approved (supporting both 'verified' and 'approved' statuses)
        const isVerified = verificationStatus?.status === 'verified' || verificationStatus?.status === 'approved';
        
        logMiddleware(`🔐 User verification check:`, {
          status: verificationStatus?.status,
          isVerified,
          supportsVerified: verificationStatus?.status === 'verified',
          supportsApproved: verificationStatus?.status === 'approved'
        });
        
        if (!isVerified && !isPendingVerification) {
          logMiddleware(`🚫 User not verified - redirecting to pending verification:`, {
            currentStatus: verificationStatus?.status,
            currentPath: req.nextUrl.pathname
          });
          return NextResponse.redirect(new URL('/pending-verification', req.url));
        }

        // If user is on pending verification page but is actually verified, redirect to appropriate dashboard
        if (isVerified && isPendingVerification) {
          logMiddleware(`🔀 User is verified but on pending page - fetching user role...`);
          
          try {
            const roleStart = Date.now();
            const { data: userRoleData, error: roleError } = await supabase
              .from('users')
              .select('role')
              .eq('id', session.user.id)
              .single();
            
            const roleDuration = Date.now() - roleStart;
            logMiddleware(`⏱️ Role query took: ${roleDuration}ms`);
            
            if (roleError) {
              logMiddleware(`⚠️ Role fetch error:`, roleError);
            } else {
              logMiddleware(`👤 User role: ${userRoleData?.role}`);
            }
            
            const redirectPath = userRoleData?.role === 'distributor' ? '/distributor/home' : 
                                userRoleData?.role === 'admin' ? '/admin/dashboard' : 
                                '/retailer/home';
            logMiddleware(`🏠 Redirecting verified user to dashboard: ${redirectPath}`);
            return NextResponse.redirect(new URL(redirectPath, req.url));
          } catch (roleError) {
            logMiddleware(`💥 Unexpected role fetch error:`, roleError);
            // Continue with default redirect
            return NextResponse.redirect(new URL('/retailer/home', req.url));
          }
        }

        // Check admin access for admin routes
        if (isAdminRoute && isVerified) {
          logMiddleware(`🔐 Admin route access check for: ${req.nextUrl.pathname}`);
          
          try {
            const adminStart = Date.now();
            const { data: adminUserData, error: adminRoleError } = await supabase
              .from('users')
              .select('role')
              .eq('id', session.user.id)
              .single();
            
            const adminDuration = Date.now() - adminStart;
            logMiddleware(`⏱️ Admin role query took: ${adminDuration}ms`);
            
            if (adminRoleError) {
              logMiddleware(`⚠️ Admin role fetch error:`, adminRoleError);
              return NextResponse.redirect(new URL('/error-auth', req.url));
            } else {
              logMiddleware(`👤 User role for admin check: ${adminUserData?.role}`);
            }
            
            if (adminUserData?.role !== 'admin') {
              logMiddleware(`🚫 Access denied - user role '${adminUserData?.role}' is not admin`);
              return NextResponse.redirect(new URL('/error-auth', req.url));
            }
            
            logMiddleware(`✅ Admin access granted for user role: ${adminUserData?.role}`);
          } catch (adminError) {
            logMiddleware(`💥 Unexpected admin check error:`, adminError);
            return NextResponse.redirect(new URL('/error-auth', req.url));
          }
        }
      }
    } catch (unexpectedError) {
      logMiddleware(`💥 Unexpected error during user status check:`, unexpectedError);
      // On unexpected errors, redirect to pending verification for safety
      if (!isPendingVerification) {
        logMiddleware(`🛡️ Safety redirect to pending verification due to unexpected error`);
        return NextResponse.redirect(new URL('/pending-verification', req.url));
      }
    }
  }

  // Calculate total processing time
  const totalDuration = Date.now() - startTime;
  
  // Allow the request to proceed if:
  // 1. User is authenticated and verified
  // 2. Path is a public route (auth callback, error page, pending verification)
  // 3. URL contains auth tokens (we're in the process of setting up the session)
  const allowReason = session && !isPublicRoute ? 'Authenticated & Verified' : 
                     isPublicRoute ? 'Public Route' : 
                     hasAuthTokensInUrl ? 'Has Auth Tokens' : 
                     'Unknown';
  
  logMiddleware(`✅ Request allowed - proceeding:`, {
    path: req.nextUrl.pathname,
    reason: allowReason,
    totalProcessingTime: `${totalDuration}ms`,
    hasSession: !!session,
    isPublicRoute,
    hasAuthTokensInUrl
  });
  
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
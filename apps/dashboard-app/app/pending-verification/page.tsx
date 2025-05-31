'use client';

import { useEffect, useState, useCallback } from 'react';
import { createSupabaseBrowserClient } from '@/app/utils/supabase';
import { User } from '@supabase/supabase-js';
import { Clock, AlertCircle, Mail, LogOut, RefreshCw } from 'lucide-react';

interface VerificationStatus {
  status: 'pending' | 'verified' | 'rejected' | 'approved';
  updated_at: string;
}

export default function PendingVerificationPage() {
  const [user, setUser] = useState<User | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createSupabaseBrowserClient();

  const fetchVerificationStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Session timeout after 10 seconds'));
        }, 10000);
      });

      const sessionResult = await Promise.race([
        supabase.auth.getSession(),
        timeoutPromise
      ]);
      
      const { data: { session }, error: sessionError } = sessionResult;
      
      if (sessionError) {
        throw new Error(`Session error: ${sessionError.message}`);
      }

      if (session?.user) {
        setUser(session.user);
        
        const { data: statusData, error: statusError } = await supabase
          .from('user_verification_statuses')
          .select('status, updated_at')
          .eq('user_id', session.user.id)
          .single();
        
        if (statusError) {
          // If no record found (PGRST116), that's okay - user just hasn't been reviewed yet
          if (statusError.code === 'PGRST116') {
            setVerificationStatus(null);
          } else {
            // For other errors, show the error but don't crash
            throw new Error(`Database error: ${statusError.message} (Code: ${statusError.code})`);
          }
        } else {
          setVerificationStatus(statusData);
        }
      } else {
        setUser(null);
        setVerificationStatus(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'INITIAL_SESSION') {
          await fetchVerificationStatus();
        } else if (event === 'SIGNED_IN') {
          await fetchVerificationStatus();
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setVerificationStatus(null);
          setLoading(false);
        } else if (event === 'TOKEN_REFRESHED') {
          await fetchVerificationStatus();
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth, fetchVerificationStatus]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      
      // Redirect to public app login
      const loginUrl = process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000/login'
        : 'https://www.kitions.com/login';
      
      window.location.href = loginUrl;
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleRefreshStatus = async () => {
    await fetchVerificationStatus();
  };

  const getStatusConfig = () => {
    const status = verificationStatus?.status;
    
    if (status === 'pending') {
      return {
        icon: Clock,
        title: 'Account Verification Pending',
        message: 'Your account is currently being reviewed by our team.',
        description: 'We typically review new accounts within 1-2 business days. You\'ll receive an email notification once your account has been approved.',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        iconColor: 'text-yellow-600',
        titleColor: 'text-yellow-800'
      };
    } else if (status === 'rejected') {
      return {
        icon: AlertCircle,
        title: 'Account Verification Rejected',
        message: 'Unfortunately, your account verification was not approved.',
        description: 'Please contact our support team for more information about the rejection and steps to resubmit your application.',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        iconColor: 'text-red-600',
        titleColor: 'text-red-800'
      };
    } else {
      // Default for no status or unknown status
      return {
        icon: Clock,
        title: 'Account Verification Required',
        message: 'Your account requires verification before you can access the dashboard.',
        description: 'Our team will review your account and contact you via email with the verification status.',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        iconColor: 'text-blue-600',
        titleColor: 'text-blue-800'
      };
    }
  };

  useEffect(() => {
    if (loading) {
      const timeout = setTimeout(() => {
        if (loading) {
          setLoading(false);
          setError('Loading timeout - please refresh the page or contact support');
        }
      }, 15000);
      
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-sm text-gray-600">Loading verification status...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-sm max-w-md w-full mx-4">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Status</h2>
            <p className="text-sm text-gray-600 mb-4">{error}</p>
            <div className="space-y-2">
              <button
                onClick={handleRefreshStatus}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={handleSignOut}
                className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Kitions</h1>
          <p className="text-sm text-gray-600">Dashboard Access</p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className={`rounded-lg p-4 ${statusConfig.bgColor} ${statusConfig.borderColor} border`}>
            <div className="flex items-center">
              <StatusIcon className={`h-6 w-6 ${statusConfig.iconColor} flex-shrink-0`} />
              <div className="ml-3">
                <h3 className={`text-sm font-medium ${statusConfig.titleColor}`}>
                  {statusConfig.title}
                </h3>
                <div className={`mt-2 text-sm ${statusConfig.titleColor.replace('800', '700')}`}>
                  <p>{statusConfig.message}</p>
                </div>
              </div>
            </div>
            <div className={`mt-4 text-sm ${statusConfig.titleColor.replace('800', '600')}`}>
              <p>{statusConfig.description}</p>
            </div>
          </div>

          {user && (
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-900">Account Information</h4>
                <button
                  onClick={handleRefreshStatus}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Refresh verification status"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p><span className="font-medium">Email:</span> {user.email}</p>
                {verificationStatus && (
                  <p>
                    <span className="font-medium">Status:</span> 
                    <span className={`ml-1 capitalize font-medium ${
                      verificationStatus.status === 'pending' ? 'text-yellow-600' :
                      verificationStatus.status === 'rejected' ? 'text-red-600' :
                      'text-blue-600'
                    }`}>
                      {verificationStatus.status}
                    </span>
                  </p>
                )}
                {verificationStatus?.updated_at && (
                  <p>
                    <span className="font-medium">Last Updated:</span> 
                    {' '}{new Date(verificationStatus.updated_at).toLocaleDateString()}
                  </p>
                )}
                {!verificationStatus && (
                  <p>
                    <span className="font-medium">Status:</span> 
                    <span className="ml-1 capitalize font-medium text-blue-600">
                      Under Review
                    </span>
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="mt-6 space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-blue-800">Need Help?</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Contact our support team at{' '}
                    <a 
                      href="mailto:support@kitions.com" 
                      className="font-medium underline hover:text-blue-800"
                    >
                      support@kitions.com
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 
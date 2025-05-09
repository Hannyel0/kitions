'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faSpinner, faHome, faPhone, faEnvelope, faGlobe, faUser } from '@fortawesome/free-solid-svg-icons';

// Map product names to display names
const PRODUCT_NAME_MAP: Record<string, string> = {
  "Kitions Websites Pro": "Pro Website Plan",
  "Kitions Websites Enterprise": "Enterprise Website Plan",
  "Basic": "Basic Website Plan"
};

// Map website types to display names
const WEBSITE_TYPE_MAP: Record<string, string> = {
  "business": "Business Website",
  "ecommerce": "E-commerce Store",
  "portfolio": "Portfolio Website",
  "blog": "Blog Website",
  "other": "Custom Website"
};

type SessionData = {
  planName?: string;
  websiteType?: string;
  customerName?: string;
  customerEmail?: string;
  phoneNumber?: string;
};


export default function SuccessClientPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError('No session ID provided');
      setLoading(false);
      return;
    }

    // Fetch session details from our API
    const fetchSessionDetails = async () => {
      try {
        const response = await fetch(`/api/stripe/verify-session?session_id=${sessionId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to verify payment');
        }

        console.log('Session data received:', data);
        setSessionData(data);
        setLoading(false);
      } catch (err) {
        console.error('Error verifying session:', err);
        setError('Could not verify your payment. Please contact support.');
        setLoading(false);
      }
    };

    // Actually fetch the session details instead of simulating
    fetchSessionDetails();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} className="text-[#8982cf] text-5xl animate-spin mb-4" />
          <h1 className="text-2xl font-bold text-gray-800">Processing your payment...</h1>
          <p className="text-gray-600 mt-2">Please wait while we confirm your subscription.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-center">
            <div className="bg-red-100 text-red-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <FontAwesomeIcon icon={faCheckCircle} className="text-3xl" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Error</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link href="/" className="btn-primary inline-flex items-center">
              <FontAwesomeIcon icon={faHome} className="mr-2" />
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Get a friendly plan name from our mapping or use the raw plan name
  const displayPlanName = sessionData?.planName ? 
    PRODUCT_NAME_MAP[sessionData.planName] || sessionData.planName : 
    'Website Plan';
    
  // Get a friendly website type name
  const websiteType = sessionData?.websiteType ? 
    WEBSITE_TYPE_MAP[sessionData.websiteType] || sessionData.websiteType : 
    'Website';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="text-center">
          <div className="bg-green-100 text-green-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon icon={faCheckCircle} className="text-3xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for subscribing to our <span className="font-semibold">{displayPlanName}</span>.
          </p>
          
          {/* Order details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4 text-left">
            <h3 className="font-medium text-gray-700 mb-3">Order Details</h3>
            <ul className="space-y-3">
              <li className="flex items-start text-sm text-gray-600">
                <FontAwesomeIcon icon={faGlobe} className="text-[#8982cf] mt-1 mr-3 w-4" />
                <div>
                  <span className="font-medium">Plan Type:</span>
                  <span className="block">{displayPlanName}</span>
                </div>
              </li>
              
              {sessionData?.websiteType && (
                <li className="flex items-start text-sm text-gray-600">
                  <FontAwesomeIcon icon={faGlobe} className="text-[#8982cf] mt-1 mr-3 w-4" />
                  <div>
                    <span className="font-medium">Website Type:</span>
                    <span className="block">{websiteType}</span>
                  </div>
                </li>
              )}
              
              {sessionData?.customerName && (
                <li className="flex items-start text-sm text-gray-600">
                  <FontAwesomeIcon icon={faUser} className="text-[#8982cf] mt-1 mr-3 w-4" />
                  <div>
                    <span className="font-medium">Name:</span>
                    <span className="block">{sessionData.customerName}</span>
                  </div>
                </li>
              )}
              
              {sessionData?.customerEmail && (
                <li className="flex items-start text-sm text-gray-600">
                  <FontAwesomeIcon icon={faEnvelope} className="text-[#8982cf] mt-1 mr-3 w-4" />
                  <div>
                    <span className="font-medium">Email:</span>
                    <span className="block">{sessionData.customerEmail}</span>
                  </div>
                </li>
              )}
              
              {sessionData?.phoneNumber && (
                <li className="flex items-start text-sm text-gray-600">
                  <FontAwesomeIcon icon={faPhone} className="text-[#8982cf] mt-1 mr-3 w-4" />
                  <div>
                    <span className="font-medium">Phone:</span>
                    <span className="block">{sessionData.phoneNumber}</span>
                  </div>
                </li>
              )}
            </ul>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-medium text-gray-700 mb-2">What happens next?</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>You&apos;ll receive a confirmation email shortly.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Our team will contact you within 24 hours to start building your {websiteType.toLowerCase()}.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>We&apos;ll set up an initial consultation to understand your specific requirements.</span>
              </li>
            </ul>
          </div>
          
          <Link href="/" className="btn-primary inline-flex items-center">
            <FontAwesomeIcon icon={faHome} className="mr-2" />
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 
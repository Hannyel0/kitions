'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faArrowRight, faSpinner, faTimes, faEnvelope } from '@fortawesome/free-solid-svg-icons';

// Mapping of Stripe product IDs to their price IDs
// Price IDs are what we actually need for the checkout
const STRIPE_PRICE_MAP = {
  // Basic plan
  "prod_SGsFjKed2Kz5zQ": "price_1RMKV3GhNGM7Ot8ZsYakl5X3", // Basic plan price ID
  // Pro plan
  "prod_SH2aIyBsYi0nHe": "price_1RMUV1GhNGM7Ot8Z7EMMeGUV", // Pro plan price ID
  // Enterprise plan
  "prod_SH2c90AFjaPO88": "price_1RMUXCGhNGM7Ot8Z5cMDUeID", // Enterprise plan price ID
};

export default function PricingPreview() {
  const [loading, setLoading] = useState<string | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<{productId: string, planName: string} | null>(null);
  
  const modalRef = useRef<HTMLDivElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  
  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        closeModal();
      }
    }
    
    if (showEmailModal) {
      document.addEventListener('mousedown', handleClickOutside);
      // Focus email input when modal opens
      setTimeout(() => emailInputRef.current?.focus(), 100);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmailModal]);
  
  // Validate email format
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  
  // Handle the initial "Get started" button click
  const handleGetStarted = (productId: string, planName: string) => {
    setSelectedPlan({ productId, planName });
    setShowEmailModal(true);
  };
  
  // Close the modal and reset state
  const closeModal = () => {
    setShowEmailModal(false);
    setLoading(null);
    setEmailError('');
    // Don't clear the email to provide a better UX if they try again
  };
  
  // Handle email input change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError) setEmailError('');
  };
  
  // Handle email form submission
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setEmailError('Please enter your email address');
      return;
    }
    
    if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    
    if (selectedPlan) {
      processCheckout(selectedPlan.productId, selectedPlan.planName, email);
    }
  };

  // Function to handle the checkout process after collecting email
  const processCheckout = async (productId: string, planName: string, customerEmail: string) => {
    try {
      console.log(`Starting checkout process for ${planName} (Product ID: ${productId})`);
      setLoading(planName);
      
      // Get the price ID from our mapping
      const priceId = STRIPE_PRICE_MAP[productId as keyof typeof STRIPE_PRICE_MAP];
      
      if (!priceId) {
        console.error(`No price ID found for product ID: ${productId}`);
        throw new Error(`Price ID not found for product: ${planName}`);
      }
      
      console.log(`Using price ID: ${priceId} for plan: ${planName}`);
      console.log(`Customer email: ${customerEmail}`);
      
      const requestBody = {
        priceId,
        planName,
        customerEmail,
      };
      
      console.log('Sending request to create checkout session:', requestBody);
      
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      console.log('Received response:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response from server:', errorText);
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.url) {
        console.log('Redirecting to checkout URL:', data.url);
        window.location.href = data.url;
      } else {
        console.error('No URL in response data:', data);
        throw new Error('No checkout URL returned from server');
      }
    } catch (error) {
      console.error('Error during checkout process:', error);
      // Display more specific error message if available
      if (error instanceof Error) {
        setEmailError(`Error: ${error.message}`);
      } else {
        setEmailError('Something went wrong. Please try again.');
      }
      setLoading(null);
    }
  };

  const plans = [
    {
      name: "Basic",
      description: "For small businesses that want to be online.",
      price: "$35",
      isPopular: false,
      productId: "prod_SGsFjKed2Kz5zQ", // Product ID from Stripe
      features: [
        "1-page website",
        "Responsive design",
        "Basic contact form",
      ]
    },
    {
      name: "Pro",
      description: "Perfect for growing businesses that want an impactful website.",
      price: "$50",
      isPopular: true,
      productId: "prod_SH2aIyBsYi0nHe", // Product ID from Stripe
      features: [
        "Multiple pages",
        "Responsive design",
        "Personalized support",
        "Analytics of your website",
        "Bussiness strategy for your website",
        "Holiday updates",
        "Monthly improvements of the website"
      ]
    },
    {
      name: "Enterprise",
      description: "For established businesses with advanced needs.",
      price: "$99",
      isPopular: false,
      productId: "prod_SH2c90AFjaPO88", // Product ID from Stripe
      features: [
        "Everything in Pro",
        "Unlimited pages",
        "Advanced forms & integrations",
        "Full e-commerce functionality",
        "Bi-weekly strategy calls"
      ]
    }
  ];

  return (
    <>
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              No hidden fees, no long-term contracts. Just affordable monthly subscriptions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div 
                key={index} 
                className={`bg-white rounded-lg p-8 shadow-sm flex flex-col h-full ${
                  !plan.isPopular 
                    ? 'border border-gray-200 hover:border-[#8982cf] transition-colors'
                    : 'border-2 border-[#8982cf] relative shadow-lg'
                }`}
                style={{ 
                  minHeight: '540px',
                  ...(plan.isPopular && { 
                    background: 'linear-gradient(145deg, #ffffff, #f8f7fd, #f5f3fc)',
                  })
                }}
              >
                {plan.isPopular && (
                  <div className="absolute top-0 right-8 bg-[#8982cf] text-white text-xs font-bold px-3 py-1.5 rounded-b-md">
                    BEST VALUE
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-[#8982cf] mb-3">{plan.name}</h3>
                  <p className="text-gray-600 text-sm mb-6">
                    {plan.description}
                  </p>
                  <div className="text-4xl font-bold text-gray-800">
                    {plan.price}
                    <span className="text-base font-normal text-gray-500">/month</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <FontAwesomeIcon icon={faCheck} className="text-[#8982cf] mt-1 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto">
                  <button 
                    onClick={() => handleGetStarted(plan.productId, plan.name)}
                    disabled={loading !== null}
                    className={`${
                      plan.isPopular ? "btn-primary" : "btn-secondary"
                    } w-full block text-center relative`}
                  >
                    {loading === plan.name ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                        Processing...
                      </>
                    ) : "Get started"}
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Need something custom? We&apos;re happy to create a tailored solution.
            </p>
            <Link href="/contact" className="inline-flex items-center text-[#8982cf] font-semibold hover:underline">
              Contact us for a custom quote
              <FontAwesomeIcon icon={faArrowRight} className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* Email Collection Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-4">
          <div 
            ref={modalRef}
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative animate-fadeIn"
          >
            {/* Close button */}
            <button 
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
            </button>
            
            <div className="text-center mb-6">
              <div className="bg-[#8982cf]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faEnvelope} className="h-7 w-7 text-[#8982cf]" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Enter your email to continue</h3>
              <p className="text-gray-600 text-sm mt-2">
                We&apos;ll use this email for your subscription and to contact you about your website.
              </p>
            </div>
            
            <form onSubmit={handleEmailSubmit}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  ref={emailInputRef}
                  type="email"
                  id="email"
                  name="email"
                  placeholder="youremail@example.com"
                  value={email}
                  onChange={handleEmailChange}
                  className={`w-full px-4 py-2 border ${emailError ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-[#8982cf] focus:border-[#8982cf] outline-none`}
                  required
                />
                {emailError && (
                  <p className="mt-1 text-red-500 text-sm">{emailError}</p>
                )}
              </div>
              
              <div className="flex items-center justify-between mt-8">
                <button
                  type="button"
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading !== null}
                  className="btn-primary py-2 px-6 flex items-center"
                >
                  {loading !== null ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Continue to checkout
                    </>
                  )}
                </button>
              </div>
              
              <p className="text-xs text-gray-500 mt-4 text-center">
                By continuing, you agree to our <Link href="/terms" className="text-[#8982cf] hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-[#8982cf] hover:underline">Privacy Policy</Link>.
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
} 
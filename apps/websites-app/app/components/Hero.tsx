'use client';

import { useState } from "react";
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocket, faEnvelope, faPhone, faUser, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

interface HeroProps {
  title: string;
  subtitle: string;
  description?: string;
}

export default function Hero({ title, subtitle, description }: HeroProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing again
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      // Call the real API endpoint
      const response = await fetch('/api/proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        // Handle error response
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit proposal');
      }
      
      setSubmitted(true);
      setFormData({ fullName: '', email: '', phone: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
      setError(error instanceof Error ? error.message : 'There was an error submitting your request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative min-h-[calc(100vh-64px)] flex items-center justify-center px-4 overflow-hidden bg-[radial-gradient(theme(colors.gray.200)_1px,transparent_1px)] bg-[size:20px_20px]">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none"></div>
      <div className="absolute top-0 left-0 right-0 h-[70%] bg-gradient-to-b from-[#f5f3ff] to-transparent"></div>
      <div className="absolute bottom-0 right-0 w-[30%] h-[60%] rounded-full bg-[#8982cf]/10 blur-[100px]"></div>
      <div className="absolute bottom-[20%] left-[5%] w-[25%] h-[40%] rounded-full bg-[#dbc1d0]/10 blur-[80px]"></div>
      
      <div className="container mx-auto max-w-7xl relative z-10 py-12 md:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-6"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold gradient-text">
              {title}
            </h1>
            <h2 className="text-xl md:text-2xl text-gray-600 mb-8">
              {subtitle}
            </h2>
            {description && (
              <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-12">
                {description}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Link href="/pricing" className="py-4 px-8 text-lg font-medium text-white bg-[#8982cf] rounded-lg shadow-md hover:bg-[#7873b3] transition-colors text-center w-full sm:w-auto">
                View pricing plans
              </Link>

            </div>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden">
                  <Image 
                    src="/logo2.webp" 
                    alt="Business logo" 
                    width={32} 
                    height={32} 
                    className="object-cover"
                  />
                </div>
                <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden">
                  <Image 
                    src="/firstLogo.avif" 
                    alt="Business logo" 
                    width={32} 
                    height={32} 
                    className="object-cover"
                  />
                </div>
                <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden">
                  <Image 
                    src="/ll.png" 
                    alt="Business logo" 
                    width={32} 
                    height={32} 
                    className="object-cover"
                  />
                </div>
                <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden">
                  <Image 
                    src="/trianglelogo.png" 
                    alt="Business logo" 
                    width={32} 
                    height={32} 
                    className="object-cover"
                  />
                </div>
              </div>
              <p className="text-sm text-gray-600">
              Built for small businesses ready to grow online!
              </p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-white p-8 rounded-lg shadow-xl">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="h-20 w-20 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Thanks for your submission!</h3>
                  <p className="text-gray-600 mb-6">We&apos;ll get back to you to talk about your website as soon as possible.</p>
                  <button 
                    onClick={() => setSubmitted(false)} 
                    className="text-[#8982cf] font-medium hover:underline"
                  >
                    Submit another request
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Get a Free Proposal</h2>
                  <p className="text-gray-600 mb-6">Fill out the form below and we&apos;ll create a personalized proposal for your business website.</p>
                  
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faExclamationCircle} className="h-5 w-5 mr-2 text-red-500" />
                        <span>{error}</span>
                      </div>
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-gray-700 mb-1 font-medium">Full Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FontAwesomeIcon icon={faUser} className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          required
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8982cf]/50 focus:border-[#8982cf]"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-1 font-medium">Email Address</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FontAwesomeIcon icon={faEnvelope} className="text-gray-400" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8982cf]/50 focus:border-[#8982cf]"
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-1 font-medium">Phone Number</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FontAwesomeIcon icon={faPhone} className="text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8982cf]/50 focus:border-[#8982cf]"
                          placeholder="+1 (234) 567-8901"
                        />
                      </div>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={` cursor-pointer w-full py-3 px-4 bg-[#8982cf] text-white font-medium rounded-lg shadow-md hover:bg-[#7873b3] focus:outline-none focus:ring-2 focus:ring-[#8982cf]/50 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {isSubmitting ? 'Processing...' : 'Get a Free Proposal'}
                    </button>
                  </form>
                </>
              )}
            </div>
            <div className="absolute -bottom-5 -left-5 p-4 bg-white rounded-lg shadow-lg">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faRocket} className="text-[#8982cf] h-5 w-5" />
                <p className="font-semibold">Average launch time: 3-5 days</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 
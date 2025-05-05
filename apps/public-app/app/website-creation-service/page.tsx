'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheck, 
  faPhone, 
  faEnvelope, 
  faLocationDot
} from '@fortawesome/free-solid-svg-icons';
import {
  faFacebookF,
  faTwitter,
  faInstagram,
  faLinkedinIn,
  faXTwitter
} from '@fortawesome/free-brands-svg-icons';

export default function WebsiteCreationServicePage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    serviceType: 'webDevelopment',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  // Add title to document when component mounts
  useEffect(() => {
    document.title = 'Website Creation Service | Kitions';
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRadioChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      serviceType: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent double submission
    
    setIsSubmitting(true);
    setNotification(null); // Clear previous notification
    
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (res.ok) {
        setNotification({ type: 'success', message: 'Message sent successfully! We will get back to you soon.' });
        // Optionally reset the form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          serviceType: 'webDevelopment',
          message: ''
        });
      } else {
        const errorData = await res.json().catch(() => ({})); // Try to parse error
        setNotification({ type: 'error', message: errorData.error || 'Failed to send message. Please try again.' });
      }
    } catch (error) {
      console.error(error);
      setNotification({ type: 'error', message: 'An error occurred while sending the message.' });
    } finally {
      setIsSubmitting(false);
      // Auto-hide notification after 5 seconds
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    }
  };

  return (
    <main 
      className="pt-24 min-h-screen bg-white relative overflow-hidden"
    >
      {/* Mesh gradient overlay with dots */}
      <div 
        className="absolute inset-0 
                   bg-[radial-gradient(theme(colors.gray.200)_1px,transparent_1px)] 
                   bg-[size:20px_20px]"
      >
        {/* Gradient layers remain inside */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-[#f5f3ff] opacity-100"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#8982cf]/20"></div>
        <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-[#f0ebff] to-transparent"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-[#8982cf]/10 blur-[100px]"></div>
        <div className="absolute bottom-[-5%] left-[-5%] w-[40%] h-[40%] rounded-full bg-[#dbc1d0]/10 blur-[100px]"></div>
      </div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <h1 
          className="text-6xl font-bold text-center mb-6 
                     bg-gradient-to-b from-gray-900 via-gray-800 to-[#8982cf]/50 
                     bg-clip-text text-transparent"
        >
          Plans that grow with your brand
        </h1>
        
        <div className="mb-12">
          <p className="text-center text-gray-600 mb-2">
          Affordable, fast, and mobile-ready websites to help your business grow online.
          </p>
          <p className="text-center text-gray-600 mb-8">
            Customize your subscription for a seamless fit!
          </p>
          
          {/* Pricing cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Basic Plan - Updated Price */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:border-[#8982cf] transition-colors">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-[#8982cf] mb-3">Basic</h3>
                <p className="text-gray-600 text-sm mb-6">
                  Ideal for those who've already got their website up and running and are seeking assistance to enhance and update it further.
                </p>
                <div className="text-4xl font-bold text-gray-800">
                  $35
                  <span className="text-base font-normal text-gray-500">/month</span>
                </div>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <FontAwesomeIcon icon={faCheck} className="text-[#8982cf] mt-1 mr-2" />
                  <span>3-5 day turnaround</span>
                </li>
                <li className="flex items-start">
                  <FontAwesomeIcon icon={faCheck} className="text-[#8982cf] mt-1 mr-2" />
                  <span>Native Development</span>
                </li>
                <li className="flex items-start">
                  <FontAwesomeIcon icon={faCheck} className="text-[#8982cf] mt-1 mr-2" />
                  <span>Task delivered one-by-one</span>
                </li>
                <li className="flex items-start">
                  <FontAwesomeIcon icon={faCheck} className="text-[#8982cf] mt-1 mr-2" />
                  <span>Dedicated dashboard</span>
                </li>
                <li className="flex items-start">
                  <FontAwesomeIcon icon={faCheck} className="text-[#8982cf] mt-1 mr-2" />
                  <span>Updates via Dashboard & Slack</span>
                </li>
              </ul>
              
              <button className="cursor-pointer w-full py-3 border border-[#8982cf] bg-white rounded-lg text-[#8982cf] font-medium hover:bg-[#f2f0ff] transition-colors">
                Get started
              </button>
            </div>
            
            {/* Pro Plan - Updated Price */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:border-[#8982cf] transition-colors">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-[#8982cf] mb-3">Pro</h3>
                <p className="text-gray-600 text-sm mb-6">
                  Ideal if you want to build or scale your website fast, with the strategy calls included.
                </p>
                <div className="text-4xl font-bold text-gray-800">
                  $50
                  <span className="text-base font-normal text-gray-500">/month</span>
                </div>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <FontAwesomeIcon icon={faCheck} className="text-[#8982cf] mt-1 mr-2" />
                  <span>1-3 day turnaround</span>
                </li>
                <li className="flex items-start">
                  <FontAwesomeIcon icon={faCheck} className="text-[#8982cf] mt-1 mr-2" />
                  <span>Monthly strategy call</span>
                </li>
                <li className="flex items-start">
                  <FontAwesomeIcon icon={faCheck} className="text-[#8982cf] mt-1 mr-2" />
                  <span>Commercial license</span>
                </li>
                <li className="flex items-start">
                  <FontAwesomeIcon icon={faCheck} className="text-[#8982cf] mt-1 mr-2" />
                  <span>Native Development</span>
                </li>
                <li className="flex items-start">
                  <FontAwesomeIcon icon={faCheck} className="text-[#8982cf] mt-1 mr-2" />
                  <span>Tasks delivered one-by-one</span>
                </li>
                <li className="flex items-start">
                  <FontAwesomeIcon icon={faCheck} className="text-[#8982cf] mt-1 mr-2" />
                  <span>Dedicated dashboard</span>
                </li>
                <li className="flex items-start">
                  <FontAwesomeIcon icon={faCheck} className="text-[#8982cf] mt-1 mr-2" />
                  <span>Updates via Dashboard & Slack</span>
                </li>
              </ul>
              
              <button className="cursor-pointer w-full py-3 border border-[#8982cf] bg-white rounded-lg text-[#8982cf] font-medium hover:bg-[#f2f0ff] transition-colors">
                Get started
              </button>
            </div>
            
            {/* Custom Plan */}
            <div className="bg-[#f2f0ff] border border-[#8982cf] rounded-lg p-6 shadow-sm">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-[#8982cf] mb-3">Custom</h3>
                <p className="text-gray-600 text-sm mb-6">
                  If these plans don't fit, let's create one that suits. Customize your subscription for a perfect fit, bigger or smaller!
                </p>
                <div className="text-4xl font-bold text-gray-800 mb-1">
                  Let's Talk!
                </div>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <FontAwesomeIcon icon={faCheck} className="text-[#8982cf] mt-1 mr-2" />
                  <span>Everything in design & development</span>
                </li>
                <li className="flex items-start">
                  <FontAwesomeIcon icon={faCheck} className="text-[#8982cf] mt-1 mr-2" />
                  <span>Strategy workshop</span>
                </li>
                <li className="flex items-start">
                  <FontAwesomeIcon icon={faCheck} className="text-[#8982cf] mt-1 mr-2" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-start">
                  <FontAwesomeIcon icon={faCheck} className="text-[#8982cf] mt-1 mr-2" />
                  <span>Multiple tasks at once</span>
                </li>
                <li className="flex items-start">
                  <FontAwesomeIcon icon={faCheck} className="text-[#8982cf] mt-1 mr-2" />
                  <span>Ongoing autonomous A/B testing</span>
                </li>
                <li className="flex items-start">
                  <FontAwesomeIcon icon={faCheck} className="text-[#8982cf] mt-1 mr-2" />
                  <span>Advanced custom development</span>
                </li>
              </ul>
              
              <button className="cursor-pointer w-full py-3 bg-[#8982cf] text-white rounded-lg font-medium hover:bg-[#7873b3] transition-colors">
                Book a Call
              </button>
            </div>
          </div>
        </div>
        
        
        {/* Contact Form Section */}
        <div className="bg-white rounded-lg overflow-hidden shadow-lg mb-16 mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row">
            {/* Left Column - Contact Information */}
            <div className="bg-[#8982cf] text-white p-10 md:w-2/5">
              <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
              <p className="mb-12">Fill up the form and our Team will get back to you within 24 hours.</p>
              
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#9c96d5]">
                    <FontAwesomeIcon icon={faPhone} className="h-4 w-4" />
                  </div>
                  <span className="ml-4">+1 (234) 567-8901</span>
                </div>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#9c96d5]">
                    <FontAwesomeIcon icon={faEnvelope} className="h-4 w-4" />
                  </div>
                  <span className="ml-4">support@kitions.com</span>
                </div>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#9c96d5]">
                    <FontAwesomeIcon icon={faLocationDot} className="h-4 w-4" />
                  </div>
                  <span className="ml-4">1032 E Brandon blvd #1478<br />Brandon, FL 33511<br />United States</span>
                </div>
              </div>
              
              {/* Social Media Icons */}
              <div className="mt-16 flex space-x-4">
                <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-[#9c96d5] hover:bg-[#f2f0ff] hover:text-[#8982cf] transition-colors">
                  <FontAwesomeIcon icon={faFacebookF} className="h-4 w-4" />
                </a>
                <a href="https://x.com/kitionsus" className="w-10 h-10 flex items-center justify-center rounded-full bg-[#9c96d5] hover:bg-[#f2f0ff] hover:text-[#8982cf] transition-colors">
                  <FontAwesomeIcon icon={faXTwitter} className="h-4 w-4" />
                </a>
                <a href="https://www.instagram.com/kitionsus/" className="w-10 h-10 flex items-center justify-center rounded-full bg-[#9c96d5] hover:bg-[#f2f0ff] hover:text-[#8982cf] transition-colors">
                  <FontAwesomeIcon icon={faInstagram} className="h-4 w-4" />
                </a>

              </div>
              
              {/* Decorative circle */}
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-[#a59edb] rounded-full opacity-40 transform translate-x-1/3 translate-y-1/3"></div>
            </div>
            
            {/* Right Column - Form Fields */}
            <div className="p-10 md:w-3/5">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="firstName" className="block text-gray-600 mb-2">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full border-b border-gray-300 py-2 px-1 focus:outline-none focus:border-[#8982cf]"
                      placeholder="John"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-gray-600 mb-2">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full border-b border-gray-300 py-2 px-1 focus:outline-none focus:border-[#8982cf]"
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="email" className="block text-gray-600 mb-2">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full border-b border-gray-300 py-2 px-1 focus:outline-none focus:border-[#8982cf]"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-gray-600 mb-2">Phone</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full border-b border-gray-300 py-2 px-1 focus:outline-none focus:border-[#8982cf]"
                      placeholder="+1 (234) 567-8901"
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <p className="text-gray-600 mb-3">What type of website do you need?</p>
                  <div className="flex flex-wrap gap-6">

                    
                    <label className="flex items-center cursor-pointer">
                      <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${formData.serviceType === 'webDevelopment' ? 'border-[#8982cf] bg-[#f2f0ff]' : 'border-gray-300'}`}>
                        {formData.serviceType === 'webDevelopment' && (
                          <div className="w-3 h-3 rounded-full bg-[#8982cf]"></div>
                        )}
                      </div>
                      <input
                        type="radio"
                        name="serviceType"
                        value="webDevelopment"
                        checked={formData.serviceType === 'webDevelopment'}
                        onChange={() => handleRadioChange('webDevelopment')}
                        className="sr-only"
                      />
                      <span className="ml-2">Web Development</span>
                    </label>
                    
                    
                    
                    <label className="flex items-center cursor-pointer">
                      <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${formData.serviceType === 'other' ? 'border-[#8982cf] bg-[#f2f0ff]' : 'border-gray-300'}`}>
                        {formData.serviceType === 'other' && (
                          <div className="w-3 h-3 rounded-full bg-[#8982cf]"></div>
                        )}
                      </div>
                      <input
                        type="radio"
                        name="serviceType"
                        value="other"
                        checked={formData.serviceType === 'other'}
                        onChange={() => handleRadioChange('other')}
                        className="sr-only"
                      />
                      <span className="ml-2">Other</span>
                    </label>
                  </div>
                </div>
                
                <div className="mb-8">
                  <label htmlFor="message" className="block text-gray-600 mb-2">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full border-b border-gray-300 py-2 px-1 focus:outline-none focus:border-[#8982cf]"
                    placeholder="Write your message..."
                    rows={4}
                  ></textarea>
                </div>
                
                <div className="text-right mt-4">
                  <button
                    type="submit"
                    className={`bg-[#8982cf] text-white py-3 px-8 rounded-lg font-medium transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#7873b3]'}`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                  
                  {/* Notification Area */}
                  {notification && (
                    <div 
                      className={`mt-4 p-3 rounded-lg text-sm ${ 
                        notification.type === 'success' 
                          ? 'bg-green-100 border border-green-200 text-green-800' 
                          : 'bg-red-100 border border-red-200 text-red-800'
                      }`}
                      role="alert"
                    >
                      {notification.message}
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 
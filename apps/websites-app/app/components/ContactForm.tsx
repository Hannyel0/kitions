'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEnvelope, 
  faLocationDot
} from '@fortawesome/free-solid-svg-icons';
import {
  faFacebookF,
  faInstagram,
  faXTwitter
} from '@fortawesome/free-brands-svg-icons';

interface ContactFormProps {
  title?: string;
  subtitle?: string;
  phone?: string;
  email?: string;
  address?: {
    line1: string;
    line2: string;
    line3: string;
  };
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
}

export default function ContactForm({
  title = 'Contact Information',
  subtitle = 'Fill up the form and our Team will get back to you within 24 hours.',
  email = 'support@kitions.com',
  address = {
    line1: '1032 E Brandon blvd #1478',
    line2: 'Brandon, FL 33511',
    line3: 'United States'
  },
  socialLinks = {
    facebook: '#',
    twitter: 'https://x.com/kitionsus',
    instagram: 'https://www.instagram.com/kitionsus/'
  }
}: ContactFormProps) {
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
        // Reset the form
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
    <div className="bg-white rounded-lg overflow-hidden shadow-lg mb-16 mx-auto max-w-6xl">
      <div className="flex flex-col md:flex-row">
        {/* Left Column - Contact Information */}
        <div className="bg-[#8982cf] text-white p-10 md:w-2/5 relative">
          <h2 className="text-3xl font-bold mb-6">{title}</h2>
          <p className="mb-12">{subtitle}</p>
          
          <div className="space-y-6">

            
            <div className="flex items-center">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#9c96d5]">
                <FontAwesomeIcon icon={faEnvelope} className="h-4 w-4" />
              </div>
              <span className="ml-4">{email}</span>
            </div>
            
            <div className="flex items-center">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#9c96d5]">
                <FontAwesomeIcon icon={faLocationDot} className="h-4 w-4" />
              </div>
              <span className="ml-4">{address.line1}<br />{address.line2}<br />{address.line3}</span>
            </div>
          </div>
          
          {/* Social Media Icons */}
          <div className="mt-16 flex space-x-4">
            {socialLinks.facebook && (
              <a href={socialLinks.facebook} className="w-10 h-10 flex items-center justify-center rounded-full bg-[#9c96d5] hover:bg-[#f2f0ff] hover:text-[#8982cf] transition-colors">
                <FontAwesomeIcon icon={faFacebookF} className="h-4 w-4" />
              </a>
            )}
            {socialLinks.twitter && (
              <a href={socialLinks.twitter} className="w-10 h-10 flex items-center justify-center rounded-full bg-[#9c96d5] hover:bg-[#f2f0ff] hover:text-[#8982cf] transition-colors">
                <FontAwesomeIcon icon={faXTwitter} className="h-4 w-4" />
              </a>
            )}
            {socialLinks.instagram && (
              <a href={socialLinks.instagram} className="w-10 h-10 flex items-center justify-center rounded-full bg-[#9c96d5] hover:bg-[#f2f0ff] hover:text-[#8982cf] transition-colors">
                <FontAwesomeIcon icon={faInstagram} className="h-4 w-4" />
              </a>
            )}
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
  );
} 
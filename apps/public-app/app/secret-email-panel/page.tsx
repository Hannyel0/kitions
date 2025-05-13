'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faUser, faPaperPlane, faCircleCheck, faCircleXmark, faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import { URLs } from '@/app/config/urls';

export default function SecretEmailPanel() {
  const searchParams = useSearchParams();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormValid, setIsFormValid] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    show: boolean;
    success: boolean;
    message: string;
  }>({
    show: false,
    success: false,
    message: '',
  });

  // Form state
  const [formData, setFormData] = useState({
    to: '',
    subject: '',
    message: '',
  });

  // Validate the secret key from URL
  useEffect(() => {
    const validateKey = async () => {
      const key = searchParams.get('key');
      console.log('Key from URL:', key); // Debug log
      
      if (!key) {
        setIsAuthorized(false);
        setValidationError('No key provided');
        setIsLoading(false);
        return;
      }

      // TEMPORARY DEVELOPMENT SOLUTION - REMOVE BEFORE PRODUCTION
      if (key === 'correr83') {
        console.log('Using hardcoded key validation (DEV ONLY)');
        setIsAuthorized(true);
        setIsLoading(false);
        return;
      }

      try {
        console.log('Validating key with endpoint:', `${URLs.api.base}${URLs.api.secretEmailValidate}`);
        
        // Validate the key with the server
        const response = await fetch(`${URLs.api.base}${URLs.api.secretEmailValidate}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${key}`,
          },
        });
        
        const data = await response.json();
        console.log('Validation response:', response.status, data);
        
        setIsAuthorized(response.ok);
        if (!response.ok) {
          setValidationError(data.error || 'Invalid key');
        }
      } catch (error) {
        console.error('Validation error:', error);
        setIsAuthorized(false);
        setValidationError('Error during validation');
      } finally {
        setIsLoading(false);
      }
    };

    validateKey();
  }, [searchParams]);

  // Check if form is valid
  useEffect(() => {
    const { to, subject, message } = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    setIsFormValid(
      to.trim() !== '' && 
      emailRegex.test(to) && 
      subject.trim() !== '' && 
      message.trim() !== ''
    );
  }, [formData]);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const key = searchParams.get('key');
      const response = await fetch(`${URLs.api.base}${URLs.api.secretEmail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`,
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      // Show notification
      if (response.ok) {
        setNotification({
          show: true,
          success: true,
          message: 'Email sent successfully!',
        });
        
        // Reset form
        setFormData({
          to: '',
          subject: '',
          message: '',
        });
      } else {
        setNotification({
          show: true,
          success: false,
          message: data.error || 'Failed to send email.',
        });
      }
    } catch (error) {
      setNotification({
        show: true,
        success: false,
        message: 'An error occurred.',
      });
    } finally {
      setIsLoading(false);
      
      // Hide notification after 5 seconds
      setTimeout(() => {
        setNotification((prev) => ({ ...prev, show: false }));
      }, 5000);
    }
  };

  // If loading, show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <motion.div 
          className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4">
              <svg className="animate-spin w-full h-full text-[#8982cf]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p className="text-gray-600">Validating access...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  // If not authorized, show unauthorized message
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <motion.div 
          className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FontAwesomeIcon icon={faLock} className="text-red-500 text-2xl" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Unauthorized Access</h1>
            <p className="text-gray-600 mt-2">The provided secret key is invalid.</p>
            {validationError && (
              <p className="text-red-500 mt-2 text-sm">Error: {validationError}</p>
            )}
            <div className="mt-4 p-3 bg-yellow-50 rounded-md text-xs text-left">
              <p className="font-medium mb-1">Debugging Info:</p>
              <p>- Check console logs for details</p>
              <p>- Make sure MY_SECRET_EMAIL_KEY is set in .env.local</p>
              <p>- Current URL key: {searchParams.get('key')}</p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6">
      <motion.div 
        className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#8982cf] to-[#7873b3] px-6 py-8 sm:px-10">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faEnvelope} className="text-white text-xl" />
            </div>
            <div className="ml-4">
              <h1 className="text-white text-2xl font-bold">Secret Email Panel</h1>
              <p className="text-purple-100 mt-1">Send emails from support@kitions.com</p>
            </div>
          </div>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-8 sm:px-10">
          {/* Notification */}
          {notification.show && (
            <motion.div 
              className={`mb-6 p-4 rounded-lg ${
                notification.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              }`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="flex items-center">
                <FontAwesomeIcon 
                  icon={notification.success ? faCircleCheck : faCircleXmark} 
                  className={`${notification.success ? 'text-green-500' : 'text-red-500'} mr-3 text-xl`} 
                />
                <p>{notification.message}</p>
              </div>
            </motion.div>
          )}
          
          {/* Recipient */}
          <div className="mb-6">
            <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-1">
              Recipient Email
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faUser} className="text-gray-400" />
              </div>
              <input
                type="email"
                id="to"
                name="to"
                value={formData.to}
                onChange={handleInputChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8982cf] focus:border-[#8982cf]"
                placeholder="recipient@example.com"
                required
              />
            </div>
          </div>
          
          {/* Subject */}
          <div className="mb-6">
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              className="block w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8982cf] focus:border-[#8982cf]"
              placeholder="Email subject"
              required
            />
          </div>
          
          {/* Message */}
          <div className="mb-8">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={8}
              className="block w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8982cf] focus:border-[#8982cf]"
              placeholder="Your email message..."
              required
            ></textarea>
          </div>
          
          {/* Security notice */}
          <div className="mb-6 bg-yellow-50 rounded-lg p-4 text-sm text-yellow-800">
            <div className="flex">
              <FontAwesomeIcon icon={faShieldAlt} className="text-yellow-500 mr-3 mt-0.5" />
              <div>
                <p className="font-medium">Security Notice</p>
                <p className="mt-1">This panel is only accessible with a valid secret key. All emails sent will appear from support@kitions.com.</p>
              </div>
            </div>
          </div>
          
          {/* Submit button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className={`px-6 py-3 rounded-md text-white font-medium flex items-center ${
                isFormValid && !isLoading
                  ? 'bg-[#8982cf] hover:bg-[#7873b3]'
                  : 'bg-gray-400 cursor-not-allowed'
              } transition-colors duration-200`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
                  Send Email
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
} 
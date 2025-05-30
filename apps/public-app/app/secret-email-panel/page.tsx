'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEnvelope, 
  faLock, 
  faUser, 
  faPaperPlane, 
  faCircleCheck, 
  faCircleXmark, 
  faShieldAlt, 
  faFileInvoice, 
  faHandshake, 
  faInfoCircle,
  faEye,
  faUserPlus
} from '@fortawesome/free-solid-svg-icons';
import { URLs } from '@/app/config/urls';
import { getEmailTemplate } from '@/app/utils/email-templates';

export default function SecretEmailPanel() {
  const searchParams = useSearchParams();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormValid, setIsFormValid] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'email' | 'invite'>('email');
  const [notification, setNotification] = useState<{
    show: boolean;
    success: boolean;
    message: string;
  }>({
    show: false,
    success: false,
    message: '',
  });
  const [showPreview, setShowPreview] = useState(false);
  const previewIframeRef = useRef<HTMLIFrameElement>(null);

  // Email template options
  const templates = [
    { id: 'custom', name: 'Custom Message', icon: faEnvelope, description: 'Create your own custom email message' },
    { id: 'greeting', name: 'Customer Greeting', icon: faHandshake, description: 'Welcome new customers with a friendly greeting' },
    { id: 'invoice', name: 'Invoice Template', icon: faFileInvoice, description: 'Send professional invoices to customers' },
    { id: 'update', name: 'Product Update', icon: faInfoCircle, description: 'Inform customers about new products or features' },
  ];
  
  // Form state for email
  const [selectedTemplate, setSelectedTemplate] = useState('custom');
  const [formData, setFormData] = useState({
    to: '',
    subject: '',
    message: '',
    templateId: 'custom'
  });

  // Form state for invite user
  const [inviteData, setInviteData] = useState({
    email: '',
    role: 'retailer' as 'retailer' | 'distributor',
    firstName: '',
    lastName: '',
    businessName: ''
  });
  const [isInviteValid, setIsInviteValid] = useState(false);

  // Validate the secret key from URL
  useEffect(() => {
    const validateKey = async () => {
      const key = searchParams.get('key');
      console.log('Key from URL:', key);
      
      if (!key) {
        setIsAuthorized(false);
        setValidationError('No key provided');
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
  
  // Check if invite form is valid
  useEffect(() => {
    const { email, firstName, lastName, businessName } = inviteData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    setIsInviteValid(
      email.trim() !== '' && 
      emailRegex.test(email) && 
      firstName.trim() !== '' && 
      lastName.trim() !== '' && 
      businessName.trim() !== ''
    );
  }, [inviteData]);
  
  // Update message template when selected template changes
  useEffect(() => {
    // Only update if the template changes and it's not custom
    if (selectedTemplate !== 'custom') {
      let newSubject = '';
      let newMessage = '';
      
      // Set template-specific content
      switch (selectedTemplate) {
        case 'greeting':
          newSubject = 'Welcome to Kitions!';
          newMessage = `Dear Customer,

We're thrilled to welcome you to the Kitions family! Thank you for choosing our platform for your business needs.

Your account is now ready, and you can start exploring all the features we offer. If you have any questions or need assistance getting started, please don't hesitate to reach out to our support team.

Best regards,
The Kitions Team`;
          break;
        
        case 'invoice':
          newSubject = 'Your Kitions Invoice';
          newMessage = `Dear Customer,

Please find attached your invoice for Kitions services.

Invoice #: [INVOICE_NUMBER]
Date: ${new Date().toLocaleDateString()}
Amount Due: [AMOUNT]
Due Date: [DUE_DATE]

Thank you for your business!

Best regards,
Kitions Billing Team`;
          break;
        
        case 'update':
          newSubject = 'Kitions Product Update';
          newMessage = `Dear Customer,

We're excited to announce new updates to the Kitions platform!

What's New:
- [FEATURE 1]: Brief description
- [FEATURE 2]: Brief description
- [FEATURE 3]: Brief description

To learn more about these updates, please visit our documentation or contact support.

Thank you for being a valued Kitions customer!

Best regards,
The Kitions Team`;
          break;
      }
      
      setFormData(prev => ({
        ...prev,
        subject: newSubject,
        message: newMessage,
        templateId: selectedTemplate
      }));
    }
  }, [selectedTemplate]);

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
  
  // Handle invite form input changes
  const handleInviteInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setInviteData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  // Handle template selection
  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    
    // If switching to custom template, don't modify the existing content
    if (templateId === 'custom') {
      setFormData(prev => ({
        ...prev,
        templateId
      }));
    }
  };

  // Handle preview toggle
  const handleTogglePreview = () => {
    setShowPreview(prev => !prev);

    // Update iframe content when showing preview
    if (!showPreview && previewIframeRef.current) {
      // Generate preview HTML
      const previewHtml = getEmailTemplate(formData.templateId, {
        subject: formData.subject,
        message: formData.message
      });

      // Update iframe content
      const iframe = previewIframeRef.current;
      if (iframe.contentWindow) {
        iframe.contentWindow.document.open();
        iframe.contentWindow.document.write(previewHtml);
        iframe.contentWindow.document.close();
      }
    }
  };

  // Handle invite user submission
  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Call our API endpoint instead of Supabase directly
      const response = await fetch('/api/invite-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: inviteData.email,
          firstName: inviteData.firstName,
          lastName: inviteData.lastName,
          businessName: inviteData.businessName,
          role: inviteData.role
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send invitation');
      }
      
      // Show success notification
      setNotification({
        show: true,
        success: true,
        message: result.message || `Invitation sent successfully to ${inviteData.email}!`,
      });
      
      // Reset invite form
      setInviteData({
        email: '',
        role: 'retailer',
        firstName: '',
        lastName: '',
        businessName: ''
      });
      
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send invitation.';
      console.error('Invite error:', err);
      setNotification({
        show: true,
        success: false,
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
      
      // Hide notification after 5 seconds
      setTimeout(() => {
        setNotification((prev) => ({ ...prev, show: false }));
      }, 5000);
    }
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
          templateId: 'custom'
        });
        setSelectedTemplate('custom');
      } else {
        setNotification({
          show: true,
          success: false,
          message: data.error || 'Failed to send email.',
        });
      }
    } catch (err) {
      setNotification({
        show: true,
        success: false,
        message: `An error occurred. ${err}`,
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
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6">
      <motion.div 
        className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#8982cf] to-[#7873b3] px-6 py-8 sm:px-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={activeTab === 'email' ? faEnvelope : faUserPlus} className="text-white text-xl" />
              </div>
              <div className="ml-4">
                <h1 className="text-white text-2xl font-bold">Secret Admin Panel</h1>
                <p className="text-purple-100 mt-1">
                  {activeTab === 'email' ? 'Send emails from support@kitions.com' : 'Invite new users to the platform'}
                </p>
              </div>
            </div>
            
            {/* Tab Navigation */}
            <div className="flex bg-white/10 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('email')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'email'
                    ? 'bg-white text-[#8982cf] shadow-sm'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                Send Email
              </button>
              <button
                onClick={() => setActiveTab('invite')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'invite'
                    ? 'bg-white text-[#8982cf] shadow-sm'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
                Invite User
              </button>
            </div>
          </div>
        </div>
        
        {/* Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-bold text-lg">Email Preview</h3>
                <button 
                  onClick={handleTogglePreview}
                  className="text-gray-500 hover:text-gray-800"
                >
                  &times;
                </button>
              </div>
              <div className="p-0 overflow-auto flex-grow relative">
                <iframe 
                  ref={previewIframeRef}
                  className="w-full h-full min-h-[600px] border-0"
                  title="Email Preview"
                ></iframe>
              </div>
              <div className="p-4 border-t">
                <button 
                  onClick={handleTogglePreview}
                  className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Form */}
        <div className="px-6 py-8 sm:px-10">
          {/* Notification */}
          {notification.show && (
            <motion.div 
              className={`mb-6 p-4 rounded-lg flex items-center ${
                notification.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              }`}
            >
              <FontAwesomeIcon icon={notification.success ? faCircleCheck : faCircleXmark} className="text-lg mr-2" />
              <span>{notification.message}</span>
            </motion.div>
          )}

          {/* Email Form */}
          {activeTab === 'email' && (
            <form onSubmit={handleSubmit}>
              {/* Template Selection */}
              <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                  <FontAwesomeIcon icon={faEnvelope} className="text-[#8982cf] mr-2" />
                  Select Email Template
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {templates.map(template => (
                    <div 
                      key={template.id}
                      onClick={() => handleTemplateChange(template.id)}
                      className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${selectedTemplate === template.id 
                        ? 'border-[#8982cf] bg-[#f8f7fd] shadow-md transform scale-[1.02]' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                    >
                      <div className="flex justify-center mb-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${selectedTemplate === template.id ? 'bg-[#8982cf] text-white' : 'bg-gray-100 text-gray-500'}`}>
                          <FontAwesomeIcon icon={template.icon} size="lg" />
                        </div>
                      </div>
                      <h3 className="font-medium text-center mb-1">{template.name}</h3>
                      <p className="text-gray-500 text-sm text-center">{template.description}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Recipient Email */}
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
              <div className="mb-4">
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

              {/* Preview button */}
              <div className="mb-8">
                <button
                  type="button"
                  onClick={handleTogglePreview}
                  className="inline-flex items-center text-[#8982cf] hover:text-[#7873b3]"
                >
                  <FontAwesomeIcon icon={faEye} className="mr-2" />
                  Preview Email
                </button>
                <p className="text-xs text-gray-500 mt-1">See how your email will look to recipients</p>
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
          )}

          {/* Invite User Form */}
          {activeTab === 'invite' && (
            <form onSubmit={handleInviteSubmit}>
              <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                  <FontAwesomeIcon icon={faUserPlus} className="text-[#8982cf] mr-2" />
                  Invite New User
                </h2>
                <p className="text-gray-600 text-sm">Send an invitation email to a new user to join the Kitions platform.</p>
              </div>

              {/* Email */}
              <div className="mb-6">
                <label htmlFor="invite-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FontAwesomeIcon icon={faEnvelope} className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="invite-email"
                    name="email"
                    value={inviteData.email}
                    onChange={handleInviteInputChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8982cf] focus:border-[#8982cf]"
                    placeholder="user@example.com"
                    required
                  />
                </div>
              </div>

              {/* First Name and Last Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={inviteData.firstName}
                    onChange={handleInviteInputChange}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8982cf] focus:border-[#8982cf]"
                    placeholder="John"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={inviteData.lastName}
                    onChange={handleInviteInputChange}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8982cf] focus:border-[#8982cf]"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>

              {/* Business Name */}
              <div className="mb-6">
                <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name *
                </label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  value={inviteData.businessName}
                  onChange={handleInviteInputChange}
                  className="block w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8982cf] focus:border-[#8982cf]"
                  placeholder="Business Name Inc."
                  required
                />
              </div>

              {/* Role Selection */}
              <div className="mb-8">
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  User Role *
                </label>
                <select
                  id="role"
                  name="role"
                  value={inviteData.role}
                  onChange={handleInviteInputChange}
                  className="block w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8982cf] focus:border-[#8982cf]"
                  required
                >
                  <option value="retailer">Retailer</option>
                  <option value="distributor">Distributor</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {inviteData.role === 'retailer' 
                    ? 'Retailers can browse and purchase products from distributors'
                    : 'Distributors can list products and sell to retailers'
                  }
                </p>
              </div>

              {/* Security notice */}
              <div className="mb-6 bg-blue-50 rounded-lg p-4 text-sm text-blue-800">
                <div className="flex">
                  <FontAwesomeIcon icon={faShieldAlt} className="text-blue-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">Invitation Process</p>
                    <p className="mt-1">The user will receive an email invitation with a link to complete their account setup. They&apos;ll need to set their password and verify their email address.</p>
                  </div>
                </div>
              </div>

              {/* Submit button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!isInviteValid || isLoading}
                  className={`px-6 py-3 rounded-md text-white font-medium flex items-center ${
                    isInviteValid && !isLoading
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
                      Sending Invitation...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
                      Send Invitation
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
} 
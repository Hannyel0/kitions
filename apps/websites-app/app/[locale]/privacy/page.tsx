'use client';

import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserShield, 
  faDatabase, 
  faShareAlt, 
  faUserLock, 
  faClock, 
  faShieldAlt, 
  faCookieBite, 
  faChild, 
  faGlobeAmericas, 
  faSyncAlt, 
  faEnvelope 
} from '@fortawesome/free-solid-svg-icons';

export default function PrivacyPolicy() {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };
  
  const currentDate = new Date();
  const effectiveDate = `${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.getDate()}, ${currentDate.getFullYear()}`;

  return (
    <div className="min-h-screen bg-[radial-gradient(theme(colors.gray.200)_1px,transparent_1px)] bg-[size:20px_20px]">
      <motion.div 
        className="container mx-auto py-16 px-4 md:px-8"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">Privacy Policy</h1>
            <p className="text-lg text-gray-600">Last Updated: {effectiveDate}</p>
          </header>
          
          <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
            <p className="text-lg text-gray-700 mb-8">
              At Kitions, your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and protect your personal information when you use our websites, web applications, and related services (the &quot;Services&quot;).
            </p>
            
            <p className="text-gray-700 mb-8">
              By accessing Kitions or hiring us, you agree to the terms of this Privacy Policy.
            </p>
            
            {/* Section 1 */}
            <section className="mb-12">
              <div className="flex items-center mb-4">
                <div className="bg-[#f5f3ff] p-3 rounded-full mr-4">
                  <FontAwesomeIcon icon={faUserShield} className="h-6 w-6 text-[#8982cf]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">1. Information We Collect</h2>
              </div>
              <div className="pl-16">
                <p className="mb-4 text-gray-700">We collect personal and business information to provide and improve our services:</p>
                
                <h3 className="font-semibold text-gray-800 mt-6 mb-2">Information You Provide:</h3>
                <ul className="list-disc space-y-2 text-gray-700 ml-5">
                  <li>Name, email address, phone number</li>
                  <li>Business name, EIN, and verification documents</li>
                  <li>Profile information and preferences</li>
                  <li>Order history and transaction details</li>
                  <li>Support requests and other communications</li>
                </ul>
                
                <h3 className="font-semibold text-gray-800 mt-6 mb-2">Information We Collect Automatically:</h3>
                <ul className="list-disc space-y-2 text-gray-700 ml-5">
                  <li>IP address and device/browser info</li>
                  <li>Usage logs and interaction data</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
                
                <h3 className="font-semibold text-gray-800 mt-6 mb-2">Information from Third Parties:</h3>
                <ul className="list-disc space-y-2 text-gray-700 ml-5">
                  <li>Stripe (for payment processing and identity verification)</li>
                  <li>Supabase (authentication and database services)</li>
                  <li>Analytics tools (e.g., Google Analytics)</li>
                </ul>
              </div>
            </section>
            
            {/* Section 2 */}
            <section className="mb-12">
              <div className="flex items-center mb-4">
                <div className="bg-[#f5f3ff] p-3 rounded-full mr-4">
                  <FontAwesomeIcon icon={faDatabase} className="h-6 w-6 text-[#8982cf]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">2. How We Use Your Information</h2>
              </div>
              <div className="pl-16">
                <p className="mb-4 text-gray-700">We use your information to:</p>
                <ul className="list-disc space-y-2 text-gray-700">
                  <li>Create and manage your account</li>
                  <li>Verify your identity and business</li>
                  <li>Process and track orders</li>
                  <li>Send important notifications (emails, updates, support messages)</li>
                  <li>Provide customer service</li>
                  <li>Analyze usage to improve our services</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>
            </section>
            
            {/* Section 3 */}
            <section className="mb-12">
              <div className="flex items-center mb-4">
                <div className="bg-[#f5f3ff] p-3 rounded-full mr-4">
                  <FontAwesomeIcon icon={faShareAlt} className="h-6 w-6 text-[#8982cf]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">3. Sharing Your Information</h2>
              </div>
              <div className="pl-16">
                <p className="mb-4 text-gray-700">We never sell your personal information. We may share it with:</p>
                <ul className="list-disc space-y-2 text-gray-700">
                  <li>Service providers (e.g., Supabase, Stripe, email providers like Resend)</li>
                  <li>Third-party analytics tools (only for performance and UX optimization)</li>
                  <li>Law enforcement or regulators when legally required</li>
                  <li>Other users, only if explicitly allowed (e.g., retailers seeing verified supplier info)</li>
                </ul>
              </div>
            </section>
            
            {/* Section 4 */}
            <section className="mb-12">
              <div className="flex items-center mb-4">
                <div className="bg-[#f5f3ff] p-3 rounded-full mr-4">
                  <FontAwesomeIcon icon={faUserLock} className="h-6 w-6 text-[#8982cf]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">4. Your Privacy Rights</h2>
              </div>
              <div className="pl-16">
                <p className="mb-4 text-gray-700">Depending on your location, you may have rights to:</p>
                <ul className="list-disc space-y-2 text-gray-700 mb-4">
                  <li>Access the personal data we hold about you</li>
                  <li>Request correction or deletion of your data</li>
                  <li>Object to or restrict certain types of processing</li>
                  <li>Request data portability</li>
                  <li>Withdraw consent where applicable</li>
                </ul>
                <p className="text-gray-700">
                  To exercise these rights, contact us at <a href="mailto:support@kitions.com" className="text-[#8982cf] hover:underline">support@kitions.com</a>.
                </p>
              </div>
            </section>
            
            {/* Section 5 */}
            <section className="mb-12">
              <div className="flex items-center mb-4">
                <div className="bg-[#f5f3ff] p-3 rounded-full mr-4">
                  <FontAwesomeIcon icon={faClock} className="h-6 w-6 text-[#8982cf]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">5. Data Retention</h2>
              </div>
              <div className="pl-16">
                <p className="text-gray-700">
                  We retain your data as long as your account is active or as needed to provide services, comply with our legal obligations, or resolve disputes. You may request account deletion at any time.
                </p>
              </div>
            </section>
            
            {/* Section 6 */}
            <section className="mb-12">
              <div className="flex items-center mb-4">
                <div className="bg-[#f5f3ff] p-3 rounded-full mr-4">
                  <FontAwesomeIcon icon={faShieldAlt} className="h-6 w-6 text-[#8982cf]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">6. Security</h2>
              </div>
              <div className="pl-16">
                <p className="text-gray-700">
                  We use secure infrastructure, access controls, encryption, and monitoring to protect your data. However, no online service is 100% secure.
                </p>
              </div>
            </section>
            
            {/* Section 7 */}
            <section className="mb-12">
              <div className="flex items-center mb-4">
                <div className="bg-[#f5f3ff] p-3 rounded-full mr-4">
                  <FontAwesomeIcon icon={faCookieBite} className="h-6 w-6 text-[#8982cf]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">7. Cookies & Tracking</h2>
              </div>
              <div className="pl-16">
                <p className="mb-4 text-gray-700">We use cookies and similar technologies to:</p>
                <ul className="list-disc space-y-2 text-gray-700 mb-4">
                  <li>Keep you signed in</li>
                  <li>Remember preferences</li>
                  <li>Analyze site performance</li>
                </ul>
                <p className="text-gray-700">
                  You can disable cookies in your browser settings, though some features may stop working.
                </p>
              </div>
            </section>
            
            {/* Section 8 */}
            <section className="mb-12">
              <div className="flex items-center mb-4">
                <div className="bg-[#f5f3ff] p-3 rounded-full mr-4">
                  <FontAwesomeIcon icon={faChild} className="h-6 w-6 text-[#8982cf]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">8. Age Restrictions</h2>
              </div>
              <div className="pl-16">
                <p className="text-gray-700">
                Kitions is intended strictly for users who are 18 years of age or older. By using our platform, you represent and warrant that you are at least 18 years old and legally able to enter into contracts for business purposes. <br /> <br />
                We do not knowingly collect or solicit any personal information from individuals under 18. If we discover that a user is underage, we will take steps to delete the account and associated data.
                </p>
              </div>
            </section>
            
            {/* Section 9 */}
            <section className="mb-12">
              <div className="flex items-center mb-4">
                <div className="bg-[#f5f3ff] p-3 rounded-full mr-4">
                  <FontAwesomeIcon icon={faGlobeAmericas} className="h-6 w-6 text-[#8982cf]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">9. International Transfers</h2>
              </div>
              <div className="pl-16">
                <p className="text-gray-700">
                  If you&apos;re accessing Kitions from outside the U.S., your information may be transferred to and processed in the U.S., where data protection laws may differ.
                </p>
              </div>
            </section>
            
            {/* Section 10 */}
            <section className="mb-12">
              <div className="flex items-center mb-4">
                <div className="bg-[#f5f3ff] p-3 rounded-full mr-4">
                  <FontAwesomeIcon icon={faSyncAlt} className="h-6 w-6 text-[#8982cf]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">10. Updates to This Policy</h2>
              </div>
              <div className="pl-16">
                <p className="text-gray-700">
                  We may update this policy from time to time. If we do, we will notify you via email or through the platform. Continued use of the Services after the update constitutes your acceptance.
                </p>
              </div>
            </section>
            
            {/* Section 11 */}
            <section className="mb-8">
              <div className="flex items-center mb-4">
                <div className="bg-[#f5f3ff] p-3 rounded-full mr-4">
                  <FontAwesomeIcon icon={faEnvelope} className="h-6 w-6 text-[#8982cf]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">11. Contact Us</h2>
              </div>
              <div className="pl-16">
                <p className="text-gray-700">
                  If you have any questions about this Privacy Policy or your data, contact us at:
                </p>
                <p className="mt-3 text-gray-700">
                  <a href="mailto:support@kitions.com" className="text-[#8982cf] hover:underline flex items-center">
                    <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                    support@kitions.com
                  </a>
                </p>
              </div>
            </section>
          </div>
          
          <div className="text-center text-gray-600 text-sm mt-16">
            <p>Last updated: {effectiveDate}</p>
            <p className="mt-2">Kitions © {currentDate.getFullYear()} All rights reserved.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 
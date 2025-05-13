'use client';

import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldAlt, faHandshake, faCreditCard, faUserCheck, faTools, faGavel, faBan, faExclamationTriangle, faPencilAlt, faEnvelope } from '@fortawesome/free-solid-svg-icons';

export default function TermsOfService() {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };
  
  // Hardcoded effective date
  const effectiveDate = "May 8, 2025";

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
            <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">Terms of Service</h1>
            <p className="text-lg text-gray-600">Effective Date: {effectiveDate}</p>
          </header>
          
          <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
            <p className="text-lg text-gray-700 mb-8">
              Welcome to Kitions — a B2B procurement platform that connects retailers and distributors to simplify bulk ordering, inventory management, and communication.
            </p>
            
            <p className="text-gray-700 mb-8">
              By accessing or using our platform (&quot;Kitions&quot;, &quot;we&quot;, &quot;our&quot;, &quot;us&quot;), available via our website and any associated applications, you (&quot;you&quot;, &quot;user&quot;, &quot;retailer&quot;, or &quot;distributor&quot;) agree to the following Terms of Service (&quot;Terms&quot;). If you do not agree, do not use our platform.
            </p>
            
            {/* Section 1 */}
            <section className="mb-12">
              <div className="flex items-center mb-4">
                <div className="bg-[#f5f3ff] p-3 rounded-full mr-4">
                  <FontAwesomeIcon icon={faUserCheck} className="h-6 w-6 text-[#8982cf]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">1. Eligibility and Account Creation</h2>
              </div>
              <div className="pl-16">
                <ul className="list-disc space-y-2 text-gray-700">
                  <li>You must be at least 18 years old to create an account.</li>
                  <li>You must provide accurate business and personal information during sign-up.</li>
                  <li>Users must choose a role (retailer or distributor) and may be eligible to switch or add roles in the future upon approval.</li>
                  <li>Accounts must be verified (including email, legal business name, EIN, and any requested documents) before engaging in core activities like placing or receiving orders.</li>
                </ul>
              </div>
            </section>
            
            {/* Section 2 */}
            <section className="mb-12">
              <div className="flex items-center mb-4">
                <div className="bg-[#f5f3ff] p-3 rounded-full mr-4">
                  <FontAwesomeIcon icon={faTools} className="h-6 w-6 text-[#8982cf]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">2. Platform Services</h2>
              </div>
              <div className="pl-16">
                <p className="mb-4 text-gray-700">Kitions offers features including but not limited to:</p>
                <ul className="list-disc space-y-2 text-gray-700 mb-4">
                  <li>Product catalog browsing and management</li>
                  <li>Bulk order processing with tracking and fulfillment statuses</li>
                  <li>Profile and business management tools</li>
                  <li>Admin-mediated user approval system</li>
                  <li>Notifications, emails, and updates related to platform activity</li>
                </ul>
                <p className="text-gray-700">We reserve the right to add, remove, or modify features at any time.</p>
              </div>
            </section>
            
            {/* Section 3 */}
            <section className="mb-12">
              <div className="flex items-center mb-4">
                <div className="bg-[#f5f3ff] p-3 rounded-full mr-4">
                  <FontAwesomeIcon icon={faCreditCard} className="h-6 w-6 text-[#8982cf]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">3. Pricing and Payment</h2>
              </div>
              <div className="pl-16">
                <ul className="list-disc space-y-2 text-gray-700">
                  <li>Distributors may list product prices, case sizes, and order minimums.</li>
                  <li>Kitions may charge subscription fees or platform usage fees, which will be clearly disclosed.</li>
                  <li>We reserve the right to modify pricing plans and platform fees at any time. When we do, we will notify affected users in advance through email or in-app communication.</li>
                  <li>All transactions are processed through third-party providers (e.g., Stripe), and by using our services, you agree to their terms and policies. <a className='text-[#8982cf] hover:underline' href="https://stripe.com/legal/ssa">stripe Services Aggrement</a> </li>
                </ul>
              </div>
            </section>
            
            {/* Section 4 */}
            <section className="mb-12">
              <div className="flex items-center mb-4">
                <div className="bg-[#f5f3ff] p-3 rounded-full mr-4">
                  <FontAwesomeIcon icon={faHandshake} className="h-6 w-6 text-[#8982cf]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">4. User Responsibilities</h2>
              </div>
              <div className="pl-16">
                <p className="mb-4 text-gray-700">By using Kitions, you agree to:</p>
                <ul className="list-disc space-y-2 text-gray-700">
                  <li>Use the platform in compliance with all applicable laws and regulations.</li>
                  <li>Maintain the confidentiality of your account credentials.</li>
                  <li>Only use the platform for legitimate business purposes.</li>
                  <li>Provide truthful and accurate information at all times.</li>
                  <li>Refrain from any behavior that could harm the integrity or security of our platform, users, or operations.</li>
                </ul>
              </div>
            </section>
            
            {/* Section 5 */}
            <section className="mb-12">
              <div className="flex items-center mb-4">
                <div className="bg-[#f5f3ff] p-3 rounded-full mr-4">
                  <FontAwesomeIcon icon={faShieldAlt} className="h-6 w-6 text-[#8982cf]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">5. Intellectual Property</h2>
              </div>
              <div className="pl-16">
                <p className="text-gray-700">
                  All content on Kitions — including text, branding, logos, platform design, and software — is the property of Kitions and may not be copied, resold, or reused without our permission.
                </p>
              </div>
            </section>
            
            {/* Section 6 */}
            <section className="mb-12">
              <div className="flex items-center mb-4">
                <div className="bg-[#f5f3ff] p-3 rounded-full mr-4">
                  <FontAwesomeIcon icon={faBan} className="h-6 w-6 text-[#8982cf]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">6. Termination</h2>
              </div>
              <div className="pl-16">
                <p className="mb-4 text-gray-700">We reserve the right to suspend or terminate your access to Kitions at any time, with or without notice, especially if:</p>
                <ul className="list-disc space-y-2 text-gray-700 mb-4">
                  <li>You violate these Terms</li>
                  <li>You attempt to misuse the platform</li>
                  <li>Your business or identity cannot be verified</li>
                  <li>You engage in fraudulent or abusive behavior</li>
                </ul>
                <p className="text-gray-700">You may also close your account at any time by contacting us.</p>
              </div>
            </section>
            
            {/* Section 7 */}
            <section className="mb-12">
              <div className="flex items-center mb-4">
                <div className="bg-[#f5f3ff] p-3 rounded-full mr-4">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="h-6 w-6 text-[#8982cf]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">7. Disclaimers</h2>
              </div>
              <div className="pl-16">
                <ul className="list-disc space-y-2 text-gray-700">
                  <li>Kitions is provided &quot;as is&quot; and &quot;as available.&quot; We do not guarantee that the platform will be error-free or uninterrupted.</li>
                  <li>We are not responsible for the conduct, products, or services of any user (retailer or distributor) on the platform.</li>
                  <li>All transactions and fulfillment are the responsibility of the respective businesses involved.</li>
                </ul>
              </div>
            </section>
            
            {/* Section 8 */}
            <section className="mb-12">
              <div className="flex items-center mb-4">
                <div className="bg-[#f5f3ff] p-3 rounded-full mr-4">
                  <FontAwesomeIcon icon={faGavel} className="h-6 w-6 text-[#8982cf]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">8. Limitation of Liability</h2>
              </div>
              <div className="pl-16">
                <p className="text-gray-700">
                  To the maximum extent permitted by law, Kitions shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the platform.
                </p>
              </div>
            </section>
            
            {/* Section 9 */}
            <section className="mb-12">
              <div className="flex items-center mb-4">
                <div className="bg-[#f5f3ff] p-3 rounded-full mr-4">
                  <FontAwesomeIcon icon={faPencilAlt} className="h-6 w-6 text-[#8982cf]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">9. Modifications to Terms</h2>
              </div>
              <div className="pl-16">
                <p className="text-gray-700">
                  We may update these Terms from time to time. If we do, we will notify you via email or in-app notification. Continued use of the platform after changes constitutes your acceptance of the updated terms.
                </p>
              </div>
            </section>
            
            {/* Section 10 */}
            <section className="mb-8">
              <div className="flex items-center mb-4">
                <div className="bg-[#f5f3ff] p-3 rounded-full mr-4">
                  <FontAwesomeIcon icon={faEnvelope} className="h-6 w-6 text-[#8982cf]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">10. Contact Us</h2>
              </div>
              <div className="pl-16">
                <p className="text-gray-700">
                  If you have any questions about these Terms, please contact us at <a href="mailto:support@kitions.com" className="text-[#8982cf] hover:underline">support@kitions.com</a>.
                </p>
              </div>
            </section>
          </div>
          
          <div className="text-center text-gray-600 text-sm mt-16">
            <p>Last updated: {effectiveDate}</p>
            <p className="mt-2">Kitions © 2025 All rights reserved.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 
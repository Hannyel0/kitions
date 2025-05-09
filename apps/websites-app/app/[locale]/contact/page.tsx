'use client';

import { useEffect } from 'react';
import ContactForm from '../../components/ContactForm';

export default function ContactPage() {
  // Add title to document when component mounts
  useEffect(() => {
    document.title = 'Contact Us | Kitions';
  }, []);

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
        {/* Gradient layers */}
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
          Get in Touch
        </h1>
        
        <div className="mb-12">
          <p className="text-center text-gray-600 mb-2">
            We&apos;d love to hear from you! Whether you have questions about our services, 
            need a custom solution, or want to discuss your project.
          </p>
          <p className="text-center text-gray-600 mb-8">
            Fill out the form below and our team will get back to you as soon as possible.
          </p>
        </div>
        
        {/* Contact Form */}
        <ContactForm 
          title="Contact Our Team"
          subtitle="Complete the form and our specialists will reach out to you within 24 hours to discuss your website needs."
        />
      </div>
    </main>
  );
} 
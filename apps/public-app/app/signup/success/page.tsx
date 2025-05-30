'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle, Clock, ArrowRight } from 'lucide-react';

export default function SignupSuccess() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-12 md:p-16 text-center">
        <div className="flex justify-center mb-8">
          <Image 
            src="/default-monochrome-black.svg" 
            alt="Kitions" 
            width={150} 
            height={50}
          />
        </div>

        <div className="flex justify-center mb-6">
          <div className="bg-green-100 rounded-full p-4">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Account Successfully Created!
        </h1>
        
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          Welcome to Kitions! Your account has been created and you can now log in.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-center mb-3">
            <Clock className="w-6 h-6 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-blue-900">Account Verification</h3>
          </div>
          <p className="text-blue-800 text-sm leading-relaxed">
            Kitions will review your information in the next <strong>24-48 hours</strong> to verify your account. 
            You&apos;ll receive an email notification once your account is fully verified and ready to use.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/login"
            className="w-full bg-[#8982cf] text-white py-4 px-6 rounded-lg hover:bg-[#7873b3] transition-all duration-200 font-medium text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 inline-flex items-center justify-center group"
          >
            Log In to Your Account
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
          
          <p className="text-sm text-gray-500">
            Need help? <Link href="/contact" className="text-[#8982cf] hover:underline font-medium">Contact our support team</Link>
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">What happens next?</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 font-bold">1</span>
              </div>
              <h5 className="font-medium text-gray-900 mb-1">Review Process</h5>
              <p className="text-gray-600">We verify your business information</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 font-bold">2</span>
              </div>
              <h5 className="font-medium text-gray-900 mb-1">Email Notification</h5>
              <p className="text-gray-600">You&apos;ll receive verification confirmation</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <h5 className="font-medium text-gray-900 mb-1">Start Trading</h5>
              <p className="text-gray-600">Access the full Kitions platform</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
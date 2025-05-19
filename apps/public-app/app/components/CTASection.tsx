import React from 'react'
import Link from 'next/link'
import { ArrowRightIcon } from 'lucide-react'

export function CTASection() {
  return (
    <section className="bg-[#8982cf] py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Distribution Business?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of distributors who are growing their business with Kitions.
            Get started today and see the difference our platform can make.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/signup" 
              className="bg-white text-[#8982cf] px-8 py-4 rounded-lg hover:bg-gray-100 transition-all font-medium flex items-center justify-center space-x-2">
              <span>Get Started</span>
              <ArrowRightIcon className="w-5 h-5" />
            </Link>
            <Link 
              href="/contact" 
              className="bg-transparent text-white px-8 py-4 rounded-lg border-2 border-white hover:bg-white/10 transition-all font-medium">
              <span>Contact Sales</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

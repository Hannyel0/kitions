'use client';

import { Suspense } from 'react';
import Skeleton, { PricingCardSkeleton, ContactFormSkeleton } from '../ui/Skeleton';

// This is an example component that would fetch data
const DynamicPricingCards = async () => {
  // In a real implementation, this would fetch data from an API
  // For demonstration, we're simulating a network delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Your actual pricing card components would go here */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-xl font-bold text-center mb-3">Basic</h3>
        <p className="text-center mb-6">Your basic plan description here</p>
        <button className="w-full py-3 rounded-lg">Get Started</button>
      </div>
      
      {/* Additional cards would go here */}
    </div>
  );
};

// This is an example component that would fetch data for the contact form
const DynamicContactForm = async () => {
  // In a real implementation, this would fetch data from an API
  // For demonstration, we're simulating a network delay
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
      <form>
        {/* Your actual form elements would go here */}
      </form>
    </div>
  );
};

export default function SuspenseExamplePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Example Page with Suspense</h1>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Pricing Plans</h2>
        
        {/* Wrapping the dynamic component with Suspense */}
        <Suspense fallback={
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <PricingCardSkeleton key={i} />
            ))}
          </div>
        }>
          <DynamicPricingCards />
        </Suspense>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
        
        {/* Wrapping the dynamic component with Suspense */}
        <Suspense fallback={<ContactFormSkeleton />}>
          <DynamicContactForm />
        </Suspense>
      </section>
      
      {/* Example of using the basic Skeleton component for a list */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Using Basic Skeleton Components</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-bold mb-4">List Example</h3>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} height={24} className="rounded" />
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Card Example</h3>
            <div className="border border-gray-200 rounded-lg p-6">
              <Skeleton height={32} width="60%" className="mb-4 rounded" />
              <Skeleton height={16} className="mb-2 rounded" />
              <Skeleton height={16} className="mb-2 rounded" />
              <Skeleton height={16} width="80%" className="mb-4 rounded" />
              <Skeleton height={40} className="rounded-lg" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 
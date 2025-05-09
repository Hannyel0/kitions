'use client';

import { useEffect } from 'react';
import PricingPreview from '../../components/PricingPreview';


export default function WebsiteCreationServicePage() {
  // Add title to document when component mounts
  useEffect(() => {
    document.title = 'Website Creation Service | Kitions';
  }, []);

  return (
    <main className="pt-24 min-h-screen bg-white relative overflow-hidden">
      <PricingPreview />
    </main>
  );
} 
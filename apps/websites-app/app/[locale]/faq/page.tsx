'use client';

import NavbarProvider from '../NavbarProvider';
import FAQ from '../../components/FAQ';

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(theme(colors.gray.200)_1px,transparent_1px)] bg-[size:20px_20px]">
      <NavbarProvider />
      <FAQ />
    </div>
  );
} 
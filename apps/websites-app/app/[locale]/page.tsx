'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Hero from '../components/Hero';
import Features from '../components/Features';
import PricingPreview from '../components/PricingPreview';
import CTASection from '../components/CTASection';
import NavbarProvider from './NavbarProvider';

export default function Home() {
  const t = useTranslations();
  
  return (
    <div className="min-h-screen">
      <NavbarProvider />
      <Hero 
        title={t('home.hero.title')}
        subtitle={t('home.hero.subtitle')}
      />
      <Features 
        title={t('home.features.title')}
        subtitle={t('home.features.subtitle')}
      />
      <div className="max-w-6xl mx-auto px-4 ">
        <section className=" w-full mb-5 py-12 px-8 bg-[#f5f3ff] rounded-3xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-[#8982cf] mb-2">Guaranteed Future Integration</h2>
            <div className="text-lg font-semibold text-gray-800 mb-2">with the Kitions app in your website</div>
            <p className="text-base text-gray-700 mb-6 max-w-xl">We are committed to providing seamless integration with the Kitions app for all our website clients. Your site will always be ready for the latest features and business tools from Kitions.</p>
            <button className="mt-2 px-6 py-3 bg-[#8982cf] text-white font-semibold rounded-lg shadow hover:bg-[#7873b3] transition-colors">
              {t('common.cta.learnMore')}
            </button>
          </div>
          <div className="flex flex-col items-center gap-4 md:gap-6 md:flex-row md:items-end">
            <div className="w-94 h-66 rounded-2xl overflow-hidden bg-white shadow relative" style={{ width: '376px', height: '264px' }}>
              <Image 
                src="/dashboardKitions.jpg" 
                alt="Kitions Dashboard" 
                fill
                sizes="(max-width: 768px) 100vw, 376px"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </section>
      </div>
      <PricingPreview />
      <CTASection />
    </div>
  );
} 
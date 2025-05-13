'use client';

import { useTranslations } from 'next-intl';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItHelps from '../components/HowItHelps';
import CTASection from '../components/CTASection';
import NavbarProvider from './NavbarProvider';
import KitionsIntegrationBanner from '../components/KitionsIntegrationBanner';

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
      <div className="max-w-6xl mx-auto px-4">
        <KitionsIntegrationBanner />
      </div>
      <HowItHelps />
      <CTASection />
    </div>
  );
} 
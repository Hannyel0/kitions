'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function KitionsIntegrationBanner() {
  const t = useTranslations();
  
  return (
    <section className="w-full mb-5 py-12 px-8 bg-[#f5f3ff] rounded-3xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-8">
      <div className="flex-1 text-left">
        <h2 className="text-3xl md:text-4xl font-bold text-[#8982cf] mb-2">{t('home.integration.title')}</h2>
        <div className="text-lg font-semibold text-gray-800 mb-2">{t('home.integration.subtitle')}</div>
        <p className="text-base text-gray-700 mb-6 max-w-xl">{t('home.integration.description')}</p>
        <Link 
          href="https://kitions.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-block mt-2 px-6 py-3 bg-[#8982cf] text-white font-semibold rounded-lg shadow hover:bg-[#7873b3] transition-colors"
        >
          {t('common.cta.learnMore')}
        </Link>
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
  );
}

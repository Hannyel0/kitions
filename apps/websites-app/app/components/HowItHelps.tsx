'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, 
  faUsers,
  faClock,
  faGlobe,
  faMobileScreen,
  faHandshake
} from '@fortawesome/free-solid-svg-icons';
import { useTranslations } from 'next-intl';

export default function HowItHelps() {
  const t = useTranslations('home.howItHelps');
  
  const benefits = [
    {
      icon: faChartLine,
      translationKey: 'increasedVisibility'
    },
    {
      icon: faUsers,
      translationKey: 'trustCredibility'
    },
    {
      icon: faClock,
      translationKey: 'availability'
    },
    {
      icon: faGlobe,
      translationKey: 'expandReach'
    },
    {
      icon: faMobileScreen,
      translationKey: 'mobileExperience'
    },
    {
      icon: faHandshake,
      translationKey: 'customerService'
    }
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
            {t('title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl p-8 border border-gray-200 hover:border-[#8982cf] transition-colors shadow-sm hover-card flex flex-col h-full group"
              style={{ minHeight: '280px' }}
            >
              <div className="w-14 h-14 bg-[#f5f3ff] rounded-full flex items-center justify-center mb-5 group-hover:bg-[#e9e6ff] transition-colors duration-300">
                <FontAwesomeIcon 
                  icon={benefit.icon} 
                  className="text-[#8982cf] h-6 w-6 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6" 
                />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{t(`benefits.${benefit.translationKey}.title`)}</h3>
              <p className="text-gray-600 flex-grow">
                {t(`benefits.${benefit.translationKey}.description`)}
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 bg-[#f5f3ff] rounded-2xl p-8 md:p-12 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-8 md:max-w-2xl">
              <h3 className="text-2xl md:text-3xl font-bold text-[#8982cf] mb-4">{t('cta.title')}</h3>
              <p className="text-gray-700">
                {t('cta.description')}
              </p>
            </div>
            <a 
              href="/contact" 
              className="btn-primary py-4 px-8 text-base font-semibold whitespace-nowrap"
            >
              {t('cta.button')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
} 
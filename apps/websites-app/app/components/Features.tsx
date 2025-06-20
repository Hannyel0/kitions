'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faLaptopCode, 
  faMobileScreen,
  faGlobe
} from '@fortawesome/free-solid-svg-icons';
import { useTranslations } from 'next-intl';

interface FeaturesProps {
  title: string;
  subtitle: string;
}

export default function Features({ title, subtitle }: FeaturesProps) {
  const t = useTranslations('home.features');

  const features = [
    {
      icon: faLaptopCode,
      translationKey: 'professionalDesign'
    },
    {
      icon: faMobileScreen,
      translationKey: 'mobileOptimized'
    },
    {
      icon: faGlobe,
      translationKey: 'seoReady'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-xl text-gray-600">
            {subtitle}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover-card">
              <div className="w-12 h-12 bg-[#f5f3ff] rounded-lg flex items-center justify-center mb-4">
                <FontAwesomeIcon icon={feature.icon} className="text-[#8982cf] h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t(`items.${feature.translationKey}.title`)}</h3>
              <p className="text-gray-600">
                {t(`items.${feature.translationKey}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 
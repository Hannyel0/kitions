'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useTranslations } from 'next-intl';

export default function FAQ() {
  const t = useTranslations('faq');
  const [searchTerm, setSearchTerm] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState('general');

  // Get all FAQ items from translations
  const categories = [
    { id: 'general', label: t('categories.general') },
    { id: 'pricing', label: t('categories.pricing') },
    { id: 'websites', label: t('categories.websites') },
    { id: 'technical', label: t('categories.technical') },
    { id: 'support', label: t('categories.support') }
  ];

  // Fixed list of FAQ indices to avoid accessing non-existent keys
  const faqIndices = {
    general: [0, 1, 2, 3],
    pricing: [0, 1, 2, 3],
    websites: [0, 1, 2, 3],
    technical: [0, 1, 2, 3],
    support: [0, 1, 2, 3]
  };

  // Safely get FAQs from the selected category using predetermined indices
  const getFaqsForCategory = (categoryId: string) => {
    const categoryPrefix = `items.${categoryId}`;
    const indices = faqIndices[categoryId as keyof typeof faqIndices] || [];
    
    const items = [];
    for (const i of indices) {
      const questionKey = `${categoryPrefix}.q${i}`;
      const answerKey = `${categoryPrefix}.a${i}`;
      
      // Safe translation retrieval with proper error handling
      let question, answer;
      try {
        question = t(questionKey);
        answer = t(answerKey);
        items.push({ question, answer });
      } catch (e) {
        // Skip this item if translation fails
        console.error(`Translation error for ${questionKey} or ${answerKey}`);
      }
    }
    
    return items;
  };

  const faqs = getFaqsForCategory(activeCategory);
  
  // Filter FAQs based on search term
  const filteredFaqs = searchTerm 
    ? faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : faqs;

  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            {t('title')}
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
          
          {/* Search bar */}
          <div className="mt-8 max-w-xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8982cf]/50 focus:border-[#8982cf]"
              />
              <FontAwesomeIcon 
                icon={faSearch} 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" 
              />
            </div>
          </div>
        </div>
        
        {/* Category tabs */}
        <div className="flex flex-wrap justify-center mb-12 gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => {
                setActiveCategory(category.id);
                setOpenIndex(null);
                setSearchTerm('');
              }}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category.id
                  ? 'bg-[#8982cf] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
        
        {/* FAQ Accordion */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, idx) => (
              <div 
                key={idx} 
                className={`border-b border-gray-100 last:border-b-0 ${
                  openIndex === idx ? 'bg-[#f8f7fd]' : 'hover:bg-gray-50'
                }`}
              >
                <button
                  className="flex justify-between items-center w-full text-left p-6"
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  aria-expanded={openIndex === idx}
                >
                  <h3 className="text-lg font-semibold text-gray-800">
                    {faq.question}
                  </h3>
                  <div className={`ml-4 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === idx ? 'rotate-180' : ''
                  }`}>
                    <FontAwesomeIcon 
                      icon={faChevronDown} 
                      className={`h-5 w-5 ${
                        openIndex === idx ? 'text-[#8982cf]' : 'text-gray-400'
                      }`} 
                    />
                  </div>
                </button>
                
                <AnimatePresence initial={false}>
                  {openIndex === idx && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-0 text-gray-700">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
          ) : (
            <div className="py-16 text-center">
              <p className="text-gray-500">{t('noResults')}</p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-2 text-[#8982cf] font-medium hover:underline"
                >
                  {t('clearSearch')}
                </button>
              )}
            </div>
          )}
        </div>
        
        {/* Still have questions section */}
        <div className="mt-16 bg-[#f5f3ff] rounded-2xl p-8 md:p-12 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-8 md:max-w-2xl">
              <h3 className="text-2xl md:text-3xl font-bold text-[#8982cf] mb-4">
                {t('stillHaveQuestions.title')}
              </h3>
              <p className="text-gray-700">
                {t('stillHaveQuestions.description')}
              </p>
            </div>
            <a 
              href="/contact" 
              className="btn-primary py-4 px-8 text-base font-semibold whitespace-nowrap"
            >
              {t('stillHaveQuestions.button')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

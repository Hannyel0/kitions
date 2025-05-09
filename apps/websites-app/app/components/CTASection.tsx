'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function CTASection() {
  const faqs = [
    {
      question: 'Do I need any technical knowledge to use it?',
      answer: 'No technical knowledge is required! Our platform is designed so anyone can manage their website easily, regardless of experience.'
    },
    {
      question: 'Can I upgrade my website later?',
      answer: 'Absolutely! You can upgrade your website or add new features at any time as your business grows.'
    },
    {
      question: 'Do you offer custom features or integrations?',
      answer: 'Yes, we offer custom features and integrations tailored to your business needs. Just let us know what you need!'
    },
    {
      question: 'How long does it take to build a website?',
      answer: 'Most websites are ready in just a few days, depending on the complexity and your requirements.'
    },
  ];
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-start gap-12">
        <div className="md:w-1/2">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Frequently Asked Questions</h2>
        </div>
        <div className="md:w-1/2 flex flex-col gap-6">
          {faqs.map((faq, idx) => (
            <motion.div key={idx} layout>
              <button
                className={`cursor-pointer flex items-center w-full text-left gap-4 px-6 py-4 rounded-xl transition  hover:bg-[#edeafd] ${openIndex === idx ? 'shadow' : ''}`}
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                aria-expanded={openIndex === idx}
              >
                <span
                  className="select-none"
                  style={{ color: '#8982cf', fontSize: '2rem', fontWeight: 500, fontFamily: 'monospace', lineHeight: 1 }}
                >
                  {openIndex === idx ? '×' : '+'}
                </span>
                <span className="font-semibold text-lg" style={{ color: openIndex === idx ? '#8982cf' : undefined }}>
                  {faq.question}
                </span>
              </button>
              <AnimatePresence initial={false}>
                {openIndex === idx && (
                  <motion.div
                    key="wrapper"
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="bg-[#f8f7fd] px-10 pb-6 pt-2 rounded-b-xl text-gray-800 text-base"
                    >
                      {faq.answer}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 
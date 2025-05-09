'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faTools, faHardHat } from '@fortawesome/free-solid-svg-icons';

interface ComingSoonProps {
  pageName: string;
}

export default function ComingSoon({ pageName }: ComingSoonProps) {
  const [dots, setDots] = useState('');
  
  // Animation for the loading dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) return '';
        return prev + '.';
      });
    }, 500);
    
    return () => clearInterval(interval);
  }, []);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-white bg-[radial-gradient(theme(colors.gray.200)_1px,transparent_1px)] bg-[size:20px_20px] p-4">
      <motion.div 
        className="max-w-2xl w-full bg-white rounded-xl shadow-xl overflow-hidden p-1"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="relative w-full h-4 bg-gradient-to-r from-[#8982cf] to-[#dbc1d0] rounded-t-lg"></div>
        
        <div className="p-8 md:p-12">
          <motion.div 
            className="flex justify-center mb-8"
            variants={itemVariants}
          >
            <div className="relative w-32 h-32 flex items-center justify-center">
              <div className="absolute inset-0 bg-[#f5f3ff] opacity-60 rounded-full animate-ping"></div>
              <div className="relative bg-[#f5f3ff] p-6 rounded-full shadow-md z-10">
                <FontAwesomeIcon icon={faTools} className="h-12 w-12 text-[#8982cf]" />
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4">
              Oops! This page is under construction
            </h1>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-center mb-6">
              <div className="relative h-10 bg-[#f5f3ff] rounded-md px-6 py-2 flex items-center">
                <FontAwesomeIcon icon={faHardHat} className="h-4 w-4 text-[#8982cf] mr-2" />
                <span className="text-gray-700 font-medium">{pageName}</span>
              </div>
            </div>
          </motion.div>
          
          <motion.p 
            className="text-gray-600 text-center mb-8"
            variants={itemVariants}
          >
            Our team at Kitions is working hard to bring you amazing content here{dots}
            <br />
            Please check back soon!
          </motion.p>
          
          <motion.div 
            className="flex justify-center"
            variants={itemVariants}
          >
            <Link 
              href="/" 
              className="px-6 py-3 bg-[#8982cf] text-white rounded-lg hover:bg-[#7269c0] transition-colors flex items-center shadow-md"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              Back to Home
            </Link>
          </motion.div>
        </div>
      </motion.div>
      
      <div className="text-center text-gray-500 text-sm mt-8">
        © {new Date().getFullYear()} Kitions. All rights reserved.
      </div>
    </div>
  );
} 
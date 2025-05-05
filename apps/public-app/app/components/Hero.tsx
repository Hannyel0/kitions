'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import React from 'react';

export default function Hero() {
  // Navbar height calculation:
  // py-5 = 1.25rem * 2 = 2.5rem (top/bottom padding)
  // SVG height h-7 = 1.75rem
  // shadow-sm = ~1px
  // Total: ~4.3rem or ~68px
  return (
    <section className="w-full px-4 sm:px-8 md:px-12 lg:px-20 min-h-[90vh] h-[calc(100vh-68px)] flex items-center bg-white relative overflow-hidden">
      {/* Subtle grid lines background */}
      <div className="absolute inset-0 grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 w-full h-full" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className={i < 6 ? "border-l border-gray-100 h-full sm:block" : (i < 8 ? "border-l border-gray-100 h-full hidden sm:block md:block" : "border-l border-gray-100 h-full hidden md:block")}></div>
        ))}
      </div>
      <div className="absolute inset-0 grid grid-rows-4 sm:grid-rows-6 w-full h-full" aria-hidden="true">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={i < 4 ? "border-t border-gray-100 w-full" : "border-t border-gray-100 w-full hidden sm:block"}></div>
        ))}
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center relative z-10">
        <div className="w-full md:w-1/2 md:pr-4 lg:pr-8 mb-8 md:mb-0">
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold bg-gradient-to-r from-[#8982cf] to-[#7873b3] text-transparent bg-clip-text">
              Order Smarter. <br /> Sell Faster.
            </h1>
          </motion.div>
          <motion.p 
            className="text-base sm:text-lg md:text-xl text-gray-600 max-w-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
          >
            Kitions connects retailers with trusted suppliers to streamline ordering and boost sales.
          </motion.p>
          <motion.div 
            className="mt-6 sm:mt-8 flex flex-wrap gap-3 sm:gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
          >
            <a 
              href="/signup" 
              className="bg-[#8982cf] text-white font-medium px-4 sm:px-6 py-2.5 sm:py-3 rounded-full hover:bg-[#7873b3] transition-colors shadow-sm border border-[#7873b3] inline-block text-sm sm:text-base"
            >
              Sell with Kitions
            </a>
            <a 
              href="/products" 
              className="bg-white text-[#8982cf] font-medium px-4 sm:px-6 py-2.5 sm:py-3 rounded-full hover:bg-gray-50 transition-colors shadow-sm border border-[#8982cf] inline-block text-sm sm:text-base"
            >
              Find products
            </a>
          </motion.div>
        </div>
        <motion.div 
          className="w-full md:w-1/2 relative z-[5] mt-4 md:mt-0"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* White radial glow to fade out the grid lines */}
          <div className="absolute inset-0 -m-6 sm:-m-10 bg-white rounded-full blur-3xl opacity-80" style={{ filter: 'blur(30px)' }}></div>
          
          <motion.div 
            className="relative cursor-pointer mx-auto max-w-[450px] md:max-w-none"
            whileHover={{ 
              scale: 1.03,
              rotate: 1,
              
            }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 15 
            }}
          >
            <Image
              src="/HeroPageImage.png"
              alt="Business efficiency with Kitions"
              width={700}
              height={500}
              className="rounded-lg"
              priority
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
} 
'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function AccessSection() {
  const [isHovering, setIsHovering] = useState(false);
  
  return (
    <section className="w-full px-4 sm:px-8 md:px-12 lg:px-20 py-12 sm:py-16 md:py-20 lg:py-24 bg-[#f5f4fb] relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center relative z-10">
        <motion.div 
          className="w-full md:w-1/2 relative z-10 mb-12 md:mb-0 order-2 md:order-1"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.div 
            className="relative cursor-pointer overflow-visible mx-auto max-w-[450px] md:max-w-none"
            onHoverStart={() => setIsHovering(true)}
            onHoverEnd={() => setIsHovering(false)}
          >
            <motion.div
              animate={{
                scale: isHovering ? 1.05 : 1
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20
              }}
            >
              <Image
                src="/guy-scanning.jpg"
                alt="Business person scanning products"
                width={500}
                height={300}
                className="rounded-lg shadow-md"
                priority
              />
            </motion.div>
            
            {/* Overlay card */}
            <motion.div 
              className="absolute bottom-0 transform translate-y-1/4 bg-white rounded-xl sm:rounded-3xl p-3 sm:p-4 shadow-lg w-[70%] sm:w-[60%] max-w-sm"
              initial={{ left: "-5%" }}
              animate={{ 
                left: isHovering ? "15%" : "-5%",
                scale: isHovering ? 1.08 : 1,
                boxShadow: isHovering 
                  ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
                  : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
              }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 25 
              }}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm sm:text-xl font-bold text-gray-900">ACCELERATE SALES</h3>
                  <p className="text-gray-700 mt-1 text-xs sm:text-xs">
                    Get in contact with thousands of retail stores.
                  </p>
                </div>
                <div className="ml-3">
                  <Image 
                    src="/eggs-overlay.svg" 
                    alt="Fresh eggs and food products" 
                    width={60} 
                    height={60}
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
        
        <div className="w-full md:w-1/2 md:pl-4 lg:pl-8 order-1 md:order-2">
          <motion.h2 
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            Gain Exclusive Access to Thousands of Buyers
          </motion.h2>
          <motion.div 
            className="space-y-3 sm:space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
          >
            <p className="text-base sm:text-lg text-gray-600">
            Kitions connects retailers directly with carefully verified food suppliers and brands. 
            </p>
            <p className="text-base sm:text-lg text-gray-600">
            No more endless calls, no outdated catalogs — just a clean, reliable platform where you can browse suppliers, see real-time pricing, and place orders instantly.             
            </p>
            <p className="text-base sm:text-lg text-gray-600">
            Save valuable time, cut costs, and work only with trusted partners who care about your business as much as you do.            </p>
          </motion.div>
          <motion.div 
            className="mt-6 sm:mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
          >
            <a 
              href="/register" 
              className="bg-[#8982cf] text-white font-medium px-4 sm:px-6 py-2.5 sm:py-3 rounded-full hover:bg-[#7873b3] transition-colors shadow-sm border border-[#7873b3] inline-block text-sm sm:text-base"
            >
              Sell products Now
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 
'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function TargetAudienceSection() {
  return (
    <section className="w-full py-12 sm:py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 md:mb-16 px-4">
          Grow your business connecting with the right people
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 max-w-6xl mx-auto">
          {/* For Distributors */}
          <motion.div 
            className="flex flex-col items-center text-center px-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="relative mb-6">
              <div className="absolute -left-6 sm:-left-10 -bottom-6">
                <svg width="60" height="60" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-[80px] sm:h-[80px]">
                  <rect x="0" y="0" width="16" height="16" fill="#8982cf" />
                  <rect x="0" y="20" width="16" height="16" fill="#8982cf" />
                  <rect x="0" y="40" width="16" height="16" fill="#8982cf" />
                  <rect x="20" y="0" width="16" height="16" fill="#8982cf" />
                  <rect x="20" y="20" width="16" height="16" fill="#ebe8f4" />
                  <rect x="40" y="0" width="16" height="16" fill="#8982cf" />
                </svg>
              </div>
              <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full overflow-hidden border-4 sm:border-8 border-gray-100 shadow-lg">
                <Image
                  src="/store-picture.jpg"
                  alt="Store with inventory"
                  width={300}
                  height={300}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="absolute -right-2 sm:-right-4 top-1/3">
                <svg width="20" height="20" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-[30px] sm:h-[30px]">
                  <rect x="5" y="5" width="20" height="20" fill="#ebe8f4" />
                </svg>
              </div>
            </div>
            
            <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">For Retailers</h3>
            <p className="text-gray-600 mb-4 sm:mb-6 px-4 max-w-xs mx-auto">
              Make ordering products fast and convenient.
            </p>
            <a 
              href="/distributors" 
              className="border border-[#8982cf] text-[#8982cf] hover:bg-[#8982cf] hover:text-white transition-colors px-4 sm:px-6 py-2 rounded text-sm sm:text-base"
            >
              Learn more
            </a>
          </motion.div>
          
          {/* For Brands */}
          <motion.div 
            className="flex flex-col items-center text-center px-4 mt-8 md:mt-0"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="relative mb-6">
              <div className="absolute -right-4 sm:-right-6 -bottom-4">
                <svg width="60" height="60" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-[80px] sm:h-[80px]">
                  <rect x="64" y="64" width="16" height="16" fill="#ebe8f4" />
                  <rect x="64" y="44" width="16" height="16" fill="#8982cf" />
                  <rect x="64" y="24" width="16" height="16" fill="#ebe8f4" />
                  <rect x="44" y="64" width="16" height="16" fill="#ebe8f4" />
                  <rect x="44" y="44" width="16" height="16" fill="#8982cf" />
                  <rect x="24" y="64" width="16" height="16" fill="#ebe8f4" />
                </svg>
              </div>
              <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full overflow-hidden border-4 sm:border-8 border-gray-100 shadow-lg">
                <Image
                  src="/guy-scanning.jpg"
                  alt="Person scanning products"
                  width={300}
                  height={300}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="absolute -left-2 sm:-left-4 top-1/3">
                <svg width="20" height="20" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-[30px] sm:h-[30px]">
                  <rect x="5" y="5" width="20" height="20" fill="#8982cf" />
                </svg>
              </div>
            </div>
            
            <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">For Brands</h3>
            <p className="text-gray-600 mb-4 sm:mb-6 max-w-xs mx-auto px-4">
              List your products and connect with retailers easily.
            </p>
            <a 
              href="/brands" 
              className="border border-[#8982cf] text-[#8982cf] hover:bg-[#8982cf] hover:text-white transition-colors px-4 sm:px-6 py-2 rounded text-sm sm:text-base"
            >
              Learn more
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 
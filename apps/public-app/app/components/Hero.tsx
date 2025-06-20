'use client';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, Package, Zap, ShoppingCart, Store } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import DotGrid from './DotGrid';

export default function Hero() {
  return (
    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 relative overflow-hidden">
      {/* Reactive Dots Background */}
      <div className="absolute inset-0 w-full h-full" aria-hidden="true">
        <DotGrid
          dotSize={3}
          gap={25}
          baseColor="#e2e8f0"
          activeColor="#8982cf"
          proximity={50}
          speedTrigger={1}
          shockRadius={500}
          shockStrength={20}
          className="opacity-60"
        />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 xl:gap-20 items-center min-h-[70vh] sm:min-h-[80vh]">
        {/* Left Content */}
        <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-[#8982cf] font-medium text-xs sm:text-sm bg-gradient-to-r from-[#f5f3ff] to-[#f4fff4d8] overflow-hidden group mx-auto lg:mx-0"
          >
            <Zap className="w-3 h-3 sm:w-4 sm:h-4 z-10 relative" />
            <span className="z-10 relative">B2B Food Marketplace</span>

            {/* Glowing animated border */}
            <span
              className="absolute inset-0 rounded-full bg-[conic-gradient(at_top_left,_#ABD4AB,_#9BC49B,_#ABD4AB,_#8982cf,_#ABD4AB)] opacity-40 blur-sm animate-[spin_4s_linear_infinite] group-hover:opacity-60"
            ></span>

            {/* Inner fill mask to hide center */}
            <span className="absolute inset-[1px] bg-gradient-to-r from-[#f5f3ff] to-[#f4fff4d8] rounded-full z-0"></span>
          </motion.div>

          {/* Main Headline */}
          <div className="space-y-3 sm:space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight"
            >
              <span className="text-[#8982cf] sm:bg-gradient-to-r sm:from-[#8982cf] sm:to-[#ABD4AB] sm:bg-clip-text sm:text-transparent block">
                Order Smarter.
              </span>
              <span className="text-gray-900 block">
                Sell Faster.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl mx-auto lg:mx-0"
            >
              Connect retailers with trusted suppliers on the most advanced B2B food marketplace. Streamline your ordering, boost your sales.
            </motion.p>
          </div>

          {/* Key Benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 py-4 sm:py-6">
            <div className="flex items-center gap-2 sm:gap-3 text-gray-700 justify-center lg:justify-start">
              <div className="p-1.5 sm:p-2 bg-gradient-to-br from-[#06b6d4]/10 to-[#06b6d4]/5 rounded-lg border border-[#06b6d4]/20">
                <Store className="w-4 h-4 sm:w-5 sm:h-5 text-[#06b6d4]" />
              </div>
              <span className="font-medium text-sm sm:text-base">10,000+ Retailers</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 text-gray-700 justify-center lg:justify-start">
              <div className="p-1.5 sm:p-2 bg-gradient-to-br from-[#ABD4AB]/10 to-[#ABD4AB]/5 rounded-lg border border-[#ABD4AB]/20">
                <Package className="w-4 h-4 sm:w-5 sm:h-5 text-[#ABD4AB]" />
              </div>
              <span className="font-medium text-sm sm:text-base">Instant Ordering</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 text-gray-700 justify-center lg:justify-start">
              <div className="p-1.5 sm:p-2 bg-gradient-to-br from-[#10b981]/10 to-[#10b981]/5 rounded-lg border border-[#10b981]/20">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-[#10b981]" />
              </div>
              <span className="font-medium text-sm sm:text-base">Boost Sales</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
            <Link href="/signup">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group bg-gradient-to-r from-[#ABD4AB] to-[#9BC49B] hover:from-[#95C295] hover:to-[#ABD4AB] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl cursor-pointer text-sm sm:text-base w-full sm:w-auto"
              >
                Start Selling Today
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </motion.div>
            </Link>
            <Link href="/for-distributors">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold border-2 border-[#8982cf] text-[#8982cf] hover:bg-[#8982cf] hover:text-white transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 text-sm sm:text-base w-full sm:w-auto"
              >
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                Browse Products
              </motion.div>
            </Link>
          </div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.3 }}
            className="pt-4 sm:pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-500 justify-center lg:justify-start"
          >
            <div className="flex items-center gap-2">
              <div className="relative">
                {/* Main pulsing dot */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [1, 0.9, 1]
                  }}
                  transition={{ 
                    duration: 2.5, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    repeatType: "loop"
                  }}
                  className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-[#10b981] rounded-full relative z-10"
                />
                
                {/* First pulse ring */}
                <motion.div
                  animate={{ 
                    scale: [1, 2, 1],
                    opacity: [0.6, 0, 0.6]
                  }}
                  transition={{ 
                    duration: 2.5, 
                    repeat: Infinity, 
                    ease: "easeOut",
                    repeatType: "loop"
                  }}
                  className="absolute inset-0 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-[#10b981] rounded-full"
                />
                
                {/* Second pulse ring */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.6, 1],
                    opacity: [0.4, 0, 0.4]
                  }}
                  transition={{ 
                    duration: 2.5, 
                    repeat: Infinity, 
                    ease: "easeOut",
                    delay: 0.8,
                    repeatType: "loop"
                  }}
                  className="absolute inset-0 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-[#059669] rounded-full"
                />
                
                {/* Third pulse ring */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0, 0.3]
                  }}
                  transition={{ 
                    duration: 2.5, 
                    repeat: Infinity, 
                    ease: "easeOut",
                    delay: 1.5,
                    repeatType: "loop"
                  }}
                  className="absolute inset-0 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-[#34d399] rounded-full"
                />
              </div>
              <motion.span
                animate={{ 
                  color: ["#6b7280", "#10b981", "#6b7280"]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  repeatType: "loop"
                }}
                className="font-medium"
              >
                Live Platform
              </motion.span>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <div>✓ Free to Start</div>
              <div>✓ Verified Suppliers</div>
            </div>
          </motion.div>
        </div>

        {/* Right Visual - Dynamic Overlapping Cards Layout */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="hidden lg:block relative h-[400px] sm:h-[500px] lg:h-[600px] flex items-center justify-center mt-8 lg:mt-0"
        >
          <div className="relative w-full h-full flex items-center justify-center">
            
            {/* Card 1 - Background Left */}
            <motion.div
              initial={{ opacity: 0, rotate: -10, scale: 0.9 }}
              animate={{ opacity: 1, rotate: -12, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="absolute -left-4 sm:-left-6 lg:-left-8 top-8 sm:top-10 lg:top-12 z-10"
            >
              <div className="relative w-32 h-40 sm:w-40 sm:h-52 md:w-44 md:h-56 lg:w-48 lg:h-64 xl:w-56 xl:h-72">
                <Image
                  src="/Hero-Homepage-c.webp"
                  alt="Food marketplace"
                  fill
                  className="object-cover rounded-xl sm:rounded-2xl border-2 sm:border-4 border-white shadow-xl sm:shadow-2xl"
                />
              </div>
            </motion.div>

            {/* Card 2 - Center Front */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="relative z-30"
            >
              <div className="relative w-36 h-44 sm:w-44 sm:h-56 md:w-48 md:h-60 lg:w-52 lg:h-68 xl:w-60 xl:h-76">
                <Image
                  src="/store-picture.jpg"
                  alt="Retail stores"
                  fill
                  className="object-cover rounded-xl sm:rounded-2xl border-2 sm:border-4 border-white shadow-xl sm:shadow-2xl"
                />
              </div>
            </motion.div>

            {/* Card 3 - Background Right */}
            <motion.div
              initial={{ opacity: 0, rotate: 10, scale: 0.9 }}
              animate={{ opacity: 1, rotate: 15, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="absolute -right-3 sm:-right-4 lg:-right-6 top-6 sm:top-8 z-20"
            >
              <div className="relative w-30 h-36 sm:w-36 sm:h-48 md:w-40 md:h-52 lg:w-44 lg:h-60 xl:w-52 xl:h-68">
                <Image
                  src="/orderDelivery.jpg"
                  alt="Order delivery"
                  fill
                  className="object-cover rounded-xl sm:rounded-2xl border-2 sm:border-4 border-white shadow-xl sm:shadow-2xl"
                />
              </div>
            </motion.div>

            {/* Floating Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="absolute -bottom-2 sm:-bottom-4 right-4 sm:right-6 lg:right-8 z-40 bg-gradient-to-r from-[#8982cf] to-[#7873b3] text-white px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-full shadow-lg border-2 border-[#ABD4AB]/20"
            >
              <div className="flex items-center gap-1 sm:gap-2">
                <Store className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                <span className="font-semibold text-xs sm:text-sm">Smart Marketplace</span>
              </div>
            </motion.div>

            {/* Decorative Elements */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.0 }}
              className="absolute -top-4 sm:-top-6 lg:-top-8 left-8 sm:left-10 lg:left-12 w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-[#ABD4AB]/20 to-[#9BC49B]/20 rounded-full blur-xl z-0"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.1 }}
              className="absolute -bottom-6 sm:-bottom-8 lg:-bottom-12 right-12 sm:right-16 lg:right-20 w-10 h-10 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-[#06b6d4]/20 to-[#0891b2]/20 rounded-full blur-xl z-0"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="absolute top-1/2 -left-2 sm:-left-3 lg:-left-4 w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12 bg-gradient-to-br from-[#10b981]/20 to-[#059669]/20 rounded-full blur-xl z-0"
            />
          </div>
        </motion.div>
      </div>

      {/* Background Decorative Elements */}
      <div className="absolute top-10 sm:top-16 lg:top-20 right-10 sm:right-16 lg:right-20 w-48 h-48 sm:w-64 sm:h-64 lg:w-72 lg:h-72 bg-gradient-to-br from-[#8982cf]/5 to-[#ABD4AB]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 sm:bottom-16 lg:bottom-20 left-10 sm:left-16 lg:left-20 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-gradient-to-br from-[#06b6d4]/5 to-[#10b981]/5 rounded-full blur-3xl" />
    </section>
  );
} 
'use client';
import { motion } from 'framer-motion';
import { ArrowRight, Users, TrendingUp, Package, Zap, ShoppingCart, Store } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="w-full px-4 sm:px-8 md:px-12 lg:px-20 min-h-[90vh] h-[calc(100vh-68px)] flex items-center bg-white relative overflow-hidden">
      {/* Subtle grid lines background */}
      <div className="absolute inset-0 grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 w-full h-full" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="border-r border-gray-100 opacity-30" />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-8"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#f5f3ff] border border-[#8982cf]/20 rounded-full text-[#8982cf] font-medium text-sm"
          >
            <Zap className="w-4 h-4" />
            B2B Food Marketplace
          </motion.div>

          {/* Main Headline */}
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight"
            >
              <span className="bg-gradient-to-r from-[#8982cf] to-[#7873b3] bg-clip-text text-transparent">
                Order Smarter.
              </span>
              <br />
              <span className="text-gray-900">
                Sell Faster.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-xl"
            >
              Connect retailers with trusted suppliers on the most advanced B2B food marketplace. Streamline your ordering, boost your sales.
            </motion.p>
          </div>

          {/* Key Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6"
          >
            <div className="flex items-center gap-3 text-gray-700">
              <div className="p-2 bg-[#f5f3ff] rounded-lg">
                <Store className="w-5 h-5 text-[#8982cf]" />
              </div>
              <span className="font-medium">10,000+ Retailers</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <div className="p-2 bg-[#f5f3ff] rounded-lg">
                <Package className="w-5 h-5 text-[#8982cf]" />
              </div>
              <span className="font-medium">Instant Ordering</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <div className="p-2 bg-[#f5f3ff] rounded-lg">
                <TrendingUp className="w-5 h-5 text-[#8982cf]" />
              </div>
              <span className="font-medium">Boost Sales</span>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link href="/signup">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group bg-[#8982cf] hover:bg-[#7873b3] text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl cursor-pointer"
              >
                Start Selling Today
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.div>
            </Link>
            <Link href="/for-distributors">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-lg font-semibold border-2 border-[#8982cf] text-[#8982cf] hover:bg-[#8982cf] hover:text-white transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Browse Products
              </motion.div>
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.3 }}
            className="pt-6 border-t border-gray-200 flex items-center gap-6 text-sm text-gray-500"
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
                  className="w-2.5 h-2.5 bg-green-500 rounded-full relative z-10"
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
                  className="absolute inset-0 w-2.5 h-2.5 bg-green-500 rounded-full"
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
                  className="absolute inset-0 w-2.5 h-2.5 bg-green-400 rounded-full"
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
                  className="absolute inset-0 w-2.5 h-2.5 bg-green-300 rounded-full"
                />
              </div>
              <motion.span
                animate={{ 
                  color: ["#6b7280", "#059669", "#6b7280"]
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
            <div>✓ Free to Start</div>
            <div>✓ Verified Suppliers</div>
          </motion.div>
        </motion.div>

        {/* Right Visual - Dynamic Overlapping Cards Layout */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative lg:h-[600px] flex items-center justify-center"
        >
          <div className="relative w-full h-full flex items-center justify-center">
            
            {/* Card 1 - Background Left */}
            <motion.div
              initial={{ opacity: 0, rotate: -10, scale: 0.9 }}
              animate={{ opacity: 1, rotate: -12, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="absolute -left-8 top-12 z-10"
            >
              <div className="relative w-48 h-64 lg:w-56 lg:h-72">
                <Image
                  src="/Hero-Homepage-c.webp"
                  alt="Food marketplace"
                  fill
                  className="object-cover rounded-2xl border-4 border-white shadow-2xl"
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
              <div className="relative w-52 h-68 lg:w-60 lg:h-76">
                <Image
                  src="/store-picture.jpg"
                  alt="Retail stores"
                  fill
                  className="object-cover rounded-2xl border-4 border-white shadow-2xl"
                />
              </div>
            </motion.div>

            {/* Card 3 - Background Right */}
            <motion.div
              initial={{ opacity: 0, rotate: 10, scale: 0.9 }}
              animate={{ opacity: 1, rotate: 15, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="absolute -right-6 top-8 z-20"
            >
              <div className="relative w-44 h-60 lg:w-52 lg:h-68">
                <Image
                  src="/orderDelivery.jpg"
                  alt="Order delivery"
                  fill
                  className="object-cover rounded-2xl border-4 border-white shadow-2xl"
                />
              </div>
            </motion.div>

            {/* Floating Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="absolute -bottom-4 right-8 z-40 bg-[#8982cf] text-white px-6 py-3 rounded-full shadow-lg"
            >
              <div className="flex items-center gap-2">
                <Store className="w-5 h-5" />
                <span className="font-semibold text-sm">Smart Marketplace</span>
              </div>
            </motion.div>

            {/* Decorative Elements */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.0 }}
              className="absolute -top-8 left-12 w-16 h-16 bg-gradient-to-br from-[#8982cf]/20 to-[#7873b3]/20 rounded-full blur-xl z-0"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.1 }}
              className="absolute -bottom-12 right-20 w-20 h-20 bg-gradient-to-br from-[#7873b3]/20 to-[#8982cf]/20 rounded-full blur-xl z-0"
            />
          </div>
        </motion.div>
      </div>

      {/* Background Decorative Elements */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-[#8982cf]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#7873b3]/5 rounded-full blur-3xl" />
    </section>
  );
} 
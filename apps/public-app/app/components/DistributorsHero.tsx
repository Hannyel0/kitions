'use client';
import { motion } from 'framer-motion';
import { ArrowRight, Users, TrendingUp, Package, Zap } from 'lucide-react';
import Link from 'next/link';

export default function DistributorsHero() {
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
            className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full text-[#8982cf] font-medium text-sm bg-gradient-to-r from-[#f5f3ff] to-[#f4fff4d8] overflow-hidden group"
          >
            <Zap className="w-4 h-4 z-10 relative" />
            <span className="z-10 relative">Built for Food Distributors</span>

            {/* Glowing animated border */}
            <span
              className="absolute inset-0 rounded-full bg-[conic-gradient(at_top_left,_#8982cf,_#7873b3,_#8982cf,_#ABD4AB,_#8982cf)] opacity-40 blur-sm animate-[spin_4s_linear_infinite] group-hover:opacity-60"
            ></span>

            {/* Inner fill mask to hide center */}
            <span className="absolute inset-[1px] bg-gradient-to-r from-[#f5f3ff] to-[#f4fff4d8] rounded-full z-0"></span>
          </motion.div>

          {/* Main Headline */}
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight"
            >
              <span className="bg-gradient-to-r from-[#8982cf] to-[#ABD4AB] bg-clip-text text-transparent">
                Expand Your Reach,
              </span>
              <br />
              <span className="text-gray-900">
                Grow Your Business
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-xl"
            >
              Connect with thousands of verified retailers, streamline your operations, and scale your food distribution business with Kitions&apos; powerful B2B platform.
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
              <div className="p-2 bg-gradient-to-br from-[#8982cf]/10 to-[#7873b3]/10 rounded-lg border border-[#8982cf]/20">
                <Users className="w-5 h-5 text-[#8982cf]" />
              </div>
              <span className="font-medium">10,000+ Retailers</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <div className="p-2 bg-gradient-to-br from-[#ABD4AB]/10 to-[#9BC49B]/10 rounded-lg border border-[#ABD4AB]/20">
                <Package className="w-5 h-5 text-[#ABD4AB]" />
              </div>
              <span className="font-medium">Easy Inventory</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <div className="p-2 bg-gradient-to-br from-[#8982cf]/10 to-[#7873b3]/10 rounded-lg border border-[#8982cf]/20">
                <TrendingUp className="w-5 h-5 text-[#8982cf]" />
              </div>
              <span className="font-medium">Grow Revenue</span>
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
                className="group bg-gradient-to-r from-[#8982cf] to-[#7873b3] hover:from-[#7873b3] hover:to-[#8982cf] text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl cursor-pointer"
              >
                Join as a Distributor
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.div>
            </Link>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-lg font-semibold border-2 border-[#ABD4AB] text-[#ABD4AB] hover:bg-[#ABD4AB] hover:text-white transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
            >
              <Package className="w-5 h-5" />
              View Live Demo
            </motion.div>
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
            <div>✓ No Setup Fees</div>
            <div>✓ 24/7 Support</div>
          </motion.div>
        </motion.div>

        {/* Right Visual */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative lg:h-[600px] flex items-center justify-center"
        >
          {/* Dashboard Preview Mockup */}
          <div className="relative w-full max-w-lg">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              {/* Mock Dashboard Header */}
              <div className="bg-[#8982cf] p-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-lg">Distributor Dashboard</div>
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full"></div>
                </div>
              </div>
              
              {/* Mock Dashboard Stats */}
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#f5f3ff] p-4 rounded-lg">
                    <div className="text-2xl font-bold text-[#8982cf]">2.4k</div>
                    <div className="text-sm text-gray-600">Active Retailers</div>
                  </div>
                  <div className="bg-[#f5f3ff] p-4 rounded-lg">
                    <div className="text-2xl font-bold text-[#8982cf]">$847k</div>
                    <div className="text-sm text-gray-600">Monthly Sales</div>
                  </div>
                </div>
                
                {/* Mock Chart */}
                <div className="h-32 bg-gradient-to-br from-[#8982cf]/10 to-[#7873b3]/10 rounded-lg flex items-end p-4 gap-2">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-[#8982cf] rounded-t"
                      style={{ 
                        height: `${Math.random() * 80 + 20}%`,
                        width: '12%'
                      }}
                    />
                  ))}
                </div>
                
                {/* Mock Recent Orders */}
                <div className="space-y-3">
                  <div className="text-sm font-semibold text-gray-700">Recent Orders</div>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-[#8982cf]/20 rounded-full flex items-center justify-center">
                        <Package className="w-5 h-5 text-[#8982cf]" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-black">Order #{1000 + i}</div>
                        <div className="text-xs text-gray-500">2 hours ago</div>
                      </div>
                      <div className="text-sm font-semibold text-[#8982cf]">
                        ${Math.floor(Math.random() * 500 + 100)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 bg-green-500 text-white p-3 rounded-lg shadow-lg text-sm font-semibold"
            >
              +15% Growth
            </motion.div>
            
            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-4 -left-4 bg-[#8982cf] text-white p-3 rounded-lg shadow-lg text-sm font-semibold"
            >
              New Orders: 47
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Background Decorative Elements */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-[#8982cf]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#7873b3]/5 rounded-full blur-3xl" />
    </section>
  );
} 
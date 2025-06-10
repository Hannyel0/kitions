'use client';
import { motion } from 'framer-motion';
import { ArrowRight, Store, Truck, Users, Package, TrendingUp, Zap } from 'lucide-react';
import Link from 'next/link';

export default function TargetAudienceSection() {
  return (
    <section className="w-full py-20 px-4 sm:px-8 md:px-12 lg:px-20 bg-gradient-to-br from-gray-50 to-white relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#8982cf]/20 rounded-full text-[#8982cf] font-medium text-sm mb-6 shadow-sm"
          >
            <Users className="w-4 h-4" />
            Perfect for Both Sides
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
          >
            Built for Your
            <br />
            <span className="bg-gradient-to-r from-[#8982cf] to-[#7873b3] bg-clip-text text-transparent">
              Business Success
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Whether you're buying or selling, Kitions provides the tools and network you need to thrive
          </motion.p>
        </motion.div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* For Retailers */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="group"
          >
            <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 group-hover:border-[#8982cf]/30 h-full">
              {/* Icon Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-gradient-to-br from-[#8982cf]/10 to-[#7873b3]/10 rounded-2xl group-hover:from-[#8982cf]/20 group-hover:to-[#7873b3]/20 transition-all duration-300">
                  <Store className="w-8 h-8 text-[#8982cf]" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-[#8982cf] transition-colors duration-300">
                    For Retailers
                  </h3>
                  <p className="text-gray-600">Order smarter, stock better</p>
                </div>
              </div>

              {/* Benefits List */}
              <div className="space-y-4 mb-8">
                {[
                  "Access 1,000+ verified suppliers instantly",
                  "Real-time inventory and pricing updates",
                  "Automated ordering and restock alerts",
                  "Wholesale pricing and volume discounts",
                  "Same-day and next-day delivery options"
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-2 h-2 bg-[#8982cf] rounded-full"></div>
                    <span className="text-gray-700">{benefit}</span>
                  </motion.div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-8 p-6 bg-gradient-to-br from-[#f5f3ff] to-white rounded-2xl border border-[#8982cf]/10">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#8982cf] mb-1">10,000+</div>
                  <div className="text-sm text-gray-600">Active Retailers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#8982cf] mb-1">95%</div>
                  <div className="text-sm text-gray-600">Satisfaction Rate</div>
                </div>
              </div>

              {/* CTA */}
              <Link href="/signup">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-[#8982cf] hover:bg-[#7873b3] text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl cursor-pointer"
                >
                  Start Ordering Today
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.div>
              </Link>
            </div>
          </motion.div>

          {/* For Suppliers */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="group"
          >
            <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 group-hover:border-[#8982cf]/30 h-full">
              {/* Icon Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-gradient-to-br from-[#8982cf]/10 to-[#7873b3]/10 rounded-2xl group-hover:from-[#8982cf]/20 group-hover:to-[#7873b3]/20 transition-all duration-300">
                  <Truck className="w-8 h-8 text-[#8982cf]" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-[#8982cf] transition-colors duration-300">
                    For Suppliers
                  </h3>
                  <p className="text-gray-600">Sell faster, reach more</p>
                </div>
              </div>

              {/* Benefits List */}
              <div className="space-y-4 mb-8">
                {[
                  "Connect with 10,000+ verified retailers",
                  "Automated order processing and invoicing",
                  "Real-time inventory sync across channels",
                  "Analytics dashboard for sales insights",
                  "Dedicated account management support"
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-2 h-2 bg-[#8982cf] rounded-full"></div>
                    <span className="text-gray-700">{benefit}</span>
                  </motion.div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-8 p-6 bg-gradient-to-br from-[#f5f3ff] to-white rounded-2xl border border-[#8982cf]/10">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#8982cf] mb-1">1,000+</div>
                  <div className="text-sm text-gray-600">Active Suppliers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#8982cf] mb-1">40%</div>
                  <div className="text-sm text-gray-600">Avg. Sales Increase</div>
                </div>
              </div>

              {/* CTA */}
              <Link href="/for-distributors">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full border-2 border-[#8982cf] text-[#8982cf] hover:bg-[#8982cf] hover:text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                >
                  Learn More
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-br from-[#8982cf] to-[#7873b3] rounded-3xl p-12 text-white relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-y-32 -translate-x-32"></div>
            
            <div className="relative z-10">
              <h3 className="text-3xl sm:text-4xl font-bold mb-4">
                Ready to Transform Your Business?
              </h3>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Join thousands of businesses already growing with Kitions
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-8 py-4 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl cursor-pointer"
                  >
                    Get Started Free
                    <Zap className="w-5 h-5" />
                  </motion.div>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-white text-white hover:bg-white hover:text-[#8982cf] px-8 py-4 rounded-xl font-bold transition-all duration-300"
                >
                  Schedule Demo
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 
'use client';
import { motion } from 'framer-motion';
import { Users, TrendingUp, Package, Clock, Shield, Zap } from 'lucide-react';

export default function AccessSection() {
  const benefits = [
    {
      icon: Users,
      title: "Connect with Verified Suppliers",
      description: "Access 1,000+ pre-verified food suppliers and brands, all background-checked for quality and reliability."
    },
    {
      icon: Clock,
      title: "Instant Order Processing",
      description: "Place orders in seconds with real-time inventory, automated invoicing, and instant confirmation."
    },
    {
      icon: TrendingUp,
      title: "Boost Your Profit Margins",
      description: "Get wholesale pricing, volume discounts, and exclusive deals that increase your bottom line."
    },
    {
      icon: Package,
      title: "Real-time Inventory Sync",
      description: "Never run out of stock with automated inventory tracking and low-stock alerts."
    },
    {
      icon: Shield,
      title: "Secure Payment Processing",
      description: "Bank-level security with multiple payment options, credit terms, and fraud protection."
    },
    {
      icon: Zap,
      title: "Lightning Fast Delivery",
      description: "Optimized logistics network ensuring fresh products reach you faster than ever before."
    }
  ];

  return (
    <section className="w-full py-12 sm:py-16 md:py-20 px-3 sm:px-6 md:px-8 lg:px-12 xl:px-20 bg-white relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-14 md:mb-16"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#f5f3ff] border border-[#8982cf]/20 rounded-full text-[#8982cf] font-medium text-xs sm:text-sm mb-4 sm:mb-6"
          >
            <Package className="w-3 h-3 sm:w-4 sm:h-4" />
            Why Choose Kitions
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight"
          >
            Everything You Need to
            <br />
            <span className="bg-gradient-to-r from-[#8982cf] to-[#ABD4AB] bg-clip-text text-transparent">
              Grow Your Business
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0"
          >
            Join thousands of retailers and suppliers who trust Kitions to streamline their food distribution business
          </motion.p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-14 md:mb-16">
          {benefits.map((benefit, index) => {
            // Alternate between purple and sage green for some variety
            const isAccentCard = index === 1 || index === 4; // "Instant Order Processing" and "Secure Payment Processing"
            const iconColor = isAccentCard ? '#ABD4AB' : '#8982cf';
            const bgColor = isAccentCard ? 'from-[#ABD4AB]/10 to-[#9BC49B]/10' : 'from-[#8982cf]/10 to-[#7873b3]/10';
            const hoverBgColor = isAccentCard ? 'group-hover:from-[#ABD4AB]/20 group-hover:to-[#9BC49B]/20' : 'group-hover:from-[#8982cf]/20 group-hover:to-[#7873b3]/20';
            const hoverTextColor = isAccentCard ? 'group-hover:text-[#ABD4AB]' : 'group-hover:text-[#8982cf]';
            const hoverBorderColor = isAccentCard ? 'hover:border-[#ABD4AB]/30' : 'hover:border-[#8982cf]/30';
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className={`group p-6 sm:p-8 bg-white rounded-2xl border border-gray-100 ${hoverBorderColor} hover:shadow-xl transition-all duration-300 cursor-pointer`}
              >
                <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                  <div className={`p-2.5 sm:p-3 bg-gradient-to-br ${bgColor} ${hoverBorderColor} rounded-xl ${hoverBgColor} transition-all duration-300 flex-shrink-0`}>
                    <benefit.icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: iconColor }} />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className={`text-lg sm:text-xl font-bold text-gray-900 mb-2 ${hoverTextColor} transition-colors duration-300`}>
                      {benefit.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center bg-gradient-to-br from-[#f5f3ff] to-white rounded-2xl sm:rounded-3xl p-8 sm:p-10 md:p-12 border border-[#8982cf]/10"
        >
          <div className="max-w-4xl mx-auto">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              Join the Marketplace Revolution
            </h3>
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto px-4 sm:px-0">
              Over 10,000+ retailers and 1,000+ suppliers trust Kitions for their daily operations
            </p>
            
            {/* Trust Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-[#8982cf] mb-1 sm:mb-2">10,000+</div>
                <div className="text-sm sm:text-base text-gray-600">Active Retailers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-[#ABD4AB] mb-1 sm:mb-2">1,000+</div>
                <div className="text-sm sm:text-base text-gray-600">Verified Suppliers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-[#8982cf] mb-1 sm:mb-2">$50M+</div>
                <div className="text-sm sm:text-base text-gray-600">Monthly Transactions</div>
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <a
                href="/signup"
                className="group bg-gradient-to-r from-[#ABD4AB] to-[#9BC49B] hover:from-[#95C295] hover:to-[#ABD4AB] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl text-sm sm:text-base"
              >
                Get Started Today
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  →
                </motion.div>
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 
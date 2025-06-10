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
    <section className="w-full py-20 px-4 sm:px-8 md:px-12 lg:px-20 bg-white relative">
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
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#f5f3ff] border border-[#8982cf]/20 rounded-full text-[#8982cf] font-medium text-sm mb-6"
          >
            <Package className="w-4 h-4" />
            Why Choose Kitions
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
          >
            Everything You Need to
            <br />
            <span className="bg-gradient-to-r from-[#8982cf] to-[#7873b3] bg-clip-text text-transparent">
              Grow Your Business
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Join thousands of retailers and suppliers who trust Kitions to streamline their food distribution business
          </motion.p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group p-8 bg-white rounded-2xl border border-gray-100 hover:border-[#8982cf]/30 hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-[#8982cf]/10 to-[#7873b3]/10 rounded-xl group-hover:from-[#8982cf]/20 group-hover:to-[#7873b3]/20 transition-all duration-300">
                  <benefit.icon className="w-6 h-6 text-[#8982cf]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#8982cf] transition-colors duration-300">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center bg-gradient-to-br from-[#f5f3ff] to-white rounded-3xl p-12 border border-[#8982cf]/10"
        >
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Join the Marketplace Revolution
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Over 10,000+ retailers and 1,000+ suppliers trust Kitions for their daily operations
            </p>
            
            {/* Trust Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#8982cf] mb-2">10,000+</div>
                <div className="text-gray-600">Active Retailers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#8982cf] mb-2">1,000+</div>
                <div className="text-gray-600">Verified Suppliers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#8982cf] mb-2">$50M+</div>
                <div className="text-gray-600">Monthly Transactions</div>
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <a
                href="/signup"
                className="group bg-[#8982cf] hover:bg-[#7873b3] text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
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
'use client';
import { motion } from 'framer-motion';
import { Target, Smartphone, DollarSign, Zap, BarChart3, Shield } from 'lucide-react';

export default function DistributorsValueProp() {
  const benefits = [
    {
      icon: Target,
      title: "Reach More Retailers",
      description: "Access thousands of verified retail partners across your region and beyond"
    },
    {
      icon: Smartphone, 
      title: "Digital Order Management",
      description: "Replace phone calls and emails with streamlined digital ordering system"
    },
    {
      icon: DollarSign,
      title: "Increase Revenue", 
      description: "Expand your customer base and boost order frequency with better reach"
    },
    {
      icon: Zap,
      title: "Real-time Inventory",
      description: "Sync your inventory and pricing automatically across all channels"
    },
    {
      icon: BarChart3,
      title: "Business Analytics",
      description: "Track performance, sales trends, and customer insights with detailed reports"
    },
    {
      icon: Shield,
      title: "Trusted Network",
      description: "Work only with verified, quality-focused retailers in our curated marketplace"
    }
  ];

  return (
    <section className="w-full py-20 px-4 sm:px-8 md:px-12 lg:px-20 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
          >
            Why Choose{' '}
            <span className="bg-gradient-to-r from-[#8982cf] to-[#ABD4AB] bg-clip-text text-transparent">
              Kitions
            </span>{' '}
            for Your Business?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Join thousands of successful distributors who&apos;ve transformed their business operations and expanded their reach through our comprehensive B2B platform.
          </motion.p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            // Alternate between purple and green for visual rhythm
            const isAccentCard = index === 1 || index === 3 || index === 5; // Digital Order Management, Real-time Inventory, Trusted Network
            const iconBgColor = isAccentCard ? 'from-[#ABD4AB] to-[#9BC49B]' : 'from-[#8982cf] to-[#7873b3]';
            const hoverTextColor = isAccentCard ? 'group-hover:text-[#ABD4AB]' : 'group-hover:text-[#8982cf]';
            const hoverBorderColor = isAccentCard ? 'hover:border-[#ABD4AB]/30' : 'hover:border-[#8982cf]/30';
            const hoverBarColor = isAccentCard ? 'from-[#ABD4AB] to-[#9BC49B]' : 'from-[#8982cf] to-[#7873b3]';
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="group"
              >
                <div className={`bg-white rounded-2xl p-8 h-full shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 ${hoverBorderColor}`}>
                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                    className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${iconBgColor} rounded-2xl mb-6 shadow-lg`}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </motion.div>

                  {/* Content */}
                  <div className="space-y-4">
                    <h3 className={`text-xl font-bold text-gray-900 ${hoverTextColor} transition-colors duration-200`}>
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>

                  {/* Hover indicator */}
                  <motion.div
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                    className={`h-1 bg-gradient-to-r ${hoverBarColor} rounded-full mt-6`}
                  />
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
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-[#8982cf]/5 to-[#ABD4AB]/5 rounded-3xl p-8 md:p-12 border border-[#8982cf]/10 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#ABD4AB]/10 to-[#9BC49B]/10 rounded-full blur-3xl -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-[#8982cf]/10 to-[#7873b3]/10 rounded-full blur-3xl translate-y-32 -translate-x-32"></div>
            
            <div className="relative z-10">
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-2xl md:text-3xl font-bold text-gray-900 mb-4"
              >
                Ready to Transform Your Distribution Business?
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto"
              >
                Join the growing network of successful distributors who trust Kitions to power their business growth.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <button className="group bg-gradient-to-r from-[#8982cf] to-[#7873b3] hover:from-[#7873b3] hover:to-[#8982cf] text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105">
                  Get Started Today
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.div>
                </button>
                <button className="px-8 py-4 rounded-lg font-semibold border-2 border-[#ABD4AB] text-[#ABD4AB] hover:bg-[#ABD4AB] hover:text-white transition-all duration-300 underline-none hover:underline-none">
                  Schedule a Demo
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-500"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#ABD4AB] rounded-full animate-pulse"></div>
            <span>2,400+ Active Distributors</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-gray-300"></div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#8982cf] rounded-full animate-pulse"></div>
            <span>10,000+ Partner Retailers</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-gray-300"></div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#ABD4AB] rounded-full animate-pulse"></div>
            <span>$50M+ in Transactions</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 
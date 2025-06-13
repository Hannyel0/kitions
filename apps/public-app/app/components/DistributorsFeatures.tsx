'use client';
import { motion } from 'framer-motion';
import { 
  Package, 
  DollarSign, 
  ClipboardList, 
  Users, 
  RefreshCw, 
  BarChart3,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

export default function DistributorsFeatures() {
  const features = [
    {
      icon: Package,
      title: "Product Catalog Management",
      description: "Easy product uploads with bulk import",
      details: "Streamline your product management with intuitive upload tools and CSV bulk import capabilities."
    },
    {
      icon: DollarSign,
      title: "Dynamic Pricing",
      description: "Set tier-based pricing, promotions, and volume discounts",
      details: "Flexible pricing strategies that adapt to different customer segments and order volumes."
    },
    {
      icon: ClipboardList,
      title: "Order Management Dashboard",
      description: "Track all orders in one central location",
      details: "Comprehensive order tracking with real-time status updates and delivery management."
    },
    {
      icon: Users,
      title: "Customer Relationship Tools",
      description: "Manage retailer accounts and communications",
      details: "Build stronger relationships with integrated CRM tools and communication features."
    },
    {
      icon: RefreshCw,
      title: "Inventory Sync",
      description: "Real-time inventory updates across the platform",
      details: "Automatic inventory synchronization prevents overselling and maintains accuracy."
    },
    {
      icon: BarChart3,
      title: "Analytics & Reporting",
      description: "Sales reports, performance metrics, customer insights",
      details: "Data-driven insights to optimize your distribution strategy and grow your business."
    }
  ];

  return (
    <section className="w-full py-20 px-4 sm:px-8 md:px-12 lg:px-20 bg-white">
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
            <span className="bg-gradient-to-r from-[#8982cf] to-[#ABD4AB] bg-clip-text text-transparent">
              Features
            </span>{' '}
            for Distributors
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Powerful tools designed specifically for food distributors to streamline operations, increase efficiency, and drive growth.
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            // Alternate between purple and green for visual rhythm
            const isAccentCard = index === 1 || index === 3 || index === 5; // Dynamic Pricing, Customer Relationship Tools, Analytics
            const iconBgColor = isAccentCard ? 'from-[#ABD4AB]/10 to-[#9BC49B]/10' : 'from-[#8982cf]/10 to-[#7873b3]/10';
            const iconBorderColor = isAccentCard ? 'border-[#ABD4AB]/20' : 'border-[#8982cf]/20';
            const iconColor = isAccentCard ? 'text-[#ABD4AB]' : 'text-[#8982cf]';
            const hoverBorderColor = isAccentCard ? 'hover:border-[#ABD4AB]/30' : 'hover:border-[#8982cf]/30';
            const hoverTextColor = isAccentCard ? 'group-hover:text-[#ABD4AB]' : 'group-hover:text-[#8982cf]';
            const descriptionColor = isAccentCard ? 'text-[#ABD4AB]' : 'text-[#8982cf]';
            const hoverBarColor = isAccentCard ? 'from-[#ABD4AB] to-[#9BC49B]' : 'from-[#8982cf] to-[#7873b3]';
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className={`relative bg-white rounded-2xl p-8 h-full border-2 border-gray-100 ${hoverBorderColor} transition-all duration-300 hover:shadow-lg`}>
                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    transition={{ duration: 0.2 }}
                    className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${iconBgColor} rounded-xl mb-6 border ${iconBorderColor}`}
                  >
                    <IconComponent className={`w-7 h-7 ${iconColor}`} />
                  </motion.div>

                  {/* Content */}
                  <div className="space-y-4">
                    <h3 className={`text-xl font-bold text-gray-900 ${hoverTextColor} transition-colors duration-200`}>
                      {feature.title}
                    </h3>
                    <p className={`${descriptionColor} font-medium text-sm`}>
                      {feature.description}
                    </p>
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {feature.details}
                    </p>
                  </div>

                  {/* Check mark indicator */}
                  <div className="absolute top-4 right-4">
                    <CheckCircle className={`w-5 h-5 ${isAccentCard ? 'text-[#ABD4AB]' : 'text-[#8982cf]'} opacity-60`} />
                  </div>

                  {/* Hover indicator */}
                  <motion.div
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                    className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${hoverBarColor} rounded-b-2xl`}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Feature Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-gradient-to-r from-[#8982cf]/5 to-[#ABD4AB]/5 rounded-3xl p-8 md:p-12 border border-[#8982cf]/10 relative overflow-hidden"
        >
          {/* Background decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#ABD4AB]/10 to-[#9BC49B]/10 rounded-full blur-3xl -translate-y-48 translate-x-48"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-[#8982cf]/10 to-[#7873b3]/10 rounded-full blur-3xl translate-y-48 -translate-x-48"></div>
          
          <div className="relative z-10 text-center">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-2xl md:text-3xl font-bold text-gray-900 mb-4"
            >
              Everything You Need to Scale Your Distribution Business
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto"
            >
              From product management to advanced analytics, Kitions provides all the tools you need to run a modern, efficient distribution operation.
            </motion.p>
            
            {/* Feature highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8"
            >
              {[
                { text: "Bulk Import", color: "#8982cf" },
                { text: "Real-time Sync", color: "#ABD4AB" }, 
                { text: "Advanced Reports", color: "#8982cf" },
                { text: "24/7 Support", color: "#ABD4AB" }
              ].map((highlight, index) => (
                <div key={index} className="flex items-center gap-2 justify-center">
                  <CheckCircle className="w-5 h-5" style={{ color: highlight.color }} />
                  <span className="text-gray-700 font-medium">{highlight.text}</span>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 1.1 }}
            >
              <button className="group bg-gradient-to-r from-[#8982cf] to-[#ABD4AB] hover:from-[#ABD4AB] hover:to-[#8982cf] text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 mx-auto">
                Explore All Features
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 
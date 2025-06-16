'use client';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, TrendingUp, Users, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function DistributorsCTA() {
  return (
    <section className="w-full py-12 px-4 sm:px-8 md:px-12 lg:px-20 bg-gradient-to-br from-[#8982cf] to-[#ABD4AB] relative overflow-hidden min-h-[85vh] flex items-center">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-[#ABD4AB]/5 to-[#8982cf]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto text-center w-full">
        {/* Main CTA Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full text-white font-medium text-sm mb-6 bg-white/10 border border-white/20 overflow-hidden group"
          >
            <Zap className="w-4 h-4 z-10 relative" />
            <span className="z-10 relative">Join 2,400+ Successful Distributors</span>

            {/* Subtle glowing border */}
            <span
              className="absolute inset-0 rounded-full bg-[conic-gradient(at_top_left,_rgba(255,255,255,0.3),_rgba(171,212,171,0.3),_rgba(255,255,255,0.3))] opacity-30 blur-sm animate-[spin_6s_linear_infinite]"
            ></span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight"
          >
            Ready to Transform Your
            <br />
            <span className="bg-gradient-to-r from-[#ABD4AB] to-[#9BC49B] bg-clip-text text-transparent">Distribution Business?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8"
          >
            Stop losing sales to manual processes. Join Kitions today and start connecting with thousands of retailers who are ready to buy from you.
          </motion.p>
        </motion.div>

        {/* Benefits Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {[
            {
              icon: TrendingUp,
              title: "Grow Revenue",
              description: "Average 40% increase in sales within 6 months",
              accent: true
            },
            {
              icon: Users,
              title: "Expand Reach",
              description: "Connect with 10,000+ verified retail partners",
              accent: false
            },
            {
              icon: Zap,
              title: "Save Time", 
              description: "Reduce order processing time by 75%",
              accent: true
            }
          ].map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
              className="text-center"
            >
              <div className={`inline-flex items-center justify-center w-14 h-14 bg-white/20 rounded-2xl mb-3 border border-white/30 ${benefit.accent ? 'shadow-lg shadow-[#ABD4AB]/20' : ''}`}>
                <benefit.icon className={`w-7 h-7 ${benefit.accent ? 'text-[#ABD4AB]' : 'text-white'}`} />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{benefit.title}</h3>
              <p className="text-white/80 text-sm">{benefit.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
        >
          <Link href="/signup">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group bg-gradient-to-r from-[#ABD4AB] to-[#9BC49B] hover:from-[#9BC49B] hover:to-[#ABD4AB] text-white px-8 py-3 rounded-lg font-bold text-lg transition-all duration-300 flex items-center gap-3 shadow-xl hover:shadow-2xl cursor-pointer"
            >
              Start Selling Today
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.div>
          </Link>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 rounded-lg font-bold text-lg border-2 border-[#ABD4AB] text-[#ABD4AB] hover:bg-[#ABD4AB] hover:text-white transition-all duration-300"
          >
            Book a Demo
          </motion.button>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="flex flex-col md:flex-row items-center justify-center gap-6 text-white/80 mb-6"
        >
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[#ABD4AB]" />
            <span className="text-sm">Free Setup & Onboarding</span>
          </div>
          <div className="hidden md:block w-px h-4 bg-white/30"></div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[#ABD4AB]" />
            <span className="text-sm">No Long-term Contracts</span>
          </div>
          <div className="hidden md:block w-px h-4 bg-white/30"></div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[#ABD4AB]" />
            <span className="text-sm">24/7 Support Included</span>
          </div>
        </motion.div>

        {/* Urgency Element */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 1.6 }}
          className="p-4 bg-white/10 rounded-2xl border border-[#ABD4AB]/30 backdrop-blur-sm max-w-2xl mx-auto shadow-lg shadow-[#ABD4AB]/10"
        >
          <p className="text-white font-semibold text-base mb-1">
            🔥 Limited Time: Free Premium Setup
          </p>
          <p className="text-white/90 text-sm">
            Join this month and get free premium onboarding, product catalog setup, and dedicated account management worth $2,500.
          </p>
        </motion.div>
      </div>

      {/* Animated Background Elements */}
      <motion.div
        animate={{ 
          rotate: [0, 360],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        className="absolute top-10 right-10 w-32 h-32 border border-[#ABD4AB]/30 rounded-full"
      />
      
      <motion.div
        animate={{ 
          rotate: [360, 0],
          scale: [1, 0.9, 1]
        }}
        transition={{ 
          duration: 15, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        className="absolute bottom-10 left-10 w-24 h-24 border border-white/20 rounded-full"
      />
    </section>
  );
} 
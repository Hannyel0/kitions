'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft as ArrowLeftIcon,
  ShoppingCart,
  Users,
  Package,
  Calculator
} from 'lucide-react';

// Skeleton shimmer animation component
const SkeletonShimmer = ({ className }: { className: string }) => (
  <div className={`${className} bg-gradient-to-r from-gray-200/60 via-gray-300/60 to-gray-200/60 animate-pulse`}>
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
  </div>
);

// Header skeleton component
const HeaderSkeleton = () => (
  <div className="relative overflow-hidden bg-white/40 backdrop-blur-md border border-white/20 px-4 py-6 mx-4 mt-4 rounded-2xl shadow-lg">
    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5"></div>
    
    {/* Subtle decorative elements */}
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
      <div className="absolute -top-2 -left-2 w-12 h-12 bg-blue-500/5 rounded-full blur-xl"></div>
      <div className="absolute top-4 right-4 w-16 h-16 bg-indigo-500/5 rounded-full blur-2xl"></div>
      <div className="absolute bottom-2 left-1/4 w-8 h-8 bg-blue-500/5 rounded-full blur-lg"></div>
    </div>
    
    <div className="relative z-10 max-w-6xl mx-auto">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-white/60 backdrop-blur-sm rounded-xl border border-white/30">
          <ArrowLeftIcon size={18} className="text-gray-400" />
        </div>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/60 backdrop-blur-sm rounded-xl border border-white/30">
            <ShoppingCart className="h-5 w-5 text-gray-400" />
          </div>
          <div>
            <SkeletonShimmer className="relative h-8 w-48 rounded-lg mb-1" />
            <SkeletonShimmer className="relative h-4 w-64 rounded" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Retailer section skeleton
const RetailerSectionSkeleton = () => (
  <motion.div 
    className="bg-white/60 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 overflow-hidden"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 }}
  >
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/60 backdrop-blur-sm rounded-xl border border-white/30">
            <Users className="h-5 w-5 text-gray-400" />
          </div>
          <div>
            <SkeletonShimmer className="relative h-6 w-40 rounded mb-1" />
            <SkeletonShimmer className="relative h-4 w-56 rounded" />
          </div>
        </div>
        <SkeletonShimmer className="relative h-9 w-32 rounded-xl" />
      </div>
      
      {/* Dropdown skeleton */}
      <div className="space-y-4">
        <SkeletonShimmer className="relative h-12 w-full rounded-xl" />
        
        {/* Selected retailer info skeleton */}
        <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 border border-white/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <SkeletonShimmer className="relative w-6 h-6 rounded-lg" />
                <div>
                  <SkeletonShimmer className="relative h-3 w-20 rounded mb-1" />
                  <SkeletonShimmer className="relative h-4 w-32 rounded" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <SkeletonShimmer className="relative w-6 h-6 rounded-lg" />
                <div>
                  <SkeletonShimmer className="relative h-3 w-16 rounded mb-1" />
                  <SkeletonShimmer className="relative h-4 w-40 rounded" />
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <SkeletonShimmer className="relative w-6 h-6 rounded-lg" />
                <div>
                  <SkeletonShimmer className="relative h-3 w-12 rounded mb-1" />
                  <SkeletonShimmer className="relative h-4 w-28 rounded" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <SkeletonShimmer className="relative w-6 h-6 rounded-lg" />
                <div>
                  <SkeletonShimmer className="relative h-3 w-16 rounded mb-1" />
                  <SkeletonShimmer className="relative h-4 w-48 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

// Products section skeleton
const ProductsSectionSkeleton = () => (
  <motion.div 
    className="bg-white/60 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 overflow-hidden"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
  >
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/60 backdrop-blur-sm rounded-xl border border-white/30">
            <Package className="h-5 w-5 text-gray-400" />
          </div>
          <div>
            <SkeletonShimmer className="relative h-6 w-32 rounded mb-1" />
            <SkeletonShimmer className="relative h-4 w-48 rounded" />
          </div>
        </div>
        <SkeletonShimmer className="relative h-9 w-36 rounded-xl" />
      </div>
      
      {/* Product cards skeleton */}
      <div className="space-y-3">
        {[1, 2, 3].map((index) => (
          <motion.div
            key={index}
            className="bg-white/40 backdrop-blur-sm rounded-xl p-4 border border-white/30"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
          >
            <div className="flex items-center space-x-4">
              <SkeletonShimmer className="relative w-16 h-16 rounded-xl flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <SkeletonShimmer className="relative h-5 w-48 rounded mb-2" />
                <SkeletonShimmer className="relative h-4 w-64 rounded mb-2" />
                <div className="flex items-center space-x-3">
                  <SkeletonShimmer className="relative h-6 w-20 rounded-lg" />
                  <SkeletonShimmer className="relative h-4 w-24 rounded" />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <SkeletonShimmer className="relative h-3 w-12 rounded mb-1" />
                  <SkeletonShimmer className="relative h-8 w-12 rounded-lg" />
                </div>
                <div className="text-center">
                  <SkeletonShimmer className="relative h-3 w-8 rounded mb-1" />
                  <SkeletonShimmer className="relative h-8 w-16 rounded-lg" />
                </div>
                <SkeletonShimmer className="relative w-8 h-8 rounded-lg" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </motion.div>
);

// Order summary skeleton
const OrderSummarySkeleton = () => (
  <motion.div 
    className="bg-white/60 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 overflow-hidden"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 }}
  >
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/60 backdrop-blur-sm rounded-xl border border-white/30">
            <Calculator className="h-5 w-5 text-gray-400" />
          </div>
          <div>
            <SkeletonShimmer className="relative h-6 w-32 rounded mb-1" />
            <SkeletonShimmer className="relative h-4 w-48 rounded" />
          </div>
        </div>
        
        {/* Discount input skeleton */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <SkeletonShimmer className="relative w-6 h-6 rounded-lg" />
            <SkeletonShimmer className="relative h-4 w-16 rounded" />
          </div>
          <SkeletonShimmer className="relative h-9 w-20 rounded-xl" />
        </div>
      </div>
      
      <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 border border-white/30">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <SkeletonShimmer className="relative h-5 w-16 rounded" />
            <SkeletonShimmer className="relative h-6 w-20 rounded" />
          </div>
          <div className="flex items-center justify-between">
            <SkeletonShimmer className="relative h-5 w-24 rounded" />
            <SkeletonShimmer className="relative h-6 w-16 rounded" />
          </div>
          <div className="h-px bg-gray-200/50 my-3"></div>
          <div className="flex items-center justify-between">
            <SkeletonShimmer className="relative h-6 w-28 rounded" />
            <div className="flex items-center space-x-1">
              <SkeletonShimmer className="relative h-8 w-20 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

// Action buttons skeleton
const ActionButtonsSkeleton = () => (
  <motion.div 
    className="flex justify-end space-x-3"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4 }}
  >
    <SkeletonShimmer className="relative h-10 w-20 rounded-xl" />
    <SkeletonShimmer className="relative h-10 w-28 rounded-xl" />
  </motion.div>
);

// Main skeleton component
export function CreateOrderSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      <HeaderSkeleton />
      
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="space-y-6">
          <RetailerSectionSkeleton />
          <ProductsSectionSkeleton />
          <OrderSummarySkeleton />
          <ActionButtonsSkeleton />
        </div>
      </div>
    </div>
  );
} 
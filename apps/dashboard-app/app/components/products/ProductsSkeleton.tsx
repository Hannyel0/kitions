import React from 'react'

interface ProductsSkeletonProps {
  viewType?: 'grid' | 'list'
}

// Header skeleton component
const HeaderSkeleton = () => (
  <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 px-4 py-6 mx-4 mt-4 rounded-3xl">
    <div className="absolute inset-0 bg-black/10"></div>
    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/90 to-purple-600/90"></div>
    
    {/* Decorative elements */}
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
      <div className="absolute -top-2 -left-2 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute top-10 right-10 w-20 h-20 bg-white/5 rounded-full blur-2xl"></div>
      <div className="absolute bottom-5 left-1/3 w-12 h-12 bg-white/10 rounded-full blur-xl"></div>
    </div>
    
    <div className="relative z-10 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
              <div className="h-5 w-5 bg-white/30 rounded animate-pulse"></div>
            </div>
            <div>
              <div className="h-7 w-48 bg-white/20 rounded-lg mb-2 animate-pulse"></div>
              <div className="h-4 w-64 bg-white/15 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="h-9 w-32 bg-white/20 backdrop-blur-sm rounded-lg animate-pulse"></div>
          <div className="h-9 w-36 bg-emerald-500/80 rounded-lg animate-pulse"></div>
        </div>
      </div>
      
      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {[...Array(4)].map((_, index) => (
          <div 
            key={index}
            className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-3 w-20 bg-white/20 rounded animate-pulse"></div>
                <div className="h-6 w-12 bg-white/30 rounded animate-pulse"></div>
              </div>
              <div className="p-2 bg-white/20 rounded-lg">
                <div className="h-4 w-4 bg-white/30 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)

// Search and filter skeleton
const SearchFilterSkeleton = () => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden">
    <div className="p-5">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Search and Filters Skeleton */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          {/* Search Skeleton */}
          <div className="relative">
            <div className="h-11 w-64 bg-gray-200 rounded-xl animate-pulse"></div>
          </div>
          
          {/* Filter Skeleton */}
          <div className="relative">
            <div className="h-11 w-32 bg-gray-200 rounded-xl animate-pulse"></div>
          </div>
        </div>
        
        {/* View Toggle and Stats Skeleton */}
        <div className="flex items-center justify-between lg:justify-end space-x-4">
          <div className="h-7 w-24 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="h-9 w-20 bg-gray-200 rounded-xl animate-pulse"></div>
        </div>
      </div>
    </div>
  </div>
)

// Product card skeleton for grid view
const ProductCardSkeleton = ({ index }: { index: number }) => (
  <div className="group relative bg-white/80 backdrop-blur-sm border border-white/50 rounded-3xl overflow-hidden shadow-lg">
    {/* Image Skeleton */}
    <div className="relative h-56 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
      <div className="w-full h-full bg-gray-300 animate-pulse"></div>
      
      {/* Badges Skeleton */}
      <div className="absolute top-4 left-4">
        <div className="h-7 w-20 bg-white/80 rounded-full animate-pulse"></div>
      </div>
      <div className="absolute top-4 right-4">
        <div className="h-7 w-16 bg-white/80 rounded-full animate-pulse"></div>
      </div>
    </div>
    
    {/* Content Skeleton */}
    <div className="p-6">
      {/* Title and Description */}
      <div className="mb-4">
        <div className="h-6 w-3/4 bg-gray-300 rounded-lg mb-2 animate-pulse"></div>
        <div className="space-y-2">
          <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
      
      {/* Price Section */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-baseline space-x-2">
          <div className="h-8 w-20 bg-gray-300 rounded animate-pulse"></div>
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="flex items-center space-x-1">
          <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
      
      {/* SKU */}
      <div className="h-6 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
    </div>
  </div>
)

// Product list item skeleton for list view
const ProductListItemSkeleton = ({ index }: { index: number }) => (
  <div className="flex items-center p-4 border-b border-gray-100 last:border-b-0">
    {/* Image Skeleton */}
    <div className="w-16 h-16 bg-gray-300 rounded-xl animate-pulse mr-4"></div>
    
    {/* Content */}
    <div className="flex-1 space-y-2">
      <div className="flex items-center justify-between">
        <div className="h-5 w-48 bg-gray-300 rounded animate-pulse"></div>
        <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
      </div>
      <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
      <div className="flex items-center space-x-4">
        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
    
    {/* Action Button */}
    <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse ml-4"></div>
  </div>
)

// Main skeleton component
export function ProductsSkeleton({ viewType = 'grid' }: ProductsSkeletonProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      {/* Header Skeleton */}
      <HeaderSkeleton />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Search and Filter Skeleton */}
          <SearchFilterSkeleton />
          
          {/* Products Display Skeleton */}
          <div>
            {viewType === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, index) => (
                  <ProductCardSkeleton key={index} index={index} />
                ))}
              </div>
            ) : (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden">
                <div className="divide-y divide-gray-100">
                  {[...Array(6)].map((_, index) => (
                    <ProductListItemSkeleton key={index} index={index} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 
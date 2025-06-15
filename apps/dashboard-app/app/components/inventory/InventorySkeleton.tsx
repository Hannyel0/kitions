import React from 'react'

// Header Skeleton Component
const HeaderSkeleton = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 px-4 py-6 mx-4 mt-4 rounded-3xl">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/90 to-teal-600/90"></div>
      
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
                <div className="h-7 w-48 bg-white/30 rounded-lg animate-pulse mb-2"></div>
                <div className="h-4 w-64 bg-white/20 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="h-9 w-32 bg-white/20 backdrop-blur-sm rounded-lg animate-pulse"></div>
            <div className="h-9 w-28 bg-white rounded-lg animate-pulse"></div>
          </div>
        </div>
        
        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-3 w-20 bg-white/30 rounded animate-pulse mb-2"></div>
                  <div className="h-6 w-12 bg-white/40 rounded animate-pulse"></div>
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
}

// Search and Filter Skeleton Component
const SearchFilterSkeleton = () => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden">
      <div className="p-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            {/* Search Skeleton */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl blur opacity-20"></div>
              <div className="relative">
                <div className="w-64 h-10 bg-gray-200 rounded-xl animate-pulse"></div>
              </div>
            </div>
            
            {/* Category Filter Skeleton */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl blur opacity-20"></div>
              <div className="relative">
                <div className="w-32 h-10 bg-gray-200 rounded-xl animate-pulse"></div>
              </div>
            </div>
          </div>
          
          {/* Actions Skeleton */}
          <div className="flex items-center space-x-3">
            <div className="h-7 w-24 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="h-8 w-8 bg-gray-200 rounded-xl animate-pulse"></div>
            <div className="h-8 w-8 bg-gray-200 rounded-xl animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Table Row Skeleton Component
const TableRowSkeleton = () => {
  return (
    <tr className="hover:bg-white/80 transition-colors duration-200">
      <td className="px-6 py-4">
        <div className="flex items-center">
          <div className="h-12 w-12 flex-shrink-0 rounded-xl bg-gray-200 animate-pulse"></div>
          <div className="ml-4 flex-1">
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-3 w-48 bg-gray-100 rounded animate-pulse mb-1"></div>
            <div className="h-3 w-20 bg-gray-100 rounded animate-pulse"></div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 w-12 bg-gray-200 rounded animate-pulse mb-1"></div>
        <div className="h-3 w-20 bg-gray-100 rounded animate-pulse"></div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <div className="h-3 w-3 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-3 w-8 bg-gray-100 rounded animate-pulse"></div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-8 w-8 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </td>
    </tr>
  )
}

// Table Skeleton Component
const TableSkeleton = () => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-200/50">
              <th className="px-6 py-4 text-left">
                <div className="h-3 w-16 bg-gray-300 rounded animate-pulse"></div>
              </th>
              <th className="px-6 py-4 text-left">
                <div className="h-3 w-16 bg-gray-300 rounded animate-pulse"></div>
              </th>
              <th className="px-6 py-4 text-left">
                <div className="h-3 w-12 bg-gray-300 rounded animate-pulse"></div>
              </th>
              <th className="px-6 py-4 text-left">
                <div className="h-3 w-12 bg-gray-300 rounded animate-pulse"></div>
              </th>
              <th className="px-6 py-4 text-left">
                <div className="h-3 w-14 bg-gray-300 rounded animate-pulse"></div>
              </th>
              <th className="px-6 py-4 text-left">
                <div className="h-3 w-16 bg-gray-300 rounded animate-pulse"></div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white/50 divide-y divide-gray-200/50">
            {[...Array(8)].map((_, index) => (
              <TableRowSkeleton key={index} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Main Inventory Skeleton Component
export const InventorySkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      {/* Header Skeleton */}
      <HeaderSkeleton />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Search and Filter Section Skeleton */}
          <SearchFilterSkeleton />

          {/* Table Skeleton */}
          <TableSkeleton />
        </div>
      </div>
    </div>
  )
}

export default InventorySkeleton 
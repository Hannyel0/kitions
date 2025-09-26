'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar,
  Download,

  ArrowLeft as ArrowLeftIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Package as PackageIcon,
  BarChart3,
  Activity,
  Eye,
  Search,
  RefreshCw,
  FileText,
  Zap,
  Target,
  Clock,
} from 'lucide-react'

interface InventoryChange {
  id: string
  productName: string
  date: string
  previousStock: number
  newStock: number
  change: number
  type: 'addition' | 'reduction'
  reason: 'Restock' | 'Manual Addition' | 'Manual Deduction' | 'Sold'
}

export function InventoryReport() {
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [selectedFilter, setSelectedFilter] = useState<string>('all')

  // Example data - in a real app, this would come from your database
  // For now, we'll use an empty array to show the no-data state
  const inventoryChanges: InventoryChange[] = []

  // Calculate summary metrics
  const totalStockChange = inventoryChanges.reduce(
    (acc, curr) => acc + curr.change,
    0,
  )

  const productChanges = inventoryChanges.reduce(
    (acc, curr) => {
      acc[curr.productName] = acc[curr.productName] || {
        restocked: 0,
        sold: 0,
      }
      if (curr.type === 'addition') {
        acc[curr.productName].restocked += curr.change
      } else {
        acc[curr.productName].sold += Math.abs(curr.change)
      }
      return acc
    },
    {} as Record<
      string,
      {
        restocked: number
        sold: number
      }
    >,
  )

  const mostRestocked = Object.entries(productChanges).length > 0 
    ? Object.entries(productChanges).reduce((a, b) => a[1].restocked > b[1].restocked ? a : b)
    : null

  const mostSold = Object.entries(productChanges).length > 0
    ? Object.entries(productChanges).reduce((a, b) => a[1].sold > b[1].sold ? a : b)
    : null

  // Filter data based on search and filter
  const filteredChanges = inventoryChanges.filter((change) => {
    const matchesSearch = change.productName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = selectedFilter === 'all' || 
      (selectedFilter === 'additions' && change.type === 'addition') ||
      (selectedFilter === 'reductions' && change.type === 'reduction')
    return matchesSearch && matchesFilter
  })

  const totalTransactions = inventoryChanges.length
  const averageChange = totalTransactions > 0 ? totalStockChange / totalTransactions : 0

  // Check if we have any data at all
  const hasData = inventoryChanges.length > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50/30 to-purple-50/20">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-white/40 backdrop-blur-md border border-white/20 px-6 py-8 mx-6 mt-6 rounded-3xl shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-[#8982cf]/3 to-purple-500/3"></div>
        
        {/* Subtle decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute -top-4 -left-4 w-20 h-20 bg-[#8982cf]/5 rounded-full blur-2xl"></div>
          <div className="absolute top-6 right-8 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-4 left-1/3 w-16 h-16 bg-[#8982cf]/5 rounded-full blur-xl"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Link href="/distributor/reports">
                <motion.button
                  className="p-3 bg-white/60 backdrop-blur-sm text-gray-700 rounded-2xl hover:bg-white/80 transition-all duration-300 border border-white/30 shadow-sm"
                  whileHover={{ scale: 1.05, x: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowLeftIcon size={20} />
                </motion.button>
              </Link>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-[#8982cf]/10 backdrop-blur-sm rounded-2xl border border-[#8982cf]/20">
                  <BarChart3 className="h-7 w-7 text-[#8982cf]" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Inventory Analytics</h1>
                  <p className="text-gray-600 text-sm mt-1">Track stock movements and inventory insights</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <motion.button
                className="flex items-center space-x-2 px-4 py-2.5 bg-white/60 backdrop-blur-sm text-gray-700 font-medium rounded-xl border border-white/30 hover:bg-white/80 transition-all duration-300 text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RefreshCw size={16} />
                <span>Refresh</span>
              </motion.button>
              <motion.button
                className="flex items-center space-x-2 px-4 py-2.5 bg-[#8982cf]/80 backdrop-blur-sm text-white font-medium rounded-xl shadow-lg hover:bg-[#8982cf] transition-all duration-300 text-sm"
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                disabled={!hasData}
              >
                <Download size={16} />
                <span>Export Report</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {hasData ? (
          <>
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <motion.div 
                className="bg-white/60 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-[#8982cf]/10 backdrop-blur-sm rounded-xl border border-[#8982cf]/20">
                      <Activity className="h-5 w-5 text-[#8982cf]" />
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${totalStockChange >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}
                    >
                      {totalStockChange >= 0 ? (
                        <TrendingUpIcon size={12} className="inline mr-1" />
                      ) : (
                        <TrendingDownIcon size={12} className="inline mr-1" />
                      )}
                      {totalStockChange >= 0 ? '+' : ''}{totalStockChange}
                    </span>
                  </div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">Total Stock Change</h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalStockChange >= 0 ? '+' : ''}{totalStockChange}
                    <span className="text-sm font-normal text-gray-500 ml-1">units</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-2">This month</p>
                </div>
              </motion.div>

              <motion.div 
                className="bg-white/60 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-emerald-100/80 backdrop-blur-sm rounded-xl border border-emerald-200/50">
                      <Target className="h-5 w-5 text-emerald-600" />
                    </div>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-medium">
                      <PackageIcon size={12} className="inline mr-1" />
                      +{mostRestocked ? mostRestocked[1].restocked : 0}
                    </span>
                  </div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">Top Restocked</h3>
                  <p className="text-lg font-bold text-gray-900 leading-tight">{mostRestocked ? mostRestocked[0] : 'No data'}</p>
                  <p className="text-xs text-gray-500 mt-2">Highest restock volume</p>
                </div>
              </motion.div>

              <motion.div 
                className="bg-white/60 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-red-100/80 backdrop-blur-sm rounded-xl border border-red-200/50">
                      <Zap className="h-5 w-5 text-red-600" />
                    </div>
                    <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-medium">
                      <PackageIcon size={12} className="inline mr-1" />
                      -{mostSold ? mostSold[1].sold : 0}
                    </span>
                  </div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">Top Selling</h3>
                  <p className="text-lg font-bold text-gray-900 leading-tight">{mostSold ? mostSold[0] : 'No data'}</p>
                  <p className="text-xs text-gray-500 mt-2">Highest sales volume</p>
                </div>
              </motion.div>

              <motion.div 
                className="bg-white/60 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-blue-100/80 backdrop-blur-sm rounded-xl border border-blue-200/50">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                      {totalTransactions}
                    </span>
                  </div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">Total Transactions</h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalTransactions}
                    <span className="text-sm font-normal text-gray-500 ml-1">changes</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-2">Avg: {averageChange.toFixed(1)} per change</p>
                </div>
              </motion.div>
            </div>

            {/* Inventory Changes Table */}
            <motion.div 
              className="bg-white/60 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {/* Table Header */}
              <div className="p-6 border-b border-white/30">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-[#8982cf]/10 backdrop-blur-sm rounded-xl border border-[#8982cf]/20">
                      <FileText className="h-5 w-5 text-[#8982cf]" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Inventory Changes</h2>
                      <p className="text-gray-600 text-sm">Detailed transaction history</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2.5 bg-white/60 backdrop-blur-sm border border-white/30 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8982cf]/30 focus:border-[#8982cf]/50 transition-all duration-300 text-sm w-full sm:w-64"
                      />
                    </div>

                    {/* Filter Dropdown */}
                    <select
                      value={selectedFilter}
                      onChange={(e) => setSelectedFilter(e.target.value)}
                      className="px-4 py-2.5 bg-white/60 backdrop-blur-sm border border-white/30 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8982cf]/30 focus:border-[#8982cf]/50 transition-all duration-300 text-sm"
                    >
                      <option value="all">All Changes</option>
                      <option value="additions">Stock Additions</option>
                      <option value="reductions">Stock Reductions</option>
                    </select>

                    {/* Date Range */}
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-3 py-2.5 rounded-xl border border-white/30">
                        <Calendar size={16} className="text-gray-500" />
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="text-sm bg-transparent outline-none text-gray-700"
                        />
                      </div>
                      <span className="text-gray-500 text-sm">to</span>
                      <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-3 py-2.5 rounded-xl border border-white/30">
                        <Calendar size={16} className="text-gray-500" />
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="text-sm bg-transparent outline-none text-gray-700"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Table Content */}
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-white/40 backdrop-blur-sm border-b border-white/30">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Previous Stock
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        New Stock
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Change
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Reason
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white/20 backdrop-blur-sm divide-y divide-white/20">
                    <AnimatePresence>
                      {filteredChanges.map((change, index) => (
                        <motion.tr 
                          key={change.id} 
                          className="hover:bg-white/40 transition-all duration-300"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {new Date(change.date).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(change.date).toLocaleTimeString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-white/60 backdrop-blur-sm rounded-lg border border-white/30">
                                <PackageIcon size={16} className="text-gray-600" />
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-gray-900">{change.productName}</div>
                                <div className="text-xs text-gray-500">SKU: PRD-{change.id.padStart(3, '0')}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium text-gray-700">
                              {change.previousStock}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium text-gray-700">
                              {change.newStock}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                change.type === 'addition' 
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                  : 'bg-red-50 text-red-700 border border-red-200'
                              }`}
                            >
                              {change.type === 'addition' ? (
                                <TrendingUpIcon size={12} className="mr-1" />
                              ) : (
                                <TrendingDownIcon size={12} className="mr-1" />
                              )}
                              {change.type === 'addition' ? '+' : ''}{change.change}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${
                              change.reason === 'Restock' ? 'bg-blue-50 text-blue-700' :
                              change.reason === 'Sold' ? 'bg-purple-50 text-purple-700' :
                              'bg-gray-50 text-gray-700'
                            }`}>
                              {change.reason}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
                
                {filteredChanges.length === 0 && (
                  <div className="text-center py-12">
                    <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <Eye className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No changes found</h3>
                    <p className="text-gray-500 text-sm">Try adjusting your search or filter criteria.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        ) : (
          /* No Data State */
          <motion.div 
            className="bg-white/60 backdrop-blur-md rounded-3xl shadow-lg border border-white/20 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-center py-20 px-8">
              {/* Animated Icon */}
              <motion.div 
                className="relative mx-auto w-32 h-32 mb-8"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#8982cf]/10 to-purple-500/10 rounded-full blur-2xl"></div>
                                 <div className="relative bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center w-full h-full border border-white/40 shadow-lg">
                   <BarChart3 className="h-16 w-16 text-[#8982cf]" />
                 </div>
              </motion.div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No Inventory Data Available</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                  Your inventory report will appear here once you start tracking stock changes. 
                  Add products and manage inventory to see detailed analytics.
                </p>
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <Link href="/distributor/products">
                    <motion.button
                      className="inline-flex items-center px-6 py-3 bg-[#8982cf]/80 backdrop-blur-sm text-white font-medium rounded-xl shadow-lg hover:bg-[#8982cf] transition-all duration-300 space-x-2"
                      whileHover={{ scale: 1.05, y: -1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <PackageIcon size={18} />
                      <span>Manage Products</span>
                    </motion.button>
                  </Link>
                  
                  <Link href="/distributor/orders/create">
                    <motion.button
                      className="inline-flex items-center px-6 py-3 bg-white/60 backdrop-blur-sm text-gray-700 font-medium rounded-xl border border-white/30 hover:bg-white/80 transition-all duration-300 space-x-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Activity size={18} />
                      <span>Create Order</span>
                    </motion.button>
                  </Link>
                </div>
              </motion.div>

              {/* Decorative Elements */}
              <div className="absolute top-8 left-8 w-16 h-16 bg-[#8982cf]/5 rounded-full blur-xl"></div>
              <div className="absolute bottom-8 right-8 w-20 h-20 bg-purple-500/5 rounded-full blur-2xl"></div>
              <div className="absolute top-1/2 left-4 w-12 h-12 bg-[#8982cf]/5 rounded-full blur-lg"></div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

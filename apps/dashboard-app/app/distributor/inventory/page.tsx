'use client'

import React, { useState, useEffect, useCallback } from 'react'
import {
  PlusIcon,
  SearchIcon,
  FilterIcon,
  EditIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  ScanLineIcon,
  BellIcon,
  XIcon,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Package2,
  MoreVertical,
  RefreshCw
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { DashboardLayout } from '@/app/components/layout'
import { AddProductModal } from '@/app/components/products/AddProductModal'
import { Product } from '@/app/components/products/types'
import { createBrowserClient } from '@supabase/ssr'
import Image from 'next/image'
import { BarcodeScanner } from '@/app/components/barcode/BarcodeScanner'
import { InventorySkeleton } from '@/app/components/inventory'

export default function Inventory() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [isLowStockModalOpen, setIsLowStockModalOpen] = useState(false)
  const [isScannerOpen, setIsScannerOpen] = useState(false)
  const [, setScannedBarcode] = useState<string | null>(null)
  const [, setFoundProductByBarcode] = useState<Product | null>(null)
  const [scannedUpcForNewProduct, setScannedUpcForNewProduct] = useState<string>('')
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  
  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true)
      
      const { data: productsData, error: productsError } = await supabase
        .from('distributor_products')
        .select(`
          *,
          product_categories(name)
        `)
      
      if (productsError) throw productsError
      
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('product_categories')
        .select('name')
      
      if (categoriesError) throw categoriesError
      
      type RawProductData = {
        id: string;
        name: string;
        description?: string;
        sku: string;
        upc?: string;
        category: string;
        category_id?: string;
        case_size: number;
        price?: number;
        price_cents?: number;
        image_url?: string;
        stock_quantity: number;
        product_categories?: { name: string };
      }

      const transformedProducts = productsData.map((product: RawProductData) => ({
        id: product.id,
        name: product.name,
        description: product.description || '',
        price: product.price || 0,
        image: product.image_url || '',
        image_url: product.image_url || '',
        case_size: product.case_size || 1,
        stock_quantity: product.stock_quantity || 0,
        category: product.product_categories?.name || 'Uncategorized',
        category_id: product.category_id || '',
        sku: product.sku || '',
        upc: product.upc || ''
      }))
      
      interface CategoryData {
        name: string
      }
      
      const categoryNames = categoriesData.map((category: CategoryData) => category.name)
      
      setProducts(transformedProducts)
      setCategories(['all', ...categoryNames])
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      console.error('Error fetching data:', error)
      setError(error.message || 'Failed to load products')
    } finally {
      setIsLoading(false)
    }
  }, [supabase])
  
  useEffect(() => {
    fetchProducts()
  }, [fetchProducts, refreshTrigger])
  
  const getStockStatus = (stock: number) => {
    if (stock === 0) {
      return {
        label: 'Out of Stock',
        color: 'bg-red-50 text-red-600 border-red-200',
        icon: <XIcon size={12} className="text-red-500" />,
        dotColor: 'bg-red-500'
      }
    }
    if (stock <= 100) {
      return {
        label: 'Low Stock',
        color: 'bg-amber-50 text-amber-600 border-amber-200',
        icon: <AlertTriangleIcon size={12} className="text-amber-500" />,
        dotColor: 'bg-amber-500'
      }
    }
    return {
      label: 'In Stock',
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      icon: <CheckCircleIcon size={12} className="text-emerald-500" />,
      dotColor: 'bg-emerald-500'
    }
  }
  
  const lowStockProducts = products.filter((product) => product.stock_quantity <= 100)
  const hasLowStock = lowStockProducts.length > 0
  
  // Calculate inventory stats
  const totalProducts = products.length
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock_quantity), 0)
  const lowStockCount = products.filter(p => p.stock_quantity <= 100).length
  const outOfStockCount = products.filter(p => p.stock_quantity === 0).length
  const inStockCount = products.filter(p => p.stock_quantity > 0).length

  // Filter products
  const filteredProducts = products
    .filter(product => 
      searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(product => 
      selectedCategory === 'all' || 
      product.category.toLowerCase() === selectedCategory.toLowerCase()
    )
  
  return (
    <DashboardLayout userType="distributor">
        {isLoading ? (
        <InventorySkeleton />
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
          {/* Modern Hero Header Section */}
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
                      <Package2 className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-white mb-1">Inventory Management</h1>
                      <p className="text-emerald-100 text-sm">Track and manage your product inventory</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <motion.button
                    onClick={() => setIsScannerOpen(true)}
                    className="group relative px-4 py-2 bg-white/20 backdrop-blur-sm text-white font-medium rounded-lg border border-white/30 hover:bg-white/30 transition-all duration-300 flex items-center space-x-2 text-sm"
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ScanLineIcon size={16} />
                    <span>Scan Barcode</span>
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </motion.button>
                  
                  <motion.button
                    onClick={() => setIsAddModalOpen(true)}
                    className="group relative px-4 py-2 bg-white text-emerald-600 font-medium rounded-lg transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl text-sm hover:bg-emerald-50"
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <PlusIcon size={16} />
                    <span>Add Product</span>
                  </motion.button>
                </div>
              </div>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
                <motion.div 
                  className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-emerald-100 text-xs font-medium">Total Products</p>
                      <p className="text-white text-xl font-bold">{totalProducts}</p>
                    </div>
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Package2 className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-emerald-100 text-xs font-medium">In Stock</p>
                      <p className="text-white text-xl font-bold">{inStockCount}</p>
                    </div>
                    <div className="p-2 bg-green-500/30 rounded-lg">
                      <TrendingUp className="h-4 w-4 text-green-200" />
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-emerald-100 text-xs font-medium">Low Stock</p>
                      <p className="text-white text-xl font-bold">{lowStockCount}</p>
                    </div>
                    <div className="p-2 bg-amber-500/30 rounded-lg">
                      <AlertTriangleIcon className="h-4 w-4 text-amber-200" />
          </div>
          </div>
                </motion.div>
                
                <motion.div 
                  className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
          <div className="flex items-center justify-between">
                    <div>
                      <p className="text-emerald-100 text-xs font-medium">Out of Stock</p>
                      <p className="text-white text-xl font-bold">{outOfStockCount}</p>
                    </div>
                    <div className="p-2 bg-red-500/30 rounded-lg">
                      <TrendingDown className="h-4 w-4 text-red-200" />
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-emerald-100 text-xs font-medium">Total Value</p>
                      <p className="text-white text-xl font-bold">${totalValue.toLocaleString()}</p>
                    </div>
                    <div className="p-2 bg-white/20 rounded-lg">
                      <BarChart3 className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 py-6">
            {error ? (
              <motion.div 
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl shadow-sm"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="p-1.5 bg-red-100 rounded-full">
                    <AlertTriangleIcon className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">Error Loading Inventory</h3>
                    <p className="text-xs">{error}</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-6">
                {/* Search and Filter Section */}
                <motion.div 
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="p-5">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                      {/* Search and Filters */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                        {/* Search */}
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search inventory..."
                              className="w-64 pl-10 pr-4 py-2.5 bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent transition-all duration-300 shadow-md text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <SearchIcon
                    size={16}
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-emerald-500 transition-colors duration-300"
                  />
                </div>
                        </div>
                        
                        {/* Category Filter */}
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                          <div className="relative flex items-center space-x-2 bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-xl px-4 py-2.5 shadow-md">
                            <FilterIcon size={14} className="text-gray-500 group-hover:text-teal-500 transition-colors duration-300" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                              className="bg-transparent text-gray-700 text-sm focus:outline-none cursor-pointer min-w-[100px]"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                          </div>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center space-x-3">
                        <div className="text-xs text-gray-600 bg-gray-100/80 px-3 py-1.5 rounded-full">
                          <span className="font-semibold text-emerald-600">{filteredProducts.length}</span> of {totalProducts} products
                        </div>
                        
                  {hasLowStock && (
                          <motion.button
                      onClick={() => setIsLowStockModalOpen(true)}
                            className="relative p-2 bg-amber-50 border border-amber-200 rounded-xl hover:bg-amber-100 transition-colors duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            title="Low stock alerts"
                          >
                            <BellIcon size={16} className="text-amber-600" />
                            <div className="absolute -top-1 -right-1 h-3 w-3 bg-amber-500 rounded-full animate-pulse"></div>
                          </motion.button>
                        )}
                        
                        <motion.button
                          onClick={() => setRefreshTrigger(prev => prev + 1)}
                          className="p-2 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors duration-300"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          title="Refresh inventory"
                        >
                          <RefreshCw size={16} className="text-gray-600" />
                        </motion.button>
                      </div>
                    </div>
                </div>
                </motion.div>

                {/* Inventory Content */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden">
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6">
                      <div className="relative mx-auto w-20 h-20 mb-6">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full blur-lg opacity-20"></div>
                        <div className="relative bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full flex items-center justify-center w-full h-full">
                          <Package2 className="h-10 w-10 text-emerald-500" />
                        </div>
              </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">No products in inventory</h3>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto text-sm text-center">
                Get started by adding your first product to your inventory. You can manually add products or scan their barcodes.
              </p>
              <div className="flex space-x-3">
                <motion.button
                  onClick={() => setIsAddModalOpen(true)}
                          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 space-x-2"
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                >
                          <PlusIcon size={16} />
                          <span>Add Your First Product</span>
                </motion.button>
                <motion.button
                  onClick={() => setIsScannerOpen(true)}
                          className="inline-flex items-center px-6 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 space-x-2 hover:bg-gray-50"
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                >
                          <ScanLineIcon size={16} />
                          <span>Scan Barcode</span>
                </motion.button>
              </div>
            </div>
          ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                          <tr className="bg-gray-50/80 border-b border-gray-200/50">
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Product
                  </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Category
                  </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Price
                  </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Stock
                  </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
                        <tbody className="bg-white/50 divide-y divide-gray-200/50">
                          {filteredProducts.map((product, index) => {
                  const stockStatus = getStockStatus(product.stock_quantity)
                  return (
                              <motion.tr 
                                key={product.id} 
                                className="hover:bg-white/80 transition-colors duration-200"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05, duration: 0.3 }}
                              >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                                    <div className="h-12 w-12 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                                      {product.image_url ? (
                              <Image
                                          src={product.image_url}
                                alt={product.name}
                                          width={48}
                                          height={48}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                                        <div className="h-full w-full flex items-center justify-center">
                                          <Package2 className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                                      <div className="text-sm font-semibold text-gray-900">
                              {product.name}
                            </div>
                                      <div className="text-xs text-gray-500 line-clamp-1">
                              {product.description}
                            </div>
                                      <div className="text-xs text-gray-400 font-mono mt-1">
                                        SKU: {product.sku}
                                      </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                                  <div className="text-sm font-semibold text-gray-900">
                                    ${product.price.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500">
                          per case of {product.case_size}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                                  <div className="flex items-center space-x-2">
                                    <Package2 size={14} className="text-gray-400" />
                                    <span className="text-sm font-medium text-gray-900">
                                      {product.stock_quantity}
                          </span>
                                    <span className="text-xs text-gray-500">units</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                                  <div className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full border text-xs font-medium ${stockStatus.color}`}>
                                    <div className={`w-2 h-2 rounded-full ${stockStatus.dotColor}`}></div>
                                    <span>{stockStatus.label}</span>
                                  </div>
                      </td>
                      <td className="px-6 py-4">
                                  <div className="flex items-center space-x-2">
                                    <motion.button 
                                      className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors duration-200"
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      title="Edit product"
                                    >
                          <EditIcon size={16} />
                                    </motion.button>
                                    <motion.button 
                                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      title="More actions"
                                    >
                                      <MoreVertical size={16} />
                                    </motion.button>
                                  </div>
                      </td>
                              </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          )}
                </div>
              </div>
            )}
          </div>
        </div>
        )}
      
      {/* Modals */}
        <AddProductModal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false)
            setScannedUpcForNewProduct('')
            setRefreshTrigger(prev => prev + 1)
          }}
          categories={categories.filter((c) => c !== 'all')}
          initialUpc={scannedUpcForNewProduct}
        />
        
        {/* Low Stock Modal */}
        <AnimatePresence>
          {isLowStockModalOpen && lowStockProducts.length > 0 && (
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/50 transition-opacity"
                onClick={() => setIsLowStockModalOpen(false)}
              />
              
              <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0 relative z-50">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ duration: 0.3, type: 'spring', bounce: 0.25 }}
                className="inline-block align-middle bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full relative"
                >
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center">
                    <AlertTriangleIcon className="h-5 w-5 text-white mr-2" />
                    <h3 className="text-lg font-semibold text-white">Low Stock Items</h3>
                    </div>
                    <button
                      type="button"
                    className="text-white/80 hover:text-white focus:outline-none"
                      onClick={() => setIsLowStockModalOpen(false)}
                    >
                      <XIcon className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
                  <p className="text-sm text-gray-600 mb-4">
                      The following items are running low on stock and may need to be reordered soon:
                    </p>
                    
                    <div className="space-y-3">
                      {lowStockProducts.map((product) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                        className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-start"
                        >
                          <div className="flex-shrink-0 mr-3">
                            {product.image_url ? (
                            <div className="h-16 w-16 rounded-xl overflow-hidden bg-white border border-gray-200">
                                <Image
                                  src={product.image_url}
                                  alt={product.name}
                                  width={64}
                                  height={64}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            ) : (
                            <div className="h-16 w-16 rounded-xl flex items-center justify-center bg-gray-100 border border-gray-200">
                              <Package2 className="h-8 w-8 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                            <h4 className="text-sm font-semibold text-gray-900">{product.name}</h4>
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                {product.stock_quantity} units
                              </span>
                            </div>
                          <p className="mt-1 text-xs text-gray-600">{product.description}</p>
                            <div className="mt-2 flex items-center justify-between">
                            <div className="text-xs text-gray-500 font-mono">
                                SKU: {product.sku || 'N/A'}
                            </div>
                            <motion.button 
                              className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-medium rounded-lg hover:bg-emerald-700 transition-colors duration-200"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Restock
                            </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 px-6 py-4 flex justify-end">
                  <motion.button
                      type="button"
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => setIsLowStockModalOpen(false)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    >
                      Close
                  </motion.button>
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* Barcode Scanner Modal */}
        <BarcodeScanner
          isOpen={isScannerOpen}
          onClose={() => setIsScannerOpen(false)}
          onBarcodeScanned={(barcode) => {
            console.log('Scanned barcode in parent:', barcode);
            setScannedBarcode(barcode);
            
            const foundProduct = products.find(
              (p) => 
                (p.upc && p.upc.replace(/\D/g, '') === barcode.replace(/\D/g, '')) || 
                p.sku === barcode
            );
            
            if (foundProduct) {
              setIsScannerOpen(false);
              setFoundProductByBarcode(foundProduct);
              setSearchTerm(foundProduct.name);
              
              const notification = document.createElement('div');
            notification.className = 'fixed bottom-4 right-4 bg-emerald-100 border-l-4 border-emerald-500 text-emerald-700 p-4 rounded-xl shadow-lg z-50';
              notification.innerHTML = `
                <div class="flex items-center">
                <div class="py-1"><svg class="h-6 w-6 text-emerald-500 mr-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg></div>
                  <div>
                    <p class="font-bold">Product Found!</p>
                    <p class="text-sm">${foundProduct.name} (${barcode})</p>
                  </div>
                </div>
              `;
              document.body.appendChild(notification);
              
              setTimeout(() => {
                document.body.removeChild(notification);
              }, 5000);
            } else {
              setIsScannerOpen(false);
              setScannedUpcForNewProduct(barcode);
              setIsAddModalOpen(true);
              
              const notification = document.createElement('div');
            notification.className = 'fixed bottom-4 right-4 bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-xl shadow-lg z-50';
              notification.innerHTML = `
                <div class="flex items-center">
                  <div class="py-1"><svg class="h-6 w-6 text-blue-500 mr-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg></div>
                  <div>
                    <p class="font-bold">Product Not Found</p>
                    <p class="text-sm">Adding new product with barcode: ${barcode}</p>
                  </div>
                </div>
              `;
              document.body.appendChild(notification);
              
              setTimeout(() => {
                document.body.removeChild(notification);
              }, 5000);
            }
          }}
        />
    </DashboardLayout>
  );
}
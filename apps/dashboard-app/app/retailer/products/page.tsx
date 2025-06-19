'use client'

import React, { useState, useEffect } from 'react'
import { DashboardLayout } from '@/app/components/layout'
import { SearchIcon, FilterIcon, LayoutGrid as LayoutGridIcon, List as ListIcon, ShoppingCart, Package, Plus, Sparkles, TrendingUp, Eye, Users } from 'lucide-react'
import Link from 'next/link'
import { ProductCard } from '@/app/components/products/ProductCard'
import { ProductList } from '@/app/components/products/ProductList'

import { EditProductModal } from '@/app/components/products/EditProductModal'
import { ProductsSkeleton } from '@/app/components/products/ProductsSkeleton'
import { useCallback } from 'react'
import { Product } from '@/app/components/products/types'
import { createBrowserClient } from '@supabase/ssr'
import { motion, AnimatePresence } from 'framer-motion'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  // Initialize view type with a default value, will be updated from localStorage in useEffect
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid')
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  
  const fetchProducts = useCallback(async () => {
      try {
        setIsLoading(true)
        
        // First get the current user session
        const { data: { session } } = await supabase.auth.getSession()
        const userId = session?.user.id

        if (!userId) {
          throw new Error('User not authenticated')
        }

        // Get retailer record
        const { data: retailerData, error: retailerError } = await supabase
          .from('retailers')
          .select('id')
          .eq('user_id', userId)
          .single()

        if (retailerError) {
          throw new Error('Could not find retailer record for this user')
        }

        const retailerId = retailerData.id

        // Fetch products from accepted distributor partnerships only
        const { data: productsData, error: productsError } = await supabase
          .from('distributor_products')
          .select(`
            *,
            product_categories(name),
            distributors!inner(
              id,
              relationships!inner(
                retailer_id,
                status
              )
            )
          `)
          .eq('distributors.relationships.retailer_id', retailerId)
          .eq('distributors.relationships.status', 'accepted')
        
        if (productsError) throw productsError
        
        // Fetch categories from Supabase
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('product_categories')
          .select('name')
        
        if (categoriesError) throw categoriesError
        
        console.log('Raw products data:', productsData)
        
        // Transform the products data to match our Product interface
        // Define the type for the raw product data from the database
        type RawProductData = {
          id: string;
          name: string;
          description?: string;
          sku: string;
          upc?: string;
          category?: string;
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
        
        // Extract category names from the categories data
        interface CategoryData {
          name: string
        }
        
        const categoryNames = categoriesData.map((category: CategoryData) => category.name)
        
        setProducts(transformedProducts)
        setCategories(categoryNames)
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
  
  // Load view type preference from localStorage on component mount
  useEffect(() => {
    // Only run on the client side
    if (typeof window !== 'undefined') {
      const savedViewType = localStorage.getItem('kitions_products_view_type')
      if (savedViewType === 'grid' || savedViewType === 'list') {
        setViewType(savedViewType)
      }
    }
  }, [])
  
  // Save view type preference to localStorage when it changes
  useEffect(() => {
    // Only run on the client side
    if (typeof window !== 'undefined') {
      localStorage.setItem('kitions_products_view_type', viewType)
    }
  }, [viewType])
  
  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setIsEditModalOpen(true)
  }
  
  const handleDeleteProduct = () => {
    // The actual deletion is handled in the ProductCard component
    // Just refresh the products list
    setRefreshTrigger(prev => prev + 1)
  }
  
  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1)
  }
  
  const allCategories = ['all', 'Beverages', 'Food', 'Snacks', 'Electronics', 'Apparel']
  
  // Use actual products data, fallback to categories if available
  const displayCategories = categories.length > 0 ? 
    ['all', ...categories] : 
    allCategories

  // Filter products based on search term and selected category
  const filteredProducts = products
    .filter(product => 
      searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(product => 
      selectedCategory === 'all' || 
      product.category.toLowerCase() === selectedCategory.toLowerCase()
    );

  // Calculate stats
  const totalProducts = products.length
  const inStockProducts = products.filter(p => p.stock_quantity > 0).length
  const lowStockProducts = products.filter(p => p.stock_quantity > 0 && p.stock_quantity <= 10).length
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock_quantity), 0)
  
  return (
    <DashboardLayout userType="retailer">
      {isLoading ? (
        <ProductsSkeleton viewType={viewType} />
      ) : error ? (
        <div className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 -m-6 p-6 min-h-full">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl shadow-sm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="flex items-center space-x-3">
                <div className="p-1.5 bg-red-100 rounded-full">
                  <Package className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Error Loading Products</h3>
                  <p className="text-xs">{error}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 -m-6 p-6 min-h-full">
          {/* Compact Hero Header Section */}
          <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 px-6 py-8 rounded-3xl mb-6">
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
                      <Package className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-white mb-1">Available Products</h1>
                      <p className="text-indigo-100 text-sm">Browse products from your distributor partners</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Link
                    href="/retailer/orders/create"
                    className="group relative px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl text-sm"
                  >
                    <ShoppingCart size={16} />
                    <span>Create Order</span>
                  </Link>
                </div>
              </div>
              
              {/* Compact Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <motion.div 
                  className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-indigo-100 text-xs font-medium">Total Products</p>
                      <p className="text-white text-xl font-bold">{totalProducts}</p>
                    </div>
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Package className="h-4 w-4 text-white" />
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
                      <p className="text-indigo-100 text-xs font-medium">In Stock</p>
                      <p className="text-white text-xl font-bold">{inStockProducts}</p>
                    </div>
                    <div className="p-2 bg-emerald-500/30 rounded-lg">
                      <TrendingUp className="h-4 w-4 text-emerald-200" />
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
                      <p className="text-indigo-100 text-xs font-medium">Low Stock</p>
                      <p className="text-white text-xl font-bold">{lowStockProducts}</p>
                    </div>
                    <div className="p-2 bg-amber-500/30 rounded-lg">
                      <Eye className="h-4 w-4 text-amber-200" />
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
                      <p className="text-indigo-100 text-xs font-medium">Total Value</p>
                      <p className="text-white text-xl font-bold">${totalValue.toLocaleString()}</p>
                    </div>
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto">
            <div className="space-y-6">
              {/* Compact Search and Filter Section */}
              <motion.div 
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="p-5">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    {/* Search and Filters */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                      {/* Compact Search */}
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Search products..."
                            className="w-64 pl-10 pr-4 py-2.5 bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all duration-300 shadow-md text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                          <SearchIcon
                            size={16}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-indigo-500 transition-colors duration-300"
                          />
                        </div>
                      </div>
                      
                      {/* Compact Category Filter */}
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                        <div className="relative flex items-center space-x-2 bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-xl px-4 py-2.5 shadow-md">
                          <FilterIcon size={14} className="text-gray-500 group-hover:text-purple-500 transition-colors duration-300" />
                          <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="bg-transparent text-gray-700 text-sm focus:outline-none cursor-pointer min-w-[100px]"
                          >
                            {displayCategories.map((category) => (
                              <option key={category} value={category}>
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    {/* View Toggle and Stats */}
                    <div className="flex items-center justify-between lg:justify-end space-x-4">
                      <div className="text-xs text-gray-600 bg-gray-100/80 px-3 py-1.5 rounded-full">
                        <span className="font-semibold text-indigo-600">{filteredProducts.length}</span> of {totalProducts} products
                      </div>
                      
                      {/* Compact View Toggle */}
                      <div className="relative bg-gray-100/80 backdrop-blur-sm rounded-xl p-1 shadow-inner">
                        <div className="flex items-center space-x-0.5">
                          <motion.button
                            onClick={() => setViewType('grid')}
                            className={`relative p-2 rounded-lg transition-all duration-300 ${
                              viewType === 'grid' 
                                ? 'bg-white text-indigo-600 shadow-md' 
                                : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            aria-label="Grid view"
                          >
                            <LayoutGridIcon size={14} />
                          </motion.button>
                          <motion.button
                            onClick={() => setViewType('list')}
                            className={`relative p-2 rounded-lg transition-all duration-300 ${
                              viewType === 'list' 
                                ? 'bg-white text-indigo-600 shadow-md' 
                                : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            aria-label="List view"
                          >
                            <ListIcon size={14} />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Products Display */}
              <AnimatePresence mode="wait">
                {products.length === 0 ? (
                  <motion.div 
                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-12 text-center"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <div className="relative mx-auto w-20 h-20 mb-6">
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-lg opacity-20"></div>
                      <div className="relative bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center w-full h-full">
                        <Package className="h-10 w-10 text-indigo-500" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">No products available</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto text-sm">No products available from your distributor partnerships. Connect with distributors to see their products here!</p>
                    <Link
                      href="/retailer/orders"
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 space-x-2"
                    >
                      <Users size={16} />
                      <span>View Partnerships</span>
                    </Link>
                  </motion.div>
                ) : filteredProducts.length === 0 ? (
                  <motion.div 
                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-12 text-center"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <div className="relative mx-auto w-20 h-20 mb-6">
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full blur-lg opacity-20"></div>
                      <div className="relative bg-gradient-to-r from-amber-100 to-orange-100 rounded-full flex items-center justify-center w-full h-full">
                        <SearchIcon className="h-10 w-10 text-amber-500" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">No products match your search</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto text-sm">Try adjusting your search terms or filters to find what you&apos;re looking for.</p>
                    <motion.button
                      onClick={() => {
                        setSearchTerm('')
                        setSelectedCategory('all')
                      }}
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Clear filters
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div
                    key={viewType}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {viewType === 'grid' ? (
                      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                        {filteredProducts.map((product, index) => (
                          <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05, duration: 0.3 }}
                          >
                            <ProductCard 
                              product={product} 
                              onEdit={handleEditProduct}
                              onDelete={handleDeleteProduct}
                              onRefresh={handleRefresh}
                            />
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden">
                        <ProductList products={filteredProducts} />
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}
      
      {/* Modals */}
      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedProduct(null)
          setRefreshTrigger(prev => prev + 1)
        }}
        categories={displayCategories.filter((c) => c !== 'all')}
        product={selectedProduct}
      />
    </DashboardLayout>
  )
}

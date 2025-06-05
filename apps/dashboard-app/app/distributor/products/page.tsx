'use client'

import React, { useState, useEffect } from 'react'
import { DashboardLayout } from '@/app/components/layout'
import { SearchIcon, FilterIcon, LayoutGrid as LayoutGridIcon, List as ListIcon, ShoppingCart, Package, Plus } from 'lucide-react'
import Link from 'next/link'
import { ProductCard } from '@/app/components/products/ProductCard'
import { ProductList } from '@/app/components/products/ProductList'
import { AddProductModal } from '@/app/components/products/AddProductModal'
import { EditProductModal } from '@/app/components/products/EditProductModal'
import { useCallback } from 'react'
import { Product } from '@/app/components/products/types'
import { createBrowserClient } from '@supabase/ssr'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
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
        
        // Fetch products from Supabase with joined category information
        const { data: productsData, error: productsError } = await supabase
          .from('distributor_products')
          .select(`
            *,
            product_categories(name)
          `)
        
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
  
  return (
    <DashboardLayout userType="distributor">
      <div className="p-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-gray-800 text-3xl font-semibold">Products</h1>
              <Link
                href="/distributor/orders/create"
                className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium flex items-center hover:bg-green-700"
              >
                <ShoppingCart size={16} className="mr-2" />
                Make Order
              </Link>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search products..."
                        className=" placeholder-gray-400 pl-9 pr-4 py-2 border border-gray-200 rounded-md text-sm w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <SearchIcon
                        size={16}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <FilterIcon size={16} className="text-gray-500" />
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="cursor-pointer text-gray-700 text-sm border border-gray-200 rounded-md px-3 py-2"
                      >
                        {displayCategories.map((category) => (
                          <option key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="border-l border-gray-200 ml-4 pl-4">
                      <div className="flex items-center bg-gray-100 rounded-md p-1">
                        <button
                          onClick={() => setViewType('grid')}
                          className={`p-1.5 rounded ${viewType === 'grid' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500 hover:text-gray-800'}`}
                          aria-label="Grid view"
                        >
                          <LayoutGridIcon size={16} />
                        </button>
                        <button
                          onClick={() => setViewType('list')}
                          className={`p-1.5 rounded ${viewType === 'list' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500 hover:text-gray-800'}`}
                          aria-label="List view"
                        >
                          <ListIcon size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {products.length} products
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                {products.length === 0 ? (
                  <div className="p-16 text-center">
                    <div className="mx-auto w-24 h-24 bg-gray-100 flex items-center justify-center rounded-full mb-6">
                      <Package className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-500 mb-6">You haven&apos;t added any products yet. Start building your catalog!</p>
                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <Plus size={16} className="mr-2" />
                      Add your first product
                    </button>
                  </div>
                ) : (
                  /* Filter products based on search term and selected category */
                  (() => {
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
                    
                    if (filteredProducts.length === 0) {
                      return (
                        <div className="p-16 text-center">
                          <div className="mx-auto w-24 h-24 bg-gray-100 flex items-center justify-center rounded-full mb-6">
                            <Package className="h-12 w-12 text-gray-400" />
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No products match your search</h3>
                          <p className="text-gray-500 mb-6">Try adjusting your search terms or filters to find what you&apos;re looking for.</p>
                          <button
                            onClick={() => {
                              setSearchTerm('')
                              setSelectedCategory('all')
                            }}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Clear filters
                          </button>
                        </div>
                      );
                    }
                      
                    return viewType === 'grid' ? (
                      // Grid view
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProducts.map((product) => (
                          <ProductCard 
                            key={product.id} 
                            product={product} 
                            onEdit={handleEditProduct}
                            onDelete={handleDeleteProduct}
                            onRefresh={handleRefresh}
                          />
                        ))}
                      </div>
                    ) : (
                      // List view with sorting capability
                      <ProductList 
                        products={filteredProducts} 
                      />
                    );
                  })()
                )}
              </div>
            </div>
            
            <AddProductModal
              isOpen={isAddModalOpen}
              onClose={() => {
                setIsAddModalOpen(false)
                // Trigger a refresh of the products list
                setRefreshTrigger(prev => prev + 1)
              }}
              categories={displayCategories.filter((c) => c !== 'all')}
            />
            
            <EditProductModal
              isOpen={isEditModalOpen}
              onClose={() => {
                setIsEditModalOpen(false)
                setSelectedProduct(null)
                // Trigger a refresh of the products list
                setRefreshTrigger(prev => prev + 1)
              }}
              categories={displayCategories.filter((c) => c !== 'all')}
              product={selectedProduct}
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

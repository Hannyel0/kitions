'use client'

import React, { useState, useEffect, useCallback } from 'react'
import {
  PlusIcon,
  SearchIcon,
  FilterIcon,
  EditIcon,
  PackageIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  ScanLineIcon,
  BellIcon,
} from 'lucide-react'
import DashboardLayout from '@/app/components/layout/DashboardLayout'
import { AddProductModal } from '@/app/components/products/AddProductModal'
import { Product } from '@/app/components/products/types'
import { createBrowserClient } from '@supabase/ssr'

export default function Inventory() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  
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
      
      // Transform the products data to match our Product interface
      const transformedProducts = productsData.map((product: any) => ({
        id: product.id,
        name: product.name,
        description: product.description || '',
        price: product.price || 0,
        image: product.image_url || 'https://via.placeholder.com/300',
        image_url: product.image_url || '',
        case_size: product.case_size || 1,
        stock_quantity: product.stock_quantity || 0,
        category: product.product_categories?.name || 'Uncategorized',
        category_id: product.category_id || '',
        sku: product.sku || '',
        upc: product.upc || ''
      }))
      
      // Extract category names from the categories data
      const categoryNames = categoriesData.map((category: any) => category.name)
      
      setProducts(transformedProducts)
      setCategories(['all', ...categoryNames])
    } catch (err: any) {
      console.error('Error fetching data:', err)
      setError(err.message || 'Failed to load products')
    } finally {
      setIsLoading(false)
    }
  }, [supabase])
  
  useEffect(() => {
    fetchProducts()
  }, [fetchProducts, refreshTrigger])
  
  // Stock status for display
  
  const getStockStatus = (stock: number) => {
    if (stock <= 100) {
      return {
        label: 'Low Stock',
        color: 'bg-yellow-50 text-yellow-600',
        icon: <AlertTriangleIcon size={12} className="mr-1" />,
      }
    }
    return {
      label: 'In Stock',
      color: 'bg-green-50 text-green-600',
      icon: <CheckCircleIcon size={12} className="mr-1" />,
    }
  }
  
  const lowStockProducts = products.filter((product) => product.stock_quantity <= 100)
  
  return (
    <DashboardLayout userType="distributor">
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
            {error}
          </div>
        ) : (
          <>
            {lowStockProducts.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center">
                  <BellIcon className="h-5 w-5 text-yellow-600 mr-2" />
                  <h2 className="text-sm font-medium text-yellow-800">
                    Low Stock Alerts
                  </h2>
                </div>
                <div className="mt-3 space-y-2">
                  {lowStockProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between bg-white p-3 rounded-md border border-yellow-100"
                    >
                      <div className="flex items-center">
                        <AlertTriangleIcon
                          size={16}
                          className="text-yellow-600 mr-2"
                        />
                        <span className="text-sm font-medium">{product.name}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-yellow-600 font-medium">
                          Only {product.stock_quantity} units left
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
        {!isLoading && !error && (
          <div className="flex items-center justify-between">
            <h1 className="text-gray-800 text-2xl font-semibold">Inventory Management</h1>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium flex items-center"
            >
              <PlusIcon size={16} className="mr-2" />
              Add Product
            </button>
          </div>
        )}
        {!isLoading && !error && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search inventory..."
                    className="text-gray-800 pl-9 pr-4 py-2 border border-gray-200 rounded-md text-sm w-64"
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
                    className="text-gray-800 text-sm border border-gray-200 rounded-md px-3 py-2"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button className="p-2 border border-gray-200 rounded-md hover:bg-gray-50">
                <ScanLineIcon size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products
                  .filter(product => 
                    searchTerm === '' || 
                    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    product.description.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .filter(product => 
                    selectedCategory === 'all' || 
                    product.category.toLowerCase() === selectedCategory.toLowerCase()
                  )
                  .map((product) => {
                  const stockStatus = getStockStatus(product.stock_quantity)
                  return (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                            <img
                              src={product.image_url || product.image}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {product.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          ${product.price}
                        </div>
                        <div className="text-xs text-gray-500">
                          per case of {product.case_size}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <PackageIcon size={16} className="text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">
                            {product.stock_quantity} units
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${stockStatus.color}`}
                        >
                          {stockStatus.icon}
                          {stockStatus.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-blue-600 hover:text-blue-800 mr-3">
                          <EditIcon size={16} />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
        )}
        <AddProductModal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false)
            // Trigger a refresh of the products list
            setRefreshTrigger(prev => prev + 1)
          }}
          categories={categories.filter((c) => c !== 'all')}
        />
      </div>
    </DashboardLayout>
  );
}
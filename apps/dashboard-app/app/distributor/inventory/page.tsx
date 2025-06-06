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
  XIcon,
  // PackageOpenIcon
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import DashboardLayout from '@/app/components/layout/DashboardLayout'
import { AddProductModal } from '@/app/components/products/AddProductModal'
import { Product } from '@/app/components/products/types'
import { createBrowserClient } from '@supabase/ssr'
import Image from 'next/image'
import { BarcodeScanner } from '@/app/components/barcode/BarcodeScanner'

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
  // These states are used in functions but flagged as unused by the linter
  // Using destructuring to keep the setters while avoiding the unused variable warning
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
      
      // Define a type for the raw product data from the database
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

      // Transform the products data to match our Product interface
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
  const hasLowStock = lowStockProducts.length > 0
  
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
        ) : null}
        {!isLoading && !error && (
          <div className="flex items-center justify-between">
            <h1 className="text-gray-800 text-2xl font-semibold">Inventory Management</h1>
            <div className="flex space-x-3">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium flex items-center"
              >
                <PlusIcon size={16} className="mr-2" />
                Add Product
              </button>
            </div>
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
                  {hasLowStock && (
                    <div 
                      className="cursor-pointer relative pl-2" 
                      title="Some items are low in stock"
                      onClick={() => setIsLowStockModalOpen(true)}
                    >
                      <BellIcon size={16} className="text-yellow-500" />
                      <div className="absolute -top-1 -right-1 h-2 w-2 bg-yellow-500 rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
              <button 
                onClick={() => setIsScannerOpen(true)}
                className="p-2 border border-gray-200 rounded-md hover:bg-blue-50 hover:border-blue-200 transition-colors"
                title="Scan product barcode"
              >
                <ScanLineIcon size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
          
          {/* Empty State */}
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <PackageIcon size={48} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No products in inventory</h3>
              <p className="text-gray-500 text-center mb-8 max-w-md">
                Get started by adding your first product to your inventory. You can manually add products or scan their barcodes.
              </p>
              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium flex items-center hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <PlusIcon size={16} className="mr-2" />
                  Add Your First Product
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsScannerOpen(true)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium flex items-center hover:bg-gray-50 transition-colors"
                >
                  <ScanLineIcon size={16} className="mr-2" />
                  Scan Barcode
                </motion.button>
              </div>
            </div>
          ) : (
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
                            {((product.image_url && product.image_url !== '') || (product.image && product.image !== '')) ? (
                              <Image
                                src={product.image_url || product.image}
                                alt={product.name}
                                width={40}
                                height={40}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center bg-gray-100 border border-gray-200">
                                <Image src="/package-open.svg" alt="Package icon" width={20} height={20} className="h-5 w-5" />
                              </div>
                            )}
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
          )}
        </div>
        )}
        <AddProductModal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false)
            setScannedUpcForNewProduct('')
            // Trigger a refresh of the products list
            setRefreshTrigger(prev => prev + 1)
          }}
          categories={categories.filter((c) => c !== 'all')}
          initialUpc={scannedUpcForNewProduct}
        />
        
        {/* Low Stock Modal */}
        <AnimatePresence>
          {isLowStockModalOpen && lowStockProducts.length > 0 && (
            <div className="fixed inset-0 z-50 overflow-y-auto">
              {/* Overlay */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/50 transition-opacity"
                onClick={() => setIsLowStockModalOpen(false)}
              />
              
              {/* Modal container */}
              <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0 relative z-50">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ duration: 0.3, type: 'spring', bounce: 0.25 }}
                  className="inline-block align-middle bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full relative"
                >
                  <div className="bg-white px-6 py-5 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center">
                      <AlertTriangleIcon className="h-5 w-5 text-yellow-500 mr-2" />
                      <h3 className="text-lg font-medium text-gray-900">Low Stock Items</h3>
                    </div>
                    <button
                      type="button"
                      className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                      onClick={() => setIsLowStockModalOpen(false)}
                    >
                      <XIcon className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
                    <p className="text-sm text-gray-500 mb-4">
                      The following items are running low on stock and may need to be reordered soon:
                    </p>
                    
                    <div className="space-y-3">
                      {lowStockProducts.map((product) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                          className="p-4 bg-yellow-50 rounded-lg border border-yellow-100 flex items-start"
                        >
                          <div className="flex-shrink-0 mr-3">
                            {product.image_url ? (
                              <div className="h-16 w-16 rounded overflow-hidden bg-white border border-gray-200">
                                <Image
                                  src={product.image_url}
                                  alt={product.name}
                                  width={64}
                                  height={64}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="h-16 w-16 rounded flex items-center justify-center bg-gray-100 border border-gray-200">
                                <Image src="/package-open.svg" alt="Package icon" width={32} height={32} className="h-8 w-8" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h4 className="text-sm font-medium text-gray-900">{product.name}</h4>
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                {product.stock_quantity} units
                              </span>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">{product.description}</p>
                            <div className="mt-2 flex items-center justify-between">
                              <div className="text-xs text-gray-500">
                                SKU: {product.sku || 'N/A'}
                              </div>
                              <button className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700">
                                Restock
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 px-6 py-4 flex justify-end">
                    <button
                      type="button"
                      className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsLowStockModalOpen(false)}
                    >
                      Close
                    </button>
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
            
            // Search for product with matching UPC or SKU - normalize the comparison
            const foundProduct = products.find(
              (p) => 
                (p.upc && p.upc.replace(/\D/g, '') === barcode.replace(/\D/g, '')) || 
                p.sku === barcode
            );
            
            if (foundProduct) {
              // Close the scanner modal
              setIsScannerOpen(false);
              
              setFoundProductByBarcode(foundProduct);
              // Set search term to help user locate the product in the table
              setSearchTerm(foundProduct.name);
              
              // Display a notification toast (could be improved with a toast library)
              const notification = document.createElement('div');
              notification.className = 'fixed bottom-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md z-50';
              notification.innerHTML = `
                <div class="flex items-center">
                  <div class="py-1"><svg class="h-6 w-6 text-green-500 mr-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg></div>
                  <div>
                    <p class="font-bold">Product Found!</p>
                    <p class="text-sm">${foundProduct.name} (${barcode})</p>
                  </div>
                </div>
              `;
              document.body.appendChild(notification);
              
              // Remove notification after 5 seconds
              setTimeout(() => {
                document.body.removeChild(notification);
              }, 5000);
            } else {
              // Close the scanner modal
              setIsScannerOpen(false);
              
              // Immediately open the add product modal with the scanned UPC
              setScannedUpcForNewProduct(barcode);
              setIsAddModalOpen(true);
              
              // Show a notification that product wasn't found
              const notification = document.createElement('div');
              notification.className = 'fixed bottom-4 right-4 bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded shadow-md z-50';
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
              
              // Remove notification after 5 seconds
              setTimeout(() => {
                document.body.removeChild(notification);
              }, 5000);
            }
          }}
        />
      </div>
    </DashboardLayout>
  );
}
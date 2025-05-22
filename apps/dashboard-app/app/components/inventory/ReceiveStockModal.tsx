'use client'

import React, { useState, useEffect } from 'react'
import { X as CloseIcon, Search as SearchIcon, Calendar, Package, Hash, AlertCircle, Loader2 } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'
import { Product } from '@/app/components/products/types'

interface ReceiveStockModalProps {
  isOpen: boolean
  onClose: () => void
  products: Product[]
  onRefresh: () => void
}

export function ReceiveStockModal({
  isOpen,
  onClose,
  products,
  onRefresh,
}: ReceiveStockModalProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [batchNumber, setBatchNumber] = useState('')
  const [quantity, setQuantity] = useState('')
  const [receiveDate, setReceiveDate] = useState(
    new Date().toISOString().split('T')[0] // Today's date in YYYY-MM-DD format
  )
  const [expirationDate, setExpirationDate] = useState('')
  const [showProductDropdown, setShowProductDropdown] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  
  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      resetForm()
    }
  }, [isOpen])
  
  const resetForm = () => {
    setSelectedProduct(null)
    setSearchTerm('')
    setBatchNumber('')
    setQuantity('')
    setReceiveDate(new Date().toISOString().split('T')[0])
    setExpirationDate('')
    setError(null)
    setShowProductDropdown(false)
  }
  
  // Filtered products based on search term
  const filteredProducts = products.filter(product => 
    searchTerm === '' || 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (product.upc && product.upc.toLowerCase().includes(searchTerm.toLowerCase()))
  )
  
  // Handle product selection
  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product)
    setSearchTerm(product.name)
    setShowProductDropdown(false)
  }
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!selectedProduct) {
      setError('Please select a product')
      return
    }
    
    if (!batchNumber) {
      setError('Please enter a batch number')
      return
    }
    
    if (!quantity || parseInt(quantity) <= 0) {
      setError('Please enter a valid quantity')
      return
    }
    
    if (!receiveDate) {
      setError('Please select a receive date')
      return
    }
    
    setIsSubmitting(true)
    setError(null)
    
    try {
      // Parse quantity as integer
      const quantityNum = parseInt(quantity)
      
      // Create Supabase client
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      
      // Get the user ID from the session
      const { data: { session } } = await supabase.auth.getSession()
      const userId = session?.user?.id
      
      if (!userId) {
        setError('Authentication error. Please log in again.')
        return
      }
      
      // Get the distributor record associated with this user
      const { data: distributorData, error: distributorError } = await supabase
        .from('distributors')
        .select('id')
        .eq('user_id', userId)
        .single()
      
      if (distributorError) {
        console.error('Error fetching distributor:', distributorError)
        setError('Could not find your distributor profile. Please contact support.')
        return
      }
      
      if (!distributorData) {
        setError('No distributor profile found. Please contact support.')
        return
      }
      
      const distributorId = distributorData.id
      
      console.log('Using distributor ID:', distributorId)
      
      // 1. First update the product's total stock quantity
      const newStockQuantity = selectedProduct.stock_quantity + quantityNum
      
      const { error: updateError } = await supabase
        .from('distributor_products')
        .update({ stock_quantity: newStockQuantity })
        .eq('id', selectedProduct.id)
      
      if (updateError) {
        console.error('Error updating product quantity:', updateError)
        throw updateError
      }
      
      // 2. Insert the new batch record
      const batchRecord = {
        product_id: selectedProduct.id,
        batch_number: batchNumber,
        quantity: quantityNum,
        received_date: new Date(receiveDate).toISOString(),
        expiration_date: expirationDate ? new Date(expirationDate).toISOString() : null,
        distributor_id: distributorId,
        remaining_quantity: quantityNum // Initially, remaining = total quantity
      }
      
      console.log('Inserting batch record:', batchRecord)
      
      const { data: batchData, error: batchError } = await supabase
        .from('product_batches')
        .insert(batchRecord)
        .select()
    
      if (batchError) throw batchError
      
      // Success! Close the modal and refresh the product list
      setSuccess(true)
      setTimeout(() => {
        resetForm()
        onRefresh() // Refresh the products list with updated quantities
        onClose()
      }, 1500)
    } catch (err: any) {
      console.error('Error receiving stock:', err)
      setError(err.message || 'Failed to update inventory')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/70 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal container */}
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0 relative z-50">
        <div className="inline-block align-middle bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
          <div className="absolute top-0 right-0 pt-4 pr-4 z-10">
            <button
              type="button"
              className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={onClose}
            >
              <CloseIcon className="h-6 w-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="px-6 pt-5 pb-6">
              <div className="text-center sm:text-left mb-5">
                <h3 className="text-lg font-medium text-gray-900">
                  Receive Stock
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Add new inventory for tracking
                </p>
              </div>
              
              {/* Product Selector */}
              <div className="mb-4">
                <label htmlFor="product" className="block text-sm font-medium text-gray-700 mb-1">
                  Product <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="product"
                    placeholder="Search products by name, SKU or UPC..."
                    className="text-gray-800 pl-9 pr-4 py-2 border border-gray-200 rounded-md text-sm w-full"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value)
                      setShowProductDropdown(true)
                      if (!e.target.value) {
                        setSelectedProduct(null)
                      }
                    }}
                    onFocus={() => setShowProductDropdown(true)}
                    required
                  />
                  <SearchIcon
                    size={16}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                </div>
                
                {/* Product Dropdown */}
                {showProductDropdown && searchTerm && (
                  <div className="absolute z-10 mt-1 w-full max-h-60 overflow-auto bg-white border border-gray-200 rounded-md shadow-lg">
                    {filteredProducts.length > 0 ? (
                      <ul className="divide-y divide-gray-200">
                        {filteredProducts.map(product => (
                          <li 
                            key={product.id} 
                            className="p-3 hover:bg-gray-50 cursor-pointer"
                            onClick={() => handleProductSelect(product)}
                          >
                            <div className="font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500">
                              {product.sku && `SKU: ${product.sku}`}
                              {product.sku && product.upc && ' • '}
                              {product.upc && `UPC: ${product.upc}`}
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="p-3 text-center text-gray-500">
                        No products found
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Batch Number */}
              <div className="mb-4">
                <label htmlFor="batchNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Batch Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="batchNumber"
                    className="text-gray-800 pl-9 pr-4 py-2 border border-gray-200 rounded-md text-sm w-full"
                    value={batchNumber}
                    onChange={(e) => setBatchNumber(e.target.value)}
                    placeholder="Enter batch number"
                    required
                  />
                  <Hash
                    size={16}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                </div>
              </div>
              
              {/* Quantity */}
              <div className="mb-4">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity Received <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="quantity"
                    className="text-gray-800 pl-9 pr-4 py-2 border border-gray-200 rounded-md text-sm w-full"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Enter quantity"
                    min="1"
                    required
                  />
                  <Package
                    size={16}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                </div>
              </div>
              
              {/* Date Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {/* Receive Date */}
                <div>
                  <label htmlFor="receiveDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Receive Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="receiveDate"
                      className="text-gray-800 pl-9 pr-4 py-2 border border-gray-200 rounded-md text-sm w-full"
                      value={receiveDate}
                      onChange={(e) => setReceiveDate(e.target.value)}
                      required
                    />
                    <Calendar
                      size={16}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                  </div>
                </div>
                
                {/* Expiration Date */}
                <div>
                  <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Expiration Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="expirationDate"
                      className="text-gray-800 pl-9 pr-4 py-2 border border-gray-200 rounded-md text-sm w-full"
                      value={expirationDate}
                      onChange={(e) => setExpirationDate(e.target.value)}
                    />
                    <Calendar
                      size={16}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                  </div>
                </div>
              </div>
              
              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 flex items-center bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                  <AlertCircle size={16} className="mr-2 flex-shrink-0" />
                  {error}
                </div>
              )}
              
              {/* Product Details */}
              {selectedProduct && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <h4 className="text-sm font-medium text-blue-700 mb-1">Selected Product Details</h4>
                  <div className="text-sm text-blue-600">
                    <p><span className="font-medium">Current Stock:</span> {selectedProduct.stock_quantity}</p>
                    {selectedProduct.case_size > 1 && (
                      <p><span className="font-medium">Case Size:</span> {selectedProduct.case_size}</p>
                    )}
                  </div>
                </div>
              )}
              
              {/* Form Actions */}
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50 flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Receive Stock'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

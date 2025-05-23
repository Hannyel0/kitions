'use client'

import React, { useState, useEffect } from 'react'
import { X as CloseIcon, Calendar, Package, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'

interface InitialBatchModalProps {
  isOpen: boolean
  onClose: () => void
  productId: string
  productName: string
}

export function InitialBatchModal({
  isOpen,
  onClose,
  productId,
  productName,
}: InitialBatchModalProps) {
  // Get current date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0]
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit' 
  }).replace(/\//g, '')
  
  // Form state
  const [batchNumber, setBatchNumber] = useState(`INITIAL-${currentDate}`)
  const [quantity, setQuantity] = useState('0')
  const [receiveDate, setReceiveDate] = useState(today)
  const [expirationDate, setExpirationDate] = useState('')
  
  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      const formattedDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit' 
      }).replace(/\//g, '')
      
      setBatchNumber(`INITIAL-${formattedDate}`)
      setQuantity('0')
      setReceiveDate(today)
      setExpirationDate('')
      setError(null)
      setSuccess(false)
    }
  }, [isOpen, today])
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!quantity || parseInt(quantity) <= 0) {
      setError('Please enter a valid quantity')
      return
    }
    
    setIsSubmitting(true)
    setError(null)
    
    try {
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
      
      // Parse quantity as integer
      const quantityNum = parseInt(quantity)
      
      // 1. First update the product's total stock quantity
      const { error: updateError } = await supabase
        .from('distributor_products')
        .update({ stock_quantity: quantityNum })
        .eq('id', productId)
      
      if (updateError) {
        console.error('Error updating product quantity:', updateError)
        throw updateError
      }
      
      // 2. Insert the new batch record
      const batchRecord = {
        product_id: productId,
        batch_number: batchNumber,
        quantity: quantityNum,
        received_date: new Date(receiveDate).toISOString(),
        expiration_date: expirationDate ? new Date(expirationDate).toISOString() : null,
        distributor_id: distributorId,
        remaining_quantity: quantityNum // Initially, remaining = total quantity
      }
      
      const { error: batchError } = await supabase
        .from('product_batches')
        .insert(batchRecord)
      
      if (batchError) throw batchError
      
      // Success!
      setSuccess(true)
      setTimeout(() => {
        if (!isOpen) return // Avoid state updates if modal has been closed
        onClose()
      }, 2000)
      
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      console.error('Error adding batch:', error)
      setError(error.message || 'Failed to add batch')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md shadow-xl">
        <div className="relative">
          <div className="absolute top-4 right-4">
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={onClose}
            >
              <CloseIcon className="h-6 w-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="p-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">
                  Add Initial Inventory
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  For {productName}
                </p>
              </div>
              
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
                  <AlertCircle size={18} className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-red-700">{error}</span>
                </div>
              )}
              
              {success ? (
                <div className="text-center py-8">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Inventory Added</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Initial inventory has been successfully added to the product.
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Batch Number
                      </label>
                      <input
                        type="text"
                        className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                        value={batchNumber}
                        disabled
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Auto-generated batch number for initial inventory
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-md"
                          placeholder="Enter quantity"
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                          min="1"
                          required
                        />
                        <Package
                          size={16}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Receive Date <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-md cursor-pointer"
                            value={receiveDate}
                            onChange={(e) => setReceiveDate(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Expiration Date
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-md cursor-pointer"
                            value={expirationDate}
                            onChange={(e) => setExpirationDate(e.target.value)}
                            min={today}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <div className="bg-gray-50 px-6 py-4 flex justify-end">
              {!success && (
                <>
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mr-3"
                    onClick={onClose}
                    disabled={isSubmitting}
                  >
                    Skip
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-green-700 disabled:opacity-50 flex items-center"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Add Initial Inventory'
                    )}
                  </button>
                </>
              )}
              {success && (
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md shadow-sm text-sm font-medium hover:bg-gray-200"
                  onClick={onClose}
                >
                  Close
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

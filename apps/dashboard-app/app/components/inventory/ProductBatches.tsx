'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Calendar, Box, AlertCircle, PackageIcon } from 'lucide-react'

interface Batch {
  id: string
  batch_number: string
  quantity: number
  remaining_quantity: number
  received_date: string
  expiration_date: string | null
  created_at: string
}

interface ProductBatchesProps {
  productId: string
}

export function ProductBatches({ productId }: ProductBatchesProps) {
  const [batches, setBatches] = useState<Batch[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Using useCallback to memoize the fetchBatches function
  const fetchBatches = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      const { data, error } = await supabase
        .from('product_batches')
        .select('*')
        .eq('product_id', productId)
        .order('expiration_date', { ascending: true })

      if (error) throw error

      setBatches(data || [])
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      console.error('Error fetching batches:', error)
      setError('Failed to load batches')
    } finally {
      setIsLoading(false)
    }
  }, [productId])

  useEffect(() => {
    fetchBatches()
  }, [fetchBatches])

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Calculate usage percentage
  const calculateUsage = (batch: Batch) => {
    if (batch.quantity === 0) return 0
    const used = batch.quantity - batch.remaining_quantity
    return Math.round((used / batch.quantity) * 100)
  }

  // Determine status color based on remaining quantity and expiration
  const getBatchStatus = (batch: Batch) => {
    // Check if expired
    if (batch.expiration_date && new Date(batch.expiration_date) < new Date()) {
      return {
        label: 'Expired',
        color: 'bg-red-100 text-red-800',
        textColor: 'text-red-800'
      }
    }
    
    // Check if fully used
    if (batch.remaining_quantity === 0) {
      return {
        label: 'Depleted',
        color: 'bg-gray-100 text-gray-800',
        textColor: 'text-gray-800'
      }
    }
    
    // Check if low stock (less than 10% remaining)
    const percentRemaining = (batch.remaining_quantity / batch.quantity) * 100
    if (percentRemaining < 10) {
      return {
        label: 'Low',
        color: 'bg-yellow-100 text-yellow-800',
        textColor: 'text-yellow-800'
      }
    }
    
    // Normal status
    return {
      label: 'Active',
      color: 'bg-green-100 text-green-800',
      textColor: 'text-green-800'
    }
  }

  // Is batch close to expiration? (within 14 days)
  const isNearExpiration = (batch: Batch) => {
    if (!batch.expiration_date) return false
    
    const now = new Date()
    const expiration = new Date(batch.expiration_date)
    const daysUntilExpiration = Math.ceil((expiration.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    
    return daysUntilExpiration > 0 && daysUntilExpiration <= 14
  }

  return (
    <div className="bg-white rounded-lg shadow-sm mt-6 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-gray-800 text-lg font-medium">Batch Inventory</h2>
        <span className="text-sm text-gray-500">
          {batches.length} {batches.length === 1 ? 'batch' : 'batches'} total
        </span>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start">
          <AlertCircle className="text-red-500 mt-0.5 mr-3 flex-shrink-0" size={16} />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      ) : batches.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-md p-6 text-center">
          <PackageIcon className="mx-auto text-gray-400 mb-3" size={24} />
          <h3 className="text-gray-700 font-medium mb-1">No Batches Found</h3>
          <p className="text-gray-500 text-sm">
            This product has no batch records. Use the &quot;Receive Stock&quot; feature in inventory to add batches.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {batches.map(batch => {
            const status = getBatchStatus(batch)
            const usagePercent = calculateUsage(batch)
            const nearExpiration = isNearExpiration(batch)
            
            return (
              <div key={batch.id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Box className="mr-2 text-gray-500" size={16} />
                    <h3 className="text-gray-800 font-medium">Batch #{batch.batch_number}</h3>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${status.color}`}>
                    {status.label}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-3 mb-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Received</p>
                    <div className="flex items-center">
                      <Calendar className="mr-1.5 text-gray-400" size={14} />
                      <span className="text-sm text-gray-800">
                        {formatDate(batch.received_date)}
                      </span>
                    </div>
                  </div>
                  {batch.expiration_date && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Expires</p>
                      <div className="flex items-center">
                        <Calendar className={`mr-1.5 ${nearExpiration ? 'text-yellow-500' : 'text-gray-400'}`} size={14} />
                        <span className={`text-sm ${nearExpiration ? 'text-yellow-700 font-medium' : 'text-gray-800'}`}>
                          {formatDate(batch.expiration_date)}
                          {nearExpiration && ' (Soon)'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-xs text-gray-500">Inventory Level</p>
                    <span className="text-xs text-gray-700">
                      {batch.remaining_quantity} of {batch.quantity} units remaining
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${usagePercent > 90 ? 'bg-red-500' : usagePercent > 70 ? 'bg-yellow-500' : 'bg-blue-500'}`}
                      style={{ width: `${usagePercent}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

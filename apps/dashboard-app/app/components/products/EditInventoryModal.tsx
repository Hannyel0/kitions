import React, { useState, useEffect } from 'react'
import { Loader2, X as CloseIcon, Plus, Minus, PackageIcon, Save as SaveIcon } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'

interface EditInventoryModalProps {
  isOpen: boolean
  onClose: () => void
  productId: string
  currentQuantity: number
  onSuccess: () => void
}

export function EditInventoryModal({
  isOpen,
  onClose,
  productId,
  currentQuantity,
  onSuccess
}: EditInventoryModalProps) {
  const [quantity, setQuantity] = useState(currentQuantity.toString())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Reset form when opening the modal
  useEffect(() => {
    if (isOpen) {
      setQuantity(currentQuantity.toString())
      setError(null)
    }
  }, [isOpen, currentQuantity])
  
  // Handle quantity changes - only allow numbers
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '')
    setQuantity(value)
  }
  
  // Increment or decrement quantity
  const adjustQuantity = (amount: number) => {
    const newValue = Math.max(0, parseInt(quantity || '0') + amount)
    setQuantity(newValue.toString())
  }
  
  // Update the inventory quantity
  const saveInventoryChange = async () => {
    setIsSubmitting(true)
    setError(null)
    
    const newQuantity = parseInt(quantity || '0')
    
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      
      const { error } = await supabase
        .from('distributor_products')
        .update({ 
          stock_quantity: newQuantity,
          updated_at: new Date().toISOString() 
        })
        .eq('id', productId)
      
      if (error) throw error
      
      // Call success callback
      onSuccess()
      // Close the modal
      onClose()
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      console.error('Error updating inventory:', err)
      setError(err.message || 'Failed to update inventory')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md overflow-hidden shadow-2xl transform transition-all">
        {/* Header */}
        <div className="bg-[#8982cf] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PackageIcon className="text-white" size={20} />
            <h3 className="text-lg font-semibold text-white">Manual Inventory Update</h3>
          </div>
          <button 
            onClick={onClose}
            className="cursor-pointer text-white/80 hover:text-white transition-colors rounded-full hover:bg-[#7870b9] p-1"
            aria-label="Close"
          >
            <CloseIcon size={20} />
          </button>
        </div>
        
        <div className="p-6">
          {/* Description text */}
          <p className="text-gray-600 mb-6 text-sm">Update the current inventory quantity for this product.</p>
          
          {/* Input container */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              Stock Quantity
            </label>
            <div className="flex h-14 shadow-sm rounded-lg overflow-hidden border border-gray-300 hover:border-[#8982cf] transition-colors focus-within:ring-2 focus-within:ring-opacity-50">
              <button
                type="button"
                onClick={() => adjustQuantity(-1)}
                className="cursor-pointer h-14 w-14 bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-[#8982cf] transition-colors border-r border-gray-300 flex items-center justify-center"
                disabled={isSubmitting || parseInt(quantity || '0') <= 0}
              >
                <Minus size={18} />
              </button>
              <input
                type="text"
                value={quantity}
                onChange={handleQuantityChange}
                className="h-14 px-4 w-full text-center text-lg font-medium text-gray-800 focus:outline-none"
                placeholder="Enter quantity"
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => adjustQuantity(1)}
                className="cursor-pointer h-14 w-14 bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-[#8982cf] transition-colors border-l border-gray-300 flex items-center justify-center"
                disabled={isSubmitting}
              >
                <Plus size={18} />
              </button>
            </div>
            
            {error && (
              <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-md">
                <p className="text-sm text-red-700 flex items-center gap-2">
                  <span className="font-medium">Error:</span> {error}
                </p>
              </div>
            )}
          </div>
          
          {/* Actions */}
          <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
            <button
              onClick={onClose}
              className="cursor-pointer px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={saveInventoryChange}
              className="cursor-pointer px-5 py-2.5 bg-[#8982cf] text-white rounded-lg text-sm font-medium hover:bg-[#7870b9] transition-colors flex items-center justify-center gap-2 min-w-[100px] shadow-sm hover:shadow"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  <SaveIcon size={16} />
                  <span>Save</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

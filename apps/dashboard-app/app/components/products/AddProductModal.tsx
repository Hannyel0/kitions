import React, { useState, FormEvent, useEffect, useRef, useCallback } from 'react'
import { X as CloseIcon, Upload as UploadIcon, Loader2, DollarSign, Barcode as BarcodeIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { createBrowserClient } from '@supabase/ssr'
import { useAuth } from '@/app/providers/auth-provider'
import { BarcodeScanner } from '@/app/components/barcode/BarcodeScanner'
import { InitialBatchModal } from '@/app/components/inventory/InitialBatchModal'
import Image from 'next/image'

interface AddProductModalProps {
  isOpen: boolean
  onClose: () => void
  categories: string[]
  initialUpc?: string
}

export function AddProductModal({
  isOpen,
  onClose,
  categories,
  initialUpc,
}: AddProductModalProps) {
  // Form state
  const [productName, setProductName] = useState('')
  const [productDescription, setProductDescription] = useState('')
  const [price, setPrice] = useState('')
  const [caseSize, setCaseSize] = useState('')
  const [category, setCategory] = useState('')
  const [sku, setSku] = useState('')
  const [upc, setUpc] = useState(initialUpc)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  
  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [distributorId, setDistributorId] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [userUniqueId, setUserUniqueId] = useState('')
  // We still need setBusinessName for the API response, but we don't use businessName directly
  const [, setBusinessName] = useState('')
  const [isScannerOpen, setIsScannerOpen] = useState(false)
  
  // Initial batch modal state
  const [showInitialBatchModal, setShowInitialBatchModal] = useState(false)
  const [createdProductId, setCreatedProductId] = useState('')
  const [createdProductName, setCreatedProductName] = useState('')  
  
  // File input reference
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Get current user
  const { user } = useAuth()
  
  // Function to generate SKU - wrapped in useCallback to avoid dependency issues
  const generateSku = useCallback(() => {
    if (!productName || !category || !caseSize || !userUniqueId) return ''
    
    // Get category abbreviation (first 3 letters uppercase)
    const categoryAbbrev = category.substring(0, 3).toUpperCase()
    
    // Get product name abbreviation (first 3 letters uppercase)
    const nameAbbrev = productName.substring(0, 3).toUpperCase()
    
    // Format case size (just use as is since it's already a number)
    const size = caseSize
    
    // Combine all parts with hyphens: [Unique ID]-[CAT]-[NAME]-[SIZE]
    return `${userUniqueId}-${categoryAbbrev}-${nameAbbrev}-${size}`
  }, [productName, category, caseSize, userUniqueId])
  
  // Auto-generate SKU when fields change
  useEffect(() => {
    if (productName && category && caseSize && userUniqueId) {
      const generatedSku = generateSku()
      if (generatedSku) {
        setSku(generatedSku)
      }
    }
  }, [generateSku, productName, category, caseSize, userUniqueId])
  
  // Update UPC field when initialUpc changes or modal opens
  useEffect(() => {
    if (isOpen && initialUpc) {
      setUpc(initialUpc)
    }
  }, [isOpen, initialUpc])
  
  // Fetch distributor ID and user info when component mounts
  useEffect(() => {
    async function fetchDistributorId() {
      if (!user) return
      
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      
      try {
        // First get the distributor ID
        const { data: distributorData, error: distributorError } = await supabase
          .from('distributors')
          .select('id')
          .eq('user_id', user.id)
          .single()
        
        if (distributorError) {
          console.error('Error fetching distributor ID:', distributorError)
          return
        }
        
        if (distributorData) {
          setDistributorId(distributorData.id)
          
          // Now get the user details including unique_identifier and business_name
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('unique_identifier, business_name')
            .eq('id', user.id)
            .single()
          
          if (userError) {
            console.error('Error fetching user details:', userError)
            return
          }
          
          if (userData) {
            setUserUniqueId(userData.unique_identifier || '')
            setBusinessName(userData.business_name || '')
          }
        }
      } catch (err) {
        console.error('Error in fetchDistributorId:', err)
      }
    }
    
    fetchDistributorId()
  }, [user])
  
  // Handle image change via file input
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImageFile(e.target.files[0])
    }
  }
  
  // Process the image file (used by both drag-drop and file input)
  const processImageFile = (file: File) => {
    setImageFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }
  
  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith('image/')) {
        processImageFile(file)
      }
    }
  }
  
  // Format price for display and input handling
  const formatPriceForDisplay = (value: string): string => {
    if (!value) return ''
    
    // Convert to number and format as dollars and cents
    const numericValue = parseInt(value, 10)
    if (isNaN(numericValue)) return ''
    
    // Format as currency with 2 decimal places
    return (numericValue / 100).toFixed(2)
  }
  
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Get the raw input value
    const inputValue = e.target.value
    
    // Remove all non-digit characters
    const numericValue = inputValue.replace(/\D/g, '')
    
    // Store the raw numeric value
    setPrice(numericValue)
  }
  
  // Handle UPC input to ensure it's only digits and maximum 12 characters
  const handleUpcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    
    // Remove any non-digit characters
    const cleanValue = newValue.replace(/\D/g, '')
    
    // Ensure maximum 12 digits
    const trimmedValue = cleanValue.slice(0, 12)
    
    setUpc(trimmedValue)
  }
  
  // Dedicated paste handler to ensure we capture the full pasted value
  const handleUpcPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData('text')
    setUpc(pastedText.replace(/\D/g, '').slice(0, 12))
    e.preventDefault() // Prevent default paste behavior
  }
  
  // Price formatting is handled by the UI display logic
  
  const resetForm = () => {
    setProductName('')
    setProductDescription('')
    setPrice('')
    setCaseSize('')
    setCategory('')
    setSku('')
    // Don't reset UPC if initialUpc is provided
    if (!initialUpc) {
      setUpc('')
    } else {
      setUpc(initialUpc)
    }
    setImageFile(null)
    setImagePreview(null)
    setError(null)
    setSuccess(false)
    setIsSubmitting(false)
    setIsDragging(false)
    setCreatedProductId('')
    setCreatedProductName('')
    setShowInitialBatchModal(false)
  }
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (isSubmitting) return
    
    // Reset states
    setError(null)
    setIsSubmitting(true)
    
    try {
      // Validate required fields
      if (!productName || !category || !price || !caseSize || !sku) {
        throw new Error('Please fill in all required fields')
      }
      
      // Create Supabase client
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      
      // Define imageUrl variable at the start
      let imageUrl: string | null = null
      
      // Handle image upload
      if (imageFile) {
        try {
          // Generate unique file path with timestamp and random ID
          const timestamp = new Date().getTime()
          const randomId = Math.random().toString(36).substring(2, 10)
          const fileExt = imageFile.name.split('.').pop()
          const filePath = `${timestamp}-${randomId}.${fileExt}`
          
          // Upload the image to Supabase Storage
          const { error: uploadError } = await supabase.storage
            .from('products')
            .upload(filePath, imageFile)
            
          if (uploadError) throw uploadError
          
          // Get the public URL for the uploaded image
          const { data: { publicUrl } } = supabase.storage
            .from('products')
            .getPublicUrl(filePath)
            
          console.log('Public URL:', publicUrl)
          imageUrl = publicUrl
        } catch (uploadErr: unknown) {
          const uploadError = uploadErr instanceof Error ? uploadErr : new Error('Unknown upload error')
          console.error('Image upload error:', uploadError)
          // Don't throw an error here, just use a placeholder image
          imageUrl = `https://source.unsplash.com/random/300x300/?${encodeURIComponent(productName.toLowerCase())}`
          console.log('Using placeholder image instead:', imageUrl)
        }
      }
      
      // Add product to database
      try {
        // Get the category_id based on the selected category name
        const { data: categoryData, error: categoryError } = await supabase
          .from('product_categories')
          .select('id')
          .eq('name', category)
          .single()
          
        if (categoryError) {
          console.error('Error fetching category ID:', categoryError)
          throw new Error(`Failed to find category: ${categoryError.message}`)
        }
        
        const categoryId = categoryData?.id
        
        if (!categoryId) {
          throw new Error('Category ID not found')
        }
        
        // Add product to distributor_products table
        const { data, error: insertError } = await supabase
          .from('distributor_products')
          .insert({
            name: productName,
            description: productDescription,
            price: parseFloat(price),
            case_size: parseInt(caseSize),
            stock_quantity: 0, // Default to 0, inventory will be added separately
            category_id: categoryId,
            image_url: imageUrl || null,
            distributor_id: distributorId,
            sku: sku,
            upc: upc,
            created_at: new Date().toISOString()
          })
          .select()
          
        if (insertError) {
          console.error('Database insert error:', insertError)
          throw new Error(`Failed to add product to database: ${insertError.message}`)
        }
        
        if (data && data.length > 0) {
          // Save product info for the initial batch modal
          setCreatedProductId(data[0].id)
          setCreatedProductName(productName)
          
          // Success!
          setSuccess(true)
          // Show the success message for a moment before transitioning
          setTimeout(() => {
            setShowInitialBatchModal(true)
          }, 1200)
        }
      } catch (dbErr: unknown) {
        const error = dbErr instanceof Error ? dbErr : new Error('Unknown database error')
        console.error('Database operation error:', error)
        setError(error.message || 'Failed to add product')
      }
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      console.error('Error adding product:', error)
      setError(error.message || 'Failed to add product')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="relative">
      <AnimatePresence>
        {isOpen && !showInitialBatchModal && (
          <motion.div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-gray-800 text-xl font-semibold">Add New Product</h2>
                <button
                  onClick={onClose}
                  className="cursor-pointer text-gray-400 hover:text-gray-600"
                >
                  <CloseIcon size={20} />
                </button>
              </div>
              
              <form className="p-6" onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Image
                    </label>
                    <div 
                      className={`border-2 border-dashed rounded-lg p-4 transition-colors ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                      onDragEnter={handleDragEnter}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {imagePreview ? (
                        <div className="relative w-full h-48">
                          <Image
                            src={imagePreview}
                            alt="Preview"
                            width={400}
                            height={192}
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setImagePreview(null)
                              setImageFile(null)
                            }}
                            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100"
                          >
                            <CloseIcon size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <UploadIcon
                            size={32}
                            className={`mx-auto mb-3 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`}
                          />
                          <div className="text-sm text-gray-600 font-medium mb-1">
                            {isDragging ? 'Drop your image here' : 'Drag and drop your image here'}
                          </div>
                          <div className="text-xs text-gray-500">
                            or{' '}
                            <label className="text-blue-600 hover:text-blue-500 cursor-pointer">
                              browse files
                              <input
                                ref={fileInputRef}
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageChange}
                              />
                            </label>
                          </div>
                          <div className="mt-2 text-xs text-gray-400">
                            Supported formats: JPG, PNG, GIF
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Product Name and Category side by side */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Name
                      </label>
                      <input
                        type="text"
                        className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400"
                        placeholder="Enter product name"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-md"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                      >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400"
                      placeholder="Enter product description (max 70 characters)"
                      value={productDescription}
                      onChange={(e) => setProductDescription(e.target.value.slice(0, 70))}
                      maxLength={70}
                    />
                    <div className="flex justify-end mt-1">
                      <span className={`text-xs ${productDescription.length >= 70 ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
                        {productDescription.length}/70 characters
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      UPC
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-l-md placeholder-gray-400"
                        placeholder="Enter 12-digit UPC"
                        value={upc}
                        onChange={handleUpcChange}
                        onPaste={handleUpcPaste}
                        maxLength={12}
                        inputMode="numeric"
                        pattern="\d{12}"
                        required
                      />
                      <button
                        type="button"
                        className="flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-600 rounded-r-md hover:bg-gray-200 border border-l-0 border-gray-300 transition-colors cursor-pointer"
                        onClick={() => setIsScannerOpen(true)}
                        title="Scan Barcode"
                      >
                        <BarcodeIcon size={18} />
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Must be exactly 12 digits or scan using the barcode scanner</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price per Case
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          <DollarSign size={16} />
                        </span>
                        <input
                          type="text"
                          id="price-input"
                          name="price"
                          placeholder="0.00"
                          value={price ? formatPriceForDisplay(price) : ''}
                          onChange={handlePriceChange}
                          className="text-gray-700 w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Case Size
                      </label>
                      <input
                        type="number"
                        className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400"
                        placeholder="Enter quantity per case"
                        value={caseSize}
                        onChange={(e) => setCaseSize(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
                
                {error && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                    {error}
                  </div>
                )}
                
                {success && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm">
                    Product added successfully!
                  </div>
                )}
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      'Add Product'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Barcode Scanner */}
      <BarcodeScanner
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onBarcodeScanned={(barcode) => {
          // Handle the scanned barcode
          console.log('Scanned barcode:', barcode);
          setUpc(barcode.replace(/\D/g, '').slice(0, 12)); // Remove non-digits and limit to 12 digits
          setIsScannerOpen(false); // Close the scanner
        }}
      />
      
      {/* Initial Batch Modal */}
      <InitialBatchModal
        isOpen={showInitialBatchModal}
        onClose={() => {
          setShowInitialBatchModal(false)
          resetForm()
          onClose()
        }}
        productId={createdProductId}
        productName={createdProductName}
      />
    </div>
  )
}

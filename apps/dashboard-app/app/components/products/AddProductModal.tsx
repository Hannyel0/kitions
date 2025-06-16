import React, { useState, FormEvent, useEffect, useRef, useCallback } from 'react'
import { X as CloseIcon, Upload as UploadIcon, Loader2, DollarSign, Barcode as BarcodeIcon, Package, Tag, FileText, Camera, Sparkles } from 'lucide-react'
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
  

  
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '') // Remove non-digit characters

    if (raw === '') {
      setPrice('')
      return
    }

    const value = (parseInt(raw, 10) / 100).toFixed(2) // Convert cents to dollars
    setPrice(value) // Set properly formatted price
  }
  
  // Handle price paste to prevent non-numeric values
  const handlePricePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('Text')
    if (!/^\d+$/.test(pasted.replace(/\D/g, ''))) {
      e.preventDefault()
    }
  }
  
  // Handle UPC input to ensure it's only digits and maximum 12 characters
  const handleUpcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Get the input value
    const inputValue = e.target.value
    
    // Remove any non-digit characters
    const cleanValue = inputValue.replace(/\D/g, '')
    
    // Limit to 12 digits
    const truncatedValue = cleanValue.slice(0, 12)
    
    setUpc(truncatedValue)
  }
  
  // Dedicated paste handler to ensure we capture the full pasted value
  const handleUpcPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('Text')
    const cleanValue = pasted.replace(/\D/g, '').slice(0, 12)
    setUpc(cleanValue)
  }
  
  const resetForm = () => {
    setProductName('')
    setProductDescription('')
    setPrice('')
    setCaseSize('')
    setCategory('')
    setSku('')
    setUpc('')
    setImageFile(null)
    setImagePreview(null)
    setError(null)
    setSuccess(false)
    setIsSubmitting(false)
    setIsDragging(false)
    setShowInitialBatchModal(false)
    setCreatedProductId('')
    setCreatedProductName('')
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
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-3xl max-h-[90vh] overflow-hidden"
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -50, opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              {/* Header */}
              <div className="bg-gray-50/50 border-b border-gray-100 p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-[#8982cf]/10 rounded-xl">
                      <Sparkles className="w-5 h-5 text-[#8982cf]" />
                    </div>
                    <div>
                      <h2 className="text-gray-900 text-xl font-semibold">Add New Product</h2>
                      <p className="text-gray-500 text-sm">Create a new product for your catalog</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
                  >
                    <CloseIcon size={20} />
                  </button>
                </div>
              </div>
              
              {/* Scrollable content */}
              <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 180px)' }}>
                <form className="p-6" onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    {/* Image Upload Section */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="space-y-3"
                    >
                      <div className="flex items-center space-x-2">
                        <Camera className="w-4 h-4 text-[#8982cf]" />
                        <label className="text-sm font-medium text-gray-700">Product Image</label>
                      </div>
                      <div 
                        className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-300 cursor-pointer group ${
                          isDragging 
                            ? 'border-[#8982cf] bg-[#8982cf]/5 scale-[1.01]' 
                            : 'border-gray-200 hover:border-[#8982cf]/50 hover:bg-gray-50/50'
                        }`}
                        onDragEnter={handleDragEnter}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {imagePreview ? (
                          <div className="relative w-full h-48 rounded-lg overflow-hidden">
                            <Image
                              src={imagePreview}
                              alt="Preview"
                              fill
                              className="object-cover"
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                setImagePreview(null)
                                setImageFile(null)
                              }}
                              className="absolute top-3 right-3 p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200"
                            >
                              <CloseIcon size={16} className="text-gray-600" />
                            </button>
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <div className={`mx-auto mb-4 p-4 rounded-xl transition-all duration-300 ${
                              isDragging 
                                ? 'bg-[#8982cf]/20 text-[#8982cf] scale-105' 
                                : 'bg-gray-100 text-gray-400 group-hover:bg-[#8982cf]/10 group-hover:text-[#8982cf]'
                            }`}>
                              <UploadIcon size={28} />
                            </div>
                            <div className="space-y-2">
                              <div className={`text-base font-medium transition-colors ${
                                isDragging ? 'text-[#8982cf]' : 'text-gray-700 group-hover:text-[#8982cf]'
                              }`}>
                                {isDragging ? 'Drop your image here' : 'Upload Product Image'}
                              </div>
                              <div className="text-sm text-gray-500">
                                Drag and drop your image here, or{' '}
                                <span className="text-[#8982cf] font-medium">browse files</span>
                              </div>
                              <div className="text-xs text-gray-400">
                                Supports JPG, PNG, GIF up to 10MB
                              </div>
                            </div>
                            <input
                              ref={fileInputRef}
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={handleImageChange}
                            />
                          </div>
                        )}
                      </div>
                    </motion.div>
                    
                    {/* Basic Information */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center space-x-2">
                        <Package className="w-4 h-4 text-[#8982cf]" />
                        <h3 className="text-sm font-medium text-gray-700">Basic Information</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-gray-600">Product Name *</label>
                          <input
                            type="text"
                            className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8982cf]/20 focus:border-[#8982cf] transition-all duration-200"
                            placeholder="Enter product name"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-gray-600">Category *</label>
                          <select
                            className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#8982cf]/20 focus:border-[#8982cf] transition-all duration-200"
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
                      
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <label className="text-xs font-medium text-gray-600">Description</label>
                        </div>
                        <textarea
                          rows={3}
                          className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8982cf]/20 focus:border-[#8982cf] transition-all duration-200 resize-none"
                          placeholder="Enter product description (max 70 characters)"
                          value={productDescription}
                          onChange={(e) => setProductDescription(e.target.value.slice(0, 70))}
                          maxLength={70}
                        />
                        <div className="flex justify-end">
                          <span className={`text-xs transition-colors ${
                            productDescription.length >= 70 
                              ? 'text-red-500 font-medium' 
                              : productDescription.length >= 60 
                                ? 'text-amber-500' 
                                : 'text-gray-400'
                          }`}>
                            {productDescription.length}/70 characters
                          </span>
                        </div>
                      </div>
                    </motion.div>
                    
                    {/* Product Details */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center space-x-2">
                        <Tag className="w-4 h-4 text-[#8982cf]" />
                        <h3 className="text-sm font-medium text-gray-700">Product Details</h3>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-600">UPC Code *</label>
                        <div className="flex rounded-lg overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-[#8982cf]/20 focus-within:border-[#8982cf] transition-all duration-200">
                          <input
                            type="text"
                            className="flex-1 px-3 py-2.5 bg-white text-gray-900 placeholder-gray-400 focus:outline-none"
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
                            className="px-3 py-2.5 bg-gray-50 text-gray-500 hover:bg-[#8982cf]/10 hover:text-[#8982cf] transition-all duration-200"
                            onClick={() => setIsScannerOpen(true)}
                            title="Scan Barcode"
                          >
                            <BarcodeIcon size={18} />
                          </button>
                        </div>
                        <p className="text-xs text-gray-400">Must be exactly 12 digits or scan using the barcode scanner</p>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-gray-600">Price per Case *</label>
                          <div className="relative">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                              <DollarSign size={16} />
                            </div>
                            <input
                              type="text"
                              id="price-input"
                              name="price"
                              inputMode="numeric"
                              placeholder="0.00"
                              value={price}
                              onChange={handlePriceChange}
                              onPaste={handlePricePaste}
                              className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8982cf]/20 focus:border-[#8982cf] transition-all duration-200"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-gray-600">Case Size *</label>
                          <input
                            type="number"
                            className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8982cf]/20 focus:border-[#8982cf] transition-all duration-200"
                            placeholder="Enter quantity per case"
                            value={caseSize}
                            onChange={(e) => setCaseSize(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </motion.div>
                    
                    {/* Status Messages */}
                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg"
                        >
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <span className="text-sm">{error}</span>
                          </div>
                        </motion.div>
                      )}
                      
                      {success && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg"
                        >
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm">Product added successfully!</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </form>
              </div>
              
              {/* Footer with actions - Fixed at bottom */}
              <div className="p-5 bg-gray-50/30 border-t border-gray-100 flex-shrink-0">
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="px-5 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-50 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    onClick={handleSubmit}
                    className="px-6 py-2.5 bg-[#8982cf] text-white rounded-lg text-sm font-medium hover:bg-[#8982cf]/90 disabled:opacity-50 flex items-center space-x-2 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Adding...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} />
                        <span>Add Product</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
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

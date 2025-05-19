import React, { useState, FormEvent, useEffect } from 'react'
import { X as CloseIcon, Upload as UploadIcon, Loader2, DollarSign } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'
import { useAuth } from '@/app/providers/auth-provider'

interface AddProductModalProps {
  isOpen: boolean
  onClose: () => void
  categories: string[]
}

export function AddProductModal({
  isOpen,
  onClose,
  categories,
}: AddProductModalProps) {
  // Form state
  const [productName, setProductName] = useState('')
  const [productDescription, setProductDescription] = useState('')
  const [price, setPrice] = useState('')
  const [caseSize, setCaseSize] = useState('')
  const [category, setCategory] = useState('')
  const [sku, setSku] = useState('')
  const [upc, setUpc] = useState('')
  const [stockQuantity, setStockQuantity] = useState('0')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  
  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [distributorId, setDistributorId] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [userUniqueId, setUserUniqueId] = useState('')
  const [businessName, setBusinessName] = useState('')
  
  // Get current user
  const { user } = useAuth()
  
  // Function to generate SKU
  const generateSku = () => {
    if (!productName || !category || !caseSize || !userUniqueId) return ''
    
    // Get category abbreviation (first 3 letters uppercase)
    const categoryAbbrev = category.substring(0, 3).toUpperCase()
    
    // Get product name abbreviation (first 3 letters uppercase)
    const nameAbbrev = productName.substring(0, 3).toUpperCase()
    
    // Format case size (just use as is since it's already a number)
    const size = caseSize
    
    // Combine all parts with hyphens: [Unique ID]-[CAT]-[NAME]-[SIZE]
    return `${userUniqueId}-${categoryAbbrev}-${nameAbbrev}-${size}`
  }
  
  // Auto-generate SKU when fields change
  useEffect(() => {
    if (productName && category && caseSize && userUniqueId) {
      const generatedSku = generateSku()
      if (generatedSku) {
        setSku(generatedSku)
      }
    }
  }, [productName, category, caseSize, userUniqueId])
  
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
        console.error('Failed to fetch distributor ID or user details:', err)
      }
    }
    
    fetchDistributorId()
  }, [user])
  
  // Initialize Supabase client
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  
  if (!isOpen) return null
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processImageFile(file)
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
    setIsDragging(true)
  }
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    
    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      const file = files[0]
      // Check if the file is an image
      if (file.type.match('image.*')) {
        processImageFile(file)
      } else {
        setError('Please drop an image file')
        setTimeout(() => setError(null), 3000)
      }
    }
  }
  
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '')
    const dollars = (parseInt(raw || '0', 10) / 100).toFixed(2)
    setPrice(dollars)
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
  
  // Format price for display
  const formatPrice = (price: string) => {
    if (!price) return ''
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(parseFloat(price))
  }
  
  const resetForm = () => {
    setProductName('')
    setProductDescription('')
    setPrice('')
    setCaseSize('')
    setCategory('')
    setSku('')
    setUpc('')
    setStockQuantity('0')
    setImageFile(null)
    setImagePreview(null)
    setError(null)
    setSuccess(false)
  }
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    try {
      // Validate form
      if (!productName) throw new Error('Product name is required')
      if (!category) throw new Error('Category is required')
      if (!price || isNaN(parseFloat(price))) throw new Error('Valid price is required')
      if (!caseSize || isNaN(parseInt(caseSize))) throw new Error('Valid case size is required')
      if (!distributorId) throw new Error('Distributor ID not found. Please make sure you are logged in as a distributor.')
      
      // Validate UPC if provided
      if (upc && (!/^\d{12}$/.test(upc))) {
        throw new Error('UPC must be exactly 12 digits')
      }
      
      let imageUrl = ''
      
      // Upload image if provided
      if (imageFile) {
        try {
          // Generate a unique file name
          const fileExt = imageFile.name.split('.').pop()
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
          const filePath = `${fileName}`
          
          console.log('Uploading image to storage bucket...')
          
          // Upload the file to the products bucket
          const { error: uploadError, data } = await supabase.storage
            .from('products')
            .upload(filePath, imageFile, {
              cacheControl: '3600',
              upsert: false
            })
            
          if (uploadError) {
            console.error('Error uploading file:', uploadError)
            throw new Error(`Failed to upload image: ${uploadError.message}`)
          }
          
          console.log('Image uploaded successfully:', data)
          
          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('products')
            .getPublicUrl(filePath)
            
          console.log('Public URL:', publicUrl)
          imageUrl = publicUrl
        } catch (uploadErr: any) {
          console.error('Image upload error:', uploadErr)
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
        const { data: productData, error: insertError } = await supabase
          .from('distributor_products')
          .insert({
            name: productName,
            description: productDescription,
            price: parseFloat(price),
            case_size: parseInt(caseSize),
            stock_quantity: parseInt(stockQuantity),
            category_id: categoryId,
            image_url: imageUrl || null,
            distributor_id: distributorId,
            sku: sku,
            upc: upc,
            created_at: new Date().toISOString()
          })
          .select('id')
          
        if (insertError) {
          console.error('Database insert error:', insertError)
          throw new Error(`Failed to add product to database: ${insertError.message}`)
        }
      } catch (dbErr: any) {
        console.error('Database operation error:', dbErr)
        throw new Error(`Database error: ${dbErr.message}`)
      }
      
      // Success!
      setSuccess(true)
      setTimeout(() => {
        resetForm()
        onClose()
      }, 1500)
      
    } catch (err: any) {
      console.error('Error adding product:', err)
      // Provide more detailed error information
      const errorMessage = err.message || 'Failed to add product'
      console.log('Full error object:', JSON.stringify(err, null, 2))
      setError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
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
              >
                {imagePreview ? (
                  <div className="relative w-full h-48">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
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
            <div className="grid grid-cols-2 gap-6">
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
                placeholder="Enter product description"
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                UPC
              </label>
              <input
                type="text"
                className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400"
                placeholder="Enter 12-digit UPC"
                value={upc}
                onChange={handleUpcChange}
                onPaste={handleUpcPaste}
                maxLength={12}
                inputMode="numeric"
                pattern="\d{12}"
                required
              />
              <p className="mt-1 text-xs text-gray-500">Must be exactly 12 digits</p>
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
                    placeholder="1299"
                    value={price ? price : ''}
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
            
            <div className="bg-gray-50 rounded-lg p-4 mt-4">
              <h3 className="text-sm font-medium mb-3">Inventory Information</h3>
              <div>
                <label className="block text-xs text-gray-700 mb-1">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
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
      </div>
    </div>
  )
}

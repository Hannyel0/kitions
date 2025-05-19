import React, { useState, FormEvent, useEffect } from 'react'
import { X as CloseIcon, Upload as UploadIcon, Loader2, DollarSign } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'
import { useAuth } from '@/app/providers/auth-provider'

interface Product {
  id: string
  name: string
  description: string
  price: number
  case_size: number
  category_id: string
  category?: string
  sku: string
  upc: string
  stock_quantity: number
  image_url?: string
  image?: string
}

interface EditProductModalProps {
  isOpen: boolean
  onClose: () => void
  categories: string[]
  product: Product | null
}

export function EditProductModal({
  isOpen,
  onClose,
  categories,
  product
}: EditProductModalProps) {
  // Form state
  const [productName, setProductName] = useState(product?.name || '')
  const [productDescription, setProductDescription] = useState(product?.description || '')
  const [price, setPrice] = useState(product?.price?.toString() || '')
  const [caseSize, setCaseSize] = useState(product?.case_size?.toString() || '')
  const [category, setCategory] = useState('')
  const [sku, setSku] = useState(product?.sku || '')
  const [upc, setUpc] = useState(product?.upc || '')
  const [stockQuantity, setStockQuantity] = useState(product?.stock_quantity?.toString() || '0')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [currentImageUrl, setCurrentImageUrl] = useState(product?.image_url || '')
  const [imagePreview, setImagePreview] = useState<string | null>(product?.image_url || null)
  
  // Additional state for SKU generation
  const [userUniqueId, setUserUniqueId] = useState('')
  const [businessName, setBusinessName] = useState('')
  
  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  // Initialize Supabase client
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  
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
  
  // Fetch user data for SKU generation
  useEffect(() => {
    async function fetchUserData() {
      if (!user) return
      
      try {
        // Get the user details including unique_identifier and business_name
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
      } catch (err) {
        console.error('Failed to fetch user details:', err)
      }
    }
    
    fetchUserData()
  }, [user, supabase])
  
  // Load product data when product changes
  useEffect(() => {
    if (product) {
      setProductName(product.name || '')
      setProductDescription(product.description || '')
      // Format price to always show 2 decimal places if it exists
      setPrice(product.price ? product.price.toFixed(2) : '')
      setCaseSize(product.case_size?.toString() || '')
      setStockQuantity(product.stock_quantity?.toString() || '')
      setCategory(product.category || '')
      setSku(product.sku || '')
      setUpc(product.upc || '')
      setCurrentImageUrl(product.image || '')
      setImagePreview(product.image || null)
    }
  }, [product])
  
  if (!isOpen || !product) return null
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
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
    if (product) {
      setProductName(product.name || '')
      setProductDescription(product.description || '')
      setPrice(product.price ? product.price.toFixed(2) : '')
      setCaseSize(product.case_size?.toString() || '')
      setStockQuantity(product.stock_quantity?.toString() || '')
      setCategory(product.category || '')
      setSku(product.sku || '')
      setUpc(product.upc || '')
      setCurrentImageUrl(product.image || '')
      setImagePreview(product.image || null)
    }
    setImageFile(null)
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
      if (!stockQuantity || isNaN(parseInt(stockQuantity))) throw new Error('Valid stock quantity is required')
      
      // Validate UPC if provided
      if (upc && (!/^\d{12}$/.test(upc))) {
        throw new Error('UPC must be exactly 12 digits')
      }
      
      let imageUrl = currentImageUrl
      
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
            console.error('Error uploading image:', uploadError)
            throw new Error(`Error uploading image: ${uploadError.message}`)
          }
          
          // Get the public URL for the uploaded image
          const { data: { publicUrl } } = supabase.storage
            .from('products')
            .getPublicUrl(filePath)
            
          imageUrl = publicUrl
          console.log('Image uploaded successfully:', publicUrl)
        } catch (err: any) {
          console.error('Image upload error:', err)
          throw new Error(`Image upload failed: ${err.message}`)
        }
      }
      
      // Get category ID
      const { data: categoryData, error: categoryError } = await supabase
        .from('product_categories')
        .select('id')
        .eq('name', category)
        .single()
        
      if (categoryError) {
        console.error('Error fetching category:', categoryError)
        throw new Error(`Error fetching category: ${categoryError.message}`)
      }
      
      if (!categoryData) {
        throw new Error('Category not found')
      }
      
      // Update product in database
      const { data: productData, error: updateError } = await supabase
        .from('distributor_products')
        .update({
          name: productName,
          description: productDescription,
          price: parseFloat(price),
          case_size: parseInt(caseSize),
          stock_quantity: parseInt(stockQuantity),
          category_id: categoryData.id,
          image_url: imageUrl, // Using image_url to match the actual column name in the database
          sku: sku,
          upc: upc
          // No need to set updated_at - it's updated automatically by the database trigger
        })
        .eq('id', product.id)
        
      if (updateError) {
        console.error('Error updating product:', updateError)
        throw new Error(`Error updating product: ${updateError.message}`)
      }
      
      setSuccess(true)
      
      // Close modal after a short delay
      setTimeout(() => {
        onClose()
      }, 1500)
    } catch (err: any) {
      console.error('Error in form submission:', err)
      setError(err.message || 'An error occurred while updating the product')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="fixed inset-0  bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Edit Product</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <CloseIcon size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Image
              </label>
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 border border-gray-300 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Product preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">No image</span>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="product-image"
                    className="cursor-pointer px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center"
                  >
                    <UploadIcon size={16} className="mr-2" />
                    Upload Image
                  </label>
                  <input
                    id="product-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    JPG, PNG or GIF, max 5MB
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  className=" text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400"
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
            <div className="grid grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SKU
                </label>
                <div className="flex space-x-2">
                  <div className="relative flex-grow">
                    <input
                      type="text"
                      className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400"
                      placeholder="Enter SKU or generate"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                    />

                  </div>
                  <button
                    type="button"
                    onClick={() => setSku(generateSku())}
                    className="cursor-pointer whitespace-nowrap px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    disabled={!productName || !category || !caseSize || !businessName || !userUniqueId}
                  >
                    Generate SKU
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Format: {userUniqueId || 'ID'}-CAT-PRD-{caseSize || 'SZ'}
                </p>
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
                />
                <p className="mt-1 text-xs text-gray-500">Must be exactly 12 digits</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6 mt-6">
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
                    id="edit-price-input"
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
            <div className="grid grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400"
                  placeholder="Enter current stock"
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
              Product updated successfully!
            </div>
          )}
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Reset
            </button>
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
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

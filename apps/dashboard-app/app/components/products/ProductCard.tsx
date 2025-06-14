import React, { useState, useRef, useEffect } from 'react'
import { MoreVertical as MoreVerticalIcon, Edit as EditIcon, Trash as TrashIcon, Package, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'
import { DeleteConfirmationModal } from './DeleteConfirmationModal'
import Link from 'next/link'
import Image from 'next/image'
import { Product } from './types'
import { motion, AnimatePresence } from 'framer-motion'

interface ProductCardProps {
  product: Product
  onEdit?: (product: Product) => void
  onDelete?: (productId: string) => void
  onRefresh?: () => void
}

export function ProductCard({ product, onEdit, onDelete, onRefresh }: ProductCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleEditClick = () => {
    if (onEdit) {
      onEdit(product)
    }
    setIsMenuOpen(false)
  }

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true)
    setIsMenuOpen(false)
  }
  
  const confirmDelete = async () => {
    setIsDeleting(true)
    setDeleteError(null)
      
      try {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
        
        // Delete the product image from storage if it exists and is not a fallback image
        if (product.image && !product.image.includes('unsplash.com') && !product.image.startsWith('/')) {
          try {
            console.log('Image URL to delete:', product.image)
            
            // First, query the database to get the actual image_url value
            const { data: productData, error: fetchError } = await supabase
              .from('distributor_products')
              .select('image_url')
              .eq('id', product.id)
              .single()
            
            if (fetchError) {
              console.error('Error fetching product image URL:', fetchError)
              // Continue with the product.image value we already have
            } else {
              console.log('Retrieved product data:', productData)
            }
            
            // Format is typically: https://<domain>/storage/v1/object/public/products/<filename>
            let filePath = null
            // Use the fetched image URL if available, otherwise use the one from props
            const imageUrl = (productData && productData.image_url) || product.image
            
            // Log the image URL we're working with
            console.log('Processing image URL for deletion:', imageUrl)
            
            // Method 1: Extract filename using regex
            const filenameMatch = imageUrl ? imageUrl.match(/[^/]+$/) : null;
            if (filenameMatch && filenameMatch[0]) {
              filePath = filenameMatch[0].split('?')[0] // Remove query parameters
              console.log('Method 1 - Extracted filename:', filePath)
            }
            
            // Method 2: Try to get the filename directly from the URL structure
            if (!filePath && imageUrl && imageUrl.includes('/products/')) {
              const parts = imageUrl.split('/products/')
              if (parts.length > 1) {
                filePath = parts[1].split('?')[0] // Remove query parameters
                console.log('Method 2 - Extracted filename:', filePath)
              }
            }
            
            // Method 3: Try parsing as URL and getting the last path segment
            if (!filePath && imageUrl) {
              try {
                const parsedUrl = new URL(imageUrl)
                const pathSegments = parsedUrl.pathname.split('/')
                filePath = pathSegments[pathSegments.length - 1].split('?')[0] // Get last segment and remove query params
                console.log('Method 3 - Extracted filename:', filePath)
              } catch (e) {
                console.error('Failed to parse URL:', e)
              }
            }
            
            if (filePath) {
              console.log('Final file path to delete:', filePath)
              
              // Delete the file from the products bucket
              const { error: storageError, data } = await supabase.storage
                .from('products')
                .remove([filePath])
              
              console.log('Storage deletion response:', { error: storageError, data })
              
              if (storageError) {
                console.error('Error deleting image from storage:', storageError)
                // Continue with product deletion even if image deletion fails
              } else {
                console.log('Image deleted successfully from storage')
              }
            } else {
              console.warn('Could not extract file path from image URL:', imageUrl)
            }
          } catch (imageErr) {
            console.error('Error handling image deletion:', imageErr)
            // Continue with product deletion even if image URL parsing fails
          }
        }
        
        // Delete the product from the database
        const { error } = await supabase
          .from('distributor_products')
          .delete()
          .eq('id', product.id)
        
        if (error) throw error
        
        // Call the onDelete callback if provided
        if (onDelete) {
          onDelete(product.id)
        }
        
        // Refresh the product list
        if (onRefresh) {
          onRefresh()
        }
      } catch (err: unknown) {
        const error = err instanceof Error ? err : new Error('Unknown error')
        console.error('Error deleting product:', error)
        setDeleteError(error.message || 'Failed to delete product')
      } finally {
        setIsDeleting(false)
        setIsDeleteModalOpen(false)
      }
    }

  // Get stock status with enhanced styling
  const getStockStatus = () => {
    if (product.stock_quantity <= 0) {
      return {
        label: 'Out of Stock',
        color: 'bg-red-50 text-red-600 border-red-200',
        icon: <AlertTriangle size={12} className="text-red-500" />,
        dotColor: 'bg-red-500'
      }
    }
    
    if (product.stock_quantity <= 10) {
      return {
        label: 'Low Stock',
        color: 'bg-amber-50 text-amber-600 border-amber-200',
        icon: <AlertTriangle size={12} className="text-amber-500" />,
        dotColor: 'bg-amber-500'
      }
    }
    
    return {
      label: 'In Stock',
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      icon: <CheckCircle size={12} className="text-emerald-500" />,
      dotColor: 'bg-emerald-500'
    }
  }

  const stockStatus = getStockStatus()
  
  return (
    <motion.div 
      className="group relative bg-white/80 backdrop-blur-sm border border-white/50 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
      whileHover={{ y: -8, scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-indigo-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <Link href={`/distributor/products/${product.id}`} className="block relative z-10">
        {/* Image Section */}
        <div className="relative h-56 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
          {product.image ? (
            <div className="relative w-full h-full">
              <Image
                src={product.image}
                alt={product.name}
                width={400}
                height={224}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Image overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50"></div>
              <div className="relative p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50">
                <Package className="h-12 w-12 text-gray-400" />
              </div>
            </div>
          )}
          
          {/* Stock Status Badge */}
          <div className="absolute top-4 left-4">
            <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border backdrop-blur-sm ${stockStatus.color}`}>
              <div className={`w-2 h-2 rounded-full ${stockStatus.dotColor} animate-pulse`}></div>
              <span className="text-xs font-medium">{stockStatus.label}</span>
            </div>
          </div>
          
          {/* Category Badge */}
          <div className="absolute top-4 right-4">
            <div className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium rounded-full border border-white/50 shadow-sm">
              {product.category}
            </div>
          </div>
        </div>
        
        {/* Content Section */}
        <div className="p-6 relative">
          {/* Product Name & Description */}
          <div className="mb-4">
            <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors duration-300">
              {product.name}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
              {product.description || 'No description available'}
            </p>
          </div>
          
          {/* Price Section */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-sm text-gray-500">
                / case of {product.case_size}
              </span>
            </div>
            <div className="flex items-center space-x-1 text-gray-500">
              <TrendingUp size={14} />
              <span className="text-xs font-medium">{product.stock_quantity} units</span>
            </div>
          </div>
          
          {/* SKU */}
          <div className="text-xs text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded-lg inline-block">
            SKU: {product.sku}
          </div>
        </div>
      </Link>
      
      {/* Action Menu */}
      <div className="absolute top-4 right-16 z-20" ref={menuRef}>
        <motion.button 
          className="p-2 bg-white/90 backdrop-blur-sm border border-white/50 rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 opacity-0 group-hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setIsMenuOpen(!isMenuOpen);
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <MoreVerticalIcon size={16} className="text-gray-600" />
        </motion.button>
        
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              className="absolute top-12 right-0 w-40 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/50 py-2 z-30"
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleEditClick();
                }}
                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center space-x-3 transition-colors duration-200"
              >
                <EditIcon size={14} />
                <span>Edit Product</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleDeleteClick();
                }}
                disabled={isDeleting}
                className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center space-x-3 transition-colors duration-200 disabled:opacity-50"
              >
                <TrashIcon size={14} />
                <span>{isDeleting ? 'Deleting...' : 'Delete Product'}</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Error Message */}
      <AnimatePresence>
        {deleteError && (
          <motion.div 
            className="absolute bottom-4 left-4 right-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl backdrop-blur-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            {deleteError}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        productName={product.name}
        isDeleting={isDeleting}
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
      />
    </motion.div>
  )
}

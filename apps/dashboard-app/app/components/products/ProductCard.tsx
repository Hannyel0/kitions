import React, { useState, useRef, useEffect } from 'react'
import { MoreVertical as MoreVerticalIcon, Edit as EditIcon, Trash as TrashIcon } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'
import { DeleteConfirmationModal } from './DeleteConfirmationModal'
import Link from 'next/link'
import { Product } from './types'

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
        
        // Delete the product image from storage if it exists
        if (product.image && !product.image.includes('unsplash.com') && !product.image.includes('placeholder.com')) {
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
      } catch (err: any) {
        console.error('Error deleting product:', err)
        setDeleteError(err.message || 'Failed to delete product')
      } finally {
        setIsDeleting(false)
        setIsDeleteModalOpen(false)
      }
    }
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200 relative">
      <Link href={`/distributor/products/${product.id}`} className="block">
        <div className="relative h-48 bg-gray-100">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 border border-gray-200">
              <img src="/package-open.svg" alt="Package icon" className="h-16 w-16" />
            </div>
          )}
        </div>
        
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium text-gray-900">{product.name}</h3>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                {product.description}
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <span className="text-gray-800 text-lg font-semibold">${product.price}</span>
              <span className="text-gray-500 ml-2">
                / case of {product.case_size}
              </span>
            </div>
            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
              {product.category}
            </span>
          </div>
        </div>
      </Link>
      
      {/* Menu button positioned outside the link to avoid navigation when clicking menu */}
      <div className="absolute top-2 right-2" ref={menuRef}>
        <button 
          className="cursor-pointer p-1 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 z-10"
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen(!isMenuOpen);
          }}
        >
          <MoreVerticalIcon size={16} className="text-gray-600" />
        </button>
        
        {isMenuOpen && (
          <div className="absolute top-10 right-0 w-36 bg-white rounded-md shadow-lg z-20 py-1 border border-gray-200">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEditClick();
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
            >
              <EditIcon size={14} className="mr-2" />
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteClick();
              }}
              disabled={isDeleting}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
            >
              <TrashIcon size={14} className="mr-2" />
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        )}
      </div>
      
      {deleteError && (
        <div className="m-2 p-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
          {deleteError}
        </div>
      )}
      
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        productName={product.name}
        isDeleting={isDeleting}
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}

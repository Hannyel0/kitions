'use client';

import React, { useEffect, useState, useRef } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { ArrowLeftIcon, PackageIcon, TagIcon, BarcodeIcon, AlertTriangleIcon, CheckCircleIcon, Loader2, X as CloseIcon, Edit as EditIcon } from 'lucide-react'
import Link from 'next/link'
import JsBarcode from 'jsbarcode'
import { ProductDetails } from './page'
import { EditInventoryModal } from '@/app/components/products/EditInventoryModal'
import { ProductBatches } from '@/app/components/inventory/ProductBatches'

// Barcode component that uses JsBarcode to generate a barcode from a UPC
function ProductBarcode({ upc, productId }: { upc: string, productId: string }) {
  const barcodeRef = useRef<SVGSVGElement>(null);
  const [isValid, setIsValid] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedUpc, setEditedUpc] = useState(upc);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  
  // Validate UPC format (must be exactly 12 digits)
  const isValidUPC = (code: string) => {
    return /^\d{12}$/.test(code);
  };
  
  // Handle UPC input to ensure it's only digits and maximum 12 characters
  const handleUpcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Get the input value
    const inputValue = e.target.value;
    
    // Remove any non-digit characters
    const cleanValue = inputValue.replace(/\D/g, '');
    
    // Limit to 12 digits
    const truncatedValue = cleanValue.slice(0, 12);
    
    setEditedUpc(truncatedValue);
  };
  
  // Dedicated paste handler to ensure we capture the full pasted value
  const handleUpcPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('Text');
    const cleanValue = pasted.replace(/\D/g, '').slice(0, 12);
    setEditedUpc(cleanValue);
  };
  
  // Save updated UPC
  const saveUpdatedUpc = async () => {
    if (!isValidUPC(editedUpc)) {
      setEditError('UPC must be exactly 12 digits');
      return;
    }
    
    setIsSubmitting(true);
    setEditError(null);
    
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      
      const { error } = await supabase
        .from('distributor_products')
        .update({ upc: editedUpc, updated_at: new Date().toISOString() })
        .eq('id', productId);
      
      if (error) throw error;
      
      // Reload the page to show updated UPC
      window.location.reload();
    } catch (error: any) {
      console.error('Error updating UPC:', error);
      setEditError(error.message || 'Failed to update UPC');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  useEffect(() => {
    if (barcodeRef.current && upc && upc !== 'N/A') {
      // First check if UPC is valid format
      if (!isValidUPC(upc)) {
        setIsValid(false);
        return;
      }
      
      try {
        // Generate barcode using JsBarcode
        JsBarcode(barcodeRef.current, upc, {
          format: "upc",
          width: 2,
          height: 80,
          displayValue: true,
          fontSize: 14,
          margin: 10,
          background: "#ffffff",
          lineColor: "#000000",
          textMargin: 2
        });
        setIsValid(true);
      } catch (error) {
        console.error('Error generating barcode:', error);
        setIsValid(false);
      }
    }
  }, [upc]);
  
  // Edit UPC Modal
  const EditUpcModal = () => {
    if (!showEditModal) return null;
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-full max-w-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Edit UPC Code</h3>
            <button 
              onClick={() => setShowEditModal(false)}
              className="cursor-pointer text-gray-400 hover:text-gray-500"
            >
              <CloseIcon size={20} />
            </button>
          </div>
          
          <div className="mb-4">
            <label htmlFor="upc-input" className="block text-sm font-medium text-gray-700 mb-1">
              UPC Code
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="text"
                id="upc-input"
                value={editedUpc}
                onChange={handleUpcChange}
                onPaste={handleUpcPaste}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter 12-digit UPC code"
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              UPC code must be exactly 12 digits.
            </p>
            {editError && (
              <p className="mt-2 text-sm text-red-600">{editError}</p>
            )}
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowEditModal(false)}
              className="cursor-pointer px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={saveUpdatedUpc}
              className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 flex items-center justify-center min-w-[80px]"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                'Save'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  if (!isValid) {
    return (
      <div className="flex flex-col items-center justify-center p-4 bg-red-50 rounded-lg border border-red-200">
        <AlertTriangleIcon size={40} className="text-red-500 mb-2" />
        <p className="text-red-700 text-sm font-medium">Invalid UPC code</p>
        <p className="text-red-600 text-xs mb-3 text-center">
          The UPC code "{upc}" is invalid. UPC must be exactly 12 digits.
        </p>
        <button 
          onClick={() => {
            setEditedUpc(upc.replace(/\D/g, '').slice(0, 12));
            setShowEditModal(true);
          }}
          className="cursor-pointer  px-3 py-1.5 bg-red-600 text-white text-xs rounded-md hover:bg-red-700 inline-flex items-center"
        >
          <span>Edit UPC</span>
        </button>
        {showEditModal && <EditUpcModal />}
      </div>
    );
  }
  
  return (
    <div className="flex justify-center">
      <svg ref={barcodeRef} className="w-full"></svg>
      {showEditModal && <EditUpcModal />}
    </div>
  );
}

// Component that displays product details and barcode
export function ProductDetailClient({ productId }: { productId: string }) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [productDetails, setProductDetails] = useState<ProductDetails | null>(null)
  const [showInventoryModal, setShowInventoryModal] = useState(false)
  
  useEffect(() => {
    async function fetchProductData() {
      try {
        setIsLoading(true)
        setError(null)
        
        // Create Supabase client
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
        
        if (!productId) {
          throw new Error('Product ID is required')
        }
        
        // Fetch product details with category information
        const { data, error: fetchError } = await supabase
          .from('distributor_products')
          .select(`
            *,
            product_categories(
              id,
              name
            )
          `)
          .eq('id', productId)
          .single()
        
        if (fetchError) {
          throw fetchError
        }
        
        if (!data) {
          throw new Error('Product not found')
        }
        
        // Transform data to fit ProductDetails interface
        const transformedData: ProductDetails = {
          id: data.id,
          name: data.name || 'Unnamed Product',
          description: data.description || 'No description available',
          price: data.price || 0,
          case_size: data.case_size || 1,
          stock_quantity: data.stock_quantity || 0,
          image_url: data.image_url || 'https://via.placeholder.com/300',
          category: data.product_categories?.name || 'Uncategorized',
          sku: data.sku || 'N/A',
          upc: data.upc || 'N/A'
        }
        
        setProductDetails(transformedData)
      } catch (err: any) {
        console.error('Error fetching product details:', err)
        setError(err.message || 'Failed to load product details')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchProductData()
  }, [productId])
  
  // Helper function to determine stock status
  const getStockStatus = (product: ProductDetails) => {
    if (!product) {
      return {
        label: 'Unknown',
        color: 'bg-gray-100 text-gray-600',
        icon: <AlertTriangleIcon size={16} className="text-gray-500" />
      }
    }
    
    if (product.stock_quantity <= 0) {
      return {
        label: 'Out of Stock',
        color: 'bg-red-50 text-red-600',
        icon: <AlertTriangleIcon size={16} className="text-red-500" />
      }
    }
    
    if (product.stock_quantity <= 10) {
      return {
        label: 'Low Stock',
        color: 'bg-yellow-50 text-yellow-600',
        icon: <AlertTriangleIcon size={16} className="text-yellow-500" />
      }
    }
    
    return {
      label: 'In Stock',
      color: 'bg-green-50 text-green-600',
      icon: <CheckCircleIcon size={16} className="text-green-500" />
    }
  }
  
  // Handle inventory update success
  const handleInventoryUpdateSuccess = () => {
    // Refresh the product data
    window.location.reload()
  }
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 size={48} className="animate-spin text-blue-500" />
      </div>
    )
  }
  
  if (error || !productDetails) {
    return (
      <div className="bg-red-50 p-4 rounded-lg text-red-800">
        <h2 className="text-lg font-semibold mb-2">Error Loading Product</h2>
        <p>{error || 'Product details not available'}</p>
        <Link href="/distributor/products" className="inline-block mt-4 text-blue-600 hover:underline">
          &larr; Back to Products
        </Link>
      </div>
    )
  }
  
  const stockStatus = getStockStatus(productDetails)
  
  return (
    <div className="bg-gray-50">
      <div className="py-3">
        <div className="container mx-auto px-4">
          <Link href="/distributor/products" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800">
            <ArrowLeftIcon size={16} className="mr-1" />
            Back to Products
          </Link>
        </div>
      </div>
      
      <div className="container mx-auto px-4 pb-16">
        <div className="bg-white rounded-lg shadow-sm grid grid-cols-1 md:grid-cols-7 gap-8 overflow-hidden">
          <div className="md:col-span-3 p-6 flex flex-col h-full">
            <div className="aspect-square w-full bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
              <img
                src={productDetails.image_url}
                alt={productDetails.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Barcode section */}
            <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg flex-grow">
              <h3 className="text-sm font-medium text-gray-800 mb-3">Product Barcode</h3>
              <ProductBarcode upc={productDetails.upc} productId={productDetails.id} />
            </div>
          </div>
          <div className="md:col-span-4">
            <div className="mb-6 p-6">
              <h1 className="text-gray-800 text-2xl font-semibold mb-2">{productDetails.name}</h1>
              <div className="flex items-center space-x-4 mt-4">
                <span className="text-gray-800 text-3xl font-bold">${productDetails.price.toFixed(2)}</span>
                <span className="text-gray-700">
                  per case of {productDetails.case_size}
                </span>
              </div>
            </div>
            <div className="space-y-4 mb-6 p-6 pt-0">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center">
                  <PackageIcon size={16} className="text-gray-500 mr-2" />
                  <span className="text-sm text-gray-800">Category</span>
                </div>
                <span className="text-gray-800 text-sm font-medium">{productDetails.category}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center">
                  <TagIcon size={16} className="text-gray-500 mr-2" />
                  <span className="text-sm text-gray-800">SKU</span>
                </div>
                <span className="text-gray-800 text-sm font-medium">{productDetails.sku}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center">
                  <BarcodeIcon size={16} className="text-gray-500 mr-2" />
                  <span className="text-sm text-gray-800">UPC</span>
                </div>
                <span className="text-gray-800 text-sm font-medium">{productDetails.upc}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center">
                  {stockStatus.icon}
                  <span className="text-sm text-gray-800 ml-2">
                    Stock Status
                  </span>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${stockStatus.color}`}
                >
                  {stockStatus.label}
                </span>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 mx-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Inventory Details</h3>
              <div className="flex items-center justify-between">
                <div>
                  <span className="block text-xs text-gray-700">Stock Quantity</span>
                  <span className="text-gray-800 text-lg font-semibold">
                    {productDetails.stock_quantity}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 text-sm rounded-full bg-blue-50 text-blue-700">
                    {productDetails.stock_quantity > 0 ? 'Available' : 'Out of Stock'}
                  </span>
                  <button
                    onClick={() => setShowInventoryModal(true)}
                    className="cursor-pointer p-2 bg-gray-200 hover:bg-gray-300 rounded-full"
                    title="Edit Inventory"
                  >
                    <EditIcon size={16} className="text-gray-700" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ProductBatches productId={productId} />
        
        {/* Product Description (moved below batches) */}
        <div className="bg-white rounded-lg shadow-sm mt-6 p-6">
          <h2 className="text-gray-800 text-lg font-medium mb-4">Product Description</h2>
          <p className="text-gray-800 leading-relaxed">{productDetails.description || 'No description available.'}</p>
        </div>
      </div>
      
      {/* Edit Inventory Modal */}
      {showInventoryModal && (
        <EditInventoryModal
          isOpen={showInventoryModal}
          onClose={() => setShowInventoryModal(false)}
          productId={productDetails.id}
          currentQuantity={productDetails.stock_quantity}
          onSuccess={handleInventoryUpdateSuccess}
        />
      )}
    </div>
  )
}

// Also export as default for dynamic import compatibility
export default ProductDetailClient;

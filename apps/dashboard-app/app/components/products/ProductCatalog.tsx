import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import { ProductCard } from './ProductCard'
import { AddProductModal } from './AddProductModal'
import { Product } from './types'
import { createBrowserClient } from '@supabase/ssr'

interface ProductCatalogProps {
  products: Product[]
  categories: string[]
}

export function ProductCatalog({ products, categories }: ProductCatalogProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Products</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
        >
          <Plus size={16} className="mr-2" />
          Add Product
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        categories={categories}
      />
    </div>
  )
}

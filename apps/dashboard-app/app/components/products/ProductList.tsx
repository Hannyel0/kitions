import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  MoreVertical as MoreVerticalIcon, 
  Package as PackageIcon, 
  CheckCircle as CheckCircleIcon,
  AlertTriangle as AlertTriangleIcon,
  ArrowUp as ArrowUpIcon,
  ArrowDown as ArrowDownIcon
} from 'lucide-react'
import { Product } from './types'

type SortField = 'name' | 'category' | 'price' | 'case_size' | 'stock_quantity'
type SortOrder = 'asc' | 'desc'

interface ProductListProps {
  products: Product[]
}

export function ProductList({ products }: ProductListProps) {
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price)
  }

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      // Toggle sort order if clicking on the same field
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      // Set new sort field and default to ascending order
      setSortField(field)
      setSortOrder('asc')
    }
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null
    
    return sortOrder === 'asc' 
      ? <ArrowUpIcon size={14} className="ml-1" /> 
      : <ArrowDownIcon size={14} className="ml-1" />
  }

  // Sort the products based on the current sort field and order
  const sortedProducts = [...products].sort((a, b) => {
    const aValue: string | number | null = a[sortField];
    const bValue: string | number | null = b[sortField];
    
    // Handle undefined/null values (they should sort last)
    if (aValue === undefined || aValue === null) {
      return sortOrder === 'asc' ? 1 : -1;
    }
    if (bValue === undefined || bValue === null) {
      return sortOrder === 'asc' ? -1 : 1;
    }
    
    // For string fields, use localeCompare for proper string comparison
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    // For numeric fields
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    // Default case
    return 0;
  })

  return (
    <div className="overflow-hidden">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('name')}
            >
              <div className="flex items-center">
                Product {getSortIcon('name')}
              </div>
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('category')}
            >
              <div className="flex items-center">
                Category {getSortIcon('category')}
              </div>
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('price')}
            >
              <div className="flex items-center">
                Price {getSortIcon('price')}
              </div>
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('case_size')}
            >
              <div className="flex items-center">
                Case Size {getSortIcon('case_size')}
              </div>
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('stock_quantity')}
            >
              <div className="flex items-center">
                Stock {getSortIcon('stock_quantity')}
              </div>
            </th>
            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedProducts.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <Link href={`/distributor/products/${product.id}`} className="flex items-center">
                  <div className="h-10 w-10 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={40}
                        height={40}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full w-full bg-gray-100 border border-gray-200">
                        <Image src="/package-open.svg" alt="Package icon" width={20} height={20} className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {product.name}
                    </div>
                    <div className="text-xs text-gray-500 line-clamp-1">
                      SKU: {product.sku}
                    </div>
                  </div>
                </Link>
              </td>
              <td className="px-6 py-4">
                {product.category && (
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                    {product.category}
                  </span>
                )}
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">{formatPrice(product.price)}</div>
                <div className="text-xs text-gray-500">per case</div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <PackageIcon size={16} className="text-gray-400 mr-2" />
                  <span className="text-sm text-gray-900">
                    {product.case_size} units
                  </span>
                </div>
              </td>
              <td className="px-6 py-4">
                {product.stock_quantity > 0 ? (
                  <span className="px-2 py-1 text-xs rounded-full bg-green-50 text-green-600 flex items-center w-fit">
                    <CheckCircleIcon size={12} className="mr-1" />
                    In Stock ({product.stock_quantity})
                  </span>
                ) : (
                  <span className="px-2 py-1 text-xs rounded-full bg-red-50 text-red-600 flex items-center w-fit">
                    <AlertTriangleIcon size={12} className="mr-1" />
                    Out of Stock
                  </span>
                )}
              </td>
              <td className="px-6 py-4 text-right">
                <Link href={`/distributor/products/${product.id}`} className="text-gray-400 hover:text-gray-600">
                  <MoreVerticalIcon size={16} />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

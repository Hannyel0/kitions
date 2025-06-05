'use client';

import { Package, Search, Filter, Plus } from 'lucide-react';

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600">Manage products across all distributors</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </button>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
        <Package className="mx-auto h-16 w-16 text-yellow-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Product Management Coming Soon
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          This section will allow you to manage products, categories, inventory, and pricing across all distributors.
        </p>
      </div>

      {/* Search and Filter placeholder */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products by name, SKU, or category..."
                disabled
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-400"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select disabled className="border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-400">
                <option>All Categories</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
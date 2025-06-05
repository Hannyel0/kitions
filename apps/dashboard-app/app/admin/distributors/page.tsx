'use client';

import { Building2, Package, TrendingUp } from 'lucide-react';

export default function DistributorsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Distributor Overview</h1>
        <p className="text-gray-600">Monitor distributor performance and activity</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
        <Building2 className="mx-auto h-16 w-16 text-blue-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Distributor Management Coming Soon
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          This section will display detailed distributor analytics, performance metrics, and management tools.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <Building2 className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Distributors</p>
              <p className="text-2xl font-bold text-gray-900">-</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">-</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Monthly Growth</p>
              <p className="text-2xl font-bold text-gray-900">-</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
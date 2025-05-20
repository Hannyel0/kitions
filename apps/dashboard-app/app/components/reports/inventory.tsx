'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Calendar,
  Download,
  Filter,
  ArrowLeft as ArrowLeftIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Package as PackageIcon,
} from 'lucide-react'

interface InventoryChange {
  id: string
  productName: string
  date: string
  previousStock: number
  newStock: number
  change: number
  type: 'addition' | 'reduction'
  reason: 'Restock' | 'Manual Addition' | 'Manual Deduction' | 'Sold'
}

export function InventoryReport() {
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')

  // Example data - in a real app, this would be filtered based on date range
  const inventoryChanges: InventoryChange[] = [
    {
      id: '1',
      productName: 'Premium Coffee Beans',
      date: '2024-01-15',
      previousStock: 458,
      newStock: 500,
      change: 42,
      type: 'addition',
      reason: 'Restock',
    },
    {
      id: '2',
      productName: 'Organic Green Tea',
      date: '2024-01-14',
      previousStock: 285,
      newStock: 235,
      change: -50,
      type: 'reduction',
      reason: 'Sold',
    },
    {
      id: '3',
      productName: 'Premium Coffee Beans',
      date: '2024-01-13',
      previousStock: 438,
      newStock: 458,
      change: 20,
      type: 'addition',
      reason: 'Manual Addition',
    },
  ]

  // Calculate summary metrics
  const totalStockChange = inventoryChanges.reduce(
    (acc, curr) => acc + curr.change,
    0,
  )

  const productChanges = inventoryChanges.reduce(
    (acc, curr) => {
      acc[curr.productName] = acc[curr.productName] || {
        restocked: 0,
        sold: 0,
      }
      if (curr.type === 'addition') {
        acc[curr.productName].restocked += curr.change
      } else {
        acc[curr.productName].sold += Math.abs(curr.change)
      }
      return acc
    },
    {} as Record<
      string,
      {
        restocked: number
        sold: number
      }
    >,
  )

  const mostRestocked = Object.entries(productChanges).reduce((a, b) =>
    a[1].restocked > b[1].restocked ? a : b,
  )

  const mostSold = Object.entries(productChanges).reduce((a, b) =>
    a[1].sold > b[1].sold ? a : b,
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/distributor/reports"
            className="flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon size={16} className="mr-2" />
            Back to Reports
          </Link>
          <h1 className="text-2xl font-semibold">Inventory Report</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">
              Total Stock Change
            </h3>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${totalStockChange >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}
            >
              {totalStockChange >= 0 ? (
                <TrendingUpIcon size={14} className="inline mr-1" />
              ) : (
                <TrendingDownIcon size={14} className="inline mr-1" />
              )}
              {totalStockChange}
            </span>
          </div>
          <p className="mt-2 text-2xl font-semibold">
            {totalStockChange >= 0 ? '+' : ''}
            {totalStockChange} units
          </p>
          <p className="mt-1 text-sm text-gray-500">This month</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">
              Most Restocked Item
            </h3>
            <span className="px-2 py-1 bg-green-50 text-green-600 rounded-full text-xs font-medium">
              <PackageIcon size={14} className="inline mr-1" />+
              {mostRestocked[1].restocked}
            </span>
          </div>
          <p className="mt-2 text-2xl font-semibold">{mostRestocked[0]}</p>
          <p className="mt-1 text-sm text-gray-500">Highest restock volume</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">
              Most Sold Item
            </h3>
            <span className="px-2 py-1 bg-red-50 text-red-600 rounded-full text-xs font-medium">
              <PackageIcon size={14} className="inline mr-1" />-
              {mostSold[1].sold}
            </span>
          </div>
          <p className="mt-2 text-2xl font-semibold">{mostSold[0]}</p>
          <p className="mt-1 text-sm text-gray-500">Highest sales volume</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h2 className="text-lg font-medium">Inventory Changes</h2>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium flex items-center">
                <Download size={16} className="mr-2" />
                Export Report
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-md">
                  <Calendar size={16} className="text-gray-500" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="text-sm bg-transparent outline-none"
                  />
                </div>
                <span className="text-gray-500">to</span>
                <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-md">
                  <Calendar size={16} className="text-gray-500" />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="text-sm bg-transparent outline-none"
                  />
                </div>
              </div>
              <button className="flex items-center px-3 py-2 border border-gray-200 rounded-md text-sm">
                <Filter size={16} className="mr-2 text-gray-500" />
                Filter
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Previous Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  New Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Change
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reason
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inventoryChanges.map((change) => (
                <tr key={change.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(change.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {change.productName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {change.previousStock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {change.newStock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${change.type === 'addition' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}
                    >
                      {change.type === 'addition' ? '+' : ''}
                      {change.change}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {change.reason}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

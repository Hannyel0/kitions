import React from 'react'
import { PlusIcon, BarChart2Icon, UploadIcon } from 'lucide-react'

export function QuickActions() {
  return (
    <section className="mb-8">
      <h2 className=" text-gray-800 text-xl font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <PlusIcon size={20} className="text-blue-600" />
          </div>
          <h3 className=" text-gray-800 font-medium mb-2">Add to Waiting List</h3>
          <p className="text-gray-700 text-sm">
            Add a new customer manually to the waiting list
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <BarChart2Icon size={20} className="text-blue-600" />
          </div>
          <h3 className=" text-gray-800 font-medium mb-2">Generate Sales Report</h3>
          <p className="text-gray-700 text-sm">
            Instantly generate a summary of sales.
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <UploadIcon size={20} className="text-blue-600" />
          </div>
          <h3 className=" text-gray-800 font-medium mb-2">Import Data</h3>
          <p className="text-gray-700 text-sm">
            Upload a file to update waiting or sales lists.
          </p>
        </div>
      </div>
    </section>
  )
}

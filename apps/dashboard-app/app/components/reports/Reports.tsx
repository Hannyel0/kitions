import React from 'react'
import { useRouter } from 'next/navigation'
import {
  FileText,
  BarChart2,
  Users,
  DollarSign,
  Clock,
  ArrowUp as ArrowUpIcon,
} from 'lucide-react'

type ReportType = 'inventory' | 'sales' | 'customers' | 'finance'

interface ReportOption {
  id: ReportType
  title: string
  description: string
  icon: React.ReactNode
  path: string
  disabled?: boolean
  preview?: {
    metric: string
    label: string
    trend?: {
      value: string
      positive: boolean
    }
  }
}

export function Reports() {
  const router = useRouter()
  
  const reportOptions: ReportOption[] = [
    {
      id: 'inventory',
      title: 'Inventory Report',
      description: 'Track stock changes',
      icon: <FileText className="h-5 w-5" />,
      path: '/distributor/reports/inventory',
      preview: {
        metric: '458',
        label: 'Total Items in Stock',
        trend: {
          value: '+42',
          positive: true,
        },
      },
    },
    {
      id: 'sales',
      title: 'Sales Report',
      description: 'Revenue and transactions',
      icon: <BarChart2 className="h-5 w-5" />,
      path: '/distributor/reports/sales',
      disabled: true,
      preview: {
        metric: '$2,450',
        label: "This Month's Sales",
        trend: {
          value: '+15%',
          positive: true,
        },
      },
    },
    {
      id: 'customers',
      title: 'Customer Report',
      description: 'Customer analytics',
      icon: <Users className="h-5 w-5" />,
      path: '/distributor/reports/customers',
      disabled: true,
      preview: {
        metric: '12%',
        label: 'Returning Customers',
        trend: {
          value: '+3%',
          positive: true,
        },
      },
    },
    {
      id: 'finance',
      title: 'Financial Report',
      description: 'Profit and loss',
      icon: <DollarSign className="h-5 w-5" />,
      path: '/distributor/reports/finance',
      disabled: true,
      preview: {
        metric: '$12,840',
        label: 'Monthly Revenue',
        trend: {
          value: '-2%',
          positive: false,
        },
      },
    },
  ]
  
  const handleReportSelect = (option: ReportOption) => {
    if (!option.disabled) {
      router.push(option.path)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-gray-900 text-3xl font-semibold">Reports</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportOptions.map((option) => (
          <div
            key={option.id}
            onClick={() => handleReportSelect(option)}
            className={`flex flex-col justify-between p-6 border rounded-lg transition-colors ${option.disabled ? 'border-gray-200 bg-gray-50' : 'border-gray-200 bg-white hover:bg-gray-50 cursor-pointer'}`}
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="p-2 rounded-lg bg-gray-100">
                    <div className="text-gray-500">{option.icon}</div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {option.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {option.description}
                    </p>
                    {option.disabled && (
                      <span className="inline-flex items-center px-2 py-1 mt-2 rounded-full text-xs bg-gray-100 text-gray-600">
                        <Clock className="w-3 h-3 mr-1" />
                        Coming soon
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {option.preview && (
                <div
                  className={`pt-4 mt-4 border-t border-gray-100 ${option.disabled ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-baseline justify-between">
                    <div>
                      <p className="text-2xl font-semibold text-gray-900">
                        {option.preview.metric}
                      </p>
                      <p className="text-sm text-gray-500">
                        {option.preview.label}
                      </p>
                    </div>
                    {option.preview.trend && (
                      <span
                        className={`flex items-center text-sm font-medium ${option.preview.trend.positive ? 'text-green-600' : 'text-red-600'}`}
                      >
                        {option.preview.trend.positive ? (
                          <ArrowUpIcon className="w-4 h-4 mr-1" />
                        ) : (
                          <ArrowUpIcon className="w-4 h-4 mr-1 transform rotate-180" />
                        )}
                        {option.preview.trend.value}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

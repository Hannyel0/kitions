import React from 'react'
import { ShoppingCart, BarChart2, FileText } from 'lucide-react'
import Link from 'next/link'

interface QuickActionCardProps {
  icon: React.ReactNode
  title: string
  description: string
  href?: string
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({ icon, title, description, href = '#' }) => (
  <Link href={href} className="block h-full">
    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-100 h-full hover:shadow-md transition-shadow">
      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mb-3 sm:mb-4">
        {icon}
      </div>
      <h3 className="text-gray-800 font-medium mb-2 text-sm sm:text-base">{title}</h3>
      <p className="text-gray-700 text-xs sm:text-sm">
        {description}
      </p>
    </div>
  </Link>
)

export function QuickActions() {
  return (
    <section className="mb-6 sm:mb-8">
      <h2 className="text-gray-800 text-lg sm:text-xl font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <QuickActionCard
          icon={<ShoppingCart size={20} className="text-blue-600" />}
          title="Make Order"
          description="Create a new order for your retailers"
          href="/distributor/orders/create"
        />
        <QuickActionCard
          icon={<BarChart2 size={20} className="text-blue-600" />}
          title="Generate Sales Report"
          description="View and download detailed sales reports"
          href="/distributor/reports"
        />
        <QuickActionCard
          icon={<FileText size={20} className="text-blue-600" />}
          title="Make Invoice"
          description="Create and send professional invoices"
          href="/distributor/invoices/create"
        />
      </div>
    </section>
  )
}

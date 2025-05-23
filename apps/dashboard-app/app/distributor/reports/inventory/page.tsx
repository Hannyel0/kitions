'use client'

import React from 'react'
import { InventoryReport } from '@/app/components/reports/inventory'
import DashboardLayout from '@/app/components/layout/DashboardLayout'

export default function InventoryReportPage() {
  return (
    <DashboardLayout userType="distributor">
      <div className="h-full">
        <InventoryReport />
      </div>
    </DashboardLayout>
  )
}

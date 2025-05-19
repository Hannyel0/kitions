// This is a server component (no 'use client' directive)
import React from 'react'
import { DashboardLayout } from '@/app/components/layout'
import { ProductClientWrapper } from './product-client-wrapper'

// Types are exported to be shared with the client component
export interface ProductDetails {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  case_size: number
  category: string
  sku: string
  upc: string
  stock_quantity: number
}

// Server component - doesn't use hooks or client-side state
export default function ProductPage({ params }: { params: { id: string } }) {
  // In a server component, we can safely access params directly
  const { id } = params
  
  return (
    <DashboardLayout userType="distributor">
      <ProductClientWrapper productId={id} />
    </DashboardLayout>
  )
}

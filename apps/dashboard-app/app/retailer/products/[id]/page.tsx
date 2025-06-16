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

// In Next.js App Router, dynamic route params are passed as a Promise
export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  // We need to await the params promise to get the id
  const { id } = await params
  
  return (
    <DashboardLayout userType="distributor">
      <ProductClientWrapper productId={id} />
    </DashboardLayout>
  )
}

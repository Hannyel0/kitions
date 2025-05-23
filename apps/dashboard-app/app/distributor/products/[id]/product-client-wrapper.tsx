"use client"

import dynamic from 'next/dynamic'

// Dynamically import the client component with no SSR to avoid JsBarcode issues
// Using dynamic import with no SSR ensures JsBarcode runs only on the client
const ProductDetailClient = dynamic(
  () => import('./product-detail-client'),
  { ssr: false }
)

export function ProductClientWrapper({ productId }: { productId: string }) {
  return <ProductDetailClient productId={productId} />
}

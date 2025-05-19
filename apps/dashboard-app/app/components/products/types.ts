export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  case_size: number
  stock_quantity: number
  category: string
  category_id: string
  sku: string
  upc: string
  image_url?: string
}

export interface ProductCategory {
  id: string
  name: string
}

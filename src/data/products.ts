export interface Product {
  id: string
  name: string
  slug: string
  category: string
  description: string
  summary: string
  price: string | null
  unit: string
  image: string
  images: string[]
  tags: string[]
  specifications?: Record<string, string>
}

export interface ProductIndex {
  total: number
  categories: string[]
  products: Product[]
}

export const PRODUCTS_PER_PAGE = 20

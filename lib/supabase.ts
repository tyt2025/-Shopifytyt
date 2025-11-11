import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export interface Product {
  id: number
  sku: string
  product_name: string
  category: string
  category_sub: string
  available_stock: number
  description: string
  price: number
  price_cop: number
  brand: string
  image_url_png: string
  main_image_url: string
  images: string[]
  warranty_months: number
  is_active: boolean
  is_featured: boolean
  short_description: string
  category_id: number
  subcategory_id: number
  exento_iva: boolean
  shopify_product_id?: string
  shopify_published?: boolean
  shopify_category?: string
  shopify_subcategory?: string
}

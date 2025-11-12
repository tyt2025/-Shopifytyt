export interface Product {
  id: string;
  product_name: string;
  description: string;
  price_cop: number;
  price: number;
  brand: string;
  category?: string;
  category_sub?: string;
  image_url_png?: string;
  main_image_url?: string;
  sku?: string;
  available_stock?: number;
  warranty_months?: number;
  is_active?: boolean;
  is_featured?: boolean;
  short_description?: string;
  shopify_product_id?: string;
  shopify_published?: boolean;
}

export interface ShopifyProduct {
  title: string;
  body_html: string;
  vendor: string;
  product_type: string;
  tags: string[];
  variants: ShopifyVariant[];
  images?: ShopifyImage[];
  metafields?: ShopifyMetafield[];
}

export interface ShopifyVariant {
  price: string;
  sku?: string;
  inventory_quantity?: number;
  metafields?: ShopifyMetafield[];
}

export interface ShopifyImage {
  src: string;
  alt?: string;
}

export interface ShopifyMetafield {
  namespace: string;
  key: string;
  value: string;
  type: string;
}

export interface ShopifyCollection {
  id: string;
  title: string;
  handle: string;
}

export interface ProductFormData {
  productIds: string[];
  tipo: string;
  etiquetas: string[];
  colecciones: string[];
  generarSEO: boolean;
}

export interface SEOData {
  title: string;
  description: string;
}

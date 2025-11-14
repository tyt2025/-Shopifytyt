export interface Product {
  id: string;
  nombre: string;
  sku: string;
  marca: string;
  precio: number;
  stock: number;
  imagen_url?: string;
  tipo_producto?: string;
  etiquetas?: string[];
  colecciones?: string[];
  descripcion?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProductTableRow extends Product {
  selected: boolean;
}

export const COLECCIONES_SHOPIFY = [
  'Baterías',
  'Cables de Red',
  'Cables para Celulares',
  'Cables y convertidores',
  'Cajon monedero',
  'Cámaras',
  'Computadores',
  'Diademas',
  'Fuentes',
  'Impresoras',
  'Monitores',
  'Mouse',
  'Parlantes',
  'Procesadores',
  'Teclados',
  'Tintas',
] as const;

export type ColeccionShopify = typeof COLECCIONES_SHOPIFY[number];

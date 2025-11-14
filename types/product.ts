export interface Product {
  id: string;
  nombre: string;
  sku: string;
  marca?: string | null;
  precio?: number | null;
  stock?: number | null;
  imagen_url?: string | null;
  tipo_producto?: string | null;
  etiquetas?: string[] | null;
  colecciones?: string[] | null;
  descripcion?: string | null;
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

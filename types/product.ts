export interface Product {
  id: string;
  product_name: string;  // ✅ Corregido: era "nombre"
  sku: string;
  brand?: string | null;  // ✅ Corregido: era "marca"
  price_cop?: number | null;
  available_stock?: number | null;
  image_url_png?: string | null;  // ✅ Corregido: era "imagen_url"
  shopify_category?: string | null;  // ✅ Corregido: era "tipo_producto"
  shopify_subcategory?: string | null;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
  // Campos adicionales para el dashboard
  etiquetas?: string[];
  colecciones?: string[];
}

export interface ProductTableRow extends Product {
  selected: boolean;
}

// ✅ 67 CATEGORÍAS COMPLETAS DE SHOPIFY (extraídas del CSV real)
export const COLECCIONES_SHOPIFY = [
  'adaptador',
  'auriculares',
  'base tv',
  'Base refrigerante',
  'Baterías',
  'cable audio',
  'cable de audio',
  'cable de celular',
  'cable hdmi',
  'cable RED',
  'cable vga',
  'cables',
  'cajon monedero',
  'camara',
  'camara de seguridad',
  'camara web',
  'carga',
  'CARGADOR',
  'cartucho',
  'combo gamer',
  'combo teclado y mouse',
  'computador',
  'Computadores',
  'control',
  'convertidor',
  'convertidores',
  'DIADEMA GAMER',
  'Diadema para pc',
  'disco duro',
  'DVR',
  'escáner',
  'etiquetas adhesivas',
  'fundas para portatil',
  'impresora',
  'lector de codigo de barras',
  'lector de targetas',
  'lápiz óptico',
  'memoria Ram',
  'Memoria Usb',
  'micro sd',
  'MONITOR',
  'mouse',
  'Pad mouse',
  'pantalla',
  'papel Adhesivos',
  'parlante',
  'Pasta termica',
  'Portatil',
  'Power Bank',
  'Proyector',
  'Redes y Vigilancia',
  'Regulador de voltaje',
  'router',
  'splitter',
  'switch',
  'swtch de red',
  'Tablet',
  'tarjeta de red usb',
  'Tarjeta Grafica',
  'teclado',
  'tinta',
  'Todo en uno',
  'tone',
  'toner',
  'tv box',
  'Ups',
  'Video y Tablets',
] as const;

export type ColeccionShopify = typeof COLECCIONES_SHOPIFY[number];

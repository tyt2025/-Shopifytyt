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
  shopify_taxonomy_category?: string | null;  // ✅ NUEVO: Taxonomía estándar de Shopify
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

// ✅ 112 COLECCIONES COMPLETAS DE SHOPIFY (extraídas del CSV real)
export const COLECCIONES_SHOPIFY = [
  'Accesories',
  'Baterías',
  'CARGADOR',
  'CARGADOR MONITORES',
  'CARGADOR PARA PORTATIL',
  'COMBO TECLADO Y MOUSE',
  'COMP',
  'Cables de Red',
  'Connectors',
  'DIADEMA',
  'DVR',
  'Discos Duros',
  'ESCANER',
  'Escáner',
  'Fundas para portatil',
  'MOUSE',
  'Memoria Usb',
  'Micro Sd',
  'Mobile Accesories',
  'Mobile Accessories',
  'Networking',
  'Pad Mouse',
  'Pos',
  'Power & Electrical',
  'Power Bank',
  'Power Banks',
  'Regulador',
  'Regulador de voltaje',
  'SWITCH',
  'Tablet Pos',
  'Tablets',
  'Terminal movil Pos',
  'Tinta Epson',
  'USB Adapters',
  'Universal Adapters',
  'Ups',
  'adaptador',
  'audifonos',
  'auriculares',
  'base para tv',
  'base refrigerante',
  'cable audio',
  'cable celular 4 en 1',
  'cable hdmi',
  'cable plug',
  'cable red',
  'cable vga',
  'cables',
  'cajon monedero',
  'camara de seguridad',
  'camara web',
  'camaras cctv',
  'camaras de segurudad',
  'cartucho hp',
  'cartucho hp 122',
  'cartucho hp 662',
  'cartucho hp 664',
  'cartucho hp 667',
  'combo gamer',
  'computador de mesa',
  'computador gamer',
  'control para pc',
  'convertidor',
  'ddr4',
  'disco duro',
  'etiquetas adhesivas',
  'fire stick',
  'fire tv stick',
  'impresora',
  'impresora laser',
  'lapiz tactil para tablets',
  'lector de codigo de barras',
  'lector de código de barras',
  'lector de targetas',
  'manos libres',
  'memoria ram',
  'monitor',
  'pantalla',
  'parlante 8 pulgadas',
  'parlante bluetooth',
  'parlantes para pc',
  'pasta termica',
  'portatil',
  'portatil gamer',
  'proyector',
  'regulador',
  'router',
  'splitter',
  'switch Tp-Link',
  'switch hdmi',
  'tablet',
  'tablet samsung',
  'tarjeta de red',
  'tarjeta grafica',
  'teatro en casa',
  'teclado',
  'teclado gamer',
  'teclado genius',
  'tenda',
  'tinta',
  'tinta Canon',
  'tinta Hp',
  'tinta brother',
  'tinta generica',
  'todo en uno',
  'todo en uno core i5',
  'todo en uno hp',
  'todo en uno pos',
  'toner generico',
  'toner original',
  'usb wifi',
  'videobeam',
] as const;

// ✅ CATEGORÍAS DE TAXONOMÍA ESTÁNDAR DE SHOPIFY
// Fuente: https://shopify.github.io/product-taxonomy/
// Formato: "Nivel 1 > Nivel 2 > Nivel 3"
export const SHOPIFY_TAXONOMY_CATEGORIES = [
  // Computadores
  'Electronics > Computers > Desktop Computers',
  'Electronics > Computers > Laptop Computers',
  'Electronics > Computers > Tablet Computers',
  
  // Accesorios de Computador
  'Electronics > Computers > Computer Accessories > Computer Cables & Adapters',
  'Electronics > Computers > Computer Accessories > Keyboards',
  'Electronics > Computers > Computer Accessories > Mice & Trackballs',
  'Electronics > Computers > Computer Accessories > Monitor Accessories',
  'Electronics > Computers > Computer Accessories > Computer Cases & Bags',
  'Electronics > Computers > Computer Accessories > Laptop Docking Stations',
  
  // Componentes de Computador
  'Electronics > Computers > Computer Components > Computer Memory (RAM)',
  'Electronics > Computers > Computer Components > Storage Devices > Hard Drives',
  'Electronics > Computers > Computer Components > Storage Devices > External Hard Drives',
  'Electronics > Computers > Computer Components > Storage Devices > USB Flash Drives',
  'Electronics > Computers > Computer Components > Storage Devices > Memory Cards',
  'Electronics > Computers > Computer Components > Graphics Cards',
  'Electronics > Computers > Computer Components > Computer Fans & Cooling',
  'Electronics > Computers > Computer Components > Computer Processors',
  'Electronics > Computers > Computer Components > Motherboards',
  'Electronics > Computers > Computer Components > Computer Power Supplies',
  
  // Impresoras y Escáneres
  'Electronics > Print, Copy, Scan & Fax > Printers',
  'Electronics > Print, Copy, Scan & Fax > Printer Consumables > Ink & Toner Cartridges',
  'Electronics > Print, Copy, Scan & Fax > Scanners',
  'Electronics > Print, Copy, Scan & Fax > 3D Printers',
  
  // Redes y Conectividad
  'Electronics > Networking > Network Cables',
  'Electronics > Networking > Routers',
  'Electronics > Networking > Switches',
  'Electronics > Networking > Network Adapters',
  'Electronics > Networking > USB & FireWire Hubs',
  'Electronics > Networking > Modems',
  
  // Audio
  'Electronics > Audio > Headphones & Headsets',
  'Electronics > Audio > Speakers',
  'Electronics > Audio > Audio Cables & Adapters',
  'Electronics > Audio > Microphones',
  
  // Video
  'Electronics > Video > Projectors',
  'Electronics > Video > Video Cables & Adapters',
  'Electronics > Video > Monitors',
  
  // Cámaras
  'Electronics > Cameras & Optics > Cameras > Digital Cameras',
  'Electronics > Cameras & Optics > Cameras > Security Cameras',
  'Electronics > Cameras & Optics > Cameras > Webcams',
  
  // Energía y Baterías
  'Electronics > Power > UPS (Uninterruptible Power Supply)',
  'Electronics > Power > Power Cables & Adapters',
  'Electronics > Power > Battery Chargers',
  'Electronics > Power > Batteries',
  
  // Accesorios de Móviles
  'Electronics > Mobile Phone Accessories > Mobile Phone Cables',
  'Electronics > Mobile Phone Accessories > Mobile Phone Chargers',
  'Electronics > Mobile Phone Accessories > Mobile Phone Cases & Covers',
  
  // Gaming
  'Electronics > Video Game Consoles & Accessories > Video Game Accessories',
  'Electronics > Video Game Consoles & Accessories > Video Game Console Accessories',
] as const;

export type ShopifyTaxonomyCategory = typeof SHOPIFY_TAXONOMY_CATEGORIES[number];

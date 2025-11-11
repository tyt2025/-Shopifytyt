// Categorías CORRECTAS según el sitio web tintasytecnologia.com
// Estructura: 6 categorías principales con sus subcategorías

export const SHOPIFY_CATEGORIES = [
  'Impresión y pos',
  'Computadores',
  'Accesorios',
  'Linea Gamer',
  'Redes y Vigilancia',
  'Video y Tablets',
] as const

export const SHOPIFY_SUBCATEGORIES: Record<string, string[]> = {
  'Impresión y pos': [
    'Termicas',
    'Laser',
    'Tinta continua',
    'Toner Generico',
    'Toner Originales',
    'Tintas Genericas',
    'Tintas Originales',
    'Cartuchos y Cabezales',
    'Cajon monedero',
    'Lector de codigo de barras',
    'Rollos de papel termico',
    'Escáners',
  ],
  'Computadores': [
    'Monitores',
    'PC - Mesa',
    'Todo en uno',
    'Portatiles',
    'Discos Duros',
    'memoria Ram',
  ],
  'Accesorios': [
    'Bases Soportes',
    'Cables y convertidores',
    'Teclados y mouses',
    'Teclado',
    'Mouse',
    'Parlantes',
    'Camaras web',
    'Cargadores para portatil',
    'Diademas pc',
    'Microfonos',
    'Ups y reguladores de energia',
    'Pad Mouses',
    'Memorias Usb',
    'Fundas de Portatiles',
  ],
  'Linea Gamer': [
    'Combos Gamer',
    'Computadores Gamer',
    'Diadema Gamer',
    'Mouses',
    'Teclados',
    'Componentes',
    'Tarjetas Graficas',
  ],
  'Redes y Vigilancia': [
    'Cables de Red',
    'camaras cctv',
    'Camaras ip',
    'Routers',
    'Switch',
    'Tarjetas de red',
    'Modem mifi',
    'DVRS',
  ],
  'Video y Tablets': [
    'Tablets',
    'Proyector',
    'Micro sd',
    'Auriculares',
    'Splitters',
    'Switch de video',
    'tv box y tdt',
  ],
}

// Función helper para obtener subcategorías
export function getSubcategories(category: string): string[] {
  return SHOPIFY_SUBCATEGORIES[category] || []
}

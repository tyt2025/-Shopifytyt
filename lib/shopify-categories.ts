// Categorías REALES de Shopify - Tintas y Tecnología
// Extraídas de products_export_1.csv - 57 categorías completas

export const SHOPIFY_CATEGORIES = [
  'Base refrigerante',
  'Baterías',
  'CARGADOR',
  'DIADEMA GAMER',
  'DVR',
  'Diadema para pc',
  'Lector de codigo de barras',
  'MONITOR',
  'Memoria Usb',
  'Pad mouse',
  'Portatil',
  'Power Bank',
  'Proyector',
  'Regulador de voltaje',
  'Tablet',
  'Tarjeta Grafica',
  'Todo en uno',
  'Ups',
  'adaptador',
  'auriculares',
  'cable hdmi',
  'cable vga',
  'cables',
  'cajon monedero',
  'camara',
  'camara de seguridad',
  'camara web',
  'carga',
  'cartucho',
  'combo gamer',
  'combo teclado y mouse',
  'computador',
  'control',
  'convertidor',
  'disco duro',
  'escáner',
  'etiquetas adhesivas',
  'fundas para portatil',
  'impresora',
  'lector de targetas',
  'lápiz óptico',
  'memoria Ram',
  'micro sd',
  'mouse',
  'pantalla',
  'papel Adhesivos',
  'parlante',
  'router',
  'splitter',
  'switch',
  'swtch de red',
  'tarjeta de red usb',
  'teclado',
  'tinta',
  'tone',
  'toner',
  'tv box',
] as const

export const SHOPIFY_SUBCATEGORIES: Record<string, string[]> = {
  'Base refrigerante': [
    'base refrigerante',
  ],
  'Baterías': [
    'Baterías',
  ],
  'CARGADOR': [
    'CARGADOR',
    'CARGADOR MONITORES',
    'CARGADOR PARA PORTATIL',
  ],
  'DIADEMA GAMER': [
    'DIADEMA',
  ],
  'DVR': [
    'DVR',
  ],
  'Diadema para pc': [
    'DIADEMA',
  ],
  'Lector de codigo de barras': [
    'lector de codigo de barras',
    'lector de código de barras',
  ],
  'MONITOR': [
    'monitor',
  ],
  'Memoria Usb': [
    'Memoria Usb',
  ],
  'Pad mouse': [
    'MOUSE',
    'Pad Mouse',
  ],
  'Portatil': [
    'portatil',
    'portatil gamer',
  ],
  'Power Bank': [
    'Power Bank',
  ],
  'Proyector': [
    'proyector',
    'videobeam',
  ],
  'Regulador de voltaje': [
    'Regulador',
    'Regulador de voltaje',
    'regulador',
  ],
  'Tablet': [
    'Pos',
    'Tablet Pos',
    'Terminal movil Pos',
    'tablet',
    'tablet samsung',
  ],
  'Tarjeta Grafica': [
    'tarjeta grafica',
  ],
  'Todo en uno': [
    'todo en uno',
    'todo en uno pos',
  ],
  'Ups': [
    'Ups',
  ],
  'adaptador': [
    'adaptador',
  ],
  'auriculares': [
    'audifonos',
    'auriculares',
    'manos libres',
  ],
  'cable hdmi': [
    'cable hdmi',
  ],
  'cable vga': [
    'cable vga',
  ],
  'cables': [
    'cable hdmi',
    'cable vga',
    'cables',
  ],
  'cajon monedero': [
    'cajon monedero',
  ],
  'camara': [
    'camaras de segurudad',
  ],
  'camara de seguridad': [
    'camara de seguridad',
  ],
  'camara web': [
    'camara web',
  ],
  'carga': [
    'CARGADOR',
    'CARGADOR PARA PORTATIL',
  ],
  'cartucho': [
    'cartucho hp',
    'cartucho hp 122',
    'cartucho hp 662',
    'cartucho hp 664',
    'cartucho hp 667',
  ],
  'combo gamer': [
    'COMBO TECLADO Y MOUSE',
    'combo gamer',
  ],
  'combo teclado y mouse': [
    'COMBO TECLADO Y MOUSE',
  ],
  'computador': [
    'COMP',
    'computador de mesa',
    'computador gamer',
    'todo en uno',
    'todo en uno core i5',
    'todo en uno hp',
  ],
  'control': [
    'control para pc',
  ],
  'convertidor': [
    'convertidor',
  ],
  'disco duro': [
    'disco duro',
  ],
  'escáner': [
    'ESCANER',
    'Escáner',
  ],
  'etiquetas adhesivas': [
    'etiquetas adhesivas',
  ],
  'fundas para portatil': [
    'Fundas para portatil',
  ],
  'impresora': [
    'impresora',
    'impresora laser',
  ],
  'lector de targetas': [
    'lector de targetas',
  ],
  'lápiz óptico': [
    'lapiz tactil para tablets',
  ],
  'memoria Ram': [
    'ddr4',
    'memoria ram',
  ],
  'micro sd': [
    'Micro Sd',
  ],
  'mouse': [
    'MOUSE',
  ],
  'pantalla': [
    'monitor',
    'pantalla',
  ],
  'papel Adhesivos': [
    'etiquetas adhesivas',
  ],
  'parlante': [
    'parlante 8 pulgadas',
    'parlante bluetooth',
    'parlantes para pc',
    'teatro en casa',
  ],
  'router': [
    'router',
  ],
  'splitter': [
    'splitter',
  ],
  'switch': [
    'SWITCH',
    'switch Tp-Link',
    'switch hdmi',
  ],
  'swtch de red': [
    'SWITCH',
    'switch Tp-Link',
    'tenda',
  ],
  'tarjeta de red usb': [
    'tarjeta de red',
    'usb wifi',
  ],
  'teclado': [
    'teclado',
    'teclado gamer',
    'teclado genius',
  ],
  'tinta': [
    'Tinta Epson',
    'tinta',
    'tinta Canon',
    'tinta Hp',
    'tinta brother',
    'tinta generica',
  ],
  'tone': [
    'toner generico',
  ],
  'toner': [
    'toner generico',
    'toner original',
  ],
  'tv box': [
    'fire stick',
    'fire tv stick',
  ],
}

// Función helper para obtener subcategorías
export function getSubcategories(category: string): string[] {
  return SHOPIFY_SUBCATEGORIES[category] || []
}

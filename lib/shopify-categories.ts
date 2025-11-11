// Categorías REALES de Shopify - Tintas y Tecnología
export const SHOPIFY_CATEGORIES = [
  'adaptador',
  'auriculares',
  'Base refrigerante',
  'combo teclado y mouse',
  'DIADEMA GAMER',
  'Diadema para pc',
  'disco duro',
  'impresora',
  'lector de targetas',
  'mouse',
  'parlante',
  'Portatil',
  'Power Bank',
  'router',
  'teclado',
  'tinta',
  'tone',
  'toner',
] as const

// Subcategorías (Tags) por categoría principal
export const SHOPIFY_SUBCATEGORIES: Record<string, string[]> = {
  'adaptador': [
    'adaptador HDMI',
    'adaptador USB',
    'adaptador de corriente',
    'adaptador de red',
    'adaptador de video',
    'adaptador de audio',
  ],
  'auriculares': [
    'auriculares bluetooth',
    'auriculares gaming',
    'auriculares inalambricos',
    'auriculares con cable',
    'auriculares deportivos',
  ],
  'Base refrigerante': [
    'base refrigerante laptop',
    'base refrigerante gaming',
  ],
  'combo teclado y mouse': [
    'COMBO TECLADO Y MOUSE',
    'combo inalambrico',
    'combo gaming',
    'combo office',
  ],
  'DIADEMA GAMER': [
    'DIADEMA',
    'diadema gaming',
    'diadema rgb',
  ],
  'Diadema para pc': [
    'diadema office',
    'diadema call center',
  ],
  'disco duro': [
    'disco duro interno',
    'disco duro externo',
    'disco duro SSD',
    'disco duro 1TB',
    'disco duro 2TB',
  ],
  'impresora': [
    'impresora laser',
    'impresora multifuncional',
    'impresora tinta',
    'impresora hp',
    'impresora epson',
  ],
  'lector de targetas': [
    'lector de targetas USB',
    'lector SD',
    'lector microSD',
  ],
  'mouse': [
    'MOUSE',
    'mouse gaming',
    'mouse inalambrico',
    'mouse optico',
    'mouse bluetooth',
  ],
  'parlante': [
    'parlante bluetooth',
    'parlantes para pc',
    'parlante portatil',
  ],
  'Portatil': [
    'portatil',
    'portatil gamer',
    'portatil hp',
    'portatil lenovo',
    'portatil asus',
  ],
  'Power Bank': [
    'Power Bank',
    'bateria portatil',
    'cargador portatil',
  ],
  'router': [
    'router wifi',
    'router modem',
    'router gaming',
  ],
  'teclado': [
    'teclado',
    'teclado gamer',
    'teclado genius',
    'teclado mecanico',
    'teclado inalambrico',
  ],
  'tinta': [
    'tinta',
    'tinta generica',
    'tinta hp',
    'tinta epson',
    'tinta canon',
  ],
  'tone': [
    'tone',
  ],
  'toner': [
    'toner',
    'toner generico',
    'toner hp',
    'toner brother',
    'toner samsung',
  ],
}

// Función helper para obtener subcategorías
export function getSubcategories(category: string): string[] {
  return SHOPIFY_SUBCATEGORIES[category] || []
}

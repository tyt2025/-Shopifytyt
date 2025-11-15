-- =====================================================
-- AGREGAR COLUMNA DE TAXONOMÍA DE SHOPIFY
-- Versión 1.0.6
-- Tintas y Tecnología
-- =====================================================

-- 1. AGREGAR COLUMNA DE TAXONOMÍA
-- =====================================================

ALTER TABLE productos 
  ADD COLUMN IF NOT EXISTS shopify_taxonomy_category TEXT DEFAULT '';

-- 2. ACTUALIZAR VALORES NULL A VACÍO
-- =====================================================

UPDATE productos 
SET shopify_taxonomy_category = '' 
WHERE shopify_taxonomy_category IS NULL;

-- 3. CREAR ÍNDICE PARA MEJOR RENDIMIENTO
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_productos_taxonomy 
ON productos(shopify_taxonomy_category);

-- 4. VERIFICAR LA COLUMNA
-- =====================================================

SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'productos' 
  AND column_name = 'shopify_taxonomy_category';

-- 5. VER ESTRUCTURA COMPLETA DE LA TABLA
-- =====================================================

SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'productos'
ORDER BY ordinal_position;

-- =====================================================
-- EJEMPLOS DE CATEGORÍAS DE TAXONOMÍA SHOPIFY
-- =====================================================

/*
EJEMPLOS DE CATEGORÍAS PARA PRODUCTOS DE TECNOLOGÍA:

Computadores y Tablets:
- Electronics > Computers > Desktop Computers
- Electronics > Computers > Laptop Computers
- Electronics > Computers > Tablet Computers

Accesorios de Computador:
- Electronics > Computers > Computer Accessories > Computer Cables & Adapters
- Electronics > Computers > Computer Accessories > Keyboards
- Electronics > Computers > Computer Accessories > Mice & Trackballs
- Electronics > Computers > Computer Accessories > Monitor Accessories

Componentes de Computador:
- Electronics > Computers > Computer Components > Computer Memory (RAM)
- Electronics > Computers > Computer Components > Storage Devices > Hard Drives
- Electronics > Computers > Computer Components > Graphics Cards
- Electronics > Computers > Computer Components > Computer Fans & Cooling

Impresoras y Accesorios:
- Electronics > Print, Copy, Scan & Fax > Printers
- Electronics > Print, Copy, Scan & Fax > Printer Consumables > Ink & Toner Cartridges
- Electronics > Print, Copy, Scan & Fax > Scanners

Redes y Conectividad:
- Electronics > Networking > Network Cables
- Electronics > Networking > Routers
- Electronics > Networking > Switches
- Electronics > Networking > USB & FireWire Hubs

Audio y Video:
- Electronics > Audio > Headphones & Headsets
- Electronics > Audio > Speakers
- Electronics > Audio > Audio Cables & Adapters
- Electronics > Video > Projectors

Cámaras y Vigilancia:
- Electronics > Cameras & Optics > Cameras > Digital Cameras
- Electronics > Cameras & Optics > Cameras > Security Cameras

Energía:
- Electronics > Power > UPS (Uninterruptible Power Supply)
- Electronics > Power > Power Cables & Adapters
- Electronics > Power > Battery Chargers

Almacenamiento:
- Electronics > Computers > Computer Components > Storage Devices > External Hard Drives
- Electronics > Computers > Computer Components > Storage Devices > USB Flash Drives
- Electronics > Computers > Computer Components > Storage Devices > Memory Cards
*/

-- =====================================================
-- NOTAS DE IMPLEMENTACIÓN
-- =====================================================

/*
✅ CÓMO USAR LAS CATEGORÍAS:

1. La categoría debe seguir el formato jerárquico de Shopify:
   Nivel 1 > Nivel 2 > Nivel 3 > Nivel 4 (opcional)

2. Ejemplos correctos:
   - "Electronics > Computers > Laptop Computers"
   - "Electronics > Audio > Headphones & Headsets"
   - "Electronics > Networking > Network Cables"

3. Las categorías ayudan a:
   - Calcular impuestos correctamente
   - Mejorar la búsqueda en Shopify
   - Sincronizar con Google Shopping y Facebook
   - Activar metacampos específicos automáticamente

4. Recursos para encontrar categorías:
   - Explorador interactivo: https://shopify.github.io/product-taxonomy/
   - Repositorio GitHub: https://github.com/Shopify/product-taxonomy
   - Archivo completo: https://raw.githubusercontent.com/Shopify/product-taxonomy/refs/heads/main/dist/en.txt

📊 PRÓXIMOS PASOS:

1. Ejecuta este SQL en tu base de datos Supabase
2. Actualiza tu aplicación con los nuevos archivos
3. Asigna categorías a tus productos
4. Publica en Shopify para activar los metacampos automáticos
*/

-- ============================================================================
-- SCRIPT SQL PARA CORREGIR TABLA productos
-- Dashboard Shopify v1.0.3 - Tintas y Tecnología
-- ============================================================================

-- Este script agrega las columnas necesarias para el dashboard si no existen

-- ----------------------------------------------------------------------------
-- PASO 1: Verificar columnas actuales
-- ----------------------------------------------------------------------------
-- Ejecuta esto primero para ver qué columnas ya tienes:

SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'productos'
  AND table_schema = 'public'
ORDER BY ordinal_position;


-- ----------------------------------------------------------------------------
-- PASO 2: Agregar columnas SI NO EXISTEN
-- ----------------------------------------------------------------------------

-- Agregar columna shopify_category (si no existe)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'productos' 
        AND column_name = 'shopify_category'
    ) THEN
        ALTER TABLE productos 
        ADD COLUMN shopify_category TEXT;
        
        RAISE NOTICE 'Columna shopify_category agregada';
    ELSE
        RAISE NOTICE 'Columna shopify_category ya existe';
    END IF;
END $$;

-- Agregar columna shopify_subcategory (si no existe)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'productos' 
        AND column_name = 'shopify_subcategory'
    ) THEN
        ALTER TABLE productos 
        ADD COLUMN shopify_subcategory TEXT;
        
        RAISE NOTICE 'Columna shopify_subcategory agregada';
    ELSE
        RAISE NOTICE 'Columna shopify_subcategory ya existe';
    END IF;
END $$;

-- Agregar columna etiquetas (array de texto, si no existe)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'productos' 
        AND column_name = 'etiquetas'
    ) THEN
        ALTER TABLE productos 
        ADD COLUMN etiquetas TEXT[] DEFAULT '{}';
        
        RAISE NOTICE 'Columna etiquetas agregada';
    ELSE
        RAISE NOTICE 'Columna etiquetas ya existe';
    END IF;
END $$;

-- Agregar columna colecciones (array de texto, si no existe)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'productos' 
        AND column_name = 'colecciones'
    ) THEN
        ALTER TABLE productos 
        ADD COLUMN colecciones TEXT[] DEFAULT '{}';
        
        RAISE NOTICE 'Columna colecciones agregada';
    ELSE
        RAISE NOTICE 'Columna colecciones ya existe';
    END IF;
END $$;


-- ----------------------------------------------------------------------------
-- PASO 3: Verificar que todo se agregó correctamente
-- ----------------------------------------------------------------------------

SELECT 
    column_name,
    data_type,
    CASE 
        WHEN column_name IN ('shopify_category', 'shopify_subcategory', 'etiquetas', 'colecciones')
        THEN '✅ REQUERIDO'
        ELSE ''
    END as status
FROM information_schema.columns
WHERE table_name = 'productos'
  AND table_schema = 'public'
  AND column_name IN (
    'id', 'product_name', 'brand', 'price_cop', 'available_stock', 
    'image_url_png', 'shopify_category', 'shopify_subcategory', 
    'etiquetas', 'colecciones', 'updated_at'
  )
ORDER BY 
    CASE 
        WHEN column_name = 'id' THEN 1
        WHEN column_name = 'product_name' THEN 2
        WHEN column_name = 'brand' THEN 3
        WHEN column_name = 'price_cop' THEN 4
        WHEN column_name = 'available_stock' THEN 5
        WHEN column_name = 'image_url_png' THEN 6
        WHEN column_name = 'shopify_category' THEN 7
        WHEN column_name = 'shopify_subcategory' THEN 8
        WHEN column_name = 'etiquetas' THEN 9
        WHEN column_name = 'colecciones' THEN 10
        WHEN column_name = 'updated_at' THEN 11
        ELSE 99
    END;


-- ----------------------------------------------------------------------------
-- PASO 4: (Opcional) Inicializar valores por defecto
-- ----------------------------------------------------------------------------

-- Establecer valores por defecto para registros existentes
UPDATE productos 
SET 
    shopify_category = COALESCE(shopify_category, ''),
    shopify_subcategory = COALESCE(shopify_subcategory, ''),
    etiquetas = COALESCE(etiquetas, '{}'),
    colecciones = COALESCE(colecciones, '{}')
WHERE shopify_category IS NULL 
   OR shopify_subcategory IS NULL
   OR etiquetas IS NULL
   OR colecciones IS NULL;


-- ----------------------------------------------------------------------------
-- RESUMEN DE COLUMNAS REQUERIDAS
-- ----------------------------------------------------------------------------
-- El dashboard v1.0.3 necesita estas columnas en la tabla productos:
--
-- ✅ BÁSICAS (ya deberías tenerlas):
--    - id (uuid/bigint)
--    - product_name (text)
--    - sku (text)
--    - brand (text)
--    - price_cop (numeric)
--    - available_stock (integer)
--    - image_url_png (text)
--    - updated_at (timestamptz)
--
-- ✅ PARA SHOPIFY (agregadas por este script):
--    - shopify_category (text)
--    - shopify_subcategory (text)
--    - etiquetas (text[])
--    - colecciones (text[])
--
-- Si alguna de las columnas básicas no existe, el dashboard mostrará errores.
-- ----------------------------------------------------------------------------

-- Script para agregar campos de Shopify a la tabla productos
-- Ejecutar en el SQL Editor de Supabase si no tienes estos campos

-- Agregar campos para integración con Shopify
ALTER TABLE productos 
ADD COLUMN IF NOT EXISTS shopify_category TEXT,
ADD COLUMN IF NOT EXISTS shopify_subcategory TEXT,
ADD COLUMN IF NOT EXISTS shopify_product_id TEXT,
ADD COLUMN IF NOT EXISTS shopify_published BOOLEAN DEFAULT FALSE;

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_productos_shopify_published 
ON productos(shopify_published);

CREATE INDEX IF NOT EXISTS idx_productos_shopify_product_id 
ON productos(shopify_product_id);

-- Verificar que los campos se crearon correctamente
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns
WHERE table_name = 'productos' 
AND column_name IN ('shopify_category', 'shopify_subcategory', 'shopify_product_id', 'shopify_published')
ORDER BY column_name;

-- =====================================================
-- CONFIGURACIÓN DE BASE DE DATOS PARA SHOPIFY DASHBOARD
-- Tintas y Tecnología
-- =====================================================

-- 1. CREAR TABLA DE PRODUCTOS (si no existe)
-- =====================================================

CREATE TABLE IF NOT EXISTS productos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  sku TEXT NOT NULL UNIQUE,
  marca TEXT DEFAULT 'Sin marca',
  precio DECIMAL(10,2) DEFAULT 0,
  stock INTEGER DEFAULT 0,
  imagen_url TEXT,
  descripcion TEXT,
  tipo_producto TEXT DEFAULT '',
  etiquetas TEXT[] DEFAULT ARRAY[]::TEXT[],
  colecciones TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. AGREGAR COLUMNAS A TABLA EXISTENTE (si ya tienes productos)
-- =====================================================

ALTER TABLE productos 
  ADD COLUMN IF NOT EXISTS tipo_producto TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS etiquetas TEXT[] DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS colecciones TEXT[] DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Actualizar valores NULL a valores por defecto
UPDATE productos SET marca = 'Sin marca' WHERE marca IS NULL;
UPDATE productos SET precio = 0 WHERE precio IS NULL;
UPDATE productos SET stock = 0 WHERE stock IS NULL;
UPDATE productos SET tipo_producto = '' WHERE tipo_producto IS NULL;
UPDATE productos SET etiquetas = ARRAY[]::TEXT[] WHERE etiquetas IS NULL;
UPDATE productos SET colecciones = ARRAY[]::TEXT[] WHERE colecciones IS NULL;

-- 3. CREAR ÍNDICES PARA MEJOR RENDIMIENTO
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_productos_sku ON productos(sku);
CREATE INDEX IF NOT EXISTS idx_productos_tipo ON productos(tipo_producto);
CREATE INDEX IF NOT EXISTS idx_productos_created ON productos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_productos_precio ON productos(precio);
CREATE INDEX IF NOT EXISTS idx_productos_stock ON productos(stock);

-- 4. CONFIGURAR POLÍTICAS DE SEGURIDAD (RLS)
-- =====================================================

-- Habilitar Row Level Security
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas antiguas si existen
DROP POLICY IF EXISTS "Enable read access for all users" ON productos;
DROP POLICY IF EXISTS "Enable update access for all users" ON productos;
DROP POLICY IF EXISTS "Enable insert access for all users" ON productos;

-- Política para lectura pública (todos pueden leer)
CREATE POLICY "Enable read access for all users" 
ON productos FOR SELECT 
USING (true);

-- Política para actualización pública (todos pueden actualizar)
-- ⚠️ En producción, deberías agregar autenticación
CREATE POLICY "Enable update access for all users" 
ON productos FOR UPDATE 
USING (true);

-- Política para inserción (opcional)
CREATE POLICY "Enable insert access for all users" 
ON productos FOR INSERT 
WITH CHECK (true);

-- 5. FUNCIÓN PARA ACTUALIZAR updated_at AUTOMÁTICAMENTE
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. TRIGGER PARA AUTO-ACTUALIZAR updated_at
-- =====================================================

DROP TRIGGER IF EXISTS update_productos_updated_at ON productos;

CREATE TRIGGER update_productos_updated_at 
BEFORE UPDATE ON productos 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- 7. VALIDACIONES Y CONSTRAINTS
-- =====================================================

-- Asegurar que precio y stock nunca sean negativos
ALTER TABLE productos 
  ADD CONSTRAINT precio_no_negativo CHECK (precio >= 0),
  ADD CONSTRAINT stock_no_negativo CHECK (stock >= 0);

-- 8. VERIFICAR LA ESTRUCTURA
-- =====================================================

-- Ver estructura de la tabla
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'productos'
ORDER BY ordinal_position;

-- Ver políticas de seguridad
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'productos';

-- Contar productos
SELECT COUNT(*) as total_productos FROM productos;

-- Ver productos con valores NULL (no debería haber ninguno después de las correcciones)
SELECT id, nombre, 
  CASE WHEN marca IS NULL THEN 'NULL' ELSE 'OK' END as marca_status,
  CASE WHEN precio IS NULL THEN 'NULL' ELSE 'OK' END as precio_status,
  CASE WHEN stock IS NULL THEN 'NULL' ELSE 'OK' END as stock_status
FROM productos
WHERE marca IS NULL OR precio IS NULL OR stock IS NULL;

-- =====================================================
-- DATOS DE EJEMPLO (OPCIONAL)
-- =====================================================
-- Descomenta solo si necesitas productos de prueba

/*
INSERT INTO productos (nombre, sku, marca, precio, stock, tipo_producto, etiquetas, colecciones) VALUES
('Cable de red Ethernet Cat6 10m', 'NW-CBL-C6-10M', 'Genérico', 65000, 10, 'cable RED', ARRAY['ethernet', 'cat6', 'red'], ARRAY['Cables de Red']),
('Cable de audio 3.5mm 5m', 'AU-CBL-1X1-50', 'Genérico', 18000, 5, 'cable AUDIO', ARRAY['audio', '3.5mm'], ARRAY['Cables y convertidores']),
('Cable de poder C7', 'PWR-PWC-GEN', 'Genérico', 10000, 20, 'cable PODER', ARRAY['poder', 'c7'], ARRAY['Cables y convertidores']),
('Mouse inalámbrico USB', 'PER-MOU-WIFI', 'Genérico', 25000, 15, 'mouse', ARRAY['mouse', 'inalámbrico'], ARRAY['Mouse']),
('Teclado mecánico RGB', 'PER-KEY-RGB', 'Genérico', 150000, 8, 'teclado', ARRAY['teclado', 'mecánico'], ARRAY['Teclados']);
*/

-- =====================================================
-- NOTAS FINALES
-- =====================================================

/*
✅ CORRECCIONES APLICADAS:
- Valores NULL en precio/stock ahora son 0 por defecto
- Valores NULL en marca ahora son 'Sin marca' por defecto
- Valores NULL en arrays ahora son arrays vacíos
- Agregados índices para mejor rendimiento
- Agregadas validaciones para evitar valores negativos

🔒 SEGURIDAD:
- Las políticas actuales permiten acceso público
- Para producción, implementa autenticación con Supabase Auth
- Restringe las políticas solo a usuarios autenticados

📊 PRÓXIMOS PASOS:
1. Verifica que la tabla existe y tiene la estructura correcta
2. Confirma que las políticas RLS están activas
3. Asegúrate de tener productos en la tabla
4. Configura las variables de entorno en Vercel
*/

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
  marca TEXT,
  precio DECIMAL(10,2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  imagen_url TEXT,
  descripcion TEXT,
  tipo_producto TEXT,
  etiquetas TEXT[],
  colecciones TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. AGREGAR COLUMNAS A TABLA EXISTENTE (si ya tienes productos)
-- =====================================================
-- Ejecuta estos comandos si ya tienes una tabla productos

ALTER TABLE productos ADD COLUMN IF NOT EXISTS tipo_producto TEXT;
ALTER TABLE productos ADD COLUMN IF NOT EXISTS etiquetas TEXT[];
ALTER TABLE productos ADD COLUMN IF NOT EXISTS colecciones TEXT[];
ALTER TABLE productos ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 3. CREAR ÍNDICES PARA MEJOR RENDIMIENTO
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_productos_sku ON productos(sku);
CREATE INDEX IF NOT EXISTS idx_productos_tipo ON productos(tipo_producto);
CREATE INDEX IF NOT EXISTS idx_productos_created ON productos(created_at DESC);

-- 4. CONFIGURAR POLÍTICAS DE SEGURIDAD (RLS)
-- =====================================================

-- Habilitar Row Level Security
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;

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

-- 7. DATOS DE EJEMPLO (OPCIONAL)
-- =====================================================
-- Descomenta para insertar productos de prueba

/*
INSERT INTO productos (nombre, sku, marca, precio, stock, tipo_producto, etiquetas, colecciones) VALUES
('Cable de red Ethernet Cat6 certificado 10 m', 'NW-CBL-C6-10M-CERT', 'Genérico', 65000, 10, 'cable RED', ARRAY['cable red', 'ethernet', 'cat6'], ARRAY['Cables de Red']),
('Cable de audio 1x1 5 m 3.5 mm macho a macho', 'AU-CBL-1X1-50', 'Genérico', 18000, 5, 'cable AUDIO', ARRAY['cable audio', '3.5mm'], ARRAY['Cables y convertidores']),
('Cable de poder tipo grabadora con conector C7', 'PWR-PWC-GEN-10553', 'Genérico', 10000, 20, 'cable PODER', ARRAY['cable poder', 'grabadora'], ARRAY['Cables y convertidores']),
('Mouse inalámbrico USB', 'PER-MOU-WIFI-001', 'Genérico', 25000, 15, 'mouse', ARRAY['mouse', 'inalámbrico', 'usb'], ARRAY['Mouse']),
('Teclado mecánico RGB', 'PER-KEY-RGB-001', 'Genérico', 150000, 8, 'teclado', ARRAY['teclado', 'mecánico', 'rgb'], ARRAY['Teclados']);
*/

-- 8. VERIFICAR LA ESTRUCTURA
-- =====================================================
-- Ejecuta esto para verificar que todo esté correcto

-- Ver estructura de la tabla
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'productos'
ORDER BY ordinal_position;

-- Ver políticas de seguridad
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'productos';

-- Contar productos
SELECT COUNT(*) as total_productos FROM productos;

-- =====================================================
-- NOTAS IMPORTANTES
-- =====================================================

/*
SEGURIDAD EN PRODUCCIÓN:
- Las políticas actuales permiten acceso público
- Para producción, implementa autenticación con Supabase Auth
- Restringe las políticas solo a usuarios autenticados

EJEMPLO DE POLÍTICA CON AUTENTICACIÓN:
CREATE POLICY "Enable update for authenticated users only" 
ON productos FOR UPDATE 
USING (auth.role() = 'authenticated');

BACKUP:
- Siempre haz backup de tu base de datos antes de hacer cambios
- Usa pg_dump o las herramientas de backup de Supabase

MIGRACIONES:
- Guarda cada cambio en archivos SQL separados
- Usa herramientas de migración para ambientes de desarrollo/producción
*/

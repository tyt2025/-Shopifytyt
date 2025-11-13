# 🗄️ Configuración de Supabase

## Estructura de la tabla `productos`

Tu tabla ya existe y se llama `productos`. Esta es su estructura:

```sql
-- La tabla productos ya existe con esta estructura:
CREATE TABLE IF NOT EXISTS public.productos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_name TEXT NOT NULL,
  description TEXT,
  price_cop NUMERIC(10, 2),
  price NUMERIC(10, 2),
  brand TEXT,
  category TEXT,
  category_sub TEXT,
  image_url_png TEXT,
  main_image_url TEXT,
  sku TEXT UNIQUE,
  available_stock INTEGER DEFAULT 0,
  warranty_months INTEGER,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  short_description TEXT,
  shopify_product_id TEXT,
  shopify_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar el rendimiento (si no existen)
CREATE INDEX IF NOT EXISTS idx_productos_product_name ON public.productos(product_name);
CREATE INDEX IF NOT EXISTS idx_productos_brand ON public.productos(brand);
CREATE INDEX IF NOT EXISTS idx_productos_sku ON public.productos(sku);
CREATE INDEX IF NOT EXISTS idx_productos_shopify_published ON public.productos(shopify_published);

-- Habilitar Row Level Security (RLS) si no está habilitado
ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;

-- Política para permitir lectura a todos
CREATE POLICY IF NOT EXISTS "Permitir lectura a todos"
  ON public.productos
  FOR SELECT
  TO public
  USING (true);

-- Política para permitir inserción a usuarios autenticados
CREATE POLICY IF NOT EXISTS "Permitir inserción a autenticados"
  ON public.productos
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Política para permitir actualización a usuarios autenticados
CREATE POLICY IF NOT EXISTS "Permitir actualización a autenticados"
  ON public.productos
  FOR UPDATE
  TO authenticated
  USING (true);
```

## Campos de la tabla

| Campo | Tipo | Descripción | Obligatorio | Migra a Shopify |
|-------|------|-------------|-------------|-----------------|
| `id` | UUID | Identificador único | ✅ Sí | No |
| `product_name` | TEXT | Nombre del producto | ✅ Sí | ✅ Como título |
| `description` | TEXT | Descripción del producto | ❌ No | ✅ Como body_html |
| `price_cop` | NUMERIC | Precio en pesos colombianos | ❌ No | ✅ Como variant price |
| `price` | NUMERIC | Precio alternativo | ❌ No | ✅ Como variant price |
| `brand` | TEXT | Marca del producto | ❌ No | ✅ Como vendor |
| `category` | TEXT | Categoría (NO SE MIGRA) | ❌ No | ❌ No se usa |
| `category_sub` | TEXT | Subcategoría (NO SE MIGRA) | ❌ No | ❌ No se usa |
| `image_url_png` | TEXT | URL imagen PNG | ❌ No | ✅ Como imagen |
| `main_image_url` | TEXT | URL imagen principal | ❌ No | ✅ Como imagen |
| `sku` | TEXT | SKU único | ❌ No | ✅ Como variant SKU |
| `available_stock` | INTEGER | Stock disponible | ❌ No | ✅ Como inventory |
| `warranty_months` | INTEGER | Meses de garantía | ❌ No | No |
| `is_active` | BOOLEAN | Producto activo | ❌ No | No |
| `is_featured` | BOOLEAN | Producto destacado | ❌ No | No |
| `short_description` | TEXT | Descripción corta | ❌ No | ✅ Para SEO |
| `shopify_product_id` | TEXT | ID en Shopify | ❌ No | ✅ Se actualiza |
| `shopify_published` | BOOLEAN | Ya publicado | ❌ No | ✅ Se actualiza |
| `created_at` | TIMESTAMP | Fecha de creación | ✅ Auto | No |
| `updated_at` | TIMESTAMP | Fecha actualización | ✅ Auto | No |

## Verificar que la tabla funciona

```sql
-- Ver todos los productos
SELECT * FROM public.productos ORDER BY product_name;

-- Contar productos
SELECT COUNT(*) FROM public.productos;

-- Ver productos por marca
SELECT brand, COUNT(*) as cantidad 
FROM public.productos 
GROUP BY brand 
ORDER BY cantidad DESC;

-- Ver productos sin SKU
SELECT product_name, brand 
FROM public.productos 
WHERE sku IS NULL;

-- Ver productos activos
SELECT product_name, brand, price_cop, available_stock
FROM public.productos
WHERE is_active = true
ORDER BY product_name;

-- Ver productos ya publicados en Shopify
SELECT product_name, brand, shopify_product_id
FROM public.productos
WHERE shopify_published = true;
```

## Actualizar productos existentes

```sql
-- Agregar marca a productos sin marca
UPDATE public.productos 
SET brand = 'Sin marca' 
WHERE brand IS NULL OR brand = '';

-- Agregar SKU automático basado en ID
UPDATE public.productos 
SET sku = 'PROD-' || id::TEXT 
WHERE sku IS NULL;

-- Establecer stock en 0 para productos sin stock
UPDATE public.productos 
SET available_stock = 0 
WHERE available_stock IS NULL;

-- Activar todos los productos
UPDATE public.productos 
SET is_active = true 
WHERE is_active IS NULL;

-- Marcar productos como no publicados
UPDATE public.productos 
SET shopify_published = false 
WHERE shopify_published IS NULL;
```

## Migración desde otra tabla

Si ya tienes productos en otra tabla con nombres diferentes:

```sql
-- Ejemplo: migrar desde una tabla llamada 'productos'
INSERT INTO public.products (nombre, descripcion, precio, marca, sku, stock)
SELECT 
  product_name as nombre,
  product_description as descripcion,
  product_price as precio,
  product_brand as marca,
  product_code as sku,
  product_quantity as stock
FROM public.productos;
```

## Troubleshooting

### Error: "relation 'productos' does not exist"
- Verifica que estés usando la base de datos correcta.
- La tabla debe llamarse exactamente `productos` (en minúsculas).

### Error: "permission denied for table productos"
- Verifica las políticas RLS.
- Asegúrate de que el usuario anon tenga permisos de lectura.

### Error: "duplicate key value violates unique constraint"
- Ya existe un producto con ese SKU.
- Los SKU deben ser únicos.

### Error: "column 'nombre' does not exist"
- La tabla usa `product_name` no `nombre`.
- Verifica que estés usando los nombres correctos de columnas.

## Respaldo de datos

```sql
-- Exportar todos los productos a JSON
SELECT json_agg(row_to_json(productos)) 
FROM public.productos;
```

---

**¿Necesitas ayuda con Supabase?**
- [Documentación oficial](https://supabase.com/docs)
- [SQL Editor en Dashboard](https://app.supabase.com)

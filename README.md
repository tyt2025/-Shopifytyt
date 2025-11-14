# 🚀 Dashboard Shopify v1.0.2 - Tintas y Tecnología

## ✨ Versión 1.0.2 - CORRECCIONES IMPORTANTES

Esta versión corrige problemas críticos de la v1.0.1:

### 🔧 Problemas Resueltos:
- ✅ **Nombres de columnas corregidos**: Ahora usa `product_name`, `brand`, `image_url_png` (coincide con Supabase)
- ✅ **67 categorías completas**: Extraídas del CSV real de Shopify (antes solo 16)
- ✅ **Imágenes visibles**: Ya no muestra "Sin img" en todos los productos
- ✅ **Nombres visibles**: Ya no muestra "Sin nombre" en todos los productos
- ✅ **Marcas visibles**: Ya no muestra "Sin marca" en todos los productos
- ✅ **Precios y stock reales**: Muestra valores correctos desde Supabase

---

## 📋 Descripción

Dashboard para gestionar y publicar productos masivamente en Shopify desde tu base de datos Supabase.

### Características:
- 📊 Vista de todos tus productos de Supabase
- ✏️ Edición de campos directamente en la tabla
- 🏷️ Asignación de categorías, etiquetas y colecciones por producto
- ☑️ Selección masiva con checkboxes
- 🚀 Publicación masiva en Shopify
- 💾 Guardado individual por producto

---

## 🗂️ Estructura del Proyecto

```
shopify-dashboard-v1.0.2/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx              # Página principal con carga de productos
├── components/
│   └── ProductsTable.tsx     # Tabla de productos con edición
├── lib/
│   └── supabase.ts          # Cliente de Supabase
├── types/
│   └── product.ts           # Tipos TypeScript y categorías
├── public/
│   └── ...
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
└── README.md
```

---

## 🔧 Configuración

### 1. Requisitos Previos

- Cuenta de **Supabase** con una tabla `productos`
- Cuenta de **GitHub** para el código
- Cuenta de **Vercel** para el despliegue

### 2. Estructura de la Tabla Supabase

Tu tabla `productos` debe tener estas columnas:

```sql
CREATE TABLE productos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  sku TEXT NOT NULL,
  product_name TEXT NOT NULL,           -- ✅ IMPORTANTE: No "nombre"
  brand TEXT,                           -- ✅ IMPORTANTE: No "marca"
  price_cop NUMERIC,                    -- ✅ IMPORTANTE: No "precio"
  available_stock INTEGER,              -- ✅ IMPORTANTE: No "stock"
  image_url_png TEXT,                   -- ✅ IMPORTANTE: No "imagen_url"
  shopify_category TEXT,                -- ✅ IMPORTANTE: No "tipo_producto"
  shopify_subcategory TEXT,
  description TEXT,
  category TEXT,
  category_sub TEXT,
  warranty_months INTEGER,
  pages_approx INTEGER,
  main_image_url TEXT,
  images JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  short_description TEXT,
  category_id INTEGER,
  subcategory_id INTEGER,
  exento_iva BOOLEAN DEFAULT false,
  shopify_product_id TEXT,
  shopify_published BOOLEAN DEFAULT false,
  etiquetas TEXT[] DEFAULT '{}',        -- Array de etiquetas
  colecciones TEXT[] DEFAULT '{}'       -- Array de colecciones
);
```

### 3. Storage de Supabase (Opcional)

Si usas Supabase Storage para imágenes:

```sql
-- Crear bucket público
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true);

-- Política de acceso público
CREATE POLICY "Public Access" ON storage.objects 
FOR SELECT USING (bucket_id = 'product-images');
```

---

## 🚀 Despliegue

### Paso 1: Subir a GitHub

```bash
# Inicializar repositorio
git init
git add .
git commit -m "Initial commit - shopify-dashboard v1.0.2"

# Crear repositorio en GitHub y subir
git remote add origin https://github.com/tu-usuario/shopify-dashboard.git
git branch -M main
git push -u origin main
```

### Paso 2: Desplegar en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Click en "New Project"
3. Importa tu repositorio de GitHub
4. Agrega las variables de entorno:

```
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

5. Click en "Deploy"
6. Espera 2-3 minutos

¡Listo! Tu dashboard estará en: `https://tu-proyecto.vercel.app`

---

## 📊 Uso del Dashboard

### 1. Editar Productos

Cada fila de la tabla es editable:

- **Tipo de producto**: Campo de texto libre
- **Etiquetas**: Separadas por comas (ej: "cable red, ethernet")
- **Colecciones**: Dropdown con 67 categorías de Shopify

### 2. Guardar Cambios

Click en el botón "Guardar" de cada producto para guardar en Supabase.

### 3. Publicación Masiva

1. Selecciona productos con los checkboxes
2. Click en "Publicar seleccionados (N)"
3. Confirma la acción

---

## 🎯 Categorías de Shopify (67 Total)

El dashboard incluye 67 categorías extraídas del CSV real de Shopify:

```
adaptador, auriculares, base tv, Base refrigerante, Baterías,
cable audio, cable de audio, cable de celular, cable hdmi,
cable RED, cable vga, cables, cajon monedero, camara,
camara de seguridad, camara web, carga, CARGADOR, cartucho,
combo gamer, combo teclado y mouse, computador, Computadores,
control, convertidor, convertidores, DIADEMA GAMER,
Diadema para pc, disco duro, DVR, escáner, etiquetas adhesivas,
fundas para portatil, impresora, lector de codigo de barras,
lector de targetas, lápiz óptico, memoria Ram, Memoria Usb,
micro sd, MONITOR, mouse, Pad mouse, pantalla, papel Adhesivos,
parlante, Pasta termica, Portatil, Power Bank, Proyector,
Redes y Vigilancia, Regulador de voltaje, router, splitter,
switch, swtch de red, Tablet, tarjeta de red usb, Tarjeta Grafica,
teclado, tinta, Todo en uno, tone, toner, tv box, Ups,
Video y Tablets
```

---

## 🔍 Solución de Problemas

### Problema: No se muestran productos

**Causa**: Las variables de entorno no están configuradas

**Solución**:
1. Ve a Vercel → Project Settings → Environment Variables
2. Verifica que `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` existan
3. Redeployea el proyecto

### Problema: Productos muestran "Sin nombre"

**Causa**: La tabla de Supabase no tiene la columna `product_name`

**Solución**:
1. Ve a Supabase → Table Editor → productos
2. Verifica que exista la columna `product_name`
3. Si no existe, renombra `nombre` a `product_name`:
   ```sql
   ALTER TABLE productos RENAME COLUMN nombre TO product_name;
   ```

### Problema: Imágenes no se cargan

**Causas posibles**:
1. Storage no está configurado
2. Bucket no es público
3. URLs incorrectas

**Solución**:
```sql
-- Verificar política de acceso público
SELECT * FROM storage.policies WHERE bucket_id = 'product-images';

-- Si no existe, crear política pública
CREATE POLICY "Public Access" ON storage.objects 
FOR SELECT USING (bucket_id = 'product-images');
```

### Problema: "Error de conexión" al cargar

**Causa**: Credenciales de Supabase incorrectas

**Solución**:
1. Ve a Supabase → Project Settings → API
2. Copia la URL del proyecto
3. Copia la Anon key
4. Actualiza en Vercel → Environment Variables
5. Redeployea

---

## 🆕 Cambios en v1.0.2

### Mejoras Principales:

1. **Nombres de Columnas Corregidos**
   - `nombre` → `product_name`
   - `marca` → `brand`
   - `imagen_url` → `image_url_png`
   - `precio` → `price_cop`
   - `stock` → `available_stock`
   - `tipo_producto` → `shopify_category`

2. **67 Categorías Agregadas**
   - Extraídas del CSV real de productos Shopify
   - Reemplaza las 16 categorías hardcodeadas anteriores

3. **Archivos Modificados**
   - `types/product.ts`: Interfaz actualizada + 67 categorías
   - `components/ProductsTable.tsx`: Usa nombres de columnas correctos
   - `app/page.tsx`: Sanitización con nombres correctos

---

## 📚 Documentación Adicional

- **CORRECCIONES-v1.0.2.md**: Explicación detallada de todos los cambios
- **COMPARACION-VISUAL.txt**: Comparación visual antes/después
- **Este README.md**: Documentación completa

---

## 🤝 Soporte

Si tienes problemas:

1. Revisa la consola del navegador (F12) para errores
2. Verifica las credenciales de Supabase en Vercel
3. Confirma que la tabla `productos` existe y tiene las columnas correctas
4. Verifica que el Storage esté configurado correctamente

---

## 📝 Licencia

Proyecto privado - Tintas y Tecnología

---

## 🎉 ¡Listo!

Tu dashboard ahora:
- ✅ Muestra nombres, imágenes y marcas reales
- ✅ Tiene 67 categorías completas de Shopify
- ✅ Permite edición individual y masiva
- ✅ Está 100% sincronizado con Supabase
- ✅ Listo para producción

**¡Feliz gestión de productos!** 🚀

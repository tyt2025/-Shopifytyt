# 🚀 Dashboard Shopify - Tintas y Tecnología

Dashboard para migrar productos de Supabase a Shopify con generación automática de SEO mediante IA.

## ✨ Características

✅ **Migración de productos** desde Supabase a Shopify
✅ **Selección múltiple** de productos para publicación masiva
✅ **Campos automáticos**: 
- Proveedor (marca del producto desde Supabase)
- Descripción (desde Supabase)
- Metacampo Google Condición (siempre "nuevo")

✅ **Campos manuales**:
- Tipo de producto (obligatorio)
- Etiquetas (tags)
- Colecciones de Shopify (máximo 3)

✅ **IA para SEO**: Genera automáticamente título y meta descripción optimizados con OpenAI
✅ **Detección de duplicados**: No publica productos que ya existen en Shopify
✅ **Interfaz moderna**: Dashboard intuitivo con Tailwind CSS

## 📋 Requisitos previos

- Cuenta de GitHub
- Cuenta de Vercel
- Cuenta de OpenAI con API key (para generación de SEO)
- Base de datos Supabase con tabla `products`
- Tienda Shopify configurada

## 🗄️ Estructura de la tabla Supabase

Tu tabla `productos` debe tener estos campos:

```sql
CREATE TABLE productos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_name TEXT NOT NULL,
  description TEXT,
  price_cop NUMERIC,
  price NUMERIC,
  brand TEXT,
  category TEXT,
  category_sub TEXT,
  image_url_png TEXT,
  main_image_url TEXT,
  sku TEXT,
  available_stock INTEGER DEFAULT 0,
  warranty_months INTEGER,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  short_description TEXT,
  shopify_product_id TEXT,
  shopify_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🚀 Despliegue en Vercel

### Paso 1: Subir a GitHub

1. Ve a tu repositorio: https://github.com/tyt2025/-Shopifytyt
2. Sube todos los archivos del proyecto
3. Asegúrate de que la estructura esté así:

```
shopify-supabase-dashboard/
├── app/
│   ├── api/
│   │   ├── generate-seo/
│   │   │   └── route.ts
│   │   ├── publish-to-shopify/
│   │   │   └── route.ts
│   │   └── shopify-collections/
│   │       └── route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── shopify.ts
│   ├── supabase.ts
│   └── types.ts
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

### Paso 2: Conectar con Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Clic en **"Add New Project"**
3. Importa tu repositorio de GitHub
4. Vercel detectará automáticamente que es Next.js

### Paso 3: Configurar variables de entorno

En la configuración del proyecto en Vercel, agrega estas variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://cxxifwpwarbrrodtzyqn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4eGlmd3B3YXJicnJvZHR6eXFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMjc5OTAsImV4cCI6MjA3MzgwMzk5MH0.tMgoakEvw8wsvrWZpRClZo3BpiUIJ4OQrQsiM4BGM54

SHOPIFY_ADMIN_API_TOKEN=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
SHOPIFY_API_KEY=2e2dde1c252c5e8ab3d4e71f0b6f234a
SHOPIFY_API_SECRET=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
SHOPIFY_STORE_DOMAIN=tn8gd1-v1.myshopify.com

OPENAI_API_KEY=tu_openai_api_key_aqui
```

### Paso 4: Deploy

1. Clic en **"Deploy"**
2. Espera a que termine el build (2-3 minutos)
3. ¡Listo! Tu dashboard estará disponible en tu URL de Vercel

## 📖 Cómo usar el dashboard

### 1. Seleccionar productos

- Marca los checkboxes de los productos que quieres publicar
- O usa "Seleccionar todos" para marcar todos

### 2. Configurar campos manuales

**Tipo** (Obligatorio):
- Ingresa el tipo de producto (ej: "Electrónica", "Computadoras", "Accesorios")

**Etiquetas** (Opcional):
- Escribe las etiquetas separadas por comas
- Ejemplo: `tecnología, nuevo, oferta, promoción`

**Colecciones** (Opcional):
- Selecciona hasta 3 colecciones de Shopify donde aparecerá el producto
- Las colecciones se cargan automáticamente desde tu tienda

### 3. Generar SEO con IA (Opcional)

- Clic en **"Generar SEO con IA"**
- La IA creará automáticamente:
  - Título SEO optimizado (máximo 60 caracteres)
  - Meta descripción atractiva (máximo 160 caracteres)
- Estos se usarán en la publicación para mejorar el posicionamiento

### 4. Publicar a Shopify

- Clic en **"Publicar en Shopify"**
- El sistema:
  ✅ Verifica que el producto no exista (por SKU o título)
  ✅ Crea el producto con todos los campos configurados
  ✅ Asigna el producto a las colecciones seleccionadas
  ✅ Agrega metafield de condición Google: "nuevo"
  ✅ Aplica el SEO generado con IA (si se generó)

### Campos automáticos que se completan:

- **Proveedor**: Se llena automáticamente con `brand` de Supabase
- **Descripción**: Se copia automáticamente desde `description`
- **Precio**: Se toma de `price_cop` o `price`
- **SKU**: Se toma de `sku`
- **Stock**: Se toma de `available_stock`
- **Imagen**: Se importa desde `main_image_url` o `image_url_png`
- **Condición Google**: Siempre se establece como "nuevo"

## 🛠️ Personalización

### Cambiar el modelo de IA

En `app/api/generate-seo/route.ts`, línea 28:

```typescript
model: 'gpt-4', // Puedes cambiar a 'gpt-3.5-turbo' para ser más económico
```

### Modificar campos de Supabase

Si tu tabla tiene nombres de campos diferentes, edita `lib/supabase.ts` y `lib/types.ts`

### Agregar más metafields

En `app/api/publish-to-shopify/route.ts`, agrega más metafields al array `variants.metafields`:

```typescript
metafields: [
  {
    namespace: 'custom',
    key: 'google_condition',
    value: 'nuevo',
    type: 'single_line_text_field',
  },
  // Agrega más aquí
],
```

## 🔧 Desarrollo local (opcional)

Si quieres probar localmente antes de subir a Vercel:

```bash
# Instalar dependencias
npm install

# Crear archivo .env con tus variables
cp .env.example .env

# Ejecutar en desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## 📝 Notas importantes

1. **API de OpenAI**: Necesitas una API key de OpenAI con créditos para generar SEO
2. **Límite de colecciones**: Máximo 3 colecciones por producto
3. **Duplicados**: El sistema no publicará productos que ya existen en Shopify
4. **Categorías**: Las categorías de Supabase (`category` y `category_sub`) NO se migran (como solicitaste)
5. **Tabla**: La tabla en Supabase debe llamarse `productos` (no `products`)

## 🐛 Solución de problemas

### Error: "No se pueden cargar productos"
- Verifica que tu tabla Supabase se llame `productos` (no `products`)
- Revisa que las variables `NEXT_PUBLIC_SUPABASE_*` estén correctas
- Verifica que los campos existan: `product_name`, `brand`, `description`, etc.

### Error: "Error al publicar en Shopify"
- Verifica tus credenciales de Shopify
- Asegúrate de que el dominio no incluya `https://`

### Error: "Error al generar SEO"
- Verifica tu API key de OpenAI
- Verifica que tengas créditos disponibles

## 📧 Soporte

Para más información sobre la API de Shopify:
- [Documentación Shopify Admin API](https://shopify.dev/docs/api/admin-rest)

Para Supabase:
- [Documentación Supabase](https://supabase.com/docs)

---

Desarrollado con ❤️ por **Tintas y Tecnología**

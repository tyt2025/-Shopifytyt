# Dashboard Supabase → Shopify

Dashboard para gestionar y publicar productos de Supabase a Shopify con mapeo de categorías personalizado.

## 🚀 Características

- ✅ Vista completa de productos de Supabase
- ✅ Mapeo de categorías de Supabase a Shopify
- ✅ Publicación masiva o individual de productos
- ✅ Búsqueda y filtrado por categorías
- ✅ Gestión de estado de publicación
- ✅ Interfaz moderna con Tailwind CSS
- ✅ 100% compatible con GitHub y Vercel

## 📋 Requisitos Previos

1. **Cuenta de GitHub** para alojar el repositorio
2. **Cuenta de Vercel** para desplegar el proyecto
3. **Supabase**: Base de datos configurada con tabla `productos`
4. **Shopify**: Tienda con API configurada

## 🔧 Configuración en Vercel

### 1. Subir a GitHub

```bash
# Inicializar repositorio
git init
git add .
git commit -m "Initial commit"

# Conectar con tu repositorio de GitHub
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
git push -u origin main
```

### 2. Desplegar en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Importa tu repositorio de GitHub
3. Configura las siguientes **Variables de Entorno**:

```env
NEXT_PUBLIC_SUPABASE_URL=https://cxxifwpwarbrrodtzyqn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key

SHOPIFY_STORE_DOMAIN=tu-tienda.myshopify.com
SHOPIFY_ADMIN_TOKEN=shpat_tu_token_aqui
SHOPIFY_API_KEY=tu_api_key_aqui
SHOPIFY_API_SECRET=tu_api_secret_aqui
```

4. Haz clic en **Deploy**

## 📦 Variables de Entorno

### Supabase
- `NEXT_PUBLIC_SUPABASE_URL`: URL de tu proyecto Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Clave anónima de Supabase

### Shopify
- `SHOPIFY_STORE_DOMAIN`: Dominio de tu tienda (ej: `mi-tienda.myshopify.com`)
- `SHOPIFY_ADMIN_TOKEN`: Token de acceso de la API Admin
- `SHOPIFY_API_KEY`: Clave API de Shopify
- `SHOPIFY_API_SECRET`: Clave secreta de Shopify

## 🎯 Uso del Dashboard

### 1. Ver Productos
- El dashboard muestra todos los productos activos de Supabase
- Usa la búsqueda para encontrar productos por nombre o SKU
- Filtra por categorías de Supabase

### 2. Configurar Categorías Shopify
1. Haz clic en el ícono de editar (✏️) en un producto
2. Asigna una **Categoría Shopify** (obligatorio)
3. Opcionalmente, asigna una **Subcategoría Shopify**
4. Guarda los cambios

### 3. Publicar a Shopify
1. Selecciona uno o más productos usando los checkboxes
2. Asegúrate de que tengan categoría Shopify asignada
3. Haz clic en **Publicar a Shopify**
4. El sistema:
   - Crea los productos en Shopify
   - Usa las categorías como Product Type y Tags
   - Carga las imágenes
   - Actualiza el estado en Supabase

### 4. Estado de Publicación
- 🟢 **Publicado**: El producto ya existe en Shopify
- ⚫ **Sin publicar**: El producto aún no está en Shopify

## 📊 Estructura de Datos

### Campos de Supabase (tabla `productos`)

El dashboard lee los siguientes campos:

- `sku`: Código único del producto
- `product_name`: Nombre del producto
- `description`: Descripción completa
- `price` / `price_cop`: Precio
- `brand`: Marca
- `category` / `category_sub`: Categorías de Supabase
- `main_image_url` / `image_url_png`: Imágenes
- `available_stock`: Stock disponible
- `shopify_product_id`: ID del producto en Shopify (auto)
- `shopify_published`: Estado de publicación (auto)
- `shopify_category`: Categoría para Shopify (manual)
- `shopify_subcategory`: Subcategoría para Shopify (manual)

### Campos Enviados a Shopify

```json
{
  "title": "Nombre del producto",
  "body_html": "Descripción del producto",
  "vendor": "Marca",
  "product_type": "Categoría Shopify",
  "tags": ["Categoria", "Subcategoria"],
  "variants": [{
    "price": "precio",
    "sku": "sku",
    "inventory_quantity": stock
  }],
  "images": [{ "src": "url_imagen" }]
}
```

## 🔐 Seguridad

- Las credenciales están en variables de entorno de Vercel
- Nunca hagas commit de archivos `.env` o `.env.local`
- Las claves de Shopify solo se usan en el servidor (API routes)

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Estilos**: Tailwind CSS
- **Base de datos**: Supabase
- **E-commerce**: Shopify API
- **Despliegue**: Vercel
- **Repositorio**: GitHub

## 📝 Notas Importantes

1. **No trabajes en localhost**: Todo se gestiona directamente en GitHub y Vercel
2. **Actualiza variables**: Si cambias tokens, actualízalos en Vercel
3. **Productos duplicados**: El sistema previene publicar dos veces el mismo producto
4. **Categorías requeridas**: Asigna categorías Shopify antes de publicar
5. **Imágenes**: Deben estar públicamente accesibles en Supabase Storage

## 🆘 Solución de Problemas

### Error: "No se puede conectar a Supabase"
- Verifica las variables `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Error: "Error al publicar productos"
- Revisa que `SHOPIFY_ADMIN_TOKEN` sea válido
- Verifica que el dominio en `SHOPIFY_STORE_DOMAIN` sea correcto

### Error: "Producto ya publicado"
- El producto tiene un `shopify_product_id` en Supabase
- No se puede volver a publicar (protección contra duplicados)

## 📞 Contacto

**Tintas y Tecnología**  
Dashboard desarrollado para gestión de productos Supabase → Shopify

---

✨ **Listo para usar en GitHub y Vercel**

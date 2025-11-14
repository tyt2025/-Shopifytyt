# 🚀 ACTUALIZACIÓN A v1.0.4 - PUBLICACIÓN A SHOPIFY

## ✨ NUEVO EN v1.0.4

Esta versión implementa la **publicación REAL a Shopify**:

### ✅ Características Nuevas:

1. **API Route para Shopify**
   - Endpoint: `/api/shopify/publish`
   - Conecta con Shopify Admin API
   - Crea productos directamente en tu tienda

2. **Publicación Masiva Real**
   - Selecciona múltiples productos
   - Click "Publicar seleccionados"
   - Los productos aparecen en Shopify automáticamente

3. **Manejo de Resultados**
   - Muestra productos publicados exitosamente
   - Lista errores específicos si algo falla
   - Desmarca productos publicados

4. **Validaciones Mejoradas**
   - Verifica credenciales antes de publicar
   - Valida datos del producto
   - Logs detallados en consola

---

## 📦 ARCHIVOS NUEVOS

```
shopify-dashboard-v1.0.4/
├── app/
│   └── api/
│       └── shopify/
│           └── publish/
│               └── route.ts          ← NUEVO - API de publicación
├── components/
│   └── ProductsTable.tsx             ← ACTUALIZADO
├── CONFIGURAR-SHOPIFY.md             ← NUEVO - Guía de variables
└── GUIA-ACTUALIZACION-v1.0.4.md      ← Este archivo
```

---

## 🔄 CÓMO ACTUALIZAR (15 minutos)

### PASO 1: Agregar Columnas en Supabase (si no lo hiciste en v1.0.3)

Si ya aplicaste v1.0.3, **SALTA este paso**.

Si vienes de v1.0.2 o anterior, ejecuta en Supabase SQL Editor:

```sql
-- Agregar shopify_category
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'productos' AND column_name = 'shopify_category'
    ) THEN
        ALTER TABLE productos ADD COLUMN shopify_category TEXT;
    END IF;
END $$;

-- Agregar shopify_subcategory
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'productos' AND column_name = 'shopify_subcategory'
    ) THEN
        ALTER TABLE productos ADD COLUMN shopify_subcategory TEXT;
    END IF;
END $$;

-- Agregar etiquetas
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'productos' AND column_name = 'etiquetas'
    ) THEN
        ALTER TABLE productos ADD COLUMN etiquetas TEXT[] DEFAULT '{}';
    END IF;
END $$;

-- Agregar colecciones
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'productos' AND column_name = 'colecciones'
    ) THEN
        ALTER TABLE productos ADD COLUMN colecciones TEXT[] DEFAULT '{}';
    END IF;
END $$;
```

---

### PASO 2: Actualizar Código en GitHub (5 min)

```bash
cd tu-repositorio

# Eliminar archivos viejos
rm -rf app/api/ components/

# Copiar archivos nuevos de v1.0.4
# (extrae shopify-dashboard-v1.0.4.zip y copia)

# Commit y push
git add .
git commit -m "Add Shopify publish functionality v1.0.4"
git push
```

---

### PASO 3: Configurar Variables en Vercel (5 min)

1. **Ve a Vercel:**
   - [vercel.com/dashboard](https://vercel.com/dashboard)
   - Tu proyecto → Settings → Environment Variables

2. **Agrega estas 2 variables NUEVAS:**

**Variable 1:**
```
Key:   SHOPIFY_STORE_DOMAIN
Value: tn8gd1-v1.myshopify.com
Environments: ✅ Production ✅ Preview ✅ Development
```

**Variable 2:**
```
Key:   SHOPIFY_ACCESS_TOKEN
Value: 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
Environments: ✅ Production ✅ Preview ✅ Development
```

3. **Click "Save" en cada una**

**Importante:** 
- Las variables de Supabase (`NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`) ya deben estar configuradas
- NO pongas `NEXT_PUBLIC_` en las variables de Shopify (son privadas)

---

### PASO 4: Redeploy (2 min)

1. Ve a **Deployments** (pestaña superior)
2. Click en el último deployment
3. Click **"..."** (3 puntos) → **"Redeploy"**
4. Espera 2-3 minutos

---

### PASO 5: Probar Publicación (3 min)

1. **Abre tu dashboard**
2. **Selecciona un producto** de prueba
3. **Edita:**
   - Tipo de producto: "test"
   - Etiquetas: "prueba, test"
4. **Click "Guardar"**
5. **Marca el checkbox del producto**
6. **Click "Publicar seleccionados (1)"**
7. **Confirma**

**Resultado esperado:**
```
✅ Publicación completada:
• Publicados: 1
• Fallidos: 0

Productos publicados:
✓ Nombre del Producto (ID: 8765432109876)
```

8. **Verifica en Shopify:**
   - Ve a tu [Shopify Admin](https://tn8gd1-v1.myshopify.com/admin)
   - Products → Verás el producto nuevo

---

## 🔍 FLUJO DE PUBLICACIÓN

```
┌─────────────────────────────────────────────────────────────┐
│ 1. USUARIO SELECCIONA PRODUCTOS                             │
│    - Edita tipo, etiquetas, colecciones                     │
│    - Guarda cada producto                                   │
│    - Marca checkboxes                                       │
│    - Click "Publicar seleccionados"                         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. FRONTEND (ProductsTable.tsx)                             │
│    - Valida que todos tengan tipo de producto               │
│    - Confirma con el usuario                                │
│    - Envía POST a /api/shopify/publish                      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. API ROUTE (route.ts)                                     │
│    - Valida credenciales de Shopify                         │
│    - Para cada producto:                                    │
│      • Prepara datos en formato Shopify                     │
│      • POST a Shopify Admin API                             │
│      • Recibe ID del producto creado                        │
│    - Retorna resultados y errores                           │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. SHOPIFY ADMIN API                                        │
│    - Recibe datos del producto                              │
│    - Crea producto en la tienda                             │
│    - Asigna ID, handle, etc.                                │
│    - Retorna producto creado                                │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. FRONTEND MUESTRA RESULTADOS                              │
│    - Lista productos publicados (✓)                         │
│    - Lista errores si los hay (✗)                           │
│    - Desmarca productos exitosos                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 COMPARACIÓN DE VERSIONES

| Característica | v1.0.3 | v1.0.4 |
|----------------|--------|--------|
| Guardar productos | ✅ | ✅ |
| Editar productos | ✅ | ✅ |
| 67 categorías | ✅ | ✅ |
| Publicar a Shopify | ❌ Simulado | ✅ Real |
| API Route | ❌ | ✅ |
| Validación de credenciales | ❌ | ✅ |
| Resultados detallados | ❌ | ✅ |
| Manejo de errores | Básico | ✅ Avanzado |

---

## ✅ VERIFICACIÓN POST-ACTUALIZACIÓN

### Checklist Dashboard:

□ Los productos se cargan correctamente
□ Las imágenes se muestran
□ Los nombres y marcas son correctos
□ Puedes editar tipo, etiquetas y colecciones
□ El botón "Guardar" funciona
□ El botón "Publicar seleccionados" está activo

### Checklist Publicación:

□ Seleccionas productos
□ Click "Publicar seleccionados"
□ Aparece confirmación
□ Muestra "Publicando..." mientras procesa
□ Muestra resultado: "Publicados: X, Fallidos: Y"
□ Los productos aparecen en Shopify Admin
□ Los productos publicados se desmarcan

### Checklist Errores:

Abre la consola (F12) y verifica:

□ No hay errores en rojo
□ Ves logs: "📤 Publicando productos..."
□ Ves logs: "✅ Respuesta de Shopify"
□ Si hay error, muestra mensaje específico

---

## 🆘 SOLUCIÓN DE PROBLEMAS

### Error: "Credenciales de Shopify no configuradas"

**Causa:** Falta SHOPIFY_STORE_DOMAIN o SHOPIFY_ACCESS_TOKEN

**Solución:**
1. Vercel → Settings → Environment Variables
2. Agrega las 2 variables
3. Redeploy

### Error: "Invalid API credentials"

**Causa:** El token es incorrecto o expiró

**Solución:**
1. Ve a Shopify Admin → Apps → "Develop apps"
2. Tu app → API credentials
3. Copia el "Admin API access token"
4. Actualiza en Vercel
5. Redeploy

### Error: "Failed to fetch"

**Causa:** El dominio de Shopify es incorrecto

**Solución:**
Verifica que sea: `tn8gd1-v1.myshopify.com` (sin https://)

### Productos no aparecen en Shopify

**Causa 1:** El producto se publicó pero está en "Draft"

**Solución:** 
- Ve a Shopify → Products → Filters
- Cambia "Active" a "All"

**Causa 2:** Error silencioso en la API

**Solución:**
- Abre consola (F12)
- Busca logs de error
- Reporta el error

---

## 📝 ESTRUCTURA DE PRODUCTO EN SHOPIFY

Cuando publicas un producto, se crea en Shopify con:

```json
{
  "title": "product_name",
  "body_html": "description",
  "vendor": "brand",
  "product_type": "shopify_category",
  "tags": "etiquetas + colecciones",
  "variants": [{
    "price": "price_cop",
    "sku": "sku",
    "inventory_quantity": "available_stock"
  }],
  "images": [{
    "src": "image_url_png"
  }],
  "status": "active"
}
```

---

## 🎯 RESULTADO FINAL

Con v1.0.4 completamente configurado:

✅ **Dashboard Completo:**
- Carga productos desde Supabase
- Muestra imágenes, nombres, marcas
- 67 categorías de Shopify
- Edición individual de campos
- Guardado en Supabase funcional

✅ **Publicación a Shopify:**
- Selección masiva de productos
- Validación de datos
- Envío a Shopify Admin API
- Creación de productos en tienda
- Resultados detallados
- Manejo de errores específicos

✅ **Flujo Completo:**
```
Supabase → Dashboard → Editar → Guardar → Seleccionar → Publicar → Shopify
```

¡Sistema completamente funcional end-to-end! 🎉

---

## 📚 ARCHIVOS DE REFERENCIA

Lee en este orden:

1. **Este archivo** (GUIA-ACTUALIZACION-v1.0.4.md) - Ya lo leíste ✅
2. **CONFIGURAR-SHOPIFY.md** - Detalles de variables de entorno
3. **README.md** - Documentación completa del proyecto

---

¡Listo para publicar productos en Shopify! 🚀

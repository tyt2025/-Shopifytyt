# 🚀 GUÍA RÁPIDA DE DESPLIEGUE

## Paso 1: Subir a GitHub

1. Ve a https://github.com/new
2. Crea un nuevo repositorio (ej: `shopify-dashboard`)
3. Descomprime el ZIP en tu computadora
4. Abre Git Bash o Terminal en la carpeta del proyecto
5. Ejecuta:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
git push -u origin main
```

## Paso 2: Desplegar en Vercel

1. Ve a https://vercel.com
2. Haz clic en **"New Project"**
3. Importa tu repositorio de GitHub
4. En **Environment Variables**, agrega:

```
NEXT_PUBLIC_SUPABASE_URL=https://cxxifwpwarbrrodtzyqn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4eGlmd3B3YXJicnJvZHR6eXFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMjc5OTAsImV4cCI6MjA3MzgwMzk5MH0.tMgoakEvw8wsvrWZpRClZo3BpiUIJ4OQrQsiM4BGM54

SHOPIFY_STORE_DOMAIN=tn8gd1-v1.myshopify.com
SHOPIFY_ADMIN_TOKEN=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
SHOPIFY_API_KEY=2e2dde1c252c5e8ab3d4e71f0b6f234a
SHOPIFY_API_SECRET=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
```

5. Haz clic en **Deploy**
6. Espera 2-3 minutos

## Paso 3: Usar el Dashboard

1. Abre la URL de tu proyecto en Vercel (ej: `https://tu-proyecto.vercel.app`)
2. Verás tu dashboard con los productos de Supabase
3. Para publicar productos:
   - Haz clic en ✏️ para asignar categorías Shopify
   - Selecciona los productos con checkboxes
   - Haz clic en **Publicar a Shopify**

## ⚠️ IMPORTANTE

### ✅ Todo está configurado:

1. ✅ **Dominio de Shopify**: tn8gd1-v1.myshopify.com
2. ✅ **Tabla `productos`** configurada en Supabase
3. ✅ **Tokens de Shopify** incluidos

### Si algo no funciona:

1. Revisa las variables de entorno en Vercel
2. Verifica los logs en la pestaña **Deployments → Logs**
3. Asegúrate de que tu tabla Supabase tenga los campos:
   - `shopify_category` (text)
   - `shopify_subcategory` (text)
   - `shopify_product_id` (text)
   - `shopify_published` (boolean)

### Agregar campos faltantes en Supabase:

Si no tienes estos campos, ve al SQL Editor de Supabase y ejecuta:

```sql
ALTER TABLE productos 
ADD COLUMN IF NOT EXISTS shopify_category TEXT,
ADD COLUMN IF NOT EXISTS shopify_subcategory TEXT,
ADD COLUMN IF NOT EXISTS shopify_product_id TEXT,
ADD COLUMN IF NOT EXISTS shopify_published BOOLEAN DEFAULT FALSE;
```

## 🎉 ¡Listo!

Tu dashboard está funcionando. Ahora puedes:
- Ver tus productos de Supabase
- Asignar categorías para Shopify
- Publicar productos masivamente
- Gestionar el inventario

---

**¿Necesitas ayuda?** Revisa el README.md completo

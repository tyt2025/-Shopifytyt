# 🚀 Guía Rápida de Despliegue

## Pasos para subir a GitHub y Vercel

### 1️⃣ Subir a GitHub

```bash
# Si ya tienes el repositorio clonado localmente:
git add .
git commit -m "Initial commit: Shopify Dashboard"
git push origin main

# Si no, sube los archivos manualmente:
```

1. Ve a https://github.com/tyt2025/-Shopifytyt
2. Sube todos los archivos del ZIP
3. Asegúrate de incluir TODOS los archivos y carpetas

### 2️⃣ Conectar con Vercel

1. **Ir a Vercel**: https://vercel.com
2. **Iniciar sesión** con tu cuenta
3. **Clic en "Add New Project"**
4. **Importar de GitHub**:
   - Selecciona tu repositorio `-Shopifytyt`
5. **Framework Preset**: Next.js (se detecta automáticamente)
6. **Root Directory**: `./` (dejar por defecto)

### 3️⃣ Agregar Variables de Entorno

En la página de configuración del proyecto, antes de hacer deploy, agrega estas variables:

**⚠️ IMPORTANTE: Copia y pega exactamente como están aquí**

```
NEXT_PUBLIC_SUPABASE_URL
https://cxxifwpwarbrrodtzyqn.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4eGlmd3B3YXJicnJvZHR6eXFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMjc5OTAsImV4cCI6MjA3MzgwMzk5MH0.tMgoakEvw8wsvrWZpRClZo3BpiUIJ4OQrQsiM4BGM54

SHOPIFY_ADMIN_API_TOKEN
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

SHOPIFY_API_KEY
2e2dde1c252c5e8ab3d4e71f0b6f234a

SHOPIFY_API_SECRET
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

SHOPIFY_STORE_DOMAIN
tn8gd1-v1.myshopify.com

OPENAI_API_KEY
sk-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

**🔑 Nota sobre OpenAI API Key:**
- Necesitas obtener tu propia API key de OpenAI
- Ve a: https://platform.openai.com/api-keys
- Crea una nueva API key
- Cópiala y pégala en `OPENAI_API_KEY`

### 4️⃣ Deploy

1. **Clic en "Deploy"**
2. Espera 2-3 minutos mientras se construye
3. ¡Listo! Tu dashboard estará en línea

Tu URL será algo como: `https://tu-proyecto.vercel.app`

## 📋 Checklist Pre-Deploy

- [ ] Todos los archivos subidos a GitHub
- [ ] Repositorio accesible desde Vercel
- [ ] Variables de entorno configuradas (TODAS)
- [ ] API key de OpenAI creada y agregada
- [ ] Tabla `productos` existe en Supabase (no `products`)

## ⚠️ Errores Comunes

### "Build failed"
- Verifica que todos los archivos estén en GitHub
- Revisa que `package.json` esté presente

### "Environment variable missing"
- Asegúrate de agregar TODAS las variables de entorno
- Copia exactamente como están (sin espacios extra)

### "Cannot connect to Supabase"
- Verifica las URLs de Supabase
- Asegúrate de que comience con `https://`

### "Shopify API error"
- Verifica el dominio de Shopify (sin `https://`)
- Verifica los tokens de acceso

## 🔄 Actualizar el Dashboard

Cuando hagas cambios:

```bash
git add .
git commit -m "Descripción del cambio"
git push origin main
```

Vercel automáticamente detectará los cambios y redesplegará.

## 🆘 Ayuda

Si tienes problemas:
1. Revisa los logs en Vercel (pestaña "Deployments")
2. Verifica las variables de entorno
3. Asegúrate de que la tabla Supabase tenga la estructura correcta

---

**¡Éxito con tu dashboard! 🎉**

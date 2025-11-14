# 🔐 CONFIGURACIÓN DE VARIABLES DE ENTORNO v1.0.4

## ✅ VARIABLES REQUERIDAS

Para que la publicación a Shopify funcione, necesitas agregar estas variables en Vercel:

### 1. Variables de Supabase (Ya las tienes)
```
NEXT_PUBLIC_SUPABASE_URL=https://cxxifwpwarbrrodtzyqn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4eGlmd3B3YXJicnJvZHR6eXFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMjc5OTAsImV4cCI6MjA3MzgwMzk5MH0.tMgoakEvw8wsvrWZpRClZo3BpiUIJ4OQrQsiM4BGM54
```

### 2. Variables de Shopify (NUEVAS - AGREGAR)
```
SHOPIFY_STORE_DOMAIN=tn8gd1-v1.myshopify.com
SHOPIFY_ACCESS_TOKEN=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
```

---

## 🚀 CÓMO AGREGAR EN VERCEL (5 minutos)

### Paso 1: Ir a Vercel

1. Ve a [vercel.com/dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto: **-Shopifytyt**
3. Click en **"Settings"**
4. Click en **"Environment Variables"** (menú izquierdo)

### Paso 2: Agregar Variables

Para cada variable:

1. Click en **"Add New"** o **"Add Variable"**
2. **Key**: Escribe el nombre (ej: `SHOPIFY_STORE_DOMAIN`)
3. **Value**: Pega el valor (ej: `tn8gd1-v1.myshopify.com`)
4. **Environment**: Selecciona **"Production"**, **"Preview"** y **"Development"**
5. Click **"Save"**

### Variables a Agregar:

#### Variable 1:
```
Key:   SHOPIFY_STORE_DOMAIN
Value: tn8gd1-v1.myshopify.com
```

#### Variable 2:
```
Key:   SHOPIFY_ACCESS_TOKEN
Value: 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
```

### Paso 3: Redeploy

Después de agregar las variables:

1. Ve a **"Deployments"** (pestaña superior)
2. Click en el último deployment
3. Click en **"..."** (3 puntos)
4. Click en **"Redeploy"**
5. Espera 2-3 minutos

---

## ✅ VERIFICACIÓN

### Opción 1: Desde Vercel UI

1. Ve a Settings → Environment Variables
2. Verifica que veas estas 4 variables:
   - ✅ NEXT_PUBLIC_SUPABASE_URL
   - ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
   - ✅ SHOPIFY_STORE_DOMAIN
   - ✅ SHOPIFY_ACCESS_TOKEN

### Opción 2: Probando la Publicación

1. Abre tu dashboard
2. Edita un producto (agrega tipo, etiquetas)
3. Guarda el producto
4. Selecciona el producto (checkbox)
5. Click "Publicar seleccionados"

**Si todo está bien:**
```
✅ Publicación completada:
• Publicados: 1
• Fallidos: 0

Productos publicados:
✓ Nombre del Producto (ID: 1234567890)
```

**Si faltan variables:**
```
❌ Error al publicar productos:
Credenciales de Shopify no configuradas
```

---

## 📊 TABLA DE VARIABLES

| Variable | Tipo | Valor | Dónde se usa |
|----------|------|-------|--------------|
| NEXT_PUBLIC_SUPABASE_URL | Pública | https://cxxifwpwarbrrodtzyqn... | Frontend (cargar productos) |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Pública | eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... | Frontend (cargar productos) |
| SHOPIFY_STORE_DOMAIN | Privada | tn8gd1-v1.myshopify.com | API (publicar productos) |
| SHOPIFY_ACCESS_TOKEN | Privada | shpat_b5da2238a1c8d2d18f4db... | API (publicar productos) |

**Importante:** 
- Las variables `NEXT_PUBLIC_*` son públicas (visibles en el navegador)
- Las variables sin `NEXT_PUBLIC_` son privadas (solo en el servidor)
- **NUNCA** pongas el access token con `NEXT_PUBLIC_` - eso lo haría público

---

## 🔒 SEGURIDAD

### ✅ Buenas Prácticas

1. **Access Token es privado**
   - Solo se usa en el servidor (API routes)
   - No se expone al navegador
   - No tiene el prefijo `NEXT_PUBLIC_`

2. **Variables en .env.local (desarrollo local)**
   Si trabajas localmente, crea `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://cxxifwpwarbrrodtzyqn.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SHOPIFY_STORE_DOMAIN=tn8gd1-v1.myshopify.com
   SHOPIFY_ACCESS_TOKEN=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
   ```

3. **Nunca commitear credenciales**
   - `.env.local` está en `.gitignore`
   - Las credenciales solo van en Vercel
   - No las subas a GitHub

### ❌ Errores Comunes

**Error 1:** Usar `NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN`
```
❌ MAL  - Esto expone el token en el navegador
✅ BIEN - SHOPIFY_ACCESS_TOKEN (sin NEXT_PUBLIC_)
```

**Error 2:** Olvidar redeploy después de agregar variables
```
Las variables nuevas no se cargan hasta que redeployeas
```

**Error 3:** Espacios en el valor
```
❌ MAL  - " shpat_b5da2238..."  (espacios al inicio)
✅ BIEN - "shpat_b5da2238..."    (sin espacios)
```

---

## 🆘 SOLUCIÓN DE PROBLEMAS

### Error: "Credenciales de Shopify no configuradas"

**Causa:** Las variables no están en Vercel o tienen nombres incorrectos

**Solución:**
1. Ve a Vercel → Settings → Environment Variables
2. Verifica que los nombres sean exactos:
   - `SHOPIFY_STORE_DOMAIN` (no shopify_domain o SHOPIFY_DOMAIN)
   - `SHOPIFY_ACCESS_TOKEN` (no shopify_token)
3. Redeploy

### Error: "Invalid API credentials"

**Causa:** El token de acceso es incorrecto o expiró

**Solución:**
1. Ve a Shopify Admin → Apps → "Develop apps"
2. Tu app → API credentials
3. Verifica el "Admin API access token"
4. Si cambió, actualiza en Vercel
5. Redeploy

### Error: "403 Forbidden"

**Causa:** El token no tiene permisos suficientes

**Solución:**
1. Ve a Shopify Admin → Apps → Tu app
2. Configuration → Admin API integration
3. Verifica que tenga permisos de:
   - `write_products`
   - `read_products`
   - `write_inventory`
4. Guarda y actualiza el token si es necesario

---

## 📝 CHECKLIST

Antes de probar la publicación:

□ Variables de Supabase agregadas
□ SHOPIFY_STORE_DOMAIN agregado (sin https://)
□ SHOPIFY_ACCESS_TOKEN agregado (empieza con shpat_)
□ Redeployeado desde Vercel
□ Esperado 2-3 minutos
□ Refrescado el dashboard
□ Probado publicar 1 producto

---

## ✨ RESULTADO ESPERADO

Con las variables correctamente configuradas:

```
Dashboard → Seleccionar producto → Publicar

↓

📤 Enviando a Shopify...

↓

✅ Publicación completada:
• Publicados: 1
• Fallidos: 0

Productos publicados:
✓ Lector de tarjetas micro sd (ID: 8765432109876)
```

Y en Shopify Admin:
```
Products → Verás el producto recién creado
```

---

## 🎯 RESUMEN

**Acción:** Agregar 2 variables en Vercel
**Tiempo:** 5 minutos
**Resultado:** Publicación a Shopify funcional

**Variables:**
1. SHOPIFY_STORE_DOMAIN = tn8gd1-v1.myshopify.com
2. SHOPIFY_ACCESS_TOKEN = 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

**Siguiente paso:** Redeploy y probar publicación

¡Todo listo para publicar en Shopify! 🚀

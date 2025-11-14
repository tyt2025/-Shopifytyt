# 🚀 Guía de Despliegue - Shopify Dashboard

## Para Luis - Tintas y Tecnología
**Trabajo exclusivo con GitHub y Vercel (sin localhost)**

---

## ⚠️ IMPORTANTE: Error Corregido

Esta versión corrige el error:
```
TypeError: Cannot read properties of undefined (reading 'toLocaleString')
```

**Causa**: Productos con valores NULL en `precio` o `stock`

**Solución**: Manejo automático de valores NULL/undefined en el código

---

## 📦 PASO 1: Preparar Supabase

### 1.1 Configurar la Base de Datos

1. Ve a tu proyecto en Supabase: https://app.supabase.com
2. Haz clic en **SQL Editor** en el menú lateral
3. Crea una nueva query y pega **TODO** el contenido del archivo `database-setup.sql`
4. Ejecuta el script completo (botón RUN)

> ⚠️ **MUY IMPORTANTE**: El script incluye correcciones para valores NULL. Esto previene errores en la aplicación.

### 1.2 Verificar Corrección de Datos

Después de ejecutar el script, verifica que no haya valores NULL:

```sql
-- Ejecuta esto para verificar
SELECT id, nombre, precio, stock, marca
FROM productos
WHERE precio IS NULL OR stock IS NULL OR marca IS NULL;
```

Si este query retorna filas, ejecuta de nuevo la sección 2 del script.

### 1.3 Obtener Credenciales

1. Ve a **Settings** → **API** en Supabase
2. Copia estos dos valores (los necesitarás para Vercel):
   - **Project URL** → Será tu `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → Será tu `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 1.4 Verificar Datos

1. Ve a **Table Editor** → **productos**
2. Verifica que tengas productos en la tabla
3. Verifica que ningún producto tenga valores NULL en precio o stock

---

## 🐙 PASO 2: Subir a GitHub

### 2.1 Crear Repositorio en GitHub

1. Ve a https://github.com/tyt2025
2. Haz clic en **New repository**
3. Nombre: `shopify-dashboard`
4. Descripción: `Dashboard para publicación masiva en Shopify`
5. Selecciona **Private** (recomendado)
6. **NO** marques "Initialize with README" (ya lo tenemos)
7. Haz clic en **Create repository**

### 2.2 Subir el Código

#### Opción A: Desde GitHub Web (Más fácil)

1. En tu repositorio recién creado, haz clic en **uploading an existing file**
2. Arrastra **TODOS** los archivos y carpetas del proyecto
3. Escribe un mensaje: "Initial commit: Shopify Dashboard v1.0.1"
4. Haz clic en **Commit changes**

#### Opción B: Desde Terminal

```bash
cd /ruta/al/proyecto/shopify-dashboard
git init
git add .
git commit -m "Initial commit: Shopify Dashboard v1.0.1"
git remote add origin https://github.com/tyt2025/shopify-dashboard.git
git branch -M main
git push -u origin main
```

---

## ☁️ PASO 3: Desplegar en Vercel

### 3.1 Conectar GitHub con Vercel

1. Ve a https://vercel.com e inicia sesión
2. Haz clic en **Add New** → **Project**
3. Selecciona **Import Git Repository**
4. Busca y selecciona tu repositorio `tyt2025/shopify-dashboard`

### 3.2 Configurar el Proyecto

1. **Framework Preset**: Next.js (se detecta automáticamente)
2. **Root Directory**: ./ (dejar por defecto)
3. **Build Command**: `npm run build` (por defecto)
4. **Output Directory**: `.next` (por defecto)

### 3.3 Agregar Variables de Entorno

🔴 **MUY IMPORTANTE**: En la sección **Environment Variables**:

```
NEXT_PUBLIC_SUPABASE_URL = tu_url_de_supabase_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY = tu_clave_anon_de_supabase_aqui
```

**Ejemplo:**
```
NEXT_PUBLIC_SUPABASE_URL = https://xyzabcdef123456.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3.4 Desplegar

1. Haz clic en **Deploy**
2. Espera 2-3 minutos mientras se construye y despliega
3. Cuando termine, verás "🎉 Congratulations!"
4. Haz clic en **Visit** para ver tu aplicación

---

## ✅ PASO 4: Verificar que Todo Funcione

### 4.1 Probar la Aplicación

1. Abre tu aplicación en el navegador
2. Deberías ver la lista de productos de Supabase
3. **NO deberías ver errores en la consola** (F12)
4. Intenta:
   - ✓ Editar el "Tipo de producto" de un producto
   - ✓ Agregar etiquetas (separadas por comas)
   - ✓ Seleccionar colecciones
   - ✓ Guardar los cambios
   - ✓ Seleccionar varios productos
   - ✓ Publicar masivamente

### 4.2 Si Ves el Error "Cannot read properties of undefined"

Esto significa que hay valores NULL en tu base de datos:

**Solución Rápida:**

1. Ve a Supabase → **SQL Editor**
2. Ejecuta este comando:

```sql
UPDATE productos SET 
  marca = COALESCE(marca, 'Sin marca'),
  precio = COALESCE(precio, 0),
  stock = COALESCE(stock, 0),
  tipo_producto = COALESCE(tipo_producto, ''),
  etiquetas = COALESCE(etiquetas, ARRAY[]::TEXT[]),
  colecciones = COALESCE(colecciones, ARRAY[]::TEXT[]);
```

3. Recarga tu aplicación en Vercel
4. El error debería desaparecer

### 4.3 Verificar en Supabase

1. Ve a tu tabla productos en Supabase
2. Verifica que los cambios se guardaron correctamente
3. Las columnas `tipo_producto`, `etiquetas` y `colecciones` deben tener los nuevos valores

---

## 🔄 PASO 5: Hacer Cambios al Código (Futuro)

### Opción A: Editar en GitHub Web

1. Ve a tu repositorio en GitHub
2. Navega al archivo que quieres editar
3. Haz clic en el ícono de lápiz (Edit)
4. Haz los cambios
5. Haz clic en **Commit changes**
6. Vercel automáticamente detectará el cambio y redesplegará

### Opción B: Clonar, Editar y Subir

```bash
# Clonar repositorio
git clone https://github.com/tyt2025/shopify-dashboard.git
cd shopify-dashboard

# Hacer cambios en los archivos
# ... editar archivos ...

# Subir cambios
git add .
git commit -m "Descripción del cambio"
git push origin main
```

---

## 🐛 Solución de Problemas Completa

### Problema 1: Error "Cannot read properties of undefined (reading 'toLocaleString')"

**Causa**: Valores NULL en la base de datos

**Solución**:
```sql
-- Ejecutar en Supabase SQL Editor
UPDATE productos SET 
  precio = COALESCE(precio, 0),
  stock = COALESCE(stock, 0),
  marca = COALESCE(marca, 'Sin marca');
```

Luego redespliega en Vercel.

### Problema 2: Error "Failed to load products"

**Causa**: No se puede conectar a Supabase

**Solución**:
1. Ve a Vercel → tu proyecto → **Settings** → **Environment Variables**
2. Verifica que las variables estén correctas
3. Si las cambiaste, haz clic en **Redeploy** en la pestaña **Deployments**

### Problema 3: Los productos no se muestran

**Causa**: La tabla está vacía o no existe

**Solución**:
1. Ve a Supabase → **Table Editor**
2. Verifica que la tabla `productos` exista
3. Verifica que tenga productos
4. Ejecuta el script `database-setup.sql` si es necesario

### Problema 4: Error 500 en Vercel

**Causa**: Error en el código o variables mal configuradas

**Solución**:
1. Ve a Vercel → tu proyecto → **Deployments**
2. Haz clic en el último deployment
3. Revisa los **Function Logs** para ver el error específico
4. Corrige el error y haz push a GitHub

### Problema 5: Los cambios no se guardan

**Causa**: Problemas con las políticas RLS de Supabase

**Solución**:
1. Ve a Supabase → **Authentication** → **Policies**
2. Selecciona la tabla `productos`
3. Verifica que existan las políticas de UPDATE
4. Ejecuta la sección 4 del archivo `database-setup.sql`

### Problema 6: Página en blanco

**Causa**: Error de build o runtime

**Solución**:
1. Abre la consola del navegador (F12)
2. Busca errores en rojo
3. Ve a Vercel → **Deployments** → **Build Logs**
4. Identifica el error
5. Corrige y redespliega

---

## 📊 Verificación Final

### Checklist de Funcionalidad

- [ ] La aplicación carga sin errores
- [ ] Los productos se muestran correctamente
- [ ] Los precios se muestran como números (no "undefined")
- [ ] Puedo editar el tipo de producto
- [ ] Puedo agregar etiquetas
- [ ] Puedo seleccionar colecciones
- [ ] El botón "Guardar" funciona
- [ ] Puedo seleccionar múltiples productos
- [ ] El botón "Publicar seleccionados" funciona
- [ ] Los cambios se guardan en Supabase

---

## 📱 URLs Importantes

- **Supabase Dashboard**: https://app.supabase.com
- **Vercel Dashboard**: https://vercel.com/dashboard
- **GitHub Repo**: https://github.com/tyt2025/shopify-dashboard
- **Tu App**: [Se generará después del despliegue]

---

## 🔍 Debugging Avanzado

### Ver logs en tiempo real:

**En el navegador:**
```
1. Abre DevTools (F12)
2. Ve a la pestaña Console
3. Busca errores en rojo
4. Busca warnings en amarillo
```

**En Vercel:**
```
1. Ve a tu proyecto
2. Click en "Deployments"
3. Click en el último deployment
4. Ve a "Function Logs"
```

**En Supabase:**
```
1. Ve a tu proyecto
2. Click en "Logs"
3. Filtra por tabla "productos"
```

---

## 🎯 Mejores Prácticas

1. **Siempre ejecuta el script SQL completo** al configurar por primera vez
2. **Verifica los datos** antes de desplegar
3. **Usa la consola del navegador** para debugging
4. **Revisa los logs de Vercel** si algo falla
5. **Haz commits frecuentes** con mensajes descriptivos

---

¡Listo! Tu dashboard debería estar funcionando perfectamente sin errores. 🚀

**Versión de esta guía**: 1.0.1 - Con corrección de error de NULL

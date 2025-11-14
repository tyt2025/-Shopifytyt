# 🚀 Guía de Despliegue - Shopify Dashboard

## Para Luis - Tintas y Tecnología
**Trabajo exclusivo con GitHub y Vercel (sin localhost)**

---

## 📦 PASO 1: Preparar Supabase

### 1.1 Configurar la Base de Datos

1. Ve a tu proyecto en Supabase: https://app.supabase.com
2. Haz clic en **SQL Editor** en el menú lateral
3. Crea una nueva query y pega el contenido del archivo `database-setup.sql`
4. Ejecuta el script completo (botón RUN)

### 1.2 Obtener Credenciales

1. Ve a **Settings** → **API** en Supabase
2. Copia estos dos valores (los necesitarás para Vercel):
   - **Project URL** → Será tu `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → Será tu `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 1.3 Verificar Datos

1. Ve a **Table Editor** → **productos**
2. Verifica que tengas productos en la tabla
3. Si no tienes productos, puedes insertar algunos de prueba usando el SQL editor

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

Necesitarás usar una de estas opciones:

#### Opción A: Desde GitHub Web (Más fácil)

1. En tu repositorio recién creado, haz clic en **uploading an existing file**
2. Arrastra **TODOS** los archivos y carpetas del proyecto
3. Escribe un mensaje: "Initial commit: Shopify Dashboard"
4. Haz clic en **Commit changes**

#### Opción B: Desde Terminal (si tienes acceso)

```bash
cd /ruta/al/proyecto/shopify-dashboard
git init
git add .
git commit -m "Initial commit: Shopify Dashboard"
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
5. Si no aparece:
   - Haz clic en **Adjust GitHub App Permissions**
   - Selecciona `tyt2025` y da acceso al repositorio

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
3. Intenta:
   - ✓ Editar el "Tipo de producto" de un producto
   - ✓ Agregar etiquetas (separadas por comas)
   - ✓ Seleccionar colecciones
   - ✓ Guardar los cambios
   - ✓ Seleccionar varios productos
   - ✓ Publicar masivamente

### 4.2 Verificar en Supabase

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

## 🐛 Solución de Problemas

### Error: "Failed to load products"

**Causa**: No se puede conectar a Supabase

**Solución**:
1. Ve a Vercel → tu proyecto → **Settings** → **Environment Variables**
2. Verifica que las variables estén correctas
3. Si las cambiaste, haz clic en **Redeploy** en la pestaña **Deployments**

### Error: "Cannot read properties of null"

**Causa**: La tabla productos no existe o está vacía

**Solución**:
1. Ve a Supabase → **Table Editor**
2. Verifica que la tabla `productos` exista
3. Verifica que tenga productos
4. Ejecuta el script `database-setup.sql` si es necesario

### Los cambios no se guardan

**Causa**: Problemas con las políticas RLS de Supabase

**Solución**:
1. Ve a Supabase → **Authentication** → **Policies**
2. Selecciona la tabla `productos`
3. Verifica que existan las políticas de UPDATE
4. Ejecuta la sección de políticas del archivo `database-setup.sql`

### Página en blanco o error 404

**Causa**: Error en la construcción del proyecto

**Solución**:
1. Ve a Vercel → tu proyecto → **Deployments**
2. Haz clic en el último deployment
3. Revisa los **Build Logs** para ver el error específico
4. Si hay errores de TypeScript, revisa el código
5. Haz clic en **Redeploy** después de corregir

---

## 📱 URLs Importantes

- **Supabase Dashboard**: https://app.supabase.com
- **Vercel Dashboard**: https://vercel.com/dashboard
- **GitHub Repo**: https://github.com/tyt2025/shopify-dashboard
- **Tu App**: [Se generará después del despliegue]

---

## 📞 Checklist Final

- [ ] Base de datos configurada en Supabase
- [ ] Credenciales de Supabase copiadas
- [ ] Código subido a GitHub
- [ ] Variables de entorno configuradas en Vercel
- [ ] Aplicación desplegada exitosamente
- [ ] Productos se cargan correctamente
- [ ] Puedo editar y guardar productos
- [ ] Puedo seleccionar múltiples productos
- [ ] La publicación masiva funciona

---

## 🎯 Próximos Pasos (Opcional)

1. **Agregar autenticación**: Implementar Supabase Auth
2. **Integración real con Shopify**: Conectar con la API de Shopify
3. **Imágenes**: Agregar carga de imágenes
4. **Filtros**: Agregar búsqueda y filtros en la tabla
5. **Paginación**: Implementar paginación para muchos productos

---

¡Listo! Tu dashboard debería estar funcionando perfectamente. 🚀

Si tienes algún problema, revisa los logs en Vercel y la consola del navegador (F12) para más detalles.

# Dashboard Shopify - Tintas y Tecnología

Dashboard para gestión de productos con publicación masiva en Shopify, con edición individual de cada producto directamente en la tabla.

## 🚀 Características Principales

- ✅ **Edición en tabla**: Edita Tipo de producto, Etiquetas y Colecciones directamente en cada fila
- ✅ **Publicación masiva**: Selecciona múltiples productos y publícalos todos a la vez
- ✅ **Configuración individual**: Cada producto mantiene su propia configuración
- ✅ **Integración con Supabase**: Almacenamiento y sincronización de datos
- ✅ **Interfaz intuitiva**: Diseño moderno y fácil de usar

## 📋 Requisitos Previos

- Cuenta de GitHub
- Cuenta de Vercel
- Cuenta de Supabase con una tabla de productos configurada

## 🗄️ Estructura de la Base de Datos en Supabase

Tu tabla `productos` debe tener las siguientes columnas:

```sql
CREATE TABLE productos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  sku TEXT NOT NULL UNIQUE,
  marca TEXT,
  precio DECIMAL(10,2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  imagen_url TEXT,
  descripcion TEXT,
  tipo_producto TEXT,
  etiquetas TEXT[],
  colecciones TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

Si ya tienes una tabla, puedes agregar las columnas faltantes:

```sql
-- Agregar columnas si no existen
ALTER TABLE productos ADD COLUMN IF NOT EXISTS tipo_producto TEXT;
ALTER TABLE productos ADD COLUMN IF NOT EXISTS etiquetas TEXT[];
ALTER TABLE productos ADD COLUMN IF NOT EXISTS colecciones TEXT[];
```

## 🔧 Configuración y Despliegue

### 1. Subir a GitHub

```bash
# Inicializar repositorio
git init
git add .
git commit -m "Initial commit: Shopify Dashboard"

# Crear repositorio en GitHub y subir
git remote add origin https://github.com/TU_USUARIO/shopify-dashboard.git
git branch -M main
git push -u origin main
```

### 2. Desplegar en Vercel

1. Ve a [vercel.com](https://vercel.com) e inicia sesión
2. Haz clic en **"Add New Project"**
3. Importa tu repositorio de GitHub
4. Configura las **Variables de Entorno**:

   ```
   NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anon_de_supabase
   ```

   > 💡 Estas credenciales las encuentras en tu proyecto de Supabase:
   > - Ve a **Settings** → **API**
   > - Copia la **Project URL** para `NEXT_PUBLIC_SUPABASE_URL`
   > - Copia la **anon public** key para `NEXT_PUBLIC_SUPABASE_ANON_KEY`

5. Haz clic en **"Deploy"**
6. Espera unos minutos y tu aplicación estará lista

### 3. Variables de Entorno en Vercel

Si necesitas actualizar las variables:

1. Ve a tu proyecto en Vercel
2. **Settings** → **Environment Variables**
3. Agrega o edita las variables
4. Redespliega el proyecto

## 📖 Cómo Usar el Dashboard

### Editar Productos

1. **Tipo de producto**: Escribe directamente en el campo (ej: "cable RED", "teclado mecánico")
2. **Etiquetas**: Escribe las etiquetas separadas por comas (ej: "cable red, ethernet, cat6")
3. **Colecciones**: Haz clic en "X seleccionadas" y marca las colecciones que apliquen
4. **Guardar**: Haz clic en el botón "Guardar" de cada producto para guardar los cambios

### Publicación Masiva

1. Configura cada producto con su tipo, etiquetas y colecciones
2. Guarda cada producto individualmente
3. Marca los checkboxes de los productos que quieres publicar
4. Haz clic en **"Publicar seleccionados (X)"** en la parte superior
5. Todos los productos seleccionados se publicarán con su configuración individual

### Selección Rápida

- **Seleccionar todos**: Marca el checkbox en el encabezado de la tabla
- **Selección individual**: Marca los checkboxes de cada producto

## 🎨 Colecciones Disponibles

- Baterías
- Cables de Red
- Cables para Celulares
- Cables y convertidores
- Cajon monedero
- Cámaras
- Computadores
- Diademas
- Fuentes
- Impresoras
- Monitores
- Mouse
- Parlantes
- Procesadores
- Teclados
- Tintas

## 🔄 Actualizar el Código

Para hacer cambios al código:

```bash
# Hacer cambios en los archivos
git add .
git commit -m "Descripción de los cambios"
git push origin main
```

Vercel automáticamente detectará los cambios y redesplegará tu aplicación.

## 🐛 Solución de Problemas

### Error de conexión a Supabase

- Verifica que las variables de entorno estén correctamente configuradas
- Asegúrate de que la URL y la clave sean correctas
- Revisa que la tabla `productos` exista en Supabase

### Los productos no se cargan

- Verifica que haya productos en tu tabla de Supabase
- Revisa la consola del navegador para ver errores específicos
- Asegúrate de que las políticas RLS (Row Level Security) permitan lectura pública

### Error al guardar cambios

- Verifica que las políticas RLS permitan actualizaciones
- Revisa que todos los campos requeridos estén completos

## 📝 Notas Importantes

- **Sin localhost**: Este proyecto está diseñado para trabajar únicamente con GitHub y Vercel
- **Edición en línea**: Todos los cambios se hacen directamente en GitHub o en Vercel
- **Configuración persistente**: Cada producto guarda su configuración en Supabase
- **Publicación masiva**: Puedes publicar hasta 100 productos a la vez

## 🔐 Seguridad en Supabase

Para permitir que tu aplicación acceda a los datos, configura las políticas RLS:

```sql
-- Permitir lectura pública
CREATE POLICY "Enable read access for all users" 
ON productos FOR SELECT 
USING (true);

-- Permitir actualización pública (ajusta según tus necesidades de seguridad)
CREATE POLICY "Enable update access for all users" 
ON productos FOR UPDATE 
USING (true);
```

> ⚠️ **Nota de Seguridad**: En producción, es recomendable agregar autenticación y restringir el acceso solo a usuarios autorizados.

## 📞 Soporte

Para problemas o preguntas, revisa:
- La consola del navegador (F12) para errores
- Los logs de Vercel para errores de deployment
- La documentación de Supabase para problemas de base de datos

---

Desarrollado para Tintas y Tecnología 🚀

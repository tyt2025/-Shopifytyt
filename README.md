# Dashboard Shopify - Tintas y Tecnología

Dashboard para gestión de productos con publicación masiva en Shopify, con edición individual de cada producto directamente en la tabla.

## 🚀 Características Principales

- ✅ **Edición en tabla**: Edita Tipo de producto, Etiquetas y Colecciones directamente en cada fila
- ✅ **Publicación masiva**: Selecciona múltiples productos y publícalos todos a la vez
- ✅ **Configuración individual**: Cada producto mantiene su propia configuración
- ✅ **Manejo robusto de datos**: Valores NULL manejados automáticamente
- ✅ **Integración con Supabase**: Almacenamiento y sincronización de datos
- ✅ **Interfaz intuitiva**: Diseño moderno y fácil de usar

## 🛠️ Solución de Error

### Error Corregido: "Cannot read properties of undefined (reading 'toLocaleString')"

**Causa**: Algunos productos en la base de datos tenían valores `NULL` o `undefined` en los campos `precio` o `stock`.

**Solución implementada**:
1. Funciones helper para manejar valores NULL/undefined de forma segura
2. Valores por defecto en la base de datos
3. Sanitización de datos al cargar productos
4. Validaciones en TypeScript con tipos nullable

```typescript
// Antes (causaba error)
${product.precio.toLocaleString()}

// Ahora (manejo seguro)
${formatNumber(product.precio)}  // Retorna '0' si es null/undefined
```

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
  marca TEXT DEFAULT 'Sin marca',
  precio DECIMAL(10,2) DEFAULT 0,
  stock INTEGER DEFAULT 0,
  imagen_url TEXT,
  descripcion TEXT,
  tipo_producto TEXT DEFAULT '',
  etiquetas TEXT[] DEFAULT ARRAY[]::TEXT[],
  colecciones TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### ⚠️ IMPORTANTE: Corregir valores NULL existentes

Si ya tienes una tabla con productos, ejecuta esto para evitar errores:

```sql
-- Actualizar valores NULL a valores por defecto
UPDATE productos SET marca = 'Sin marca' WHERE marca IS NULL;
UPDATE productos SET precio = 0 WHERE precio IS NULL;
UPDATE productos SET stock = 0 WHERE stock IS NULL;
UPDATE productos SET tipo_producto = '' WHERE tipo_producto IS NULL;
UPDATE productos SET etiquetas = ARRAY[]::TEXT[] WHERE etiquetas IS NULL;
UPDATE productos SET colecciones = ARRAY[]::TEXT[] WHERE colecciones IS NULL;
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

5. Haz clic en **"Deploy"**
6. Espera unos minutos y tu aplicación estará lista

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

## 🐛 Solución de Problemas

### Error: "Cannot read properties of undefined"

Este error ocurre cuando hay valores NULL en la base de datos.

**Solución**:
1. Ejecuta el script completo `database-setup.sql` en Supabase
2. Específicamente la sección de actualización de valores NULL
3. Verifica que todos los productos tengan valores válidos:

```sql
SELECT id, nombre, precio, stock, marca
FROM productos
WHERE precio IS NULL OR stock IS NULL OR marca IS NULL;
```

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

## 📝 Notas Importantes

- **Sin localhost**: Este proyecto está diseñado para trabajar únicamente con GitHub y Vercel
- **Edición en línea**: Todos los cambios se hacen directamente en GitHub o en Vercel
- **Configuración persistente**: Cada producto guarda su configuración en Supabase
- **Manejo de NULL**: Todos los valores NULL se manejan automáticamente
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

## 🚦 Validaciones Implementadas

El código incluye múltiples validaciones:

1. **Validación de NULL**: Todos los valores NULL se convierten a valores seguros
2. **Validación de tipos**: TypeScript previene errores de tipo
3. **Validación de formularios**: No se pueden publicar productos sin tipo
4. **Validación en base de datos**: Constraints para prevenir valores negativos

## 📊 Mejores Prácticas

### Para evitar errores:

1. Siempre ejecuta el script `database-setup.sql` completo al configurar
2. Usa valores por defecto en las columnas de la tabla
3. Valida los datos antes de guardarlos
4. Maneja los errores en la interfaz de usuario

### Para desarrollo futuro:

1. Implementa autenticación con Supabase Auth
2. Agrega validación del lado del servidor
3. Implementa logs para debugging
4. Agrega tests unitarios

## 📞 Soporte

Para problemas o preguntas, revisa:
- La consola del navegador (F12) para errores
- Los logs de Vercel para errores de deployment
- La documentación de Supabase para problemas de base de datos
- El archivo `database-setup.sql` para la estructura correcta

## 🎯 Próximos Pasos Sugeridos

1. **Autenticación**: Para seguridad
2. **Integración real con Shopify**: API para publicar en Shopify
3. **Filtros y búsqueda**: Para encontrar productos rápidamente
4. **Paginación**: Para manejar muchos productos
5. **Exportar a Excel**: Para reportes

---

Desarrollado para Tintas y Tecnología 🚀

**Versión**: 1.0.1 (Corrección de manejo de NULL)

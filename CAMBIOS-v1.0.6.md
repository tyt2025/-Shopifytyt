# Dashboard Shopify v1.0.6
## Taxonomía de Productos Shopify

### 🆕 NUEVA FUNCIONALIDAD - Categoría de Taxonomía Shopify

---

## ✨ Cambios en v1.0.6

### Nueva Columna: CATEGORÍA SHOPIFY

Se agregó una nueva columna **"CATEGORÍA SHOPIFY"** al dashboard, ubicada entre **"COLECCIONES"** y **"ACCIONES"**.

Esta columna permite asignar la **Taxonomía Estándar de Productos de Shopify** a cada producto, que es esencial para:

✅ **Cálculos precisos de impuestos**  
✅ **Mejor búsqueda y filtros en Shopify**  
✅ **Integración con Google Shopping y Facebook**  
✅ **Activación automática de metacampos específicos**  
✅ **Mejor experiencia de búsqueda para clientes**

---

## 📋 ¿Qué es la Taxonomía de Shopify?

La Taxonomía Estándar de Productos de Shopify es una biblioteca global de datos que mapea más de **10,000 categorías** con más de **1,000 atributos**.

### Formato de Categorías

Las categorías siguen una estructura jerárquica:

```
Nivel 1 > Nivel 2 > Nivel 3 > Nivel 4 (opcional)
```

### Ejemplos para Productos de Tecnología

```
Computadores:
- Electronics > Computers > Desktop Computers
- Electronics > Computers > Laptop Computers
- Electronics > Computers > Tablet Computers

Accesorios:
- Electronics > Computers > Computer Accessories > Keyboards
- Electronics > Computers > Computer Accessories > Mice & Trackballs
- Electronics > Computers > Computer Accessories > Computer Cables & Adapters

Componentes:
- Electronics > Computers > Computer Components > Computer Memory (RAM)
- Electronics > Computers > Computer Components > Storage Devices > Hard Drives
- Electronics > Computers > Computer Components > Graphics Cards

Impresoras:
- Electronics > Print, Copy, Scan & Fax > Printers
- Electronics > Print, Copy, Scan & Fax > Printer Consumables > Ink & Toner Cartridges

Redes:
- Electronics > Networking > Network Cables
- Electronics > Networking > Routers
- Electronics > Networking > Switches

Audio/Video:
- Electronics > Audio > Headphones & Headsets
- Electronics > Audio > Speakers
- Electronics > Video > Projectors

Energía:
- Electronics > Power > UPS (Uninterruptible Power Supply)
- Electronics > Power > Power Cables & Adapters
```

---

## 🚀 Instalación

### 1. Actualizar Base de Datos Supabase

Ejecuta el siguiente SQL en tu base de datos Supabase:

```sql
-- Agregar columna de taxonomía
ALTER TABLE productos 
  ADD COLUMN IF NOT EXISTS shopify_taxonomy_category TEXT DEFAULT '';

-- Actualizar valores NULL
UPDATE productos 
SET shopify_taxonomy_category = '' 
WHERE shopify_taxonomy_category IS NULL;

-- Crear índice
CREATE INDEX IF NOT EXISTS idx_productos_taxonomy 
ON productos(shopify_taxonomy_category);
```

**Archivo SQL incluido:** `AGREGAR-TAXONOMIA-SHOPIFY.sql`

### 2. Desplegar en GitHub

```bash
# Comprimir carpeta
cd shopify-dashboard-v1.0.6
git init
git add .
git commit -m "feat: agregar taxonomía de Shopify v1.0.6"
git push origin main
```

### 3. Verificar en Vercel

Vercel detectará automáticamente los cambios y desplegará la nueva versión.

---

## 📝 Cómo Usar

### 1. Asignar Categoría de Taxonomía

En el dashboard, en la columna **"CATEGORÍA SHOPIFY"**:

1. Comienza a escribir y verás sugerencias automáticas
2. Selecciona una categoría de la lista predefinida
3. O escribe tu propia categoría siguiendo el formato: `Nivel 1 > Nivel 2 > Nivel 3`

### 2. Guardar Cambios

1. Después de asignar la categoría, haz clic en **"Guardar"**
2. El sistema guardará la taxonomía en Supabase

### 3. Publicar en Shopify

1. Selecciona los productos con taxonomía asignada
2. Haz clic en **"Publicar seleccionados"**
3. Shopify activará automáticamente los metacampos correspondientes

---

## 🎯 Categorías Predefinidas Incluidas

El dashboard incluye **50+ categorías** de tecnología predefinidas:

- ✅ Computadores (Desktop, Laptop, Tablet)
- ✅ Accesorios de Computador (Teclados, Mouse, Cables)
- ✅ Componentes (RAM, Discos Duros, Tarjetas Gráficas)
- ✅ Impresoras y Consumibles
- ✅ Redes (Cables, Routers, Switches)
- ✅ Audio (Audífonos, Parlantes)
- ✅ Video (Proyectores, Monitores)
- ✅ Cámaras (Seguridad, Web)
- ✅ Energía (UPS, Cables)
- ✅ Gaming

---

## 📚 Recursos

### Explorador Interactivo de Taxonomía

Busca la categoría perfecta para tus productos:

🔗 **https://shopify.github.io/product-taxonomy/**

### Repositorio GitHub

Consulta la taxonomía completa:

🔗 **https://github.com/Shopify/product-taxonomy**

### Documentación Oficial

Lee sobre la taxonomía y metacampos:

🔗 **https://help.shopify.com/es/manual/products/details/product-category**

---

## 🔧 Archivos Modificados

### Archivos Nuevos

- `AGREGAR-TAXONOMIA-SHOPIFY.sql` - Script SQL para agregar la columna
- `CAMBIOS-v1.0.6.md` - Este archivo

### Archivos Actualizados

- `types/product.ts` - Agregado campo `shopify_taxonomy_category` y categorías predefinidas
- `components/ProductsTable.tsx` - Nueva columna con selector de taxonomía

---

## ✅ Verificación

### Checklist de Implementación

- [ ] Ejecutaste el SQL en Supabase
- [ ] La columna `shopify_taxonomy_category` existe en la tabla `productos`
- [ ] Subiste el código a GitHub
- [ ] Vercel desplegó la nueva versión
- [ ] La nueva columna aparece en el dashboard
- [ ] Puedes escribir y seleccionar categorías
- [ ] Los cambios se guardan correctamente
- [ ] Los productos se publican con la taxonomía asignada

---

## 💡 Tips

### 1. Categoría Más Específica

Siempre usa la categoría **más específica** posible. Por ejemplo:

❌ **Incorrecto:** `Electronics > Computers`  
✅ **Correcto:** `Electronics > Computers > Laptop Computers`

### 2. Formato Exacto

Respeta el formato con espacios alrededor del símbolo `>`:

❌ **Incorrecto:** `Electronics>Computers>Laptops`  
✅ **Correcto:** `Electronics > Computers > Laptop Computers`

### 3. Consistencia

Usa las mismas categorías para productos similares para:
- Facilitar filtros
- Mejorar la búsqueda
- Mantener organizado el catálogo

### 4. Metacampos Automáticos

Una vez publicado en Shopify con la taxonomía correcta, aparecerán automáticamente metacampos específicos para esa categoría.

**Ejemplo:** Para `Tablet Computers` aparecerán metacampos como:
- Sistema Operativo
- Tamaño de Pantalla
- Memoria RAM
- Almacenamiento
- Procesador
- Color
- Marca

---

## 🐛 Solución de Problemas

### La columna no aparece

1. Verifica que ejecutaste el SQL en Supabase
2. Refresca la página del dashboard
3. Limpia el caché del navegador

### No se guardan los cambios

1. Abre la consola del navegador (F12)
2. Revisa si hay errores
3. Verifica que la columna existe en Supabase:

```sql
SELECT column_name 
FROM information_schema.columns
WHERE table_name = 'productos' 
  AND column_name = 'shopify_taxonomy_category';
```

### Las sugerencias no aparecen

Las sugerencias usan `<datalist>`, que tiene soporte limitado en algunos navegadores. Si no aparecen:
1. Puedes escribir manualmente la categoría
2. Consulta la lista en `types/product.ts`
3. O usa el explorador: https://shopify.github.io/product-taxonomy/

---

## 📞 Soporte

Si tienes problemas con esta versión:

1. Revisa los logs en la consola del navegador
2. Verifica los logs de Vercel
3. Revisa que Supabase tenga la columna correcta
4. Consulta la documentación de Shopify

---

**Versión:** 1.0.6  
**Fecha:** 15 de noviembre de 2025  
**Empresa:** Tintas y Tecnología  
**Desarrollado por:** Luis

---

## 📖 Historia de Versiones

- **v1.0.6** - Agregada columna de Taxonomía de Shopify
- **v1.0.5** - Correcciones de nombres de columnas
- **v1.0.4** - Integración completa con Shopify
- **v1.0.3** - Sistema de colecciones
- **v1.0.2** - Correcciones de errores
- **v1.0.1** - Versión inicial con etiquetas
- **v1.0.0** - Primera versión

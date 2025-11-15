# 🚀 Dashboard Shopify v1.0.6 - Tintas y Tecnología

**Última actualización:** 15 de noviembre de 2025

Dashboard para gestionar productos de Supabase y publicarlos en Shopify con soporte completo de **Taxonomía de Productos**.

---

## 🆕 Novedad en v1.0.6

### ✨ Categoría de Taxonomía Shopify

Nueva columna para asignar la **Taxonomía Estándar de Shopify** a tus productos:

- ✅ Cálculos precisos de impuestos
- ✅ Mejor búsqueda y filtros en Shopify  
- ✅ Integración con Google Shopping y Facebook
- ✅ Activación automática de metacampos específicos
- ✅ Mejor experiencia para los clientes

**Formato:** `Nivel 1 > Nivel 2 > Nivel 3`  
**Ejemplo:** `Electronics > Computers > Laptop Computers`

**📖 Lee la guía completa:** [CAMBIOS-v1.0.6.md](./CAMBIOS-v1.0.6.md)

---

## 📋 Características

### 🎯 Gestión de Productos

- ✅ Visualización de 1000 productos de Supabase
- ✅ Edición inline de campos
- ✅ Selección múltiple de productos
- ✅ Sistema de colecciones (67 categorías)
- ✅ Sistema de etiquetas
- ✅ **NUEVO:** Taxonomía de Shopify (50+ categorías)

### 🚀 Publicación en Shopify

- ✅ Publicación masiva de productos seleccionados
- ✅ Creación automática de colecciones
- ✅ Asignación de productos a colecciones
- ✅ Validación antes de publicar
- ✅ Feedback detallado del proceso

### 💾 Persistencia de Datos

- ✅ Guardado individual por producto
- ✅ Actualización automática de `updated_at`
- ✅ Validación de datos antes de guardar
- ✅ Manejo robusto de errores

---

## 🛠️ Tecnologías

- **Frontend:** Next.js 14, React 18, TypeScript
- **Estilos:** Tailwind CSS
- **Base de datos:** Supabase
- **Integración:** Shopify Admin API
- **Deploy:** Vercel
- **Control de versiones:** GitHub

---

## 📦 Instalación Rápida

### 1. Configurar Supabase

Ejecuta el SQL para agregar la columna de taxonomía:

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

**📄 Archivo incluido:** `AGREGAR-TAXONOMIA-SHOPIFY.sql`

### 2. Subir a GitHub

```bash
cd shopify-dashboard-v1.0.6
git init
git add .
git commit -m "feat: dashboard con taxonomía Shopify v1.0.6"
git remote add origin https://github.com/tu-usuario/tu-repo.git
git push -u origin main
```

### 3. Desplegar en Vercel

1. Importa el repositorio en Vercel
2. Configura las variables de entorno:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Haz clic en "Deploy"

---

## 📊 Cómo Usar

### 1. Ver Productos

El dashboard muestra tus productos con todas las columnas:
- Imagen, nombre, SKU
- Marca, precio, stock
- Tipo de producto
- Etiquetas
- Colecciones
- **NUEVO:** Categoría Shopify

### 2. Editar Productos

Campos editables:
- **Tipo de producto:** Escribe libremente
- **Etiquetas:** Separa con comas
- **Colecciones:** Selecciona múltiples opciones
- **Categoría Shopify:** Autocompletado con sugerencias

### 3. Asignar Taxonomía

En la columna "CATEGORÍA SHOPIFY":
1. Comienza a escribir
2. Verás sugerencias automáticas
3. Selecciona una o escribe manualmente
4. Formato: `Nivel 1 > Nivel 2 > Nivel 3`

**Ejemplos:**
```
Electronics > Computers > Laptop Computers
Electronics > Audio > Headphones & Headsets
Electronics > Networking > Network Cables
Electronics > Print, Copy, Scan & Fax > Printers
```

### 4. Guardar Cambios

Haz clic en "Guardar" para actualizar el producto en Supabase.

### 5. Publicar en Shopify

1. Selecciona productos (checkbox)
2. Haz clic en "Publicar seleccionados"
3. Confirma la acción
4. Revisa el feedback

---

## 🎨 Categorías Incluidas

### Computadores
- Desktop Computers
- Laptop Computers  
- Tablet Computers

### Accesorios
- Keyboards
- Mice & Trackballs
- Computer Cables & Adapters
- Monitor Accessories

### Componentes
- Computer Memory (RAM)
- Storage Devices (Hard Drives, SSDs, USB)
- Graphics Cards
- Computer Fans & Cooling

### Impresoras
- Printers
- Ink & Toner Cartridges
- Scanners

### Redes
- Network Cables
- Routers
- Switches
- Network Adapters

### Audio/Video
- Headphones & Headsets
- Speakers
- Projectors
- Monitors

### Y muchas más...

**📖 Ver lista completa:** [types/product.ts](./types/product.ts)

---

## 🔗 Recursos de Taxonomía

### Explorador Interactivo
🌐 https://shopify.github.io/product-taxonomy/

Busca la categoría perfecta navegando visualmente.

### Repositorio GitHub
🔗 https://github.com/Shopify/product-taxonomy

Consulta la taxonomía completa (10,000+ categorías).

### Documentación Oficial
📚 https://help.shopify.com/es/manual/products/details/product-category

Aprende más sobre categorías y metacampos.

---

## 🔍 Solución de Problemas

### La nueva columna no aparece

1. Ejecuta el SQL en Supabase
2. Verifica que la columna existe:
   ```sql
   SELECT column_name 
   FROM information_schema.columns
   WHERE table_name = 'productos' 
     AND column_name = 'shopify_taxonomy_category';
   ```
3. Refresca el dashboard

### No se guardan los cambios

1. Abre la consola (F12)
2. Busca errores
3. Verifica las variables de entorno en Vercel
4. Confirma permisos en Supabase

### Las sugerencias no funcionan

Las sugerencias usan `<datalist>`, compatible con navegadores modernos. Si no aparecen:
- Escribe manualmente
- Consulta la lista en `types/product.ts`
- Usa el explorador: https://shopify.github.io/product-taxonomy/

---

## 📂 Estructura del Proyecto

```
shopify-dashboard-v1.0.6/
├── app/
│   ├── api/
│   │   └── shopify/
│   │       └── publish/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── ProductsTable.tsx         # ✨ Nueva columna de taxonomía
├── lib/
│   └── supabase.ts
├── types/
│   └── product.ts                # ✨ Categorías de taxonomía
├── AGREGAR-TAXONOMIA-SHOPIFY.sql # ✨ SQL para Supabase
├── CAMBIOS-v1.0.6.md            # ✨ Guía detallada
├── package.json
└── README.md                     # Este archivo
```

---

## 📋 Checklist de Implementación

- [ ] Ejecutaste el SQL en Supabase
- [ ] La columna `shopify_taxonomy_category` existe
- [ ] Subiste el código a GitHub
- [ ] Vercel desplegó correctamente
- [ ] La nueva columna aparece en el dashboard
- [ ] Puedes seleccionar categorías
- [ ] Los cambios se guardan
- [ ] Los productos se publican correctamente

---

## 📝 Historia de Versiones

- **v1.0.6** ✨ Taxonomía de Shopify
- **v1.0.5** - Correcciones de nombres de columnas  
- **v1.0.4** - Integración completa con Shopify
- **v1.0.3** - Sistema de colecciones
- **v1.0.2** - Correcciones de errores
- **v1.0.1** - Sistema de etiquetas
- **v1.0.0** - Versión inicial

---

## 💡 Tips

### Usa la categoría más específica

❌ **Incorrecto:** `Electronics > Computers`  
✅ **Correcto:** `Electronics > Computers > Laptop Computers`

### Mantén el formato

❌ **Incorrecto:** `Electronics>Computers>Laptops`  
✅ **Correcto:** `Electronics > Computers > Laptop Computers`

### Sé consistente

Usa las mismas categorías para productos similares.

---

## 🤝 Soporte

¿Necesitas ayuda?

1. Lee [CAMBIOS-v1.0.6.md](./CAMBIOS-v1.0.6.md)
2. Revisa la consola del navegador (F12)
3. Verifica logs en Vercel
4. Confirma la estructura de Supabase

---

## 🎉 ¡Listo!

Tu dashboard ahora incluye:
- ✅ 1000 productos sincronizados
- ✅ 67 colecciones de Shopify
- ✅ Sistema de etiquetas
- ✅ **50+ categorías de taxonomía**
- ✅ Publicación masiva a Shopify
- ✅ Interfaz intuitiva y rápida

**¡Gestiona tus productos como un pro!** 🚀

---

**Desarrollado para Tintas y Tecnología**  
**Versión:** 1.0.6  
**Fecha:** 15 de noviembre de 2025

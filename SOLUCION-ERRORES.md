# 🔧 SOLUCIÓN ERRORES DE GUARDADO Y PUBLICACIÓN

## ❌ ERRORES QUE VISTE EN LA CONSOLA

Tu captura mostraba:
```
Error al guardar producto: Object
Productos a publicar: Array(2)
Failed to load resource: 404
```

---

## 🎯 CAUSA DEL PROBLEMA

El código intentaba actualizar columnas que **NO EXISTEN** en tu tabla de Supabase:
- `etiquetas` (TEXT[])
- `colecciones` (TEXT[])

Cuando Supabase no encuentra estas columnas, devuelve un error pero el código solo mostraba "Object" en lugar del mensaje real.

---

## ✅ SOLUCIÓN COMPLETA (10 minutos)

### PASO 1: Agregar Columnas Faltantes en Supabase (5 min)

1. **Ve a Supabase**
   - Abre [supabase.com](https://supabase.com)
   - Ve a tu proyecto
   - Click en "SQL Editor"

2. **Ejecuta este script SQL:**

```sql
-- Agregar columna shopify_category (si no existe)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'productos' 
        AND column_name = 'shopify_category'
    ) THEN
        ALTER TABLE productos 
        ADD COLUMN shopify_category TEXT;
    END IF;
END $$;

-- Agregar columna shopify_subcategory (si no existe)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'productos' 
        AND column_name = 'shopify_subcategory'
    ) THEN
        ALTER TABLE productos 
        ADD COLUMN shopify_subcategory TEXT;
    END IF;
END $$;

-- Agregar columna etiquetas (si no existe)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'productos' 
        AND column_name = 'etiquetas'
    ) THEN
        ALTER TABLE productos 
        ADD COLUMN etiquetas TEXT[] DEFAULT '{}';
    END IF;
END $$;

-- Agregar columna colecciones (si no existe)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'productos' 
        AND column_name = 'colecciones'
    ) THEN
        ALTER TABLE productos 
        ADD COLUMN colecciones TEXT[] DEFAULT '{}';
    END IF;
END $$;
```

3. **Click en "Run"**

4. **Verifica que se agregaron:**

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'productos'
  AND column_name IN ('shopify_category', 'shopify_subcategory', 'etiquetas', 'colecciones');
```

Deberías ver:
```
shopify_category     | text
shopify_subcategory  | text
etiquetas           | ARRAY
colecciones         | ARRAY
```

---

### PASO 2: Actualizar el Código a v1.0.3 (5 min)

1. **Descarga el nuevo código:**
   - `shopify-dashboard-v1.0.3.zip`

2. **Reemplaza en GitHub:**

```bash
cd tu-repositorio
rm -rf components/
# Copia components/ de v1.0.3
git add .
git commit -m "Update to v1.0.3 - Fix save and publish errors"
git push
```

3. **Espera el redeploy de Vercel** (2-3 min)

---

## 🔍 MEJORAS EN v1.0.3

### 1. Mejor Manejo de Errores

**ANTES (v1.0.2):**
```javascript
catch (error) {
  alert('Error al guardar el producto');  // ❌ No muestra qué error
}
```

**AHORA (v1.0.3):**
```javascript
catch (error: any) {
  console.error('Error completo de Supabase:', {
    message: error.message,
    details: error.details,
    hint: error.hint,
    code: error.code
  });
  alert(`❌ Error al guardar: ${error.message}`);  // ✅ Muestra error real
}
```

### 2. Validación de Campos

**ANTES:** Intentaba actualizar todos los campos siempre

**AHORA:** Solo actualiza campos que tienen valor y existen:

```javascript
const updateData: any = {
  updated_at: new Date().toISOString(),
};

// Solo agregar si tienen valor
if (product.shopify_category !== undefined) {
  updateData.shopify_category = product.shopify_category;
}

if (product.etiquetas !== undefined) {
  updateData.etiquetas = product.etiquetas || [];
}
```

### 3. Mejor Logging

Ahora verás en la consola:
```
Actualizando producto: 123
{ shopify_category: 'cable RED', etiquetas: ['cable', 'red'] }
Producto actualizado exitosamente: [...]
```

---

## ✅ VERIFICACIÓN

Después de aplicar la solución:

### 1. Prueba Guardar un Producto

1. Edita el campo "Tipo de producto"
2. Agrega etiquetas separadas por comas
3. Selecciona colecciones del dropdown
4. Click en "Guardar"

**Resultado esperado:**
```
✅ Producto actualizado correctamente
```

**En la consola (F12) deberías ver:**
```
Actualizando producto: [id]
{ shopify_category: '...', ... }
Producto actualizado exitosamente: [...]
```

### 2. Prueba Publicar

1. Selecciona 2-3 productos
2. Click en "Publicar seleccionados"

**Resultado esperado:**
```
¿Deseas publicar 3 producto(s) en Shopify?
[Aceptar]
3 producto(s) listo(s) para publicar en Shopify
```

**En la consola deberías ver:**
```
Productos a publicar: Array(3)
  [0]: { id: ..., product_name: ..., ... }
  [1]: { id: ..., product_name: ..., ... }
  [2]: { id: ..., product_name: ..., ... }
```

---

## 🆘 SI AÚN HAY ERRORES

### Error: "column does not exist"

**Causa:** La columna no se agregó en Supabase

**Solución:**
1. Ve a Supabase → SQL Editor
2. Ejecuta el script AGREGAR-COLUMNAS.sql completo
3. Verifica con:
   ```sql
   \d productos
   ```

### Error: "permission denied"

**Causa:** Las políticas RLS de Supabase bloquean la actualización

**Solución:**
```sql
-- Dar permisos de UPDATE
CREATE POLICY "Allow UPDATE for authenticated users"
ON productos FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);
```

### Error en imágenes: "404 Not Found"

**Causa:** URLs de imágenes con caracteres especiales o que no existen

**Esto NO afecta** el guardado de productos. Son solo advertencias.

**Para corregir (opcional):**
```sql
-- Limpiar URLs con problemas
UPDATE productos 
SET image_url_png = NULL 
WHERE image_url_png LIKE '%ampliaci%' 
   OR image_url_png LIKE '%nocrom%';
```

---

## 📊 RESUMEN DE CAMBIOS v1.0.3

| Aspecto | v1.0.2 | v1.0.3 |
|---------|--------|--------|
| Manejo de errores | ❌ Genérico | ✅ Específico |
| Validación de campos | ❌ No | ✅ Sí |
| Logging | ❌ Básico | ✅ Detallado |
| Mensajes de error | "Object" | Error real |
| Columnas requeridas | No verifica | Verifica antes |

---

## 🎯 CHECKLIST RÁPIDO

Para solucionar tus errores:

□ PASO 1: Ejecutar AGREGAR-COLUMNAS.sql en Supabase
□ PASO 2: Verificar que las 4 columnas se agregaron
□ PASO 3: Descargar shopify-dashboard-v1.0.3.zip
□ PASO 4: Reemplazar código en GitHub
□ PASO 5: Esperar redeploy de Vercel
□ PASO 6: Probar guardar un producto
□ PASO 7: Probar publicar productos
□ PASO 8: Verificar que no hay errores en consola

---

## 💡 RESULTADO FINAL

Con v1.0.3 tendrás:

✅ **Guardar productos funcional**
   - Actualiza shopify_category
   - Actualiza etiquetas
   - Actualiza colecciones
   - Muestra errores reales si falla

✅ **Publicar productos funcional**
   - Valida que tengan tipo
   - Lista productos a publicar
   - Muestra estado en consola

✅ **Mejor debugging**
   - Errores específicos
   - Logs detallados
   - Fácil identificar problemas

---

## 📝 ARCHIVOS IMPORTANTES

1. **AGREGAR-COLUMNAS.sql** - Script SQL completo
2. **Esta guía** - Instrucciones paso a paso
3. **ProductsTable.tsx** (v1.0.3) - Código corregido

---

¡Con estos cambios todo debería funcionar correctamente! 🚀

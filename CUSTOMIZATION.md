# 🎨 Personalización y Mejoras

Este documento contiene ideas y código para personalizar y mejorar tu dashboard de Shopify.

---

## 1. 🎯 Agregar Filtros y Búsqueda

### En `components/ProductsTable.tsx`

Agrega estos estados al inicio del componente:

```typescript
const [searchTerm, setSearchTerm] = useState('');
const [filterMarca, setFilterMarca] = useState('');
const [filterCollection, setFilterCollection] = useState('');
```

Agrega esta función para filtrar:

```typescript
const filteredProducts = products.filter(product => {
  const matchesSearch = product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       product.sku.toLowerCase().includes(searchTerm.toLowerCase());
  const matchesMarca = !filterMarca || product.marca === filterMarca;
  const matchesCollection = !filterCollection || 
                           (product.colecciones || []).includes(filterCollection);
  
  return matchesSearch && matchesMarca && matchesCollection;
});
```

Agrega esto antes de la tabla:

```tsx
<div className="bg-white p-4 rounded-lg shadow-sm mb-4">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <input
      type="text"
      placeholder="Buscar por nombre o SKU..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="px-4 py-2 border rounded-lg"
    />
    <select
      value={filterMarca}
      onChange={(e) => setFilterMarca(e.target.value)}
      className="px-4 py-2 border rounded-lg"
    >
      <option value="">Todas las marcas</option>
      {/* Genera marcas únicas */}
    </select>
    <select
      value={filterCollection}
      onChange={(e) => setFilterCollection(e.target.value)}
      className="px-4 py-2 border rounded-lg"
    >
      <option value="">Todas las colecciones</option>
      {COLECCIONES_SHOPIFY.map(col => (
        <option key={col} value={col}>{col}</option>
      ))}
    </select>
  </div>
</div>
```

---

## 2. 📄 Agregar Paginación

### Agrega estos estados:

```typescript
const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage] = useState(20);
```

### Función de paginación:

```typescript
const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
```

### Componente de paginación:

```tsx
<div className="flex justify-center items-center gap-2 mt-4">
  <button
    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
    disabled={currentPage === 1}
    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
  >
    Anterior
  </button>
  <span className="px-4">
    Página {currentPage} de {totalPages}
  </span>
  <button
    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
    disabled={currentPage === totalPages}
    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
  >
    Siguiente
  </button>
</div>
```

---

## 3. 📊 Agregar Estadísticas

### Crear componente `components/Stats.tsx`:

```tsx
'use client';

import { Product } from '@/types/product';

interface StatsProps {
  products: Product[];
}

export default function Stats({ products }: StatsProps) {
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => sum + (p.precio * p.stock), 0);
  const avgPrice = totalProducts > 0 ? products.reduce((sum, p) => sum + p.precio, 0) / totalProducts : 0;
  const lowStock = products.filter(p => p.stock < 5).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-gray-500 text-sm mb-2">Total Productos</h3>
        <p className="text-3xl font-bold text-blue-600">{totalProducts}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-gray-500 text-sm mb-2">Valor Inventario</h3>
        <p className="text-3xl font-bold text-green-600">
          ${totalValue.toLocaleString()}
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-gray-500 text-sm mb-2">Precio Promedio</h3>
        <p className="text-3xl font-bold text-purple-600">
          ${avgPrice.toLocaleString()}
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-gray-500 text-sm mb-2">Stock Bajo</h3>
        <p className="text-3xl font-bold text-red-600">{lowStock}</p>
      </div>
    </div>
  );
}
```

---

## 4. 🖼️ Agregar Carga de Imágenes

### Crear endpoint API `app/api/upload-image/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const productId = formData.get('productId') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Subir a Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${productId}-${Date.now()}.${fileExt}`;
    const filePath = `productos/${fileName}`;

    const { data, error } = await supabase.storage
      .from('imagenes')
      .upload(filePath, file);

    if (error) throw error;

    // Obtener URL pública
    const { data: { publicUrl } } = supabase.storage
      .from('imagenes')
      .getPublicUrl(filePath);

    // Actualizar producto con URL de imagen
    await supabase
      .from('productos')
      .update({ imagen_url: publicUrl })
      .eq('id', productId);

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
```

---

## 5. 🔍 Agregar Vista de Detalles del Producto

### Crear modal `components/ProductDetailModal.tsx`:

```tsx
'use client';

import { Product } from '@/types/product';
import { X } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
}

export default function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold">{product.nombre}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            {product.imagen_url ? (
              <img
                src={product.imagen_url}
                alt={product.nombre}
                className="w-full h-64 object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">Sin imagen</span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-sm font-semibold text-gray-600">SKU</label>
              <p className="text-lg">{product.sku}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">Marca</label>
              <p className="text-lg">{product.marca}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">Precio</label>
              <p className="text-2xl font-bold text-green-600">
                ${product.precio.toLocaleString()}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">Stock</label>
              <p className="text-lg">{product.stock} unidades</p>
            </div>
          </div>
        </div>

        {product.descripcion && (
          <div className="mt-4">
            <label className="text-sm font-semibold text-gray-600">Descripción</label>
            <p className="text-gray-700 mt-1">{product.descripcion}</p>
          </div>
        )}

        <div className="mt-4">
          <label className="text-sm font-semibold text-gray-600">Tipo de Producto</label>
          <p className="text-lg">{product.tipo_producto || 'No definido'}</p>
        </div>

        {product.etiquetas && product.etiquetas.length > 0 && (
          <div className="mt-4">
            <label className="text-sm font-semibold text-gray-600">Etiquetas</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {product.etiquetas.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {product.colecciones && product.colecciones.length > 0 && (
          <div className="mt-4">
            <label className="text-sm font-semibold text-gray-600">Colecciones</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {product.colecciones.map((col, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                >
                  {col}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## 6. 📥 Exportar a Excel

### Crear función de exportación:

```typescript
import * as XLSX from 'xlsx';

const exportToExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(
    products.map(p => ({
      'Nombre': p.nombre,
      'SKU': p.sku,
      'Marca': p.marca,
      'Precio': p.precio,
      'Stock': p.stock,
      'Tipo de Producto': p.tipo_producto,
      'Etiquetas': (p.etiquetas || []).join(', '),
      'Colecciones': (p.colecciones || []).join(', ')
    }))
  );
  
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Productos');
  XLSX.writeFile(workbook, `productos_${new Date().toISOString().split('T')[0]}.xlsx`);
};
```

### Botón de exportación:

```tsx
<button
  onClick={exportToExcel}
  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
>
  <Download size={16} />
  Exportar a Excel
</button>
```

---

## 7. 🔔 Notificaciones Toast

### Crear componente `components/Toast.tsx`:

```tsx
'use client';

import { useEffect } from 'react';
import { CheckCircle, XCircle, Info } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle className="text-green-600" />,
    error: <XCircle className="text-red-600" />,
    info: <Info className="text-blue-600" />
  };

  const backgrounds = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200'
  };

  return (
    <div className={`fixed top-4 right-4 ${backgrounds[type]} border rounded-lg p-4 shadow-lg flex items-center gap-3 z-50 animate-slide-in`}>
      {icons[type]}
      <p className="font-medium">{message}</p>
      <button onClick={onClose} className="ml-4">
        <XCircle size={20} className="text-gray-500" />
      </button>
    </div>
  );
}
```

---

## 8. 🎨 Temas Personalizados

### En `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#eff6ff',
        100: '#dbeafe',
        // ... más tonos
        900: '#1e3a8a',
      },
      // Colores de tu marca
      tyt: {
        primary: '#your-color',
        secondary: '#your-color',
      }
    }
  }
}
```

---

## 9. 🔒 Agregar Autenticación

### Configurar Supabase Auth:

```typescript
// lib/auth.ts
import { supabase } from './supabase';

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};
```

---

## 10. 📱 Hacer Responsive

### Mejoras para móviles:

```css
/* En globals.css */
@media (max-width: 768px) {
  .table-container {
    overflow-x: auto;
  }
  
  .editable-cell {
    min-width: 120px;
  }
  
  /* Ocultar columnas menos importantes en móvil */
  .hide-on-mobile {
    display: none;
  }
}
```

---

## 🚀 Cómo Implementar Estas Mejoras

1. **Crea archivos nuevos** si la mejora lo requiere
2. **Edita archivos existentes** para agregar funcionalidad
3. **Prueba localmente** si es posible, o directamente en Vercel
4. **Commit y push** a GitHub
5. **Vercel redesplegará automáticamente**

---

¡Estas son solo algunas ideas! Puedes personalizar el dashboard según tus necesidades específicas.

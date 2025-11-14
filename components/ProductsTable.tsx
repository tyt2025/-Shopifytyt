'use client';

import React, { useState, useEffect } from 'react';
import { Product, ProductTableRow, COLECCIONES_SHOPIFY } from '@/types/product';
import { supabase } from '@/lib/supabase';
import { Save } from 'lucide-react';

interface ProductsTableProps {
  initialProducts: Product[];
}

// Función helper para formatear números de forma segura
const formatNumber = (value: number | null | undefined): string => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0';
  }
  return value.toLocaleString();
};

// Función helper para obtener valor numérico seguro
const safeNumber = (value: number | null | undefined): number => {
  if (value === null || value === undefined || isNaN(value)) {
    return 0;
  }
  return value;
};

export default function ProductsTable({ initialProducts }: ProductsTableProps) {
  const [products, setProducts] = useState<ProductTableRow[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    setProducts(
      initialProducts.map(p => ({
        ...p,
        selected: false,
        etiquetas: p.etiquetas || [],
        colecciones: p.colecciones || [],
        tipo_producto: p.tipo_producto || '',
        marca: p.marca || 'Sin marca',
        precio: safeNumber(p.precio),
        stock: safeNumber(p.stock),
      }))
    );
  }, [initialProducts]);

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setProducts(products.map(p => ({ ...p, selected: newSelectAll })));
  };

  const handleSelectProduct = (id: string) => {
    setProducts(products.map(p =>
      p.id === id ? { ...p, selected: !p.selected } : p
    ));
  };

  const handleUpdateField = (id: string, field: keyof Product, value: any) => {
    setProducts(products.map(p =>
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const handleToggleCollection = (id: string, collection: string) => {
    setProducts(products.map(p => {
      if (p.id === id) {
        const colecciones = p.colecciones || [];
        const newColecciones = colecciones.includes(collection)
          ? colecciones.filter(c => c !== collection)
          : [...colecciones, collection];
        return { ...p, colecciones: newColecciones };
      }
      return p;
    }));
  };

  const handleSaveProduct = async (product: ProductTableRow) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('productos')
        .update({
          tipo_producto: product.tipo_producto || '',
          etiquetas: product.etiquetas || [],
          colecciones: product.colecciones || [],
          updated_at: new Date().toISOString(),
        })
        .eq('id', product.id);

      if (error) throw error;

      alert('Producto actualizado correctamente');
    } catch (error) {
      console.error('Error al guardar producto:', error);
      alert('Error al guardar el producto');
    } finally {
      setSaving(false);
    }
  };

  const handlePublishSelected = async () => {
    const selectedProducts = products.filter(p => p.selected);
    
    if (selectedProducts.length === 0) {
      alert('Por favor selecciona al menos un producto');
      return;
    }

    // Validar que todos los productos seleccionados tengan tipo_producto
    const productsWithoutType = selectedProducts.filter(p => !p.tipo_producto);
    if (productsWithoutType.length > 0) {
      alert(`${productsWithoutType.length} producto(s) no tienen "Tipo de producto" configurado`);
      return;
    }

    setPublishing(true);
    try {
      for (const product of selectedProducts) {
        const { error } = await supabase
          .from('productos')
          .update({
            tipo_producto: product.tipo_producto || '',
            etiquetas: product.etiquetas || [],
            colecciones: product.colecciones || [],
            updated_at: new Date().toISOString(),
          })
          .eq('id', product.id);

        if (error) throw error;
      }

      alert(`${selectedProducts.length} producto(s) publicado(s) correctamente`);
      
      // Deseleccionar todos después de publicar
      setSelectAll(false);
      setProducts(products.map(p => ({ ...p, selected: false })));
    } catch (error) {
      console.error('Error al publicar productos:', error);
      alert('Error al publicar los productos');
    } finally {
      setPublishing(false);
    }
  };

  const selectedCount = products.filter(p => p.selected).length;

  return (
    <div className="w-full">
      {/* Header con contador y botones */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">
            Productos de Supabase ({products.length})
          </h2>
          {selectedCount > 0 && (
            <span className="text-blue-600 font-medium">
              {selectedCount} producto(s) seleccionado(s)
            </span>
          )}
        </div>
        <button
          onClick={handlePublishSelected}
          disabled={selectedCount === 0 || publishing}
          className="btn-primary disabled:opacity-50"
        >
          {publishing ? 'Publicando...' : `Publicar seleccionados (${selectedCount})`}
        </button>
      </div>

      {/* Tabla de productos */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="w-4 h-4 cursor-pointer"
                  />
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  PRODUCTO
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  MARCA
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  PRECIO
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  STOCK
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  TIPO DE PRODUCTO
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  ETIQUETAS
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  COLECCIONES
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  ACCIONES
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => {
                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={product.selected}
                        onChange={() => handleSelectProduct(product.id)}
                        className="w-4 h-4 cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center">
                          {product.imagen_url ? (
                            <img
                              src={product.imagen_url}
                              alt={product.nombre || 'Producto'}
                              className="w-full h-full object-cover rounded"
                            />
                          ) : (
                            <span className="text-gray-400 text-xs">Sin img</span>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{product.nombre || 'Sin nombre'}</div>
                          <div className="text-xs text-gray-500">SKU: {product.sku || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{product.marca || 'Sin marca'}</td>
                    <td className="px-4 py-3 text-sm">${formatNumber(product.precio)}</td>
                    <td className="px-4 py-3 text-sm">{formatNumber(product.stock)}</td>
                    <td className="px-4 py-3 editable-cell">
                      <input
                        type="text"
                        value={product.tipo_producto || ''}
                        onChange={(e) => handleUpdateField(product.id, 'tipo_producto', e.target.value)}
                        placeholder="ej: cable RED"
                        className="text-sm"
                      />
                    </td>
                    <td className="px-4 py-3 editable-cell">
                      <input
                        type="text"
                        value={(product.etiquetas || []).join(', ')}
                        onChange={(e) => {
                          const tags = e.target.value.split(',').map(t => t.trim()).filter(Boolean);
                          handleUpdateField(product.id, 'etiquetas', tags);
                        }}
                        placeholder="ej: cable red, ethernet"
                        className="text-sm"
                      />
                      <div className="text-xs text-gray-500 mt-1">Separa con comas</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="relative">
                        <details className="cursor-pointer">
                          <summary className="text-sm text-blue-600 hover:text-blue-800">
                            {(product.colecciones || []).length} seleccionadas
                          </summary>
                          <div className="absolute z-10 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-3 max-h-64 overflow-y-auto">
                            {COLECCIONES_SHOPIFY.map((collection) => (
                              <label key={collection} className="collection-checkbox">
                                <input
                                  type="checkbox"
                                  checked={(product.colecciones || []).includes(collection)}
                                  onChange={() => handleToggleCollection(product.id, collection)}
                                />
                                <span className="text-sm">{collection}</span>
                              </label>
                            ))}
                          </div>
                        </details>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleSaveProduct(product)}
                        disabled={saving}
                        className="flex items-center gap-1 text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded disabled:opacity-50"
                      >
                        <Save size={14} />
                        Guardar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

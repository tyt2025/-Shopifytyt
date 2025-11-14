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
        shopify_category: p.shopify_category || '',
        brand: p.brand || 'Sin marca',
        price_cop: safeNumber(p.price_cop),
        available_stock: safeNumber(p.available_stock),
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
      // Preparar datos a actualizar (solo campos que existen en Supabase)
      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      // Solo agregar campos si tienen valor
      if (product.shopify_category !== undefined && product.shopify_category !== null) {
        updateData.shopify_category = product.shopify_category;
      }

      if (product.shopify_subcategory !== undefined && product.shopify_subcategory !== null) {
        updateData.shopify_subcategory = product.shopify_subcategory;
      }

      // Para arrays, verificar si la columna existe primero
      // Si etiquetas y colecciones no existen en tu tabla, comentar estas líneas:
      if (product.etiquetas !== undefined) {
        updateData.etiquetas = product.etiquetas || [];
      }

      if (product.colecciones !== undefined) {
        updateData.colecciones = product.colecciones || [];
      }

      console.log('Actualizando producto:', product.id, updateData);

      const { data, error } = await supabase
        .from('productos')
        .update(updateData)
        .eq('id', product.id)
        .select();

      if (error) {
        // Mostrar error completo en consola
        console.error('Error completo de Supabase:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw new Error(`${error.message}${error.hint ? ' - ' + error.hint : ''}`);
      }

      console.log('Producto actualizado exitosamente:', data);
      alert('✅ Producto actualizado correctamente');
    } catch (error: any) {
      console.error('Error al guardar producto:', error);
      alert(`❌ Error al guardar: ${error.message || 'Error desconocido'}`);
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

    // Validar que todos los productos seleccionados tengan tipo de producto
    const productsWithoutType = selectedProducts.filter(p => !p.shopify_category || p.shopify_category.trim() === '');
    if (productsWithoutType.length > 0) {
      alert(`❌ Hay ${productsWithoutType.length} producto(s) sin tipo de producto.\n\nPor favor completa este campo antes de publicar.`);
      return;
    }

    if (!confirm(`¿Deseas publicar ${selectedProducts.length} producto(s) en Shopify?`)) {
      return;
    }

    setPublishing(true);
    try {
      console.log('📤 Publicando productos en Shopify:', selectedProducts.map(p => ({
        sku: p.sku,
        product_name: p.product_name,
      })));

      // Llamar a la API de publicación
      const response = await fetch('/api/shopify/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          products: selectedProducts,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al publicar productos');
      }

      console.log('✅ Respuesta de Shopify:', data);

      // Mostrar resultados
      const successMessage = `✅ Publicación completada:\n\n` +
        `• Publicados: ${data.published}\n` +
        `• Fallidos: ${data.failed}\n\n` +
        (data.results.length > 0 
          ? `Productos publicados:\n${data.results.map((r: any) => 
              `✓ ${r.product_name}\n  ID: ${r.shopify_id}\n  Colecciones: ${r.collections_added?.length || 0} agregadas${r.collections_added?.length > 0 ? '\n  (' + r.collections_added.join(', ') + ')' : ''}`
            ).join('\n\n')}`
          : '') +
        (data.errors.length > 0 
          ? `\n\nErrores:\n${data.errors.map((e: any) => `✗ ${e.product_name}: ${JSON.stringify(e.error)}`).join('\n')}`
          : '');

      alert(successMessage);

      // Desmarcar productos publicados exitosamente
      if (data.results.length > 0) {
        const publishedSkus = data.results.map((r: any) => r.sku);
        setProducts(products.map(p => ({
          ...p,
          selected: publishedSkus.includes(p.sku) ? false : p.selected,
        })));
      }

    } catch (error: any) {
      console.error('❌ Error al publicar:', error);
      alert(`❌ Error al publicar productos:\n\n${error.message}\n\nVerifica:\n1. Credenciales de Shopify en Vercel\n2. Permisos de API\n3. Consola del navegador para más detalles`);
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
                          {product.image_url_png ? (
                            <img
                              src={product.image_url_png}
                              alt={product.product_name || 'Producto'}
                              className="w-full h-full object-cover rounded"
                            />
                          ) : (
                            <span className="text-gray-400 text-xs">Sin img</span>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{product.product_name || 'Sin nombre'}</div>
                          <div className="text-xs text-gray-500">SKU: {product.sku || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{product.brand || 'Sin marca'}</td>
                    <td className="px-4 py-3 text-sm">${formatNumber(product.price_cop)}</td>
                    <td className="px-4 py-3 text-sm">{formatNumber(product.available_stock)}</td>
                    <td className="px-4 py-3 editable-cell">
                      <input
                        type="text"
                        value={product.shopify_category || ''}
                        onChange={(e) => handleUpdateField(product.id, 'shopify_category', e.target.value)}
                        placeholder="ej: cable RED"
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </td>
                    <td className="px-4 py-3 editable-cell">
                      <input
                        type="text"
                        value={product.etiquetas?.join(', ') || ''}
                        onChange={(e) => handleUpdateField(
                          product.id,
                          'etiquetas',
                          e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                        )}
                        placeholder="ej: cable red, ethernet"
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <div className="text-xs text-gray-500 mt-1">Separa con comas</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="relative">
                        <details className="group">
                          <summary className="cursor-pointer list-none">
                            <div className="flex items-center justify-between px-2 py-1 text-sm border border-gray-300 rounded hover:border-gray-400">
                              <span className="text-gray-700">
                                ▼ {product.colecciones && product.colecciones.length > 0 
                                  ? `${product.colecciones.length} seleccionadas`
                                  : '0 seleccionadas'}
                              </span>
                            </div>
                          </summary>
                          <div className="absolute z-10 mt-1 w-64 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                            {COLECCIONES_SHOPIFY.map((col) => (
                              <label
                                key={col}
                                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                              >
                                <input
                                  type="checkbox"
                                  checked={product.colecciones?.includes(col) || false}
                                  onChange={() => handleToggleCollection(product.id, col)}
                                  className="w-4 h-4 cursor-pointer"
                                />
                                <span className="text-sm text-gray-700">{col}</span>
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
                        className="flex items-center gap-1 px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded disabled:opacity-50"
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

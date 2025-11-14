'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/types/product';
import ProductsTable from '@/components/ProductsTable';
import { RefreshCw } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from('productos')
        .select('*')
        .order('created_at', { ascending: false });

      if (supabaseError) throw supabaseError;

      // Asegurar que los campos críticos no sean undefined
      const sanitizedProducts = (data || []).map(product => ({
        ...product,
        marca: product.marca || 'Sin marca',
        precio: product.precio ?? 0,
        stock: product.stock ?? 0,
        tipo_producto: product.tipo_producto || '',
        etiquetas: product.etiquetas || [],
        colecciones: product.colecciones || [],
      }));

      setProducts(sanitizedProducts);
    } catch (err: any) {
      console.error('Error loading products:', err);
      setError(err.message || 'Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <RefreshCw className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Cargando productos...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-red-800 font-semibold mb-2">Error de Conexión</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <div className="space-y-2">
              <p className="text-sm text-red-700">
                Posibles causas:
              </p>
              <ul className="text-sm text-red-600 list-disc list-inside">
                <li>Las credenciales de Supabase no están configuradas correctamente</li>
                <li>La URL de Supabase es incorrecta</li>
                <li>La tabla 'productos' no existe en Supabase</li>
              </ul>
            </div>
            <button
              onClick={loadProducts}
              className="mt-4 btn-primary"
            >
              Reintentar
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-gray-900">
              Dashboard Shopify - Tintas y Tecnología
            </h1>
            <button
              onClick={loadProducts}
              className="flex items-center gap-2 text-sm bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
            >
              <RefreshCw size={16} />
              Recargar
            </button>
          </div>
          <p className="text-gray-600">
            Gestiona tus productos y publícalos masivamente en Shopify
          </p>
        </div>

        {/* Instrucciones */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">📝 Instrucciones de uso:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>✓ Edita el <strong>Tipo de producto</strong>, <strong>Etiquetas</strong> y <strong>Colecciones</strong> directamente en la tabla</li>
            <li>✓ Haz clic en <strong>Guardar</strong> para cada producto después de editarlo</li>
            <li>✓ Selecciona múltiples productos con los checkboxes</li>
            <li>✓ Haz clic en <strong>Publicar seleccionados</strong> para publicar masivamente</li>
            <li>✓ Cada producto mantiene su configuración individual</li>
          </ul>
        </div>

        {/* Tabla de productos */}
        {products.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-500 mb-4">No hay productos en la base de datos</p>
            <p className="text-sm text-gray-400 mb-4">
              Asegúrate de tener productos en tu tabla de Supabase llamada "productos"
            </p>
            <button
              onClick={loadProducts}
              className="btn-primary"
            >
              Recargar productos
            </button>
          </div>
        ) : (
          <ProductsTable initialProducts={products} />
        )}
      </div>
    </main>
  );
}

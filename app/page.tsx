'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Product, ShopifyCollection, SEOData } from '@/lib/types';
import { Upload, Loader2, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<ShopifyCollection[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [generatingSEO, setGeneratingSEO] = useState(false);
  
  // Campos del formulario
  const [tipo, setTipo] = useState('');
  const [etiquetas, setEtiquetas] = useState('');
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [seoData, setSeoData] = useState<Record<string, SEOData>>({});
  
  // Estado de mensajes
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Cargar productos de Supabase
  useEffect(() => {
    loadProducts();
    loadCollections();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .order('product_name', { ascending: true });
      
      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      console.error('Error loading products:', error);
      showMessage('error', 'Error al cargar productos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadCollections = async () => {
    try {
      const response = await fetch('/api/shopify-collections');
      if (!response.ok) throw new Error('Error al cargar colecciones');
      const data = await response.json();
      setCollections(data);
    } catch (error: any) {
      console.error('Error loading collections:', error);
      showMessage('error', 'Error al cargar colecciones de Shopify');
    }
  };

  const showMessage = (type: 'success' | 'error' | 'info', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(products.map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts(prev => [...prev, productId]);
    } else {
      setSelectedProducts(prev => prev.filter(id => id !== productId));
    }
  };

  const handleCollectionToggle = (collectionId: string) => {
    setSelectedCollections(prev => {
      if (prev.includes(collectionId)) {
        return prev.filter(id => id !== collectionId);
      } else if (prev.length < 3) {
        return [...prev, collectionId];
      } else {
        showMessage('info', 'Solo puedes seleccionar máximo 3 colecciones');
        return prev;
      }
    });
  };

  const generateSEO = async () => {
    if (selectedProducts.length === 0) {
      showMessage('error', 'Selecciona al menos un producto');
      return;
    }

    try {
      setGeneratingSEO(true);
      const newSeoData: Record<string, SEOData> = {};
      let errorCount = 0;
      let errorMessage = '';

      for (const productId of selectedProducts) {
        const product = products.find(p => p.id === productId);
        if (!product) continue;

        try {
          const response = await fetch('/api/generate-seo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              productName: product.product_name,
              description: product.description,
              marca: product.brand,
              tipo,
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            errorCount++;
            errorMessage = data.error || 'Error desconocido';
            
            // Si es error de API key, mostrar mensaje específico
            if (data.error?.includes('API key')) {
              showMessage('error', `⚠️ ${data.error}`);
              break;
            }
            continue;
          }

          newSeoData[productId] = data;
        } catch (error: any) {
          errorCount++;
          errorMessage = error.message;
        }
      }

      if (Object.keys(newSeoData).length > 0) {
        setSeoData(newSeoData);
        showMessage('success', `✅ SEO generado para ${Object.keys(newSeoData).length} producto(s)`);
      } else if (errorCount > 0) {
        showMessage('error', `❌ Error al generar SEO: ${errorMessage}. Verifica tu configuración de OpenAI API key en Vercel.`);
      }
    } catch (error: any) {
      console.error('Error generating SEO:', error);
      showMessage('error', '❌ Error al generar SEO. Verifica que tu API key de OpenAI esté configurada correctamente.');
    } finally {
      setGeneratingSEO(false);
    }
  };

  const publishToShopify = async () => {
    if (selectedProducts.length === 0) {
      showMessage('error', 'Selecciona al menos un producto para publicar');
      return;
    }

    if (!tipo) {
      showMessage('error', 'El campo "Tipo" es obligatorio');
      return;
    }

    try {
      setPublishing(true);
      let successCount = 0;
      let errorCount = 0;
      const errors: string[] = [];

      for (const productId of selectedProducts) {
        const product = products.find(p => p.id === productId);
        if (!product) continue;

        try {
          const response = await fetch('/api/publish-to-shopify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              productId,
              tipo,
              etiquetas: etiquetas.split(',').map(t => t.trim()).filter(t => t),
              colecciones: selectedCollections,
              seoTitle: seoData[productId]?.title,
              seoDescription: seoData[productId]?.description,
              forcePublish: false, // Cambiar a true para forzar publicación sin verificar duplicados
            }),
          });

          const data = await response.json();

          if (response.ok) {
            successCount++;
          } else if (response.status === 409) {
            // Error de duplicado
            errors.push(`${product.product_name}: Ya existe en Shopify (SKU: ${product.sku || 'N/A'})`);
            errorCount++;
          } else {
            errors.push(`${product.product_name}: ${data.error || 'Error desconocido'}`);
            errorCount++;
          }
        } catch (error: any) {
          errors.push(`${product.product_name}: ${error.message}`);
          errorCount++;
        }
      }

      // Mostrar resumen
      if (successCount > 0) {
        showMessage('success', `✅ ${successCount} producto(s) publicados exitosamente`);
      }
      if (errorCount > 0) {
        showMessage('error', `❌ ${errorCount} producto(s) con errores: ${errors.join(', ')}`);
      }

      // Limpiar selección
      setSelectedProducts([]);
      setSeoData({});
    } catch (error: any) {
      console.error('Error publishing:', error);
      showMessage('error', 'Error al publicar productos');
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Shopify - Tintas y Tecnología
          </h1>
          <p className="text-gray-600 mt-2">
            Migra productos de Supabase a tu tienda Shopify
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Mensaje de notificación */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : message.type === 'error'
                ? 'bg-red-50 text-red-800 border border-red-200'
                : 'bg-blue-50 text-blue-800 border border-blue-200'
            }`}
          >
            {message.type === 'success' && <CheckCircle2 className="w-5 h-5" />}
            {message.type === 'error' && <AlertCircle className="w-5 h-5" />}
            {message.type === 'info' && <AlertCircle className="w-5 h-5" />}
            <p>{message.text}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tabla de productos */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">
                  Productos de Supabase ({products.length})
                </h2>
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === products.length && products.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  Seleccionar todos
                </label>
              </div>

              <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        <span className="sr-only">Seleccionar</span>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Producto
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Marca
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Precio
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Stock
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr
                        key={product.id}
                        className={`hover:bg-gray-50 ${
                          selectedProducts.includes(product.id) ? 'bg-blue-50' : ''
                        }`}
                      >
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedProducts.includes(product.id)}
                            onChange={(e) => handleSelectProduct(product.id, e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {(product.main_image_url || product.image_url_png) && (
                              <img
                                src={product.main_image_url || product.image_url_png}
                                alt={product.product_name}
                                className="w-12 h-12 object-cover rounded"
                              />
                            )}
                            <div>
                              <p className="font-medium text-gray-900">{product.product_name}</p>
                              {product.sku && (
                                <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {product.brand || 'Sin marca'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                          ${(product.price_cop || product.price)?.toLocaleString('es-CO') || '0'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {product.available_stock || 0}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Panel de configuración */}
          <div className="space-y-6">
            {/* Información de selección */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 font-medium">
                {selectedProducts.length} producto(s) seleccionado(s)
              </p>
            </div>

            {/* Formulario */}
            <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Configuración de publicación
              </h3>

              {/* Tipo (Manual - Obligatorio) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de producto <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  placeholder="Ej: Electrónica, Computadoras, Accesorios"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Campo manual obligatorio</p>
              </div>

              {/* Etiquetas (Manual) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Etiquetas (Tags)
                </label>
                <input
                  type="text"
                  value={etiquetas}
                  onChange={(e) => setEtiquetas(e.target.value)}
                  placeholder="tecnología, nuevo, oferta (separadas por comas)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Separa múltiples etiquetas con comas</p>
              </div>

              {/* Colecciones (Manual - Máximo 3) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Colecciones de Shopify (máximo 3)
                </label>
                <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3 space-y-2">
                  {collections.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-2">
                      No hay colecciones disponibles
                    </p>
                  ) : (
                    collections.map((collection) => (
                      <label
                        key={collection.id}
                        className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCollections.includes(collection.id)}
                          onChange={() => handleCollectionToggle(collection.id)}
                          className="w-4 h-4 rounded border-gray-300"
                        />
                        <span className="text-sm text-gray-700">{collection.title}</span>
                      </label>
                    ))
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {selectedCollections.length}/3 colecciones seleccionadas
                </p>
              </div>

              {/* Información automática */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
                <p className="text-sm font-medium text-gray-700">Campos automáticos:</p>
                <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                  <li>Proveedor: Se llena con la marca de Supabase</li>
                  <li>Descripción: Se copia desde Supabase</li>
                  <li>Condición Google: Siempre "nuevo"</li>
                </ul>
              </div>

              {/* Botón generar SEO */}
              <button
                onClick={generateSEO}
                disabled={selectedProducts.length === 0 || generatingSEO}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                {generatingSEO ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generando SEO con IA...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generar SEO con IA
                  </>
                )}
              </button>

              {/* Mostrar SEO generado */}
              {Object.keys(seoData).length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-green-800 mb-2">
                    ✅ SEO generado para {Object.keys(seoData).length} producto(s)
                  </p>
                  {selectedProducts.slice(0, 1).map(productId => {
                    const seo = seoData[productId];
                    if (!seo) return null;
                    return (
                      <div key={productId} className="text-xs text-green-700 space-y-1">
                        <p><strong>Título:</strong> {seo.title}</p>
                        <p><strong>Descripción:</strong> {seo.description}</p>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Botón publicar */}
              <button
                onClick={publishToShopify}
                disabled={selectedProducts.length === 0 || !tipo || publishing}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                {publishing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Publicando en Shopify...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Publicar en Shopify
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

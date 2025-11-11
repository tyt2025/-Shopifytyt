'use client'

import { useState, useEffect } from 'react'
import { Product } from '@/lib/supabase'
import ProductTable from '@/components/ProductTable'
import CategoryModal from '@/components/CategoryModal'
import { Upload, Search, Filter, CheckCircle, AlertCircle } from 'lucide-react'

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(new Set())
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [notification, setNotification] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [page, searchTerm, categoryFilter])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '50',
        ...(searchTerm && { search: searchTerm }),
        ...(categoryFilter && { category: categoryFilter }),
      })

      const response = await fetch(`/api/products?${params}`)
      const data = await response.json()

      if (response.ok) {
        setProducts(data.products)
        setTotalPages(data.totalPages)
      } else {
        showNotification('error', 'Error al cargar productos')
      }
    } catch (error) {
      showNotification('error', 'Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectProduct = (product: Product, selected: boolean) => {
    const newSelected = new Set(selectedProducts)
    if (selected) {
      newSelected.add(product.id)
    } else {
      newSelected.delete(product.id)
    }
    setSelectedProducts(newSelected)
  }

  const handleEditCategory = (product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const handleSaveCategory = async (
    productId: number,
    category: string,
    subcategory: string
  ) => {
    try {
      const response = await fetch('/api/products/category', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          shopify_category: category,
          shopify_subcategory: subcategory,
        }),
      })

      if (response.ok) {
        // Actualizar localmente
        setProducts((prev) =>
          prev.map((p) =>
            p.id === productId
              ? { ...p, shopify_category: category, shopify_subcategory: subcategory }
              : p
          )
        )
        showNotification('success', 'Categorías guardadas en Supabase')
      } else {
        showNotification('error', 'Error al guardar categorías')
      }
    } catch (error) {
      showNotification('error', 'Error de conexión')
    }
  }

  const handlePublishToShopify = async () => {
    if (selectedProducts.size === 0) {
      showNotification('error', 'Selecciona al menos un producto')
      return
    }

    const productsToPublish = products.filter((p) => selectedProducts.has(p.id))

    // Verificar que todos tengan categoría Shopify
    const withoutCategory = productsToPublish.filter((p) => !p.shopify_category)
    if (withoutCategory.length > 0) {
      showNotification(
        'error',
        `${withoutCategory.length} producto(s) sin categoría Shopify asignada`
      )
      return
    }

    setPublishing(true)
    try {
      const response = await fetch('/api/shopify/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: productsToPublish }),
      })

      const data = await response.json()

      if (response.ok) {
        showNotification(
          'success',
          `Publicados: ${data.published} | Errores: ${data.failed}`
        )
        setSelectedProducts(new Set())
        fetchProducts()
      } else {
        showNotification('error', data.error || 'Error al publicar productos')
      }
    } catch (error) {
      showNotification('error', 'Error de conexión al publicar')
    } finally {
      setPublishing(false)
    }
  }

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000)
  }

  // Obtener categorías únicas
  const categories: string[] = Array.from(
    new Set(products.map((p) => p.category).filter(Boolean))
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notificación */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center p-4 rounded-lg shadow-lg ${
            notification.type === 'success'
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle className="w-5 h-5 mr-2" />
          ) : (
            <AlertCircle className="w-5 h-5 mr-2" />
          )}
          {notification.message}
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Dashboard Supabase → Shopify
            </h1>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {selectedProducts.size} seleccionados
              </span>
              <button
                onClick={handlePublishToShopify}
                disabled={publishing || selectedProducts.size === 0}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <Upload className="w-4 h-4 mr-2" />
                {publishing ? 'Publicando...' : 'Publicar a Shopify'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Filtros */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre o SKU..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setPage(1)
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value)
                  setPage(1)
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="">Todas las categorías</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={fetchProducts}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300"
            >
              {loading ? 'Cargando...' : 'Actualizar'}
            </button>
          </div>
        </div>

        {/* Tabla de productos */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No se encontraron productos
            </div>
          ) : (
            <ProductTable
              products={products}
              onSelectProduct={handleSelectProduct}
              selectedProducts={selectedProducts}
              onEditCategory={handleEditCategory}
            />
          )}
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-6 space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <span className="text-sm text-gray-600">
              Página {page} de {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>

      {/* Modal de categorías */}
      <CategoryModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedProduct(null)
        }}
        onSave={handleSaveCategory}
      />
    </div>
  )
}

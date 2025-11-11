'use client'

import { useState, useEffect } from 'react'
import { Product } from '@/lib/supabase'
import { SHOPIFY_CATEGORIES, getSubcategories } from '@/lib/shopify-categories'
import { X } from 'lucide-react'

interface CategoryModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
  onSave: (productId: number, category: string, subcategory: string) => void
}

export default function CategoryModal({
  product,
  isOpen,
  onClose,
  onSave,
}: CategoryModalProps) {
  const [category, setCategory] = useState('')
  const [subcategory, setSubcategory] = useState('')
  const [availableSubcategories, setAvailableSubcategories] = useState<string[]>([])

  useEffect(() => {
    if (product) {
      setCategory(product.shopify_category || '')
      setSubcategory(product.shopify_subcategory || '')
      
      // Cargar subcategorías si ya tiene categoría asignada
      if (product.shopify_category) {
        setAvailableSubcategories(getSubcategories(product.shopify_category))
      }
    }
  }, [product])

  useEffect(() => {
    // Actualizar subcategorías cuando cambia la categoría
    if (category) {
      const subcats = getSubcategories(category)
      setAvailableSubcategories(subcats)
      
      // Limpiar subcategoría si no está en la nueva lista
      if (subcategory && !subcats.includes(subcategory)) {
        setSubcategory('')
      }
    } else {
      setAvailableSubcategories([])
      setSubcategory('')
    }
  }, [category])

  if (!isOpen || !product) return null

  const handleSave = () => {
    onSave(product.id, category, subcategory)
    onClose()
  }

  const handleCategoryChange = (value: string) => {
    setCategory(value)
    // La limpieza de subcategoría se maneja en el useEffect
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Configurar Categorías Shopify</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Producto
            </label>
            <div className="text-sm text-gray-600">{product.product_name}</div>
            <div className="text-xs text-gray-400">SKU: {product.sku}</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoría Original (Supabase)
            </label>
            <div className="text-sm text-gray-600">
              {product.category} / {product.category_sub}
            </div>
          </div>

          <div>
            <label htmlFor="shopify-category" className="block text-sm font-medium text-gray-700 mb-1">
              Categoría Shopify *
            </label>
            <select
              id="shopify-category"
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Selecciona una categoría --</option>
              {SHOPIFY_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <div className="text-xs text-gray-500 mt-1">
              Esto se usará como "Product Type" en Shopify
            </div>
          </div>

          <div>
            <label htmlFor="shopify-subcategory" className="block text-sm font-medium text-gray-700 mb-1">
              Subcategoría Shopify
            </label>
            <select
              id="shopify-subcategory"
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              disabled={!category || availableSubcategories.length === 0}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">-- Selecciona una subcategoría --</option>
              {availableSubcategories.map((subcat) => (
                <option key={subcat} value={subcat}>
                  {subcat}
                </option>
              ))}
            </select>
            <div className="text-xs text-gray-500 mt-1">
              {!category && 'Selecciona primero una categoría'}
              {category && availableSubcategories.length === 0 && 'No hay subcategorías disponibles'}
              {category && availableSubcategories.length > 0 && 'Esto se agregará como "Tag" en Shopify'}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <div className="text-xs text-blue-800">
              <strong>Vista previa en Shopify:</strong>
              <div className="mt-1">
                <span className="font-medium">Product Type:</span> {category || '(no asignado)'}
              </div>
              <div className="mt-1">
                <span className="font-medium">Tags:</span> {[product.category, product.category_sub, subcategory].filter(Boolean).join(', ')}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!category}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  )
}

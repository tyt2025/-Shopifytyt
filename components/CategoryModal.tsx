'use client'

import { useState, useEffect } from 'react'
import { Product } from '@/lib/supabase'
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

  useEffect(() => {
    if (product) {
      setCategory(product.shopify_category || '')
      setSubcategory(product.shopify_subcategory || '')
    }
  }, [product])

  if (!isOpen || !product) return null

  const handleSave = () => {
    onSave(product.id, category, subcategory)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
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
            <input
              id="shopify-category"
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Ej: Electrónica, Computadores, Accesorios"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="shopify-subcategory" className="block text-sm font-medium text-gray-700 mb-1">
              Subcategoría Shopify
            </label>
            <input
              id="shopify-subcategory"
              type="text"
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              placeholder="Ej: Laptops, Monitores, Teclados"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="text-xs text-gray-500">
            * Estas categorías se usarán como Product Type y Tags en Shopify
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

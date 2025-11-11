'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Product } from '@/lib/supabase'
import { Check, X, Edit2, Upload } from 'lucide-react'

interface ProductTableProps {
  products: Product[]
  onSelectProduct: (product: Product, selected: boolean) => void
  selectedProducts: Set<number>
  onEditCategory: (product: Product) => void
}

export default function ProductTable({
  products,
  onSelectProduct,
  selectedProducts,
  onEditCategory,
}: ProductTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <input
                type="checkbox"
                onChange={(e) => {
                  products.forEach((p) => onSelectProduct(p, e.target.checked))
                }}
                className="rounded border-gray-300"
              />
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Imagen
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              SKU
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Producto
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Categoría Supabase
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Categoría Shopify
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Stock
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Precio
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => (
            <tr
              key={product.id}
              className={selectedProducts.has(product.id) ? 'bg-blue-50' : ''}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={selectedProducts.has(product.id)}
                  onChange={(e) => onSelectProduct(product, e.target.checked)}
                  className="rounded border-gray-300"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-16 w-16 relative">
                  <Image
                    src={product.main_image_url || product.image_url_png || '/placeholder.png'}
                    alt={product.product_name}
                    fill
                    className="object-contain"
                  />
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {product.sku}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                <div className="font-medium">{product.product_name}</div>
                <div className="text-gray-500 text-xs">{product.brand}</div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                <div>{product.category}</div>
                <div className="text-xs text-gray-400">{product.category_sub}</div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {product.shopify_category ? (
                  <>
                    <div className="text-green-600 font-medium">{product.shopify_category}</div>
                    {product.shopify_subcategory && (
                      <div className="text-xs text-green-500">{product.shopify_subcategory}</div>
                    )}
                  </>
                ) : (
                  <span className="text-gray-400">No asignada</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {product.available_stock}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${(product.price || product.price_cop || 0).toLocaleString('es-CO')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {product.shopify_published ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <Check className="w-3 h-3 mr-1" />
                    Publicado
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    <X className="w-3 h-3 mr-1" />
                    Sin publicar
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => onEditCategory(product)}
                  disabled={product.shopify_published}
                  className="text-blue-600 hover:text-blue-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

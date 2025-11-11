import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { createShopifyProduct, addProductToCollection } from '@/lib/shopify'

export async function POST(request: Request) {
  try {
    const { products } = await request.json()

    if (!products || !Array.isArray(products)) {
      return NextResponse.json(
        { error: 'Se requiere un array de productos' },
        { status: 400 }
      )
    }

    const results = []
    const errors = []

    for (const product of products) {
      try {
        // Verificar si el producto ya existe en Shopify
        const { data: existingProduct } = await supabase
          .from('productos')
          .select('shopify_product_id')
          .eq('id', product.id)
          .single()

        if (existingProduct?.shopify_product_id) {
          errors.push({
            productId: product.id,
            sku: product.sku,
            error: 'Producto ya publicado en Shopify',
          })
          continue
        }

        // Preparar datos para Shopify
        const shopifyData = {
          title: product.product_name,
          body_html: product.description || product.short_description || '',
          vendor: product.brand || 'Genérico',
          product_type: product.shopify_category || product.category || '',
          tags: [
            product.category,
            product.category_sub,
            product.shopify_subcategory || '',
          ].filter(Boolean),
          variants: [
            {
              price: (product.price || product.price_cop || 0).toString(),
              sku: product.sku,
              inventory_quantity: product.available_stock || 0,
            },
          ],
          images: [
            product.main_image_url || product.image_url_png,
            ...(product.images || []),
          ]
            .filter(Boolean)
            .map((url) => ({ src: url })),
        }

        // Crear producto en Shopify
        const shopifyProduct = await createShopifyProduct(shopifyData)

        // Actualizar producto en Supabase con el ID de Shopify
        await supabase
          .from('productos')
          .update({
            shopify_product_id: shopifyProduct.id.toString(),
            shopify_published: true,
            shopify_category: product.shopify_category,
            shopify_subcategory: product.shopify_subcategory,
          })
          .eq('id', product.id)

        results.push({
          productId: product.id,
          sku: product.sku,
          shopifyId: shopifyProduct.id,
          success: true,
        })
      } catch (error: any) {
        console.error(`Error publishing product ${product.sku}:`, error)
        errors.push({
          productId: product.id,
          sku: product.sku,
          error: error.message || 'Error desconocido',
        })
      }
    }

    return NextResponse.json({
      success: true,
      results,
      errors,
      total: products.length,
      published: results.length,
      failed: errors.length,
    })
  } catch (error: any) {
    console.error('Error in publish API:', error)
    return NextResponse.json(
      { error: error.message || 'Error al publicar productos' },
      { status: 500 }
    )
  }
}

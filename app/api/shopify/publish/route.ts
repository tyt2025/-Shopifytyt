import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { createShopifyProduct, addProductToCollection, getShopifyCollections, createShopifyCollection } from '@/lib/shopify'

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
        // TIPO = Subcategoría específica (ej: "bornea", "adaptador", "cable")
        // COLECCIONES = Categoría principal (ej: "Redes y Vigilancia")
        // ETIQUETAS = Tags adicionales opcionales (de Supabase)
        const shopifyData = {
          title: product.product_name,
          body_html: product.description || product.short_description || '',
          vendor: product.brand || 'Genérico',
          product_type: product.shopify_subcategory || product.category_sub || '',
          tags: [
            // Solo incluir tags adicionales, no las categorías
            ...(product.category && product.category !== product.shopify_category ? [product.category] : []),
            ...(product.category_sub && product.category_sub !== product.shopify_subcategory ? [product.category_sub] : []),
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

        // Agregar producto a la colección (categoría principal)
        if (product.shopify_category) {
          try {
            // Obtener todas las colecciones de Shopify
            const collections = await getShopifyCollections()
            
            // Buscar la colección que coincida con la categoría
            let collection = collections.find(
              (c: any) => c.title.toLowerCase() === product.shopify_category.toLowerCase()
            )
            
            // Si no existe la colección, crearla
            if (!collection) {
              console.log(`Creando colección: ${product.shopify_category}`)
              collection = await createShopifyCollection(product.shopify_category)
            }
            
            // Agregar producto a la colección
            await addProductToCollection(shopifyProduct.id.toString(), collection.id.toString())
          } catch (collectionError) {
            console.error('Error adding to collection:', collectionError)
            // No detenemos el proceso si falla agregar a colección
          }
        }

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

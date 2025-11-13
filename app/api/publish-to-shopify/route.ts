import { NextRequest, NextResponse } from 'next/server';
import { getProduct } from '@/lib/supabase';
import { createShopifyProduct, addProductToCollections, checkProductExists, publishProductToChannels } from '@/lib/shopify';
import { ShopifyProduct } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, tipo, etiquetas, colecciones, seoTitle, seoDescription, forcePublish } = body;

    // Validaciones
    if (!productId) {
      return NextResponse.json(
        { error: 'El ID del producto es requerido' },
        { status: 400 }
      );
    }

    // Obtener producto de Supabase
    const product = await getProduct(productId);

    if (!product) {
      return NextResponse.json(
        { error: 'Producto no encontrado en Supabase' },
        { status: 404 }
      );
    }

    // Verificar si el producto ya existe en Shopify (solo si no se fuerza la publicación)
    if (!forcePublish) {
      const exists = await checkProductExists(product.sku, product.product_name);
      if (exists) {
        return NextResponse.json(
          { 
            error: 'Este producto ya existe en Shopify', 
            warning: true,
            productName: product.product_name,
            sku: product.sku,
            hint: 'Si estás seguro de que no existe, puede ser un falso positivo. Intenta buscar el producto en Shopify manualmente.'
          },
          { status: 409 }
        );
      }
    }

    // Construir el objeto del producto para Shopify
    const shopifyProduct: ShopifyProduct = {
      title: product.product_name,
      body_html: product.description || '',
      vendor: product.brand || 'Sin marca',
      product_type: tipo || 'Electrónica', // Siempre "Electrónica" por defecto
      tags: etiquetas || [],
      published: true, // Publicar inmediatamente
      status: 'active', // Estado activo
      variants: [
        {
          price: product.price_cop ? product.price_cop.toString() : (product.price ? product.price.toString() : '0'),
          sku: product.sku || '',
          inventory_quantity: product.available_stock || 0,
          inventory_management: 'shopify', // Habilitar seguimiento de inventario
          inventory_policy: 'deny', // No permitir venta sin stock
          fulfillment_service: 'manual', // Cumplimiento manual
          requires_shipping: true, // Requiere envío
          taxable: true, // Es gravable
          metafields: [
            {
              namespace: 'custom',
              key: 'google_condition',
              value: 'nuevo',
              type: 'single_line_text_field',
            },
          ],
        },
      ],
      metafields: [],
    };

    // Agregar imagen si existe (priorizar main_image_url, luego image_url_png)
    const imageUrl = product.main_image_url || product.image_url_png;
    if (imageUrl) {
      shopifyProduct.images = [
        {
          src: imageUrl,
          alt: product.product_name,
        },
      ];
    }

    // Agregar metafields de SEO si se proporcionaron
    if (seoTitle || seoDescription) {
      shopifyProduct.metafields = [
        ...(shopifyProduct.metafields || []),
        {
          namespace: 'global',
          key: 'title_tag',
          value: seoTitle || product.product_name,
          type: 'single_line_text_field',
        },
        {
          namespace: 'global',
          key: 'description_tag',
          value: seoDescription || product.short_description || product.description || '',
          type: 'single_line_text_field',
        },
      ];
    }

    // Crear el producto en Shopify
    const createdProduct = await createShopifyProduct(shopifyProduct);

    // Publicar en canales de venta (Google y YouTube)
    try {
      await publishProductToChannels(createdProduct.id.toString());
    } catch (error) {
      console.log('Warning: No se pudo publicar en todos los canales, pero el producto fue creado');
    }

    // Agregar a colecciones si se especificaron
    if (colecciones && colecciones.length > 0) {
      await addProductToCollections(createdProduct.id.toString(), colecciones);
    }

    return NextResponse.json({
      success: true,
      message: 'Producto publicado exitosamente en Shopify',
      shopifyProductId: createdProduct.id,
      shopifyProductHandle: createdProduct.handle,
      shopifyProductUrl: `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/products/${createdProduct.id}`,
    });
  } catch (error: any) {
    console.error('Error publishing to Shopify:', error);
    
    // Errores específicos de Shopify
    if (error.response?.status === 401) {
      return NextResponse.json(
        {
          error: 'Error de autenticación con Shopify',
          details: 'Verifica que tu SHOPIFY_ADMIN_API_TOKEN sea válido.',
        },
        { status: 500 }
      );
    }
    
    if (error.response?.status === 422) {
      return NextResponse.json(
        {
          error: 'Datos inválidos para Shopify',
          details: error.response?.data?.errors || 'Verifica que todos los campos sean correctos.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: 'Error al publicar producto en Shopify',
        details: error.response?.data?.errors || error.message,
        hint: 'Revisa los logs de Vercel para más detalles.',
      },
      { status: 500 }
    );
  }
}

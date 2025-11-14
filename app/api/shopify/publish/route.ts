import { NextRequest, NextResponse } from 'next/server';

interface ProductToPublish {
  id: string;
  product_name: string;
  sku: string;
  brand?: string;
  price_cop?: number;
  available_stock?: number;
  image_url_png?: string;
  description?: string;
  shopify_category?: string;
  shopify_subcategory?: string;
  etiquetas?: string[];
  colecciones?: string[];
}

interface ShopifyProduct {
  title: string;
  body_html: string;
  vendor: string;
  product_type: string;
  tags: string;
  variants: {
    price: string;
    sku: string;
    inventory_quantity: number;
    inventory_management: string;
  }[];
  images?: {
    src: string;
  }[];
  status: string;
}

export async function POST(request: NextRequest) {
  try {
    const { products } = await request.json();

    if (!products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { error: 'No se proporcionaron productos para publicar' },
        { status: 400 }
      );
    }

    // Validar variables de entorno
    const shopifyDomain = process.env.SHOPIFY_STORE_DOMAIN;
    const shopifyAccessToken = process.env.SHOPIFY_ACCESS_TOKEN;

    if (!shopifyDomain || !shopifyAccessToken) {
      console.error('Faltan credenciales de Shopify:', {
        domain: !!shopifyDomain,
        token: !!shopifyAccessToken,
      });
      return NextResponse.json(
        { 
          error: 'Credenciales de Shopify no configuradas',
          details: 'Verifica SHOPIFY_STORE_DOMAIN y SHOPIFY_ACCESS_TOKEN en Vercel'
        },
        { status: 500 }
      );
    }

    const results = [];
    const errors = [];

    // Publicar cada producto
    for (const product of products as ProductToPublish[]) {
      try {
        // Preparar datos del producto para Shopify
        const shopifyProduct: ShopifyProduct = {
          title: product.product_name || 'Sin título',
          body_html: product.description || '',
          vendor: product.brand || 'Sin marca',
          product_type: product.shopify_category || '',
          tags: [
            ...(product.etiquetas || []),
            ...(product.colecciones || []),
          ].join(', '),
          variants: [
            {
              price: product.price_cop ? (product.price_cop / 1).toFixed(2) : '0.00',
              sku: product.sku || '',
              inventory_quantity: product.available_stock || 0,
              inventory_management: 'shopify',
            },
          ],
          status: 'active',
        };

        // Agregar imagen si existe
        if (product.image_url_png) {
          shopifyProduct.images = [
            {
              src: product.image_url_png,
            },
          ];
        }

        console.log('Publicando producto en Shopify:', {
          sku: product.sku,
          title: product.product_name,
        });

        // Llamada a Shopify Admin API
        const response = await fetch(
          `https://${shopifyDomain}/admin/api/2024-01/products.json`,
          {
            method: 'POST',
            headers: {
              'X-Shopify-Access-Token': shopifyAccessToken,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ product: shopifyProduct }),
          }
        );

        const responseData = await response.json();

        if (!response.ok) {
          console.error('Error de Shopify:', {
            status: response.status,
            statusText: response.statusText,
            data: responseData,
          });

          errors.push({
            product_name: product.product_name,
            sku: product.sku,
            error: responseData.errors || responseData.error || 'Error desconocido',
          });
          continue;
        }

        // Éxito
        results.push({
          product_name: product.product_name,
          sku: product.sku,
          shopify_id: responseData.product.id,
          shopify_handle: responseData.product.handle,
          success: true,
        });

        console.log('Producto publicado exitosamente:', {
          sku: product.sku,
          shopify_id: responseData.product.id,
        });

      } catch (error: any) {
        console.error('Error al publicar producto:', error);
        errors.push({
          product_name: product.product_name,
          sku: product.sku,
          error: error.message || 'Error desconocido',
        });
      }
    }

    // Responder con resultados
    return NextResponse.json({
      success: true,
      published: results.length,
      failed: errors.length,
      results,
      errors,
    });

  } catch (error: any) {
    console.error('Error general en la API:', error);
    return NextResponse.json(
      { 
        error: 'Error al procesar la solicitud',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

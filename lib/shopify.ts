import axios from 'axios';
import { ShopifyProduct, ShopifyCollection } from './types';

const SHOPIFY_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!;
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN!;
const SHOPIFY_API_VERSION = '2024-01';

const shopifyAxios = axios.create({
  baseURL: `https://${SHOPIFY_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}`,
  headers: {
    'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
    'Content-Type': 'application/json',
  },
});

// Obtener todas las colecciones de Shopify
export async function getShopifyCollections(): Promise<ShopifyCollection[]> {
  try {
    const response = await shopifyAxios.get('/custom_collections.json');
    const customCollections = response.data.custom_collections || [];
    
    const smartResponse = await shopifyAxios.get('/smart_collections.json');
    const smartCollections = smartResponse.data.smart_collections || [];
    
    const allCollections = [...customCollections, ...smartCollections];
    
    return allCollections.map((col: any) => ({
      id: col.id.toString(),
      title: col.title,
      handle: col.handle,
    }));
  } catch (error) {
    console.error('Error fetching Shopify collections:', error);
    throw error;
  }
}

// Crear producto en Shopify
export async function createShopifyProduct(productData: ShopifyProduct) {
  try {
    const response = await shopifyAxios.post('/products.json', {
      product: productData,
    });
    return response.data.product;
  } catch (error: any) {
    console.error('Error creating Shopify product:', error.response?.data || error);
    throw error;
  }
}

// Agregar producto a colecciones
export async function addProductToCollections(productId: string, collectionIds: string[]) {
  try {
    const promises = collectionIds.map(async (collectionId) => {
      return shopifyAxios.post('/collects.json', {
        collect: {
          product_id: productId,
          collection_id: collectionId,
        },
      });
    });
    
    await Promise.all(promises);
  } catch (error: any) {
    console.error('Error adding product to collections:', error.response?.data || error);
    throw error;
  }
}

// Actualizar metafields del producto
export async function updateProductMetafields(productId: string, metafields: any[]) {
  try {
    const promises = metafields.map(async (metafield) => {
      return shopifyAxios.post(`/products/${productId}/metafields.json`, {
        metafield,
      });
    });
    
    await Promise.all(promises);
  } catch (error: any) {
    console.error('Error updating metafields:', error.response?.data || error);
    throw error;
  }
}

// Verificar si un producto ya existe en Shopify (por SKU o título)
export async function checkProductExists(sku?: string, title?: string): Promise<boolean> {
  try {
    if (sku) {
      const response = await shopifyAxios.get(`/products.json?fields=id&limit=1&sku=${sku}`);
      if (response.data.products && response.data.products.length > 0) {
        return true;
      }
    }
    
    if (title) {
      const response = await shopifyAxios.get(`/products.json?fields=id&limit=1&title=${encodeURIComponent(title)}`);
      if (response.data.products && response.data.products.length > 0) {
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error checking product existence:', error);
    return false;
  }
}

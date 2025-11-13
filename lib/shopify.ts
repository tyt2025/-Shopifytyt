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

// Publicar producto en canales de venta específicos
export async function publishProductToChannels(productId: string) {
  try {
    // Obtener los canales de venta disponibles
    const channelsResponse = await shopifyAxios.get('/publications.json');
    const publications = channelsResponse.data.publications || [];
    
    // Buscar los canales de Google Shopping y YouTube
    const googleChannel = publications.find((pub: any) => 
      pub.name?.toLowerCase().includes('google') || 
      pub.name?.toLowerCase().includes('shopping')
    );
    
    const youtubeChannel = publications.find((pub: any) => 
      pub.name?.toLowerCase().includes('youtube')
    );
    
    const publishPromises = [];
    
    // Publicar en Google Shopping si existe
    if (googleChannel) {
      publishPromises.push(
        shopifyAxios.post(`/publications/${googleChannel.id}/resource_publications.json`, {
          resource_publication: {
            resource_id: productId,
            resource_type: 'Product',
            published: true,
          },
        }).catch(err => console.log('Google channel error:', err.message))
      );
    }
    
    // Publicar en YouTube si existe
    if (youtubeChannel) {
      publishPromises.push(
        shopifyAxios.post(`/publications/${youtubeChannel.id}/resource_publications.json`, {
          resource_publication: {
            resource_id: productId,
            resource_type: 'Product',
            published: true,
          },
        }).catch(err => console.log('YouTube channel error:', err.message))
      );
    }
    
    // Si no se encontraron canales, intentar con el canal online store por defecto
    if (publishPromises.length === 0) {
      const onlineStoreChannel = publications.find((pub: any) => 
        pub.name?.toLowerCase().includes('online store')
      );
      
      if (onlineStoreChannel) {
        publishPromises.push(
          shopifyAxios.post(`/publications/${onlineStoreChannel.id}/resource_publications.json`, {
            resource_publication: {
              resource_id: productId,
              resource_type: 'Product',
              published: true,
            },
          }).catch(err => console.log('Online store channel error:', err.message))
        );
      }
    }
    
    await Promise.all(publishPromises);
    console.log('Producto publicado en canales de venta');
  } catch (error: any) {
    console.error('Error publishing to channels:', error.response?.data || error.message);
    // No lanzar error, solo registrar (la publicación del producto es lo importante)
  }
}

// Verificar si un producto ya existe en Shopify (por SKU o título exacto)
export async function checkProductExists(sku?: string, title?: string): Promise<boolean> {
  try {
    // Primero intentar por SKU si existe
    if (sku && sku.trim() !== '') {
      try {
        const response = await shopifyAxios.get(`/products.json?limit=250`);
        const products = response.data.products || [];
        
        // Buscar coincidencia exacta de SKU en las variantes
        const foundBySku = products.some((product: any) => 
          product.variants?.some((variant: any) => 
            variant.sku && variant.sku.trim().toLowerCase() === sku.trim().toLowerCase()
          )
        );
        
        if (foundBySku) {
          console.log(`Producto encontrado por SKU: ${sku}`);
          return true;
        }
      } catch (error) {
        console.error('Error buscando por SKU:', error);
      }
    }
    
    // Intentar por título exacto si existe
    if (title && title.trim() !== '') {
      try {
        const response = await shopifyAxios.get(`/products.json?limit=250`);
        const products = response.data.products || [];
        
        // Buscar coincidencia exacta de título (case insensitive)
        const foundByTitle = products.some((product: any) => 
          product.title && product.title.trim().toLowerCase() === title.trim().toLowerCase()
        );
        
        if (foundByTitle) {
          console.log(`Producto encontrado por título: ${title}`);
          return true;
        }
      } catch (error) {
        console.error('Error buscando por título:', error);
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error checking product existence:', error);
    // En caso de error, permitir la publicación (no bloquear)
    return false;
  }
}

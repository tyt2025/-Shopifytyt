import axios from 'axios'

const SHOPIFY_STORE = process.env.SHOPIFY_STORE_DOMAIN
const SHOPIFY_TOKEN = process.env.SHOPIFY_ADMIN_TOKEN

const shopifyClient = axios.create({
  baseURL: `https://${SHOPIFY_STORE}/admin/api/2024-01`,
  headers: {
    'X-Shopify-Access-Token': SHOPIFY_TOKEN!,
    'Content-Type': 'application/json',
  },
})

export interface ShopifyProduct {
  title: string
  body_html: string
  vendor: string
  product_type: string
  tags: string[]
  variants: Array<{
    price: string
    sku: string
    inventory_quantity: number
  }>
  images: Array<{
    src: string
  }>
}

export async function createShopifyProduct(productData: ShopifyProduct) {
  try {
    const response = await shopifyClient.post('/products.json', {
      product: productData,
    })
    return response.data.product
  } catch (error: any) {
    console.error('Error creating Shopify product:', error.response?.data || error)
    throw error
  }
}

export async function getShopifyCollections() {
  try {
    const response = await shopifyClient.get('/custom_collections.json')
    return response.data.custom_collections
  } catch (error: any) {
    console.error('Error getting Shopify collections:', error.response?.data || error)
    throw error
  }
}

export async function addProductToCollection(productId: string, collectionId: string) {
  try {
    const response = await shopifyClient.post('/collects.json', {
      collect: {
        product_id: productId,
        collection_id: collectionId,
      },
    })
    return response.data.collect
  } catch (error: any) {
    console.error('Error adding product to collection:', error.response?.data || error)
    throw error
  }
}

export default shopifyClient

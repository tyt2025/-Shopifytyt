// Script para crear todas las colecciones en Shopify
// Ejecutar una vez para crear las 6 colecciones principales

import { createShopifyCollection, getShopifyCollections } from './lib/shopify'

const COLLECTIONS = [
  'Impresión y pos',
  'Computadores',
  'Accesorios',
  'Linea Gamer',
  'Redes y Vigilancia',
  'Video y Tablets',
]

async function createCollections() {
  try {
    console.log('Obteniendo colecciones existentes...')
    const existingCollections = await getShopifyCollections()
    const existingTitles = existingCollections.map((c: any) => c.title.toLowerCase())

    for (const collectionTitle of COLLECTIONS) {
      if (existingTitles.includes(collectionTitle.toLowerCase())) {
        console.log(`✓ Colección ya existe: ${collectionTitle}`)
      } else {
        console.log(`Creando colección: ${collectionTitle}...`)
        await createShopifyCollection(collectionTitle)
        console.log(`✓ Colección creada: ${collectionTitle}`)
      }
    }

    console.log('\n✅ Todas las colecciones están listas')
  } catch (error) {
    console.error('Error:', error)
  }
}

createCollections()

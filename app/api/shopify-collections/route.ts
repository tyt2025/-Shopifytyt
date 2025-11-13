import { NextResponse } from 'next/server';
import { getShopifyCollections } from '@/lib/shopify';

export async function GET() {
  try {
    const collections = await getShopifyCollections();
    return NextResponse.json(collections);
  } catch (error: any) {
    console.error('Error fetching collections:', error);
    return NextResponse.json(
      { error: 'Error al obtener colecciones de Shopify', details: error.message },
      { status: 500 }
    );
  }
}

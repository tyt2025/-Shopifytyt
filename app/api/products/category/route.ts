import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function PATCH(request: Request) {
  try {
    const { productId, shopify_category, shopify_subcategory } = await request.json()

    if (!productId) {
      return NextResponse.json(
        { error: 'Se requiere productId' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('productos')
      .update({
        shopify_category,
        shopify_subcategory,
      })
      .eq('id', productId)
      .select()
      .single()

    if (error) {
      console.error('Error updating category:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, product: data })
  } catch (error: any) {
    console.error('Error in category update API:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

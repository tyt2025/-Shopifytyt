import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    
    const from = (page - 1) * limit
    const to = from + limit - 1

    let query = supabase
      .from('productos')
      .select('*', { count: 'exact' })
      .eq('is_active', true)
      .order('id', { ascending: false })

    if (search) {
      query = query.or(`product_name.ilike.%${search}%,sku.ilike.%${search}%`)
    }

    if (category) {
      query = query.eq('category', category)
    }

    const { data, error, count } = await query.range(from, to)

    if (error) {
      console.error('Error fetching products:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      products: data,
      total: count,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    })
  } catch (error: any) {
    console.error('Error in products API:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/v1/products - Fetch all products with filters
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const searchParams = request.nextUrl.searchParams
    
    const category = searchParams.get('category')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search')
    
    let query = supabase
      .from('products')
      .select('*, seller:sellers(id, name, rating), reviews(count)')
      .eq('is_active', true)
      .range((page - 1) * limit, page * limit - 1)

    if (category) query = query.eq('category', category)
    if (search) query = query.ilike('name', `%${search}%`)

    const { data: products, error, count } = await query

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error('[API] Products error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// POST /api/v1/products - Create new product (sellers only)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is a seller
    const { data: seller, error: sellerError } = await supabase
      .from('sellers')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (sellerError || !seller) {
      return NextResponse.json({ success: false, error: 'Not a seller' }, { status: 403 })
    }

    const body = await request.json()
    const { name, description, category, price, images, stock } = body

    const { data: product, error } = await supabase
      .from('products')
      .insert([
        {
          seller_id: seller.id,
          name,
          description,
          category,
          price,
          images,
          stock,
          is_active: true,
        },
      ])
      .select()

    if (error) throw error

    return NextResponse.json(
      { success: true, data: product[0] },
      { status: 201 }
    )
  } catch (error) {
    console.error('[API] Create product error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    )
  }
}

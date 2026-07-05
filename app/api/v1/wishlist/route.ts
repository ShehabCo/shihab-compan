// Wishlist API
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import wishlistManager from '@/lib/wishlist/wishlist-manager'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const wishlist = await wishlistManager.getWishlist(user.id)

    // احصل على تفاصيل المنتجات
    const { data: products } = await supabase
      .from('products')
      .select('id, name, price, image_url, rating')
      .in(
        'id',
        wishlist.items.map((item) => item.productId)
      )

    const enrichedItems = wishlist.items.map((item) => {
      const product = products?.find((p: any) => p.id === item.productId)
      return {
        ...item,
        ...product,
      }
    })

    return NextResponse.json({
      items: enrichedItems,
      total: wishlist.totalItems,
    })
  } catch (error) {
    console.error('[Wishlist] Error:', error)
    return NextResponse.json(
      { error: 'Failed to get wishlist' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { productId } = body

    const wishlist = await wishlistManager.addItem(user.id, productId)
    return NextResponse.json(wishlist)
  } catch (error: any) {
    console.error('[Wishlist] Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to add to wishlist' },
      { status: 400 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const productId = request.nextUrl.searchParams.get('productId')
    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    const wishlist = await wishlistManager.removeItem(user.id, productId)
    return NextResponse.json(wishlist)
  } catch (error) {
    console.error('[Wishlist] Error:', error)
    return NextResponse.json(
      { error: 'Failed to remove from wishlist' },
      { status: 500 }
    )
  }
}

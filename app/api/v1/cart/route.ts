// Shopping Cart API
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import smartCart from '@/lib/cart/smart-cart'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const cart = await smartCart.getCart(user.id)
    const recommendations = await smartCart.getSmartRecommendations(user.id)

    return NextResponse.json({
      cart,
      recommendations,
    })
  } catch (error) {
    console.error('[Cart] Error:', error)
    return NextResponse.json(
      { error: 'Failed to get cart' },
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
    const { productId, quantity } = body

    const cart = await smartCart.addItem(user.id, productId, quantity)

    return NextResponse.json(cart)
  } catch (error: any) {
    console.error('[Cart] Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to add item to cart' },
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

    const cart = await smartCart.removeItem(user.id, productId)
    return NextResponse.json(cart)
  } catch (error) {
    console.error('[Cart] Error:', error)
    return NextResponse.json(
      { error: 'Failed to remove item from cart' },
      { status: 500 }
    )
  }
}

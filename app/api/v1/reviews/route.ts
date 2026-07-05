// Reviews API
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import reviewSystem from '@/lib/reviews/review-system'

export async function GET(request: NextRequest) {
  try {
    const productId = request.nextUrl.searchParams.get('productId')
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '10')
    const offset = parseInt(request.nextUrl.searchParams.get('offset') || '0')

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    const reviews = await reviewSystem.getProductReviews(productId, limit, offset)
    const rating = await reviewSystem.getProductRating(productId)

    return NextResponse.json({
      reviews,
      rating,
    })
  } catch (error) {
    console.error('[Reviews] Error:', error)
    return NextResponse.json(
      { error: 'Failed to get reviews' },
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
    const { productId, rating, title, content } = body

    const review = await reviewSystem.addReview(
      user.id,
      productId,
      rating,
      title,
      content
    )

    return NextResponse.json(review, { status: 201 })
  } catch (error: any) {
    console.error('[Reviews] Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to add review' },
      { status: 400 }
    )
  }
}

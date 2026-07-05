// Recommendations API
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import recommendationEngine from '@/lib/recommendations/recommendation-engine'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '10')

    const recommendations = await recommendationEngine.generateRecommendations(
      user.id,
      limit
    )

    // احصل على تفاصيل المنتجات
    const productIds = recommendations.map((r) => r.productId)
    const { data: products } = await supabase
      .from('products')
      .select('id, name, description, price, image_url, rating')
      .in('id', productIds)

    const enriched = recommendations.map((rec) => {
      const product = products?.find((p: any) => p.id === rec.productId)
      return {
        ...rec,
        product,
      }
    })

    return NextResponse.json({
      recommendations: enriched,
      count: enriched.length,
    })
  } catch (error) {
    console.error('[Recommendations] Error:', error)
    return NextResponse.json(
      { error: 'Failed to get recommendations' },
      { status: 500 }
    )
  }
}

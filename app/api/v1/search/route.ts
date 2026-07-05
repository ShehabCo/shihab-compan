// Search API Endpoint
import { NextRequest, NextResponse } from 'next/server'
import { semanticSearchEngine } from '@/lib/search/semantic-search'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      )
    }

    const results = await semanticSearchEngine.search({
      query,
      limit,
      filters: {
        category: category || undefined,
        minPrice: minPrice ? parseInt(minPrice) : undefined,
        maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
      },
    })

    // احصل على الاقتراحات
    const suggestions = await semanticSearchEngine.getSearchSuggestions(query)

    return NextResponse.json({
      results,
      suggestions,
      count: results.length,
    })
  } catch (error) {
    console.error('[Search] Error:', error)
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    )
  }
}

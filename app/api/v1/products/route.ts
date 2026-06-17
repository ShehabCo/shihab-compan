import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { ApiProtection, withApiProtection } from '@/lib/security/api-protection'
import { InputValidator } from '@/lib/security/input-validation'
import { RateLimiter } from '@/lib/security/rate-limiting'

// GET /api/v1/products - Fetch all products with filters
export async function GET(request: NextRequest) {
  return withApiProtection(
    request,
    async (req) => {
      try {
        const ip = RateLimiter.getClientIp(request.headers)
        const rateLimitCheck = RateLimiter.checkLimit(
          RateLimiter.createIpKey(ip, '/api/v1/products'),
          RateLimiter.API_LIMIT.requests,
          RateLimiter.API_LIMIT.windowSeconds
        )

        if (!rateLimitCheck.allowed) {
          return NextResponse.json(
            { success: false, error: 'Rate limit exceeded' },
            { status: 429 }
          )
        }

        const supabase = await createClient()
        const searchParams = request.nextUrl.searchParams

        const category = searchParams.get('category')
        const page = searchParams.get('page')
        const limit = searchParams.get('limit')
        const search = searchParams.get('search')

        // Validate pagination
        const paginationCheck = InputValidator.validatePagination(page, limit)
        if (!paginationCheck.valid) {
          return NextResponse.json(
            { success: false, error: paginationCheck.error },
            { status: 400 }
          )
        }

        // Validate search query
        let sanitizedSearch = null
        if (search) {
          const searchCheck = InputValidator.validateSearchQuery(search)
          if (!searchCheck.valid) {
            return NextResponse.json(
              { success: false, error: searchCheck.error },
              { status: 400 }
            )
          }
          sanitizedSearch = searchCheck.sanitized
        }

        // Validate category if provided
        if (category) {
          const categoryCheck = InputValidator.validateCategory(category)
          if (!categoryCheck.valid) {
            return NextResponse.json(
              { success: false, error: categoryCheck.error },
              { status: 400 }
            )
          }
        }

        let query = supabase
          .from('products')
          .select('*, seller:sellers(id, name, rating), reviews(count)')
          .eq('status', 'active')
          .range((paginationCheck.page! - 1) * paginationCheck.limit!, paginationCheck.page! * paginationCheck.limit! - 1)

        if (category) query = query.eq('category', category)
        if (sanitizedSearch) query = query.ilike('name', `%${sanitizedSearch}%`)

        const { data: products, error, count } = await query

        if (error) throw error

        return NextResponse.json({
          success: true,
          data: products,
          pagination: {
            page: paginationCheck.page,
            limit: paginationCheck.limit,
            total: count || 0,
            pages: Math.ceil((count || 0) / paginationCheck.limit!),
          },
        })
      } catch (error) {
        console.error('[API] Products error:', error)
        return NextResponse.json(
          { success: false, error: 'Failed to fetch products' },
          { status: 500 }
        )
      }
    },
    {
      requireAuth: false,
      rateLimit: RateLimiter.API_LIMIT,
    }
  )
}

// POST /api/v1/products - Create new product (sellers only)
export async function POST(request: NextRequest) {
  return withApiProtection(
    request,
    async (req, auth) => {
      try {
        // Rate limit by user ID
        const rateLimitCheck = RateLimiter.checkLimit(
          RateLimiter.createUserKey(auth.userId, 'create_product'),
          5, // Max 5 products per 10 minutes
          600
        )

        if (!rateLimitCheck.allowed) {
          return NextResponse.json(
            { success: false, error: 'Product creation rate limit exceeded' },
            { status: 429 }
          )
        }

        const supabase = await createClient()

        // Check if user is a seller
        const { data: seller, error: sellerError } = await supabase
          .from('sellers')
          .select('id')
          .eq('user_id', auth.userId)
          .single()

        if (sellerError || !seller) {
          return NextResponse.json({ success: false, error: 'Not a seller' }, { status: 403 })
        }

        const body = await request.json()
        const { name, description, category, price, images, stock } = body

        // Validate inputs
        const nameCheck = InputValidator.validateProductName(name)
        if (!nameCheck.valid) {
          return NextResponse.json({ success: false, error: nameCheck.error }, { status: 400 })
        }

        const descCheck = InputValidator.validateDescription(description)
        if (!descCheck.valid) {
          return NextResponse.json({ success: false, error: descCheck.error }, { status: 400 })
        }

        const categoryCheck = InputValidator.validateCategory(category)
        if (!categoryCheck.valid) {
          return NextResponse.json({ success: false, error: categoryCheck.error }, { status: 400 })
        }

        const priceCheck = InputValidator.validatePrice(price)
        if (!priceCheck.valid) {
          return NextResponse.json({ success: false, error: priceCheck.error }, { status: 400 })
        }

        const stockCheck = InputValidator.validateQuantity(stock)
        if (!stockCheck.valid) {
          return NextResponse.json({ success: false, error: stockCheck.error }, { status: 400 })
        }

        const { data: product, error } = await supabase
          .from('products')
          .insert([
            {
              seller_id: seller.id,
              name: name.trim(),
              slug: `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
              description: description.trim(),
              category: category.toLowerCase(),
              price: priceCheck.value,
              stock_quantity: stockCheck.value,
              images: Array.isArray(images) ? images : [],
              status: 'active',
            },
          ])
          .select()

        if (error) throw error

        await ApiProtection.logSecurityEvent(
          'Product created',
          auth.userId,
          { productId: product[0]?.id, seller: seller.id }
        )

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
    },
    {
      requireAuth: true,
      requireRole: ['seller', 'admin'],
      rateLimit: RateLimiter.API_LIMIT,
    }
  )
}

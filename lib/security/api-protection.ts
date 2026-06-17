import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  meta?: {
    timestamp: number
    requestId: string
  }
}

export interface AuthContext {
  userId: string
  role: 'customer' | 'seller' | 'admin'
  email: string
  verified: boolean
}

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export class ApiProtection {
  // Verify JWT and extract user info
  static async verifyAuth(request: NextRequest): Promise<AuthContext | null> {
    try {
      const supabase = await createClient()
      const { data: { user }, error } = await supabase.auth.getUser()

      if (error || !user) return null

      // Get user profile
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('role, verified, email')
        .eq('id', user.id)
        .single()

      return {
        userId: user.id,
        role: profile?.role || 'customer',
        email: user.email || '',
        verified: profile?.verified || false,
      }
    } catch (error) {
      console.error('[Security] Auth verification failed:', error)
      return null
    }
  }

  // Check if user has required role
  static requireRole(auth: AuthContext | null, requiredRoles: string[]): boolean {
    return auth ? requiredRoles.includes(auth.role) : false
  }

  // Rate limiting middleware
  static rateLimit(identifier: string, limit: number = 100, windowSeconds: number = 60): boolean {
    const now = Date.now()
    const existing = rateLimitStore.get(identifier)

    if (!existing || now > existing.resetTime) {
      rateLimitStore.set(identifier, {
        count: 1,
        resetTime: now + windowSeconds * 1000,
      })
      return true
    }

    if (existing.count < limit) {
      existing.count++
      return true
    }

    return false
  }

  // Sanitize input
  static sanitizeInput(input: any): any {
    if (typeof input === 'string') {
      return input
        .trim()
        .replace(/[<>]/g, '')
        .slice(0, 10000)
    }

    if (typeof input === 'object' && input !== null) {
      const sanitized: any = {}
      for (const [key, value] of Object.entries(input)) {
        if (key.length > 100) continue // Prevent key pollution attacks
        sanitized[key] = this.sanitizeInput(value)
      }
      return sanitized
    }

    return input
  }

  // Validate email
  static isValidEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email) && email.length <= 255
  }

  // Validate URL
  static isValidUrl(url: string): boolean {
    try {
      new URL(url)
      return url.length <= 2048
    } catch {
      return false
    }
  }

  // Generate request ID for tracking
  static generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  // Log security event
  static async logSecurityEvent(
    event: string,
    userId: string | null,
    details: any,
    severity: 'info' | 'warning' | 'error' = 'info'
  ) {
    console.log(`[Security] [${severity.toUpperCase()}] ${event}`, {
      userId,
      details,
      timestamp: new Date().toISOString(),
    })

    // In production: save to audit log
  }

  // CSRF token validation
  static validateCsrfToken(request: NextRequest, token: string | null): boolean {
    const origin = request.headers.get('origin')
    const host = request.headers.get('host')

    if (!origin || !host) return false
    if (!origin.includes(host)) return false

    // In production: verify against stored token
    return true
  }
}

// Middleware wrapper for API routes
export async function withApiProtection(
  request: NextRequest,
  handler: (req: NextRequest, auth: AuthContext) => Promise<NextResponse>,
  options?: {
    requireAuth?: boolean
    requireRole?: string[]
    rateLimit?: { limit: number; window: number }
  }
): Promise<NextResponse> {
  const requestId = ApiProtection.generateRequestId()

  try {
    // Rate limiting
    if (options?.rateLimit) {
      const ip = request.headers.get('x-forwarded-for') || 'unknown'
      if (!ApiProtection.rateLimit(ip, options.rateLimit.limit, options.rateLimit.window)) {
        return NextResponse.json(
          { success: false, error: 'Rate limit exceeded', meta: { requestId } },
          { status: 429 }
        )
      }
    }

    // Authentication
    const auth = await ApiProtection.verifyAuth(request)

    if (options?.requireAuth && !auth) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized', meta: { requestId } },
        { status: 401 }
      )
    }

    // Role check
    if (options?.requireRole && !ApiProtection.requireRole(auth, options.requireRole)) {
      await ApiProtection.logSecurityEvent(
        'Unauthorized access attempt',
        auth?.userId || null,
        { route: request.nextUrl.pathname },
        'warning'
      )

      return NextResponse.json(
        { success: false, error: 'Forbidden', meta: { requestId } },
        { status: 403 }
      )
    }

    return await handler(request, auth as AuthContext)
  } catch (error) {
    console.error(`[API] Error in route ${request.nextUrl.pathname}:`, error)

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        meta: { requestId },
      },
      { status: 500 }
    )
  }
}

// Response builder
export function apiResponse<T>(
  success: boolean,
  data?: T,
  error?: string,
  status: number = success ? 200 : 400
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success,
      data,
      error,
      meta: {
        timestamp: Date.now(),
        requestId: ApiProtection.generateRequestId(),
      },
    },
    { status }
  )
}

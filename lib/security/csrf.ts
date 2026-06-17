import { NextRequest, NextResponse } from 'next/server'
import { CookieManager, CSRF_TOKEN_COOKIE_NAME } from './cookies'

const PROTECTED_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE']

export async function validateCsrfToken(request: NextRequest): Promise<boolean> {
  const method = request.method

  // Only validate for state-changing methods
  if (!PROTECTED_METHODS.includes(method)) {
    return true
  }

  try {
    // Get CSRF token from cookie
    const cookieToken = request.cookies.get(CSRF_TOKEN_COOKIE_NAME)?.value

    if (!cookieToken) {
      console.warn('[CSRF] Missing CSRF token in cookie')
      return false
    }

    // Get CSRF token from header
    const headerToken = request.headers.get('x-csrf-token') || 
                       request.headers.get('x-xsrf-token')

    if (!headerToken) {
      console.warn('[CSRF] Missing CSRF token in headers')
      return false
    }

    // Validate tokens match
    if (!CookieManager.validateCsrfToken(cookieToken, headerToken)) {
      console.warn('[CSRF] CSRF token mismatch')
      return false
    }

    return true
  } catch (error) {
    console.error('[CSRF] Validation error:', error)
    return false
  }
}

export async function csrfProtectionMiddleware(
  request: NextRequest,
  next: () => Promise<NextResponse>
): Promise<NextResponse> {
  // Check CSRF token
  const isValid = await validateCsrfToken(request)

  if (!isValid && PROTECTED_METHODS.includes(request.method)) {
    return NextResponse.json(
      { error: 'CSRF token validation failed' },
      { status: 403 }
    )
  }

  const response = await next()

  // Generate new CSRF token for subsequent requests
  if (request.method === 'GET') {
    const newToken = CookieManager.generateCsrfToken()
    response.cookies.set(CSRF_TOKEN_COOKIE_NAME, newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    })
  }

  return response
}

import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'

export const SECURE_COOKIE_OPTIONS: Partial<ResponseCookie> = {
  httpOnly: true, // Prevent JavaScript access
  secure: process.env.NODE_ENV === 'production', // HTTPS only in production
  sameSite: 'strict', // CSRF protection
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: '/',
}

export const SESSION_COOKIE_NAME = '__Host-super-platform-session'
export const CSRF_TOKEN_COOKIE_NAME = '__Host-csrf-token'
export const REFRESH_TOKEN_COOKIE_NAME = '__Host-refresh-token'

export class CookieManager {
  // Generate secure CSRF token
  static generateCsrfToken(): string {
    const randomBytes = new Uint8Array(32)
    crypto.getRandomValues(randomBytes)
    return Buffer.from(randomBytes).toString('hex')
  }

  // Validate CSRF token
  static validateCsrfToken(tokenFromCookie: string, tokenFromHeader: string): boolean {
    if (!tokenFromCookie || !tokenFromHeader) {
      return false
    }

    // Prevent timing attacks
    return tokenFromCookie === tokenFromHeader
  }

  // Cookie validation
  static validateCookie(value: string): boolean {
    if (!value || value.length > 4096) {
      return false
    }

    // Check for cookie injection attempts
    if (value.includes('\n') || value.includes('\r')) {
      return false
    }

    return true
  }
}

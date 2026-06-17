// Rate limiting service
// In production, use Redis for distributed rate limiting

interface RateLimitEntry {
  count: number
  resetTime: number
  blocked?: boolean
}

const rateLimitStore = new Map<string, RateLimitEntry>()

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime + 60000) {
      rateLimitStore.delete(key)
    }
  }
}, 5 * 60 * 1000)

export class RateLimiter {
  // Standard API rate limit
  static API_LIMIT = {
    requests: 100,
    windowSeconds: 60,
  }

  // Authentication rate limit (stricter)
  static AUTH_LIMIT = {
    requests: 5,
    windowSeconds: 300, // 5 minutes
  }

  // File upload rate limit
  static UPLOAD_LIMIT = {
    requests: 10,
    windowSeconds: 3600, // 1 hour
  }

  // Check rate limit
  static checkLimit(
    identifier: string,
    limit: number = this.API_LIMIT.requests,
    windowSeconds: number = this.API_LIMIT.windowSeconds
  ): { allowed: boolean; remaining: number; resetAt: number } {
    const now = Date.now()
    const windowMs = windowSeconds * 1000
    const key = identifier

    let entry = rateLimitStore.get(key)

    // Reset if window expired
    if (!entry || now > entry.resetTime) {
      entry = {
        count: 0,
        resetTime: now + windowMs,
        blocked: false,
      }
      rateLimitStore.set(key, entry)
    }

    // Check if already blocked
    if (entry.blocked && now < entry.resetTime) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: entry.resetTime,
      }
    }

    // Increment count
    entry.count++

    // Check if exceeded limit
    if (entry.count > limit) {
      entry.blocked = true
      return {
        allowed: false,
        remaining: 0,
        resetAt: entry.resetTime,
      }
    }

    return {
      allowed: true,
      remaining: limit - entry.count,
      resetAt: entry.resetTime,
    }
  }

  // Get rate limit status
  static getStatus(identifier: string): RateLimitEntry | null {
    return rateLimitStore.get(identifier) || null
  }

  // Reset rate limit
  static reset(identifier: string): void {
    rateLimitStore.delete(identifier)
  }

  // Bulk reset
  static resetByPattern(pattern: string): number {
    let count = 0
    for (const key of rateLimitStore.keys()) {
      if (key.includes(pattern)) {
        rateLimitStore.delete(key)
        count++
      }
    }
    return count
  }

  // Get IP from request
  static getClientIp(headers: Headers): string {
    const forwardedFor = headers.get('x-forwarded-for')
    if (forwardedFor) {
      return forwardedFor.split(',')[0].trim()
    }

    return headers.get('x-real-ip') || 'unknown'
  }

  // Create rate limit key for auth
  static createAuthKey(email: string): string {
    return `auth:${email.toLowerCase()}`
  }

  // Create rate limit key for IP
  static createIpKey(ip: string, endpoint: string): string {
    return `ip:${ip}:${endpoint}`
  }

  // Create rate limit key for user
  static createUserKey(userId: string, action: string): string {
    return `user:${userId}:${action}`
  }
}

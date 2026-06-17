// Input validation and sanitization for Arabic-first platform

export class InputValidator {
  // Product name validation
  static validateProductName(name: string): { valid: boolean; error?: string } {
    if (!name || typeof name !== 'string') {
      return { valid: false, error: 'Product name is required' }
    }

    const trimmed = name.trim()

    if (trimmed.length < 3) {
      return { valid: false, error: 'Product name must be at least 3 characters' }
    }

    if (trimmed.length > 255) {
      return { valid: false, error: 'Product name must not exceed 255 characters' }
    }

    // Allow Arabic and English
    const validChars = /^[\u0600-\u06FF\u0750-\u077F\w\s\-().،؛:/&]*$/
    if (!validChars.test(trimmed)) {
      return { valid: false, error: 'Product name contains invalid characters' }
    }

    return { valid: true }
  }

  // Product description validation
  static validateDescription(desc: string, maxLength: number = 5000): { valid: boolean; error?: string } {
    if (!desc || typeof desc !== 'string') {
      return { valid: false, error: 'Description is required' }
    }

    const trimmed = desc.trim()

    if (trimmed.length < 10) {
      return { valid: false, error: 'Description must be at least 10 characters' }
    }

    if (trimmed.length > maxLength) {
      return { valid: false, error: `Description must not exceed ${maxLength} characters` }
    }

    return { valid: true }
  }

  // Price validation
  static validatePrice(price: any): { valid: boolean; error?: string; value?: number } {
    if (price === null || price === undefined) {
      return { valid: false, error: 'Price is required' }
    }

    const numPrice = typeof price === 'string' ? parseFloat(price) : price

    if (isNaN(numPrice)) {
      return { valid: false, error: 'Price must be a valid number' }
    }

    if (numPrice <= 0) {
      return { valid: false, error: 'Price must be greater than 0' }
    }

    if (numPrice > 999999999) {
      return { valid: false, error: 'Price is too high' }
    }

    // Max 2 decimal places
    if (!/^\d+(\.\d{1,2})?$/.test(numPrice.toString())) {
      return { valid: false, error: 'Price must have at most 2 decimal places' }
    }

    return { valid: true, value: numPrice }
  }

  // Quantity validation
  static validateQuantity(qty: any): { valid: boolean; error?: string; value?: number } {
    if (qty === null || qty === undefined) {
      return { valid: false, error: 'Quantity is required' }
    }

    const numQty = typeof qty === 'string' ? parseInt(qty, 10) : qty

    if (isNaN(numQty) || !Number.isInteger(numQty)) {
      return { valid: false, error: 'Quantity must be an integer' }
    }

    if (numQty < 0) {
      return { valid: false, error: 'Quantity cannot be negative' }
    }

    if (numQty > 999999) {
      return { valid: false, error: 'Quantity is too high' }
    }

    return { valid: true, value: numQty }
  }

  // Email validation
  static validateEmail(email: string): { valid: boolean; error?: string } {
    if (!email || typeof email !== 'string') {
      return { valid: false, error: 'Email is required' }
    }

    const trimmed = email.trim().toLowerCase()

    if (trimmed.length > 255) {
      return { valid: false, error: 'Email is too long' }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(trimmed)) {
      return { valid: false, error: 'Invalid email format' }
    }

    return { valid: true }
  }

  // Phone number validation (supports multiple formats)
  static validatePhone(phone: string): { valid: boolean; error?: string } {
    if (!phone || typeof phone !== 'string') {
      return { valid: false, error: 'Phone number is required' }
    }

    const cleaned = phone.replace(/\D/g, '')

    if (cleaned.length < 7 || cleaned.length > 15) {
      return { valid: false, error: 'Phone number must be 7-15 digits' }
    }

    return { valid: true }
  }

  // Category validation
  static validateCategory(category: string): { valid: boolean; error?: string } {
    if (!category || typeof category !== 'string') {
      return { valid: false, error: 'Category is required' }
    }

    const validCategories = [
      'electronics',
      'fashion',
      'home',
      'sports',
      'beauty',
      'books',
      'toys',
      'food',
      'automotive',
      'health',
    ]

    if (!validCategories.includes(category.toLowerCase())) {
      return { valid: false, error: 'Invalid category' }
    }

    return { valid: true }
  }

  // Pagination validation
  static validatePagination(
    page: any,
    limit: any,
    maxLimit: number = 100
  ): { valid: boolean; error?: string; page?: number; limit?: number } {
    const numPage = parseInt(page, 10) || 1
    const numLimit = parseInt(limit, 10) || 20

    if (numPage < 1) {
      return { valid: false, error: 'Page must be at least 1' }
    }

    if (numLimit < 1) {
      return { valid: false, error: 'Limit must be at least 1' }
    }

    if (numLimit > maxLimit) {
      return { valid: false, error: `Limit cannot exceed ${maxLimit}` }
    }

    return { valid: true, page: numPage, limit: numLimit }
  }

  // JSON validation
  static validateJSON(json: string): { valid: boolean; error?: string; data?: any } {
    try {
      const parsed = JSON.parse(json)
      return { valid: true, data: parsed }
    } catch (error) {
      return { valid: false, error: 'Invalid JSON format' }
    }
  }

  // URL validation
  static validateUrl(url: string): { valid: boolean; error?: string } {
    if (!url || typeof url !== 'string') {
      return { valid: false, error: 'URL is required' }
    }

    if (url.length > 2048) {
      return { valid: false, error: 'URL is too long' }
    }

    try {
      new URL(url)
      return { valid: true }
    } catch {
      return { valid: false, error: 'Invalid URL format' }
    }
  }

  // Rating validation
  static validateRating(rating: any): { valid: boolean; error?: string; value?: number } {
    const numRating = typeof rating === 'string' ? parseFloat(rating) : rating

    if (isNaN(numRating)) {
      return { valid: false, error: 'Rating must be a number' }
    }

    if (numRating < 0 || numRating > 5) {
      return { valid: false, error: 'Rating must be between 0 and 5' }
    }

    return { valid: true, value: Math.round(numRating * 2) / 2 }
  }

  // Search query validation
  static validateSearchQuery(query: string): { valid: boolean; error?: string; sanitized?: string } {
    if (!query || typeof query !== 'string') {
      return { valid: false, error: 'Search query is required' }
    }

    const trimmed = query.trim()

    if (trimmed.length < 1) {
      return { valid: false, error: 'Search query cannot be empty' }
    }

    if (trimmed.length > 500) {
      return { valid: false, error: 'Search query is too long' }
    }

    // Remove special SQL characters
    const sanitized = trimmed
      .replace(/[;'"\\]/g, '')
      .replace(/\s+/g, ' ')

    return { valid: true, sanitized }
  }
}

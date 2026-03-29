import { VALIDATION } from '@/lib/constants'

export function isValidEmail(email: string): boolean {
  return VALIDATION.EMAIL_REGEX.test(email)
}

export function isValidPassword(password: string): boolean {
  return password.length >= VALIDATION.PASSWORD_MIN_LENGTH
}

export function isValidName(name: string): boolean {
  return name.length >= VALIDATION.NAME_MIN_LENGTH && name.length <= VALIDATION.NAME_MAX_LENGTH
}

export function isValidPrice(price: number): boolean {
  return price > 0 && !isNaN(price)
}

export function isValidStock(stock: number): boolean {
  return stock >= 0 && Number.isInteger(stock)
}

export function isValidRating(rating: number): boolean {
  return rating >= 0 && rating <= 5
}

export function formatPrice(price: number, currency: string = 'USD'): string {
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
  }
  const symbol = symbols[currency] || '$'
  return `${symbol}${price.toFixed(2)}`
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/<[^>]*>/g, '')
}

export function validateProductData(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.name || !isValidName(data.name)) {
    errors.push('Product name is required and must be 2-100 characters')
  }

  if (!data.price || !isValidPrice(data.price)) {
    errors.push('Product price must be a positive number')
  }

  if (!data.stock || !isValidStock(data.stock)) {
    errors.push('Product stock must be a non-negative integer')
  }

  if (!data.description || data.description.length > VALIDATION.DESCRIPTION_MAX_LENGTH) {
    errors.push('Description is required and must be less than 5000 characters')
  }

  if (!data.category) {
    errors.push('Product category is required')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

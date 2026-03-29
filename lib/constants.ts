export const APP_NAME = 'Super Platform MVP'
export const APP_DESCRIPTION = 'Global AI-powered Marketplace Platform'
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export const CATEGORIES = [
  { id: 'electronics', label: 'الإلكترونيات', icon: '📱' },
  { id: 'fashion', label: 'الموضة', icon: '👗' },
  { id: 'home', label: 'المنزل والحديقة', icon: '🏠' },
  { id: 'sports', label: 'الرياضة', icon: '⚽' },
  { id: 'books', label: 'الكتب', icon: '📚' },
  { id: 'toys', label: 'الألعاب', icon: '🎮' },
]

export const ORDER_STATUS = {
  pending: 'قيد الانتظار',
  processing: 'تحت المعالجة',
  shipped: 'تم الشحن',
  delivered: 'تم التسليم',
  cancelled: 'ملغاة',
}

export const PAYMENT_METHODS = {
  stripe: 'Stripe',
  paypal: 'PayPal',
  bank_transfer: 'تحويل بنكي',
  credit_card: 'بطاقة ائتمان',
}

export const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  SAR: '﷼',
  AED: 'د.إ',
  YER: '﷼',
}

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
}

export const API_ENDPOINTS = {
  PRODUCTS: '/api/v1/products',
  ORDERS: '/api/v1/orders',
  USERS: '/api/v1/users',
  REVIEWS: '/api/v1/reviews',
  AI_CHAT: '/api/v1/ai/chat',
  PAYMENTS: '/api/v1/payments',
  SELLERS: '/api/v1/sellers',
}

export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 5000,
}

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  CART_ITEMS: 'cart_items',
  RECENT_SEARCHES: 'recent_searches',
}

export const AI_CONFIG = {
  MAX_CONVERSATION_LENGTH: 50,
  RESPONSE_TIMEOUT: 30000,
  MODEL: 'mixtral-8x7b-32768',
}

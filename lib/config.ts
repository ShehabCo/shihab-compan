// Application Configuration

export const APP_CONFIG = {
  name: 'مرة أم سليم',
  description: 'مطعم عربي فاخر - طعام أصيل وتوصيل سريع',
  version: '1.0.0',
  
  // Authentication
  auth: {
    tokenExpiry: 24 * 60 * 60 * 1000, // 24 hours
    otpExpiry: 10 * 60 * 1000, // 10 minutes
    otpLength: 6,
  },

  // API Endpoints
  api: {
    base: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    endpoints: {
      auth: '/api/auth',
      menu: '/api/menu',
      orders: '/api/orders',
      cart: '/api/cart',
      user: '/api/user',
    },
  },

  // Feature Flags
  features: {
    emailVerification: true,
    smsVerification: true,
    googleLogin: true,
    loyaltyProgram: true,
    orderTracking: true,
    driverAssignment: true,
  },

  // UI Constants
  ui: {
    toastDuration: 3000,
    animationDuration: 300,
  },

  // Restaurant Info
  restaurant: {
    phone: '+967 776 262 899',
    email: 'info@maraummsalim.com',
    address: 'صنعاء، اليمن',
    deliveryTime: '30-45',
    deliveryFree: 'أول طلب',
  },
}

export default APP_CONFIG

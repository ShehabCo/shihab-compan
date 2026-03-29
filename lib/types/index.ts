export type UserRole = 'customer' | 'seller' | 'admin'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  seller_id: string
  name: string
  description: string
  category: string
  price: number
  images: string[]
  stock: number
  rating: number
  reviews_count: number
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  user_id: string
  items: OrderItem[]
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total_amount: number
  shipping_address: string
  payment_method: string
  created_at: string
  updated_at: string
}

export interface OrderItem {
  product_id: string
  quantity: number
  price: number
}

export interface Review {
  id: string
  product_id: string
  user_id: string
  rating: number
  comment: string
  created_at: string
}

export interface Conversation {
  id: string
  user_id: string
  messages: Message[]
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  conversation_id: string
  sender: 'user' | 'assistant'
  content: string
  created_at: string
}

export interface Payment {
  id: string
  order_id: string
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed'
  payment_method: string
  stripe_payment_id?: string
  created_at: string
}

export interface Seller {
  id: string
  user_id: string
  store_name: string
  description: string
  rating: number
  reviews_count: number
  followers_count: number
  products_count: number
  is_verified: boolean
  created_at: string
}

export interface CartItem {
  product_id: string
  quantity: number
  price: number
}

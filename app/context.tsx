'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface User {
  id: string
  name: string
  email: string
  role: 'customer' | 'seller' | 'admin'
  avatar?: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  sellerId: string
  rating: number
  reviews: number
  inStock: boolean
}

export interface CartItem {
  productId: string
  quantity: number
  price: number
}

export interface Order {
  id: string
  customerId: string
  items: CartItem[]
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered'
  createdAt: string
}

interface AppContextType {
  user: User | null
  setUser: (user: User | null) => void
  cart: CartItem[]
  addToCart: (productId: string, quantity: number, price: number) => void
  removeFromCart: (productId: string) => void
  clearCart: () => void
  products: Product[]
  orders: Order[]
  login: (email: string, password: string, role: string) => boolean
  logout: () => void
  isLoggedIn: boolean
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [products, setProducts] = useState<Product[]>([])

  // تحميل البيانات من localStorage عند بدء التطبيق
  useEffect(() => {
    const savedUser = localStorage.getItem('smartai_user')
    const savedCart = localStorage.getItem('smartai_cart')
    const savedProducts = localStorage.getItem('smartai_products')
    const savedOrders = localStorage.getItem('smartai_orders')

    if (savedUser) {
      const parsedUser = JSON.parse(savedUser)
      setUser(parsedUser)
      setIsLoggedIn(true)
    }

    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }

    if (savedOrders) {
      setOrders(JSON.parse(savedOrders))
    }

    // منتجات افتراضية
    if (!savedProducts) {
      const defaultProducts: Product[] = [
        {
          id: '1',
          name: 'هاتف ذكي حديث',
          description: 'هاتف ذكي بمواصفات عالية وكاميرا احترافية',
          price: 299,
          image: 'https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=500&h=500&fit=crop',
          category: 'إلكترونيات',
          sellerId: '1',
          rating: 4.8,
          reviews: 245,
          inStock: true,
        },
        {
          id: '2',
          name: 'سماعات لاسلكية',
          description: 'سماعات عالية الجودة مع تقنية الضوضاء النشطة',
          price: 129,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
          category: 'إلكترونيات',
          sellerId: '2',
          rating: 4.6,
          reviews: 189,
          inStock: true,
        },
        {
          id: '3',
          name: 'ساعة ذكية',
          description: 'ساعة ذكية متعددة الوظائف مع مراقبة الصحة',
          price: 199,
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
          category: 'إلكترونيات',
          sellerId: '1',
          rating: 4.5,
          reviews: 156,
          inStock: true,
        },
        {
          id: '4',
          name: 'كاميرا احترافية',
          description: 'كاميرا احترافية عالية الدقة للتصوير الاحترافي',
          price: 599,
          image: 'https://images.unsplash.com/photo-1516035069371-29ad0ded3438?w=500&h=500&fit=crop',
          category: 'إلكترونيات',
          sellerId: '3',
          rating: 4.9,
          reviews: 312,
          inStock: true,
        },
      ]
      setProducts(defaultProducts)
      localStorage.setItem('smartai_products', JSON.stringify(defaultProducts))
    } else {
      setProducts(JSON.parse(savedProducts))
    }
  }, [])

  const login = (email: string, password: string, role: string): boolean => {
    if (email && password) {
      const newUser: User = {
        id: Math.random().toString(),
        name: email.split('@')[0],
        email,
        role: role as 'customer' | 'seller' | 'admin',
      }
      setUser(newUser)
      setIsLoggedIn(true)
      localStorage.setItem('smartai_user', JSON.stringify(newUser))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    setIsLoggedIn(false)
    localStorage.removeItem('smartai_user')
  }

  const addToCart = (productId: string, quantity: number, price: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.productId === productId)
      if (existingItem) {
        return prevCart.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item
        )
      }
      return [...prevCart, { productId, quantity, price }]
    })
  }

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.productId !== productId))
  }

  const clearCart = () => {
    setCart([])
  }

  useEffect(() => {
    localStorage.setItem('smartai_cart', JSON.stringify(cart))
  }, [cart])

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        products,
        orders,
        login,
        logout,
        isLoggedIn,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext يجب أن يستخدم داخل AppProvider')
  }
  return context
}

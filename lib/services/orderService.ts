import { createClient } from '@/lib/supabase/client'

interface Order {
  id: string
  user_id: string
  items: Array<{
    product_id: string
    quantity: number
    price: number
  }>
  total_amount: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  shipping_address: {
    street: string
    city: string
    country: string
    postal_code: string
  }
  created_at: string
  updated_at: string
}

export const orderService = {
  async createOrder(order: Omit<Order, 'id' | 'created_at' | 'updated_at'>) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('orders')
      .insert([order])
      .select()
      .single()

    if (error) throw error
    return data as Order
  },

  async getOrder(id: string) {
    const supabase = createClient()
    const { data, error } = await supabase.from('orders').select('*').eq('id', id).single()

    if (error) throw error
    return data as Order
  },

  async getUserOrders(userId: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Order[]
  },

  async updateOrderStatus(id: string, status: Order['status']) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Order
  },

  async cancelOrder(id: string) {
    return this.updateOrderStatus(id, 'cancelled')
  },

  async getSellerOrders(sellerId: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('seller_id', sellerId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Order[]
  },
}

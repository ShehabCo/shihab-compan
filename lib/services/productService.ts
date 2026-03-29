import { createClient } from '@/lib/supabase/client'

interface Product {
  id: string
  name: string
  description: string
  price: number
  seller_id: string
  category: string
  images: string[]
  stock: number
  rating: number
  reviews_count: number
  created_at: string
}

export const productService = {
  async getProducts(filters?: { category?: string; search?: string; limit?: number }) {
    const supabase = createClient()
    let query = supabase.from('products').select('*')

    if (filters?.category) {
      query = query.eq('category', filters.category)
    }

    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }

    const { data, error } = await query.limit(filters?.limit || 50)

    if (error) throw error
    return data as Product[]
  },

  async getProductById(id: string) {
    const supabase = createClient()
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single()

    if (error) throw error
    return data as Product
  },

  async createProduct(product: Omit<Product, 'id' | 'created_at'>) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single()

    if (error) throw error
    return data as Product
  },

  async updateProduct(id: string, updates: Partial<Product>) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Product
  },

  async deleteProduct(id: string) {
    const supabase = createClient()
    const { error } = await supabase.from('products').delete().eq('id', id)

    if (error) throw error
    return true
  },

  async getProductsByCategory(category: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .limit(20)

    if (error) throw error
    return data as Product[]
  },

  async searchProducts(query: string) {
    return this.getProducts({ search: query })
  },
}

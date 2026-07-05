// Smart Cart System
// نظام السلة الذكي

import { createClient } from '@/lib/supabase/server'

export interface CartItem {
  productId: string
  quantity: number
  price: number
  addedAt: Date
}

export interface Cart {
  userId: string
  items: CartItem[]
  total: number
  lastUpdated: Date
}

export interface SmartRecommendation {
  productId: string
  reason: string
  discount?: number
}

export class SmartCart {
  private supabase = createClient()

  /**
   * إضافة منتج للسلة بذكاء
   */
  async addItem(
    userId: string,
    productId: string,
    quantity: number
  ): Promise<Cart> {
    const supabase = await this.supabase

    // الحصول على معلومات المنتج
    const { data: product } = await supabase
      .from('products')
      .select('price, stock_quantity')
      .eq('id', productId)
      .single()

    if (!product) throw new Error('Product not found')

    // التحقق من المخزون
    if (product.stock_quantity < quantity) {
      throw new Error('Insufficient stock')
    }

    // إضافة أو تحديث في قاعدة البيانات
    const { data: cart } = await supabase
      .from('shopping_carts')
      .upsert(
        [
          {
            user_id: userId,
            product_id: productId,
            quantity,
            price: product.price,
            added_at: new Date(),
          },
        ],
        { onConflict: 'user_id,product_id' }
      )
      .select()

    return this.buildCart(userId)
  }

  /**
   * الحصول على السلة
   */
  async getCart(userId: string): Promise<Cart> {
    return this.buildCart(userId)
  }

  /**
   * الحساب الذكي للإجمالي
   */
  private async buildCart(userId: string): Promise<Cart> {
    const supabase = await this.supabase

    const { data: cartItems } = await supabase
      .from('shopping_carts')
      .select('product_id, quantity, price')
      .eq('user_id', userId)

    const items: CartItem[] =
      cartItems?.map((item: any) => ({
        productId: item.product_id,
        quantity: item.quantity,
        price: item.price,
        addedAt: new Date(),
      })) || []

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    return {
      userId,
      items,
      total,
      lastUpdated: new Date(),
    }
  }

  /**
   * الحصول على توصيات إضافية للسلة
   */
  async getSmartRecommendations(
    userId: string,
    limit: number = 3
  ): Promise<SmartRecommendation[]> {
    const cart = await this.getCart(userId)
    const supabase = await this.supabase

    if (cart.items.length === 0) return []

    // الحصول على فئات المنتجات في السلة
    const productIds = cart.items.map((item) => item.productId)
    const { data: cartProducts } = await supabase
      .from('products')
      .select('category')
      .in('id', productIds)

    const categories = cartProducts?.map((p: any) => p.category) || []

    // البحث عن منتجات مكملة
    const { data: recommendations } = await supabase
      .from('products')
      .select('id, name, price')
      .in('category', categories)
      .not('id', 'in', `(${productIds.join(',')})`)
      .limit(limit)

    return (
      recommendations?.map((product: any) => ({
        productId: product.id,
        reason: 'منتج مكمل لما في سلتك',
        discount: Math.random() > 0.5 ? 10 : undefined,
      })) || []
    )
  }

  /**
   * حذف منتج من السلة
   */
  async removeItem(userId: string, productId: string): Promise<Cart> {
    const supabase = await this.supabase

    await supabase
      .from('shopping_carts')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId)

    return this.getCart(userId)
  }

  /**
   * تحديث الكمية
   */
  async updateQuantity(
    userId: string,
    productId: string,
    quantity: number
  ): Promise<Cart> {
    const supabase = await this.supabase

    await supabase
      .from('shopping_carts')
      .update({ quantity })
      .eq('user_id', userId)
      .eq('product_id', productId)

    return this.getCart(userId)
  }

  /**
   * حفظ السلة مؤقتاً
   */
  async saveCartForLater(userId: string): Promise<void> {
    const cart = await this.getCart(userId)
    const supabase = await this.supabase

    await supabase.from('saved_carts').insert([
      {
        user_id: userId,
        items: cart.items,
        total: cart.total,
        saved_at: new Date(),
      },
    ])
  }

  /**
   * استرجاع السلة المحفوظة
   */
  async restoreSavedCart(userId: string): Promise<Cart | null> {
    const supabase = await this.supabase

    const { data: saved } = await supabase
      .from('saved_carts')
      .select('*')
      .eq('user_id', userId)
      .order('saved_at', { ascending: false })
      .limit(1)

    if (!saved?.length) return null

    // استرجاع المنتجات
    const savedCart = saved[0]
    for (const item of savedCart.items) {
      await this.addItem(userId, item.productId, item.quantity)
    }

    return this.getCart(userId)
  }
}

export default new SmartCart()

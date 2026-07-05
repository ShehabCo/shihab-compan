// Wishlist Manager
// مدير قائمة الرغبات

import { createClient } from '@/lib/supabase/server'

export interface WishlistItem {
  productId: string
  addedAt: Date
  notes?: string
}

export interface Wishlist {
  userId: string
  items: WishlistItem[]
  totalItems: number
}

export class WishlistManager {
  private supabase = createClient()

  /**
   * إضافة منتج لقائمة الرغبات
   */
  async addItem(userId: string, productId: string): Promise<Wishlist> {
    const supabase = await this.supabase

    // التحقق من وجود المنتج
    const { data: product } = await supabase
      .from('products')
      .select('id')
      .eq('id', productId)
      .single()

    if (!product) throw new Error('Product not found')

    // إضافة لقائمة الرغبات
    await supabase.from('wishlist_items').insert([
      {
        user_id: userId,
        product_id: productId,
        added_at: new Date(),
      },
    ])

    return this.getWishlist(userId)
  }

  /**
   * الحصول على قائمة الرغبات
   */
  async getWishlist(userId: string): Promise<Wishlist> {
    const supabase = await this.supabase

    const { data: items } = await supabase
      .from('wishlist_items')
      .select('product_id, added_at, notes')
      .eq('user_id', userId)
      .order('added_at', { ascending: false })

    const wishlistItems: WishlistItem[] =
      items?.map((item: any) => ({
        productId: item.product_id,
        addedAt: new Date(item.added_at),
        notes: item.notes,
      })) || []

    return {
      userId,
      items: wishlistItems,
      totalItems: wishlistItems.length,
    }
  }

  /**
   * إزالة منتج من قائمة الرغبات
   */
  async removeItem(userId: string, productId: string): Promise<Wishlist> {
    const supabase = await this.supabase

    await supabase
      .from('wishlist_items')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId)

    return this.getWishlist(userId)
  }

  /**
   * نقل منتج من قائمة الرغبات إلى السلة
   */
  async moveToCart(
    userId: string,
    productId: string
  ): Promise<{ wishlist: Wishlist; success: boolean }> {
    const supabase = await this.supabase

    // الحصول على معلومات المنتج
    const { data: product } = await supabase
      .from('products')
      .select('price')
      .eq('id', productId)
      .single()

    if (!product) throw new Error('Product not found')

    // إضافة للسلة
    await supabase.from('shopping_carts').insert([
      {
        user_id: userId,
        product_id: productId,
        quantity: 1,
        price: product.price,
      },
    ])

    // إزالة من قائمة الرغبات
    const wishlist = await this.removeItem(userId, productId)

    return { wishlist, success: true }
  }

  /**
   * تحديث ملاحظات المنتج
   */
  async updateNotes(
    userId: string,
    productId: string,
    notes: string
  ): Promise<void> {
    const supabase = await this.supabase

    await supabase
      .from('wishlist_items')
      .update({ notes })
      .eq('user_id', userId)
      .eq('product_id', productId)
  }

  /**
   * مشاركة قائمة الرغبات
   */
  async shareWishlist(userId: string): Promise<string> {
    // توليد رابط مشاركة
    const shareToken = `wishlist-${userId}-${Date.now()}`
    return shareToken
  }

  /**
   * الحصول على تنبيهات الأسعار
   */
  async getPriceAlerts(userId: string): Promise<
    Array<{
      productId: string
      originalPrice: number
      currentPrice: number
      discount: number
    }>
  > {
    const supabase = await this.supabase

    const wishlist = await this.getWishlist(userId)

    // الحصول على معلومات المنتجات
    const { data: products } = await supabase
      .from('products')
      .select('id, price, original_price')
      .in(
        'id',
        wishlist.items.map((item) => item.productId)
      )

    const alerts =
      products?.map((product: any) => ({
        productId: product.id,
        originalPrice: product.original_price || product.price,
        currentPrice: product.price,
        discount: (
          ((product.original_price || product.price - product.price) /
            (product.original_price || product.price)) *
          100
        ).toFixed(2),
      })) || []

    return alerts
  }
}

export default new WishlistManager()

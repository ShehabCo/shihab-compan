// Review and Rating System
// نظام التقييمات والمراجعات

import { createClient } from '@/lib/supabase/server'

export interface Review {
  id: string
  productId: string
  userId: string
  rating: number
  title: string
  content: string
  helpful: number
  createdAt: Date
  userName: string
  verified: boolean
}

export interface ProductRating {
  averageRating: number
  totalReviews: number
  ratingDistribution: Record<number, number>
}

export class ReviewSystem {
  private supabase = createClient()

  /**
   * إضافة مراجعة جديدة
   */
  async addReview(
    userId: string,
    productId: string,
    rating: number,
    title: string,
    content: string
  ): Promise<Review> {
    // التحقق من الصحة
    if (rating < 1 || rating > 5) throw new Error('Rating must be between 1 and 5')
    if (title.length < 5) throw new Error('Title must be at least 5 characters')
    if (content.length < 10) throw new Error('Content must be at least 10 characters')

    const supabase = await this.supabase

    // التحقق من أن المستخدم اشترى المنتج
    const { data: purchase } = await supabase
      .from('orders')
      .select('id')
      .eq('user_id', userId)
      .contains('items', [{ productId }])
      .limit(1)

    const isVerified = !!purchase?.length

    const { data: review, error } = await supabase
      .from('reviews')
      .insert([
        {
          product_id: productId,
          user_id: userId,
          rating,
          title: title.trim(),
          content: content.trim(),
          verified: isVerified,
          helpful_count: 0,
          created_at: new Date(),
        },
      ])
      .select()
      .single()

    if (error) throw error

    return {
      id: review.id,
      productId: review.product_id,
      userId: review.user_id,
      rating: review.rating,
      title: review.title,
      content: review.content,
      helpful: review.helpful_count,
      createdAt: new Date(review.created_at),
      userName: '',
      verified: review.verified,
    }
  }

  /**
   * الحصول على مراجعات المنتج
   */
  async getProductReviews(
    productId: string,
    limit: number = 10,
    offset: number = 0
  ): Promise<Review[]> {
    const supabase = await this.supabase

    const { data: reviews } = await supabase
      .from('reviews')
      .select(
        `
        id, 
        product_id, 
        user_id, 
        rating, 
        title, 
        content, 
        helpful_count, 
        created_at, 
        verified,
        user:profiles(name)
      `
      )
      .eq('product_id', productId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    return (
      reviews?.map((r: any) => ({
        id: r.id,
        productId: r.product_id,
        userId: r.user_id,
        rating: r.rating,
        title: r.title,
        content: r.content,
        helpful: r.helpful_count,
        createdAt: new Date(r.created_at),
        userName: r.user?.name || 'مستخدم مجهول',
        verified: r.verified,
      })) || []
    )
  }

  /**
   * حساب تقييم المنتج
   */
  async getProductRating(productId: string): Promise<ProductRating> {
    const supabase = await this.supabase

    const { data: reviews } = await supabase
      .from('reviews')
      .select('rating')
      .eq('product_id', productId)

    if (!reviews || reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: {},
      }
    }

    const ratings = reviews.map((r: any) => r.rating)
    const avgRating = ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length

    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    ratings.forEach((r: number) => {
      distribution[r]++
    })

    return {
      averageRating: Math.round(avgRating * 10) / 10,
      totalReviews: reviews.length,
      ratingDistribution: distribution,
    }
  }

  /**
   * تحديد المراجعة كمفيدة
   */
  async markHelpful(reviewId: string): Promise<void> {
    const supabase = await this.supabase

    const { data: review } = await supabase
      .from('reviews')
      .select('helpful_count')
      .eq('id', reviewId)
      .single()

    await supabase
      .from('reviews')
      .update({ helpful_count: (review?.helpful_count || 0) + 1 })
      .eq('id', reviewId)
  }

  /**
   * حذف مراجعة (بواسطة المستخدم أو الإدارة)
   */
  async deleteReview(reviewId: string, userId: string, isAdmin: boolean = false): Promise<void> {
    const supabase = await this.supabase

    // التحقق من الملكية
    const { data: review } = await supabase
      .from('reviews')
      .select('user_id')
      .eq('id', reviewId)
      .single()

    if (!isAdmin && review?.user_id !== userId) {
      throw new Error('Not authorized to delete this review')
    }

    await supabase.from('reviews').delete().eq('id', reviewId)
  }

  /**
   * الحصول على مراجعات المستخدم
   */
  async getUserReviews(userId: string): Promise<Review[]> {
    const supabase = await this.supabase

    const { data: reviews } = await supabase
      .from('reviews')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    return (
      reviews?.map((r: any) => ({
        id: r.id,
        productId: r.product_id,
        userId: r.user_id,
        rating: r.rating,
        title: r.title,
        content: r.content,
        helpful: r.helpful_count,
        createdAt: new Date(r.created_at),
        userName: '',
        verified: r.verified,
      })) || []
    )
  }
}

export default new ReviewSystem()

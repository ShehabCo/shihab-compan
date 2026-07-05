// Recommendation Engine
// محرك التوصيات المتقدم

import { createClient } from '@/lib/supabase/server'

export interface UserBehavior {
  userId: string
  viewedProducts: string[]
  purchasedProducts: string[]
  cartItems: string[]
  ratings: Record<string, number>
  searchHistory: string[]
}

export interface RecommendationResult {
  productId: string
  score: number
  reason: string
}

export class RecommendationEngine {
  private supabase = createClient()
  private decayFactor = 0.95 // تناقص الأهمية بمرور الوقت

  /**
   * توليد التوصيات الشخصية
   */
  async generateRecommendations(
    userId: string,
    limit: number = 10
  ): Promise<RecommendationResult[]> {
    const behavior = await this.getUserBehavior(userId)

    // استخدام عدة طرق للتوصيات
    const collaborativeRecs = await this.getCollaborativeRecommendations(userId)
    const contentRecs = await this.getContentBasedRecommendations(behavior)
    const trendingRecs = await this.getTrendingProducts(behavior)

    // دمج النتائج من جميع الطرق
    const combined = this.mergeRecommendations(
      [
        ...collaborativeRecs.map((r) => ({ ...r, weight: 0.4 })),
        ...contentRecs.map((r) => ({ ...r, weight: 0.35 })),
        ...trendingRecs.map((r) => ({ ...r, weight: 0.25 })),
      ],
      limit
    )

    return combined.slice(0, limit)
  }

  /**
   * التوصيات التعاونية
   */
  private async getCollaborativeRecommendations(
    userId: string
  ): Promise<RecommendationResult[]> {
    const supabase = await this.supabase

    // البحث عن مستخدمين متشابهين
    const { data: similarUsers } = await supabase.rpc(
      'find_similar_users',
      { target_user_id: userId, similarity_threshold: 0.6 }
    )

    if (!similarUsers?.length) return []

    // الحصول على منتجات التقييمات العالية من المستخدمين المتشابهين
    const { data: recommendations } = await supabase
      .from('user_ratings')
      .select('product_id, rating')
      .in('user_id', similarUsers.map((u: any) => u.user_id))
      .gt('rating', 4)
      .order('rating', { ascending: false })
      .limit(20)

    return (
      recommendations?.map((r: any) => ({
        productId: r.product_id,
        score: (r.rating / 5) * 0.9,
        reason: 'المستخدمون المشابهون أحبوا هذا المنتج',
      })) || []
    )
  }

  /**
   * التوصيات بناءً على المحتوى
   */
  private async getContentBasedRecommendations(
    behavior: UserBehavior
  ): Promise<RecommendationResult[]> {
    if (behavior.viewedProducts.length === 0) return []

    const supabase = await this.supabase

    // الحصول على خصائص المنتجات المشاهدة
    const { data: viewedProductsData } = await supabase
      .from('products')
      .select('category, tags, features')
      .in('id', behavior.viewedProducts.slice(0, 5))

    if (!viewedProductsData?.length) return []

    // استخراج الفئات والعلامات الشائعة
    const commonCategories = this.extractCommonFeatures(
      viewedProductsData.map((p: any) => p.category)
    )
    const commonTags = this.extractCommonFeatures(
      viewedProductsData.flatMap((p: any) => p.tags || [])
    )

    // البحث عن منتجات متشابهة
    const { data: similarProducts } = await supabase
      .from('products')
      .select('id, category, tags, rating')
      .in('category', commonCategories)
      .not('id', 'in', `(${behavior.viewedProducts.join(',')})`)
      .limit(20)

    return (
      similarProducts?.map((p: any) => ({
        productId: p.id,
        score: this.calculateSimilarityScore(p, commonTags),
        reason: 'بناءً على المنتجات التي شاهدتها',
      })) || []
    )
  }

  /**
   * المنتجات الرائجة
   */
  private async getTrendingProducts(
    behavior: UserBehavior
  ): Promise<RecommendationResult[]> {
    const supabase = await this.supabase

    const { data: trending } = await supabase
      .from('products')
      .select('id, name, views_count, sales_count, rating')
      .gt('views_count', 100)
      .not('id', 'in', `(${behavior.purchasedProducts.join(',')})`)
      .order('sales_count', { ascending: false })
      .order('rating', { ascending: false })
      .limit(10)

    return (
      trending?.map((p: any) => ({
        productId: p.id,
        score: ((p.sales_count / 100 + p.rating / 5) / 2) * 0.8,
        reason: 'منتج رائج الآن',
      })) || []
    )
  }

  /**
   * الحصول على سلوك المستخدم
   */
  private async getUserBehavior(userId: string): Promise<UserBehavior> {
    const supabase = await this.supabase

    const [viewedData, purchasedData, ratingData] = await Promise.all([
      supabase
        .from('user_views')
        .select('product_id')
        .eq('user_id', userId)
        .order('viewed_at', { ascending: false })
        .limit(50),
      supabase
        .from('orders')
        .select('product_id')
        .eq('user_id', userId)
        .limit(50),
      supabase
        .from('user_ratings')
        .select('product_id, rating')
        .eq('user_id', userId),
    ])

    const ratings: Record<string, number> = {}
    ratingData.data?.forEach((r: any) => {
      ratings[r.product_id] = r.rating
    })

    return {
      userId,
      viewedProducts: viewedData.data?.map((v: any) => v.product_id) || [],
      purchasedProducts: purchasedData.data?.map((p: any) => p.product_id) || [],
      cartItems: [],
      ratings,
      searchHistory: [],
    }
  }

  /**
   * دمج التوصيات من عدة مصادر
   */
  private mergeRecommendations(
    weighted: Array<RecommendationResult & { weight: number }>,
    limit: number
  ): RecommendationResult[] {
    const scoreMap: Record<string, { score: number; reason: string }> = {}

    weighted.forEach(({ productId, score, reason, weight }) => {
      if (!scoreMap[productId]) {
        scoreMap[productId] = { score: 0, reason }
      }
      scoreMap[productId].score += score * weight
    })

    return Object.entries(scoreMap)
      .map(([productId, { score, reason }]) => ({
        productId,
        score,
        reason,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
  }

  /**
   * استخراج الخصائص الشائعة
   */
  private extractCommonFeatures(items: any[]): string[] {
    const counts: Record<string, number> = {}

    items.forEach((item) => {
      counts[item] = (counts[item] || 0) + 1
    })

    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([item]) => item)
  }

  /**
   * حساب درجة التشابه
   */
  private calculateSimilarityScore(product: any, commonTags: string[]): number {
    let score = 0

    // التحقق من التطابق مع العلامات الشائعة
    if (product.tags) {
      const matchingTags = product.tags.filter((t: string) =>
        commonTags.includes(t)
      )
      score += (matchingTags.length / commonTags.length) * 0.7
    }

    // إضافة التقييم
    score += (product.rating / 5) * 0.3

    return Math.min(score, 1)
  }
}

export default new RecommendationEngine()

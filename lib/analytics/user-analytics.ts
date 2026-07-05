// User Analytics Tracking
// تتبع السلوك والإحصائيات

import { createClient } from '@/lib/supabase/server'

export interface UserAnalytics {
  userId: string
  sessionCount: number
  totalViewTime: number
  productsViewed: number
  purchasedValue: number
  lastActive: Date
}

export interface EventLog {
  userId: string
  eventType: 'view' | 'click' | 'purchase' | 'search' | 'add_to_cart'
  productId?: string
  metadata?: Record<string, any>
  timestamp: Date
}

export class UserAnalyticsService {
  private supabase = createClient()

  /**
   * تسجيل حدث (مشاهدة، نقرة، إلخ)
   */
  async logEvent(
    userId: string,
    eventType: EventLog['eventType'],
    productId?: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    const supabase = await this.supabase

    await supabase.from('event_logs').insert([
      {
        user_id: userId,
        event_type: eventType,
        product_id: productId,
        metadata,
        timestamp: new Date(),
      },
    ])
  }

  /**
   * الحصول على إحصائيات المستخدم
   */
  async getUserAnalytics(userId: string): Promise<UserAnalytics> {
    const supabase = await this.supabase

    const { data: events } = await supabase
      .from('event_logs')
      .select('*')
      .eq('user_id', userId)

    const { data: orders } = await supabase
      .from('orders')
      .select('total_amount')
      .eq('user_id', userId)

    const uniqueSessions = new Set(events?.map((e: any) => e.session_id) || [])
    const viewEvents = events?.filter((e: any) => e.event_type === 'view') || []
    const totalPurchased = orders?.reduce((sum: number, o: any) => sum + o.total_amount, 0) || 0

    return {
      userId,
      sessionCount: uniqueSessions.size,
      totalViewTime: viewEvents.length * 30, // تقدير بناءً على عدد المشاهدات
      productsViewed: viewEvents.length,
      purchasedValue: totalPurchased,
      lastActive: new Date(),
    }
  }

  /**
   * تتبع مسار المستخدم
   */
  async trackUserJourney(userId: string, limit: number = 50): Promise<EventLog[]> {
    const supabase = await this.supabase

    const { data: events } = await supabase
      .from('event_logs')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(limit)

    return (
      events?.map((e: any) => ({
        userId: e.user_id,
        eventType: e.event_type,
        productId: e.product_id,
        metadata: e.metadata,
        timestamp: new Date(e.timestamp),
      })) || []
    )
  }

  /**
   * الحصول على المنتجات الأكثر مشاهدة
   */
  async getMostViewedProducts(limit: number = 10): Promise<
    Array<{ productId: string; views: number }>
  > {
    const supabase = await this.supabase

    const { data: events } = await supabase
      .from('event_logs')
      .select('product_id')
      .eq('event_type', 'view')

    const counts: Record<string, number> = {}
    events?.forEach((e: any) => {
      if (e.product_id) {
        counts[e.product_id] = (counts[e.product_id] || 0) + 1
      }
    })

    return Object.entries(counts)
      .map(([productId, views]) => ({ productId, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, limit)
  }

  /**
   * تحليل معدل التحويل
   */
  async getConversionAnalytics(): Promise<{
    totalVisits: number
    totalPurchases: number
    conversionRate: number
    avgOrderValue: number
  }> {
    const supabase = await this.supabase

    const { count: totalVisits } = await supabase
      .from('event_logs')
      .select('*', { count: 'exact', head: true })
      .eq('event_type', 'view')

    const { count: totalPurchases } = await supabase
      .from('event_logs')
      .select('*', { count: 'exact', head: true })
      .eq('event_type', 'purchase')

    const { data: orders } = await supabase
      .from('orders')
      .select('total_amount')

    const totalRevenue = orders?.reduce((sum: number, o: any) => sum + o.total_amount, 0) || 0
    const avgOrderValue = (totalRevenue / (totalPurchases || 1)) || 0

    return {
      totalVisits: totalVisits || 0,
      totalPurchases: totalPurchases || 0,
      conversionRate: ((totalPurchases || 0) / (totalVisits || 1)) * 100,
      avgOrderValue,
    }
  }

  /**
   * تحديد المستخدمين المخاطر (الذين قد يتركون المتجر)
   */
  async getAtRiskUsers(): Promise<
    Array<{
      userId: string
      lastActive: Date
      cartTotal: number
    }>
  > {
    const supabase = await this.supabase

    // المستخدمون الذين لم يكونوا نشطين لمدة 7 أيام
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

    const { data: users } = await supabase
      .from('user_analytics')
      .select('user_id, last_active')
      .lt('last_active', sevenDaysAgo)

    return (
      users?.map((u: any) => ({
        userId: u.user_id,
        lastActive: new Date(u.last_active),
        cartTotal: 0, // سيتم ملؤه من بيانات السلة
      })) || []
    )
  }
}

export default new UserAnalyticsService()

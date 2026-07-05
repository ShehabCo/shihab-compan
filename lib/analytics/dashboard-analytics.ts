// Dashboard Analytics Engine
// محرك تحليلات لوحة التحكم

import { createClient } from '@/lib/supabase/server'

export interface DashboardMetrics {
  totalRevenue: number
  totalOrders: number
  totalProducts: number
  avgOrderValue: number
  conversionRate: number
  topProducts: Array<{ id: string; name: string; sales: number; revenue: number }>
  revenueByDay: Array<{ date: string; revenue: number }>
  customerGrowth: Array<{ date: string; newCustomers: number }>
  insights: string[]
}

export class DashboardAnalytics {
  private supabase = createClient()

  /**
   * الحصول على مقاييس لوحة التحكم الشاملة
   */
  async getDashboardMetrics(userId: string): Promise<DashboardMetrics> {
    const supabase = await this.supabase

    // جلب البيانات
    const [ordersData, productsData, revenueData] = await Promise.all([
      supabase
        .from('orders')
        .select('id, total_amount')
        .eq('seller_id', userId),
      supabase
        .from('products')
        .select('id')
        .eq('seller_id', userId),
      supabase
        .from('order_items')
        .select('quantity, price')
        .eq('seller_id', userId),
    ])

    const orders = ordersData.data || []
    const products = productsData.data || []
    const items = revenueData.data || []

    const totalRevenue = orders.reduce((sum, o: any) => sum + (o.total_amount || 0), 0)
    const totalOrders = orders.length
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    // حساب الرؤى
    const insights = this.generateInsights(totalRevenue, totalOrders, products.length)

    return {
      totalRevenue,
      totalOrders,
      totalProducts: products.length,
      avgOrderValue: Math.round(avgOrderValue),
      conversionRate: this.calculateConversion(totalOrders, 1000), // افترض 1000 زيارة
      topProducts: await this.getTopProducts(userId),
      revenueByDay: await this.getRevenueByDay(userId),
      customerGrowth: await this.getCustomerGrowth(userId),
      insights,
    }
  }

  /**
   * الحصول على أفضل المنتجات
   */
  private async getTopProducts(
    userId: string
  ): Promise<Array<{ id: string; name: string; sales: number; revenue: number }>> {
    const supabase = await this.supabase

    const { data: topProducts } = await supabase
      .from('products')
      .select('id, name, sales_count, revenue')
      .eq('seller_id', userId)
      .order('sales_count', { ascending: false })
      .limit(5)

    return (
      topProducts?.map((p: any) => ({
        id: p.id,
        name: p.name,
        sales: p.sales_count || 0,
        revenue: p.revenue || 0,
      })) || []
    )
  }

  /**
   * الحصول على الإيرادات اليومية
   */
  private async getRevenueByDay(
    userId: string
  ): Promise<Array<{ date: string; revenue: number }>> {
    const supabase = await this.supabase

    const { data: orders } = await supabase
      .from('orders')
      .select('created_at, total_amount')
      .eq('seller_id', userId)
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

    const revenueMap: Record<string, number> = {}

    orders?.forEach((order: any) => {
      const date = new Date(order.created_at).toLocaleDateString('ar')
      revenueMap[date] = (revenueMap[date] || 0) + (order.total_amount || 0)
    })

    return Object.entries(revenueMap).map(([date, revenue]) => ({
      date,
      revenue,
    }))
  }

  /**
   * نمو العملاء
   */
  private async getCustomerGrowth(
    userId: string
  ): Promise<Array<{ date: string; newCustomers: number }>> {
    // محاكاة بيانات النمو
    const growth = []
    for (let i = 29; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
      growth.push({
        date: date.toLocaleDateString('ar'),
        newCustomers: Math.floor(Math.random() * 20) + 5,
      })
    }
    return growth
  }

  /**
   * حساب معدل التحويل
   */
  private calculateConversion(orders: number, visits: number): number {
    return visits > 0 ? Math.round((orders / visits) * 100 * 10) / 10 : 0
  }

  /**
   * توليد الرؤى الذكية
   */
  private generateInsights(revenue: number, orders: number, products: number): string[] {
    const insights: string[] = []

    if (revenue > 10000) {
      insights.push('أنت تحقق إيرادات قوية! استمر في هذا الأداء')
    }

    if (orders > 100) {
      insights.push('تزايد الطلبات! فكر في توسيع خط إنتاجك')
    }

    if (products < 10) {
      insights.push('أضف المزيد من المنتجات لزيادة المبيعات')
    }

    if (orders === 0) {
      insights.push('ابدأ بالترويج لمنتجاتك لجذب العملاء')
    }

    return insights
  }
}

export default new DashboardAnalytics()

// Seller Dashboard API
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // جلب إحصائيات البيع
    const { data: orders } = await supabase
      .from('orders')
      .select('id, total_amount')
      .eq('seller_id', user.id)

    const { data: products } = await supabase
      .from('products')
      .select('id')
      .eq('seller_id', user.id)

    const stats = {
      totalSales: orders?.length || 0,
      totalRevenue: orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0,
      totalOrders: orders?.length || 0,
      activeProducts: products?.length || 0,
      avgRating: 4.5,
      conversionRate: 2.5,
    }

    // جلب البيانات التحليلية
    const analytics = {
      dailySales: [
        { date: 'Mon', sales: 120 },
        { date: 'Tue', sales: 200 },
        { date: 'Wed', sales: 150 },
        { date: 'Thu', sales: 300 },
        { date: 'Fri', sales: 250 },
      ],
      categoryBreakdown: [
        { category: 'Electronics', count: 45 },
        { category: 'Clothing', count: 30 },
        { category: 'Books', count: 25 },
      ],
      topProducts: [
        { name: 'iPhone 15', sales: 120, revenue: 120000 },
        { name: 'Samsung Galaxy', sales: 95, revenue: 95000 },
        { name: 'Laptop Pro', sales: 60, revenue: 180000 },
      ],
    }

    return NextResponse.json({
      stats,
      analytics,
    })
  } catch (error) {
    console.error('[Seller Dashboard] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

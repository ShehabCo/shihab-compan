// Admin Statistics API
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // تحقق من أن المستخدم هو admin
    const { data: adminCheck } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single()

    if (!adminCheck) {
      return NextResponse.json({ error: 'Admin only' }, { status: 403 })
    }

    // احصل على إحصائيات النظام
    const [usersCount, productsCount, ordersCount, revenueData] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('total_amount'),
    ])

    const totalRevenue = (revenueData.data || []).reduce(
      (sum: number, o: any) => sum + (o.total_amount || 0),
      0
    )

    return NextResponse.json({
      totalUsers: usersCount.count || 0,
      totalProducts: productsCount.count || 0,
      totalOrders: ordersCount.count || 0,
      totalRevenue,
      avgOrderValue: (ordersCount.count || 0) > 0 ? totalRevenue / ordersCount.count : 0,
    })
  } catch (error) {
    console.error('[Admin Stats] Error:', error)
    return NextResponse.json(
      { error: 'Failed to get admin statistics' },
      { status: 500 }
    )
  }
}

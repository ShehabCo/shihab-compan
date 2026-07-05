// Advanced Seller Dashboard API
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import dashboardAnalytics from '@/lib/analytics/dashboard-analytics'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const metrics = await dashboardAnalytics.getDashboardMetrics(user.id)

    return NextResponse.json(metrics)
  } catch (error) {
    console.error('[Seller Dashboard] Error:', error)
    return NextResponse.json(
      { error: 'Failed to get dashboard metrics' },
      { status: 500 }
    )
  }
}

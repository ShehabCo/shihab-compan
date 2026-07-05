// Seller Dashboard Overview Component

'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart, LineChart, PieChart } from 'recharts'

interface DashboardStats {
  totalSales: number
  totalRevenue: number
  totalOrders: number
  activeProducts: number
  avgRating: number
  conversionRate: number
}

interface AnalyticsData {
  dailySales: Array<{ date: string; sales: number }>
  categoryBreakdown: Array<{ category: string; count: number }>
  topProducts: Array<{ name: string; sales: number; revenue: number }>
}

export function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/v1/seller/dashboard', {
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (response.ok) {
          const data = await response.json()
          setStats(data.stats)
          setAnalytics(data.analytics)
        }
      } catch (error) {
        console.error('[Dashboard] Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return <div className="text-center py-8">جاري التحميل...</div>
  }

  return (
    <div className="space-y-6">
      {/* إحصائيات رئيسية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="text-gray-600 text-sm mb-2">إجمالي المبيعات</div>
          <div className="text-3xl font-bold text-gray-900">
            {stats?.totalSales || 0}
          </div>
          <div className="text-green-600 text-sm mt-2">+12% عن الشهر الماضي</div>
        </Card>

        <Card className="p-6">
          <div className="text-gray-600 text-sm mb-2">إجمالي الإيرادات</div>
          <div className="text-3xl font-bold text-gray-900">
            ${stats?.totalRevenue || 0}
          </div>
          <div className="text-green-600 text-sm mt-2">+8% عن الشهر الماضي</div>
        </Card>

        <Card className="p-6">
          <div className="text-gray-600 text-sm mb-2">معدل التحويل</div>
          <div className="text-3xl font-bold text-gray-900">
            {stats?.conversionRate || 0}%
          </div>
          <div className="text-blue-600 text-sm mt-2">
            من {stats?.totalOrders || 0} طلب
          </div>
        </Card>
      </div>

      {/* الرسوم البيانية */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">المبيعات اليومية</h3>
          {/* <BarChart data={analytics?.dailySales || []} /> */}
          <div className="text-gray-500">رسم بياني للمبيعات اليومية</div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">توزيع الفئات</h3>
          {/* <PieChart data={analytics?.categoryBreakdown || []} /> */}
          <div className="text-gray-500">توزيع المنتجات حسب الفئة</div>
        </Card>
      </div>

      {/* أفضل المنتجات */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">أفضل المنتجات</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-right py-2">المنتج</th>
                <th className="text-center py-2">المبيعات</th>
                <th className="text-right py-2">الإيرادات</th>
              </tr>
            </thead>
            <tbody>
              {analytics?.topProducts.map((product) => (
                <tr key={product.name} className="border-b">
                  <td className="py-3">{product.name}</td>
                  <td className="text-center">{product.sales}</td>
                  <td className="text-right">${product.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* إجراءات سريعة */}
      <div className="flex gap-4">
        <Button>إضافة منتج جديد</Button>
        <Button variant="outline">عرض جميع المنتجات</Button>
        <Button variant="outline">تصدير التقارير</Button>
      </div>
    </div>
  )
}

export default DashboardOverview

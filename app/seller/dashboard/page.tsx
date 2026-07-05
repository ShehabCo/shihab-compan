// Advanced Seller Dashboard
'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart, LineChart, TrendingUp } from 'lucide-react'

interface DashboardData {
  totalRevenue: number
  totalOrders: number
  totalProducts: number
  avgOrderValue: number
  conversionRate: number
  insights: string[]
}

export default function SellerDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch('/api/v1/seller/dashboard')
        if (response.ok) {
          const data = await response.json()
          setDashboardData(data)
        }
      } catch (error) {
        console.error('[Dashboard] Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  if (loading) {
    return <div className="text-center py-8">جاري التحميل...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">لوحة تحكم البائع</h1>

        {/* الإحصائيات الرئيسية */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">الإيرادات الكلية</p>
                <p className="text-3xl font-bold">
                  ${dashboardData?.totalRevenue || 0}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600 opacity-20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">إجمالي الطلبات</p>
                <p className="text-3xl font-bold">
                  {dashboardData?.totalOrders || 0}
                </p>
              </div>
              <BarChart className="w-8 h-8 text-blue-600 opacity-20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">المنتجات النشطة</p>
                <p className="text-3xl font-bold">
                  {dashboardData?.totalProducts || 0}
                </p>
              </div>
              <LineChart className="w-8 h-8 text-purple-600 opacity-20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">متوسط الطلب</p>
                <p className="text-3xl font-bold">
                  ${dashboardData?.avgOrderValue || 0}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-600 opacity-20" />
            </div>
          </Card>
        </div>

        {/* الرؤى الذكية */}
        {dashboardData?.insights && dashboardData.insights.length > 0 && (
          <Card className="p-6 mb-8 bg-blue-50 border-blue-200">
            <h3 className="text-lg font-bold mb-4 text-blue-900">الرؤى والتوصيات</h3>
            <ul className="space-y-2">
              {dashboardData.insights.map((insight, i) => (
                <li key={i} className="text-blue-700 flex items-start">
                  <span className="mr-3">💡</span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* الأدوات السريعة */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">أدوات الإدارة</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                إضافة منتج جديد
              </Button>
              <Button variant="outline" className="w-full justify-start">
                استيراد منتجات (CSV)
              </Button>
              <Button variant="outline" className="w-full justify-start">
                تحديث الأسعار
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">التقارير</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                تقرير المبيعات
              </Button>
              <Button variant="outline" className="w-full justify-start">
                تقرير الأداء
              </Button>
              <Button variant="outline" className="w-full justify-start">
                تقرير العملاء
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">إعدادات</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                سياسة الشحن
              </Button>
              <Button variant="outline" className="w-full justify-start">
                طرق الدفع
              </Button>
              <Button variant="outline" className="w-full justify-start">
                إعدادات الملف الشخصي
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

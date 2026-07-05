"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Package, ShoppingBag, DollarSign, AlertCircle, Download } from "lucide-react"

interface DashboardStats {
  totalUsers: number
  totalServices: number
  activeServices: number
  totalOrders: number
  pendingOrders: number
  completedOrders: number
  platformRevenue: number
  totalRevenue: number
  disputedOrders: number
  averageOrderValue: number
  successRate: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [timeRange, setTimeRange] = useState("month")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading dashboard stats
    const mockStats: DashboardStats = {
      totalUsers: 342,
      totalServices: 87,
      activeServices: 75,
      totalOrders: 1234,
      pendingOrders: 23,
      completedOrders: 1156,
      platformRevenue: 12450.5,
      totalRevenue: 124505,
      disputedOrders: 2,
      averageOrderValue: 100.9,
      successRate: 93.8,
    }
    setStats(mockStats)
    setLoading(false)
  }, [])

  if (loading || !stats) {
    return <div className="flex items-center justify-center min-h-screen">جاري التحميل...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-amber-950/5 to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-amber-50">لوحة تحكم الإدارة</h1>
            <p className="text-amber-100/70">إدارة أم سليم للطعام</p>
          </div>
          <div className="flex gap-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 rounded-lg bg-amber-600/20 border border-amber-600/30 text-amber-50"
            >
              <option value="week">هذا الأسبوع</option>
              <option value="month">هذا الشهر</option>
              <option value="year">هذه السنة</option>
            </select>
            <Button className="bg-amber-600 hover:bg-amber-700 text-black gap-2">
              <Download className="h-4 w-4" />
              تحميل تقرير
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="border-amber-600/30 bg-black/50 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-amber-100 flex items-center justify-between">
                إجمالي المستخدمين
                <Users className="h-4 w-4 text-amber-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-50">{stats.totalUsers}</div>
              <p className="text-xs text-amber-100/60">+12% هذا الشهر</p>
            </CardContent>
          </Card>

          <Card className="border-amber-600/30 bg-black/50 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-amber-100 flex items-center justify-between">
                الخدمات النشطة
                <Package className="h-4 w-4 text-amber-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-50">{stats.activeServices}</div>
              <p className="text-xs text-amber-100/60">{stats.totalServices} إجمالي</p>
            </CardContent>
          </Card>

          <Card className="border-amber-600/30 bg-black/50 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-amber-100 flex items-center justify-between">
                الطلبات اليومية
                <ShoppingBag className="h-4 w-4 text-amber-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-50">{stats.totalOrders}</div>
              <p className="text-xs text-amber-100/60">معدل النجاح: {stats.successRate}%</p>
            </CardContent>
          </Card>

          <Card className="border-amber-600/30 bg-black/50 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-amber-100 flex items-center justify-between">
                إيرادات المنصة
                <DollarSign className="h-4 w-4 text-amber-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-50">${stats.platformRevenue.toFixed(0)}</div>
              <p className="text-xs text-amber-100/60">من ${stats.totalRevenue.toFixed(0)} إجمالي</p>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        {stats.disputedOrders > 0 && (
          <Card className="border-red-600/30 bg-red-600/10 backdrop-blur mb-8">
            <CardContent className="flex items-center gap-3 p-4">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-bold text-red-400">تنبيه مهم</p>
                <p className="text-sm text-red-300/80">
                  يوجد {stats.disputedOrders} طلب متنازع عليه يحتاج إلى مراجعة فورية
                </p>
              </div>
              <Button className="bg-red-600 hover:bg-red-700 text-white">مراجعة</Button>
            </CardContent>
          </Card>
        )}

        {/* Detailed Analytics */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 bg-amber-600/20 border border-amber-600/30">
            <TabsTrigger value="overview" className="data-[state=active]:bg-amber-600 data-[state=active]:text-black">
              نظرة عامة
            </TabsTrigger>
            <TabsTrigger value="revenue" className="data-[state=active]:bg-amber-600 data-[state=active]:text-black">
              الإيرادات
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-amber-600 data-[state=active]:text-black">
              المستخدمون
            </TabsTrigger>
            <TabsTrigger
              value="performance"
              className="data-[state=active]:bg-amber-600 data-[state=active]:text-black"
            >
              الأداء
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-amber-600/30 bg-black/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-amber-50">توزيع حالات الطلبات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-amber-100">مكتملة</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-amber-600/20 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: "94%" }} />
                        </div>
                        <span className="text-amber-50 font-bold w-12">{stats.completedOrders}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-amber-100">قيد الانتظار</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-amber-600/20 rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "2%" }} />
                        </div>
                        <span className="text-amber-50 font-bold w-12">{stats.pendingOrders}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-amber-600/30 bg-black/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-amber-50">متوسط قيمة الطلب</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-4xl font-bold text-amber-400">${stats.averageOrderValue.toFixed(2)}</p>
                      <p className="text-sm text-amber-100/60">متوسط القيمة</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="p-2 rounded bg-amber-600/10 border border-amber-600/30">
                        <p className="text-amber-100/70">أعلى قيمة</p>
                        <p className="text-amber-400 font-bold">$250.00</p>
                      </div>
                      <div className="p-2 rounded bg-amber-600/10 border border-amber-600/30">
                        <p className="text-amber-100/70">أقل قيمة</p>
                        <p className="text-amber-400 font-bold">$15.00</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-4">
            <Card className="border-amber-600/30 bg-black/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-amber-50">تحليل الإيرادات</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 rounded-lg bg-amber-600/10 border border-amber-600/30">
                    <p className="text-amber-100/70 text-sm mb-2">إجمالي المبيعات</p>
                    <p className="text-3xl font-bold text-amber-400">${stats.totalRevenue.toFixed(2)}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                    <p className="text-green-100/70 text-sm mb-2">عمولة المنصة (10%)</p>
                    <p className="text-3xl font-bold text-green-400">${stats.platformRevenue.toFixed(2)}</p>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-amber-600/10 border border-amber-600/30">
                  <p className="text-amber-100/70 text-sm mb-2">صافي أرباح المتاجر</p>
                  <p className="text-2xl font-bold text-amber-400">
                    ${(stats.totalRevenue - stats.platformRevenue).toFixed(2)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card className="border-amber-600/30 bg-black/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-amber-50">تحليل المستخدمين</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                    <p className="text-blue-100/70 text-sm mb-2">المشترون</p>
                    <p className="text-2xl font-bold text-blue-400">245</p>
                    <p className="text-xs text-blue-100/60">71% من الإجمالي</p>
                  </div>
                  <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
                    <p className="text-purple-100/70 text-sm mb-2">البائعون</p>
                    <p className="text-2xl font-bold text-purple-400">87</p>
                    <p className="text-xs text-purple-100/60">25% من الإجمالي</p>
                  </div>
                  <div className="p-4 rounded-lg bg-pink-500/10 border border-pink-500/30">
                    <p className="text-pink-100/70 text-sm mb-2">المدراء</p>
                    <p className="text-2xl font-bold text-pink-400">10</p>
                    <p className="text-xs text-pink-100/60">3% من الإجمالي</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <Card className="border-amber-600/30 bg-black/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-amber-50">مؤشرات الأداء الرئيسية</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                    <p className="text-green-100/70 text-sm mb-2">معدل النجاح</p>
                    <p className="text-3xl font-bold text-green-400">{stats.successRate}%</p>
                    <p className="text-xs text-green-100/60">طلبات مكتملة بنجاح</p>
                  </div>
                  <div className="p-4 rounded-lg bg-amber-600/10 border border-amber-600/30">
                    <p className="text-amber-100/70 text-sm mb-2">وقت التوصيل المتوسط</p>
                    <p className="text-3xl font-bold text-amber-400">32 دقيقة</p>
                    <p className="text-xs text-amber-100/60">من الطلب إلى التسليم</p>
                  </div>
                  <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                    <p className="text-blue-100/70 text-sm mb-2">رضا العملاء</p>
                    <p className="text-3xl font-bold text-blue-400">4.7/5</p>
                    <p className="text-xs text-blue-100/60">من {stats.completedOrders} تقييم</p>
                  </div>
                  <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
                    <p className="text-purple-100/70 text-sm mb-2">معدل العودة</p>
                    <p className="text-3xl font-bold text-purple-400">68%</p>
                    <p className="text-xs text-purple-100/60">عملاء متكررون</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

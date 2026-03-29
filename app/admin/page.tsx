import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Package, ShoppingBag, DollarSign, TrendingUp, AlertCircle } from "lucide-react"

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user is admin
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (profile?.role !== "admin") {
    redirect("/dashboard")
  }

  // Fetch platform statistics
  const { count: totalUsers } = await supabase.from("profiles").select("*", { count: "exact", head: true })

  const { count: totalServices } = await supabase.from("services").select("*", { count: "exact", head: true })

  const { count: activeServices } = await supabase
    .from("services")
    .select("*", { count: "exact", head: true })
    .eq("status", "active")

  const { count: totalOrders } = await supabase.from("orders").select("*", { count: "exact", head: true })

  const { count: pendingOrders } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending")

  const { count: disputedOrders } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("status", "disputed")

  // Calculate total revenue (sum of completed orders)
  const { data: completedOrders } = await supabase.from("orders").select("price").eq("status", "completed")

  const totalRevenue = completedOrders?.reduce((sum, order) => sum + Number(order.price), 0) || 0
  const platformRevenue = totalRevenue * 0.1 // 10% commission

  // Get recent orders
  const { data: recentOrders } = await supabase
    .from("orders")
    .select(
      `
      *,
      service:services(title),
      buyer:profiles!orders_buyer_id_fkey(display_name),
      seller:profiles!orders_seller_id_fkey(display_name)
    `,
    )
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">لوحة تحكم الإدارة</h1>
          <p className="text-muted-foreground">إحصائيات وإدارة المنصة</p>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">إجمالي المستخدمين</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers || 0}</div>
              <p className="text-xs text-muted-foreground">مستخدم مسجل</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">الخدمات</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalServices || 0}</div>
              <p className="text-xs text-muted-foreground">{activeServices || 0} نشط</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">الطلبات</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders || 0}</div>
              <p className="text-xs text-muted-foreground">{pendingOrders || 0} قيد الانتظار</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">إيرادات المنصة</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${platformRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">من ${totalRevenue.toFixed(2)} إجمالي</p>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        {(disputedOrders || 0) > 0 && (
          <Card className="mb-8 border-orange-500/50 bg-orange-500/5">
            <CardContent className="flex items-center gap-3 p-6">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              <div>
                <p className="font-semibold">تنبيه: طلبات متنازع عليها</p>
                <p className="text-sm text-muted-foreground">يوجد {disputedOrders} طلب متنازع عليه يحتاج إلى مراجعة</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-4 w-4" />
                معدل النمو
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">مستخدمين جدد (هذا الشهر)</span>
                  <span className="font-semibold">-</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">خدمات جديدة (هذا الشهر)</span>
                  <span className="font-semibold">-</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">طلبات (هذا الشهر)</span>
                  <span className="font-semibold">-</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">توزيع المستخدمين</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">مشترين</span>
                  <span className="font-semibold">-</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">بائعين</span>
                  <span className="font-semibold">-</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">مدراء</span>
                  <span className="font-semibold">-</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">حالة الطلبات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">قيد التنفيذ</span>
                  <span className="font-semibold">-</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">مكتملة</span>
                  <span className="font-semibold">-</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">ملغية</span>
                  <span className="font-semibold">-</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>آخر الطلبات</CardTitle>
          </CardHeader>
          <CardContent>
            {recentOrders && recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => {
                  const service = Array.isArray(order.service) ? order.service[0] : order.service
                  const buyer = Array.isArray(order.buyer) ? order.buyer[0] : order.buyer
                  const seller = Array.isArray(order.seller) ? order.seller[0] : order.seller

                  return (
                    <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                      <div>
                        <p className="font-medium">{service?.title}</p>
                        <p className="text-sm text-muted-foreground">
                          من {buyer?.display_name} إلى {seller?.display_name}
                        </p>
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-primary">${order.price.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">{order.status}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="py-8 text-center text-muted-foreground">لا توجد طلبات بعد</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

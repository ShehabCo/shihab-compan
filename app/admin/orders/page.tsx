import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { ar } from "date-fns/locale"

const statusLabels: Record<string, string> = {
  pending: "قيد الانتظار",
  in_progress: "قيد التنفيذ",
  delivered: "تم التسليم",
  completed: "مكتمل",
  cancelled: "ملغي",
  disputed: "متنازع عليه",
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-500",
  in_progress: "bg-blue-500/10 text-blue-500",
  delivered: "bg-purple-500/10 text-purple-500",
  completed: "bg-green-500/10 text-green-500",
  cancelled: "bg-red-500/10 text-red-500",
  disputed: "bg-orange-500/10 text-orange-500",
}

export default async function AdminOrdersPage() {
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

  // Fetch all orders
  const { data: orders } = await supabase
    .from("orders")
    .select(
      `
      *,
      service:services(id, title, image_url),
      buyer:profiles!orders_buyer_id_fkey(display_name),
      seller:profiles!orders_seller_id_fkey(display_name)
    `,
    )
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold">إدارة الطلبات</h1>
            <p className="text-muted-foreground">عرض ومراقبة جميع الطلبات على المنصة</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/admin">العودة للوحة التحكم</Link>
          </Button>
        </div>

        {orders && orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => {
              const service = Array.isArray(order.service) ? order.service[0] : order.service
              const buyer = Array.isArray(order.buyer) ? order.buyer[0] : order.buyer
              const seller = Array.isArray(order.seller) ? order.seller[0] : order.seller

              return (
                <Card key={order.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex gap-4">
                        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded bg-muted">
                          {service?.image_url ? (
                            <Image
                              src={service.image_url || "/placeholder.svg"}
                              alt={service.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <Package className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="mb-2 flex items-center gap-2">
                            <Badge className={statusColors[order.status]}>{statusLabels[order.status]}</Badge>
                            <span className="text-xs text-muted-foreground">#{order.id.slice(0, 8)}</span>
                          </div>
                          <h3 className="mb-1 font-semibold">{service?.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            من {buyer?.display_name} إلى {seller?.display_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(order.created_at), "PPP", { locale: ar })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 md:flex-col md:items-end">
                        <div className="text-left md:text-right">
                          <p className="text-sm text-muted-foreground">المبلغ</p>
                          <p className="text-xl font-bold text-primary">${order.price.toFixed(2)}</p>
                        </div>
                        <Button asChild size="sm">
                          <Link href={`/orders/${order.id}`}>عرض التفاصيل</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="flex min-h-[400px] items-center justify-center py-12">
              <p className="text-muted-foreground">لا توجد طلبات بعد</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
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

export default async function OrdersPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch user profile to determine role
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  // Fetch orders based on user role
  const { data: orders } = await supabase
    .from("orders")
    .select(
      `
      *,
      service:services(id, title, image_url, category),
      buyer:profiles!orders_buyer_id_fkey(display_name, avatar_url),
      seller:profiles!orders_seller_id_fkey(display_name, avatar_url)
    `,
    )
    .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
    .order("created_at", { ascending: false })

  const isSeller = profile?.role === "seller"

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">{isSeller ? "الطلبات الواردة" : "طلباتي"}</h1>
          <p className="text-muted-foreground">{isSeller ? "إدارة طلبات عملائك" : "تتبع حالة طلباتك"}</p>
        </div>

        {orders && orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => {
              const service = Array.isArray(order.service) ? order.service[0] : order.service
              const otherParty = isSeller
                ? Array.isArray(order.buyer)
                  ? order.buyer[0]
                  : order.buyer
                : Array.isArray(order.seller)
                  ? order.seller[0]
                  : order.seller

              return (
                <Card key={order.id} className="overflow-hidden">
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
                            {isSeller ? "من" : "إلى"}: {otherParty?.display_name}
                          </p>
                          <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>
                              {formatDistanceToNow(new Date(order.created_at), {
                                addSuffix: true,
                                locale: ar,
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 md:flex-col md:items-end">
                        <div className="text-left md:text-right">
                          <p className="text-sm text-muted-foreground">المبلغ</p>
                          <p className="text-xl font-bold text-primary">${order.price.toFixed(2)}</p>
                        </div>
                        <Button asChild>
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
            <CardContent className="flex min-h-[400px] flex-col items-center justify-center py-12">
              <Package className="mb-4 h-16 w-16 text-muted-foreground" />
              <h3 className="mb-2 text-xl font-semibold">لا توجد طلبات بعد</h3>
              <p className="mb-6 text-center text-muted-foreground">
                {isSeller ? "ستظهر طلبات عملائك هنا" : "ابدأ بطلب خدمة من السوق"}
              </p>
              {!isSeller && (
                <Button asChild>
                  <Link href="/search">تصفح الخدمات</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

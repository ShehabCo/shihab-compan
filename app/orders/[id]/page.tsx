import { redirect, notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Package, Clock, MessageSquare, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { ar } from "date-fns/locale"
import { OrderActions } from "@/components/order-actions"
import { ReviewForm } from "@/components/review-form"

const statusLabels: Record<string, string> = {
  pending: "قيد الانتظار",
  in_progress: "قيد التنفيذ",
  delivered: "تم التسليم",
  completed: "مكتمل",
  cancelled: "ملغي",
  disputed: "متنازع عليه",
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  in_progress: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  delivered: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  completed: "bg-green-500/10 text-green-500 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
  disputed: "bg-orange-500/10 text-orange-500 border-orange-500/20",
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await params

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch order with related data
  const { data: order, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      service:services(id, title, description, image_url, category, delivery_days),
      buyer:profiles!orders_buyer_id_fkey(id, display_name, full_name, avatar_url, email),
      seller:profiles!orders_seller_id_fkey(id, display_name, full_name, avatar_url, email)
    `,
    )
    .eq("id", id)
    .single()

  if (error || !order) {
    notFound()
  }

  // Check if user is part of this order
  if (order.buyer_id !== user.id && order.seller_id !== user.id) {
    redirect("/orders")
  }

  const service = Array.isArray(order.service) ? order.service[0] : order.service
  const buyer = Array.isArray(order.buyer) ? order.buyer[0] : order.buyer
  const seller = Array.isArray(order.seller) ? order.seller[0] : order.seller
  const isSeller = order.seller_id === user.id
  const otherParty = isSeller ? buyer : seller

  // Get or create conversation
  let { data: conversation } = await supabase.from("conversations").select("id").eq("order_id", order.id).single()

  if (!conversation) {
    const { data: newConversation } = await supabase
      .from("conversations")
      .insert({
        order_id: order.id,
        buyer_id: order.buyer_id,
        seller_id: order.seller_id,
      })
      .select("id")
      .single()

    conversation = newConversation
  }

  let hasReviewed = false
  if (!isSeller && order.status === "completed") {
    const { data: existingReview } = await supabase.from("reviews").select("id").eq("order_id", order.id).single()

    hasReviewed = !!existingReview
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/orders" className="hover:text-foreground">
              الطلبات
            </Link>
            <span>/</span>
            <span>#{order.id.slice(0, 8)}</span>
          </div>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold">تفاصيل الطلب</h1>
              <p className="text-muted-foreground">{format(new Date(order.created_at), "PPP", { locale: ar })}</p>
            </div>
            <Badge className={`${statusColors[order.status]} border text-base`}>{statusLabels[order.status]}</Badge>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Info */}
            <Card>
              <CardHeader>
                <CardTitle>معلومات الخدمة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded bg-muted">
                    {service?.image_url ? (
                      <Image
                        src={service.image_url || "/placeholder.svg"}
                        alt={service.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Package className="h-10 w-10 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-2 text-lg font-semibold">{service?.title}</h3>
                    <p className="mb-3 text-sm text-muted-foreground line-clamp-2">{service?.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>التسليم خلال {service?.delivery_days} أيام</span>
                      </div>
                      <Separator orientation="vertical" className="h-4" />
                      <span className="font-semibold text-primary">${order.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            {order.requirements && (
              <Card>
                <CardHeader>
                  <CardTitle>متطلبات الطلب</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">{order.requirements}</p>
                </CardContent>
              </Card>
            )}

            {/* Delivery */}
            {order.status === "delivered" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    تم التسليم
                  </CardTitle>
                  <CardDescription>
                    {order.delivered_at && format(new Date(order.delivered_at), "PPP 'الساعة' p", { locale: ar })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {order.delivery_note && (
                    <div className="mb-4">
                      <p className="mb-2 text-sm font-medium">ملاحظة التسليم:</p>
                      <p className="whitespace-pre-wrap text-sm text-muted-foreground">{order.delivery_note}</p>
                    </div>
                  )}
                  {order.delivery_files && order.delivery_files.length > 0 && (
                    <div>
                      <p className="mb-2 text-sm font-medium">الملفات المرفقة:</p>
                      <div className="space-y-2">
                        {order.delivery_files.map((file, index) => (
                          <a
                            key={index}
                            href={file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 rounded-lg border p-3 text-sm hover:bg-muted"
                          >
                            <Package className="h-4 w-4" />
                            <span>ملف {index + 1}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Cancellation */}
            {order.status === "cancelled" && order.cancellation_reason && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-red-500" />
                    تم الإلغاء
                  </CardTitle>
                  <CardDescription>
                    {order.cancelled_at && format(new Date(order.cancelled_at), "PPP 'الساعة' p", { locale: ar })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{order.cancellation_reason}</p>
                </CardContent>
              </Card>
            )}

            {/* Order Actions */}
            <OrderActions order={order} isSeller={isSeller} />

            {!isSeller && order.status === "completed" && !hasReviewed && (
              <Card>
                <CardHeader>
                  <CardTitle>قيّم الخدمة</CardTitle>
                  <CardDescription>شارك تجربتك لمساعدة المشترين الآخرين</CardDescription>
                </CardHeader>
                <CardContent>
                  <ReviewForm orderId={order.id} serviceId={order.service_id} sellerId={order.seller_id} />
                </CardContent>
              </Card>
            )}

            {!isSeller && order.status === "completed" && hasReviewed && (
              <Card>
                <CardContent className="flex items-center gap-2 p-6 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span>تم إرسال تقييمك بنجاح</span>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Other Party Info */}
            <Card>
              <CardHeader>
                <CardTitle>{isSeller ? "معلومات المشتري" : "معلومات البائع"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={otherParty.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback>{otherParty.display_name?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{otherParty.display_name || otherParty.full_name}</p>
                    <p className="text-sm text-muted-foreground">{otherParty.email}</p>
                  </div>
                </div>
                <Button className="w-full bg-transparent" variant="outline" asChild>
                  <Link href={`/messages/${conversation?.id}`}>
                    <MessageSquare className="ml-2 h-4 w-4" />
                    إرسال رسالة
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Order Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>سير الطلب</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                        <CheckCircle className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <div className="h-full w-px bg-border" />
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="font-medium">تم إنشاء الطلب</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(order.created_at), "PPP p", { locale: ar })}
                      </p>
                    </div>
                  </div>

                  {order.status !== "pending" && (
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                          <CheckCircle className="h-4 w-4 text-primary-foreground" />
                        </div>
                        {order.status !== "cancelled" && <div className="h-full w-px bg-border" />}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="font-medium">قيد التنفيذ</p>
                        <p className="text-xs text-muted-foreground">البائع يعمل على طلبك</p>
                      </div>
                    </div>
                  )}

                  {order.delivered_at && (
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                          <CheckCircle className="h-4 w-4 text-primary-foreground" />
                        </div>
                        {order.status === "completed" && <div className="h-full w-px bg-border" />}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="font-medium">تم التسليم</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(order.delivered_at), "PPP p", { locale: ar })}
                        </p>
                      </div>
                    </div>
                  )}

                  {order.completed_at && (
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500">
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">اكتمل الطلب</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(order.completed_at), "PPP p", { locale: ar })}
                        </p>
                      </div>
                    </div>
                  )}

                  {order.cancelled_at && (
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500">
                          <XCircle className="h-4 w-4 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">تم الإلغاء</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(order.cancelled_at), "PPP p", { locale: ar })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

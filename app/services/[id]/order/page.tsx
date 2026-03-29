import { redirect, notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { OrderForm } from "@/components/order-form"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Package } from "lucide-react"
import Image from "next/image"

const categoryLabels: Record<string, string> = {
  design: "تصميم",
  development: "برمجة",
  writing: "كتابة",
  marketing: "تسويق",
  video: "فيديو",
  music: "موسيقى",
  business: "أعمال",
  other: "أخرى",
}

export default async function OrderServicePage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await params

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch service
  const { data: service, error } = await supabase
    .from("services")
    .select(
      `
      *,
      seller:profiles!services_seller_id_fkey(id, display_name, avatar_url)
    `,
    )
    .eq("id", id)
    .eq("status", "active")
    .single()

  if (error || !service) {
    notFound()
  }

  // Prevent seller from ordering their own service
  if (service.seller_id === user.id) {
    redirect(`/services/${id}`)
  }

  const seller = Array.isArray(service.seller) ? service.seller[0] : service.seller

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />

      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">إتمام الطلب</h1>
          <p className="text-muted-foreground">أكمل تفاصيل طلبك وقم بالدفع</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Order Form */}
          <div className="lg:col-span-2">
            <OrderForm serviceId={service.id} sellerId={service.seller_id} buyerId={user.id} price={service.price} />
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardContent className="p-6">
                <h3 className="mb-4 font-semibold">ملخص الطلب</h3>

                <div className="mb-4 flex gap-3">
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded bg-muted">
                    {service.image_url ? (
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
                    <Badge variant="secondary" className="mb-2 text-xs">
                      {categoryLabels[service.category]}
                    </Badge>
                    <p className="line-clamp-2 text-sm font-medium">{service.title}</p>
                  </div>
                </div>

                <div className="mb-4 space-y-2 border-t pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">البائع</span>
                    <span className="font-medium">{seller.display_name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">مدة التسليم</span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span className="font-medium">{service.delivery_days} أيام</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 border-t pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">سعر الخدمة</span>
                    <span className="font-medium">${service.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">رسوم المنصة (10%)</span>
                    <span className="font-medium">${(service.price * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 text-lg font-bold">
                    <span>الإجمالي</span>
                    <span className="text-primary">${(service.price * 1.1).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

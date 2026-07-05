import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Clock, Package, ShoppingCart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { ReviewList } from "@/components/review-list"

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

export default async function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await params

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch service with seller info
  const { data: service, error } = await supabase
    .from("services")
    .select(
      `
      *,
      seller:profiles!services_seller_id_fkey(id, display_name, full_name, avatar_url, bio, created_at)
    `,
    )
    .eq("id", id)
    .single()

  if (error || !service) {
    notFound()
  }

  // Only show active services to non-owners
  if (service.status !== "active" && service.seller_id !== user?.id) {
    notFound()
  }

  const seller = Array.isArray(service.seller) ? service.seller[0] : service.seller

  // Fetch seller's other services
  const { data: otherServices } = await supabase
    .from("services")
    .select("id, title, price, image_url")
    .eq("seller_id", service.seller_id)
    .eq("status", "active")
    .neq("id", id)
    .limit(3)

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Service Image */}
            <div className="relative mb-6 aspect-video w-full overflow-hidden rounded-lg bg-muted">
              {service.image_url ? (
                <Image
                  src={service.image_url || "/placeholder.svg"}
                  alt={service.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Package className="h-20 w-20 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Service Info */}
            <div className="mb-6">
              <div className="mb-4 flex items-center gap-2">
                <Badge variant="secondary">{categoryLabels[service.category]}</Badge>
                {service.status !== "active" && <Badge variant="outline">{service.status}</Badge>}
              </div>
              <h1 className="mb-4 text-3xl font-bold leading-tight">{service.title}</h1>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  {service.rating_count > 0 ? (
                    <>
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      <span className="font-medium">{service.rating_average.toFixed(1)}</span>
                      <span className="text-muted-foreground">({service.rating_count} تقييم)</span>
                    </>
                  ) : (
                    <span className="text-muted-foreground">لا توجد تقييمات بعد</span>
                  )}
                </div>
                <Separator orientation="vertical" className="h-4" />
                <span className="text-muted-foreground">{service.orders_count} طلب</span>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Description */}
            <div className="mb-6">
              <h2 className="mb-4 text-xl font-semibold">وصف الخدمة</h2>
              <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">{service.description}</p>
            </div>

            <Separator className="my-6" />

            {/* Seller Info */}
            <div>
              <h2 className="mb-4 text-xl font-semibold">عن البائع</h2>
              <Card>
                <CardContent className="flex items-start gap-4 p-6">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={seller.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback>{seller.display_name?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="mb-1 text-lg font-semibold">{seller.display_name || seller.full_name}</h3>
                    {seller.bio && <p className="mb-3 text-sm text-muted-foreground">{seller.bio}</p>}
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/seller/${seller.id}`}>عرض الملف الشخصي</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <h2 className="mb-4 text-xl font-semibold">التقييمات</h2>
              <ReviewList serviceId={service.id} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardContent className="p-6">
                <div className="mb-6">
                  <div className="mb-2 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-primary">${service.price}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>التسليم خلال {service.delivery_days} أيام</span>
                  </div>
                </div>

                {user?.id !== service.seller_id ? (
                  <Button className="w-full" size="lg" asChild>
                    <Link href={`/services/${service.id}/order`}>
                      <ShoppingCart className="ml-2 h-5 w-5" />
                      اطلب الآن
                    </Link>
                  </Button>
                ) : (
                  <Button className="w-full bg-transparent" size="lg" variant="outline" asChild>
                    <Link href={`/seller/services/${service.id}/edit`}>تعديل الخدمة</Link>
                  </Button>
                )}

                {otherServices && otherServices.length > 0 && (
                  <>
                    <Separator className="my-6" />
                    <div>
                      <h3 className="mb-4 font-semibold">خدمات أخرى من البائع</h3>
                      <div className="space-y-3">
                        {otherServices.map((otherService) => (
                          <Link
                            key={otherService.id}
                            href={`/services/${otherService.id}`}
                            className="flex gap-3 rounded-lg border p-2 transition-colors hover:bg-muted"
                          >
                            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded bg-muted">
                              {otherService.image_url ? (
                                <Image
                                  src={otherService.image_url || "/placeholder.svg"}
                                  alt={otherService.title}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center">
                                  <Package className="h-6 w-6 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 overflow-hidden">
                              <p className="mb-1 line-clamp-2 text-sm font-medium">{otherService.title}</p>
                              <p className="text-sm font-semibold text-primary">${otherService.price}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

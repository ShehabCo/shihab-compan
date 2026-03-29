import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const statusLabels: Record<string, string> = {
  draft: "مسودة",
  active: "نشط",
  paused: "متوقف",
  deleted: "محذوف",
}

const statusColors: Record<string, string> = {
  draft: "bg-gray-500/10 text-gray-500",
  active: "bg-green-500/10 text-green-500",
  paused: "bg-yellow-500/10 text-yellow-500",
  deleted: "bg-red-500/10 text-red-500",
}

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

export default async function AdminServicesPage() {
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

  // Fetch all services
  const { data: services } = await supabase
    .from("services")
    .select(
      `
      *,
      seller:profiles!services_seller_id_fkey(display_name)
    `,
    )
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold">إدارة الخدمات</h1>
            <p className="text-muted-foreground">عرض ومراجعة جميع الخدمات على المنصة</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/admin">العودة للوحة التحكم</Link>
          </Button>
        </div>

        {services && services.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const seller = Array.isArray(service.seller) ? service.seller[0] : service.seller

              return (
                <Card key={service.id} className="overflow-hidden">
                  <div className="relative aspect-video w-full overflow-hidden bg-muted">
                    {service.image_url ? (
                      <Image
                        src={service.image_url || "/placeholder.svg"}
                        alt={service.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Package className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute left-2 top-2">
                      <Badge className={statusColors[service.status]}>{statusLabels[service.status]}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="mb-2">
                      <Badge variant="outline" className="text-xs">
                        {categoryLabels[service.category]}
                      </Badge>
                    </div>
                    <h3 className="mb-2 line-clamp-2 font-semibold">{service.title}</h3>
                    <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">{service.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">البائع: {seller?.display_name}</span>
                      <span className="font-bold text-primary">${service.price}</span>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button variant="outline" size="sm" asChild className="flex-1 bg-transparent">
                        <Link href={`/services/${service.id}`}>عرض</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="flex min-h-[400px] items-center justify-center py-12">
              <p className="text-muted-foreground">لا توجد خدمات بعد</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

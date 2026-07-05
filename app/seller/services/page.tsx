import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Eye } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const statusLabels: Record<string, string> = {
  draft: "مسودة",
  active: "نشط",
  paused: "متوقف",
  deleted: "محذوف",
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

export default async function SellerServicesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user is a seller
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (profile?.role !== "seller") {
    redirect("/dashboard")
  }

  // Fetch seller's services
  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("seller_id", user.id)
    .neq("status", "deleted")
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold">خدماتي</h1>
            <p className="text-muted-foreground">إدارة وتعديل خدماتك</p>
          </div>
          <Button asChild>
            <Link href="/seller/services/new">
              <Plus className="ml-2 h-4 w-4" />
              إضافة خدمة جديدة
            </Link>
          </Button>
        </div>

        {services && services.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
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
                      <span className="text-4xl text-muted-foreground">📦</span>
                    </div>
                  )}
                  <div className="absolute left-2 top-2">
                    <Badge variant={service.status === "active" ? "default" : "secondary"}>
                      {statusLabels[service.status]}
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <div className="mb-2">
                    <Badge variant="outline" className="text-xs">
                      {categoryLabels[service.category]}
                    </Badge>
                  </div>
                  <CardTitle className="line-clamp-2">{service.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <p className="text-muted-foreground">السعر</p>
                      <p className="text-lg font-bold text-primary">${service.price}</p>
                    </div>
                    <div className="text-left">
                      <p className="text-muted-foreground">المشاهدات</p>
                      <p className="font-semibold">{service.views_count}</p>
                    </div>
                    <div className="text-left">
                      <p className="text-muted-foreground">الطلبات</p>
                      <p className="font-semibold">{service.orders_count}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2 border-t pt-4">
                  <Button variant="outline" size="sm" asChild className="flex-1 bg-transparent">
                    <Link href={`/services/${service.id}`}>
                      <Eye className="ml-2 h-4 w-4" />
                      معاينة
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild className="flex-1 bg-transparent">
                    <Link href={`/seller/services/${service.id}/edit`}>
                      <Edit className="ml-2 h-4 w-4" />
                      تعديل
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex min-h-[400px] flex-col items-center justify-center py-12">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <Plus className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">لا توجد خدمات بعد</h3>
              <p className="mb-6 text-center text-muted-foreground">ابدأ بإضافة خدمتك الأولى وابدأ في تلقي الطلبات</p>
              <Button asChild>
                <Link href="/seller/services/new">
                  <Plus className="ml-2 h-4 w-4" />
                  إضافة خدمة جديدة
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

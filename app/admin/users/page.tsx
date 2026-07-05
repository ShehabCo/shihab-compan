import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { format } from "date-fns"
import { ar } from "date-fns/locale"

const roleLabels: Record<string, string> = {
  buyer: "مشتري",
  seller: "بائع",
  admin: "مدير",
}

const roleColors: Record<string, string> = {
  buyer: "bg-blue-500/10 text-blue-500",
  seller: "bg-green-500/10 text-green-500",
  admin: "bg-purple-500/10 text-purple-500",
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; role?: string }>
}) {
  const supabase = await createClient()
  const params = await searchParams

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

  // Build query
  let query = supabase.from("profiles").select("*").order("created_at", { ascending: false })

  if (params.search) {
    query = query.or(`display_name.ilike.%${params.search}%,email.ilike.%${params.search}%`)
  }

  if (params.role) {
    query = query.eq("role", params.role)
  }

  const { data: users } = await query

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold">إدارة المستخدمين</h1>
            <p className="text-muted-foreground">عرض وإدارة جميع مستخدمي المنصة</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/admin">العودة للوحة التحكم</Link>
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 md:flex-row">
              <Input placeholder="البحث بالاسم أو البريد الإلكتروني..." className="md:max-w-sm" />
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  الكل
                </Button>
                <Button variant="outline" size="sm">
                  مشترين
                </Button>
                <Button variant="outline" size="sm">
                  بائعين
                </Button>
                <Button variant="outline" size="sm">
                  مدراء
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        {users && users.length > 0 ? (
          <div className="space-y-4">
            {users.map((userProfile) => (
              <Card key={userProfile.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={userProfile.avatar_url || "/placeholder.svg"} />
                        <AvatarFallback>{userProfile.display_name?.[0] || "U"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="mb-1 flex items-center gap-2">
                          <p className="font-semibold">{userProfile.display_name || userProfile.full_name}</p>
                          <Badge className={roleColors[userProfile.role]}>{roleLabels[userProfile.role]}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{userProfile.email}</p>
                        {userProfile.bio && <p className="mt-1 text-sm text-muted-foreground">{userProfile.bio}</p>}
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-muted-foreground">
                        انضم {format(new Date(userProfile.created_at), "PPP", { locale: ar })}
                      </p>
                      <div className="mt-2 flex gap-2">
                        <Button variant="outline" size="sm">
                          عرض الملف
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex min-h-[400px] items-center justify-center py-12">
              <p className="text-muted-foreground">لم يتم العثور على مستخدمين</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

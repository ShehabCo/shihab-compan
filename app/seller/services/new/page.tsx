import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { ServiceForm } from "@/components/service-form"

export default async function NewServicePage() {
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />

      <div className="container mx-auto max-w-3xl px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">إضافة خدمة جديدة</h1>
          <p className="text-muted-foreground">املأ التفاصيل لإنشاء خدمتك</p>
        </div>

        <ServiceForm userId={user.id} />
      </div>
    </div>
  )
}

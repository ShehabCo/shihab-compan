import { redirect, notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { ServiceForm } from "@/components/service-form"

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await params

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

  // Fetch service
  const { data: service, error } = await supabase
    .from("services")
    .select("*")
    .eq("id", id)
    .eq("seller_id", user.id)
    .single()

  if (error || !service) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />

      <div className="container mx-auto max-w-3xl px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">تعديل الخدمة</h1>
          <p className="text-muted-foreground">قم بتحديث تفاصيل خدمتك</p>
        </div>

        <ServiceForm userId={user.id} service={service} />
      </div>
    </div>
  )
}

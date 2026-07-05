import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { ServiceCard } from "@/components/service-card"
import { CategoryFilter } from "@/components/category-filter"
import { Search } from "lucide-react"

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>
}) {
  const supabase = await createClient()
  const params = await searchParams

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Build search query
  let query = supabase
    .from("services")
    .select(
      `
      *,
      seller:profiles!services_seller_id_fkey(display_name, avatar_url)
    `,
    )
    .eq("status", "active")

  // Apply text search if query exists
  if (params.q) {
    query = query.or(`title.ilike.%${params.q}%,description.ilike.%${params.q}%`)
  }

  // Apply category filter
  if (params.category && params.category !== "all") {
    query = query.eq("category", params.category)
  }

  query = query.order("created_at", { ascending: false })

  const { data: services } = await query

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />

      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="mb-4 text-3xl font-bold">{params.q ? `نتائج البحث عن "${params.q}"` : "استكشف الخدمات"}</h1>
          <p className="text-muted-foreground">
            {services ? `تم العثور على ${services.length} خدمة` : "جاري البحث..."}
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <CategoryFilter />
        </div>

        {/* Services Grid */}
        {services && services.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={{
                  ...service,
                  seller: Array.isArray(service.seller) ? service.seller[0] : service.seller,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <Search className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
              <h3 className="mb-2 text-xl font-semibold">لم يتم العثور على نتائج</h3>
              <p className="text-muted-foreground">جرب البحث بكلمات مختلفة أو تصفح الفئات</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

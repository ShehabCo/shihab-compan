import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, TrendingUp } from "lucide-react"
import { format } from "date-fns"
import { ar } from "date-fns/locale"
import Link from "next/link"

export default async function SellerReviewsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch seller profile
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (profile?.role !== "seller" && profile?.role !== "admin") {
    redirect("/dashboard")
  }

  // Fetch all reviews for seller's services
  const { data: reviews } = await supabase
    .from("reviews")
    .select(
      `
      *,
      buyer:profiles!reviews_buyer_id_fkey(display_name, full_name, avatar_url),
      service:services(id, title, image_url)
    `,
    )
    .eq("seller_id", user.id)
    .order("created_at", { ascending: false })

  // Calculate statistics
  const totalReviews = reviews?.length || 0
  const averageRating = totalReviews > 0 ? reviews!.reduce((sum, r) => sum + r.rating, 0) / totalReviews : 0

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews?.filter((r) => r.rating === rating).length || 0,
  }))

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">التقييمات</h1>
          <p className="text-muted-foreground">جميع التقييمات التي حصلت عليها من المشترين</p>
        </div>

        <div className="mb-8 grid gap-6 md:grid-cols-2">
          {/* Overall Rating */}
          <Card>
            <CardHeader>
              <CardTitle>التقييم الإجمالي</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="mb-2 text-4xl font-bold text-primary">{averageRating.toFixed(1)}</div>
                  <div className="flex justify-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= Math.round(averageRating)
                            ? "fill-primary text-primary"
                            : "fill-muted text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{totalReviews} تقييم</p>
                </div>
                <div className="flex-1 space-y-2">
                  {ratingDistribution.map(({ rating, count }) => (
                    <div key={rating} className="flex items-center gap-2">
                      <span className="w-12 text-sm">{rating} نجوم</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${totalReviews > 0 ? (count / totalReviews) * 100 : 0}%` }}
                        />
                      </div>
                      <span className="w-8 text-sm text-muted-foreground">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Trend */}
          <Card>
            <CardHeader>
              <CardTitle>الأداء</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalReviews}</p>
                  <p className="text-sm text-muted-foreground">إجمالي التقييمات</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reviews List */}
        <div>
          <h2 className="mb-4 text-xl font-semibold">جميع التقييمات</h2>
          {reviews && reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => {
                const buyer = Array.isArray(review.buyer) ? review.buyer[0] : review.buyer
                const service = Array.isArray(review.service) ? review.service[0] : review.service

                return (
                  <Card key={review.id}>
                    <CardContent className="p-6">
                      <div className="mb-4 flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={buyer.avatar_url || "/placeholder.svg"} />
                            <AvatarFallback>{buyer.display_name?.[0] || "U"}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{buyer.display_name || buyer.full_name}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(review.created_at), "PPP", { locale: ar })}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating ? "fill-primary text-primary" : "fill-muted text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      {review.comment && <p className="mb-3 leading-relaxed text-muted-foreground">{review.comment}</p>}
                      <Link
                        href={`/services/${service.id}`}
                        className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        <span>الخدمة: {service.title}</span>
                      </Link>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">لا توجد تقييمات بعد</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

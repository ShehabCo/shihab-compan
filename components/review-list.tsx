import { createClient } from "@/lib/supabase/server"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import { format } from "date-fns"
import { ar } from "date-fns/locale"

interface ReviewListProps {
  serviceId: string
}

export async function ReviewList({ serviceId }: ReviewListProps) {
  const supabase = await createClient()

  const { data: reviews } = await supabase
    .from("reviews")
    .select(
      `
      *,
      buyer:profiles!reviews_buyer_id_fkey(display_name, full_name, avatar_url)
    `,
    )
    .eq("service_id", serviceId)
    .order("created_at", { ascending: false })

  if (!reviews || reviews.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-muted-foreground">لا توجد تقييمات بعد</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => {
        const buyer = Array.isArray(review.buyer) ? review.buyer[0] : review.buyer

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
              {review.comment && <p className="leading-relaxed text-muted-foreground">{review.comment}</p>}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

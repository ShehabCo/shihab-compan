import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface ServiceCardProps {
  service: {
    id: string
    title: string
    description: string
    price: number
    delivery_days: number
    image_url?: string
    category: string
    rating_average: number
    rating_count: number
    seller: {
      display_name: string
      avatar_url?: string
    }
  }
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

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Link href={`/services/${service.id}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg hover:border-primary/50">
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          {service.image_url ? (
            <Image
              src={service.image_url || "/placeholder.svg"}
              alt={service.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-4xl text-muted-foreground">📦</span>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <div className="mb-2 flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {categoryLabels[service.category] || service.category}
            </Badge>
          </div>
          <h3 className="mb-2 line-clamp-2 text-lg font-semibold leading-tight group-hover:text-primary transition-colors">
            {service.title}
          </h3>
          <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">{service.description}</p>
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1">
              {service.rating_count > 0 ? (
                <>
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span className="font-medium">{service.rating_average.toFixed(1)}</span>
                  <span className="text-muted-foreground">({service.rating_count})</span>
                </>
              ) : (
                <span className="text-muted-foreground">لا توجد تقييمات</span>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t p-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
              {service.seller.avatar_url ? (
                <Image
                  src={service.seller.avatar_url || "/placeholder.svg"}
                  alt={service.seller.display_name}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              ) : (
                <span className="text-sm">👤</span>
              )}
            </div>
            <span className="text-sm text-muted-foreground">{service.seller.display_name}</span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-lg font-bold text-primary">${service.price}</span>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{service.delivery_days} أيام</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Star } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ReviewFormProps {
  orderId: string
  serviceId: string
  sellerId: string
}

export function ReviewForm({ orderId, serviceId, sellerId }: ReviewFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار تقييم",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const supabase = createClient()

      // Create review
      const { error: reviewError } = await supabase.from("reviews").insert({
        order_id: orderId,
        service_id: serviceId,
        seller_id: sellerId,
        rating,
        comment: comment.trim() || null,
      })

      if (reviewError) throw reviewError

      toast({
        title: "تم إرسال التقييم",
        description: "شكراً لك على تقييمك",
      })

      router.refresh()
    } catch (error) {
      console.error("Error submitting review:", error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إرسال التقييم",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label className="mb-2 block">التقييم</Label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="transition-transform hover:scale-110"
            >
              <Star
                className={`h-8 w-8 ${
                  star <= (hoveredRating || rating) ? "fill-primary text-primary" : "fill-muted text-muted-foreground"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="comment">التعليق (اختياري)</Label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="شارك تجربتك مع هذه الخدمة..."
          rows={4}
          className="resize-none"
        />
      </div>

      <Button type="submit" disabled={isSubmitting || rating === 0} className="w-full">
        {isSubmitting ? "جاري الإرسال..." : "إرسال التقييم"}
      </Button>
    </form>
  )
}

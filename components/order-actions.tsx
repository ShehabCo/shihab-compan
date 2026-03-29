"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, Upload, CheckCircle, Star } from "lucide-react"
import Link from "next/link"

interface OrderActionsProps {
  order: {
    id: string
    status: string
    seller_id: string
    buyer_id: string
    price: number
  }
  isSeller: boolean
}

export function OrderActions({ order, isSeller }: OrderActionsProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deliveryNote, setDeliveryNote] = useState("")

  const handleDeliver = async () => {
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const { error: updateError } = await supabase
        .from("orders")
        .update({
          status: "delivered",
          delivery_note: deliveryNote || null,
          delivered_at: new Date().toISOString(),
        })
        .eq("id", order.id)

      if (updateError) throw updateError

      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "حدث خطأ ما")
    } finally {
      setIsLoading(false)
    }
  }

  const handleComplete = async () => {
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      // Update order status
      const { error: updateError } = await supabase
        .from("orders")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
        })
        .eq("id", order.id)

      if (updateError) throw updateError

      // Move pending balance to available balance for seller
      const { data: wallet } = await supabase.from("wallets").select("id").eq("user_id", order.seller_id).single()

      if (wallet) {
        // Calculate seller amount (after 10% commission)
        const sellerAmount = order.price * 0.9

        await supabase.rpc("complete_order_payment", {
          wallet_id: wallet.id,
          amount: sellerAmount,
        })

        // Update transaction status
        await supabase
          .from("wallet_transactions")
          .update({ status: "completed" })
          .eq("order_id", order.id)
          .eq("type", "earning")
      }

      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "حدث خطأ ما")
    } finally {
      setIsLoading(false)
    }
  }

  // Seller can deliver when order is in_progress
  if (isSeller && order.status === "in_progress") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            تسليم الطلب
          </CardTitle>
          <CardDescription>قم بتسليم العمل المكتمل للمشتري</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="delivery-note">ملاحظة التسليم (اختياري)</Label>
            <Textarea
              id="delivery-note"
              placeholder="أضف أي ملاحظات أو تعليمات للمشتري..."
              rows={4}
              value={deliveryNote}
              onChange={(e) => setDeliveryNote(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button onClick={handleDeliver} disabled={isLoading} className="w-full">
            {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
            تسليم الطلب
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Buyer can complete when order is delivered
  if (!isSeller && order.status === "delivered") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            قبول التسليم
          </CardTitle>
          <CardDescription>راجع العمل المسلم وأكد استلامه</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            بقبولك للتسليم، سيتم تحويل المبلغ إلى البائع ولن تتمكن من طلب تعديلات
          </p>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button onClick={handleComplete} disabled={isLoading} className="w-full">
            {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
            قبول وإتمام الطلب
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Buyer can review when order is completed
  if (!isSeller && order.status === "completed") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            تقييم الخدمة
          </CardTitle>
          <CardDescription>شارك تجربتك مع الآخرين</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href={`/orders/${order.id}/review`}>إضافة تقييم</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return null
}

"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CreditCard } from "lucide-react"

interface OrderFormProps {
  serviceId: string
  sellerId: string
  buyerId: string
  price: number
}

export function OrderForm({ serviceId, sellerId, buyerId, price }: OrderFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [requirements, setRequirements] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          service_id: serviceId,
          buyer_id: buyerId,
          seller_id: sellerId,
          price: price,
          requirements: requirements || null,
          status: "pending",
        })
        .select()
        .single()

      if (orderError) throw orderError

      // In a real app, this would integrate with Stripe or another payment gateway
      // For now, we'll simulate a successful payment

      // Update order status to in_progress after "payment"
      const { error: updateError } = await supabase.from("orders").update({ status: "in_progress" }).eq("id", order.id)

      if (updateError) throw updateError

      // Create wallet transaction for seller (pending)
      const { data: wallet } = await supabase.from("wallets").select("id").eq("user_id", sellerId).single()

      if (wallet) {
        // Calculate commission (10%)
        const commission = price * 0.1
        const sellerAmount = price - commission

        await supabase.from("wallet_transactions").insert({
          wallet_id: wallet.id,
          order_id: order.id,
          type: "earning",
          amount: sellerAmount,
          status: "pending",
          description: `أرباح من الطلب #${order.id.slice(0, 8)}`,
        })

        // Update wallet pending balance
        await supabase.rpc("increment_pending_balance", {
          wallet_id: wallet.id,
          amount: sellerAmount,
        })
      }

      // Redirect to order details
      router.push(`/orders/${order.id}`)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "حدث خطأ ما")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>متطلبات الطلب</CardTitle>
          <CardDescription>أخبر البائع بتفاصيل ما تحتاجه بالضبط</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="requirements">التفاصيل والمتطلبات</Label>
            <Textarea
              id="requirements"
              placeholder="اشرح بالتفصيل ما تحتاجه من البائع..."
              rows={6}
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">كلما كانت التفاصيل أوضح، كانت النتيجة أفضل</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>معلومات الدفع</CardTitle>
          <CardDescription>اختر طريقة الدفع المناسبة</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 rounded-lg border-2 border-primary bg-primary/5 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                <CreditCard className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <p className="font-semibold">الدفع الآمن</p>
                <p className="text-sm text-muted-foreground">سيتم حماية أموالك حتى استلام الطلب</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-destructive bg-destructive/10 p-3">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
            {isLoading && <Loader2 className="ml-2 h-5 w-5 animate-spin" />}
            تأكيد الطلب والدفع ${(price * 1.1).toFixed(2)}
          </Button>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            بالنقر على "تأكيد الطلب"، أنت توافق على شروط الخدمة وسياسة الاسترداد
          </p>
        </CardContent>
      </Card>
    </form>
  )
}

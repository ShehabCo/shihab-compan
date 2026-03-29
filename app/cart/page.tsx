"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Trash2, Plus, Minus, Percent, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface CartItem {
  dishId: number
  quantity: number
  dish: {
    id: number
    name: string
    price: number
    image: string
  }
}

const allDishes = [
  { id: 1, name: "كبسة الدجاج", price: 4500, image: "/placeholder.svg" },
  { id: 2, name: "مندي الضأن", price: 5500, image: "/placeholder.svg" },
  { id: 3, name: "محشي", price: 3800, image: "/placeholder.svg" },
]

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loyaltyOrders, setLoyaltyOrders] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const authToken = localStorage.getItem("authToken")
    if (!authToken) {
      router.push("/auth/login")
      return
    }

    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }

    const savedLoyalty = localStorage.getItem("loyaltyOrders")
    if (savedLoyalty) {
      setLoyaltyOrders(Number.parseInt(savedLoyalty))
    }

    setIsLoading(false)
  }, [router])

  const updateQuantity = (dishId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(dishId)
      return
    }
    const updated = cartItems.map((item) => (item.dishId === dishId ? { ...item, quantity: newQuantity } : item))
    setCartItems(updated)
    localStorage.setItem("cart", JSON.stringify(updated))
  }

  const removeItem = (dishId: number) => {
    const updated = cartItems.filter((item) => item.dishId !== dishId)
    setCartItems(updated)
    localStorage.setItem("cart", JSON.stringify(updated))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.dish?.price || 0) * item.quantity, 0)
  const isEligibleForDiscount = loyaltyOrders > 0 && loyaltyOrders % 3 === 0
  const deliveryFee = isEligibleForDiscount ? 0 : 500
  const total = subtotal + deliveryFee

  const handleCheckout = async () => {
    setIsLoading(true)
    try {
      const newLoyaltyCount = loyaltyOrders + 1
      localStorage.setItem("loyaltyOrders", newLoyaltyCount.toString())
      localStorage.setItem("cart", JSON.stringify([]))

      setCartItems([])
      router.push(`/order-confirmation?orderId=${Date.now()}`)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isLoading && cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="container mx-auto px-4 py-12">
          <Card className="border-amber-600/30 bg-slate-900/50 backdrop-blur max-w-md mx-auto">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-6xl mb-4">🛒</div>
              <h2 className="text-2xl font-bold text-amber-50 mb-2">السلة فارغة</h2>
              <p className="text-amber-100/70 text-center mb-6">لم تضف أي أطباق بعد. استكشف القائمة الآن!</p>
              <Button asChild className="bg-amber-600 hover:bg-amber-700 text-black">
                <Link href="/menu" className="flex gap-2">
                  استكشف القائمة
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-amber-50 mb-8">سلتك</h1>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.dishId} className="border-amber-600/30 bg-slate-900/50 backdrop-blur">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                      <Image
                        src={item.dish?.image || "/placeholder.svg"}
                        alt={item.dish?.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-amber-50">{item.dish?.name}</h3>
                      <p className="text-amber-400 font-bold">{((item.dish?.price || 0) / 1000).toFixed(1)} ر.ي</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2 bg-amber-600/20 rounded-lg border border-amber-600/30">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateQuantity(item.dishId, item.quantity - 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center text-amber-50">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateQuantity(item.dishId, item.quantity + 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.dishId)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="border-amber-600/30 bg-slate-900/50 backdrop-blur sticky top-20">
              <CardHeader>
                <CardTitle className="text-amber-50">ملخص الطلب</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Loyalty Status */}
                <div className="bg-amber-600/20 border border-amber-600/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-amber-100">حالة الولاء</span>
                    <Badge className="bg-amber-600 text-black">{loyaltyOrders % 3} / 3</Badge>
                  </div>
                  <div className="w-full bg-amber-600/20 rounded-full h-2">
                    <div
                      className="bg-amber-600 h-2 rounded-full transition-all"
                      style={{ width: `${((loyaltyOrders % 3) / 3) * 100}%` }}
                    />
                  </div>
                  {isEligibleForDiscount && (
                    <div className="mt-3 flex items-center gap-2 text-amber-400 text-sm font-bold">
                      <Percent className="h-4 w-4" />
                      رسوم التوصيل مجانية!
                    </div>
                  )}
                </div>

                <Separator className="bg-amber-600/20" />

                {/* Price Breakdown */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-amber-100">
                    <span>المجموع الفرعي</span>
                    <span>{(subtotal / 1000).toFixed(2)} ر.ي</span>
                  </div>
                  <div className="flex justify-between text-amber-100">
                    <span>رسوم التوصيل</span>
                    <span className={isEligibleForDiscount ? "text-amber-400 line-through" : ""}>
                      {isEligibleForDiscount ? "مجاني" : `${(deliveryFee / 1000).toFixed(2)} ر.ي`}
                    </span>
                  </div>
                </div>

                <Separator className="bg-amber-600/20" />

                <div className="flex justify-between font-bold text-lg text-amber-400">
                  <span>الإجمالي</span>
                  <span>{(total / 1000).toFixed(2)} ر.ي</span>
                </div>

                <Button
                  onClick={handleCheckout}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-black font-bold"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? "جاري المعالجة..." : "تأكيد الطلب"}
                </Button>

                <p className="text-xs text-amber-100/60 text-center">
                  {isEligibleForDiscount
                    ? "🎉 كل طلبك الرابع مجاني!"
                    : `${3 - (loyaltyOrders % 3)} طلبات متبقية للحصول على خصم`}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

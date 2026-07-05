"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Truck, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"

interface OrderTracking {
  id: string
  status: "pending" | "preparing" | "out_for_delivery" | "delivered"
  estimatedDelivery: string
  driverName?: string
  driverPhone?: string
  currentLocation?: { lat: number; lng: number }
  stops?: { id: string; address: string; completed: boolean }[]
  timeline: { stage: string; completed: boolean; timestamp?: string }[]
}

const statusStages = [
  { key: "pending", label: "قيد الانتظار", icon: Clock },
  { key: "preparing", label: "تحضير الطلب", icon: Truck },
  { key: "out_for_delivery", label: "في الطريق", icon: MapPin },
  { key: "delivered", label: "تم التسليم", icon: CheckCircle },
]

const statusColors = {
  pending: "bg-yellow-500",
  preparing: "bg-blue-500",
  out_for_delivery: "bg-purple-500",
  delivered: "bg-green-500",
}

export default function OrderTrackingPage({ params }: { params: Promise<{ orderId: string }> }) {
  const [order, setOrder] = useState<OrderTracking | null>(null)
  const [loading, setLoading] = useState(true)
  const [params_resolved, setParamsResolved] = useState<{ orderId: string } | null>(null)

  useEffect(() => {
    params.then((p) => setParamsResolved(p))
  }, [params])

  useEffect(() => {
    if (!params_resolved) return

    // Simulate fetching order tracking data
    const mockOrder: OrderTracking = {
      id: params_resolved.orderId,
      status: "out_for_delivery",
      estimatedDelivery: "في خلال 15 دقيقة",
      driverName: "أحمد محمد",
      driverPhone: "+967771234567",
      stops: [
        { id: "1", address: "صنعاء - شارع النيل", completed: true },
        { id: "2", address: "صنعاء - شارع البحر", completed: true },
        { id: "3", address: "صنعاء - شارع السدة", completed: false },
        { id: "4", address: "صنعاء - شارع القاهرة", completed: false },
      ],
      timeline: [
        { stage: "تم تأكيد الطلب", completed: true, timestamp: "10:30 صباحاً" },
        { stage: "بدء التحضير", completed: true, timestamp: "10:35 صباحاً" },
        { stage: "اكتمل التحضير", completed: true, timestamp: "10:50 صباحاً" },
        { stage: "في الطريق", completed: true, timestamp: "11:00 صباحاً" },
        { stage: "التسليم المتوقع", completed: false, timestamp: "11:15 صباحاً" },
      ],
    }

    setOrder(mockOrder)
    setLoading(false)
  }, [params_resolved])

  if (loading || !order) {
    return <div className="flex items-center justify-center min-h-screen">جاري التحميل...</div>
  }

  const statusIndex = statusStages.findIndex((s) => s.key === order.status)
  const progress = ((statusIndex + 1) / statusStages.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-amber-950/5 to-black">
      <div className="container mx-auto px-4 py-8">
        <Link href="/orders" className="text-amber-400 hover:text-amber-300 mb-6 inline-block">
          العودة إلى الطلبات
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Tracking */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <Card className="border-amber-600/30 bg-black/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-amber-50">حالة الطلب</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-amber-100">{order.estimatedDelivery}</span>
                    <Badge className={`${statusColors[order.status]} text-white`}>
                      {statusStages.find((s) => s.key === order.status)?.label}
                    </Badge>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                {/* Status Timeline */}
                <div className="space-y-4">
                  {statusStages.map((stage, index) => {
                    const isActive = index <= statusIndex
                    const Icon = stage.icon
                    return (
                      <div key={stage.key} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full ${
                              isActive ? "bg-amber-600" : "bg-amber-600/30"
                            }`}
                          >
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          {index < statusStages.length - 1 && (
                            <div className={`h-12 w-px ${isActive ? "bg-amber-600" : "bg-amber-600/30"}`} />
                          )}
                        </div>
                        <div className="flex-1 pt-2">
                          <p className={`font-medium ${isActive ? "text-amber-50" : "text-amber-100/60"}`}>
                            {stage.label}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Driver Info */}
            {order.status === "out_for_delivery" && (
              <Card className="border-amber-600/30 bg-black/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-amber-50">معلومات السائق</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-amber-600/10 border border-amber-600/30">
                      <div>
                        <p className="font-bold text-amber-50">{order.driverName}</p>
                        <p className="text-sm text-amber-100/70">سائق توصيل</p>
                      </div>
                      <Button
                        variant="outline"
                        className="border-amber-600/30 text-amber-400 hover:text-amber-300 bg-transparent"
                        asChild
                      >
                        <a href={`tel:${order.driverPhone}`}>
                          <Phone className="h-4 w-4 ml-2" />
                          اتصل
                        </a>
                      </Button>
                    </div>

                    {/* Delivery Stops */}
                    <div>
                      <p className="font-medium text-amber-50 mb-3">محطات التوصيل</p>
                      <div className="space-y-2">
                        {order.stops?.map((stop, index) => (
                          <div
                            key={stop.id}
                            className={`flex items-center gap-3 p-3 rounded-lg border ${
                              stop.completed
                                ? "bg-green-500/10 border-green-500/30"
                                : "bg-amber-600/10 border-amber-600/30"
                            }`}
                          >
                            <div className="flex-shrink-0">
                              <div
                                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                                  stop.completed ? "bg-green-500 text-white" : "bg-amber-600 text-black"
                                }`}
                              >
                                {index + 1}
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className={stop.completed ? "text-green-400 line-through" : "text-amber-100"}>
                                {stop.address}
                              </p>
                            </div>
                            {stop.completed && <CheckCircle className="h-5 w-5 text-green-500" />}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Timeline */}
            <Card className="border-amber-600/30 bg-black/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-amber-50">سجل الأنشطة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {order.timeline.map((event, index) => (
                    <div
                      key={index}
                      className={`flex gap-3 pb-3 ${index !== order.timeline.length - 1 ? "border-b border-amber-600/20" : ""}`}
                    >
                      <div className="flex-shrink-0">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full ${
                            event.completed ? "bg-green-500" : "bg-amber-600/30"
                          }`}
                        >
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="text-amber-50">{event.stage}</p>
                        <p className="text-xs text-amber-100/60">{event.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Map Placeholder */}
          <div className="lg:col-span-1">
            <Card className="border-amber-600/30 bg-black/50 backdrop-blur sticky top-20">
              <CardHeader>
                <CardTitle className="text-amber-50">الموقع الحالي</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full h-80 rounded-lg bg-amber-950/30 border border-amber-600/30 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-amber-600 mx-auto mb-2" />
                    <p className="text-amber-100/70 text-sm">الخريطة قيد التطوير</p>
                    <p className="text-xs text-amber-100/50 mt-1">الموقع الحالي: صنعاء - شارع البحر</p>
                  </div>
                </div>

                <div className="mt-4 p-4 rounded-lg bg-amber-600/10 border border-amber-600/30">
                  <p className="text-xs text-amber-100/70 mb-2">المسافة المتبقية:</p>
                  <p className="text-xl font-bold text-amber-400">2.5 كم</p>
                  <p className="text-xs text-amber-100/60 mt-1">حوالي 15 دقيقة</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

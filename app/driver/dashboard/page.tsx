"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Navigation } from "lucide-react"

interface BatchedOrder {
  id: string
  customer: string
  address: string
  neighborhood: string
  items: number
  status: "pending" | "completed"
  distance?: string
}

interface NeighborhoodBatch {
  neighborhood: string
  count: number
  totalDistance: string
  orders: BatchedOrder[]
}

export default function DriverDashboard() {
  const [batches, setBatches] = useState<NeighborhoodBatch[]>([])
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading batched orders
    const mockBatches: NeighborhoodBatch[] = [
      {
        neighborhood: "صنعاء - حي الروضة",
        count: 4,
        totalDistance: "3.2 كم",
        orders: [
          {
            id: "ORD001",
            customer: "أحمد محمد",
            address: "شارع النيل، العمارة 5",
            neighborhood: "صنعاء - حي الروضة",
            items: 1,
            status: "pending",
            distance: "0.5 كم",
          },
          {
            id: "ORD002",
            customer: "فاطمة علي",
            address: "شارع الجمهورية، المجمع التجاري",
            neighborhood: "صنعاء - حي الروضة",
            items: 1,
            status: "pending",
            distance: "1.2 كم",
          },
          {
            id: "ORD003",
            customer: "محمد سالم",
            address: "شارع البحر، الفيلا 10",
            neighborhood: "صنعاء - حي الروضة",
            items: 2,
            status: "completed",
          },
          {
            id: "ORD004",
            customer: "سارة حسن",
            address: "شارع السدة، المحطة",
            neighborhood: "صنعاء - حي الروضة",
            items: 1,
            status: "pending",
            distance: "1.5 كم",
          },
        ],
      },
      {
        neighborhood: "صنعاء - حي السبعين",
        count: 3,
        totalDistance: "2.8 كم",
        orders: [
          {
            id: "ORD005",
            customer: "علي حمادة",
            address: "شارع القاهرة، البناء الأول",
            neighborhood: "صنعاء - حي السبعين",
            items: 1,
            status: "pending",
            distance: "1.1 كم",
          },
          {
            id: "ORD006",
            customer: "ليلى محمود",
            address: "شارع الجيش، البيت الأزرق",
            neighborhood: "صنعاء - حي السبعين",
            items: 1,
            status: "pending",
            distance: "1.0 كم",
          },
          {
            id: "ORD007",
            customer: "عمر خالد",
            address: "شارع الثورة، المكتب التجاري",
            neighborhood: "صنعاء - حي السبعين",
            items: 1,
            status: "pending",
            distance: "0.7 كم",
          },
        ],
      },
    ]

    setBatches(mockBatches)
    setSelectedBatch(mockBatches[0].neighborhood)
    setLoading(false)
  }, [])

  const currentBatch = batches.find((b) => b.neighborhood === selectedBatch)
  const completedOrders = currentBatch?.orders.filter((o) => o.status === "completed").length || 0
  const pendingOrders = currentBatch?.orders.filter((o) => o.status === "pending").length || 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-amber-950/5 to-black">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-amber-50 mb-8">لوحة تحكم السائق</h1>

        <div className="grid gap-8 lg:grid-cols-4">
          {/* Batches List */}
          <div className="lg:col-span-1">
            <Card className="border-amber-600/30 bg-black/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-amber-50">الدفعات</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {batches.map((batch) => {
                  const isSelected = batch.neighborhood === selectedBatch
                  return (
                    <Button
                      key={batch.neighborhood}
                      variant={isSelected ? "default" : "outline"}
                      className={`w-full justify-start text-left h-auto py-3 ${
                        isSelected
                          ? "bg-amber-600 hover:bg-amber-700 text-black"
                          : "border-amber-600/30 text-amber-100 hover:border-amber-600/50"
                      }`}
                      onClick={() => setSelectedBatch(batch.neighborhood)}
                    >
                      <div className="flex-1">
                        <p className="font-medium">{batch.neighborhood}</p>
                        <p className="text-xs opacity-70">{batch.count} طلب</p>
                      </div>
                      <Badge className="bg-amber-600 text-black">{batch.count}</Badge>
                    </Button>
                  )
                })}
              </CardContent>
            </Card>
          </div>

          {/* Batch Details */}
          <div className="lg:col-span-3 space-y-6">
            {currentBatch && (
              <>
                {/* Stats */}
                <div className="grid gap-4 md:grid-cols-3">
                  <Card className="border-amber-600/30 bg-black/50 backdrop-blur">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-amber-100/70 text-sm mb-1">إجمالي الطلبات</p>
                        <p className="text-3xl font-bold text-amber-400">{currentBatch.count}</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-amber-600/30 bg-black/50 backdrop-blur">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-amber-100/70 text-sm mb-1">مكتملة</p>
                        <p className="text-3xl font-bold text-green-500">{completedOrders}</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-amber-600/30 bg-black/50 backdrop-blur">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-amber-100/70 text-sm mb-1">المسافة الإجمالية</p>
                        <p className="text-2xl font-bold text-amber-400">{currentBatch.totalDistance}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Orders List */}
                <Card className="border-amber-600/30 bg-black/50 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-amber-50">الطلبات في هذه الدفعة</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {currentBatch.orders.map((order, index) => (
                        <div
                          key={order.id}
                          className={`flex items-center gap-3 p-4 rounded-lg border ${
                            order.status === "completed"
                              ? "bg-green-500/10 border-green-500/30"
                              : "bg-amber-600/10 border-amber-600/30"
                          }`}
                        >
                          {/* Stop Number */}
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold flex-shrink-0 ${
                              order.status === "completed" ? "bg-green-500 text-white" : "bg-amber-600 text-black"
                            }`}
                          >
                            {index + 1}
                          </div>

                          {/* Order Info */}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-amber-50">{order.customer}</p>
                            <p className="text-xs text-amber-100/70 truncate flex items-center gap-1">
                              <MapPin className="h-3 w-3 flex-shrink-0" />
                              {order.address}
                            </p>
                            <p className="text-xs text-amber-100/60">{order.items} طلب</p>
                          </div>

                          {/* Status */}
                          <div className="flex flex-col items-end gap-2 flex-shrink-0">
                            {order.status === "completed" ? (
                              <Badge className="bg-green-500 text-white">مكتمل</Badge>
                            ) : (
                              <Badge className="bg-amber-600 text-black">قيد الانتظار</Badge>
                            )}
                            {order.distance && <span className="text-xs text-amber-100/60">{order.distance}</span>}
                          </div>

                          {/* Actions */}
                          {order.status === "pending" && (
                            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white ml-2">
                              تسليم
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Route Info */}
                <Card className="border-amber-600/30 bg-black/50 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-amber-50">
                      <Navigation className="h-5 w-5" />
                      معلومات الطريق المقترح
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="text-amber-100/70 text-sm mb-2">أفضل طريق:</p>
                        <p className="text-amber-50">{currentBatch.neighborhood}</p>
                        <p className="text-xs text-amber-100/60 mt-1">ترتيب تصاعدي حسب المسافة</p>
                      </div>
                      <div className="p-4 rounded-lg bg-amber-600/10 border border-amber-600/30">
                        <p className="text-amber-100/70 text-sm mb-2">الوقت المتوقع:</p>
                        <p className="text-2xl font-bold text-amber-400">~25 دقيقة</p>
                        <p className="text-xs text-amber-100/60 mt-1">بدون ازدحام</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

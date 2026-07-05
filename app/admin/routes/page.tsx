"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, MapPin, Navigation } from "lucide-react"
import { createOptimizedBatches, type OptimizedRoute } from "@/lib/route-optimization"

const mockOrders = [
  { id: "1", address: "شارع النيل", neighborhood: "صنعاء - حي الروضة", lat: 15.352, lng: 48.217 },
  { id: "2", address: "شارع الجمهورية", neighborhood: "صنعاء - حي الروضة", lat: 15.353, lng: 48.219 },
  { id: "3", address: "شارع البحر", neighborhood: "صنعاء - حي الروضة", lat: 15.354, lng: 48.218 },
  { id: "4", address: "شارع القاهرة", neighborhood: "صنعاء - حي السبعين", lat: 15.355, lng: 48.22 },
  { id: "5", address: "شارع الجيش", neighborhood: "صنعاء - حي السبعين", lat: 15.356, lng: 48.221 },
  { id: "6", address: "شارع الثورة", neighborhood: "صنعاء - حي دمّاج", lat: 15.357, lng: 48.222 },
]

export default function RouteOptimization() {
  const [batches, setBatches] = useState<OptimizedRoute[]>([])
  const [optimized, setOptimized] = useState(false)

  const handleOptimizeRoutes = () => {
    const optimizedBatches = createOptimizedBatches(mockOrders)
    setBatches(optimizedBatches)
    setOptimized(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-amber-950/5 to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-amber-50">تحسين المسارات</h1>
            <p className="text-amber-100/70">تحسين مسارات التوصيل حسب المناطق السكنية</p>
          </div>
          <Button onClick={handleOptimizeRoutes} className="bg-amber-600 hover:bg-amber-700 text-black gap-2">
            <Navigation className="h-4 w-4" />
            تحسين المسارات الآن
          </Button>
        </div>

        {optimized && (
          <Card className="border-green-600/30 bg-green-600/10 backdrop-blur mb-8">
            <CardContent className="flex items-center gap-3 p-4">
              <AlertCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-bold text-green-400">نجح تحسين المسارات</p>
                <p className="text-sm text-green-300/80">تم إنشاء {batches.length} دفعة مثلى للتوصيل</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Route Batches */}
        <div className="grid gap-6">
          {batches.map((batch, index) => (
            <Card key={batch.neighborhood} className="border-amber-600/30 bg-black/50 backdrop-blur">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-amber-600 text-black">دفعة {index + 1}</Badge>
                    <CardTitle className="text-amber-50 flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      {batch.neighborhood}
                    </CardTitle>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <div className="text-center">
                      <p className="text-amber-100/70">المسافة الإجمالية</p>
                      <p className="text-lg font-bold text-amber-400">{batch.totalDistance} كم</p>
                    </div>
                    <div className="text-center">
                      <p className="text-amber-100/70">الوقت المتوقع</p>
                      <p className="text-lg font-bold text-amber-400">{batch.estimatedTime} دقيقة</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {batch.sequence.map((order, stopIndex) => (
                    <div
                      key={order.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-amber-600/10 border border-amber-600/30"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-600 text-white text-sm font-bold flex-shrink-0">
                        {stopIndex + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-amber-50 font-medium">{order.address}</p>
                        <p className="text-xs text-amber-100/60">الطلب #{order.id}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {!optimized && (
          <Card className="border-amber-600/30 bg-black/50 backdrop-blur">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Navigation className="h-16 w-16 text-amber-600/30 mb-4" />
              <p className="text-amber-100/70 text-center mb-6">
                اضغط على زر "تحسين المسارات الآن" لتحسين مسارات التوصيل بناءً على المناطق السكنية والمسافات
              </p>
              <Button onClick={handleOptimizeRoutes} className="bg-amber-600 hover:bg-amber-700 text-black">
                ابدأ التحسين
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

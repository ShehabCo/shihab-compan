"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MapPin, TrendingUp, Plus, Edit2 } from "lucide-react"

interface Driver {
  id: number
  name: string
  phone: string
  neighborhood: string
  status: "available" | "busy" | "offline"
  completedOrders: number
  rating: number
  activeOrders: number
}

const mockDrivers: Driver[] = [
  {
    id: 1,
    name: "أحمد محمد",
    phone: "+967771234567",
    neighborhood: "صنعاء - حي الروضة",
    status: "busy",
    completedOrders: 156,
    rating: 4.8,
    activeOrders: 4,
  },
  {
    id: 2,
    name: "محمود علي",
    phone: "+967772345678",
    neighborhood: "صنعاء - حي السبعين",
    status: "available",
    completedOrders: 123,
    rating: 4.6,
    activeOrders: 0,
  },
  {
    id: 3,
    name: "عمر خالد",
    phone: "+967773456789",
    neighborhood: "صنعاء - حي دمّاج",
    status: "busy",
    completedOrders: 98,
    rating: 4.5,
    activeOrders: 3,
  },
  {
    id: 4,
    name: "سالم حسن",
    phone: "+967774567890",
    neighborhood: "صنعاء - حي الروضة",
    status: "offline",
    completedOrders: 87,
    rating: 4.4,
    activeOrders: 0,
  },
]

export default function DriversManagement() {
  const [drivers, setDrivers] = useState<Driver[]>(mockDrivers)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredDrivers = drivers.filter(
    (driver) =>
      driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500/30 text-green-300"
      case "busy":
        return "bg-yellow-500/30 text-yellow-300"
      case "offline":
        return "bg-gray-500/30 text-gray-300"
      default:
        return ""
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-amber-950/5 to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-amber-50">إدارة السائقين</h1>
            <p className="text-amber-100/70">إدارة فريق التوصيل والمناطق</p>
          </div>
          <Button className="bg-amber-600 hover:bg-amber-700 text-black gap-2">
            <Plus className="h-4 w-4" />
            إضافة سائق جديد
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card className="border-amber-600/30 bg-black/50 backdrop-blur">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-amber-100/70 text-sm mb-1">إجمالي السائقين</p>
                <p className="text-3xl font-bold text-amber-400">{drivers.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-green-600/30 bg-black/50 backdrop-blur">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-green-100/70 text-sm mb-1">متاحون الآن</p>
                <p className="text-3xl font-bold text-green-400">
                  {drivers.filter((d) => d.status === "available").length}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-yellow-600/30 bg-black/50 backdrop-blur">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-yellow-100/70 text-sm mb-1">مشغولون</p>
                <p className="text-3xl font-bold text-yellow-400">
                  {drivers.filter((d) => d.status === "busy").length}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-amber-600/30 bg-black/50 backdrop-blur">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-amber-100/70 text-sm mb-1">متوسط التقييم</p>
                <p className="text-3xl font-bold text-amber-400">
                  {(drivers.reduce((sum, d) => sum + d.rating, 0) / drivers.length).toFixed(1)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Drivers Table */}
        <Card className="border-amber-600/30 bg-black/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-amber-50">قائمة السائقين</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Input
                placeholder="ابحث عن سائق..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-amber-600/10 border-amber-600/30 text-amber-50"
              />
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-amber-600/20 hover:bg-transparent">
                    <TableHead className="text-amber-100">اسم السائق</TableHead>
                    <TableHead className="text-amber-100">الهاتف</TableHead>
                    <TableHead className="text-amber-100">المنطقة</TableHead>
                    <TableHead className="text-amber-100">الحالة</TableHead>
                    <TableHead className="text-amber-100">الطلبات النشطة</TableHead>
                    <TableHead className="text-amber-100">الطلبات المكتملة</TableHead>
                    <TableHead className="text-amber-100">التقييم</TableHead>
                    <TableHead className="text-amber-100">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDrivers.map((driver) => (
                    <TableRow key={driver.id} className="border-amber-600/20 hover:bg-amber-600/10">
                      <TableCell className="text-amber-50 font-medium">{driver.name}</TableCell>
                      <TableCell className="text-amber-100">
                        <a href={`tel:${driver.phone}`} className="text-amber-400 hover:underline">
                          {driver.phone}
                        </a>
                      </TableCell>
                      <TableCell className="text-amber-100">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {driver.neighborhood}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(driver.status)}>
                          {driver.status === "available" ? "متاح" : driver.status === "busy" ? "مشغول" : "غير متصل"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-amber-50">{driver.activeOrders}</TableCell>
                      <TableCell className="text-amber-50">{driver.completedOrders}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="text-amber-400 font-bold">{driver.rating}</span>
                          <TrendingUp className="h-3 w-3 text-amber-400" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-amber-600/30 text-amber-400 bg-transparent"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

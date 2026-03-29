"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit2, Trash2, Plus, Search } from "lucide-react"

interface Dish {
  id: number
  name: string
  price: number
  category: string
  orders: number
  rating: number
  status: "active" | "inactive"
}

const mockDishes: Dish[] = [
  { id: 1, name: "كبسة الدجاج", price: 4500, category: "أرز", orders: 156, rating: 4.8, status: "active" },
  { id: 2, name: "مندي الضأن", price: 5500, category: "لحوم", orders: 143, rating: 4.9, status: "active" },
  { id: 3, name: "محشي", price: 3800, category: "نباتي", orders: 89, rating: 4.6, status: "active" },
  { id: 4, name: "مقلوبة", price: 4200, category: "أرز", orders: 102, rating: 4.7, status: "active" },
  { id: 5, name: "مطبق", price: 2800, category: "خفيف", orders: 67, rating: 4.5, status: "inactive" },
]

function DishesContent() {
  const [dishes, setDishes] = useState<Dish[]>(mockDishes)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredDishes = dishes.filter(
    (dish) =>
      dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const toggleStatus = (id: number) => {
    setDishes(
      dishes.map((dish) =>
        dish.id === id ? { ...dish, status: dish.status === "active" ? "inactive" : "active" } : dish,
      ),
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-amber-950/5 to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-amber-50">إدارة الأطباق</h1>
            <p className="text-amber-100/70">قائمة جميع الأطباق المتاحة</p>
          </div>
          <Button className="bg-amber-600 hover:bg-amber-700 text-black gap-2">
            <Plus className="h-4 w-4" />
            إضافة طبق جديد
          </Button>
        </div>

        {/* Search */}
        <Card className="border-amber-600/30 bg-black/50 backdrop-blur mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-600" />
              <Input
                placeholder="ابحث عن طبق..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 bg-amber-600/10 border-amber-600/30 text-amber-50"
              />
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="border-amber-600/30 bg-black/50 backdrop-blur">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-amber-600/20 hover:bg-transparent">
                    <TableHead className="text-amber-100">اسم الطبق</TableHead>
                    <TableHead className="text-amber-100">الفئة</TableHead>
                    <TableHead className="text-amber-100">السعر</TableHead>
                    <TableHead className="text-amber-100">الطلبات</TableHead>
                    <TableHead className="text-amber-100">التقييم</TableHead>
                    <TableHead className="text-amber-100">الحالة</TableHead>
                    <TableHead className="text-amber-100">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDishes.map((dish) => (
                    <TableRow key={dish.id} className="border-amber-600/20 hover:bg-amber-600/10">
                      <TableCell className="text-amber-50 font-medium">{dish.name}</TableCell>
                      <TableCell className="text-amber-100">{dish.category}</TableCell>
                      <TableCell className="text-amber-50">${(dish.price / 1000).toFixed(2)}</TableCell>
                      <TableCell className="text-amber-50">{dish.orders}</TableCell>
                      <TableCell>
                        <Badge className="bg-amber-600/30 text-amber-300">{dish.rating}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            dish.status === "active" ? "bg-green-500/30 text-green-300" : "bg-red-500/30 text-red-300"
                          }
                        >
                          {dish.status === "active" ? "نشط" : "غير نشط"}
                        </Badge>
                      </TableCell>
                      <TableCell className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-amber-600/30 text-amber-400 bg-transparent"
                          onClick={() => toggleStatus(dish.id)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="border-red-600/30 text-red-400 bg-transparent">
                          <Trash2 className="h-4 w-4" />
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

export default function DishesManagement() {
  return <DishesContent />
}

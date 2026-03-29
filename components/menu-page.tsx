"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Dish {
  id: number
  name: string
  price: number
  image: string
  rating: number
  reviews: number
  category: string
  featured?: boolean
  description: string
}

interface MenuPageProps {
  dishes: Dish[]
}

export function MenuPageComponent({ dishes }: MenuPageProps) {
  const [cart, setCart] = useState<{ id: number; quantity: number }[]>([])
  const [selectedCategory, setSelectedCategory] = useState("الكل")
  const router = useRouter()

  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  const handleAddToCart = (dishId: number) => {
    const existingItem = cart.find((item) => item.id === dishId)
    let updatedCart

    if (existingItem) {
      updatedCart = cart.map((item) => (item.id === dishId ? { ...item, quantity: item.quantity + 1 } : item))
    } else {
      updatedCart = [...cart, { id: dishId, quantity: 1 }]
    }

    setCart(updatedCart)
    localStorage.setItem("cart", JSON.stringify(updatedCart))

    // Show feedback
    alert("تم الإضافة إلى السلة!")
  }

  const categories = ["الكل", ...new Set(dishes.map((d) => d.category))]
  const filteredDishes = selectedCategory === "الكل" ? dishes : dishes.filter((d) => d.category === selectedCategory)

  return (
    <div>
      {/* Categories */}
      <div className="flex gap-2 justify-center flex-wrap mb-8">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? "default" : "outline"}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Dishes Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredDishes.map((dish) => (
          <Card key={dish.id} className="border-amber-600/30 bg-black/50 backdrop-blur hover:bg-black/70 transition">
            <CardContent className="p-0">
              <div className="relative h-48 overflow-hidden rounded-t-lg">
                <Image
                  src={dish.image || "/placeholder.svg"}
                  alt={dish.name}
                  fill
                  className="object-cover hover:scale-110 transition-transform"
                />
                {dish.featured && <Badge className="absolute top-2 right-2 bg-amber-600">مميز</Badge>}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-amber-50 mb-1">{dish.name}</h3>
                <p className="text-xs text-amber-100/70 mb-3">{dish.description}</p>
                <div className="flex items-center gap-2 mb-3">
                  <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                  <span className="text-xs text-amber-100">{dish.rating}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-amber-400">{(dish.price / 1000).toFixed(1)} ر.ي</span>
                  <Button
                    size="sm"
                    onClick={() => handleAddToCart(dish.id)}
                    className="bg-amber-600 hover:bg-amber-700 text-black"
                  >
                    <ShoppingCart className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Cart Button */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 right-6 bg-amber-600 text-black rounded-full p-4 shadow-lg cursor-pointer hover:bg-amber-700">
          <Link href="/cart" className="flex items-center gap-2 font-bold">
            <ShoppingCart className="h-5 w-5" />
            {cart.length}
          </Link>
        </div>
      )}
    </div>
  )
}

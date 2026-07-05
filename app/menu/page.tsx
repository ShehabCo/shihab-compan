"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { ShoppingCart, Star, Clock, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

const dishes = [
  {
    id: 1,
    name: "كبسة الدجاج",
    description: "أرز عطري محضر بدقة مع دجاج مشوي وخضار طازة",
    price: 4500,
    image: "/chicken-kabsa.jpg",
    category: "أرز وحبوب",
    rating: 4.8,
    reviews: 128,
    delivery: "30-45",
    featured: true,
  },
  {
    id: 2,
    name: "مندي الضأن",
    description: "لحم ضأن مشوي ببطء مع أرز مند أصفر شهي",
    price: 5500,
    image: "/lamb-mandi.jpg",
    category: "لحوم",
    rating: 4.9,
    reviews: 156,
    delivery: "40-55",
    featured: true,
  },
  {
    id: 3,
    name: "محشي",
    description: "محشي مصري تقليدي بالباذنجان والكوسة والطماطم",
    price: 3800,
    image: "/mahshi.jpg",
    category: "نباتي",
    rating: 4.6,
    reviews: 94,
    delivery: "35-50",
  },
  {
    id: 4,
    name: "مقلوبة",
    description: "طبق تقليدي بالأرز والدجاج والباذنجان المقلوب",
    price: 4200,
    image: "/maqluba.jpg",
    category: "أرز وحبوب",
    rating: 4.7,
    reviews: 112,
    delivery: "35-50",
  },
  {
    id: 5,
    name: "مندي الدجاج",
    description: "دجاج مشوي مع أرز مند بتتبيلة خاصة وحساء لذيذ",
    price: 4000,
    image: "/chicken-mandi.jpg",
    category: "لحوم",
    rating: 4.8,
    reviews: 134,
    delivery: "38-50",
  },
  {
    id: 6,
    name: "مطبق",
    description: "عجينة محشوة باللحم والبصل والتوابل، مقلية حتى الذهب",
    price: 2800,
    image: "/mutabbaq.jpg",
    category: "خفيف",
    rating: 4.5,
    reviews: 87,
    delivery: "20-30",
  },
  {
    id: 7,
    name: "سلطة عربية",
    description: "سلطة طازة بالطماطم والخيار والبقدونس والدهن",
    price: 1500,
    image: "/arabic-salad.jpg",
    category: "سلطات",
    rating: 4.4,
    reviews: 76,
    delivery: "10-15",
  },
  {
    id: 8,
    name: "شوربة العدس",
    description: "شوربة عدس دافئة وغنية بالتوابل والثوم",
    price: 1200,
    image: "/lentil-soup.jpg",
    category: "شوربات",
    rating: 4.6,
    reviews: 82,
    delivery: "15-20",
  },
  {
    id: 9,
    name: "شيش طاووس",
    description: "مشكوة لحوم مشوية ممتزجة مع خضار شهية",
    price: 5200,
    image: "/mixed-grill.jpg",
    category: "لحوم",
    rating: 4.7,
    reviews: 103,
    delivery: "40-55",
  },
  {
    id: 10,
    name: "فلافل شاورما",
    description: "كباب مشوي في خبز طازة مع صلصة وخضار",
    price: 1800,
    image: "/kebab-sandwich.jpg",
    category: "سندويتشات",
    rating: 4.5,
    reviews: 98,
    delivery: "15-25",
  },
  {
    id: 11,
    name: "بقلاوة ذهبية",
    description: "حلويات طبقات من العجين والفستق والعسل",
    price: 800,
    image: "/golden-baklava.png",
    category: "حلويات",
    rating: 4.9,
    reviews: 156,
    delivery: "5-10",
  },
  {
    id: 12,
    name: "قهوة عربية",
    description: "قهوة عربية حقيقية محمصة طازة بالهيل والزعفران",
    price: 400,
    image: "/arabic-coffee.jpg",
    category: "مشروبات",
    rating: 4.8,
    reviews: 142,
    delivery: "2-5",
  },
]

const categories = ["الكل", "أرز وحبوب", "لحوم", "نباتي", "شوربات", "سلطات", "خفيف", "سندويتشات", "حلويات", "مشروبات"]

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState("الكل")
  const [cart, setCart] = useState<Map<number, number>>(new Map())
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const authToken = localStorage.getItem("authToken")
    setIsAuthenticated(!!authToken)
  }, [])

  const featuredDishes = dishes.filter((d) => d.featured)
  const filteredDishes = selectedCategory === "الكل" ? dishes : dishes.filter((d) => d.category === selectedCategory)

  const handleAddToCart = (id: number) => {
    if (!isAuthenticated) {
      router.push("/auth/login")
      return
    }

    const newCart = new Map(cart)
    newCart.set(id, (newCart.get(id) || 0) + 1)
    setCart(newCart)

    const cartData = Array.from(newCart.entries()).map(([dishId, quantity]) => ({
      dishId,
      quantity,
      dish: dishes.find((d) => d.id === dishId),
    }))
    localStorage.setItem("cart", JSON.stringify(cartData))
  }

  const cartTotal = Array.from(cart.values()).reduce((a, b) => a + b, 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-amber-600/20 bg-gradient-to-b from-slate-900 to-slate-950 backdrop-blur">
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-300 to-amber-200 bg-clip-text text-transparent mb-2">
            مرة أم سليم
          </h1>
          <p className="text-amber-100/70">أشهى الأطباق التقليدية العربية الأصيلة</p>
        </div>
      </div>

      {/* Dish of the Day Carousel */}
      <section className="py-12 px-4 border-b border-amber-600/20">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold text-amber-50 mb-6 text-center">طبق اليوم المميز</h2>
          <Carousel className="w-full">
            <CarouselContent>
              {featuredDishes.map((dish) => (
                <CarouselItem key={dish.id} className="md:basis-1/2 lg:basis-1/3">
                  <Card className="border-amber-600/30 bg-slate-900/50 backdrop-blur hover:bg-slate-900/70 transition-all">
                    <CardContent className="p-0">
                      <div className="relative h-64 overflow-hidden rounded-t-lg">
                        <Image src={dish.image || "/placeholder.svg"} alt={dish.name} fill className="object-cover" />
                        <Badge className="absolute top-3 right-3 bg-amber-600 text-black">مميز</Badge>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-amber-50 mb-2">{dish.name}</h3>
                        <p className="text-sm text-amber-100/70 mb-4">{dish.description}</p>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                            <span className="text-sm text-amber-100">{dish.rating}</span>
                            <span className="text-xs text-amber-100/60">({dish.reviews})</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-amber-100/70">
                            <Clock className="h-3 w-3" />
                            {dish.delivery} د
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-amber-400">
                            {(dish.price / 1000).toFixed(1)} ر.ي
                          </span>
                          <Button
                            size="sm"
                            onClick={() => handleAddToCart(dish.id)}
                            className="bg-amber-600 hover:bg-amber-700 text-black"
                          >
                            <ShoppingCart className="h-4 w-4 ml-2" />
                            أضف
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -right-16" />
            <CarouselNext className="hidden md:flex -left-16" />
          </Carousel>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8 px-4 border-b border-amber-600/20">
        <div className="container mx-auto">
          <div className="flex gap-2 justify-center flex-wrap">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat)}
                className={
                  selectedCategory === cat
                    ? "bg-amber-600 hover:bg-amber-700 text-black"
                    : "border-amber-600/30 text-amber-100 hover:border-amber-600/50 bg-transparent"
                }
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredDishes.map((dish) => (
              <Card
                key={dish.id}
                className="border-amber-600/30 bg-slate-900/50 backdrop-blur hover:bg-slate-900/70 transition-all group cursor-pointer"
              >
                <CardContent className="p-0">
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <Image
                      src={dish.image || "/placeholder.svg"}
                      alt={dish.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {dish.featured && <Badge className="absolute top-2 right-2 bg-amber-600 text-black">مميز</Badge>}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-amber-50 mb-1">{dish.name}</h3>
                    <p className="text-xs text-amber-100/70 mb-3 line-clamp-2">{dish.description}</p>
                    <div className="flex items-center gap-2 mb-3">
                      <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                      <span className="text-xs text-amber-100">{dish.rating}</span>
                      <span className="text-xs text-amber-100/60">({dish.reviews})</span>
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
        </div>
      </section>

      {cartTotal > 0 && (
        <Link
          href="/cart"
          className="fixed bottom-6 right-6 bg-amber-600 text-black rounded-full p-4 shadow-lg hover:bg-amber-700 transition flex items-center gap-2 z-40"
        >
          <ShoppingCart className="h-5 w-5" />
          <span className="font-bold">{cartTotal}</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  )
}

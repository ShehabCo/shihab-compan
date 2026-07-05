// Wishlist Page
'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface WishlistItem {
  productId: string
  name: string
  price: number
  image: string
  rating: number
  addedAt: string
  discount?: number
}

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await fetch('/api/v1/wishlist')
        if (response.ok) {
          const data = await response.json()
          setWishlist(data.items)
        }
      } catch (error) {
        console.error('[Wishlist] Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchWishlist()
  }, [])

  if (loading) {
    return <div className="text-center py-8">جاري التحميل...</div>
  }

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-12 text-center">
          <h1 className="text-2xl font-bold mb-4">قائمة الرغبات فارغة</h1>
          <p className="text-gray-600 mb-6">
            أضف المنتجات التي تعجبك إلى قائمة الرغبات
          </p>
          <Button href="/">العودة للمتجر</Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">قائمة الرغبات</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <Card key={item.productId} className="p-6 hover:shadow-lg transition">
              <div className="relative mb-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover rounded"
                />
                {item.discount && (
                  <div className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded">
                    -{item.discount}%
                  </div>
                )}
              </div>

              <h3 className="text-lg font-bold mb-2">{item.name}</h3>

              <div className="flex items-center mb-4">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <span
                      key={i}
                      className={i < Math.floor(item.rating) ? 'text-yellow-400' : 'text-gray-300'}
                    >
                      ★
                    </span>
                  ))}
                <span className="ml-2 text-gray-600">({item.rating})</span>
              </div>

              <p className="text-2xl font-bold text-green-600 mb-4">${item.price}</p>

              <p className="text-sm text-gray-500 mb-4">
                أضيف في: {new Date(item.addedAt).toLocaleDateString('ar')}
              </p>

              <div className="flex gap-2">
                <Button className="flex-1">أضف للسلة</Button>
                <Button variant="outline" className="flex-1">
                  إزالة
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* معلومات إضافية */}
        <Card className="mt-8 p-6">
          <h3 className="text-lg font-bold mb-4">عن قائمة الرغبات</h3>
          <ul className="space-y-2 text-gray-600">
            <li>✓ احفظ المنتجات المفضلة لديك</li>
            <li>✓ تلقَ تنبيهات عند انخفاض الأسعار</li>
            <li>✓ شارك قائمتك مع الأصدقاء</li>
            <li>✓ قارن الأسعار والمواصفات</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}

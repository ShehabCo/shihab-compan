'use client'

import { AppProvider, useAppContext } from '@/app/context'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { AIChatbot } from '@/components/ai-chatbot'
import { Button } from '@/components/ui/button'
import { Star, ShoppingCart, Heart } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

function ProductDetailContent() {
  const { id } = useParams()
  const { products, addToCart, isLoggedIn } = useAppContext()
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)

  const product = products.find((p) => p.id === id)

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold">المنتج غير موجود</h1>
        </div>
        <Footer />
      </div>
    )
  }

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      toast.error('يرجى تسجيل الدخول أولاً')
      return
    }

    setIsAdding(true)
    setTimeout(() => {
      addToCart(product.id, quantity, product.price)
      toast.success(`تم إضافة ${quantity} من المنتج إلى السلة`)
      setIsAdding(false)
      setQuantity(1)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <AIChatbot />

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg overflow-hidden shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="flex items-center justify-center bg-gray-100 rounded-lg">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="max-w-full h-auto max-h-96"
              />
            </div>

            {/* Product Details */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="mb-4">
                  <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
                    {product.category}
                  </span>
                </div>

                <h1 className="text-4xl font-bold mb-4">{product.name}</h1>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-semibold">{product.rating}</span>
                  <span className="text-gray-600">({product.reviews} تقييم)</span>
                </div>

                <p className="text-gray-700 text-lg mb-6">{product.description}</p>

                <div className="space-y-4 mb-8">
                  <div className="border-b pb-4">
                    <p className="text-gray-600">الحالة:</p>
                    <p className={`font-semibold ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                      {product.inStock ? 'متوفر الآن' : 'غير متوفر'}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-600">شحن سريع</p>
                    <p className="font-semibold">توصيل في 2-3 أيام عمل</p>
                  </div>

                  <div>
                    <p className="text-gray-600">ضمان</p>
                    <p className="font-semibold">ضمان 100% من الشركة المصنعة</p>
                  </div>
                </div>
              </div>

              {/* Price and Actions */}
              <div className="space-y-4">
                <div className="border-t pt-6">
                  <div className="text-5xl font-bold text-blue-600 mb-6">${product.price}</div>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-4 py-2 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="px-6 py-2 font-semibold">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-4 py-2 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-gray-600">
                      الإجمالي: ${(product.price * quantity).toFixed(2)}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <Button
                      onClick={handleAddToCart}
                      disabled={!product.inStock || isAdding}
                      size="lg"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      {isAdding ? 'جاري الإضافة...' : 'إضافة إلى السلة'}
                    </Button>

                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full bg-transparent"
                    >
                      <Heart className="w-5 h-5" />
                      إضافة إلى المفضلة
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="font-semibold text-lg mb-2">شحن مجاني</h3>
            <p className="text-gray-600">على جميع الطلبات فوق $50</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="font-semibold text-lg mb-2">إرجاع آمن</h3>
            <p className="text-gray-600">إرجاع خلال 14 يوماً بدون أسئلة</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="font-semibold text-lg mb-2">دعم 24/7</h3>
            <p className="text-gray-600">فريق دعم متاح في أي وقت</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function ProductDetailPage() {
  return (
    <AppProvider>
      <ProductDetailContent />
    </AppProvider>
  )
}

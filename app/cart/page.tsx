'use client'

import { AppProvider, useAppContext } from '@/app/context'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Trash2, Plus, Minus } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'

function CartContent() {
  const { cart, products, removeFromCart, isLoggedIn } = useAppContext()
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const cartItems = cart.map((item) => ({
    ...item,
    product: products.find((p) => p.id === item.productId),
  }))

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const handleCheckout = async () => {
    if (!isLoggedIn) {
      toast.error('يرجى تسجيل الدخول أولاً')
      return
    }

    setIsCheckingOut(true)
    setTimeout(() => {
      toast.success('تم تقديم الطلب بنجاح! سيتم معالجته قريباً')
      setIsCheckingOut(false)
    }, 1000)
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">يرجى تسجيل الدخول</h1>
          <p className="text-gray-600 mb-8">
            يجب تسجيل الدخول للوصول إلى سلة التسوق والقيام بعملية الشراء
          </p>
          <Link href="/login">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">تسجيل الدخول</Button>
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-12">
          <div className="bg-white rounded-lg p-12 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h1 className="text-2xl font-bold mb-4">سلتك فارغة</h1>
            <p className="text-gray-600 mb-8">ابدأ بإضافة بعض المنتجات الرائعة!</p>
            <Link href="/products">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">تصفح المنتجات</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">سلة التسوق</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.productId}
                className="bg-white rounded-lg p-6 flex gap-6 items-center shadow-md hover:shadow-lg transition"
              >
                <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={item.product?.image || ''}
                    alt={item.product?.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">{item.product?.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{item.product?.description}</p>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button className="px-3 py-1 hover:bg-gray-100">
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-1 font-semibold">{item.quantity}</span>
                      <button className="px-3 py-1 hover:bg-gray-100">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <span className="font-semibold text-blue-600">${(item.price * item.quantity).toFixed(2)}</span>

                    <button
                      onClick={() => {
                        removeFromCart(item.productId)
                        toast.success('تم حذف المنتج من السلة')
                      }}
                      className="ml-auto text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg p-6 shadow-md h-fit sticky top-20">
            <h2 className="text-2xl font-bold mb-6">ملخص الطلب</h2>

            <div className="space-y-4 mb-6 pb-6 border-b">
              <div className="flex justify-between">
                <span className="text-gray-600">عدد المنتجات:</span>
                <span className="font-semibold">{itemCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">المجموع الجزئي:</span>
                <span className="font-semibold">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">الشحن:</span>
                <span className="font-semibold text-green-600">مجاني</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">الضريبة:</span>
                <span className="font-semibold">${(total * 0.1).toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between mb-6 text-xl">
              <span className="font-bold">الإجمالي:</span>
              <span className="font-bold text-blue-600">${(total * 1.1).toFixed(2)}</span>
            </div>

            <Button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition mb-4"
            >
              {isCheckingOut ? 'جاري المعالجة...' : 'إتمام الشراء'}
            </Button>

            <Link href="/products">
              <Button variant="outline" className="w-full bg-transparent">
                متابعة التسوق
              </Button>
            </Link>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-gray-700 space-y-2">
              <p className="font-semibold text-blue-600">شمول البيع:</p>
              <ul className="text-xs space-y-1 list-disc list-inside">
                <li>شحن مجاني على جميع الطلبات</li>
                <li>ضمان 100% على جميع المنتجات</li>
                <li>إرجاع آمن خلال 14 يوماً</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function CartPage() {
  return (
    <AppProvider>
      <CartContent />
    </AppProvider>
  )
}

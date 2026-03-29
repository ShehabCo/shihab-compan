'use client'

import { AppProvider, useAppContext } from '@/app/context'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { AIChatbot } from '@/components/ai-chatbot'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Star, TrendingUp, Zap, Shield } from 'lucide-react'

function HomeContent() {
  const { products } = useAppContext()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      <AIChatbot />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
            مرحباً بك في SmartAI World
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 text-balance">
            منصة تجارة ذكية بالذكاء الاصطناعي - تسوق ذكي وآمن وموثوق 100%
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 w-full sm:w-auto">
                تصفح المنتجات
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-blue-700 w-full sm:w-auto bg-transparent"
              >
                سجل دخول الآن
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-balance">
            لماذا تختار SmartAI World؟
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Zap className="w-8 h-8 text-blue-600" />,
                title: 'سريع وفعال',
                description: 'تسوق سريع وسهل مع واجهة ذكية وتطبيق محسّن للسرعة',
              },
              {
                icon: <Shield className="w-8 h-8 text-green-600" />,
                title: 'آمن 100%',
                description: 'حماية كاملة لبيانات العملاء ودفع آمن وموثوق',
              },
              {
                icon: <Star className="w-8 h-8 text-yellow-600" />,
                title: 'جودة عالية',
                description: 'منتجات فقط من أفضل الشركات والبائعين الموثوقين',
              },
              {
                icon: <TrendingUp className="w-8 h-8 text-purple-600" />,
                title: 'ذكاء اصطناعي',
                description: 'توصيات ذكية وخدمة دعم بالذكاء الاصطناعي 24/7',
              },
            ].map((feature, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-lg transition">
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-balance">
            المنتجات المميزة
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition cursor-pointer h-full">
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-bold text-blue-600">${product.price}</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-semibold">{product.rating}</span>
                        <span className="text-xs text-gray-500">({product.reviews})</span>
                      </div>
                    </div>

                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      عرض التفاصيل
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/products">
              <Button size="lg" variant="outline">
                عرض جميع المنتجات
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '10K+', label: 'منتج' },
              { number: '50K+', label: 'عميل سعيد' },
              { number: '500+', label: 'بائع موثوق' },
              { number: '24/7', label: 'دعم فني' },
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">
            هل أنت مستعد للتسوق الذكي؟
          </h2>
          <p className="text-xl text-gray-600 mb-8 text-balance">
            ابدأ الآن واستمتع بتجربة تسوق فريدة مع SmartAI World
          </p>
          <Link href="/products">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
              ابدأ التسوق الآن
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default function Home() {
  return (
    <AppProvider>
      <HomeContent />
    </AppProvider>
  )
}

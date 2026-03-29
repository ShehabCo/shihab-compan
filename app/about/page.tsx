'use client'

import { AppProvider } from '@/app/context'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { CheckCircle, Users, Globe, Zap } from 'lucide-react'

function AboutContent() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h1 className="text-4xl font-bold mb-6 text-center">عن SmartAI World</h1>
          <p className="text-xl text-gray-700 text-center mb-6">
            منصة تجارة إلكترونية ذكية بالذكاء الاصطناعي تهدف إلى تغيير طريقة التسوق والبيع عبر الإنترنت في اليمن والعالم العربي
          </p>
        </section>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-4">مهمتنا</h2>
            <p className="text-gray-700 leading-relaxed">
              نحن نهدف إلى بناء منصة تجارية عادلة وآمنة وموثوقة تربط البائعين والمشترين بطريقة ذكية، مستخدمة أحدث تقنيات الذكاء الاصطناعي لتوفير تجربة تسوق فريدة وسهلة.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-4">رؤيتنا</h2>
            <p className="text-gray-700 leading-relaxed">
              أن تصبح SmartAI World المنصة الرقمية الأولى والموثوقة في العالم العربي للتجارة الإلكترونية، حيث يشعر الجميع بالأمان والثقة في كل عملية شراء.
            </p>
          </div>
        </div>

        {/* Values */}
        <section className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">قيمنا الأساسية</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <CheckCircle className="w-8 h-8 text-green-600" />,
                title: 'الثقة والشفافية',
                description: 'نؤمن بالشفافية التامة في كل عملياتنا',
              },
              {
                icon: <Users className="w-8 h-8 text-blue-600" />,
                title: 'خدمة العملاء',
                description: 'رضا العميل هو أولويتنا الأولى دائماً',
              },
              {
                icon: <Zap className="w-8 h-8 text-yellow-600" />,
                title: 'الابتكار',
                description: 'استخدام أحدث التقنيات والذكاء الاصطناعي',
              },
              {
                icon: <Globe className="w-8 h-8 text-purple-600" />,
                title: 'التوسع العالمي',
                description: 'نسعى للوصول إلى أسواق عالمية جديدة',
              },
            ].map((value, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">{value.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="bg-blue-600 text-white rounded-lg p-8 mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">إحصائياتنا</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-5xl font-bold mb-2">10K+</p>
              <p className="text-blue-100">منتج</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2">50K+</p>
              <p className="text-blue-100">عميل سعيد</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2">500+</p>
              <p className="text-blue-100">بائع موثوق</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2">24/7</p>
              <p className="text-blue-100">دعم فني</p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold mb-8 text-center">فريقنا</h2>
          <p className="text-gray-700 text-center mb-8">
            فريق متخصص من المطورين والمصممين وخبراء الأعمال الملتزمين بتقديم أفضل الخدمات
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'شهاب وضاح محسن', role: 'المؤسس والرئيس التنفيذي', email: 'mmzz770999184@gmail.com' },
              { name: 'فريق التطوير', role: 'فريق المطورين المتخصصين', email: 'dev@smartaiworld.com' },
              { name: 'خدمة العملاء', role: 'فريق الدعم الفني 24/7', email: 'support@smartaiworld.com' },
            ].map((member, index) => (
              <div key={index} className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-lg transition">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {member.name.charAt(0)}
                </div>
                <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{member.role}</p>
                <p className="text-blue-600 text-sm">{member.email}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default function AboutPage() {
  return (
    <AppProvider>
      <AboutContent />
    </AppProvider>
  )
}

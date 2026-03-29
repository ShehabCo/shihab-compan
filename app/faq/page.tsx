'use client'

import { AppProvider } from '@/app/context'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

function FAQContent() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0)

  const faqs = [
    {
      category: 'الحساب والتسجيل',
      items: [
        {
          q: 'كيف أنشئ حساباً على SmartAI World؟',
          a: 'يمكنك إنشاء حساب جديد بسهولة من خلال الضغط على "سجل دخول" والملء بيانات البريد الإلكتروني وكلمة المرور. سيتم التحقق من بريدك الإلكتروني وستتمكن من البدء فوراً.',
        },
        {
          q: 'هل يمكن لشخص واحد أن يكون عميلاً وبائعاً؟',
          a: 'نعم، يمكنك التبديل بين دور العميل والبائع حسب احتياجاتك.',
        },
        {
          q: 'ماذا لو نسيت كلمة مرورك؟',
          a: 'يمكنك استرجاع كلمة مرورك من خلال البريد الإلكتروني المسجل لديك.',
        },
      ],
    },
    {
      category: 'الشراء والدفع',
      items: [
        {
          q: 'هل شراء من SmartAI آمن؟',
          a: 'نعم، نستخدم أحدث تقنيات التشفير وحماية البيانات. جميع المعاملات آمنة وموثوقة 100%.',
        },
        {
          q: 'ما طرق الدفع المتاحة؟',
          a: 'نقبل جميع البطاقات الائتمانية والمحافظ الرقمية والتحويلات البنكية.',
        },
        {
          q: 'هل هناك رسوم خفية؟',
          a: 'لا، السعر الذي تراه هو السعر النهائي. لا توجد أي رسوم مخفية.',
        },
        {
          q: 'كم وقت معالجة الطلب؟',
          a: 'معظم الطلبات تُعالج في غضون 24 ساعة من التأكيد.',
        },
      ],
    },
    {
      category: 'الشحن والتسليم',
      items: [
        {
          q: 'كم تكلفة الشحن؟',
          a: 'الشحن مجاني على جميع الطلبات إلى جميع المحافظات اليمنية.',
        },
        {
          q: 'كم يستغرق الشحن؟',
          a: 'عادة ما يستغرق 2-3 أيام عمل للتسليم.',
        },
        {
          q: 'هل يمكنني تتبع طلبي؟',
          a: 'نعم، يمكنك تتبع طلبك من خلال حسابك على الموقع في الوقت الفعلي.',
        },
        {
          q: 'ماذا لو لم أستقبل الطلب؟',
          a: 'إذا لم تستقبل طلبك، يرجى التواصل معنا على الفور. سنقوم بحل المشكلة فوراً.',
        },
      ],
    },
    {
      category: 'الإرجاع والاسترجاع',
      items: [
        {
          q: 'كم المدة المسموحة لإرجاع منتج؟',
          a: 'لديك 14 يوماً كاملة من استلام الطلب لإرجاع المنتج.',
        },
        {
          q: 'هل هناك رسوم إرجاع؟',
          a: 'لا، الإرجاع مجاني تماماً في جميع الحالات.',
        },
        {
          q: 'كيف أبدأ عملية الإرجاع؟',
          a: 'يمكنك طلب الإرجاع من خلال حسابك، وسنزودك برقم إرجاع وعنوان الشحن.',
        },
        {
          q: 'متى سأتلقى مبلغ الاسترجاع؟',
          a: 'يتم استرجاع المبلغ خلال 5-7 أيام عمل بعد تأكيد الإرجاع.',
        },
      ],
    },
    {
      category: 'البيع على المنصة',
      items: [
        {
          q: 'هل يمكنني البيع على SmartAI World؟',
          a: 'نعم، يمكن لأي فرد أو شركة التسجيل كبائع والبدء في بيع منتجاتهم.',
        },
        {
          q: 'هل هناك رسوم للبائعين؟',
          a: 'نعم، نحتفظ بنسبة صغيرة من كل عملية بيع تعويض عن خدماتنا.',
        },
        {
          q: 'كيف أتحقق من هويتي كبائع؟',
          a: 'يجب تقديم بطاقة الهوية والبيانات البنكية للتحقق من هويتك.',
        },
        {
          q: 'متى سأتلقى أموالي؟',
          a: 'يتم تحويل أرباحك كل أسبوع إلى حسابك البنكي.',
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-4 text-center">الأسئلة الشائعة</h1>
        <p className="text-gray-600 text-center mb-12 text-lg">
          أجوبة على أكثر الأسئلة التي يطرحها عملاؤنا
        </p>

        <div className="space-y-8">
          {faqs.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h2 className="text-2xl font-bold mb-4 text-blue-600">{section.category}</h2>
              <div className="space-y-3">
                {section.items.map((item, itemIndex) => {
                  const globalIndex = sectionIndex * 10 + itemIndex
                  const isExpanded = expandedIndex === globalIndex

                  return (
                    <div
                      key={itemIndex}
                      className="bg-white rounded-lg shadow-md overflow-hidden"
                    >
                      <button
                        onClick={() =>
                          setExpandedIndex(isExpanded ? null : globalIndex)
                        }
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
                      >
                        <h3 className="font-semibold text-lg text-left">{item.q}</h3>
                        <ChevronDown
                          className={`w-5 h-5 text-gray-600 transition-transform ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {isExpanded && (
                        <div className="px-6 py-4 bg-gray-50 border-t text-gray-700">
                          {item.a}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 mt-12 text-center">
          <h2 className="text-2xl font-bold mb-4">لم تجد إجابة لسؤالك؟</h2>
          <p className="text-gray-700 mb-6">
            تواصل معنا مباشرة وسنكون سعداء بمساعدتك
          </p>
          <a href="/contact" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
            اتصل بنا
          </a>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function FAQPage() {
  return (
    <AppProvider>
      <FAQContent />
    </AppProvider>
  )
}

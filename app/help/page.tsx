// Help & Support Page
'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
}

const faqs: FAQ[] = [
  {
    id: '1',
    category: 'الشراء',
    question: 'كيف يمكنني شراء منتج؟',
    answer: 'اختر المنتج الذي تريده، أضفه للسلة، وأكمل عملية الدفع.',
  },
  {
    id: '2',
    category: 'الشراء',
    question: 'هل يمكنني إرجاع المنتج؟',
    answer: 'نعم، يمكنك إرجاع أي منتج خلال 14 يوماً من الشراء.',
  },
  {
    id: '3',
    category: 'البيع',
    question: 'كيف أصبح بائعاً؟',
    answer: 'انقر على "أصبح بائعاً" وأكمل خطوات التسجيل.',
  },
  {
    id: '4',
    category: 'الشحن',
    question: 'كم تستغرق عملية الشحن؟',
    answer: 'عادة ما يستغرق الشحن 3-5 أيام عمل.',
  },
  {
    id: '5',
    category: 'الأمان',
    question: 'هل معلوماتي آمنة؟',
    answer: 'نعم، نستخدم أحدث تقنيات التشفير لحماية بيانات العملاء.',
  },
  {
    id: '6',
    category: 'الحساب',
    question: 'كيف أتواصل مع خدمة العملاء؟',
    answer: 'يمكنك التواصل معنا عبر البريد الإلكتروني أو الهاتف.',
  },
]

export default function HelpPage() {
  const [selectedCategory, setSelectedCategory] = useState('الكل')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFaq, setSelectedFaq] = useState<string | null>(null)

  const categories = ['الكل', 'الشراء', 'البيع', 'الشحن', 'الأمان', 'الحساب']

  const filteredFaqs = faqs.filter((faq) => {
    const categoryMatch = selectedCategory === 'الكل' || faq.category === selectedCategory
    const searchMatch =
      faq.question.includes(searchQuery) ||
      faq.answer.includes(searchQuery)
    return categoryMatch && searchMatch
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">مركز المساعدة</h1>
        <p className="text-gray-600 mb-8">
          ابحث عن الإجابات على أسئلتك الشائعة
        </p>

        {/* شريط البحث */}
        <Card className="p-6 mb-8">
          <Input
            placeholder="ابحث عن سؤال..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </Card>

        {/* الفئات */}
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* الأسئلة الشائعة */}
        <div className="space-y-4">
          {filteredFaqs.map((faq) => (
            <Card
              key={faq.id}
              className="p-6 cursor-pointer hover:shadow-lg transition"
              onClick={() =>
                setSelectedFaq(selectedFaq === faq.id ? null : faq.id)
              }
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg">{faq.question}</h3>
                <span className="text-2xl">
                  {selectedFaq === faq.id ? '−' : '+'}
                </span>
              </div>

              {selectedFaq === faq.id && (
                <p className="mt-4 text-gray-600">{faq.answer}</p>
              )}
            </Card>
          ))}
        </div>

        {/* نموذج الاتصال */}
        <Card className="mt-12 p-8 bg-blue-50">
          <h2 className="text-2xl font-bold mb-6">هل لم تجد إجابتك؟</h2>
          <p className="text-gray-600 mb-6">
            تواصل معنا مباشرة وسنساعدك قريباً
          </p>

          <form className="space-y-4">
            <Input
              placeholder="اسمك"
              type="text"
              required
            />
            <Input
              placeholder="بريدك الإلكتروني"
              type="email"
              required
            />
            <textarea
              placeholder="رسالتك"
              className="w-full px-4 py-2 border rounded-lg"
              rows={4}
              required
            ></textarea>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              إرسال الرسالة
            </Button>
          </form>
        </Card>

        {/* خيارات الاتصال */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 text-center">
            <div className="text-4xl mb-2">📧</div>
            <h4 className="font-bold mb-2">البريد الإلكتروني</h4>
            <p className="text-gray-600">support@example.com</p>
          </Card>

          <Card className="p-6 text-center">
            <div className="text-4xl mb-2">📞</div>
            <h4 className="font-bold mb-2">الهاتف</h4>
            <p className="text-gray-600">+966-123-456-7890</p>
          </Card>

          <Card className="p-6 text-center">
            <div className="text-4xl mb-2">💬</div>
            <h4 className="font-bold mb-2">الدردشة الحية</h4>
            <p className="text-gray-600">متاح الآن</p>
          </Card>
        </div>
      </div>
    </div>
  )
}

'use client'

import React from "react"

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CheckCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function BecomeSellerPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    store_name: '',
    description: '',
    email: '',
    phone: '',
    business_type: '',
  })

  const benefits = [
    'وصول إلى ملايين المشترين',
    'أدوات إدارة متقدمة',
    'دعم فني 24/7',
    'تحليلات وإحصائيات مفصلة',
    'رسوم منخفضة وعادلة',
    'نظام دفع آمن وموثوق',
  ]

  const requirements = [
    'حساب بريد إلكتروني فعال',
    'رقم هاتف صحيح',
    'وثائق هوية صحيحة',
    'معلومات بنكية للتحويلات',
    'سياسة إرجاع واضحة',
    'وصف منتجات دقيق',
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('[v0] Seller registration form submitted:', formData)
    setStep(3)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">ابدأ البيع على Super Platform</h1>
          <p className="text-xl text-blue-100 mb-8">
            انضم إلى آلاف البائعين الناجحين على منصتنا
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Benefits */}
            <div>
              <h2 className="text-3xl font-bold mb-8">لماذا تبيع معنا؟</h2>
              <div className="space-y-4">
                {benefits.map((benefit, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                    <span className="text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div>
              <h2 className="text-3xl font-bold mb-8">المتطلبات</h2>
              <div className="space-y-4">
                {requirements.map((req, i) => (
                  <Card key={i} className="p-4">
                    <p className="text-lg">{req}</p>
                  </Card>
                ))}
              </div>
              <Button
                onClick={() => setStep(2)}
                className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white py-6"
              >
                ابدأ الآن
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <Card className="max-w-2xl mx-auto p-8">
            <h2 className="text-3xl font-bold mb-8">بيانات المتجر</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">اسم المتجر</label>
                <Input
                  type="text"
                  placeholder="اسم متجرك"
                  value={formData.store_name}
                  onChange={(e) => setFormData({ ...formData, store_name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">الوصف</label>
                <textarea
                  placeholder="اكتب وصفاً عن متجرك"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  rows={4}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">نوع العمل</label>
                <select
                  value={formData.business_type}
                  onChange={(e) => setFormData({ ...formData, business_type: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                >
                  <option value="">اختر نوع العمل</option>
                  <option value="individual">فرد</option>
                  <option value="small_business">متجر صغير</option>
                  <option value="medium_business">متجر متوسط</option>
                  <option value="large_business">شركة كبيرة</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">البريد الإلكتروني</label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">رقم الهاتف</label>
                  <Input
                    type="tel"
                    placeholder="+967 7XXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3">
                  إرسال الطلب
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => setStep(1)}
                >
                  العودة
                </Button>
              </div>
            </form>
          </Card>
        )}

        {step === 3 && (
          <Card className="max-w-2xl mx-auto p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">تم استقبال طلبك</h2>
            <p className="text-xl text-gray-600 mb-8">
              شكراً لتسجيلك! سننظر في طلبك خلال 24 ساعة ونتواصل معك عبر البريد الإلكتروني.
            </p>
            <Link href="/marketplace">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                العودة للمتجر
              </Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  )
}

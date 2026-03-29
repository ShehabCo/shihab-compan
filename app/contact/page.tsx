'use client'

import React from "react"

import { AppProvider } from '@/app/context'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Mail, Phone, MapPin } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

function ContactContent() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('يرجى ملء جميع الحقول')
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      toast.success('تم إرسال رسالتك بنجاح! سنرد عليك قريباً')
      setFormData({ name: '', email: '', subject: '', message: '' })
      setIsSubmitting(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">تواصل معنا</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Contact Info */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6">معلومات التواصل</h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">الهاتف</h3>
                  <p className="text-gray-600">+967 781 178 250</p>
                  <p className="text-gray-600">+967 730 781 431</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">البريد الإلكتروني</h3>
                  <p className="text-gray-600">mmzz770999184@gmail.com</p>
                  <p className="text-gray-600">support@smartaiworld.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">الموقع</h3>
                  <p className="text-gray-600">الجمهورية اليمنية</p>
                  <p className="text-gray-600">متاح عالمياً عبر الإنترنت</p>
                </div>
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-600 mb-2">ساعات التشغيل</h4>
                <p className="text-sm text-gray-700">24/7 - نحن متاحون طوال الوقت</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6">أرسل لنا رسالة</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  الاسم
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="أدخل اسمك الكامل"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  الموضوع
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="موضوع الرسالة"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  الرسالة
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="أكتب رسالتك هنا..."
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
              >
                {isSubmitting ? 'جاري الإرسال...' : 'إرسال الرسالة'}
              </Button>
            </form>
          </div>
        </div>

        {/* FAQ */}
        <section className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6">أسئلة شائعة</h2>

          <div className="space-y-4">
            {[
              {
                q: 'هل SmartAI World آمن؟',
                a: 'نعم، موقعنا آمن 100% مع استخدام أحدث تقنيات التشفير وحماية البيانات.',
              },
              {
                q: 'كم تكلفة الشحن؟',
                a: 'الشحن مجاني على جميع الطلبات بدون حد أدنى للشراء.',
              },
              {
                q: 'كيف يمكنني إرجاع منتج؟',
                a: 'يمكنك إرجاع أي منتج خلال 14 يوماً من الشراء بدون أي أسئلة.',
              },
              {
                q: 'هل يمكنني أن أصبح بائعاً؟',
                a: 'نعم، يمكنك التسجيل كبائع والبدء في بيع منتجاتك على منصتنا.',
              },
            ].map((item, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition">
                <h3 className="font-semibold mb-2 text-lg">{item.q}</h3>
                <p className="text-gray-600">{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default function ContactPage() {
  return (
    <AppProvider>
      <ContactContent />
    </AppProvider>
  )
}

// Super Platform MVP - Contact Page
// Support email: support@superplatform.com | Phone: +967 781 178 250

'use client'

import React from "react"

import { AppProvider, useAppContext } from '@/app/context'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Mail, Lock, User } from 'lucide-react'

function LoginContent() {
  const router = useRouter()
  const { login } = useAppContext()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'customer' | 'seller' | 'admin'>('customer')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error('يرجى ملء جميع الحقول')
      return
    }

    if (!email.includes('@')) {
      toast.error('يرجى إدخال بريد إلكتروني صحيح')
      return
    }

    setIsLoading(true)

    setTimeout(() => {
      if (login(email, password, role)) {
        toast.success('تم تسجيل الدخول بنجاح!')
        setTimeout(() => {
          router.push('/')
        }, 500)
      } else {
        toast.error('فشل تسجيل الدخول. يرجى المحاولة مجدداً')
      }
      setIsLoading(false)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />

      <main className="max-w-md mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
              AI
            </div>
            <h1 className="text-3xl font-bold mb-2">SmartAI World</h1>
            <p className="text-gray-600">تسجيل الدخول إلى حسابك</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                البريد الإلكتروني
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Lock className="w-4 h-4 inline mr-2" />
                كلمة المرور
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                نوع الحساب
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'customer' | 'seller' | 'admin')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="customer">عميل</option>
                <option value="seller">بائع</option>
                <option value="admin">مدير</option>
              </select>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
            >
              {isLoading ? 'جاري تسجيل الدخول...' : 'دخول'}
            </Button>
          </form>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 text-sm text-gray-700">
            <p className="font-semibold text-blue-600 mb-2">معلومات تجريبية:</p>
            <p>البريد: test@example.com</p>
            <p>كلمة المرور: any password</p>
            <p className="text-xs text-gray-600 mt-2">
              ملاحظة: هذا تطبيق توضيحي، جميع البيانات محفوظة محلياً
            </p>
          </div>

          <p className="text-center text-gray-600 mt-6 text-sm">
            هل أنت جديد هنا؟{' '}
            <button
              onClick={() => router.push('/')}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              ابدأ التسوق الآن
            </button>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function LoginPage() {
  return (
    <AppProvider>
      <LoginContent />
    </AppProvider>
  )
}

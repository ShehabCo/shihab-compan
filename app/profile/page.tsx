// User Profile Page
'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface UserProfile {
  id: string
  email: string
  name: string
  phone?: string
  address?: string
  avatar?: string
  joined: string
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/v1/profile')
        if (response.ok) {
          const data = await response.json()
          setProfile(data.profile)
        }
      } catch (error) {
        console.error('[Profile] Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  if (loading) {
    return <div className="text-center py-8">جاري التحميل...</div>
  }

  if (!profile) {
    return <div className="text-center py-8">الرجاء تسجيل الدخول</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">ملفك الشخصي</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* معلومات المستخدم */}
          <Card className="md:col-span-2 p-6">
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-2xl font-bold">البيانات الشخصية</h2>
              <Button
                variant={isEditing ? 'default' : 'outline'}
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'حفظ' : 'تعديل'}
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">الاسم</label>
                <Input
                  value={profile.name}
                  disabled={!isEditing}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">البريد الإلكتروني</label>
                <Input value={profile.email} disabled className="w-full" />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">رقم الهاتف</label>
                <Input
                  value={profile.phone || ''}
                  disabled={!isEditing}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">العنوان</label>
                <textarea
                  value={profile.address || ''}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border rounded-lg"
                  rows={3}
                />
              </div>
            </div>
          </Card>

          {/* معلومات إضافية */}
          <div className="space-y-4">
            <Card className="p-6">
              <h3 className="font-bold mb-4">نشاطك</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-600">انضم في:</span>
                  <p className="font-semibold">
                    {new Date(profile.joined).toLocaleDateString('ar')}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">عدد الطلبات:</span>
                  <p className="font-semibold">12</p>
                </div>
                <div>
                  <span className="text-gray-600">الإجمالي المنفق:</span>
                  <p className="font-semibold text-green-600">$1,250</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold mb-4">الحسساب</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full">
                  تغيير كلمة المرور
                </Button>
                <Button variant="outline" className="w-full">
                  تسجيل الخروج
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* العناوين المحفوظة */}
        <Card className="mt-8 p-6">
          <h2 className="text-2xl font-bold mb-6">العناوين المحفوظة</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4 border">
              <h4 className="font-bold mb-2">العنوان الرئيسي</h4>
              <p className="text-sm text-gray-600">
                123 شارع رئيسي، المدينة، البلد
              </p>
              <Button size="sm" variant="outline" className="mt-4">
                تعديل
              </Button>
            </Card>
            <Card className="p-4 border border-dashed flex items-center justify-center">
              <Button variant="outline">إضافة عنوان جديد</Button>
            </Card>
          </div>
        </Card>
      </div>
    </div>
  )
}

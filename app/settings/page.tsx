// Settings Page
'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('account')
  const [settings, setSettings] = useState({
    email: 'user@example.com',
    language: 'ar',
    currency: 'USD',
    notifications: true,
    newsletter: false,
    twoFactor: false,
    darkMode: false,
  })

  const handleSave = async () => {
    try {
      const response = await fetch('/api/v1/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        alert('تم حفظ الإعدادات بنجاح')
      }
    } catch (error) {
      console.error('[Settings] Error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">الإعدادات</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* التبويبات الجانبية */}
          <div className="lg:col-span-1">
            <div className="space-y-2">
              {[
                { id: 'account', label: 'الحساب' },
                { id: 'privacy', label: 'الخصوصية' },
                { id: 'notifications', label: 'الإشعارات' },
                { id: 'display', label: 'العرض' },
                { id: 'payment', label: 'الدفع' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-right py-2 px-4 rounded ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* محتوى الإعدادات */}
          <div className="lg:col-span-3">
            {activeTab === 'account' && (
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-6">إعدادات الحساب</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">البريد الإلكتروني</label>
                    <Input
                      value={settings.email}
                      onChange={(e) =>
                        setSettings({ ...settings, email: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">اللغة</label>
                    <select
                      value={settings.language}
                      onChange={(e) =>
                        setSettings({ ...settings, language: e.target.value })
                      }
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      <option value="ar">العربية</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">العملة</label>
                    <select
                      value={settings.currency}
                      onChange={(e) =>
                        setSettings({ ...settings, currency: e.target.value })
                      }
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      <option value="USD">$ USD</option>
                      <option value="EUR">€ EUR</option>
                      <option value="SAR">﷼ SAR</option>
                    </select>
                  </div>
                  <Button onClick={handleSave} className="w-full">
                    حفظ الإعدادات
                  </Button>
                </div>
              </Card>
            )}

            {activeTab === 'privacy' && (
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-6">الخصوصية والأمان</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>المصادقة الثنائية</span>
                    <input
                      type="checkbox"
                      checked={settings.twoFactor}
                      onChange={(e) =>
                        setSettings({ ...settings, twoFactor: e.target.checked })
                      }
                    />
                  </div>
                  <Button variant="outline" className="w-full">
                    تغيير كلمة المرور
                  </Button>
                  <Button variant="outline" className="w-full text-red-600">
                    حذف الحساب
                  </Button>
                </div>
              </Card>
            )}

            {activeTab === 'notifications' && (
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-6">الإشعارات</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>تنبيهات البريد الإلكتروني</span>
                    <input
                      type="checkbox"
                      checked={settings.notifications}
                      onChange={(e) =>
                        setSettings({ ...settings, notifications: e.target.checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>الاشتراك في النشرة الإخبارية</span>
                    <input
                      type="checkbox"
                      checked={settings.newsletter}
                      onChange={(e) =>
                        setSettings({ ...settings, newsletter: e.target.checked })
                      }
                    />
                  </div>
                </div>
              </Card>
            )}

            {activeTab === 'display' && (
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-6">خيارات العرض</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>الوضع الليلي</span>
                    <input
                      type="checkbox"
                      checked={settings.darkMode}
                      onChange={(e) =>
                        setSettings({ ...settings, darkMode: e.target.checked })
                      }
                    />
                  </div>
                  <Button onClick={handleSave} className="w-full">
                    حفظ التفضيلات
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

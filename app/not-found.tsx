'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
        <div className="text-6xl mb-4">404</div>
        <h1 className="text-3xl font-bold mb-4">الصفحة غير موجودة</h1>
        <p className="text-gray-600 mb-8">
          عذراً، الصفحة التي تبحث عنها غير موجودة أو تم حذفها.
        </p>

        <Link href="/">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            العودة للرئيسية
          </Button>
        </Link>
      </div>
    </div>
  )
}

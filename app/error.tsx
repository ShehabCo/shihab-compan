'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-3xl font-bold mb-4">حدث خطأ</h1>
        <p className="text-gray-600 mb-8">
          عذراً، حدث خطأ ما. يرجى المحاولة مرة أخرى.
        </p>

        <div className="flex gap-4 flex-col sm:flex-row">
          <Button
            onClick={() => reset()}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            حاول مرة أخرى
          </Button>
          <Link href="/" className="flex-1">
            <Button variant="outline" className="w-full bg-transparent">
              الذهاب للرئيسية
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

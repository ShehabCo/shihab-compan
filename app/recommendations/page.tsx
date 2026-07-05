// Recommendations Page
'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Recommendation {
  productId: string
  score: number
  reason: string
  product: {
    id: string
    name: string
    description: string
    price: number
    image_url: string
    rating: number
  }
}

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch('/api/v1/recommendations')
        if (response.ok) {
          const data = await response.json()
          setRecommendations(data.recommendations)
        }
      } catch (error) {
        console.error('[Recommendations] Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [])

  if (loading) {
    return <div className="text-center py-8">جاري التحميل...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">التوصيات المخصصة لك</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((rec) => (
            <Card key={rec.productId} className="p-6 hover:shadow-lg transition">
              {rec.product?.image_url && (
                <img
                  src={rec.product.image_url}
                  alt={rec.product.name}
                  className="w-full h-48 object-cover rounded mb-4"
                />
              )}
              <h3 className="text-lg font-bold mb-2">{rec.product?.name}</h3>
              <p className="text-gray-600 mb-2">
                {rec.product?.description?.substring(0, 100)}...
              </p>
              <p className="text-2xl font-bold text-green-600 mb-2">
                ${rec.product?.price}
              </p>
              <div className="flex items-center mb-4">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <span key={i} className="text-yellow-400">
                      ★
                    </span>
                  ))}
                <span className="ml-2 text-gray-600">
                  ({rec.product?.rating || 0})
                </span>
              </div>
              <p className="text-sm text-blue-600 mb-4">{rec.reason}</p>
              <Button className="w-full">أضف للسلة</Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

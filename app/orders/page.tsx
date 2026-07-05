// Orders History Page
'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Order {
  id: string
  date: string
  status: 'delivered' | 'shipped' | 'processing' | 'cancelled'
  total: number
  itemCount: number
  trackingUrl?: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/v1/orders')
        if (response.ok) {
          const data = await response.json()
          setOrders(data.orders)
        }
      } catch (error) {
        console.error('[Orders] Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  if (loading) {
    return <div className="text-center py-8">جاري التحميل...</div>
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'shipped':
        return 'bg-blue-100 text-blue-800'
      case 'processing':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      delivered: 'تم التسليم',
      shipped: 'قيد الشحن',
      processing: 'قيد المعالجة',
      cancelled: 'ملغى',
    }
    return labels[status] || status
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-12 text-center">
          <h1 className="text-2xl font-bold mb-4">لا توجد طلبات</h1>
          <p className="text-gray-600 mb-6">لم تقم بأي عمليات شراء حتى الآن</p>
          <Button href="/">ابدأ التسوق</Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">سجل الطلبات</h1>

        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="p-6 hover:shadow-lg transition">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                <div>
                  <p className="text-sm text-gray-600">رقم الطلب</p>
                  <p className="font-semibold">{order.id}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">التاريخ</p>
                  <p className="font-semibold">
                    {new Date(order.date).toLocaleDateString('ar')}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">الحالة</p>
                  <span className={`px-3 py-1 rounded ${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </div>

                <div>
                  <p className="text-sm text-gray-600">الإجمالي</p>
                  <p className="font-semibold text-green-600">${order.total}</p>
                </div>

                <div className="flex gap-2">
                  <Button size="sm">التفاصيل</Button>
                  {order.trackingUrl && (
                    <Button size="sm" variant="outline">
                      تتبع
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

'use client'

import Link from 'next/link'
import { ShoppingCart, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CartItem {
  product_id: string
  name: string
  price: number
  quantity: number
}

interface CartSidebarProps {
  items: CartItem[]
  isOpen: boolean
  onClose: () => void
  onRemove?: (productId: string) => void
}

export function CartSidebar({ items, isOpen, onClose, onRemove }: CartSidebarProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            السلة ({items.length})
          </h2>
          <button onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <p className="text-center text-gray-500 py-8">السلة فارغة</p>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.product_id} className="flex gap-4 border-b pb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold line-clamp-2">{item.name}</h3>
                    <p className="text-gray-600 text-sm">${item.price}</p>
                    <p className="text-gray-600 text-sm">الكمية: {item.quantity}</p>
                  </div>
                  {onRemove && (
                    <button
                      onClick={() => onRemove(item.product_id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t p-6 space-y-4">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>الإجمالي:</span>
              <span className="text-blue-600">${total.toFixed(2)}</span>
            </div>
            <Link href="/checkout">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                متابعة الدفع
              </Button>
            </Link>
          </div>
        )}
      </div>
    </>
  )
}

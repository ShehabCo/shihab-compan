'use client'

import React from "react"

import { useAppContext } from '@/app/context'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Plus, Edit2, Trash2, Eye } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { BarChart3, TrendingUp, Users, ShoppingBag } from 'lucide-react'

export default function SellerDashboard() {
  const { user, products, isLoggedIn } = useAppContext()
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    stock: '',
  })
  const [loading, setLoading] = useState(false)

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch('/api/v1/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newProduct,
          price: parseFloat(newProduct.price),
          stock: parseInt(newProduct.stock),
          images: ['/placeholder.png'],
        }),
      })

      if (response.ok) {
        setNewProduct({ name: '', description: '', category: '', price: '', stock: '' })
      }
    } catch (error) {
      console.error('Failed to add product:', error)
    } finally {
      setLoading(false)
    }
  }

  const sellerProducts = products.filter((p) => p.sellerId === user?.id)

  const stats = [
    { label: 'إجمالي المبيعات', value: 0, icon: TrendingUp },
    { label: 'المنتجات', value: sellerProducts.length, icon: ShoppingBag },
    { label: 'الطلبات', value: 0, icon: Users },
    { label: 'التقييم', value: 0, icon: BarChart3 },
  ]

  if (!isLoggedIn || user?.role !== 'seller') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">وصول مرفوض</h1>
          <p className="text-gray-600">يجب أن تكون بائعاً للوصول إلى لوحة البيع</p>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">لوحة تحكم البائع</h1>
          <p className="text-gray-600">إدارة متجرك ومنتجاتك والطلبات</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <Card key={i} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className="w-8 h-8 text-blue-600 opacity-20" />
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-6 mb-8">
          <h2 className="text-xl font-bold mb-6">إضافة منتج جديد</h2>
          <form onSubmit={handleAddProduct} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="text"
                placeholder="اسم المنتج"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                required
              />
              <select
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                className="px-4 py-2 border rounded-lg"
                required
              >
                <option value="">اختر فئة</option>
                <option value="electronics">الإلكترونيات</option>
                <option value="fashion">الموضة</option>
                <option value="home">المنزل</option>
                <option value="sports">الرياضة</option>
              </select>
            </div>

            <textarea
              placeholder="وصف المنتج"
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              rows={3}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="number"
                placeholder="السعر"
                step="0.01"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                required
              />
              <Input
                type="number"
                placeholder="الكمية المتاحة"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                required
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
              {loading ? 'جاري الإضافة...' : 'إضافة المنتج'}
            </Button>
          </form>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-6">منتجاتك</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-right text-sm font-semibold">المنتج</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold">السعر</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold">المتاح</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold">البيعات</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {sellerProducts.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-3">{product.name}</td>
                    <td className="px-6 py-3">${product.price}</td>
                    <td className="px-6 py-3">{product.stock}</td>
                    <td className="px-6 py-3">12</td>
                    <td className="px-6 py-3">
                      <Button variant="outline" size="sm">تعديل</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}

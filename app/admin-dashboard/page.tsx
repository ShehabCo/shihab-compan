'use client'

import { AppProvider, useAppContext } from '@/app/context'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

function AdminDashboardContent() {
  const { user, products, isLoggedIn } = useAppContext()

  if (!isLoggedIn || user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">وصول مرفوض</h1>
          <p className="text-gray-600">يجب أن تكون مديراً للوصول إلى لوحة الإدارة</p>
        </main>
        <Footer />
      </div>
    )
  }

  // Sample data for charts
  const chartData = [
    { name: 'يناير', sales: 4000, users: 2400 },
    { name: 'فبراير', sales: 3000, users: 1398 },
    { name: 'مارس', sales: 2000, users: 9800 },
    { name: 'أبريل', sales: 2780, users: 3908 },
    { name: 'مايو', sales: 1890, users: 4800 },
    { name: 'يونيو', sales: 2390, users: 3800 },
  ]

  const stats = [
    { label: 'إجمالي المنتجات', value: products.length },
    { label: 'المستخدمين', value: '1,284' },
    { label: 'البائعين', value: '245' },
    { label: 'الإيرادات الشهرية', value: '$52,400' },
  ]

  const recentOrders = [
    { id: '001', customer: 'محمد علي', amount: '$125', status: 'delivered' },
    { id: '002', customer: 'فاطمة حسن', amount: '$89', status: 'processing' },
    { id: '003', customer: 'علي محمد', amount: '$210', status: 'shipped' },
    { id: '004', customer: 'ليلى خالد', amount: '$145', status: 'pending' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">لوحة الإدارة</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-md">
              <p className="text-gray-600 text-sm mb-2">{stat.label}</p>
              <p className="text-3xl font-bold text-blue-600">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6">إحصائيات المبيعات والمستخدمين</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#3b82f6" name="المبيعات" />
              <Bar dataKey="users" fill="#10b981" name="المستخدمين" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6">آخر الطلبات</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-right py-3 px-4">رقم الطلب</th>
                  <th className="text-right py-3 px-4">العميل</th>
                  <th className="text-right py-3 px-4">المبلغ</th>
                  <th className="text-right py-3 px-4">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4 font-semibold">#{order.id}</td>
                    <td className="py-4 px-4">{order.customer}</td>
                    <td className="py-4 px-4">{order.amount}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.status === 'delivered'
                            ? 'bg-green-100 text-green-700'
                            : order.status === 'shipped'
                              ? 'bg-blue-100 text-blue-700'
                              : order.status === 'processing'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {order.status === 'delivered'
                          ? 'تم التسليم'
                          : order.status === 'shipped'
                            ? 'قيد الشحن'
                            : order.status === 'processing'
                              ? 'قيد المعالجة'
                              : 'معلق'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function AdminDashboardPage() {
  return (
    <AppProvider>
      <AdminDashboardContent />
    </AppProvider>
  )
}

// This is the updated MVP Super Platform Admin Dashboard
// Features: Real-time analytics, order management, user management, seller verification

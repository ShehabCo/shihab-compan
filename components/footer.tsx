'use client'

import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                SP
              </div>
              Super Platform
            </h3>
            <p className="text-gray-400">منصة تجارة عالمية ذكية مدعومة بالذكاء الاصطناعي</p>
          </div>

          {/* Marketplace Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">المتجر</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/marketplace" className="hover:text-white transition">
                  الصفحة الرئيسية
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition">
                  تصفح المنتجات
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-white transition">
                  الفئات
                </Link>
              </li>
            </ul>
          </div>

          {/* Sellers */}
          <div>
            <h4 className="text-lg font-semibold mb-4">للبائعين</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/seller-dashboard" className="hover:text-white transition">
                  لوحة التحكم
                </Link>
              </li>
              <li>
                <Link href="/become-seller" className="hover:text-white transition">
                  ابدأ البيع
                </Link>
              </li>
              <li>
                <Link href="/seller-guide" className="hover:text-white transition">
                  الدليل
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">المساعدة</h4>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+967 781 178 250</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>support@superplatform.com</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>تصل إلينا 24/7</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
            <p>&copy; 2024 Super Platform MVP. Built with ❤️ for global commerce.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="/terms" className="hover:text-white transition">Terms</Link>
              <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
              <Link href="/cookies" className="hover:text-white transition">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

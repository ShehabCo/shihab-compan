'use client'

import Link from 'next/link'
import { useAppContext } from '@/app/context'
import { ShoppingCart, LogOut, Menu, X, User, LogIn } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function Header() {
  const { user, logout, cart, isLoggedIn } = useAppContext()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold flex items-center gap-2">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-blue-600 font-bold">
            AI
          </div>
          <span>SmartAI World</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="hover:text-blue-100 transition">
            الرئيسية
          </Link>
          <Link href="/products" className="hover:text-blue-100 transition">
            المنتجات
          </Link>
          {isLoggedIn && user?.role === 'seller' && (
            <Link href="/seller-dashboard" className="hover:text-blue-100 transition">
              لوحة البيع
            </Link>
          )}
          {isLoggedIn && user?.role === 'admin' && (
            <Link href="/admin-dashboard" className="hover:text-blue-100 transition">
              لوحة الإدارة
            </Link>
          )}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <Link href="/cart" className="relative">
                <ShoppingCart className="w-6 h-6 hover:text-blue-100 transition cursor-pointer" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">{user?.name}</span>
              </div>
              <Button
                onClick={logout}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-blue-700"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">خروج</span>
              </Button>
            </>
          ) : (
            <>
              <Link href="/cart" className="relative">
                <ShoppingCart className="w-6 h-6 hover:text-blue-100 transition cursor-pointer" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
              <Link href="/login">
                <Button className="bg-white text-blue-600 hover:bg-blue-50">
                  <LogIn className="w-4 h-4" />
                  دخول
                </Button>
              </Link>
            </>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-blue-700 px-4 py-3 space-y-2">
          <Link href="/" className="block py-2 hover:text-blue-100">
            الرئيسية
          </Link>
          <Link href="/products" className="block py-2 hover:text-blue-100">
            المنتجات
          </Link>
          {isLoggedIn && user?.role === 'seller' && (
            <Link href="/seller-dashboard" className="block py-2 hover:text-blue-100">
              لوحة البيع
            </Link>
          )}
          {isLoggedIn && user?.role === 'admin' && (
            <Link href="/admin-dashboard" className="block py-2 hover:text-blue-100">
              لوحة الإدارة
            </Link>
          )}
        </div>
      )}
    </header>
  )
}

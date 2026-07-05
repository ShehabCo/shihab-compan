'use client';

import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-white shadow">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          Super App
        </Link>
        <div className="flex gap-6">
          <Link href="/products" className="text-gray-700 hover:text-blue-600">
            Products
          </Link>
          <Link href="/cart" className="text-gray-700 hover:text-blue-600">
            Cart
          </Link>
          <Link href="/profile" className="text-gray-700 hover:text-blue-600">
            Profile
          </Link>
        </div>
      </nav>
    </header>
  );
}

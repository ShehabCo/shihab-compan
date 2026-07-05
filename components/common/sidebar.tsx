'use client';

import Link from 'next/link';

export function Sidebar() {
  return (
    <aside className="w-64 bg-gray-100 min-h-screen p-6">
      <nav className="space-y-4">
        <Link href="/dashboard" className="block text-gray-700 hover:text-blue-600">
          Dashboard
        </Link>
        <Link href="/products" className="block text-gray-700 hover:text-blue-600">
          Products
        </Link>
        <Link href="/orders" className="block text-gray-700 hover:text-blue-600">
          Orders
        </Link>
        <Link href="/settings" className="block text-gray-700 hover:text-blue-600">
          Settings
        </Link>
      </nav>
    </aside>
  );
}

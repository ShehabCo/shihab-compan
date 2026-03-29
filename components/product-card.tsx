'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Star, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Product } from '@/lib/types'

interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden h-full flex flex-col">
      {/* Product Image */}
      <div className="relative h-48 bg-gray-100 overflow-hidden group">
        <Image
          src={product.images[0] || '/placeholder.png'}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition"
        />
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold">غير متوفر</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 p-4 flex flex-col">
        <h3 className="font-semibold text-lg line-clamp-2 mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm line-clamp-2 mb-4">{product.description}</p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {product.rating.toFixed(1)} ({product.reviews_count})
          </span>
        </div>

        {/* Price and Stock */}
        <div className="flex items-center justify-between mb-4 mt-auto">
          <div>
            <span className="text-2xl font-bold text-blue-600">${product.price}</span>
            {product.stock < 5 && product.stock > 0 && (
              <p className="text-xs text-orange-600">فقط {product.stock} متبقي</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <Link href={`/products/${product.id}`} className="block">
            <Button variant="outline" className="w-full bg-transparent">
              عرض التفاصيل
            </Button>
          </Link>
          <Button
            onClick={() => onAddToCart?.(product)}
            disabled={product.stock === 0}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            <ShoppingCart className="w-4 h-4 ml-2" />
            أضف للسلة
          </Button>
        </div>
      </div>
    </div>
  )
}

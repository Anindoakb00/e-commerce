"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useCartStore } from "@/store/cartStore"
import { normalizeImageUrl } from '@/lib/images'
import Image from 'next/image'

export default function ProductCard({ product }: { product: any }) {
  const add = useCartStore(s=>s.add)
  const href = product.slug ? `/p/${product.slug}` : `/products/${product.id}`
  const outOfStock = typeof product.stock_qty === 'number' && product.stock_qty <= 0
  return (
    <Card className="group overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800">
      <CardContent className="p-0">
  <Link href={href} className="block">
          <div className="relative w-full h-48 overflow-hidden bg-gray-50 dark:bg-gray-700">
            <Image
              src={normalizeImageUrl(product.image) || '/file.svg'}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e)=>{ /* Next/Image handles gracefully; fallback via src */ }}
            />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
              {product.name}
            </h3>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xl font-bold text-foreground">
                ${product.price}
              </p>
              {outOfStock && (
                <span className="text-sm text-red-600 font-medium">Out of stock</span>
              )}
            </div>
          </div>
        </Link>
        <div className="px-4 pb-4">
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors" 
            onClick={()=>add(product,1)}
            disabled={outOfStock}
          >
            {outOfStock ? 'Unavailable' : 'Add to Cart'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

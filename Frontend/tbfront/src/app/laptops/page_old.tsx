'use client'

import { useState, useEffect } from "react"
import Image from "next/image"
import { normalizeImageUrl } from '@/lib/images'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { useCartStore } from '@/store/cartStore'
import Link from "next/link"

type Product = {
  id: number
  name: string
  price: number
  image: string
  category: string
  brand: string
  categorySlug?: string
}

export default function LaptopsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { add } = useCartStore()

  useEffect(() => {
    const fetchLaptops = async () => {
      setLoading(true)
      try {
        const res = await fetch("http://localhost:8000/api/products/")
        if (!res.ok) throw new Error("Failed to fetch products")
        const data = await res.json()

        // Filter for laptops
        const laptops = data.filter((item: any) => {
          const name = (item.name || '').toLowerCase()
          const category = (item.category || '').toLowerCase()
          return name.includes('laptop') || name.includes('macbook') || 
                 name.includes('notebook') || category.includes('laptop') ||
                 name.includes('dell') || name.includes('lenovo') || 
                 name.includes('asus') || name.includes('acer') || name.includes('hp')
        })

        const laptopProducts: Product[] = laptops.map((item: any) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          image: (item.images && item.images.length > 0 && item.images[0].image) ? 
                 item.images[0].image : (item.image || "/file.svg"),
          category: item.category_name || item.category || "Laptops",
          brand: item.brand_name || item.brand || "",
        }))

        setProducts(laptopProducts)
      } catch (err) {
        toast("Failed to load laptops")
      } finally {
        setLoading(false)
      }
    }
    fetchLaptops()
  }, [])

  const handleAddToCart = (product: Product) => {
    add(product, 1)
    toast(`${product.name} added to cart`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100">
        <div className="container mx-auto py-8">
          <div className="text-center py-20">
            <div className="text-2xl text-gray-400">Loading laptops...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="container mx-auto py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <Link href="/" className="hover:text-cyan-400">Home</Link>
            <span>→</span>
            <Link href="/products" className="hover:text-cyan-400">Products</Link>
            <span>→</span>
            <span className="text-cyan-400">Laptops</span>
          </div>
          
          <h1 className="text-3xl font-mono font-bold text-cyan-400 mb-2">
            {'>'} laptops.query()
          </h1>
          <p className="text-gray-400 font-mono">
            Found {products.length} results | High-performance computing devices
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl text-gray-700 mb-4">404</div>
            <p className="text-xl text-gray-400 font-mono">No laptops found in database</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="bg-gray-900 border-gray-700 hover:border-cyan-500/50 transition-all duration-300">
                <CardContent className="p-4">
                  <div className="aspect-square bg-gray-800 rounded-lg mb-4 overflow-hidden">
                    <Image
                      src={normalizeImageUrl(product.image)}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-mono text-sm text-cyan-400 truncate">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 font-mono">
                      Brand: {product.brand || 'Unknown'}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-green-400 text-lg">
                        ${product.price}
                      </span>
                      <Button
                        size="sm"
                        onClick={() => handleAddToCart(product)}
                        className="bg-cyan-600 hover:bg-cyan-500 text-black font-mono text-xs"
                      >
                        ADD_TO_CART()
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { normalizeImageUrl } from '@/lib/images'
import { API_BASE } from '@/lib/config'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { useCartStore } from '@/store/cartStore'

type Product = {
  id: number
  name: string
  price: number
  image: string
  category: string
  brand: string
}

export default function LaptopsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { add } = useCartStore()

  useEffect(() => {
    const fetchLaptops = async () => {
      setLoading(true)
      try {
        console.log('Fetching laptops from API...')
  const res = await fetch(`${API_BASE}/products/`)

        if (!res.ok) {
          console.warn('API fetch failed, using mock data')
          throw new Error("Failed to fetch products")
        }

        const data = await res.json()
        console.log('API data received:', data)

        // Filter for laptops
        const laptops = data.filter((item: any) => {
          const name = (item.name || '').toLowerCase()
          const category = (item.category || '').toLowerCase()
          return (
            name.includes('macbook') ||
            name.includes('laptop') ||
            name.includes('pro') ||
            name.includes('book') ||
            name.includes('notebook') ||
            name.includes('computer') ||
            category.includes('laptop') ||
            category.includes('computer')
          )
        })

        const laptopProducts: Product[] = laptops.map((item: any) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          image:
            item.images && item.images.length > 0 && item.images[0].image
              ? item.images[0].image
              : item.image || "/file.svg",
          category: item.category || 'Laptop',
          brand: item.brand || 'Unknown',
        }))

        setProducts(laptopProducts)
      } catch (error) {
        console.error('Error fetching laptops, using mock data:', error)

        // Use mock data when API fails
        const mockLaptops: Product[] = [
          { id: 1, name: 'MacBook Pro M3 14-inch', price: 1999, image: '/file.svg', category: 'Laptop', brand: 'Apple' },
          { id: 2, name: 'Dell XPS 13', price: 1299, image: '/file.svg', category: 'Laptop', brand: 'Dell' },
          { id: 3, name: 'MacBook Air M2', price: 1199, image: '/file.svg', category: 'Laptop', brand: 'Apple' },
          { id: 4, name: 'Lenovo ThinkPad X1', price: 1499, image: '/file.svg', category: 'Laptop', brand: 'Lenovo' },
          { id: 5, name: 'HP Spectre x360', price: 1399, image: '/file.svg', category: 'Laptop', brand: 'HP' },
          { id: 6, name: 'ASUS ZenBook 14', price: 999, image: '/file.svg', category: 'Laptop', brand: 'ASUS' },
        ]

        setProducts(mockLaptops)
        toast.error('Using offline data - API connection failed')
      } finally {
        setLoading(false)
      }
    }

    fetchLaptops()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/" className="text-blue-600 hover:text-blue-800">← Back to Home</Link>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Laptops</h1>
          <p className="text-muted-foreground">Professional laptops and notebooks</p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-6 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm h-80 animate-pulse"></div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-800">
                <CardContent className="p-0">
                  <Link href={`/products/${product.id}`}>
                    <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-t-lg overflow-hidden">
                      <Image
                        src={normalizeImageUrl(product.image)}
                        alt={product.name}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = '/file.svg'
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-xl font-bold text-foreground">${product.price}</p>
                    </div>
                  </Link>
                  <div className="px-4 pb-4">
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => {
                        add(product, 1)
                        toast.success(`Added ${product.name} to cart`)
                      }}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-foreground mb-2">No laptops found</h3>
            <p className="text-muted-foreground mb-6">We couldn't find any laptops at the moment.</p>
            <Button asChild>
              <Link href="/products">Browse All Products</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
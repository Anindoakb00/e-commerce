'use client'

import { useState, useEffect } from "react"
import Image from "next/image"
import { normalizeImageUrl } from '@/lib/images'
import { API_BASE } from '@/lib/config'
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

export default function SmartphonesPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { add } = useCartStore()

  useEffect(() => {
    const fetchSmartphones = async () => {
      setLoading(true)
      try {
    console.log('Fetching smartphones from API...')
    const res = await fetch(`${API_BASE}/products/`)
        
        if (!res.ok) {
          console.warn('API fetch failed, using mock data')
          throw new Error("Failed to fetch products")
        }
        
        const data = await res.json()
        console.log('API data received:', data)

        // Filter for smartphones
        const smartphones = data.filter((item: any) => {
          const name = (item.name || '').toLowerCase()
          const category = (item.category || '').toLowerCase()
          return name.includes('iphone') || name.includes('samsung') || 
                 name.includes('galaxy') || name.includes('phone') ||
                 name.includes('s24') || name.includes('pro max') ||
                 category.includes('phone') || category.includes('mobile')
        })

        const smartphoneProducts: Product[] = smartphones.map((item: any) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          image: (item.images && item.images.length > 0 && item.images[0].image) ? 
                 item.images[0].image : (item.image || "/file.svg"),
          category: item.category || 'Smartphone',
          brand: item.brand || 'Unknown'
        }))

        setProducts(smartphoneProducts)
      } catch (error) {
        console.error("Error fetching smartphones, using mock data:", error)
        
        // Use mock data when API fails
        const mockSmartphones: Product[] = [
          {
            id: 1,
            name: "iPhone 15 Pro Max",
            price: 1199,
            image: "/file.svg",
            category: "Smartphone",
            brand: "Apple"
          },
          {
            id: 2,
            name: "Samsung Galaxy S24 Ultra",
            price: 1299,
            image: "/file.svg",
            category: "Smartphone",
            brand: "Samsung"
          },
          {
            id: 3,
            name: "iPhone 14 Pro",
            price: 999,
            image: "/file.svg",
            category: "Smartphone",
            brand: "Apple"
          },
          {
            id: 4,
            name: "Samsung Galaxy S23",
            price: 899,
            image: "/file.svg",
            category: "Smartphone",
            brand: "Samsung"
          },
          {
            id: 5,
            name: "Google Pixel 8 Pro",
            price: 999,
            image: "/file.svg",
            category: "Smartphone",
            brand: "Google"
          },
          {
            id: 6,
            name: "OnePlus 12",
            price: 799,
            image: "/file.svg",
            category: "Smartphone",
            brand: "OnePlus"
          }
        ]
        
        setProducts(mockSmartphones)
        toast.error("Using offline data - API connection failed")
      } finally {
        setLoading(false)
      }
    }

    fetchSmartphones()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/" className="text-blue-600 hover:text-blue-800">← Back to Home</Link>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Smartphones</h1>
          <p className="text-muted-foreground">Latest smartphones and mobile devices</p>
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
            <h3 className="text-xl font-semibold text-foreground mb-2">No smartphones found</h3>
            <p className="text-muted-foreground mb-6">We couldn't find any smartphones at the moment.</p>
            <Button asChild>
              <Link href="/products">Browse All Products</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
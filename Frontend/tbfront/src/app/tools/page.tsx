'use client'

import { useState, useEffect } from "react"
import Image from "next/image"
import { normalizeImageUrl } from '@/lib/images'
import { API_BASE } from '@/lib/config'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
}

export default function ToolsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { add } = useCartStore()

  useEffect(() => {
    const fetchTools = async () => {
      setLoading(true)
      try {
    console.log('Fetching tools from API...')
    const res = await fetch(`${API_BASE}/products/`)
        
        if (!res.ok) {
          console.warn('API fetch failed, using mock data')
          throw new Error("Failed to fetch products")
        }
        
        const data = await res.json()
        console.log('API data received:', data)

        // Filter for gaming tools and accessories
        const tools = data.filter((item: any) => {
          const name = (item.name || '').toLowerCase()
          const category = (item.category || '').toLowerCase()
          return name.includes('keyboard') || name.includes('mouse') || 
                 name.includes('gaming') || name.includes('mechanical') ||
                 name.includes('wireless') || name.includes('rgb') ||
                 name.includes('headset') || name.includes('controller') ||
                 category.includes('gaming') || category.includes('tool')
        })

        const toolProducts: Product[] = tools.map((item: any) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          image: (item.images && item.images.length > 0 && item.images[0].image) ? 
                 item.images[0].image : (item.image || "/file.svg"),
          category: item.category || 'Gaming',
          brand: item.brand || 'Unknown'
        }))

        setProducts(toolProducts)
      } catch (error) {
        console.error("Error fetching tools, using mock data:", error)
        
        // Use mock data when API fails
        const mockTools: Product[] = [
          {
            id: 1,
            name: "Mechanical Gaming Keyboard",
            price: 149,
            image: "/file.svg",
            category: "Gaming",
            brand: "Razer"
          },
          {
            id: 2,
            name: "Wireless Gaming Mouse",
            price: 89,
            image: "/file.svg",
            category: "Gaming",
            brand: "Logitech"
          },
          {
            id: 3,
            name: "Gaming Headset",
            price: 199,
            image: "/file.svg",
            category: "Gaming",
            brand: "SteelSeries"
          },
          {
            id: 4,
            name: "RGB Mousepad",
            price: 39,
            image: "/file.svg",
            category: "Gaming",
            brand: "Corsair"
          },
          {
            id: 5,
            name: "Webcam HD 1080p",
            price: 79,
            image: "/file.svg",
            category: "Gaming",
            brand: "Logitech"
          },
          {
            id: 6,
            name: "Monitor Stand",
            price: 59,
            image: "/file.svg",
            category: "Gaming",
            brand: "Generic"
          }
        ]
        
        setProducts(mockTools)
        toast.error("Using offline data - API connection failed")
      } finally {
        setLoading(false)
      }
    }
    fetchTools()
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
            <div className="text-2xl text-gray-400 font-mono">Scanning tools directory...</div>
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
            <Link href="/" className="hover:text-green-400">Home</Link>
            <span>→</span>
            <Link href="/products" className="hover:text-green-400">Products</Link>
            <span>→</span>
            <span className="text-green-400">Tools</span>
          </div>
          
          <h1 className="text-3xl font-mono font-bold text-green-400 mb-2">
            {'>'} tools.execute()
          </h1>
          <p className="text-gray-400 font-mono">
            {products.length} tools loaded | Development & repair utilities
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl text-gray-700 mb-4 font-mono">NULL</div>
            <p className="text-xl text-gray-400 font-mono">No tools found in repository</p>
            <p className="text-sm text-gray-500 font-mono mt-2">try: git pull origin tools</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="bg-gray-900 border-gray-700 hover:border-green-500/50 transition-all duration-300">
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
                    <h3 className="font-mono text-sm text-green-400 truncate">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 font-mono">
                      Type: {product.brand || 'Generic'}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-yellow-400 text-lg">
                        ${product.price}
                      </span>
                      <Button
                        size="sm"
                        onClick={() => handleAddToCart(product)}
                        className="bg-green-600 hover:bg-green-500 text-black font-mono text-xs"
                      >
                        INSTALL()
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
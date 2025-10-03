'use client'

import { useState, useEffect } from "react"
import { API_BASE } from '@/lib/config'
import Image from "next/image"
import { normalizeImageUrl } from '@/lib/images'
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

export default function GadgetsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { add } = useCartStore()

  useEffect(() => {
    const fetchGadgets = async () => {
      setLoading(true)
      try {
        console.log('Fetching gadgets from API...')
  const res = await fetch(`${API_BASE}/products/`)
        
        if (!res.ok) {
          console.warn('API fetch failed, using mock data')
          throw new Error("Failed to fetch products")
        }
        
        const data = await res.json()
        console.log('API data received:', data)

        // Filter for gadgets
        const gadgets = data.filter((item: any) => {
          const name = (item.name || '').toLowerCase()
          const category = (item.category || '').toLowerCase()
          return name.includes('watch') || name.includes('tablet') || name.includes('smartwatch') ||
                 name.includes('ipad') || name.includes('apple watch') || name.includes('airpods') ||
                 name.includes('headphones') || name.includes('speaker') || name.includes('charger') ||
                 category.includes('gadget') || category.includes('accessory')
        })

        const gadgetProducts: Product[] = gadgets.map((item: any) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          image: (item.images && item.images.length > 0 && item.images[0].image) ? 
                 item.images[0].image : (item.image || "/file.svg"),
          category: item.category || 'Gadget',
          brand: item.brand || 'Unknown'
        }))

        setProducts(gadgetProducts)
      } catch (error) {
        console.error("Error fetching gadgets, using mock data:", error)
        
        // Use mock data when API fails
        const mockGadgets: Product[] = [
          {
            id: 1,
            name: "Apple Watch Series 9",
            price: 429,
            image: "/file.svg",
            category: "Gadget",
            brand: "Apple"
          },
          {
            id: 2,
            name: "iPad Air M2",
            price: 599,
            image: "/file.svg",
            category: "Gadget",
            brand: "Apple"
          },
          {
            id: 3,
            name: "AirPods Pro 2",
            price: 249,
            image: "/file.svg",
            category: "Gadget",
            brand: "Apple"
          },
          {
            id: 4,
            name: "Samsung Galaxy Watch 6",
            price: 329,
            image: "/file.svg",
            category: "Gadget",
            brand: "Samsung"
          },
          {
            id: 5,
            name: "Kindle Paperwhite",
            price: 149,
            image: "/file.svg",
            category: "Gadget",
            brand: "Amazon"
          },
          {
            id: 6,
            name: "Google Nest Hub",
            price: 99,
            image: "/file.svg",
            category: "Gadget",
            brand: "Google"
          }
        ]
        
        setProducts(mockGadgets)
        toast.error("Using offline data - API connection failed")
      } finally {
        setLoading(false)
      }
    }
    fetchGadgets()
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
            <div className="text-2xl text-gray-400 font-mono">Loading gadgets.json...</div>
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
            <Link href="/" className="hover:text-purple-400">Home</Link>
            <span>→</span>
            <Link href="/products" className="hover:text-purple-400">Products</Link>
            <span>→</span>
            <span className="text-purple-400">Gadgets</span>
          </div>
          
          <h1 className="text-3xl font-mono font-bold text-purple-400 mb-2">
            {'>'} gadgets.initialize()
          </h1>
          <p className="text-gray-400 font-mono">
            Loaded {products.length} devices | Smart technology ecosystem
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl text-gray-700 mb-4 font-mono">EMPTY</div>
            <p className="text-xl text-gray-400 font-mono">No gadgets in inventory</p>
            <p className="text-sm text-gray-500 font-mono mt-2">status: awaiting shipment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="bg-gray-900 border-gray-700 hover:border-purple-500/50 transition-all duration-300">
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
                    <h3 className="font-mono text-sm text-purple-400 truncate">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 font-mono">
                      Brand: {product.brand || 'Generic'}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-orange-400 text-lg">
                        ${product.price}
                      </span>
                      <Button
                        size="sm"
                        onClick={() => handleAddToCart(product)}
                        className="bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs"
                      >
                        ACQUIRE()
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
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

// Mock data for accessories
const mockAccessories: Product[] = [
  {
    id: 1,
    name: "Wireless Charger",
    price: 39,
    image: "/file.svg",
    category: "Accessories",
    brand: "Samsung"
  },
  {
    id: 2,
    name: "Phone Case Pro",
    price: 29,
    image: "/file.svg",
    category: "Accessories",
    brand: "Apple"
  },
  {
    id: 3,
    name: "USB-C Cable",
    price: 19,
    image: "/file.svg",
    category: "Accessories",
    brand: "Anker"
  },
  {
    id: 4,
    name: "Screen Protector",
    price: 15,
    image: "/file.svg",
    category: "Accessories",
    brand: "Belkin"
  },
  {
    id: 5,
    name: "Power Bank 10000mAh",
    price: 49,
    image: "/file.svg",
    category: "Accessories",
    brand: "Anker"
  },
  {
    id: 6,
    name: "Car Mount",
    price: 25,
    image: "/file.svg",
    category: "Accessories",
    brand: "iOttie"
  }
]

export default function AccessoriesPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { add } = useCartStore()

  useEffect(() => {
    const fetchAccessories = async () => {
      try {
        console.log("Fetching accessories from API...")
  const res = await fetch(`${API_BASE}/products/`)
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        
        const data = await res.json()
        console.log("API Response:", data)

        // Filter for accessories
        const accessories = data.filter((item: any) => {
          const name = (item.name || '').toLowerCase()
          const category = (item.category || '').toLowerCase()
          return name.includes('charger') || name.includes('fast') || 
                 name.includes('wireless charger') || name.includes('samsung') ||
                 name.includes('case') || name.includes('cover') || 
                 name.includes('cable') || name.includes('adapter') ||
                 name.includes('mouse') || name.includes('keyboard') || 
                 name.includes('protector') || category.includes('accessor') || 
                 name.includes('stand') || name.includes('holder') || 
                 name.includes('pad') || name.includes('sleeve') || name.includes('bag')
        })

        const accessoryProducts: Product[] = accessories.map((item: any) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          image: (item.images && item.images.length > 0 && item.images[0].image) ? 
                 item.images[0].image : (item.image || "/file.svg"),
          category: item.category_name || item.category || "Accessories",
          brand: item.brand_name || item.brand || "",
        }))

        setProducts(accessoryProducts)
      } catch (err) {
        toast("Failed to load accessories")
      } finally {
        setLoading(false)
      }
    }
    fetchAccessories()
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
            <div className="text-2xl text-gray-400 font-mono">Indexing accessories...</div>
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
            <Link href="/" className="hover:text-blue-400">Home</Link>
            <span>→</span>
            <Link href="/products" className="hover:text-blue-400">Products</Link>
            <span>→</span>
            <span className="text-blue-400">Accessories</span>
          </div>
          
          <h1 className="text-3xl font-mono font-bold text-blue-400 mb-2">
            {'>'} accessories.list()
          </h1>
          <p className="text-gray-400 font-mono">
            Found {products.length} items | Hardware extensions & peripherals
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl text-gray-700 mb-4 font-mono">VOID</div>
            <p className="text-xl text-gray-400 font-mono">Accessories not found</p>
            <p className="text-sm text-gray-500 font-mono mt-2">error: module not loaded</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="bg-gray-900 border-gray-700 hover:border-blue-500/50 transition-all duration-300">
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
                    <h3 className="font-mono text-sm text-blue-400 truncate">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 font-mono">
                      Vendor: {product.brand || 'OEM'}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-cyan-400 text-lg">
                        ${product.price}
                      </span>
                      <Button
                        size="sm"
                        onClick={() => handleAddToCart(product)}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs"
                      >
                        ATTACH()
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
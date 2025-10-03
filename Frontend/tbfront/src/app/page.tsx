'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import ProductCard from "@/components/ProductCard"
import { getFeaturedProducts } from "@/lib/products"

export default function Page() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [checkoutStatus, setCheckoutStatus] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      try {
        console.log('Starting to fetch products...')
        const data = await getFeaturedProducts()
        console.log('Products loaded:', data) // Debug log
        setProducts(data)
        if (data.length === 0) {
          console.warn('No products returned from API')
        }
      } catch (e) {
        console.error('Error loading products:', e)
        toast.error("Failed to load products")
      } finally {
        setLoading(false)
        console.log('Loading finished')
      }
    })()
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      const status = url.searchParams.get('checkout')
      if (status) {
        setCheckoutStatus(status)
        // clean the query for a nicer URL
        url.searchParams.delete('checkout')
        window.history.replaceState({}, '', url.toString())
      }
    }
  }, [])

  const categories = [
    { title: "Smartphones", href: "/smartphones", icon: "📱", count: "5+" },
    { title: "Laptops", href: "/laptops", icon: "💻", count: "3+" },
    { title: "Gaming", href: "/tools", icon: "🎮", count: "4+" },
    { title: "Gadgets", href: "/gadgets", icon: "⌚", count: "2+" },
    { title: "Accessories", href: "/accessories", icon: "🔌", count: "3+" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Checkout status */}
      {checkoutStatus === 'success' && (
        <div className="bg-green-50 text-green-800 border-b border-green-200">
          <div className="container mx-auto px-6 py-3 text-center">Payment successful. Thank you!</div>
        </div>
      )}
      {checkoutStatus === 'cancelled' && (
        <div className="bg-yellow-50 text-yellow-800 border-b border-yellow-200">
          <div className="container mx-auto px-6 py-3 text-center">Checkout cancelled.</div>
        </div>
      )}

      {/* Hero Section */}
      <section className="bg-background border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              🚀 Free shipping on orders over $99
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
              TechBuilder
              <span className="text-blue-600"> Store</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Discover the latest in technology. From smartphones to laptops, find everything you need for your tech setup.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/products">Shop Now</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#categories">Browse Categories</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Shop by Category</h2>
            <p className="text-muted-foreground">Find exactly what you're looking for</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((category) => (
              <Link key={category.href} href={category.href} className="group">
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-800 hover:border-blue-200 text-center">
                  <div className="text-4xl mb-4">{category.icon}</div>
                  <h3 className="font-semibold text-foreground group-hover:text-blue-600 transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{category.count} products</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Featured Products</h2>
            <p className="text-muted-foreground">Our most popular items</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-80 animate-pulse"></div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                {products.slice(0, 8).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <div className="text-center">
                <Button asChild variant="outline" size="lg">
                  <Link href="/products">View All Products</Link>
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No products available at the moment.</p>
              <Button asChild>
                <Link href="/products">Check Products Page</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Free Shipping</h3>
              <p className="text-muted-foreground">Free delivery on orders over $99</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Warranty</h3>
              <p className="text-muted-foreground">2-year warranty on all products</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-muted-foreground">Customer support when you need it</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import ProductCard from "@/components/ProductCard"
import { getFeaturedProducts } from "@/lib/products"
import { normalizeImageUrl } from '@/lib/images'

export default function Page() {
  toast('')
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [heroImage, setHeroImage] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      try {
        const data = await getFeaturedProducts()
        setProducts(data)

        // Set iPhone 17 as hero image or find iPhone in products
        const iphone = data.find((it:any) => (it.name || '').toLowerCase().includes('iphone'))
        const chosen = iphone || (data.length > 0 ? data[0] : null)
        // Use high-quality iPhone concept image
        setHeroImage('https://images.unsplash.com/photo-1601972602288-3895d0d6c1f4?w=800&q=80') // Modern iPhone in elegant setting
      } catch (e) {
        console.error(e)
        toast("Failed to load featured products")
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <div className="flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Hero Section - Clean & Engineering Focused */}
      <section className="relative w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 opacity-50"></div>
        
        <div className="container mx-auto px-6 z-10 py-16">
          {/* Hero Header */}
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              Engineering Excellence
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              Professional
              <span className="text-blue-600 dark:text-blue-400"> Tech Solutions</span>
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Curated selection of enterprise-grade technology products for developers, engineers, and tech professionals.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{products.length}+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Products</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">10+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Brands</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">99.9%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">24/7</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Support</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
              asChild
            >
              <Link href="/products">Browse Catalog</Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 px-8 py-3"
              asChild
            >
              <Link href="/categories">View Categories</Link>
            </Button>
          </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Product Categories</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Browse our carefully curated selection of professional-grade technology products
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <Link href="/smartphones" className="group">
              <div className="bg-white dark:bg-gray-700 rounded-lg p-6 text-center hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors">
                  <span className="text-2xl">📱</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Smartphones</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Latest devices</p>
              </div>
            </Link>

            <Link href="/laptops" className="group">
              <div className="bg-white dark:bg-gray-700 rounded-lg p-6 text-center hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors">
                  <span className="text-2xl">💻</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Laptops</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Pro machines</p>
              </div>
            </Link>

            <Link href="/tools" className="group">
              <div className="bg-white dark:bg-gray-700 rounded-lg p-6 text-center hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 dark:group-hover:bg-green-800/50 transition-colors">
                  <span className="text-2xl">🎮</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Gaming</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Pro gear</p>
              </div>
            </Link>

            <Link href="/gadgets" className="group">
              <div className="bg-white dark:bg-gray-700 rounded-lg p-6 text-center hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/50 transition-colors">
                  <span className="text-2xl">⌚</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Gadgets</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Smart tech</p>
              </div>
            </Link>

            <Link href="/accessories" className="group">
              <div className="bg-white dark:bg-gray-700 rounded-lg p-6 text-center hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 dark:group-hover:bg-orange-800/50 transition-colors">
                  <span className="text-2xl">🔌</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Accessories</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Essential add-ons</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Featured Products</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Hand-picked selection of our most popular and innovative tech products
            </p>
          </div>
                        const target = e.target as HTMLImageElement
                        target.src = 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 via-transparent to-purple-500/20 rounded-2xl"></div>
                    
                    {/* iPhone 17 Product Label */}
                    <div className="absolute top-6 left-6 bg-gradient-to-r from-cyan-500/90 to-blue-500/90 backdrop-blur-xl rounded-lg px-4 py-2 border border-cyan-400/30">
                      <div className="text-white font-mono text-sm font-bold">iPhone 17 Pro</div>
                      <div className="text-cyan-200 font-mono text-xs">Coming 2025</div>
                    </div>
                    
                    {/* Floating indicators */}
                    <div className="absolute top-4 right-4 w-3 h-3 bg-cyan-400 rounded-full animate-ping"></div>
                    <div className="absolute bottom-6 left-6 w-2 h-2 bg-purple-400 rounded-full animate-ping delay-500"></div>
                    <div className="absolute top-1/3 left-4 w-2 h-2 bg-blue-400 rounded-full animate-ping delay-1000"></div>
                  </div>
                </div>
                
                {/* Floating icons - using simple text instead of emojis */}
                <div className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center animate-bounce">
                  <span className="text-white text-xl font-bold">⚡</span>
                </div>
                <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center animate-bounce delay-300">
                  <span className="text-white text-xl font-bold">◈</span>
                </div>
                <div className="absolute top-1/2 -right-4 w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center animate-bounce delay-700">
                  <span className="text-white text-sm font-bold">✦</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="relative py-24 bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl">
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400 text-sm font-semibold backdrop-blur-sm">
                PREMIUM COLLECTION
              </span>
            </div>
            <h2 className="text-5xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
              FEATURED TECH
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Discover our handpicked selection of cutting-edge devices that define the future of technology
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
                <div className="absolute top-2 left-2 w-12 h-12 border-4 border-purple-500/30 border-b-purple-500 rounded-full animate-spin"></div>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">◎</span>
              </div>
              <p className="text-slate-500 text-lg">No featured products found. Check back soon!</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map((p, index) => (
                  <div key={p.id} className="group relative" style={{animationDelay: `${index * 100}ms`}}>
                    <div className="relative transform hover:scale-105 transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 group-hover:border-cyan-500/50 transition-all duration-300 overflow-hidden">
                        <ProductCard product={p} />
                        <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-br from-cyan-500/30 to-transparent"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-16">
                <Link href="/products">
                  <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold px-10 py-4 rounded-2xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 transform hover:scale-105 border border-purple-400/50">
                    <span className="flex items-center gap-3">
                      VIEW ALL PRODUCTS
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                      </svg>
                    </span>
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="relative py-24 bg-gradient-to-r from-slate-900 via-blue-900/20 to-purple-900/20">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-pulse delay-1000"></div>
        </div>
        
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-xl border border-cyan-500/30 mb-8">
              <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full animate-pulse"></div>
              <span className="text-cyan-400 font-bold">EXCLUSIVE ACCESS PROTOCOL</span>
              <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-cyan-500 rounded-full animate-pulse delay-500"></div>
            </div>
            
            <h3 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-6">
              JOIN THE TECH REVOLUTION
            </h3>
            <p className="text-xl text-slate-300 mb-10 leading-relaxed">
              Get early access to our weekly drops, exclusive deals, and be the first to experience tomorrow's technology today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
              <div className="relative flex-1 w-full sm:w-auto">
                <input 
                  type="email" 
                  placeholder="Enter your quantum email address"
                  className="w-full px-6 py-4 rounded-2xl bg-slate-800/50 backdrop-blur-xl border border-slate-600/50 focus:border-cyan-500/50 text-white placeholder-slate-400 outline-none transition-all duration-300"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
              <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 transform hover:scale-105 border border-cyan-400/50 whitespace-nowrap">
                ACTIVATE ACCESS
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-500/5 to-blue-500/5 backdrop-blur-sm border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300">
                <div className="text-3xl mb-3">◈</div>
                <h4 className="text-lg font-bold text-cyan-400 mb-2">Quantum Deals</h4>
                <p className="text-slate-400 text-sm">Access interdimensional discounts before they materialize</p>
              </div>
              <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/5 to-pink-500/5 backdrop-blur-sm border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
                <div className="text-3xl mb-3">⚡</div>
                <h4 className="text-lg font-bold text-purple-400 mb-2">Neural Updates</h4>
                <p className="text-slate-400 text-sm">Direct-to-brain notifications about the latest tech drops</p>
              </div>
              <div className="p-6 rounded-2xl bg-gradient-to-br from-green-500/5 to-emerald-500/5 backdrop-blur-sm border border-green-500/20 hover:border-green-500/40 transition-all duration-300">
                <div className="text-3xl mb-3">✦</div>
                <h4 className="text-lg font-bold text-green-400 mb-2">VIP Protocol</h4>
                <p className="text-slate-400 text-sm">Elite member benefits and priority access to future tech</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

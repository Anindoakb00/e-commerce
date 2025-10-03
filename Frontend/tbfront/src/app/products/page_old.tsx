'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { normalizeImageUrl } from '@/lib/images'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { useSearchParams, useRouter } from 'next/navigation'
import { useCartStore } from '@/app/store/cartStore'


type Product = {
  id: number
  name: string
  price: number
  image: string
  category: string
  brand: string
  categorySlug?: string
}

const ProductListingPage = () => {
  toast("");
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null)
  const [sortOption, setSortOption] = useState<string>("default")

  const searchParams = useSearchParams()
  const router = useRouter()

  
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:8000/api/products/");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        console.debug('Fetched products count:', data.length);

        function slugify(s: string) { return (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') }
        function inferCategorySlug(name: string, categoryFromApi: string) {
          const apiSlug = slugify(categoryFromApi || '')
          if (apiSlug) return apiSlug
          const lower = (name || '').toLowerCase()
          const mapping: Record<string,string[]> = {
            laptops: ['laptop','macbook','notebook','dell','lenovo','asus','acer','hp'],
            gadgets: ['tablet','watch','smartwatch','charger','headphone','headphones','monitor','speaker','ssd','camera'],
            accessories: ['case','cover','charger','cable','adapter','mouse','keyboard','protector'],
            tools: ['tool','screwdriver','wrench','drill']
          }
          for (const [slug, kws] of Object.entries(mapping)) {
            for (const kw of kws) if (lower.includes(kw)) return slug
          }
          return ''
        }
        const products: Product[] = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          image: (item.images && item.images.length > 0 && item.images[0].image) ? item.images[0].image : (item.image || "/file.svg"),
          category: item.category_name || item.category || "",
          categorySlug: inferCategorySlug(item.name, item.category_name || item.category || ""),
          brand: item.brand_name || item.brand || "",
        }));

        try {
          products.forEach(p => console.debug('product mapped:', { id: p.id, name: p.name, category: p.category, categorySlug: p.categorySlug, imageRaw: p.image, imageNormalized: normalizeImageUrl(p.image) }));
        } catch(e) { console.error('Product debug log failed', e) }
        setProducts(products);
        setFilteredProducts(products);
      } catch (err) {
        toast("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  
  useEffect(() => {
    let result = [...products]

    if (selectedCategory) {
      const catLower = selectedCategory.toLowerCase()
      result = result.filter((p) => (p as any).categorySlug === catLower)
    }
    if (selectedBrand) {
      result = result.filter((p) => p.brand === selectedBrand)
    }

    if (sortOption === "price_low") {
      result.sort((a, b) => a.price - b.price)
    } else if (sortOption === "price_high") {
      result.sort((a, b) => b.price - a.price)
    } else if (sortOption === "newest") {
      result.sort((a, b) => b.id - a.id) 
    }

    setFilteredProducts(result)
  }, [products, selectedCategory, selectedBrand, sortOption])

  useEffect(() => {
    const cat = searchParams.get('category')
    setSelectedCategory(cat ? cat : null)
  }, [searchParams])

  const add = useCartStore(s=>s.add)

  // Get unique categories and brands
  const categories = [...new Set(products.map(p => p.category))].filter(Boolean)
  const brands = [...new Set(products.map(p => p.brand))].filter(Boolean)

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="container mx-auto py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-4 font-mono">
            <Link href="/" className="hover:text-cyan-400">Home</Link>
            <span>→</span>
            <span className="text-cyan-400">Products</span>
          </div>
          
          <h1 className="text-4xl font-mono font-bold text-cyan-400 mb-2">
            {'>'} products.query()
          </h1>
          <p className="text-gray-400 font-mono">
            Database contains {filteredProducts.length} records | Total inventory: {products.length}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Filters Sidebar */}
          <div className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="pb-3">
                <h2 className="text-lg font-mono text-green-400">Filter.exe</h2>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Category Filter */}
                <div>
                  <label className="text-sm font-mono text-gray-400 mb-2 block">Category:</label>
                  <Select value={selectedCategory || ""} onValueChange={(value) => setSelectedCategory(value || null)}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-100 font-mono">
                      <SelectValue placeholder="SELECT *" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="" className="text-gray-100 font-mono">All Categories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat} className="text-gray-100 font-mono">
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Category Checkboxes with tech styling */}
                <div className="mb-6">
                  <h3 className="font-mono text-sm text-cyan-400 mb-3">Categories:</h3>
                  {[
                    { name: "Smartphones", color: "text-pink-400", slug: "smartphones" },
                    { name: "Laptops", color: "text-cyan-400", slug: "laptops" },
                    { name: "Gaming", color: "text-green-400", slug: "gaming" },
                    { name: "Tech Gadgets", color: "text-purple-400", slug: "gadgets" },
                    { name: "Accessories", color: "text-blue-400", slug: "accessories" }
                  ].map((cat) => (
                    <label key={cat.name} className="flex items-center gap-2 mb-2">
                      <Checkbox
                        checked={selectedCategory?.toLowerCase() === cat.slug}
                        onCheckedChange={() => {
                          const newCat = selectedCategory?.toLowerCase() === cat.slug ? null : cat.name
                          setSelectedCategory(newCat)
                          if (newCat) router.push(`/products?category=${encodeURIComponent(cat.slug)}`)
                          else router.push('/products')
                        }}
                        className="border-gray-600"
                      />
                      <span className={`font-mono text-sm ${cat.color}`}>{cat.name}</span>
                    </label>
                  ))}
                </div>

                {/* Brand Filter */}
                <div className="mb-6">
                  <h3 className="font-mono text-sm text-cyan-400 mb-3">Brand:</h3>
                  {["Dell", "Sony", "Apple", "Logitech"].map((brand) => (
                    <label key={brand} className="flex items-center gap-2 mb-2">
                      <Checkbox
                        checked={selectedBrand === brand}
                        onCheckedChange={() => setSelectedBrand(selectedBrand === brand ? null : brand)}
                        className="border-gray-600"
                      />
                      <span className="font-mono text-sm text-gray-300">{brand}</span>
                    </label>
                  ))}
                </div>

                {/* Clear Filters */}
                <Button 
                  onClick={() => {
                    setSelectedCategory(null)
                    setSelectedBrand(null)
                    setSortOption("default")
                  }}
                  variant="outline" 
                  className="w-full font-mono border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                >
                  CLEAR()
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Sort Options */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm font-mono text-gray-400">
                ORDER BY:
              </div>
              <Select onValueChange={setSortOption} defaultValue="default">
                <SelectTrigger className="w-[200px] bg-gray-800 border-gray-700 text-gray-100 font-mono">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="default" className="font-mono text-gray-100">Default</SelectItem>
                  <SelectItem value="price_low" className="font-mono text-gray-100">Price: Low → High</SelectItem>
                  <SelectItem value="price_high" className="font-mono text-gray-100">Price: High → Low</SelectItem>
                  <SelectItem value="newest" className="font-mono text-gray-100">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loading ? (
              <div className="text-center py-20">
                <div className="text-2xl text-gray-400 font-mono">Executing query...</div>
                <div className="text-sm text-gray-500 font-mono mt-2">SELECT * FROM products;</div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl text-gray-700 mb-4 font-mono">404</div>
                <p className="text-xl text-gray-400 font-mono">No results found</p>
                <p className="text-sm text-gray-500 font-mono mt-2">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="bg-gray-900 border-gray-800 hover:border-cyan-500/50 transition-all duration-300 group">
                    <CardContent className="p-4">
                      <div 
                        className="aspect-square bg-gray-800 rounded-lg mb-4 overflow-hidden cursor-pointer"
                        onClick={() => router.push(`/products/${product.id}`)}
                      >
                        <img
                          src={normalizeImageUrl(product.image)}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => { const t = e.currentTarget as HTMLImageElement; console.error('List product image failed:', t.src); t.src = '/file.svg' }}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-mono text-sm text-cyan-400 line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="text-xs text-gray-500 font-mono">
                          {product.brand} | {product.category}
                        </p>
                        <div className="flex items-center justify-between pt-2">
                          <span className="font-mono text-green-400 text-lg">
                            ${product.price}
                          </span>
                          <Button
                            size="sm"
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              add(product, 1); 
                              toast(`${product.name} added to cart`) 
                            }}
                            className="bg-cyan-600 hover:bg-cyan-500 text-black font-mono text-xs"
                          >
                            ADD()
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Load More Button */}
            <div className="flex justify-center mt-10">
              <Button 
                variant="outline" 
                className="font-mono border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                LOAD_MORE()
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductListingPage

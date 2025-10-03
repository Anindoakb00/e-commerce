'use client'

import { useState, useEffect, useMemo } from "react"
import { API_BASE } from '@/lib/config'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import ProductCard from "@/components/ProductCard"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Product = {
  id: number
  name: string
  price: number
  // Normalized fields used by ProductCard
  image?: string
  slug?: string
  stock_qty?: number
  // Optional raw fields from API (kept for flexibility)
  images?: Array<{ image: string }>
  category?: string
  brand?: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<Array<{id:number; name:string}>>([])
  const [brands, setBrands] = useState<Array<{id:number; name:string}>>([])

  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedBrand, setSelectedBrand] = useState<string>("all")
  const [sort, setSort] = useState<string>("relevance")
  const [search, setSearch] = useState<string>("")

  const [page, setPage] = useState(1)
  const pageSize = 12

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        // Build query params from filters
        const params = new URLSearchParams()
        if (selectedCategory !== 'all') params.set('category', selectedCategory)
        if (selectedBrand !== 'all') params.set('brand', selectedBrand)
        if (sort === 'price_asc') params.set('ordering', 'price')
        if (sort === 'price_desc') params.set('ordering', '-price')
        if (search.trim()) params.set('search', search.trim())

        const url = `${API_BASE}/products/${params.toString() ? `?${params.toString()}` : ''}`
        const res = await fetch(url)
        if (!res.ok) throw new Error("Failed to fetch products")
        const data = await res.json()

        // Normalize API items to the shape ProductCard expects
        const normalized = (Array.isArray(data) ? data : []).map((item: any) => ({
          id: item.id,
          name: item.name,
          slug: item.slug,
          price: item.price,
          stock_qty: item.stock_qty,
          image: (item?.images && item.images.length > 0 && item.images[0].image)
            ? item.images[0].image
            : (item?.image || '/file.svg'),
          category: item.category || item.category_name || '',
          brand: item.brand || item.brand_name || '',
        }))

        console.log('Fetched products (normalized):', normalized)
        setProducts(normalized)
        setPage(1) // reset to first page on new query
      } catch (error) {
        console.error("Error fetching products:", error)
        toast.error("Failed to load products")
      } finally {
        setLoading(false)
      }
    }

    const fetchMeta = async () => {
      try {
        const [cRes, bRes] = await Promise.all([
          fetch(`${API_BASE}/categories/`),
          fetch(`${API_BASE}/brands/`)
        ])
        if (cRes.ok) setCategories(await cRes.json());
        if (bRes.ok) setBrands(await bRes.json());
      } catch (e) { /* non-fatal */ }
    }

    fetchProducts()
    fetchMeta()
  }, [selectedCategory, selectedBrand, sort, search])

  const pageCount = useMemo(() => Math.max(1, Math.ceil(products.length / pageSize)), [products.length])
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize
    return products.slice(start, start + pageSize)
  }, [products, page])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/" className="text-blue-600 hover:text-blue-800">← Back to Home</Link>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">All Products</h1>
          <p className="text-muted-foreground">Browse our complete collection of tech products</p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-6 py-8">
        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Input
              placeholder="Search products…"
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
            />
          </div>
          <div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map(c=> (
                  <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select value={selectedBrand} onValueChange={setSelectedBrand}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Brand" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All brands</SelectItem>
                {brands.map(b=> (
                  <SelectItem key={b.id} value={String(b.id)}>{b.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Sort" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm h-80 animate-pulse"></div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginated.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-foreground mb-2">No products found</h3>
            <p className="text-muted-foreground mb-6">We couldn't find any products at the moment.</p>
            <Button asChild>
              <Link href="/">Go Back Home</Link>
            </Button>
          </div>
        )}


        {/* Pagination */}
        {products.length > 0 && (
          <div className="mt-10 flex items-center justify-between">
            <p className="text-muted-foreground">
              Showing {(page-1)*pageSize + 1}-{Math.min(page*pageSize, products.length)} of {products.length}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" disabled={page===1} onClick={()=>setPage(p=>Math.max(1,p-1))}>Previous</Button>
              <Button variant="outline" disabled={page===pageCount} onClick={()=>setPage(p=>Math.min(pageCount,p+1))}>Next</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


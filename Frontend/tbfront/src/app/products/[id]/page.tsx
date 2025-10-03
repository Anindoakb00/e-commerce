'use client'

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { normalizeImageUrl } from '@/lib/images'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { useCartStore } from "@/store/cartStore"
import { getAllProducts, getProductById } from '@/lib/products'
import { useRouter } from 'next/navigation'
import ReviewCard from "@/components/ReviewCard"


type Product = {
  id: number
  name: string
  price: number
  description: string
  images: string[]
  specs: string
}

type Review = {
  id: number
  user: string
  comment: string
  rating: number
  date?: string
}

const ProductDetailsPage = () => {
  //
  const params = useParams()
  const productId = params?.id 

  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [reviewText, setReviewText] = useState("")
  const [related, setRelated] = useState<any[]>([])
  const router = useRouter()

  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        
        // Use shared product helper to get normalized product (includes categorySlug)
        const pid = Number(productId)
        const prod = await getProductById(pid)
        const product: Product = {
          id: prod.id,
          name: prod.name,
          price: prod.price,
          description: prod.description || "",
          images: prod.images || ["/file.svg"],
          specs: prod.specs || "",
        }
        setProduct(product)
        console.debug('Product fetched via helper:', { id: prod.id, name: prod.name, category: prod.category, categorySlug: prod.categorySlug })
        try { (product.images||[]).forEach(i=>console.debug('product detail image raw:', i, 'normalized:', normalizeImageUrl(i))) } catch(e) {}

        
  const { API_BASE } = await import('@/lib/config')
  const reviewsRes = await fetch(`${API_BASE}/products/${productId}/reviews/`);
        let reviews: Review[] = [];
        if (reviewsRes.ok) {
          const reviewsData = await reviewsRes.json();
          reviews = reviewsData.map((r: any) => ({
            id: r.id,
            user: r.user || r.username || "User",
            comment: r.comment,
            rating: r.rating,
            date: r.date || r.created_at || "",
          }));
        }
        setReviews(reviews);
        try {
          // fetch all products and pick 2-3 random products (excluding current)
          const all = await getAllProducts()
          const candidates = all.filter((r:any) => r.id !== prod.id)
          // shuffle
          for (let i = candidates.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[candidates[i], candidates[j]] = [candidates[j], candidates[i]]
          }
          const pickCount = Math.min(4, candidates.length)
          const rel = candidates.slice(0, pickCount)
          setRelated(rel)
        } catch(e) { console.error('Failed to fetch related', e) }
      } catch (err) {
        toast("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [productId]);

  const add = useCartStore((s) => s.add)
  const handleAddToCart = () => {
    if (product) {
      
      const productForCart = {
        ...product,
  image: product.images && product.images.length > 0 ? product.images[0] : "/file.svg",
      };
      add(productForCart, 1)
      toast(`${product.name} added to cart`)
    }
  }

  const handleBuyNow = () => {
    toast( `Proceeding to checkout for ${product?.name}` )
  }

  const handleReviewSubmit = () => {
    if (!reviewText) {
      toast( "Review cannot be empty" )
      return
    }
    const newReview: Review = {
      id: reviews.length + 1,
      user: "NSU",
      comment: reviewText,
      rating: 4,
      date: new Date().toISOString().split("T")[0],
    }
    setReviews([newReview, ...reviews])
    setReviewText("")
    toast( "Review submitted" )
  }

  const handleDeleteReview = (id: number) => {
    setReviews(reviews.filter((r) => r.id !== id))
    toast("Review deleted" )
  }

  const handleEditReview = (id: number) => {
    toast(`Editing review #${id}` )
  
  }

  if (loading) return <p className="text-center py-10">Loading...</p>

  if (!product) return <p className="text-center py-10">Product not found</p>

  return (
    <div className="container mx-auto py-10">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        
        <div className="flex flex-col gap-4">
          {product.images.map((img, i) => (
            <img
              key={i}
              src={normalizeImageUrl(img)}
              alt={product.name}
              width={500}
              height={400}
              className="rounded-md border"
              onError={(e)=>{ const t=e.currentTarget as HTMLImageElement; console.error('Detail image failed:', t.src); t.src='/file.svg'}}
            />
          ))}
        </div>

        
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-xl text-gray-700 mb-2">${product.price}</p>
          <p className="text-sm text-green-600 mb-6">In Stock</p>

          <div className="flex gap-4 mb-6">
            <Button onClick={handleAddToCart}>Add to Cart</Button>
            <Button variant="secondary" onClick={handleBuyNow}>
              Buy Now
            </Button>
          </div>

          
          <Tabs defaultValue="description" className="w-full">
            <TabsList>
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specs">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="description">
              <p>{product.description}</p>
            </TabsContent>

            <TabsContent value="specs">
              <p>{product.specs}</p>
            </TabsContent>

            <TabsContent value="reviews">
              <div className="flex flex-col gap-4">
                
                <div className="border p-4 rounded-md">
                  <Textarea
                    placeholder="Write your review..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                  />
                  <Button className="mt-2" onClick={handleReviewSubmit}>
                    Submit Review
                  </Button>
                </div>

                
                {reviews.length === 0 ? (
                  <p>No reviews yet.</p>
                ) : (
                  reviews.map((rev) => (
                    <ReviewCard
                      key={rev.id}
                      review={rev}
                      onDelete={handleDeleteReview}
                      onEdit={handleEditReview}
                    />
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      
      <section className="mt-16">
        <h2 className="text-2xl font-semibold mb-6">Related Products</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, idx) => {
            const p = related[idx]
            if (!p) {
              return (
                <Card key={`empty-${idx}`} className="p-4 text-center">
                  <div className="mx-auto mb-4 rounded-md overflow-hidden w-48 h-36 bg-gray-100 flex items-center justify-center">
                    <img src="/file.svg" alt="Placeholder" className="w-full h-full object-cover" />
                  </div>
                  <p className="font-medium">Related Product</p>
                </Card>
              )
            }
            return (
              <Card key={p.id} className="p-4 text-center cursor-pointer" onClick={()=>router.push(`/products/${p.id}`)}>
                <div className="mx-auto mb-4 rounded-md overflow-hidden w-48 h-36 bg-gray-100 flex items-center justify-center">
                  <img src={normalizeImageUrl(p.image)} alt={p.name} className="w-full h-full object-cover" onError={(e)=>{ const t=e.currentTarget as HTMLImageElement; t.src='/file.svg'}} />
                </div>
                <p className="font-medium">{p.name}</p>
              </Card>
            )
          })}
        </div>
      </section>
    </div>
  )
}

export default ProductDetailsPage

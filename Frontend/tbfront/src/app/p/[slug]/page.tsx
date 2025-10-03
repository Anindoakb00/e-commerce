'use client'

import { useEffect, useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { API_BASE } from '@/lib/config'
import { normalizeImageUrl } from '@/lib/images'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/store/cartStore'

export default function ProductBySlugPage() {
  const { slug } = useParams<{slug:string}>()
  const [data, setData] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const add = useCartStore(s=>s.add)
  const router = useRouter()

  useEffect(()=>{
    (async ()=>{
      try {
        const res = await fetch(`${API_BASE}/products/by-slug/${slug}/`)
        if (!res.ok) throw new Error('Not found')
        const it = await res.json()
        setData(it)
      } catch(e) {
        router.replace('/products')
      } finally {
        setLoading(false)
      }
    })()
  }, [slug])

  if (loading) return <div className="container mx-auto px-6 py-10">Loading…</div>
  if (!data) return null

  const images = Array.isArray(data.images) ? data.images.map((im:any)=>im.image) : []
  const outOfStock = typeof data.stock_qty === 'number' && data.stock_qty <= 0
  const jsonLd = useMemo(()=>({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: data.name,
    image: images.map((u:string)=>normalizeImageUrl(u)),
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: data.price,
      availability: 'https://schema.org/InStock',
    }
  }), [data?.name, data?.price, images.join('|')])

  return (
    <div className="container mx-auto px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          {images.map((src:string, i:number)=> (
            <img key={i} src={normalizeImageUrl(src)} alt={data.name} className="rounded border" onError={(e)=>{ (e.currentTarget as HTMLImageElement).src='/file.svg' }} />
          ))}
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">{data.name}</h1>
          <p className="text-xl mb-4">${data.price}</p>
          <Button disabled={outOfStock} onClick={()=>add({ id:data.id, name:data.name, price:data.price, image: images[0]||'/file.svg' }, 1)}>
            {outOfStock ? 'Out of stock' : 'Add to cart'}
          </Button>
        </div>
      </div>
    </div>
  )
}

import { API_BASE } from '@/lib/config'
import ProductCard from '@/components/ProductCard'

type Params = { params: { slug: string } }

export async function generateMetadata({ params }: Params) {
  const slug = params.slug
  const title = `${slug.replace(/-/g,' ').replace(/^./, c=>c.toUpperCase())} | TechBuilder`
  const description = `Browse ${slug.replace(/-/g,' ')} at TechBuilder. Find the best products in ${slug.replace(/-/g,' ')}.`
  const canonical = `/c/${slug}`
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'TechBuilder',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

async function fetchByCategory(slug: string) {
  const res = await fetch(`${API_BASE}/products/?category_slug=${slug}`, { next: { revalidate: 60 } })
  if (!res.ok) return [] as any[]
  const data = await res.json()
  return (Array.isArray(data) ? data : []).map((item: any) => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    price: item.price,
    image: (item?.images && item.images.length > 0 && item.images[0].image) ? item.images[0].image : '/file.svg'
  }))
}

export default async function CategoryPage({ params }: Params) {
  const items = await fetchByCategory(params.slug)
  const title = params.slug.replace(/-/g,' ')
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${title} | TechBuilder`,
    url: `/c/${params.slug}`,
    isPartOf: { '@type': 'WebSite', name: 'TechBuilder' },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: items.map((p, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        url: p.slug ? `/p/${p.slug}` : `/products/${p.id}`,
        name: p.name,
      })),
    },
  }
  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6 capitalize">{title}</h1>
      {items.length === 0 ? (
        <p className="text-muted-foreground">No products found in this category.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  )
}

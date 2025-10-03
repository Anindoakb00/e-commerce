import type { MetadataRoute } from 'next'
import { API_BASE } from '@/lib/config'

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://127.0.0.1:3000').replace(/\/$/, '')

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const entries: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${SITE_URL}/products`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
  ]

  try {
    const [catRes, prodRes] = await Promise.all([
      fetch(`${API_BASE}/categories/`, { next: { revalidate: 300 } }),
      fetch(`${API_BASE}/products/`, { next: { revalidate: 300 } }),
    ])

    if (catRes.ok) {
      const cats = await catRes.json()
      if (Array.isArray(cats)) {
        for (const c of cats) {
          if (c?.slug) {
            entries.push({
              url: `${SITE_URL}/c/${c.slug}`,
              lastModified: now,
              changeFrequency: 'daily',
              priority: 0.8,
            })
          }
        }
      }
    }

    if (prodRes.ok) {
      const prods = await prodRes.json()
      if (Array.isArray(prods)) {
        for (const p of prods) {
          const path = p?.slug ? `/p/${p.slug}` : `/products/${p?.id}`
          entries.push({
            url: `${SITE_URL}${path}`,
            lastModified: now,
            changeFrequency: 'daily',
            priority: 0.7,
          })
        }
      }
    }
  } catch {
    // Best-effort; keep base entries if API is unavailable
  }

  return entries
}

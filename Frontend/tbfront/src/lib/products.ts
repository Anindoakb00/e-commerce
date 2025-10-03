import { BACKEND_ORIGIN, API_BASE } from './config'

function pickImage(item: any) {
  if (item.images && item.images.length > 0) return item.images[0].image || ''
  if (item.image) return item.image
  return ''
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  laptops: ['laptop','macbook','notebook','dell','lenovo','asus','acer','hp'],
  gadgets: ['tablet','watch','smartwatch','charger','headphone','headphones','monitor','speaker','ssd','camera'],
  accessories: ['case','cover','charger','cable','adapter','mouse','keyboard','protector'],
  tools: ['tool','screwdriver','wrench','drill']
}

function inferCategorySlug(name: string, categoryFromApi: string) {
  const apiSlug = slugify(categoryFromApi || '')
  if (apiSlug) return apiSlug
  const lower = (name || '').toLowerCase()
  for (const [slug, kws] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const kw of kws) if (lower.includes(kw)) return slug
  }
  return ''
}

export async function getFeaturedProducts() {
  try {
    const candidates = [
      `${API_BASE}/products/`,
      `http://127.0.0.1:8000/api/products/`,
      `http://localhost:8000/api/products/`,
    ]

    let data: any[] | null = null
    let lastError: any = null
    for (const url of candidates) {
      try {
        console.log('Fetching featured products from:', url)
        const res = await fetch(url, { mode: 'cors' })
        console.log('Response status:', res.status, res.statusText)
        if (!res.ok) {
          lastError = new Error(`Failed to fetch: ${res.status} ${res.statusText}`)
          continue
        }
        data = await res.json()
        break
      } catch (err) {
        lastError = err
      }
    }

    if (!data) {
      throw lastError || new Error('No data received from any endpoint')
    }

    console.log('Raw API data:', data)

    const items = data.slice(0, 8).map((it: any) => ({
      id: it.id,
      name: it.name,
      price: it.price,
      category: it.category_name || it.category || '',
      categorySlug: inferCategorySlug(it.name, it.category_name || it.category || ''),
      brand: it.brand_name || it.brand || '',
      image: pickImage(it) || '/file.svg',
    }))
    console.log('Processed items:', items)
    return items
  } catch (e) {
    console.error('getFeaturedProducts failed, falling back to mock data', e)
    // Safe fallback if API fails: return a tiny mock set
    const fallback = [
      { id: 1, name: 'iPhone 15 Pro Max', price: 1199.0, image: '/file.svg', category: 'Smartphones', brand: 'Apple' },
      { id: 2, name: 'MacBook Pro M3', price: 1999.0, image: '/file.svg', category: 'Laptops', brand: 'Apple' },
      { id: 3, name: 'Samsung Galaxy S24', price: 899.0, image: '/file.svg', category: 'Smartphones', brand: 'Samsung' },
      { id: 4, name: 'Apple Watch Series 9', price: 429.0, image: '/file.svg', category: 'Gadgets', brand: 'Apple' },
    ]
    return fallback
  }
}

export async function getAllProducts() {
  try {
    const res = await fetch(`${API_BASE}/products/`)
    if (!res.ok) throw new Error('Failed to fetch')
    const data = await res.json()
    return data.map((it: any) => ({
      id: it.id,
      name: it.name,
      price: it.price,
      category: it.category_name || it.category || '',
      categorySlug: inferCategorySlug(it.name, it.category_name || it.category || ''),
      brand: it.brand_name || it.brand || '',
      image: pickImage(it) || '/file.svg',
    }))
  } catch (e) {
    console.error('getAllProducts failed', e)
    return []
  }
}

export async function getProductById(id:number) {
  try {
    const res = await fetch(`${API_BASE}/products/${id}/`)
    if (!res.ok) throw new Error('Failed to fetch')
    const it = await res.json()
    return {
      id: it.id,
      name: it.name,
      price: it.price,
      description: it.description || '',
      images: (it.images && it.images.length > 0) ? it.images.map((im: any) => im.image || '/file.svg') : [it.image || '/file.svg'],
      category: it.category_name || it.category || '',
      categorySlug: inferCategorySlug(it.name, it.category_name || it.category || ''),
      specs: it.specs || '',
    }
  } catch (e) {
    console.error('getProductById failed', e)
    throw e
  }
}

"use client"
import { useEffect, useState } from 'react'
import { API_BASE } from '@/lib/config'
import { useAuthStore } from '@/store/authStore'

type OrderItem = { id: number; product_id: number | null; name: string; unit_price: string; quantity: number }
type Order = { id: number; status: string; currency: string; total_amount: string; email: string; created_at: string; items: OrderItem[] }

export default function OrdersPage() {
  const { accessToken } = useAuthStore()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        const res = await fetch(`${API_BASE}/my-orders/`, {
          headers: accessToken ? { Authorization: `JWT ${accessToken}` } : undefined
        })
        if (!res.ok) throw new Error('Failed to load orders')
        const data = await res.json()
        setOrders(data)
      } catch (e:any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    })()
  }, [accessToken])

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-4">My Orders</h1>
      {loading && <div>Loading…</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && !error && orders.length === 0 && <div>No orders yet.</div>}
      <div className="space-y-6">
        {orders.map(o => (
          <div key={o.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div><span className="font-semibold">#{o.id}</span> • {o.status} • {new Date(o.created_at).toLocaleString()}</div>
              <div className="font-semibold">{o.currency.toUpperCase()} ${o.total_amount}</div>
            </div>
            <div className="mt-3 text-sm text-muted-foreground">{o.email || 'no email'}</div>
            <div className="mt-4 space-y-2">
              {o.items.map(it => (
                <div key={it.id} className="flex justify-between text-sm">
                  <span>{it.name} × {it.quantity}</span>
                  <span>${it.unit_price}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

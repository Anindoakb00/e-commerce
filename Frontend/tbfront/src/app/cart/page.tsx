'use client'

import Link from "next/link"
import Image from "next/image"
import { normalizeImageUrl } from '@/lib/images'
import { Button } from "@/components/ui/button"
import { API_BASE } from '@/lib/config'
import { useCartStore } from "@/store/cartStore"
import { toast } from "sonner"
import { useEffect, useState } from 'react'
import { Input } from "@/components/ui/input"
import { useAuthStore } from '@/store/authStore'

export default function CartPage() {
  const { items, increment, decrement, remove, total } = useCartStore()
  const { accessToken, user } = useAuthStore()
  const [checkingOut, setCheckingOut] = useState(false)
  const [coupon, setCoupon] = useState("")
  const [couponInfo, setCouponInfo] = useState<{code:string; discount:number; type?: string} | null>(null)
  const [stripeConfig, setStripeConfig] = useState<{ configured: boolean; stripe_key_prefix?: string; frontend_origin?: string } | null>(null)
  const [backendStatus, setBackendStatus] = useState<string | null>(null)
  const subtotal = items.reduce((sum, it) => sum + it.product.price * it.qty, 0)
  const shipping: number = subtotal > 99 ? 0 : 9.99
  const taxes = +(subtotal * 0.08).toFixed(2)
  const finalTotal = subtotal + shipping + taxes

  // Preflight check to surface backend/Stripe readiness in the UI
  useEffect(() => {
    let ignore = false
    ;(async () => {
      try {
        const res = await fetch(`${API_BASE}/payments/config-check/`)
        const data = await res.json()
        if (!ignore) setStripeConfig(data)
      } catch (e:any) {
        if (!ignore) setBackendStatus(e?.message || 'Backend unreachable')
      }
    })()
    return () => { ignore = true }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Shopping Cart</h1>
          <p className="text-muted-foreground">
            {items.length === 0 ? 'Your cart is empty' : `${items.length} item${items.length > 1 ? 's' : ''} in your cart`}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {(!accessToken) ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-foreground mb-4">Please sign in</h3>
            <p className="text-muted-foreground mb-6">You need to login or create an account to proceed to checkout.</p>
            <div className="flex gap-3 justify-center">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Link href={`/login?next=${encodeURIComponent('/cart')}`}>Login</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href={`/register?next=${encodeURIComponent('/cart')}`}>Register</Link>
              </Button>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-foreground mb-4">Your cart is empty</h3>
            <p className="text-muted-foreground mb-6">Start shopping to add items to your cart</p>
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={normalizeImageUrl(item.product.image || '/file.svg')}
                        alt={item.product.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = '/file.svg'
                        }}
                      />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{item.product.name}</h3>
                      <p className="text-muted-foreground">${item.product.price}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => decrement(item.product.id)}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{item.qty}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => increment(item.product.id)}
                      >
                        +
                      </Button>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold">${(item.product.price * item.qty).toFixed(2)}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(item.product.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm p-6 sticky top-4">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                
                <div className="space-y-2 mb-4">
                  {/* Backend / Stripe status */}
                  {backendStatus && (
                    <div className="p-2 text-sm rounded bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300">
                      Backend error: {backendStatus}
                    </div>
                  )}
                  {stripeConfig && !stripeConfig.configured && (
                    <div className="p-2 text-sm rounded bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300">
                      Stripe is not configured. Set STRIPE_SECRET_KEY in backend .env to enable checkout.
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {couponInfo && (
                    <div className="flex justify-between text-green-700 dark:text-green-400">
                      <span>Coupon ({couponInfo.code})</span>
                      <span>- ${couponInfo.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{(shipping === 0 || couponInfo?.type === 'free_shipping') ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${taxes.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-800 pt-2">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>${(finalTotal - (couponInfo?.discount || 0)).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Coupon */}
                <div className="mb-4 flex gap-2">
                  <Input placeholder="Coupon code" value={coupon} onChange={(e)=>setCoupon(e.target.value)} />
                  <Button variant="outline" onClick={async()=>{
                    const code = coupon.trim()
                    if (!code) return
                    try {
                      const res = await fetch(`${API_BASE}/coupons/validate/`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ code, subtotal })
                      })
                      const data = await res.json()
                      if (!res.ok || data.valid === false) {
                        setCouponInfo(null)
                        toast.error(data.reason || 'Invalid coupon')
                        return
                      }
                      const discount = Number(data.discount || 0)
                      if (data.type === 'free_shipping') {
                        // For free shipping, treat discount as the current shipping amount
                        setCouponInfo({ code: data.code, discount: shipping, type: 'free_shipping' })
                        toast.success(`Applied free shipping (${data.code})`)
                      } else if (discount > 0) {
                        setCouponInfo({ code: data.code, discount, type: data.type })
                        toast.success(`Applied coupon ${data.code}`)
                      } else {
                        setCouponInfo(null)
                        toast.error('Coupon does not apply')
                      }
                    } catch (e) {
                      setCouponInfo(null)
                      toast.error('Failed to validate coupon')
                    }
                  }}>Apply</Button>
                </div>

                {subtotal < 99 && (
                  <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <p className="text-sm text-yellow-800 dark:text-yellow-300">
                      Add ${(99 - subtotal).toFixed(2)} more for free shipping!
                    </p>
                  </div>
                )}

                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white mb-3"
                  disabled={checkingOut || items.length === 0}
                  onClick={async () => {
                    try {
                      setCheckingOut(true)
                      const payload = {
                        items: items.map(it => ({ id: it.product.id, qty: it.qty })),
                        coupon: couponInfo?.code || undefined
                      }
                      const res = await fetch(`${API_BASE}/payments/create-checkout-session/`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}) },
                        body: JSON.stringify(payload)
                      })
                      const text = await res.text()
                      let data: any = null
                      try { data = text ? JSON.parse(text) : null } catch {}
                      if (!res.ok) {
                        const msg = data?.error || data?.detail || text || 'Failed to start checkout'
                        throw new Error(msg)
                      }
                      const url = data?.url
                      if (!url) throw new Error('Checkout session did not return a URL')
                      window.location.href = url
                    } catch (err) {
                      console.error(err)
                      const message = (err as Error)?.message || 'Failed to reach backend'
                      toast.error(message)
                    } finally {
                      setCheckingOut(false)
                    }
                  }}
                >
                  {checkingOut ? 'Redirecting…' : 'Proceed to Checkout'}
                </Button>
                
                {/* Dev test checkout button removed for production cleanliness */}

                <Button variant="outline" className="w-full" asChild>
                  <Link href="/products">Continue Shopping</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

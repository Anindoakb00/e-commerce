'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'

export default function CheckoutSuccess() {
  const clear = useCartStore(s=>s.clear)
  useEffect(()=>{ clear() }, [clear])
  return (
    <div className="container mx-auto px-6 py-16 text-center">
      <h1 className="text-3xl font-bold mb-2">Payment successful</h1>
      <p className="text-muted-foreground mb-6">Thanks for your order! A receipt has been sent to your email.</p>
      <Link href="/orders" className="text-blue-600 hover:underline">View your orders</Link>
    </div>
  )
}

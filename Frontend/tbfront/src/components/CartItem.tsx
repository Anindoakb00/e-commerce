'use client'

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/cartStore"
import { normalizeImageUrl } from '@/lib/images'

export default function CartItem({ item }: { item: { product:any; qty:number } }) {
  const { increment, decrement, remove } = useCartStore()
  return (
    <div className="flex items-center gap-4 border rounded-lg p-4">
      <img src={normalizeImageUrl(item.product.image)} alt={item.product.name} width={100} height={80} className="rounded"/>
      <div className="flex-1">
        <p className="font-medium">{item.product.name}</p>
        <p className="text-sm text-gray-500">${item.product.price}</p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={()=>decrement(item.product.id)}>-</Button>
        <span>{item.qty}</span>
        <Button variant="outline" size="sm" onClick={()=>increment(item.product.id)}>+</Button>
      </div>
      <Button variant="ghost" onClick={()=>remove(item.product.id)}>Remove</Button>
    </div>
  )
}

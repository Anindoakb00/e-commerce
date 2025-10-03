'use client'

import { create } from "zustand"

type Item = { product: any; qty: number }
type State = {
  items: Item[]
  total: number
  add: (product:any, qty:number)=>void
  increment: (id:number)=>void
  decrement: (id:number)=>void
  remove: (id:number)=>void
  clear: ()=>void
}

export const useCartStore = create<State>((set,get)=>({
  items: [],
  total: 0,
  add: (product, qty) => {
    const items = [...get().items]
    const idx = items.findIndex(i=>i.product.id===product.id)
    if (idx>-1) items[idx].qty += qty; else items.push({product, qty})
    const total = items.reduce((s,i)=>s+i.product.price*i.qty,0)
    set({ items, total })
  },
  increment: (id) => {
    const items = get().items.map(i=>i.product.id===id ? {...i, qty:i.qty+1} : i)
    const total = items.reduce((s,i)=>s+i.product.price*i.qty,0)
    set({ items, total })
  },
  decrement: (id) => {
    let items = get().items.map(i=>i.product.id===id ? {...i, qty:Math.max(1,i.qty-1)} : i)
    const total = items.reduce((s,i)=>s+i.product.price*i.qty,0)
    set({ items, total })
  },
  remove: (id) => {
    const items = get().items.filter(i=>i.product.id!==id)
    const total = items.reduce((s,i)=>s+i.product.price*i.qty,0)
    set({ items, total })
  },
  clear: () => set({ items: [], total: 0 })
}))

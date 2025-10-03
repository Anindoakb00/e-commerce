'use client'

import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { toast} from "sonner"
import { useCartStore } from "@/store/cartStore"
import Link from "next/link"

const Schema = z.object({
  name: z.string().min(2),
  address: z.string().min(4),
  phone: z.string().min(6),
  delivery: z.enum(["standard","express"]),
  payment: z.enum(["card","paypal","cod"])
})

export default function CheckoutPage() {
  toast ("");
  const { total, items, clear } = useCartStore()
  const { register, handleSubmit, formState:{errors} } = useForm<z.infer<typeof Schema>>({ resolver: zodResolver(Schema) })

  const onSubmit = async (data: z.infer<typeof Schema>) => {
    if (items.length === 0) return toast("Cart is empty")
    try {
      const orderPayload = {
        name: data.name,
        address: data.address,
        phone: data.phone,
        delivery: data.delivery,
        payment: data.payment,
        items: items.map(it => ({
          product: it.product.id,
          qty: it.qty,
        })),
        total: total,
      }
      const res = await fetch("https://techbuilders-backend.onrender.com/api/orders/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      })
      if (!res.ok) throw new Error("Order failed")
      clear()
      toast("Order placed successfully")
    } catch (err) {
      toast("Failed to place order")
    }
  }

  return (
    <div className="container mx-auto py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <form className="lg:col-span-2 space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <h2 className="text-xl font-semibold mb-4">Shipping Details</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input placeholder="Full Name" {...register("name")} />
            <Input placeholder="Phone" {...register("phone")} />
            <Input className="sm:col-span-2" placeholder="Address" {...register("address")} />
          </div>
          <p className="text-sm text-red-500 mt-2">{Object.values(errors)[0]?.message as string || ""}</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Delivery Options</h2>
          <RadioGroup defaultValue="standard" className="space-y-2" onValueChange={(v)=>{}}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="standard" id="standard" {...register("delivery")}/>
              <Label htmlFor="standard">Standard (3-5 days)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="express" id="express" {...register("delivery")}/>
              <Label htmlFor="express">Express (1-2 days)</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Payment</h2>
          <RadioGroup defaultValue="cod" className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="card" id="card" {...register("payment")}/>
              <Label htmlFor="card">Card</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="paypal" id="paypal" {...register("payment")}/>
              <Label htmlFor="paypal">PayPal</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="cod" id="cod" {...register("payment")}/>
              <Label htmlFor="cod">Cash on Delivery</Label>
            </div>
          </RadioGroup>
        </div>

        <Button type="submit">Place Order</Button>
      </form>

      <aside className="border rounded-lg p-6 h-fit">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="space-y-2 mb-4">
          {items.map(it=>(
            <div key={it.product.id} className="flex justify-between text-sm">
              <span>{it.product.name} × {it.qty}</span>
              <span>${(it.product.price*it.qty).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between mb-2">
          <span>Subtotal</span><span>${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Tax (est.)</span><span>${(total*0.05).toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span><span>${(total*1.05).toFixed(2)}</span>
        </div>
        <Link href="/cart" className="text-xs underline block mt-3">Back to cart</Link>
      </aside>
    </div>
  )
}

import Link from 'next/link'

export default function CheckoutCancel() {
  return (
    <div className="container mx-auto px-6 py-16 text-center">
      <h1 className="text-3xl font-bold mb-2">Checkout cancelled</h1>
      <p className="text-muted-foreground mb-6">No worries—your cart is still here if you want to try again.</p>
      <Link href="/cart" className="text-blue-600 hover:underline">Return to cart</Link>
    </div>
  )
}

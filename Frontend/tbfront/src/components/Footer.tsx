"use client"
import { toast } from "sonner"

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-200">
      <div className="container mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-cyan-400 rounded-md flex items-center justify-center text-white font-bold">TB</div>
              <div>
                <div className="text-lg font-bold">TechBuilders</div>
                <div className="text-sm text-slate-400">Tools & gear for modern builders</div>
              </div>
            </div>
            <p className="text-sm text-slate-400">© {new Date().getFullYear()} TechBuilders. All rights reserved.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Shop</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="/products" className="hover:text-white">All Products</a></li>
              <li><a href="/products?category=laptops" className="hover:text-white">Laptops</a></li>
              <li><a href="/products?category=accessories" className="hover:text-white">Accessories</a></li>
              <li><a href="/products?category=gadgets" className="hover:text-white">Gadgets</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="/about" className="hover:text-white">About</a></li>
              <li><a href="/careers" className="hover:text-white">Careers</a></li>
              <li><a href="/contact" className="hover:text-white">Contact</a></li>
              <li><a href="/blog" className="hover:text-white">Blog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Stay updated</h4>
            <p className="text-sm text-slate-400 mb-3">Sign up for new arrivals, exclusive offers and early access.</p>
            <form onSubmit={(e) => { e.preventDefault(); toast.success('Thanks — newsletter UI only (no backend)') }} className="flex gap-2">
              <input aria-label="Email" type="email" placeholder="Your email" className="w-full rounded-md px-3 py-2 bg-slate-800 border border-slate-700 text-sm text-slate-200" />
              <button type="submit" className="px-4 py-2 rounded-md bg-indigo-500 hover:bg-indigo-600 text-white text-sm">Subscribe</button>
            </form>

            <div className="flex items-center gap-3 mt-4">
              <a href="#" aria-label="twitter" className="w-8 h-8 rounded-md bg-slate-800 flex items-center justify-center hover:bg-slate-700">T</a>
              <a href="#" aria-label="facebook" className="w-8 h-8 rounded-md bg-slate-800 flex items-center justify-center hover:bg-slate-700">F</a>
              <a href="#" aria-label="instagram" className="w-8 h-8 rounded-md bg-slate-800 flex items-center justify-center hover:bg-slate-700">I</a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-6 text-sm text-slate-500 flex items-center justify-between">
          <div>Made with ❤️ by TechBuilders</div>
          <div className="flex gap-6">
            <a href="/terms" className="hover:text-white">Terms</a>
            <a href="/privacy" className="hover:text-white">Privacy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

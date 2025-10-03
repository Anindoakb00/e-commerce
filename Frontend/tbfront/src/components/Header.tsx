
'use client'

import Link from "next/link"
import { useTheme } from "next-themes"
import { useAuthStore } from "@/store/authStore"
import AuthModal from "./AuthModel"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Header() {
  const { theme, setTheme } = useTheme()
  const user = useAuthStore(s => s.user)
  const logout = useAuthStore(s => s.logout)
  const [open, setOpen] = useState(false)
  // Removed Stripe status badge for production cleanliness
 
  const categories = [
    { title: "Smartphones", slug: "smartphones", href: "/smartphones" },
    { title: "Laptops", slug: "laptops", href: "/laptops" },
    { title: "Gaming", slug: "tools", href: "/tools" },
    { title: "Tech Gadgets", slug: "gadgets", href: "/gadgets" },
    { title: "Accessories", slug: "accessories", href: "/accessories" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60 border-gray-200 dark:border-gray-800">
      <div className="container mx-auto h-16 flex items-center gap-6 px-6">
      
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          <img src="/logo.svg" alt="TechBuilder" className="h-6 w-6" />
          TechBuilder<span className="text-blue-600 dark:text-blue-400">.</span>
        </Link>

        
        <div className="hidden md:block flex-1 max-w-md">
          <Input 
            placeholder="Search products..." 
            className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400" 
          />
        </div>

        
  <nav className="flex items-center gap-6">
          <Link href="/products" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Products</Link>

     
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                Categories
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              {categories.map((cat) => (
                <DropdownMenuItem key={cat.slug} asChild className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <Link href={cat.href} className="w-full text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    <span className="text-gray-400 dark:text-gray-500">→</span> <span>{cat.title}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/cart" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Cart</Link>

          {/* Stripe status badge removed */}

          {/* Theme toggle */}
          <button
            type="button"
            aria-label="Toggle theme"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>

          {user ? (
            <>
              <Link href="/profile" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                {user?.username || user?.email || "User"}
              </Link>
              <Button size="sm" variant="outline" onClick={logout} className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                Logout
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={() => setOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
              Login
            </Button>
          )}
        </nav>
      </div>
      <AuthModal open={open} onOpenChange={setOpen} />
    </header>
  )
}

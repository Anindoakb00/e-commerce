import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { ThemeProvider } from "@/components/theme-provider";
import ChatWidget from "@/components/ChatWidget";

// Removed next/font usage to avoid CSS pipeline triggering native lightningcss on Vercel

export const metadata: Metadata = {
  title: {
    default: "TechBuilders – Your One Stop Tech Shop",
    template: "%s | TechBuilders",
  },
  description: "TechBuilders is your trusted online tech store for laptops, gadgets, and accessories.",
  keywords: ["TechBuilders", "laptops", "gadgets", "accessories", "ecommerce"],
  openGraph: {
    type: "website",
    url: "https://www.techbuilders.com",
    title: "TechBuilders – Your One Stop Tech Shop",
    description: "Buy laptops, gadgets, and accessories with fast delivery.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "TechBuilders Ecommerce Store",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@TechBuilders",
    title: "TechBuilders – Shop Smarter",
    description: "TechBuilders is your trusted online tech store.",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
  <body className="min-h-screen flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster />
          <ChatWidget />
        </ThemeProvider>
      </body>
    </html>
  )
}
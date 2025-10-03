'use client'

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { toast } from "sonner"

export default function ContactPage() {
   toast ("");
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast( "Your message has been sent!")
    setMessage("")
  }

  return (
    <div className="container mx-auto py-10 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <p className="text-gray-700 mb-6">
        Have questions? Fill out the form below and we’ll get back to you.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input placeholder="Your Name" required />
        <Input type="email" placeholder="Your Email" required />
        <Textarea
          placeholder="Your Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <Button type="submit" className="w-full">
          Send Message
        </Button>
      </form>
    </div>
  )
}

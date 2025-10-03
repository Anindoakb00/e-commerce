"use client"

import { useState } from "react"
import { API_BASE } from "@/lib/config"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function ResetPasswordPage(){
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)

  const submit = async (e: React.FormEvent)=>{
    e.preventDefault()
    if(!email) { toast("Enter your email"); return }
    try{
      const res = await fetch(`${API_BASE}/auth/users/reset_password/`,{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      if(!res.ok){
        let msg = 'Unable to send reset email'
        try { const j = await res.json(); msg = j?.detail || JSON.stringify(j) } catch{}
        toast(msg)
        return
      }
      setSent(true)
      toast("If the email exists, a reset link has been sent.")
    } catch(err){
      toast("Network error")
      console.error(err)
    }
  }

  return (
    <div className="max-w-md mx-auto py-16">
      <h1 className="text-2xl font-semibold mb-4">Reset password</h1>
      {!sent ? (
        <form onSubmit={submit} className="space-y-3">
          <Input type="email" placeholder="Your account email" value={email} onChange={e=>setEmail(e.target.value)} />
          <Button type="submit" className="w-full">Send reset link</Button>
        </form>
      ) : (
        <p>Check your inbox for further instructions.</p>
      )}
    </div>
  )
}

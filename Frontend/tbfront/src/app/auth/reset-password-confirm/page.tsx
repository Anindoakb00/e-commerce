"use client"

import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { API_BASE } from "@/lib/config"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function ResetPasswordConfirmPage(){
  const params = useSearchParams()
  const router = useRouter()
  const uid = params.get('uid') || ''
  const token = params.get('token') || ''
  const [password, setPassword] = useState('')
  const [rePassword, setRePassword] = useState('')

  const submit = async (e: React.FormEvent)=>{
    e.preventDefault()
    if(!password || password !== rePassword) { toast('Passwords must match'); return }
    try{
      const res = await fetch(`${API_BASE}/auth/users/reset_password_confirm/`,{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid, token, new_password: password })
      })
      const data = await res.json().catch(()=>null)
      if(!res.ok){
        toast(data?.detail || 'Reset failed');
        return
      }
      toast('Password reset successful. Please log in.')
      router.push('/login')
    }catch(err){
      toast('Network error')
      console.error(err)
    }
  }

  return (
    <div className="max-w-md mx-auto py-16">
      <h1 className="text-2xl font-semibold mb-4">Set a new password</h1>
      <form onSubmit={submit} className="space-y-3">
        <Input type="password" placeholder="New password" value={password} onChange={e=>setPassword(e.target.value)} />
        <Input type="password" placeholder="Repeat password" value={rePassword} onChange={e=>setRePassword(e.target.value)} />
        <Button type="submit" className="w-full">Change password</Button>
      </form>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { useRouter, useSearchParams } from 'next/navigation'

export default function RegisterPage() {
  const register = useAuthStore(s=>s.register)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const sp = useSearchParams()
  const next = sp.get('next') || '/cart'

  return (
    <div className="container mx-auto px-6 py-10 max-w-md">
      <h1 className="text-3xl font-bold mb-6">Create account</h1>
      <div className="space-y-4">
        <Input placeholder="Username" value={username} onChange={(e)=>setUsername(e.target.value)} />
        <Input placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <Input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        <Button disabled={loading} onClick={async()=>{
          try {
            setLoading(true)
            await register(username, email, password)
            toast.success('Account created')
            router.push(next)
          } catch (e:any) {
            toast.error(e.message || 'Registration failed')
          } finally { setLoading(false) }
        }}>{loading ? 'Creating…' : 'Register'}</Button>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">Already have an account? <a className="text-blue-600" href={`/login?next=${encodeURIComponent(next)}`}>Login</a></p>
    </div>
  )
}

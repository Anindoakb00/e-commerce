'use client'

import { Suspense, useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { useRouter, useSearchParams } from 'next/navigation'

function LoginInner() {
  const login = useAuthStore(s=>s.login)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const sp = useSearchParams()
  const next = sp.get('next') || '/cart'

  return (
    <div className="container mx-auto px-6 py-10 max-w-md">
      <h1 className="text-3xl font-bold mb-6">Login</h1>
      <div className="space-y-4">
        <Input placeholder="Username" value={username} onChange={(e)=>setUsername(e.target.value)} />
        <Input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        <Button disabled={loading} onClick={async()=>{
          try {
            setLoading(true)
            await login(username, password)
            toast.success('Logged in')
            router.push(next)
          } catch (e:any) {
            toast.error(e.message || 'Login failed')
          } finally { setLoading(false) }
        }}>{loading ? 'Signing in…' : 'Login'}</Button>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">No account? <a className="text-blue-600" href={`/register?next=${encodeURIComponent(next)}`}>Register</a></p>
    </div>
  )
}

export default function LoginPage(){
  return (
    <Suspense>
      <LoginInner />
    </Suspense>
  )
}

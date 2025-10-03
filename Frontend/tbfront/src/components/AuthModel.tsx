'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuthStore } from "@/store/authStore"
import { API_BASE } from "@/lib/config"
import {toast} from "sonner"

const LoginSchema = z.object({ username: z.string().min(2), password: z.string().min(6) })
const SignupSchema = z.object({ username: z.string().min(2), password: z.string().min(6) })

export default function AuthModal({ open, onOpenChange }: { open:boolean; onOpenChange:(o:boolean)=>void }) {
  toast("");
  const login = useAuthStore(s=>s.login)
  const { register: r1, handleSubmit: hs1 } = useForm<z.infer<typeof LoginSchema>>({ resolver: zodResolver(LoginSchema) })
  const { register: r2, handleSubmit: hs2 } = useForm<z.infer<typeof SignupSchema>>({ resolver: zodResolver(SignupSchema) })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Welcome</DialogTitle></DialogHeader>
        <Tabs defaultValue="login">
          <TabsList className="mb-4">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Signup</TabsTrigger>
          </TabsList>


          <TabsContent value="login">
            <form className="space-y-3" onSubmit={hs1(async (data) => {
              try {
                await login(data.username, data.password)
                toast("Logged in")
                onOpenChange(false)
              } catch (err: any) {
                toast(err?.message || "Login failed")
                console.error("Login error:", err)
              }
            })}>
              <Input placeholder="Username" {...r1("username")} />
              <Input placeholder="Password" type="password" {...r1("password")} />
              <Button className="w-full" type="submit">Login</Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form className="space-y-3" onSubmit={hs2(async (data) => {
              try {
                const res = await fetch(`${API_BASE}/auth/users/`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ username: data.username, password: data.password }),
                });
                const result = await res.json();
                if (res.ok) {
                  
                  await login(data.username, data.password)
                  toast("Signed up & logged in")
                  onOpenChange(false)
                } else {
                  // result may be { field: ["msg", ...], non_field_errors: [...] } or {detail: '...'}
                  let msg = "Signup failed";
                  try {
                    if (result.detail) msg = result.detail;
                    else if (typeof result === 'object' && result !== null) {
                      const parts: string[] = [];
                      for (const k of Object.keys(result)) {
                        const v = (result as any)[k];
                        if (Array.isArray(v)) parts.push(`${k}: ${v.join('; ')}`);
                        else parts.push(`${k}: ${String(v)}`);
                      }
                      if (parts.length) msg = parts.join(' | ');
                    } else if (typeof result === 'string') msg = result;
                  } catch (e) {
                    console.error('Error formatting signup error', e);
                  }
                  toast(msg);
                  console.error("Signup error:", result);
                }
              } catch (err) {
                toast("Network error");
                
                console.error("Signup network error:", err);
              }
            })}>
              <Input placeholder="Username" {...r2("username")} />
              <Input placeholder="Password" type="password" {...r2("password")} />
              {/* email removed: backend expects only username & password */}
              <Button className="w-full" type="submit">Create account</Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}





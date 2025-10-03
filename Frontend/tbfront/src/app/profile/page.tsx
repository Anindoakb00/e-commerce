'use client'

import { useAuthStore } from "@/app/store/authStore"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const ProfileSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6).optional()
})

export default function ProfilePage() {
  const user = useAuthStore(s=>s.user)
  const setUser = useAuthStore(s=>s.setUser)
  const { register, handleSubmit } = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema), defaultValues: { name: user?.name || "", email: user?.email || "" }
  })

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">My Account</h1>

      <Tabs defaultValue="profile">
        <TabsList><TabsTrigger value="profile">Profile</TabsTrigger><TabsTrigger value="orders">My Orders</TabsTrigger><TabsTrigger value="wishlist">Wishlist</TabsTrigger><TabsTrigger value="settings">Settings</TabsTrigger></TabsList>

        <TabsContent value="profile" className="mt-6">
          <form className="grid sm:grid-cols-2 gap-4 max-w-2xl" onSubmit={handleSubmit((data)=>setUser({...user, ...data} as any))}>
            <Input placeholder="Name" {...register("name")} />
            <Input placeholder="Email" {...register("email")} />
            <Input placeholder="Phone" {...register("phone")} />
            <Button className="sm:col-span-2 w-fit">Update</Button>
          </form>
        </TabsContent>

        <TabsContent value="orders" className="mt-6">
          <p>Past orders will show here.</p>
        </TabsContent>

        <TabsContent value="wishlist" className="mt-6">
          <p>Wishlist items will appear here.</p>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <p>Change password and preferences.</p>
        </TabsContent>
      </Tabs>
    </div>
  )
}

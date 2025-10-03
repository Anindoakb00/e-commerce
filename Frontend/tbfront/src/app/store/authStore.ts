'use client'

import { create } from "zustand"

type User = { name?:string; email?:string; username?: string } | null
type AuthState = { user: User; setUser:(u:User)=>void; login:(u:User)=>void; logout:()=>void }

export const useAuthStore = create<AuthState>((set)=>({
  user: null,
  setUser: (u)=>set({ user: u }),
  login: (u)=>set({ user: u }),
  logout: ()=>set({ user: null })
}))

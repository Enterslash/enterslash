import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface AuthState {
  isAuthenticated: boolean,
  setAuthenticated: (state?: boolean) => void
}

export const useAuthStore = create<AuthState>()(devtools(persist((set) => ({
  isAuthenticated: false,
  setAuthenticated: (state) => {
    set(() => ({ isAuthenticated: state }))
  }
}),
  {
    name: 'auth-storage',
  })))
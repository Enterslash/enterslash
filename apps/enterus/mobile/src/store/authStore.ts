import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { zustandStorage } from './middleware/storage'

interface AuthState {
  isAuthenticated: boolean,
  setAuthenticated: (state?: boolean) => void
}

export const useAuthStore = create<AuthState>()(persist((set) => ({
  isAuthenticated: false,
  setAuthenticated: (state) => {
    set(() => ({ isAuthenticated: state }))
  }
}),
  {
    name: 'user-storage',
    storage: createJSONStorage(() => zustandStorage),
  }))
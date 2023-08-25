import { create } from 'zustand'

interface AppState {
  loading: boolean
  toggleLoader: (state?: boolean) => void
}

export const useAppStore = create<AppState>()((set) => ({
  loading: false,
  toggleLoader: (loader) => {
    set((state) => ({ loading: loader !== undefined ? loader : !state.loading }))
  }
}))
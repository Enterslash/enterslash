import { IUserModel } from '@enterslash/enterus/types'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface AppState {
    sidebar: boolean
    setSidebar: (sidebar: boolean) => void,
    loading: boolean,
    toggleLoader: (state?: boolean) => void
    token?: string
    setToken: (token: string) => void
    user: IUserModel | null,
    setUser: (user: IUserModel | null) => void
}

export const useAppState = create<AppState>()(
    devtools(
        persist(
            (set) => ({
                sidebar: true,
                setSidebar: (sidebar) => set(() => ({ sidebar })),
                loading: false,
                toggleLoader: (loader) => {
                    set((state) => ({ loading: loader !== undefined ? loader : !state.loading }))
                },
                token: undefined,
                setToken: (token) => set(() => ({ token })),
                user: null,
                setUser: (user) => set(() => ({ user })),
            }),
            {
                name: 'app-storage',
            }
        )
    )
)
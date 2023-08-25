import { IUserModel } from '@enterslash/enterus/types'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { zustandStorage } from './middleware/storage'

interface UserState {
    user: IUserModel,
    setUser: (state?: IUserModel) => void
}

export const useUserStore = create<UserState>()(persist((set) => ({
    user: {} as IUserModel,
    setUser: (profile) => {
        set((state) => ({ user: profile }))
    }
}),
    {
        name: 'user-storage',
        storage: createJSONStorage(() => zustandStorage),
    }))
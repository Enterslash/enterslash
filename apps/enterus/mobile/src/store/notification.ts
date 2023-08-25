import { create } from 'zustand'

interface NotificationState {
    unseenNotification: number
    setUnseenNotification: (n: number) => void
    updateUnseenNotification: (n: number) => void
}

export const useNotificationStore = create<NotificationState>()((set) => ({
    unseenNotification: 0,
    setUnseenNotification: (n) => {
        set(() => ({ unseenNotification: n }))
    },
    updateUnseenNotification: (n) => {
        set((state) => ({ unseenNotification: state.unseenNotification + n }))
    },
}))
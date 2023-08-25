import { GetConversationsDTO } from '@enterslash/enterus/types'
import { create } from 'zustand'

interface MessageState {
    conversations: GetConversationsDTO[],
    setConversations: (conversations: GetConversationsDTO[]) => void,
    updateConversationUnseenMessage: (bookingId: string, n: number) => void
    unseenMessage: number
    setUnseenMessage: (n: number) => void
    updateUnseenMessage: (n: number) => void
}

export const useMessageStore = create<MessageState>()((set) => ({
    conversations: [],
    setConversations: (conversations) => {
        set(() => ({ conversations }))
    },
    updateConversationUnseenMessage: (bookingId, n) => {
        set((state) => ({
            conversations: state.conversations.map((conversation) => {
                if (conversation.bookingId === bookingId) {
                    return {
                        ...conversation,
                        unseenMessages: conversation.unseenMessages + n
                    }
                }
                return conversation
            })
        }))
    },
    unseenMessage: 0,
    setUnseenMessage: (n) => {
        set((state) => ({ unseenMessage: n < 0 ? 0 : n }))
    },
    updateUnseenMessage: (n) => {
        set((state) => ({ unseenMessage: state.unseenMessage + n }))
    }
}))
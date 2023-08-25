import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { zustandStorage } from './middleware/storage'

type TourScreens = {
    viewService: {
        step: number,
        done: boolean
    },
    booking: {
        step: number,
        done: boolean
    },
    messages: {
        step: number,
        done: boolean
    },
    chatOption: {
        step: number,
        done: boolean
    }
}


interface TourState {
    newSignUp: boolean
    state: TourScreens
    setTourStep: (step: keyof TourScreens, n: number) => void
    finishTour: (step: keyof TourScreens) => void
    startTour: () => void,
    clearTour: () => void
}

const initialState: TourState['state'] = {
    viewService: {
        step: 0,
        done: false
    },
    booking: {
        step: 0,
        done: false
    },
    messages: {
        step: 0,
        done: false
    },
    chatOption: {
        step: 0,
        done: false
    }
}

export const useTourStore = create<TourState>()(persist((set) => ({
    newSignUp: false,
    state: initialState,
    setTourStep: (step, n) => {
        if (n) {
            set((state) => ({
                state: {
                    ...state.state,
                    [step]: {
                        step: n
                    }
                }
            }))
        }
    },
    startTour: () => {
        set(() => ({
            newSignUp: true,
            state: initialState
        }))
    },
    finishTour: (step) => {
        set((state) => ({
            state: {
                ...state.state,
                [step]: {
                    ...state.state[step],
                    done: true
                }
            }
        }))
    },
    clearTour: () => {
        set(() => ({
            newSignUp: false,
            state: initialState
        }))
    }
}),
    {
        name: 'tour-storage',
        storage: createJSONStorage(() => zustandStorage),
    }))
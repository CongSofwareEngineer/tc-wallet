import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import { Sessions } from '@/types/walletConnect'

type SessionsState = {
  sessions: Sessions
  setSessions: (sessions: Sessions) => void
  removeSessionByTopic: (topic: string) => void
}
export const sessionsZustand = create<SessionsState>()(
  devtools(
    (set) => ({
      sessions: [],
      setSessions: (sessions: Sessions) => set({ sessions }),
      removeSessionByTopic: (topic: string) =>
        set((state) => {
          const sessions = state.sessions
          delete sessions[topic as unknown as keyof Sessions]
          return { sessions }
        }),
    }),
    {
      name: 'sessions-zustand',
      enabled: process.env.EXPO_PUBLIC_ENV !== 'production',
    }
  )
)

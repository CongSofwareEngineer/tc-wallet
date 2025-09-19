import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import { KEY_STORAGE } from '@/constants/storage'
import { MODE } from '@/constants/style'
import { getDataLocal, removeDataLocal, saveDataLocal } from '@/utils/storage'

type ModeState = {
  mode: MODE
  setMode: (mode: MODE) => void
}
export const modeZustand = create<ModeState>()(
  devtools(
    persist(
      (set) => ({
        mode: MODE.Dark,
        setMode: (mode: MODE) => set({ mode }),
      }),
      {
        storage: {
          getItem: () => {
            const mode = getDataLocal(KEY_STORAGE.Mode)

            return {
              state: {
                mode: mode || MODE.Light,
              },
            }
          },
          removeItem: () => {
            removeDataLocal(KEY_STORAGE.Mode)
          },
          setItem: (_, value) => {
            saveDataLocal(KEY_STORAGE.Mode, value.state.mode)
          },
        },
        name: 'mode-zustand',
      }
    ),
    {
      name: 'mode-zustand',
      enabled: process.env.EXPO_PUBLIC_ENV !== 'production',
    }
  )
)

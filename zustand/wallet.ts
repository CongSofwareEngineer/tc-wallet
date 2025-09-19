import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import { KEY_STORAGE } from '@/constants/storage'
import { Wallet } from '@/types/wallet'
import { getDataLocal, removeDataLocal, saveDataLocal } from '@/utils/storage'

type WalletsState = {
  wallets: Wallet[]
  wallet: Wallet
  setWallets: (wallets: Wallet[]) => void
  setWallet: (wallet: Wallet, index: number) => void
}
export const walletsZustand = create<WalletsState>()(
  devtools(
    persist(
      (set) => ({
        wallet: {} as Wallet,
        wallets: [],
        setWallets: (wallets: Wallet[]) => set({ wallets }),
        setWallet: (wallet: Wallet, index: number) =>
          set((state) => {
            const newWallets = [...state.wallets]
            newWallets[index] = wallet
            return { wallets: newWallets }
          }),
      }),
      {
        storage: {
          getItem: () => {
            const allWallet = getDataLocal(KEY_STORAGE.AllWallet) as Wallet[]
            if (allWallet?.length > 0) {
              const walletDefault = allWallet.find((w) => w.isDefault) || allWallet[0]
              return {
                state: {
                  wallets: allWallet,
                  wallet: walletDefault,
                },
              }
            }
            return null
          },
          removeItem: () => {
            removeDataLocal(KEY_STORAGE.AllWallet)
          },
          setItem: (_, value) => {
            saveDataLocal(KEY_STORAGE.AllWallet, value.state.wallets)
          },
        },
        name: 'wallets-zustand',
      }
    ),
    {
      name: 'wallets-zustand',
      enabled: process.env.EXPO_PUBLIC_ENV !== 'production',
    }
  )
)

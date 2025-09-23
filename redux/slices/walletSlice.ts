import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Wallet } from '@/types/wallet'

type WalletState = {
  wallets: Wallet[]
  wallet: Wallet | null
}

const initialState: WalletState = {
  wallets: [],
  wallet: null,
}

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setWallets(state, action: PayloadAction<Wallet[]>) {
      state.wallets = action.payload
      // auto set current wallet from default if any
      const walletDefault = action.payload.find((w) => w.isDefault)
      state.wallet = walletDefault ?? action.payload[0] ?? null
    },
    setWallet(state, action: PayloadAction<{ wallet: Wallet; index: number }>) {
      const { wallet, index } = action.payload
      const list = [...state.wallets]
      list[index] = wallet
      state.wallets = list
      if (wallet.isDefault) {
        state.wallet = wallet
      }
    },
    setCurrentWallet(state, action: PayloadAction<Wallet | null>) {
      state.wallet = action.payload
    },
    resetWallets(state) {
      state.wallets = []
      state.wallet = null
    },
  },
})

export const { setWallets, setWallet, setCurrentWallet, resetWallets } = walletSlice.actions
export default walletSlice.reducer

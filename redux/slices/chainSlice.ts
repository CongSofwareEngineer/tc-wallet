import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { CHAIN_DEFAULT } from '@/constants/chain'
import { ChainId, Network } from '@/types/web3'

const initialState: Network[] = CHAIN_DEFAULT

const chainSlice = createSlice({
  name: 'chain',
  initialState: initialState,
  reducers: {
    addNetwork: (state: Network[], action: PayloadAction<Network>) => {
      state.push(action.payload)
    },
    removeNetwork: (state: Network[], action: PayloadAction<ChainId>) => {
      return state.filter((network: Network) => network.id.toString() !== action.payload.toString())
    },
    resetNetworks: () => {
      return initialState
    },
    updateNetworks: (state: Network[], action: PayloadAction<Network>) => {
      const index = state.findIndex((network: Network) => network.id.toString() === action.payload.id.toString())
      if (index !== -1) {
        state[index] = action.payload
      }
      return state
    },
  },
})

export const { addNetwork, removeNetwork, resetNetworks, updateNetworks } = chainSlice.actions
export default chainSlice.reducer

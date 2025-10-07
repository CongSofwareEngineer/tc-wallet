import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { ChainId } from '@/types/web3'

const initialState: ChainId = 1

const chainSelectedSlice = createSlice({
  name: 'chainSelected',
  initialState,
  reducers: {
    setChainSelected: (state: ChainId, action: PayloadAction<ChainId>) => {
      return (action.payload ?? initialState) as any
    },
  },
})

export const { setChainSelected } = chainSelectedSlice.actions
export default chainSelectedSlice.reducer

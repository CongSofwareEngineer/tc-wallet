import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ProposalTypes, SignClientTypes, Verify } from '@walletconnect/types'

import { Params } from '@/types/walletConnect'
export type RequestWC = {
  verifyContext: Verify.Context
  type: 'connect' | 'request'
  timestamp: number
  params?: Params
} & Omit<SignClientTypes.BaseEventArgs<ProposalTypes.Struct>, 'topic'> &
  Omit<{ params: Params }, 'params'>

const initialState: RequestWC[] = []

const requestWCSlice = createSlice({
  name: 'requestWC',
  initialState,
  reducers: {
    setRequestWC: (state, action: PayloadAction<RequestWC>) => {
      state.push(action.payload)
    },
    removeRequestWC: (state, action: PayloadAction<number>) => {
      return state.filter((req) => req.id !== action.payload)
    },
  },
})

export const { setRequestWC, removeRequestWC } = requestWCSlice.actions
export default requestWCSlice.reducer

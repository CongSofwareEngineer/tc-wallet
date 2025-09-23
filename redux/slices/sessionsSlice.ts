import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Sessions } from '@/types/walletConnect'

type SessionsState = Sessions

const initialState: SessionsState = {}

const sessionsSlice = createSlice({
  name: 'sessions',
  initialState,
  reducers: {
    setSessions: (_, action: PayloadAction<Sessions>) => {
      return action.payload
    },
    removeSessionByTopic: (state, action: PayloadAction<string>) => {
      const copy = { ...state }
      delete copy[action.payload]
      return copy
    },
  },
})

export const { setSessions, removeSessionByTopic } = sessionsSlice.actions
export default sessionsSlice.reducer

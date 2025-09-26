import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState: string[] = []

const passPhaseSlice = createSlice({
  name: 'passPhase',
  initialState,
  reducers: {
    setPassPhrase(state, action: PayloadAction<string>) {
      state.push(action.payload)
    },
    setListPassPhrase(state, action: PayloadAction<string[]>) {
      return action.payload
    },
    removePassPhrase(state, action: PayloadAction<number>) {
      return state.filter((_, index) => index !== action.payload)
    },
    removeAllPassphrases(state) {
      return []
    },
  },
})

export const { setPassPhrase, removePassPhrase, removeAllPassphrases, setListPassPhrase } = passPhaseSlice.actions
export default passPhaseSlice.reducer

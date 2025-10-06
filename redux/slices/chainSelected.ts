import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState = 1

const modeSlice = createSlice({
  name: 'mode',
  initialState,
  reducers: {
    setChainSelected: (state: number, action: PayloadAction<number>) => {
      return action.payload ?? initialState
    },
  },
})

export const { setChainSelected } = modeSlice.actions
export default modeSlice.reducer

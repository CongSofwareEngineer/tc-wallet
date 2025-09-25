import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { MODE } from '@/constants/style'

const initialState: MODE = MODE.Dark

const modeSlice = createSlice({
  name: 'mode',
  initialState: initialState as MODE,
  reducers: {
    setMode: (state: MODE, action: PayloadAction<MODE | undefined>) => {
      const next = action.payload
      if (next === MODE.Light || next === MODE.Dark) {
        return next
      }
      // fallback to current or initial state if payload invalid/undefined
      return state ?? initialState
    },
  },
})

export const { setMode } = modeSlice.actions
export default modeSlice.reducer

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { MODE } from '@/constants/style'

const initialState: MODE = MODE.Dark

const modeSlice = createSlice({
  name: 'mode',
  initialState,
  reducers: {
    setMode: (_, action: PayloadAction<MODE>) => {
      return action.payload as any
    },
  },
})

export const { setMode } = modeSlice.actions
export default modeSlice.reducer

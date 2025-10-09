import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ReactNode } from 'react'
export type MyAlert = {
  text?: ReactNode
  duration?: number
}
const initialState: MyAlert = {}

const alertSlice = createSlice({
  name: 'alert',
  initialState: initialState,
  reducers: {
    openAlert: (state, action: PayloadAction<MyAlert>) => {
      return { ...state, ...action.payload }
    },
    closeAlert: (state) => {
      return {}
    },
  },
})

export const { openAlert, closeAlert } = alertSlice.actions
export const showAlert = openAlert // Alias for backward compatibility
export default alertSlice.reducer

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type Setting = {
  isFaceId: boolean
  isPasscode: boolean
  isBiometric: boolean
  isNotification: boolean
}

const initialState: Setting = {
  isFaceId: false,
  isPasscode: false,
  isBiometric: false,
  isNotification: false,
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setFaceId: (state, action: PayloadAction<boolean>) => {
      state.isFaceId = action.payload
    },
    setPasscode: (state, action: PayloadAction<boolean>) => {
      state.isPasscode = action.payload
    },
    setBiometric: (state, action: PayloadAction<boolean>) => {
      state.isBiometric = action.payload
    },

    setNotification: (state, action: PayloadAction<boolean>) => {
      state.isNotification = action.payload
    },
    setSetting: (state, action: PayloadAction<Setting>) => {
      return { ...state, ...action.payload }
    },
    resetSetting: () => {
      return initialState
    },
  },
})

export const { setFaceId, setPasscode, setBiometric, setNotification, setSetting, resetSetting } = settingsSlice.actions
export default settingsSlice.reducer

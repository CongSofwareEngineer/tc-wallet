import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ModalProps } from 'react-native-modal'

export type SheetProps = {
  maskClosable?: boolean
  isOpen?: boolean
  content?: React.ReactNode | null
  afterClose?: () => any
  onClose?: () => any
} & Partial<ModalProps>

const sheetSlice = createSlice({
  name: 'sheet',
  initialState: {} as SheetProps,
  reducers: {
    openSheet: (_: any, action: PayloadAction<SheetProps>) => {
      return action.payload as any
    },
    closeSheet: () => {
      return {} as any
    },
  },
})

export const { openSheet, closeSheet } = sheetSlice.actions
export default sheetSlice.reducer

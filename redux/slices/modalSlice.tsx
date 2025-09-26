import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit'
import { ModalProps } from 'react-native'

import { KEY_REDUX } from '@/constants/redux'

export type ModalItem = {
  // Use a plain object to avoid Immer WritableDraft incompatibilities with React Native types
  config?: Draft<ModalProps>
  open?: boolean
  content?: React.ReactNode | null
  afterClose?: () => any
  onClose?: () => any
  showIconClose?: boolean
  addModal?: boolean
  maskClosable?: boolean
}

type ModalState = ModalItem[]

const initialState: ModalState = []

const modalSlice = createSlice({
  name: KEY_REDUX.Modals,
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<ModalItem>) => {
      if (state.length > 0 && !action.payload?.addModal) {
        return [action.payload]
      } else {
        state.push(action.payload)
      }
    },
    closeModal(state) {
      const lastModal = state.pop()

      if (lastModal && lastModal.afterClose) {
        lastModal?.afterClose()
      }

      return lastModal ? state : []
    },
  },
})

export const { openModal, closeModal } = modalSlice.actions
export default modalSlice.reducer

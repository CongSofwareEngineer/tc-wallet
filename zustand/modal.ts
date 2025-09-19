import { ModalProps } from 'react-native'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

type Modal = {
  config?: ModalProps
  open?: boolean
  content?: React.ReactNode
  afterClose?: () => any
  onClose?: () => any
  showIconClose?: boolean
  addModal?: boolean
  maskClosable?: boolean
}

type ModalState = {
  modal: Modal[]
  openModal: (param?: Modal) => void
  closeModal: () => void
}

export const modalZustand = create<ModalState>()(
  devtools(
    (set, get) => ({
      modal: [],

      openModal: (param?: Modal) => {
        const listModals = get().modal

        if (listModals.length > 0 && !param?.addModal) {
          const lastModal = listModals.pop()

          set({
            modal: [
              ...listModals,
              {
                showIconClose: true,
                maskClosable: true,
                ...param,
                ...lastModal,
                open: true,
              },
            ],
          })
        } else {
          set({
            modal: [...listModals, { showIconClose: true, maskClosable: true, ...param, open: true }],
          })
        }
      },
      closeModal: () => {
        const listModals = get().modal
        const lastModal = listModals.pop()

        if (lastModal && lastModal.afterClose) {
          lastModal?.afterClose()
        }

        set({
          modal: listModals,
        })
      },
    }),
    {
      name: 'modal-zustand',
      enabled: process.env.EXPO_PUBLIC_ENV !== 'production',
    }
  )
)

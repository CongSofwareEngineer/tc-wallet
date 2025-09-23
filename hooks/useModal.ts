import { useDispatch } from 'react-redux'

import { closeModal as closeModalSlices, ModalItem, openModal as openModalSlices } from '@/redux/slices/modalSlice'

const useModal = () => {
  const dispatch = useDispatch()

  const openModal = (params: ModalItem) => {
    dispatch(
      openModalSlices({
        maskClosable: true,
        showIconClose: true,
        open: true,

        ...params,
      })
    )
  }

  const closeModal = () => {
    dispatch(closeModalSlices())
  }

  return {
    openModal,
    closeModal,
  }
}

export default useModal

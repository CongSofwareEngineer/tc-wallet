import ModalAuth from '@/components/ModalAuth'
import { sleep } from '@/utils/functions'

import useModal from './useModal'

const useAuth = () => {
  const { openModal, closeModal } = useModal()
  const handleAuth = async () => {
    return await new Promise<boolean>((resolve, reject) => {
      openModal({
        maskClosable: false,
        onClose: () => reject(new Error('Authentication cancelled')),
        addModal: true,
        content: (
          <ModalAuth
            callback={async (result) => {
              closeModal()
              await sleep(500)

              if (result) {
                resolve(true)
              } else {
                reject(new Error('Authentication failed'))
              }
            }}
          />
        ),
      })
    })
  }

  return { handleAuth }
}

export default useAuth

import { useRouter } from 'expo-router'

import ModalAuth from '@/components/ModalAuth'
import { ERROR_TYPE } from '@/constants/erros'
import { KEY_STORAGE } from '@/constants/storage'
import { sleep } from '@/utils/functions'
import { getSecureData } from '@/utils/secureStorage'

import useModal from './useModal'

const useAuth = () => {
  const { openModal, closeModal } = useModal()
  const router = useRouter()

  const handleAuth = async (isNewModal = true) => {
    return await new Promise<boolean>(async (resolve, reject) => {
      const data = await getSecureData(KEY_STORAGE.PasscodeAuth)

      if (data) {
        openModal({
          maskClosable: false,
          onClose: () => reject(new Error(ERROR_TYPE.PassAuthClose)),
          addModal: isNewModal,
          content: (
            <ModalAuth
              callback={async (result) => {
                closeModal()
                await sleep(500)

                if (result) {
                  resolve(true)
                } else {
                  reject(new Error(ERROR_TYPE.PassAuthFailed))
                }
              }}
            />
          ),
        })
      } else {
        router.push('/secure-password')
        resolve(false)
      }
    })

    // return true
  }

  return { handleAuth }
}

export default useAuth

import { useRouter } from 'expo-router'

import ModalAuth from '@/components/ModalAuth'
import { ERROR_TYPE } from '@/constants/erros'
import { KEY_STORAGE } from '@/constants/storage'
import { useAppSelector } from '@/redux/hooks'
import { sleep } from '@/utils/functions'
import { getSecureData } from '@/utils/secureStorage'

import { useMemo } from 'react'
import useModal from './useModal'

const useAuth = () => {
  const { openModal, closeModal } = useModal()
  const setting = useAppSelector((state) => state.settings)
  const router = useRouter()

  const isSetupAuth = useMemo(() => {
    return setting.isFaceId || setting.isPasscode
  }, [setting])

  const handleAuth = async (isNewModal = true) => {
    return await new Promise<boolean>(async (resolve, reject) => {
      const data = await getSecureData(KEY_STORAGE.PasscodeAuth)

      if (data || setting.isFaceId) {
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

  const handleVerify = async (isNewModal = true) => {
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
        resolve(true)
      }
    })
  }

  return { handleAuth, handleVerify, isSetupAuth }
}

export default useAuth

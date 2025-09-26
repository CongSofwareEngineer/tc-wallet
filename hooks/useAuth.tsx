import { useRouter } from 'expo-router'

import useModal from './useModal'

const useAuth = () => {
  const { openModal, closeModal } = useModal()
  const router = useRouter()

  const handleAuth = async (isNewModal = true) => {
    // return await new Promise<boolean>(async (resolve, reject) => {
    //   const data = await getSecureData(KEY_STORAGE.PassAuth)
    //   if (data) {
    //     openModal({
    //       maskClosable: false,
    //       onClose: () => reject(new Error(ERROR_TYPE.PassAuthClose)),
    //       addModal: isNewModal,
    //       content: (
    //         <ModalAuth
    //           callback={async (result) => {
    //             closeModal()
    //             await sleep(500)

    //             if (result) {
    //               resolve(true)
    //             } else {
    //               reject(new Error(ERROR_TYPE.PassAuthFailed))
    //             }
    //           }}
    //         />
    //       ),
    //     })
    //   } else {
    //     reject(new Error(ERROR_TYPE.PassAuthFailed))
    //   }
    // })

    return true
  }

  return { handleAuth }
}

export default useAuth

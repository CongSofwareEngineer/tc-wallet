import * as Linking from 'expo-linking'
import { useEffect } from 'react'

import ModalLoading from '@/components/ModalLoading'
import { sleep } from '@/utils/functions'
import WalletKit from '@/utils/walletKit'

import useModal from './useModal'

const useDeepLink = () => {
  const { openModal, closeModal } = useModal()

  useEffect(() => {
    const getData = async () => {
      try {
        const urlInit = await Linking.getInitialURL()
        const linkingParses = Linking.parse(urlInit || '')

        if (linkingParses?.queryParams?.uri?.includes('@2') && linkingParses?.queryParams?.uri) {
          openModal({
            maskClosable: false,
            showIconClose: false,
            content: <ModalLoading />,
          })
          const uri = linkingParses?.queryParams?.uri as string
          const kit = await WalletKit.init()
          await sleep(500)

          await kit.pair({ uri })
          closeModal()
        }
      } catch (error) { }
    }
    getData()
  }, [])
}

export default useDeepLink

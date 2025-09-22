import { ReactNode, useEffect } from 'react'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import useTheme from '@/hooks/useTheme'
import WalletKit from '@/utils/walletKit'

import MyModal from '../MyModal'

const ClientRender = ({ children }: { children: ReactNode }) => {
  const { background } = useTheme()

  useEffect(() => {
    const initData = async () => {
      const walletKit = await WalletKit.init()

      walletKit.on('session_delete', (e) => {
        console.log('session_delete', e)
        const { topic } = e
        WalletKit.onSessionDelete(topic)
      })

      walletKit.on('session_request', (e) => {
        console.log('session_request', e)
        const { id, params, topic } = e
        WalletKit.onApproveRequest(id, topic, params)
      })

      WalletKit.reConnect()
    }
    initData()
  }, [])

  return (
    <View style={{ flex: 1, backgroundColor: background.background }}>
      <SafeAreaView style={{ flex: 1 }}>{children}</SafeAreaView>
      <MyModal />
    </View>
  )
}

export default ClientRender

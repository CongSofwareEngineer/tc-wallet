import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useRouter } from 'expo-router'
import { ReactNode, useEffect, useLayoutEffect } from 'react'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { KEY_STORAGE } from '@/constants/storage'
import useLanguage from '@/hooks/useLanguage'
import useMode from '@/hooks/useMode'
import useRequestWC from '@/hooks/useReuestWC'
import useTheme from '@/hooks/useTheme'
import { sleep } from '@/utils/functions'
import { getDataLocal } from '@/utils/storage'
import WalletKit, { TypeWalletKit } from '@/utils/walletKit'

import MyModal from '../MyModal'

const ClientRender = ({ children }: { children: ReactNode }) => {
  const { background } = useTheme()
  const { mode } = useMode()
  const { setLanguage } = useLanguage()
  const { setRequest } = useRequestWC()
  const router = useRouter()

  useLayoutEffect(() => {
    const local = getDataLocal(KEY_STORAGE.Language)
    if (local) {
      setLanguage(local)
    }
  }, [])

  useEffect(() => {
    let instance: TypeWalletKit | null = null

    const onSessionDelete = (e: any) => {
      const { topic } = e
      WalletKit.onSessionDelete(topic)
    }

    const onSessionRequest = async (e: any) => {
      console.log({ onSessionRequest: e })

      setRequest({
        ...(e as any),
        timestamp: Date.now(),
        type: 'request',
      })
      await sleep(300)
      router.push('/approve')

      // const { id, params, topic } = e
      // WalletKit.onApproveRequest(id, topic, params)
    }

    const init = async () => {
      instance = await WalletKit.init()
      try {
        // defensively remove existing refs to avoid duplicates
        // @ts-ignore
        instance.off?.('session_delete', onSessionDelete)
        // @ts-ignore
        instance.off?.('session_request', onSessionRequest)
      } catch { }
      instance.on('session_delete', onSessionDelete)
      instance.on('session_request', onSessionRequest)
      WalletKit.reConnect()
    }
    init()

    return () => {
      if (instance) {
        try {
          instance.off('session_delete', onSessionDelete)
          instance.off('session_request', onSessionRequest)
        } catch { }
      }
    }
  }, [router, setRequest])

  return (
    <ThemeProvider value={mode === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={{ flex: 1, backgroundColor: background.background }}>
        <SafeAreaView style={{ flex: 1 }}>{children}</SafeAreaView>
        <MyModal />
      </View>
    </ThemeProvider>
  )
}

export default ClientRender

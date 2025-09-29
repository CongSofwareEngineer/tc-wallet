import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useRouter } from 'expo-router'
import { ReactNode, useEffect, useLayoutEffect } from 'react'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { KEY_STORAGE } from '@/constants/storage'
import useLanguage from '@/hooks/useLanguage'
import useMode from '@/hooks/useMode'
import usePreLoadData from '@/hooks/usePreLoadData'
import useRequestWC from '@/hooks/useReuestWC'
import useTheme from '@/hooks/useTheme'
import { sleep } from '@/utils/functions'
import { getDataLocal } from '@/utils/storage'
import WalletKit, { TypeWalletKit } from '@/utils/walletKit'

import MyModal from '../MyModal'

const ClientRender = ({ children }: { children: ReactNode }) => {
  usePreLoadData()

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
      try {
        const { topic } = e
        WalletKit.onSessionDelete(topic)
      } catch (error) {
        console.error({ onSessionDelete: error })
      }
    }

    const init = async () => {
      try {
        instance = await WalletKit.init()
        try {
          // defensively remove existing refs to avoid duplicates
          // @ts-ignore
          instance.off?.('session_delete', (e) => { })
          // @ts-ignore
          instance.off?.('session_request', (e) => { })
        } catch { }
        await sleep(500)
        instance.on('session_delete', onSessionDelete)
        instance.on('session_request', async (e) => {
          try {
            console.log({ onSessionRequest: e })
            if (e.params.request) {
              setRequest({
                ...(e as any),
                timestamp: Date.now(),
                type: 'request',
              })
              await sleep(300)
              router.push('/approve')
            }
          } catch (error) {
            console.error({ onSessionRequest: error })
          }
        })
        // auto reconnect
        await WalletKit.reConnect()
      } catch (error) {
        console.error({ init: error })
      }
    }
    init()

    return () => {
      if (instance) {
        try {
          instance.off('session_delete', (e) => { })
          instance.off('session_request', (e) => { })
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

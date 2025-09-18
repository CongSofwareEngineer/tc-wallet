import '@/utils/debug/reactotron'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import '@walletconnect/react-native-compat'
import { useCameraPermissions } from 'expo-camera'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import 'react-native-reanimated'

import { KEY_STORAGE } from '@/constants/storage'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { getSecureData } from '@/utils/secureStorage'
import WalletEvmUtil from '@/utils/walletEvm'

export default function RootLayout() {
  const colorScheme = useColorScheme()
  const [, requestPermission] = useCameraPermissions()

  console.log({ colorScheme })

  useEffect(() => {
    ; (async () => {
      requestPermission()
      // const wc = await getWallet()
      const arrWallet = await Promise.all([WalletEvmUtil.createWallet(0), WalletEvmUtil.createWallet(1), WalletEvmUtil.createWallet(2)])

      console.log({ arrWallet })
    })()
  }, [requestPermission])

  useEffect(() => {
    getSecureData(KEY_STORAGE.Mnemonic).then((res) => {
      console.log({ res })
    })
  }, [])

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* <Stack.Screen name="(tabs)" options={{ headerShown: false }} /> */}
        {/* <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} /> */}
        {/* <Stack.Screen name="/" options={{ headerShown: false }} /> */}

        {/* <Stack.Screen name="home" options={{ headerShown: false }} />
        <Stack.Screen name="setting" options={{ headerShown: false }} />
        <Stack.Screen name="create-wallet" options={{ headerShown: false }} />
        <Stack.Screen name="import-wallet" options={{ headerShown: false }} />
        <Stack.Screen name="connect-dapp" options={{ headerShown: false }} />
        <Stack.Screen name="backup" options={{ headerShown: false }} />
        <Stack.Screen name="wallet" options={{ headerShown: false }} /> */}
        <Stack.Screen name='approve/index' options={{ headerShown: false }} />
      </Stack>
      <StatusBar style='auto' />
    </ThemeProvider>
  )
}

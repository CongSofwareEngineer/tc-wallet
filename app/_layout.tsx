import '@/utils/debug/reactotron'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import '@walletconnect/react-native-compat'
import { useCameraPermissions } from 'expo-camera'
import { StatusBar } from 'expo-status-bar'
import 'react-native-reanimated'

import { usePathname } from 'expo-router'

import ClientRender from '@/components/ClientRender'
import ReactQueryProvider from '@/components/ReactQueryProvider'
import StackScreen from '@/components/StackScreen'
import useMode from '@/hooks/useMode'

export default function RootLayout() {
  const { mode } = useMode()
  const [, requestPermission] = useCameraPermissions()
  const pathname = usePathname()
  console.log({ pathname })

  return (
    <ThemeProvider value={mode === 'dark' ? DarkTheme : DefaultTheme}>
      <ClientRender>
        <ReactQueryProvider>
          <StackScreen />
        </ReactQueryProvider>
        <StatusBar style='auto' />
      </ClientRender>
    </ThemeProvider>
  )
}

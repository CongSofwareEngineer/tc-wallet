import ClientRender from '@/components/ClientRender'
import MetaData from '@/components/MetaData'
import '@/components/NotiPlatform'
import ReactQueryProvider from '@/components/ReactQueryProvider'
import StackScreen from '@/components/StackScreen'
import { APP_CONFIG } from '@/constants/appConfig'
import registerNotifications from '@/hooks/notification'
import { persistor, store } from '@/redux/store'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import { Platform } from 'react-native'
import 'react-native-reanimated'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

if (APP_CONFIG.isDevelopment && Platform.OS !== 'web') {
  require('@/utils/debug/reactotron')
}
// Set the animation options. This is optional.
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
})

export default function RootLayout() {
  useEffect(() => {
    registerNotifications()
  }, [])

  return (
    <>
      {Platform.OS === 'web' && <MetaData />}
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ReactQueryProvider>
            <ClientRender>
              <StackScreen />
              <StatusBar style='auto' />
            </ClientRender>
          </ReactQueryProvider>
        </PersistGate>
      </Provider>
    </>
  )
}

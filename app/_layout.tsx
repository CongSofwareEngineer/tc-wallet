//
import '@/utils/debug/reactotron'
// import '@/utils/polyfills/buffer'
// import '@/utils/polyfills/crypto'

import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import 'react-native-reanimated'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import ClientRender from '@/components/ClientRender'
import ReactQueryProvider from '@/components/ReactQueryProvider'
import StackScreen from '@/components/StackScreen'
import { persistor, store } from '@/redux/store'

SplashScreen.preventAutoHideAsync().catch(() => {
  console.log('SplashScreen.preventAutoHideAsync')

  /* reloading the app might trigger some race conditions, ignore them */
})

export default function RootLayout() {
  useEffect(() => {
    // Delay hiding splash screen to show it longer
    const hideSplash = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000)) // Show splash for 2 seconds
        await SplashScreen.hideAsync()
      } catch (e) {
        console.warn(e)
      }
    }
    hideSplash()
  }, [])

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ClientRender>
          <ReactQueryProvider>
            <StackScreen />
          </ReactQueryProvider>
          <StatusBar style='auto' />
        </ClientRender>
      </PersistGate>
    </Provider>
  )
}

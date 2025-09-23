import '@/utils/debug/reactotron'
import '@walletconnect/react-native-compat'
import { usePathname } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import 'react-native-reanimated'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import ClientRender from '@/components/ClientRender'
import ReactQueryProvider from '@/components/ReactQueryProvider'
import StackScreen from '@/components/StackScreen'
import { persistor, store } from '@/redux/store'

export default function RootLayout() {
  usePathname()

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

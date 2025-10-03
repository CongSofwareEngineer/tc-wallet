//
import '@/utils/debug/reactotron'
// import '@/utils/polyfills/buffer'
// import '@/utils/polyfills/crypto'

import { StatusBar } from 'expo-status-bar'
import 'react-native-reanimated'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import ClientRender from '@/components/ClientRender'
import ReactQueryProvider from '@/components/ReactQueryProvider'
import StackScreen from '@/components/StackScreen'
import { persistor, store } from '@/redux/store'

// NOTE: Removed direct require to internal 'react-native/Libraries/...' module.
// That import breaks Expo Web (fb-batched-bridge-config-web warning). Not needed for normal app runtime.
export default function RootLayout() {
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

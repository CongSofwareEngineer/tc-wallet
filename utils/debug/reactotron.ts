// Reactotron setup (dev-only) for Expo/React Native
// Requires: yarn add -D reactotron-react-native @react-native-async-storage/async-storage
// Open Reactotron app on your computer to see logs.

import { Platform, TurboModuleRegistry } from 'react-native'
import Reactotron from 'reactotron-react-native'
import { reactotronRedux } from 'reactotron-redux'

if (__DEV__ && Platform.OS !== 'web') {
  const init = async () => {
    try {
      const scriptURL = TurboModuleRegistry.getEnforcing('SourceCode').getConstants().scriptURL
      const scriptHostname = scriptURL.split('://')[1].split(':')[0]

      const reactotronConfig = Reactotron.configure({
        name: 'TC Wallet',
        host: scriptHostname,
      })
        .useReactNative()
        .use(reactotronRedux())
        // .use(networking({
        //   ignoreUrls: /\/(generate_204)$/
        // }))
        .connect()
    } catch (e) {
      // reactotron not installed or failed to load — ignore in dev
      console.debug?.('Reactotron not initialized:', (e as Error)?.message)
    }
  }
  init()
}
export { }


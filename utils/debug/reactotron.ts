// Reactotron setup (dev-only) for Expo/React Native
// Requires: yarn add -D reactotron-react-native @react-native-async-storage/async-storage
// Open Reactotron app on your computer to see logs.

import { Platform } from 'react-native'

console.log({ __DEV__ })

try {
  if (__DEV__) {
    ; (async () => {
      try {
        // @ts-ignore dynamic dev import
        const { default: Reactotron } = await import('reactotron-react-native')
        const { NativeModules } = await import('react-native')
        const { default: AsyncStorage } = await import('@react-native-async-storage/async-storage')

        const scriptURL: string | null | undefined = NativeModules?.SourceCode?.scriptURL ?? null

        // Resolve host from (in order): env override -> scriptURL -> Expo Constants -> platform default
        const envHost = (process.env.REACTOTRON_HOST || process.env.EXPO_DEV_SERVER_HOST) as string | undefined

        // Helper to parse hostname from a URL string like 'http://192.168.1.10:8081/index.bundle'
        const getHostname = (url: string) => {
          try {
            return new URL(url).hostname
          } catch {
            // Fallback naive parse
            return url.split('://')[1]?.split(':')[0] || url.split(':')[0]
          }
        }

        let host: string | undefined = envHost
        if (!host && scriptURL) host = getHostname(scriptURL)

        if (!host) {
          try {
            const Constants = (await import('expo-constants')).default as any
            const expoHostUri: string | undefined = Constants?.expoConfig?.hostUri
            const legacyDebuggerHost: string | undefined = Constants?.manifest?.debuggerHost
            const manifest2HostUri: string | undefined = Constants?.manifest2?.extra?.expoClient?.hostUri
            const candidate = expoHostUri || legacyDebuggerHost || manifest2HostUri
            if (candidate) host = getHostname(candidate)
          } catch {
            // ignore if expo-constants not available
          }
        }

        if (!host) {
          // Final platform-based fallback
          host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost'
        }

        console.log('[Reactotron] resolve host:', { scriptURL, envHost, host })

        Reactotron.setAsyncStorageHandler(AsyncStorage).configure({ name: 'TC Wallet', host }).useReactNative({}).connect()
          ; (console as any).tron = Reactotron

        Reactotron.clear?.()
        Reactotron.log?.('Reactotron connected on', host)
      } catch (e) {
        // reactotron not installed or failed to load — ignore in dev
        console.debug?.('Reactotron not initialized:', (e as Error)?.message)
      }
    })()
  }
} catch (error) { }
export { }


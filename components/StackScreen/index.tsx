import { ParamListBase, StackNavigationState } from '@react-navigation/native'
import { createNativeStackNavigator, NativeStackNavigationEventMap, NativeStackNavigationOptions } from '@react-navigation/native-stack'
import { usePathname, withLayoutContext } from 'expo-router'
import React from 'react'

import TabNavigation from '@/app/(tabs)/_layout'
import BackupScreen from '@/app/backup'
import ConnectAccountScreen from '@/app/connect-account'
import ConnectDAppScreen from '@/app/connect-dapp'
import CreateWalletScreen from '@/app/create-wallet'
import WalletScreen from '@/app/wallet'
import useLanguage from '@/hooks/useLanguage'
import useRequestWC from '@/hooks/useReuestWC'
import useWallets from '@/hooks/useWallets'

const { Navigator, Screen } = createNativeStackNavigator()

export const JsStack = withLayoutContext<
  NativeStackNavigationOptions,
  typeof Navigator,
  StackNavigationState<ParamListBase>,
  NativeStackNavigationEventMap
>(Navigator)

const StackScreen = () => {
  const { translate } = useLanguage()
  const { wallets } = useWallets()
  const pathname = usePathname()
  const { requestWC } = useRequestWC()

  console.log({ pathname, requestWC })

  return (
    <Navigator
      screenOptions={{
        animation: 'none',
      }}
      initialRouteName={wallets.length === 0 ? 'create-wallet' : '(tabs)'}
    >
      <Screen
        name='backup'
        options={{
          title: 'Backup',
          presentation: 'modal',
          animation: 'fade_from_bottom',
          gestureEnabled: true,
          headerShown: false,
        }}
        component={BackupScreen}
      />
      <Screen
        name='connect-dapp'
        options={{
          title: 'Connect DApp',
          headerShown: false,
        }}
        component={ConnectDAppScreen}
      />
      <Screen
        name='create-wallet'
        options={{
          animation: 'none',
          title: 'TC Store',
          contentStyle: {
            backgroundColor: 'green',
          },
        }}
        component={CreateWalletScreen}
      />
      <Screen name='(tabs)' options={{ title: 'TC Store', headerShown: false }} component={TabNavigation} />
      <Screen
        name='wallet'
        options={{
          title: 'Wallet manage',
          animation: 'ios_from_right',
          headerBackTitle: translate('common.back'),
        }}
        component={WalletScreen}
      />
      <Screen
        name='connect-account'
        options={{
          title: 'Connect Account',
          animation: 'slide_from_bottom',
          presentation: 'modal',
          gestureEnabled: false,
          headerShown: false,
        }}
        component={ConnectAccountScreen}
      />
    </Navigator>
  )
}

export default StackScreen

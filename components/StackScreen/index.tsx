import { ParamListBase, StackNavigationState } from '@react-navigation/native'
import { createNativeStackNavigator, NativeStackNavigationEventMap, NativeStackNavigationOptions } from '@react-navigation/native-stack'
import { withLayoutContext } from 'expo-router'
import React from 'react'

import TabNavigation from '@/app/(tabs)/_layout'
import ApproveScreen from '@/app/approve'
import BackupScreen from '@/app/backup'
import CreateWalletScreen from '@/app/create-wallet'
import useLanguage from '@/hooks/useLanguage'
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

  return (
    <Navigator initialRouteName={wallets.length === 0 ? 'create-wallet' : '(tabs)'}>
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
        name='create-wallet'
        options={{
          animation: 'none',
          title: 'TC Store',
          headerStyle: {},
        }}
        component={CreateWalletScreen}
      />
      <Screen name='(tabs)' options={{ title: 'TC Store', headerShown: false }} component={TabNavigation} />
      <Screen
        name='approve'
        options={{
          title: 'TC Store',
        }}
        component={ApproveScreen}
      />
    </Navigator>
  )
}

export default StackScreen

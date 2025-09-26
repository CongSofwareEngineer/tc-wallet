import AntDesign from '@expo/vector-icons/AntDesign'
import { ParamListBase, StackNavigationState } from '@react-navigation/native'
import { createNativeStackNavigator, NativeStackNavigationEventMap, NativeStackNavigationOptions } from '@react-navigation/native-stack'
import { withLayoutContext } from 'expo-router'
import React from 'react'
import { TouchableOpacity, View } from 'react-native'

import TabNavigation from '@/app/(tabs)/_layout'
import BackupScreen from '@/app/backup'
import ConnectDAppScreen from '@/app/connect-dapp'
import CreateWalletScreen from '@/app/create-wallet'
import WalletScreen from '@/app/wallet'
import ThemedText from '@/components/UI/ThemedText'
import { COLORS, MODE } from '@/constants/style'
import useLanguage from '@/hooks/useLanguage'
import useMode from '@/hooks/useMode'
import usePassPhrase from '@/hooks/usePassPhrase'
import useTheme from '@/hooks/useTheme'
import useWallets from '@/hooks/useWallets'

import ConnectAccountScreen from '@/app/connect-account/[query]'

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
  const { passPhase } = usePassPhrase()
  const { mode } = useMode()
  const { text } = useTheme()
  console.log({ wallets, passPhase })

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
          headerShown: false,
        }}
        component={CreateWalletScreen}
      />
      <Screen name='(tabs)' options={{ title: 'TC Store', headerShown: false }} component={TabNavigation} />
      <Screen
        name='wallet'
        options={{
          title: 'Wallet manage',
          animation: 'ios_from_right',
          headerShown: true,
          header: ({ navigation, options }) => (
            <View
              style={{
                height: 70,
                backgroundColor: mode === MODE.Dark ? '#1a1a24cc' : COLORS.white,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 16,
              }}
            >
              <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8, marginRight: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, flex: 1 }}>
                  <AntDesign name='arrow-left' size={20} color={text.color} />
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <ThemedText style={{ fontSize: 16 }}>{translate('common.back')}</ThemedText>
                  </View>
                </View>
              </TouchableOpacity>
              <ThemedText style={{ fontWeight: '600', fontSize: 18 }}>{(options?.title as string) || 'Wallet manage'}</ThemedText>
            </View>
          ),
          headerStyle: {
            backgroundColor: '#f2f3f5',
          },
          headerTintColor: '#111',
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerShadowVisible: false,
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

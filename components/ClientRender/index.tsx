import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { ReactNode } from 'react'
import { Platform, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { COLORS } from '@/constants/style'
import useMode from '@/hooks/useMode'
import usePreLoadData from '@/hooks/usePreLoadData'
import useSubscribeWC from '@/hooks/useSubscribeWC'
import useTheme from '@/hooks/useTheme'

import MyAlert from '../MyAlert'
import MyModal from '../MyModal'
import MySheet from '../MySheet'

const ClientRender = ({ children }: { children: ReactNode }) => {
  usePreLoadData()
  useSubscribeWC()

  const { background } = useTheme()
  const { isDark } = useMode()

  return (
    <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      {Platform.OS === 'web' ? (
        <View
          style={{
            flex: 1,
            width: '100%',
            backgroundColor: background.background,
            alignItems: 'center',
          }}
        >
          <View
            style={{
              borderLeftWidth: 1,
              borderRightWidth: 1,
              borderColor: COLORS.black2,
              flex: 1,
              backgroundColor: background.background,
              maxWidth: 576,
              width: '100%',
            }}
          >
            <SafeAreaView style={{ flex: 1 }}>{children}</SafeAreaView>
            <MyModal />
            <MySheet />
          </View>
        </View>
      ) : (
        <View style={{ flex: 1, backgroundColor: background.background, maxWidth: 576, width: '100%' }}>
          <SafeAreaView style={{ flex: 1 }}>{children}</SafeAreaView>
          <MyModal />
          <MySheet />
        </View>
      )}
      <MyAlert />
    </ThemeProvider>
  )
}

export default ClientRender

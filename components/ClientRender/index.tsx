import { ReactNode } from 'react'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import useTheme from '@/hooks/useTheme'

import MyModal from '../MyModal'

const ClientRender = ({ children }: { children: ReactNode }) => {
  const { background } = useTheme()
  return (
    <View style={{ flex: 1, backgroundColor: background.background }}>
      <SafeAreaView style={{ flex: 1 }}>{children}</SafeAreaView>
      <MyModal />
    </View>
  )
}

export default ClientRender

import AntDesign from '@expo/vector-icons/AntDesign'
import { useRouter } from 'expo-router'
import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

import { COLORS } from '@/constants/style'
import useTheme from '@/hooks/useTheme'

const LineModal = () => {
  const { text } = useTheme()
  const router = useRouter()

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          if (router.canGoBack()) {
            router.back()
          } else {
            router.push('/(tabs)/home')
          }
        }}
      >
        <AntDesign name='arrow-left' size={16} color={text.color} />
      </TouchableOpacity>
      <View style={styles.line} />
      <View />
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignContent: 'center',
    flexDirection: 'row',
    paddingBottom: 12,
  },
  line: {
    borderRadius: 6,
    height: 8,
    backgroundColor: COLORS.gray2,
    width: 100,
  },
})

export default LineModal

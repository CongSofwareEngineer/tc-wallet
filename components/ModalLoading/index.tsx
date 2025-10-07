import React from 'react'
import { StyleSheet, View } from 'react-native'

import MyLoading from '@/components/MyLoading'
import ThemedText from '@/components/UI/ThemedText'
import useTheme from '@/hooks/useTheme'

interface LoadingProps {
  text?: string
  size?: number
}

const ModalLoading: React.FC<LoadingProps> = ({ text = 'Đang xử lý...', size = 40 }) => {
  const { text: textColors } = useTheme()

  return (
    <View style={styles.container}>
      <MyLoading size={size} />
      <ThemedText style={[styles.text, { color: textColors.color }]}>{text}</ThemedText>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    marginTop: 12,
    fontSize: 16,
    textAlign: 'center',
  },
})

export default ModalLoading

import { useRouter } from 'expo-router'
import React from 'react'
import { View } from 'react-native'

import ThemedText from '@/components/UI/ThemedText'
import ThemeTouchableOpacity from '@/components/UI/ThemeTouchableOpacity'

const BackupScreen = () => {
  const router = useRouter()
  return (
    <View style={{ flex: 1 }}>
      <ThemedText>BackupScreen</ThemedText>
      <ThemeTouchableOpacity
        onPress={() => {
          console.log('close modal', router.canGoBack())

          router.back()
        }}
      >
        <ThemedText>Close</ThemedText>
      </ThemeTouchableOpacity>
    </View>
  )
}

export default BackupScreen

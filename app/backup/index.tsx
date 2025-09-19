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
      <ThemeTouchableOpacity>
        <ThemedText
          onPress={() => {
            console.log('close modal')

            router.back()
          }}
        >
          Close
        </ThemedText>
      </ThemeTouchableOpacity>
    </View>
  )
}

export default BackupScreen

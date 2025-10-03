import AntDesign from '@expo/vector-icons/AntDesign'
import React from 'react'
import { StyleSheet, View } from 'react-native'

import ThemeTouchableOpacity from '@/components/UI/ThemeTouchableOpacity'
import ThemedText from '@/components/UI/ThemedText'
import { GAP_DEFAULT } from '@/constants/style'
import useTheme from '@/hooks/useTheme'

const Options = () => {
  const { mode } = useTheme()
  return (
    <View style={styles.optionContainer}>
      <ThemeTouchableOpacity style={styles.button}>
        <View>
          <AntDesign name='send' />
          <ThemedText>Send</ThemedText>
        </View>
      </ThemeTouchableOpacity>
      <ThemeTouchableOpacity style={styles.button}>
        <View>
          <AntDesign name='send' />
          <ThemedText>Send</ThemedText>
        </View>
      </ThemeTouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: GAP_DEFAULT.Gap12,
    width: '100%',
  },
  button: {
    flex: 1,
  },
})

export default Options

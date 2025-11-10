import React from 'react'
import { StyleSheet } from 'react-native'

import ThemedInput, { ThemedInputProps } from '@/components/UI/ThemedInput'
import useMode from '@/hooks/useMode'

const InputEnter = ({ ...props }: ThemedInputProps) => {
  const { isDark } = useMode()
  const styles = createStyles(isDark)
  return (
    <ThemedInput
      {...props}
      multiline
      noBorder={true}
      styleContentInput={styles.styleContentInput}
      style={styles.styleInput}
      autoCapitalize='none'
      autoCorrect={false}
    />
  )
}

const createStyles = (isDark: boolean) => {
  return StyleSheet.create({
    styleContentInput: {
      paddingHorizontal: 0,
      // backgroundColor: 'transparent',
    },
    styleInput: {
      fontSize: 16,
      color: isDark ? '#FFFFFF' : '#1F2937',
      paddingVertical: 0,
      fontWeight: '500',
      // backgroundColor: 'transparent',
    },
  })
}

export default InputEnter

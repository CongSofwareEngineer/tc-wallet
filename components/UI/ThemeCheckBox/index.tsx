import { Checkbox, CheckboxProps } from 'expo-checkbox'
import React from 'react'
import { StyleSheet } from 'react-native'

import { COLORS } from '@/constants/style'
import useMode from '@/hooks/useMode'

const ThemeCheckBox = (props: CheckboxProps) => {
  const { isDark } = useMode()
  return (
    <Checkbox
      color={props.value ? (isDark ? COLORS.green600 : COLORS.green600) : undefined}
      {...props}
      style={[styles.checkboxBase, props.value && styles.checkboxChecked, props.style]}
    />
  )
}
const styles = StyleSheet.create({
  checkboxBase: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: 'rgba(150,150,150,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: COLORS.green600,
    borderColor: COLORS.green600,
  },
})
export default ThemeCheckBox

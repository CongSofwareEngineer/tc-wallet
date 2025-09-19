import React from 'react'
import { StyleSheet, TouchableOpacity, TouchableOpacityProps } from 'react-native'

import { COLORS } from '@/constants/style'

type Props = {
  type?: 'default' | 'primary' | 'danger'
} & TouchableOpacityProps

const ThemeTouchableOpacity = ({ type = 'default', ...props }: Props) => {
  return (
    <TouchableOpacity
      {...props}
      style={[
        {
          opacity: props.disabled ? 0.5 : 1,
        },
        styles.container,
        styles[type],
        props.style,
      ]}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 8,
    paddingBottom: 8,

    alignItems: 'center',
    justifyContent: 'center',
  },
  default: {
    backgroundColor: COLORS.black2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gray2,
  },

  primary: {
    backgroundColor: COLORS.yellow,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.yellow1,
  },
  danger: {
    backgroundColor: COLORS.red1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.red,
  },
})

export default ThemeTouchableOpacity

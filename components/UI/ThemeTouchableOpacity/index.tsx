import React from 'react'
import { StyleSheet, TouchableOpacity, TouchableOpacityProps, View } from 'react-native'

import MyLoading from '@/components/MyLoading'
import { COLORS } from '@/constants/style'

type Props = {
  type?: 'default' | 'primary' | 'danger' | 'text'
  loading?: boolean
} & TouchableOpacityProps

const ThemeTouchableOpacity = ({ type = 'default', ...props }: Props) => {
  return (
    <TouchableOpacity
      {...props}
      activeOpacity={props.loading ? 1 : props.activeOpacity}
      style={[
        {
          opacity: props.disabled || props.loading ? 0.7 : 1,
        },
        styles.container,
        styles[type],
        props.style,
      ]}
      disabled={props.disabled || props.loading}
    >
      {props.loading ? (
        <View style={styles.loadingWrapper}>
          <MyLoading size={20} />
        </View>
      ) : (
        props.children
      )}
    </TouchableOpacity>
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
    minHeight: 40,
  },
  loadingWrapper: {
    height: 20,
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
  text: {
    backgroundColor: 'transparent',
    borderRadius: 0,
    borderWidth: 0,
    borderColor: 'transparent',
    paddingLeft: 0,
    paddingRight: 0,
    minHeight: 0,
    height: 'auto',
  },
})

export default ThemeTouchableOpacity

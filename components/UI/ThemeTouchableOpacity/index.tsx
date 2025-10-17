import React from 'react'
import { StyleSheet, TouchableOpacity, TouchableOpacityProps, View } from 'react-native'

import MyLoading from '@/components/MyLoading'
import { COLORS } from '@/constants/style'

type Props = {
  type?: 'default' | 'primary' | 'danger' | 'text' | 'outline'
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
    paddingVertical: 10,
    paddingTop: 8,
    paddingBottom: 8,

    // alignItems: 'center',
    // justifyContent: 'center',
    minHeight: 35,
  },
  loadingWrapper: {
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  default: {
    backgroundColor: '#00875A',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#006C48',
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
    paddingVertical: 0,
    minHeight: 0,
    height: 'auto',
  },
  outline: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.green600,
  },
})

export default ThemeTouchableOpacity

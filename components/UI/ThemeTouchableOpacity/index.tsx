import React from 'react'
import { StyleSheet, TouchableOpacity, TouchableOpacityProps, View } from 'react-native'

import MyLoading from '@/components/MyLoading'
import { COLORS } from '@/constants/style'
import { LinearGradient } from 'expo-linear-gradient'

type Props = {
  type?: 'default' | 'primary' | 'danger' | 'text' | 'outline'
  loading?: boolean
} & TouchableOpacityProps

const BgButton = ({ type }: { type?: 'default' | 'primary' | 'danger' | 'text' | 'outline' }) => {
  return (
    <LinearGradient
      style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0 }}
      colors={['#1c711c', '#2b8417', '#24ba06']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    />
  )
}

const ThemeTouchableOpacity = ({ type = 'default', ...props }: Props) => {
  return (
    <TouchableOpacity
      {...props}
      activeOpacity={props.loading ? 1 : props.activeOpacity}
      style={[
        {
          opacity: props.disabled || props.loading ? 0.7 : 1,
          position: 'relative',
        },
        styles.container,
        styles[type],
        props.style,
      ]}
      disabled={props.disabled || props.loading}
    >
      {type === 'default' && <BgButton />}
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
    minHeight: 30,
  },
  loadingWrapper: {
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 'auto',
  },
  default: {
    overflow: 'hidden',
    // backgroundColor: '#00875A',
    borderRadius: 8,
    borderWidth: 1,
    // borderColor: '#006C48',
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

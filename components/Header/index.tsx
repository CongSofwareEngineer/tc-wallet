import { useRouter } from 'expo-router'
import React, { ReactNode } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

import { COLORS, MODE } from '@/constants/style'
import useMode from '@/hooks/useMode'
import useTheme from '@/hooks/useTheme'

import IconAntd from '../UI/Icon/Antd'
import ThemedText from '../UI/ThemedText'

type Props = {
  title: ReactNode
  titleBack?: ReactNode
  onBackPress?: () => void
  leftSide?: ReactNode
  rightSide?: ReactNode
  urlDefault?: string
}
const HeaderScreen = ({ title, urlDefault = '/(tabs)/home', onBackPress, leftSide, rightSide, titleBack }: Props) => {
  const router = useRouter()
  const { text } = useTheme()
  const { mode } = useMode()
  return (
    <View style={[styles.container, styles[`container${mode}`]]}>
      <TouchableOpacity
        onPress={() => {
          if (onBackPress) {
            onBackPress()
          } else {
            if (router?.canGoBack()) {
              router.back()
            } else {
              router.push(urlDefault as any)
            }
          }
        }}
      >
        {leftSide || <IconAntd color={text.color} name='arrow-left' size={20} />}
      </TouchableOpacity>
      <View style={styles.titleContainer}>
        <ThemedText style={styles.titleText}>{title}</ThemedText>
      </View>
      {rightSide || <View />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 60,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  [`container${MODE.Dark}`]: {
    borderBottomColor: COLORS.black2,
  },
  [`container${MODE.Light}`]: {
    // borderBottomColor: COLORS.gray1,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 18,
    fontWeight: '600',
  },
})

export default HeaderScreen

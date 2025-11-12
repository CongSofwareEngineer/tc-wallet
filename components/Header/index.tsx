import { useRouter } from 'expo-router'
import React, { ReactNode } from 'react'
import { StyleSheet, View } from 'react-native'

import ThemeTouchableOpacity from '@/components/UI/ThemeTouchableOpacity'
import { COLORS, MODE } from '@/constants/style'
import useMode from '@/hooks/useMode'
import useTheme from '@/hooks/useTheme'

import { width } from '@/utils/systems'
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
      <ThemeTouchableOpacity
        type='text'
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
        {leftSide || <IconAntd color={text.color} name='arrow-left' size={width(6)} />}
      </ThemeTouchableOpacity>
      <View style={styles.titleContainer}>
        <ThemedText type='title' style={styles.titleText}>
          {title}
        </ThemedText>
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
    borderBottomColor: COLORS.gray2,
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
    fontWeight: '600',
  },
})

export default HeaderScreen

import { useRouter } from 'expo-router'
import React, { ReactNode } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

import { COLORS } from '@/constants/style'
import useTheme from '@/hooks/useTheme'

import IconAntd from '../UI/Icon/Antd'
import ThemedText from '../UI/ThemedText'

type Props = {
  title: ReactNode
  titleBack?: ReactNode
  onBackPress?: () => void
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  urlDefault?: string
}
const HeaderScreen = ({ title, urlDefault = '/(tabs)/home', onBackPress, leftIcon, rightIcon, titleBack }: Props) => {
  const router = useRouter()
  const { text } = useTheme()
  return (
    <View style={styles.container}>
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
        {leftIcon || <IconAntd color={text.color} name='arrow-left' size={20} />}
      </TouchableOpacity>
      <View style={styles.titleContainer}>
        <ThemedText style={styles.titleText}>{title}</ThemedText>
      </View>
      {rightIcon || <View />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.black2,
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

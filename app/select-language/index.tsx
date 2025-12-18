import { AntDesign } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React from 'react'
import { View } from 'react-native'

import HeaderScreen from '@/components/Header'
import ThemedText from '@/components/UI/ThemedText'
import ThemeTouchableOpacity from '@/components/UI/ThemeTouchableOpacity'
import { COLORS } from '@/constants/style'
import useLanguage from '@/hooks/useLanguage'
import useMode from '@/hooks/useMode'
import useTheme from '@/hooks/useTheme'
import { LANGUAGE_SUPPORT } from '@/types/language'

import { width } from '@/utils/systems'
import styles from './styles'

const SelectLanguageScreen = () => {
  const { mode } = useMode()
  const { colors, text } = useTheme()
  const { translate, lang, setLanguage } = useLanguage()
  const router = useRouter()

  const languages = [
    {
      code: LANGUAGE_SUPPORT.EN,
      name: translate('selectLanguage.en'),
      flag: '🇺🇸',
    },
    {
      code: LANGUAGE_SUPPORT.VN,
      name: translate('selectLanguage.vn'),
      flag: '🇻🇳',
    },
  ]

  const handleSelectLanguage = (code: LANGUAGE_SUPPORT) => {
    setLanguage(code)
    router.back()
  }

  return (
    <View style={styles.container}>
      <HeaderScreen title={translate('selectLanguage.title')} />
      <View style={[styles.containerContent, styles[`containerContent${mode}`]]}>
        {languages.map((item) => (
          <ThemeTouchableOpacity
            type='outline'
            key={item.code}
            style={[
              styles.item,
              {
                borderColor: lang === item.code ? COLORS.green3 : colors.gray1,
                backgroundColor: lang === item.code ? (mode === 'light' ? COLORS.lightSuccess : '#00875A33') : 'transparent',
              },
            ]}
            onPress={() => handleSelectLanguage(item.code)}
          >
            <View style={styles.itemContent}>
              <ThemedText style={{ fontSize: width(13), lineHeight: width(13) }} >{item.flag}</ThemedText>
              <ThemedText type='defaultSemiBold'>{item.name}</ThemedText>
            </View>
            {lang === item.code && <AntDesign name='check' size={20} color={COLORS.green3} style={styles.checkIcon} />}
          </ThemeTouchableOpacity>
        ))}
      </View>
    </View>
  )
}

export default SelectLanguageScreen

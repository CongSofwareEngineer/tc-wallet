import AntDesign from '@expo/vector-icons/AntDesign'
import { useRouter } from 'expo-router'
import React from 'react'
import { ScrollView, TouchableOpacity, View } from 'react-native'

import ModalWarning from '@/components/ModalWarning'
import ThemedText from '@/components/UI/ThemedText'
import ThemeSwitch from '@/components/UI/ThemeSwitch'
import ThemeTouchableOpacity from '@/components/UI/ThemeTouchableOpacity'
import { COLORS, MODE } from '@/constants/style'
import useAlert from '@/hooks/useAlert'
import useAuth from '@/hooks/useAuth'
import useLanguage from '@/hooks/useLanguage'
import useModal from '@/hooks/useModal'
import useMode from '@/hooks/useMode'
import usePassPhrase from '@/hooks/usePassPhrase'
import useSetting from '@/hooks/useSetting'
import useTheme from '@/hooks/useTheme'
import useWallets from '@/hooks/useWallets'
import { LANGUAGE_SUPPORT } from '@/types/language'
import WalletKit from '@/utils/walletKit'

import { FontAwesome } from '@expo/vector-icons'
import Items from './Components/Item'
import Security from './Components/Security'
import styles from './styles'

const SettingScreen = () => {
  const { translate, setLanguage, lang } = useLanguage()
  const { text, colors } = useTheme()
  const { setMode, isDark } = useMode()
  const { handleAuth, isSetupAuth } = useAuth()
  const { openModal, closeModal } = useModal()
  const router = useRouter()
  const { setWallets } = useWallets()
  const { removeAllPassphrases } = usePassPhrase()
  const { settings, resetSetting, setSetting } = useSetting()
  const { showAlert } = useAlert()

  const resetApp = async () => {
    const callback = async () => {
      try {
        let isAuth = true
        if (settings?.isPasscode && isSetupAuth) {
          isAuth = await handleAuth(false)
        }

        if (isAuth) {
          setWallets([])
          removeAllPassphrases()
          setMode(MODE.Dark)
          setLanguage(LANGUAGE_SUPPORT.VN)
          WalletKit.sessionDeleteAll()
          resetSetting()
          router.replace('/create-wallet')
        }
      } catch (error) {
        showAlert({ text: translate('setting.authError') })
      }
    }
    openModal({
      showIconClose: false,
      maskClosable: false,

      content: <ModalWarning type='danger' onConfirm={callback} />,
    })
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={[styles.container]}>
        <View
          style={[
            {
              borderRadius: 100,
              backgroundColor: isDark ? colors.black : colors.gray1,
              paddingTop: 15,
              marginTop: 10,
            },
          ]}
        >
          <AntDesign name='setting' size={30} color={text.color} />
        </View>
        <ThemedText type='title'>{translate('setting.titlePage')}</ThemedText>

        <View style={{ gap: 20, marginTop: 20, width: '100%' }}>
          {/*manage wallets */}
          <Security />

          {/* // Theme */}
          <Items>
            <View style={styles.containerTitle}>
              <AntDesign name='sun' size={20} color={text.color} style={{ marginRight: 10 }} />
              <ThemedText type='defaultSemiBold'>{translate('setting.theme.title')}</ThemedText>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <View style={{ flex: 1 }}>
                <ThemedText>{translate('setting.theme.darkMode')}</ThemedText>
                <ThemedText opacity={0.7}>{translate('setting.theme.darkModeDesc')}</ThemedText>
              </View>
              <View>
                <ThemeSwitch value={isDark} onValueChange={() => setMode(isDark ? MODE.Light : MODE.Dark)} />
              </View>
            </View>
          </Items>

          {/* // Language */}
          <Items>
            <TouchableOpacity onPress={() => router.push('/select-language' as any)}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 4 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <FontAwesome name="language" size={20} color={text.color} style={{ marginRight: 10 }} />
                  <ThemedText type='defaultSemiBold'>{translate('common.language')}</ThemedText>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <ThemedText style={{ color: colors.gray }}>
                    {lang === LANGUAGE_SUPPORT.EN ? translate('selectLanguage.en') : translate('selectLanguage.vn')}
                  </ThemedText>
                  <AntDesign name='right' size={16} color={colors.gray} />
                </View>
              </View>
            </TouchableOpacity>
          </Items>

          {/* // Notification */}
          <Items>
            <View style={styles.containerTitle}>
              <AntDesign name='notification' size={20} color={text.color} style={{ marginRight: 10 }} />
              <ThemedText type='defaultSemiBold'>{translate('setting.notification.title')}</ThemedText>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <View>
                <ThemedText>{translate('setting.notification.pushNotification')}</ThemedText>
                <ThemedText opacity={0.7}>{translate('setting.notification.pushNotificationDesc')}</ThemedText>
              </View>
              <ThemeSwitch value={settings.isNotification} onValueChange={() => setSetting({ isNotification: !settings.isNotification })} />
            </View>
          </Items>

          {/* // Backup */}
          <Items>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
              <AntDesign name='save' size={20} color={text.color} style={{ marginRight: 10 }} />
              <ThemedText type='defaultSemiBold'>{translate('setting.backup.title')}</ThemedText>
            </View>
            <ThemeTouchableOpacity onPress={() => router.push('/backup')} style={{ marginBottom: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <AntDesign name='download' size={20} color={COLORS.white} style={{ marginRight: 10 }} />
                <ThemedText style={{ color: COLORS.white }}>{translate('setting.backup.backupNow')}</ThemedText>
              </View>
            </ThemeTouchableOpacity>
          </Items>

          {/* reset app */}
          <Items>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
              <AntDesign name='delete' size={20} color={COLORS.red} style={{ marginRight: 10 }} />
              <ThemedText style={{ color: COLORS.red }} type='defaultSemiBold'>
                {translate('setting.dangerZone')}
              </ThemedText>
            </View>
            <ThemeTouchableOpacity type='danger' onPress={resetApp} style={{ marginBottom: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <AntDesign name='rest' size={20} color={COLORS.white} style={{ marginRight: 10 }} />
                <ThemedText>{translate('setting.resetApp')}</ThemedText>
              </View>
            </ThemeTouchableOpacity>
          </Items>
        </View>
      </ScrollView>
    </View>
  )
}

export default SettingScreen

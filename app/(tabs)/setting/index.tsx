import AntDesign from '@expo/vector-icons/AntDesign'
import { useRouter } from 'expo-router'
import React from 'react'
import { Alert, ScrollView, View } from 'react-native'

import ModalWarning from '@/components/ModalWarning'
import ThemedText from '@/components/UI/ThemedText'
import ThemeSwitch from '@/components/UI/ThemeSwitch'
import ThemeTouchableOpacity from '@/components/UI/ThemeTouchableOpacity'
import { COLORS, MODE } from '@/constants/style'
import useAuth from '@/hooks/useAuth'
import useLanguage from '@/hooks/useLanguage'
import useModal from '@/hooks/useModal'
import useMode from '@/hooks/useMode'
import useTheme from '@/hooks/useTheme'
import useWallets from '@/hooks/useWallets'
import { LANGUAGE_SUPPORT } from '@/types/language'
import { width } from '@/utils/systems'

import Items from './Components/Item'
import styles from './styles'

const SettingScreen = () => {
  const { translate, setLanguage } = useLanguage()
  const { text, colors } = useTheme()
  const { mode, setMode } = useMode()
  const { handleAuth } = useAuth()
  const { openModal } = useModal()
  const router = useRouter()
  const { setWallets } = useWallets()

  const resetApp = async () => {
    const callback = async () => {
      try {
        const isAuth = await handleAuth()
        if (isAuth) {
          setWallets([])
          setMode(MODE.Dark)
          setLanguage(LANGUAGE_SUPPORT.VN)
          router.replace('/create-wallet')
        }
      } catch (error) {
        Alert.alert('Error', 'An error occurred while resetting the app.')
      }
    }
    openModal({
      showIconClose: false,
      maskClosable: false,

      content: <ModalWarning type='danger' onConfirm={callback} />,
    })
  }

  const handleShowWallet = async () => {
    try {
      const isAuth = await handleAuth()
      if (isAuth) {
        router.push('/wallet')
      }
    } catch (error) { }
  }

  return (
    <View style={{ flex: 1, padding: 15 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View
          style={[
            {
              borderRadius: 100,
              backgroundColor: colors.gray1,
              padding: 15,
              marginTop: 10,
            },
          ]}
        >
          <AntDesign name='setting' size={width(12)} color={text.color} />
        </View>
        <ThemedText type='title'>{translate('setting.titlePage')}</ThemedText>

        <View style={{ gap: 20, marginTop: 20, width: '100%' }}>
          {/*manage wallets */}
          <Items>
            <View style={styles.containerTitle}>
              <AntDesign name='security-scan' size={20} color={text.color} style={{ marginRight: 10 }} />
              <ThemedText type='defaultSemiBold'>Bảo mật</ThemedText>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <View style={{ flex: 1 }}>
                <ThemedText>Khoá sinh trắc học</ThemedText>
                <ThemedText opacity={0.7}>Sử dụng vân tay/Face ID để mở khóa ứng dụng</ThemedText>
              </View>
              <View>
                <ThemeSwitch value={mode === MODE.Dark} onValueChange={() => setMode(mode === MODE.Dark ? MODE.Light : MODE.Dark)} />
              </View>
            </View>
            <ThemeTouchableOpacity onPress={handleShowWallet} style={{ marginBottom: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <AntDesign name='eye' size={20} color={COLORS.white} style={{ marginRight: 10 }} />
                <ThemedText>Quản lý ví</ThemedText>
              </View>
            </ThemeTouchableOpacity>
          </Items>

          {/* // Theme */}
          <Items>
            <View style={styles.containerTitle}>
              <AntDesign name='sun' size={20} color={text.color} style={{ marginRight: 10 }} />
              <ThemedText type='defaultSemiBold'>Giao Diện</ThemedText>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <View style={{ flex: 1 }}>
                <ThemedText>Chế độ tối</ThemedText>
                <ThemedText opacity={0.7}>Sử dụng giao diện tối cho ứng dụng</ThemedText>
              </View>
              <View>
                <ThemeSwitch value={mode === MODE.Dark} onValueChange={() => setMode(mode === MODE.Dark ? MODE.Light : MODE.Dark)} />
              </View>
            </View>
          </Items>

          {/* // Notification */}
          <Items>
            <View style={styles.containerTitle}>
              <AntDesign name='notification' size={20} color={text.color} style={{ marginRight: 10 }} />
              <ThemedText type='defaultSemiBold'>{translate('setting.notification')}</ThemedText>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <View>
                <ThemedText>Chế độ tối</ThemedText>
                <ThemedText opacity={0.7}>Chế độ tối</ThemedText>
              </View>
              <ThemeSwitch value={mode === MODE.Dark} onValueChange={() => setMode(mode === MODE.Dark ? MODE.Light : MODE.Dark)} />
            </View>
          </Items>

          {/* // Backup */}
          <Items>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
              <AntDesign name='save' size={20} color={text.color} style={{ marginRight: 10 }} />
              <ThemedText type='defaultSemiBold'>{translate('setting.backup.title')}</ThemedText>
            </View>
            <ThemeTouchableOpacity onPress={() => router.push('/backup')} style={{ marginBottom: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
                Vùng nguy hiểm
              </ThemedText>
            </View>
            <ThemeTouchableOpacity type='danger' onPress={resetApp} style={{ marginBottom: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <AntDesign name='rest' size={20} color={COLORS.white} style={{ marginRight: 10 }} />
                <ThemedText>Reset App</ThemedText>
              </View>
            </ThemeTouchableOpacity>
          </Items>
        </View>
      </ScrollView>
    </View>
  )
}

export default SettingScreen

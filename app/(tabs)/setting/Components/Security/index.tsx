import AntDesign from '@expo/vector-icons/AntDesign'
import * as LocalAuthentication from 'expo-local-authentication'
import { useRouter } from 'expo-router'
import React from 'react'
import { TouchableHighlight, View } from 'react-native'
import { useDispatch } from 'react-redux'

import ModalWarning from '@/components/ModalWarning'
import ThemedText from '@/components/UI/ThemedText'
import ThemeSwitch from '@/components/UI/ThemeSwitch'
import { KEY_STORAGE } from '@/constants/storage'
import useAlert from '@/hooks/useAlert'
import useAuth from '@/hooks/useAuth'
import useLanguage from '@/hooks/useLanguage'
import useModal from '@/hooks/useModal'
import useMode from '@/hooks/useMode'
import useSetting from '@/hooks/useSetting'
import useTheme from '@/hooks/useTheme'
import { useAppSelector } from '@/redux/hooks'
import { setPasscode } from '@/redux/slices/settingsSlice'
import { openSetting } from '@/utils/functions'
import { removeSecureData } from '@/utils/secureStorage'
import { ActivityAction } from 'expo-intent-launcher'
import styles from '../../styles'
import Items from '../Item'

const Security = () => {
  const { text, colors } = useTheme()
  const { mode, setMode } = useMode()
  const { showAlert } = useAlert()
  const { handleAuth } = useAuth()
  const router = useRouter()
  const dispatch = useDispatch()
  const { closeModal, openModal } = useModal()
  const { setSetting } = useSetting()
  const { translate } = useLanguage()
  const setting = useAppSelector((state) => state.settings)

  const handleChangePasscode = () => {
    console.log('handleChangePasscode', setting)

    const callbackDisable = async () => {
      try {
        const isAuth = await handleAuth(false)
        if (isAuth) {
          dispatch(setPasscode(false))
          removeSecureData(KEY_STORAGE.PasscodeAuth)
        }
      } catch (error) { }
    }
    if (setting.isPasscode) {
      openModal({
        content: <ModalWarning onConfirm={callbackDisable} message={translate('setting.security.modal.disableAuth')} />,
      })
    } else {
      router.push('/secure-password')
    }
  }

  const handleEditPasscode = async () => {
    console.log('handleEditPasscode')

    const callbackDisable = async () => {
      try {
        const isAuth = await handleAuth(false)
        if (isAuth) {
          router.push('/secure-password')
        }
      } catch (error) { }
    }
    openModal({
      content: <ModalWarning onConfirm={callbackDisable} message={translate('setting.security.modal.enablePasscode')} />,
    })
  }

  const handleChangeFaceId = async () => {
    const callbackDisable = async () => {
      try {
        const isAuth = await handleAuth(false)
        if (isAuth) {
          setSetting({ isFaceId: false })
        }
      } catch (error) { }
    }
    if (setting.isFaceId) {
      openModal({
        content: <ModalWarning onConfirm={callbackDisable} message={translate('setting.security.modal.disableAuth')} />,
      })
    } else {
      const isSupport = await LocalAuthentication.hasHardwareAsync()

      if (isSupport) {
        const isEnrolled = await LocalAuthentication.isEnrolledAsync()
        const dataFaceId: any = await LocalAuthentication.authenticateAsync({
          biometricsSecurityLevel: 'strong',
          promptMessage: 'Xác thực sinh trắc học',
          cancelLabel: 'Huỷ',
          fallbackLabel: 'Sử dụng mật khẩu',
          disableDeviceFallback: true,
          requireConfirmation: true,
        })
        if (dataFaceId?.error) {
          showAlert({ text: translate('setting.security.error.notSupported') })
        }
        if (dataFaceId.success) {
          setSetting({ isFaceId: true })
          showAlert({ text: translate('setting.security.success') })
        }

        console.log({ isEnrolled, dataFaceId })
      } else {
        await openSetting(ActivityAction.SECURITY_SETTINGS);
        showAlert({ text: translate('setting.security.error.notSupported') })
      }
    }
  }

  return (
    <Items>
      <View style={styles.containerTitle}>
        <AntDesign name='security-scan' size={20} color={text.color} style={{ marginRight: 10 }} />
        <ThemedText type='defaultSemiBold'>{translate('setting.security.title')}</ThemedText>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <View style={{ flex: 1 }}>
          <ThemedText>{translate('setting.security.biometric.title')}</ThemedText>
          <ThemedText opacity={0.7}>{translate('setting.security.biometric.desc')}</ThemedText>
        </View>
        <TouchableHighlight onPress={handleChangeFaceId}>
          <View style={{ position: 'relative' }}>
            <ThemeSwitch value={setting.isFaceId} />
            <View style={{ position: 'absolute', zIndex: 10, top: 0, left: 0, right: 0, bottom: 0 }} />
          </View>
        </TouchableHighlight>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <View style={{ flex: 1 }}>
          <ThemedText>{translate('setting.security.passcode.title')} </ThemedText>
          <ThemedText opacity={0.7}>{translate('setting.security.passcode.desc')}</ThemedText>
        </View>
        <TouchableHighlight onPress={handleChangePasscode}>
          <View style={{ position: 'relative' }}>
            <ThemeSwitch value={setting.isPasscode} />
            <View style={{ position: 'absolute', zIndex: 10, top: 0, left: 0, right: 0, bottom: 0 }} />
          </View>
        </TouchableHighlight>
      </View>
      {setting?.isPasscode && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <View style={{ flex: 1 }}>
            <ThemedText>{translate('setting.security.resetPasscode.title')} </ThemedText>
            <ThemedText opacity={0.7}>{translate('setting.security.resetPasscode.desc')}</ThemedText>
          </View>
          <TouchableHighlight onPress={handleEditPasscode}>
            <AntDesign name='edit' size={20} color={text.color} />
          </TouchableHighlight>
        </View>
      )}
      {/* <ThemeTouchableOpacity onPress={() => router.push('/wallet')} style={{ marginBottom: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <AntDesign name='eye' size={20} color={COLORS.white} style={{ marginRight: 10 }} />
          <ThemedText>Quản lý ví</ThemedText>
        </View>
      </ThemeTouchableOpacity> */}
    </Items>
  )
}

export default Security

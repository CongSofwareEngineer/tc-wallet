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
import useAuth from '@/hooks/useAuth'
import useModal from '@/hooks/useModal'
import useMode from '@/hooks/useMode'
import useTheme from '@/hooks/useTheme'
import { useAppSelector } from '@/redux/hooks'
import { setPasscode } from '@/redux/slices/settingsSlice'
import { removeSecureData } from '@/utils/secureStorage'

import styles from '../../styles'
import Items from '../Item'

const Security = () => {
  const { text, colors } = useTheme()
  const { mode, setMode } = useMode()
  const { handleAuth } = useAuth()
  const router = useRouter()
  const dispatch = useDispatch()
  const { closeModal, openModal } = useModal()
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
        content: <ModalWarning onConfirm={callbackDisable} message='Bạn có chắc chắn muốn tắt mật khẩu?' />,
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
      content: <ModalWarning onConfirm={callbackDisable} message='Bạn có chắc chắn muốn đặt mật khẩu?' />,
    })
  }

  const handleChangeFaceId = async () => {
    const callbackDisable = async () => {
      try {
        const isAuth = await handleAuth(false)
        if (isAuth) {
          dispatch(setPasscode(false))
          removeSecureData(KEY_STORAGE.PasscodeAuth)
        }
      } catch (error) { }
    }
    if (setting.isFaceId) {
      openModal({
        content: <ModalWarning onConfirm={callbackDisable} message='Bạn có chắc chắn muốn tắt mật khẩu?' />,
      })
    } else {
      const isSupport = await LocalAuthentication.hasHardwareAsync()
      console.log({ isSupport })

      if (isSupport) {
        await LocalAuthentication.cancelAuthenticate()
        const isEnrolled = await LocalAuthentication.isEnrolledAsync()
        const dataFaceId = await LocalAuthentication.authenticateAsync({
          biometricsSecurityLevel: 'strong',
          promptMessage: 'Xác thực sinh trắc học',
          cancelLabel: 'Huỷ',
          fallbackLabel: 'Sử dụng mật khẩu',
          disableDeviceFallback: true,
          requireConfirmation: true,
        })

        console.log({ isEnrolled, dataFaceId })
      } else {
      }
    }
  }

  return (
    <Items>
      <View style={styles.containerTitle}>
        <AntDesign name='security-scan' size={20} color={text.color} style={{ marginRight: 10 }} />
        <ThemedText type='defaultSemiBold'>Bảo mật</ThemedText>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <View style={{ flex: 1 }}>
          <ThemedText>Khoá sinh trắc học</ThemedText>
          <ThemedText opacity={0.7}>Vân tay/Face ID bảo vệ dữ liệu</ThemedText>
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
          <ThemedText>Mật khẩu </ThemedText>
          <ThemedText opacity={0.7}>Sử dụng mật khẩu bảo vệ dữ liệu</ThemedText>
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
            <ThemedText>Đặt lại Mật khẩu </ThemedText>
            <ThemedText opacity={0.7}>Sử dụng mật khẩu bảo vệ dữ liệu</ThemedText>
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

import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React, { useCallback, useState, useTransition } from 'react'
import { ScrollView, TouchableOpacity, Vibration, View } from 'react-native'
import { useDispatch } from 'react-redux'

import HeaderScreen from '@/components/Header'
import ModalLoading from '@/components/ModalLoading'
import ThemedText from '@/components/UI/ThemedText'
import { KEY_STORAGE } from '@/constants/storage'
import useModal from '@/hooks/useModal'
import useMode from '@/hooks/useMode'
import { setPasscode } from '@/redux/slices/settingsSlice'
import { sleep } from '@/utils/functions'
import { saveSecureData } from '@/utils/secureStorage'

import { createStyles } from './styles'

const SecurePasswordScreen = () => {
  const { isDark } = useMode()
  const styles = createStyles(isDark)
  const [isPending, startTransition] = useTransition()
  const { openModal, closeModal } = useModal()
  const dispatch = useDispatch()

  const [step, setStep] = useState<'create' | 'confirm'>('create')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [pressedKey, setPressedKey] = useState<string | null>(null)

  const currentPassword = step === 'create' ? password : confirmPassword
  const maxLength = 4

  const handleKeyPress = useCallback(
    async (key: string) => {
      try {
        if (currentPassword.length >= maxLength) return

        setPressedKey(key)
        setTimeout(() => setPressedKey(null), 150)

        if (step === 'create') {
          const newPassword = password + key
          setPassword(newPassword)
          setError('')

          if (newPassword.length === maxLength) {
            setTimeout(() => {
              setStep('confirm')
              setSuccess('')
            }, 500)
          }
        } else {
          const newConfirmPassword = confirmPassword + key
          setConfirmPassword(newConfirmPassword)
          setError('')

          if (newConfirmPassword.length === maxLength) {
            if (newConfirmPassword === password) {
              openModal({
                maskClosable: false,
                showIconClose: false,
                content: <ModalLoading />,
              })
              Vibration.vibrate(100)
              await saveSecureData(KEY_STORAGE.PasscodeAuth, password)
              dispatch(setPasscode(true))
              await sleep(2000)
              closeModal()
              router.back()
            } else {
              setError('Passwords do not match')
              Vibration.vibrate([100, 100, 100])
              setTimeout(() => {
                setConfirmPassword('')
                setError('')
              }, 1500)
            }
          }
        }
      } catch (error) { }
    },
    [step, password, confirmPassword, maxLength, currentPassword.length, closeModal, dispatch, openModal]
  )

  const handleDelete = useCallback(() => {
    if (step === 'create') {
      setPassword((prev) => prev.slice(0, -1))
    } else {
      setConfirmPassword((prev) => prev.slice(0, -1))
    }
    setError('')
  }, [step])

  const handleBack = useCallback(() => {
    if (step === 'confirm') {
      setStep('create')
      setConfirmPassword('')
      setError('')
      setSuccess('')
    }
  }, [step])

  const getDotStyle = (index: number) => {
    const isActive = index < currentPassword.length
    const hasError = error && step === 'confirm'

    if (hasError) {
      return [styles.passwordDot, styles.passwordDotError]
    }

    return [styles.passwordDot, isActive ? styles.passwordDotFilled : styles.passwordDotEmpty]
  }

  const renderKeypadButton = (number: string) => {
    const isPressed = pressedKey === number

    return (
      <TouchableOpacity
        key={number}
        style={[styles.keypadButton, isDark ? styles.keypadButtonDark : styles.keypadButtonLight, isPressed && styles.keypadButtonPressed]}
        onPress={() => handleKeyPress(number)}
        disabled={currentPassword.length >= maxLength}
        activeOpacity={0.7}
      >
        <ThemedText style={styles.keypadNumber}>{number}</ThemedText>
      </TouchableOpacity>
    )
  }

  const renderKeypad = () => {
    const rows = [
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7', '8', '9'],
    ]

    return (
      <View style={styles.keypad}>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.keypadRow}>
            {row.map(renderKeypadButton)}
          </View>
        ))}

        {/* Bottom row with back, 0, delete */}
        <View style={styles.keypadRow}>
          {step === 'confirm' ? (
            <TouchableOpacity style={[styles.keypadActionButton, { backgroundColor: isDark ? '#333333' : '#E9ECEF' }]} onPress={handleBack}>
              <Ionicons name='arrow-back' size={24} color={isDark ? '#FFFFFF' : '#000000'} />
            </TouchableOpacity>
          ) : (
            <View style={styles.keypadActionButton} />
          )}

          {renderKeypadButton('0')}

          <TouchableOpacity
            style={[styles.keypadActionButton, currentPassword.length > 0 ? styles.deleteButton : styles.deleteButtonDisabled]}
            onPress={handleDelete}
            disabled={currentPassword.length === 0}
          >
            <Ionicons name='backspace-outline' size={24} color={currentPassword.length > 0 ? '#FFFFFF' : isDark ? '#666666' : '#999999'} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <HeaderScreen title={'Security PIN'} />

      <ScrollView>
        <View style={styles.header}>
          <ThemedText style={styles.title}>{step === 'create' ? 'Create Security PIN' : 'Confirm Security PIN'}</ThemedText>
          <ThemedText style={styles.subtitle}>
            {step === 'create' ? 'Create a 4-digit PIN to secure your wallet' : 'Please enter your PIN again to confirm'}
          </ThemedText>
        </View>

        <View style={styles.passwordSection}>
          <ThemedText style={styles.stepIndicator}>Step {step === 'create' ? '1' : '2'} of 2</ThemedText>

          <View style={styles.passwordContainer}>
            {Array.from({ length: maxLength }, (_, index) => (
              <View key={index} style={getDotStyle(index)} />
            ))}
          </View>

          {error ? (
            <ThemedText style={styles.errorMessage}>{error}</ThemedText>
          ) : success ? (
            <ThemedText style={styles.successMessage}>{success}</ThemedText>
          ) : null}
        </View>

        {renderKeypad()}
      </ScrollView>
    </View>
  )
}

export default SecurePasswordScreen

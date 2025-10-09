import { Ionicons } from '@expo/vector-icons'
import { documentDirectory, writeAsStringAsync } from 'expo-file-system/legacy'
import { useRouter } from 'expo-router'
import React, { useCallback, useState } from 'react'
import { Alert, Animated, KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity, View } from 'react-native'

import HeaderScreen from '@/components/Header'
import ThemedText from '@/components/UI/ThemedText'
import { APP_INFO } from '@/constants/appConfig'
import { useAlert } from '@/hooks/useAlert'
import useMode from '@/hooks/useMode'
import { useAppSelector } from '@/redux/hooks'
import { encodeData } from '@/utils/crypto'

import { createStyles } from './styles'

const BackupScreen = () => {
  const router = useRouter()
  const { showSuccess, showError } = useAlert()
  const { isDark } = useMode()
  const styles = createStyles(isDark)

  const wallets = useAppSelector((state) => state.wallet)

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [focusedInput, setFocusedInput] = useState<string | null>(null)

  const passwordStrength = getPasswordStrength(password)
  const isValidForm = password.length >= 4 && password === confirmPassword && passwordStrength.score >= 3

  const handleBackup = useCallback(async () => {
    if (!isValidForm) return

    setIsLoading(true)
    try {
      let timestamp = new Date().toISOString()
      timestamp = timestamp.replaceAll(':', '_')
      timestamp = timestamp.replaceAll('-', '_')
      timestamp = timestamp.replaceAll('.', '_')
      // Tạo backup data với password để tăng security
      const backupData = {
        version: '1.0',
        timestamp: timestamp,
        wallets: wallets.wallets,
        password: password, // Include password in encryption
      }

      // Sử dụng encodeData từ crypto utils (AES encryption)
      const encryptedData = await encodeData(backupData, password + timestamp)

      if (!encryptedData) {
        throw new Error('Failed to encrypt backup data')
      }

      const backupObject = {
        encrypted: true,
        data: encryptedData,
        timestamp: timestamp,
        app: APP_INFO.displayName,
        version: APP_INFO.version,
        identifier: APP_INFO.identifier,
      }

      // Tạo file JSON
      const fileName = `tc-wallet-backup_${timestamp}.json`

      const backupText = JSON.stringify(backupObject, null, 2)

      if (Platform.OS === 'web') {
        // Trên web, download file
        const blob = new Blob([backupText], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      } else {
        // Trên mobile, lưu file trực tiếp vào Documents directory
        const fileUri = documentDirectory + fileName
        await writeAsStringAsync(fileUri, backupText)

        // Thông báo file đã được lưu thành công
        Alert.alert(
          'Backup Saved Successfully! 🎉',
          `File saved to:\n${fileUri}\n\nFile name: ${fileName}\n\nYour wallet backup has been saved to your device's Documents folder.`,
          [
            {
              text: 'OK',
              style: 'default',
            },
          ]
        )
      }

      showSuccess('Backup file saved to your device successfully!')

      router.back()
    } catch {
      showError('Failed to create backup file. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [isValidForm, wallets, password, showSuccess, showError, router])

  function getPasswordStrength(pwd: string) {
    let score = 0
    let feedback = []

    if (pwd.length >= 8) score++
    else feedback.push('At least 8 characters')

    if (/[a-z]/.test(pwd)) score++
    else feedback.push('Lowercase letter')

    if (/[A-Z]/.test(pwd)) score++
    else feedback.push('Uppercase letter')

    if (/[0-9]/.test(pwd)) score++
    else feedback.push('Number')

    if (/[^A-Za-z0-9]/.test(pwd)) score++
    else feedback.push('Special character')

    const levels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong']
    const colors = ['#FF4444', '#FF8800', '#FFBB00', '#88CC00', '#44AA00']

    return {
      score,
      level: levels[score] || levels[0],
      color: colors[score] || colors[0],
      feedback,
    }
  }

  const renderPasswordInput = (
    value: string,
    onChangeText: (text: string) => void,
    placeholder: string,
    showPassword: boolean,
    onTogglePassword: () => void,
    inputKey: string
  ) => {
    const isFocused = focusedInput === inputKey
    const hasError = inputKey === 'confirm' && confirmPassword && confirmPassword !== password

    return (
      <View style={[styles.inputWrapper, isFocused && styles.inputWrapperFocused, hasError && styles.inputWrapperError]}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={isDark ? '#666666' : '#999999'}
          secureTextEntry={!showPassword}
          onFocus={() => setFocusedInput(inputKey)}
          onBlur={() => setFocusedInput(null)}
          autoCapitalize='none'
          autoCorrect={false}
        />
        <TouchableOpacity style={styles.eyeButton} onPress={onTogglePassword}>
          <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color={isDark ? '#999999' : '#666666'} />
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <HeaderScreen title='Backup Wallet' />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps='handled'
        automaticallyAdjustKeyboardInsets={true}
      >
        <View style={styles.headerSection}>
          <ThemedText style={styles.title}>Create Backup</ThemedText>
          <ThemedText style={styles.subtitle}>Secure your wallet data with a password-protected backup file saved to your device</ThemedText>
        </View>

        <View style={styles.warningSection}>
          <ThemedText style={styles.warningTitle}>⚠️ Important Security Notice</ThemedText>
          <ThemedText style={styles.warningText}>
            • Store your backup file in a secure location{'\n'}• Never share your backup password{'\n'}• Keep multiple copies in different secure
            locations{'\n'}• This backup contains sensitive wallet information
          </ThemedText>
        </View>

        <View style={styles.formSection}>
          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Backup Password</ThemedText>
            {renderPasswordInput(password, setPassword, 'Enter strong password', showPassword, () => setShowPassword(!showPassword), 'password')}
            {password && (
              <View style={styles.strengthContainer}>
                <ThemedText style={[styles.strengthText, { color: passwordStrength.color }]}>Strength: {passwordStrength.level}</ThemedText>
                <View style={styles.strengthBarContainer}>
                  <View style={[styles.strengthBar, { backgroundColor: passwordStrength.color, flex: passwordStrength.score }]} />
                  <View style={{ flex: 5 - passwordStrength.score }} />
                </View>
              </View>
            )}
          </View>

          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Confirm Password</ThemedText>
            {renderPasswordInput(
              confirmPassword,
              setConfirmPassword,
              'Confirm your password',
              showConfirmPassword,
              () => setShowConfirmPassword(!showConfirmPassword),
              'confirm'
            )}
            {confirmPassword && confirmPassword !== password && <ThemedText style={styles.errorText}>Passwords do not match</ThemedText>}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          {isLoading && (
            <View style={styles.progressContainer}>
              <ThemedText style={styles.progressText}>Creating backup...</ThemedText>
              <View style={styles.progressBar}>
                <Animated.View style={styles.progressFill} />
              </View>
            </View>
          )}

          <TouchableOpacity
            style={[styles.backupButton, (!isValidForm || isLoading) && styles.backupButtonDisabled]}
            onPress={handleBackup}
            disabled={!isValidForm || isLoading}
          >
            <ThemedText style={[styles.backupButtonText, (!isValidForm || isLoading) && styles.backupButtonTextDisabled]}>
              {isLoading ? 'Creating Backup...' : 'Create Backup'}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default BackupScreen

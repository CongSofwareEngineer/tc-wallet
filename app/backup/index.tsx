import { Ionicons } from '@expo/vector-icons'
import { EncodingType, StorageAccessFramework } from 'expo-file-system/legacy'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Animated, Platform, ScrollView, TextInput, TouchableOpacity, View } from 'react-native'

import HeaderScreen from '@/components/Header'
import KeyboardAvoiding from '@/components/KeyboardAvoiding'
import ThemedText from '@/components/UI/ThemedText'
import { APP_CONFIG } from '@/constants/appConfig'
import { useAlert } from '@/hooks/useAlert'
import useMode from '@/hooks/useMode'
import { useAppSelector } from '@/redux/hooks'
import { encodeData } from '@/utils/crypto'
import { getDataLocal, saveDataLocal } from '@/utils/storage'

import { createStyles } from './styles'

const BackupScreen = () => {
  const router = useRouter()
  const { showSuccess, showError } = useAlert()
  const { isDark } = useMode()
  const styles = createStyles(isDark)

  const wallets = useAppSelector((state) => state.wallet)
  const passphrases = useAppSelector((state) => state.passPhase)

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [focusedInput, setFocusedInput] = useState<string | null>(null)

  const passwordStrength = getPasswordStrength(password)
  const isValidForm = password.length >= 4 && password === confirmPassword && passwordStrength.score >= 1

  const handleBackup = async () => {
    if (!isValidForm) return

    setIsLoading(true)
    try {
      let timestamp = new Date().toISOString()
      timestamp = timestamp.replaceAll(':', '_')
      timestamp = timestamp.replaceAll('-', '_')
      timestamp = timestamp.replaceAll('.', '_')

      // Tạo backup data với password để tăng security
      const backupData = {
        version: APP_CONFIG.appVersion,
        timestamp: timestamp,
        wallets: wallets.wallets,
        passphrases: passphrases,
      }

      // Sử dụng encodeData từ crypto utils (AES encryption)
      const backupText = await encodeData(backupData, password)

      if (!backupText) {
        throw new Error('Failed to encrypt backup data')
      }

      // Tạo file TXT
      const fileName = `tc-wallet-backup_${timestamp}.txt`

      // Tạo nội dung text cho file backup

      if (Platform.OS === 'web') {
        // Trên web, download file trực tiếp
        const blob = new Blob([backupText], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        showSuccess('Backup saved to custom location!')
      } else {
        const urlDefault = getDataLocal('default_backup_location') || null

        const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync(urlDefault)

        if (permissions.granted) {
          // Gets SAF URI from response
          const uri = permissions.directoryUri
          saveDataLocal('default_backup_location', uri)
          const fileUri = await StorageAccessFramework.createFileAsync(uri, fileName, 'text/plain')

          // Gets all files inside of selected directory
          await StorageAccessFramework.writeAsStringAsync(fileUri, backupText, {
            encoding: EncodingType.UTF8,
          })

          showSuccess('Backup saved to custom location!')
          router.back()
        } else {
          showError('No location selected. Please try again.')
        }
      }

      // showSuccess('Backup process completed!')
      // router.back()
    } catch (error) {
      console.log({ error })

      showError('Failed to create backup file. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

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
    const colors = ['#b14608', '#FF8800', '#f19429', '#FFBB00', '#a3f204', '#44AA00', '#44AA00']

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
    <KeyboardAvoiding>
      <HeaderScreen title='Backup Wallet' />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps='handled'
        automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
        bounces={false}
      >
        <View style={styles.headerSection}>
          <ThemedText style={styles.subtitle}>
            Secure your wallet data with a password-protected backup text file. Choose Downloads, custom location, or share to save.
          </ThemedText>
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
    </KeyboardAvoiding>
  )
}

export default BackupScreen

import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Animated, Platform, ScrollView, Share, TextInput, TouchableOpacity, View } from 'react-native'
import RNFS from 'react-native-fs'

import HeaderScreen from '@/components/Header'
import KeyboardAvoiding from '@/components/KeyboardAvoiding'
import ThemedText from '@/components/UI/ThemedText'
import { APP_CONFIG } from '@/constants/appConfig'
import { useAlert } from '@/hooks/useAlert'
import useMode from '@/hooks/useMode'
import { useAppSelector } from '@/redux/hooks'
import { encodeData } from '@/utils/crypto'

import { getKeyEncode } from '@/utils/secureStorage'
import { createStyles } from './styles'

const BackupScreen = () => {
  console.log('BackupScreen smartphone')

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
      const encryptionKey = await getKeyEncode()

      // Tạo backup data với password để tăng security
      const backupData = {
        version: APP_CONFIG.appVersion,
        timestamp: timestamp,
        wallets: wallets.wallets,
        passphrases: passphrases,
        encryptionKey,
      }

      // Sử dụng encodeData từ crypto utils (AES encryption)
      const backupText = await encodeData(backupData, password)

      if (!backupText) {
        throw new Error('Failed to encrypt backup data')
      }

      // Tạo file TXT
      const fileName = `tc-wallet-backup_${timestamp}.txt`
      // iOS: Lưu vào cache rồi share để user chọn nơi lưu
      const filePath = `${RNFS.TemporaryDirectoryPath}/${fileName}`

      RNFS.writeFile(filePath, backupText, 'utf8')
        .then(async (success) => {
          try {
            const result = await Share.share({
              url: filePath,
              title: fileName,
            })

            if (result && result.action === Share.sharedAction) {
              showSuccess({ text: 'Backup file saved successfully!' })
              router.back()
            }
          } catch (error) {
            showError('Failed to create backup file. Please try again.')
          }
        })
        .catch((_err) => {
          showError('Failed to create backup file. Please try again.')
        })
      // const fileUri = `${cacheDirectory}${fileName}`

      // // // Ghi file vào cache

      // await writeAsStringAsync(fileUri, backupText, {
      //   encoding: EncodingType.UTF8,
      // })

      // const canShare = await isAvailableAsync()
      // if (!canShare) {
      //   throw new Error('Sharing is not available on this device')
      // }

      // // Share file để user chọn nơi lưu (Files, iCloud, etc.)
      // await shareAsync(fileUri, {
      //   UTI: 'public.plain-text',
      //   dialogTitle: 'Save Backup File',
      // })

      // // File đã được share/saved thành công
      // showSuccess('Backup file saved successfully!')
      // router.back()
    } catch {
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
            <ThemedText type='subtitle' style={styles.label}>
              Backup Password
            </ThemedText>
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
            <ThemedText type='subtitle' style={styles.label}>
              Confirm Password
            </ThemedText>
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

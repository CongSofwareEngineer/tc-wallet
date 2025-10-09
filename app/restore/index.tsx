import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Alert, KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity, View } from 'react-native'

import HeaderScreen from '@/components/Header'
import ThemedText from '@/components/UI/ThemedText'
import { useAlert } from '@/hooks/useAlert'
import { useFileSystem } from '@/hooks/useFileSystem'
import useMode from '@/hooks/useMode'

import { createStyles } from './styles'

const RestoreScreen = () => {
  const router = useRouter()
  const { showSuccess, showError } = useAlert()
  const { isDark } = useMode()
  const { readFileFromPicker } = useFileSystem()
  const styles = createStyles(isDark)

  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [selectedFile, setSelectedFile] = useState<any>(null)
  const [fileContent, setFileContent] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [focusedInput, setFocusedInput] = useState<string | null>(null)

  const isValidForm = password.length >= 4 && selectedFile && fileContent

  const handleSelectFile = async () => {
    try {
      const result = await readFileFromPicker({ type: 'text/plain' })

      if (result.content) {
        // Simulate file object for UI display
        const fileName = `backup_${Date.now()}.txt`
        const fileSize = result.content.length
        const mockFile = {
          name: fileName,
          size: fileSize,
          mimeType: 'text/plain',
        }

        setSelectedFile(mockFile)
        setFileContent(result.content)
        showSuccess(`File selected: ${fileName}`)
      } else {
        showError(result.error || 'Failed to read file')
      }
    } catch {
      showError('Failed to select file. Please try again.')
    }
  }

  const handleRestore = async () => {
    if (!isValidForm) return

    Alert.alert('Confirm Restore', 'This will replace your current wallet data with the backup. Are you sure you want to continue?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Restore',
        style: 'destructive',
        onPress: performRestore,
      },
    ])
  }

  const performRestore = async () => {
    if (!fileContent) {
      showError('No file content available')
      return
    }

    setIsLoading(true)
    try {
      // TODO: Implement restore logic here
      // 1. Decrypt file content with password: decodeData(fileContent, password)
      // 2. Validate backup format
      // 3. Restore wallet data to Redux store

      // For now, just simulate success
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate processing time

      showSuccess('Wallet restored successfully!')
      router.back()
    } catch {
      showError('Failed to restore wallet. Please check your password and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const renderPasswordInput = () => {
    const isFocused = focusedInput === 'password'

    return (
      <View style={[styles.inputWrapper, isFocused && styles.inputWrapperFocused]}>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder='Enter backup password'
          placeholderTextColor={isDark ? '#666666' : '#999999'}
          secureTextEntry={!showPassword}
          onFocus={() => setFocusedInput('password')}
          onBlur={() => setFocusedInput(null)}
          autoCapitalize='none'
          autoCorrect={false}
        />
        <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword(!showPassword)}>
          <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color={isDark ? '#999999' : '#666666'} />
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      enabled
    >
      <HeaderScreen title='Restore Wallet' />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps='handled'
        automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
        bounces={false}
      >
        <View style={styles.headerSection}>
          <ThemedText style={styles.title}>Restore from Backup</ThemedText>
          <ThemedText style={styles.subtitle}>Import your wallet backup file and enter the password to restore your wallet data.</ThemedText>
        </View>

        <View style={styles.warningSection}>
          <ThemedText style={styles.warningTitle}>⚠️ Important Notice</ThemedText>
          <ThemedText style={styles.warningText}>
            • This will replace all current wallet data{'\n'}• Make sure you have the correct backup file{'\n'}• Enter the exact password used during
            backup{'\n'}• Process cannot be undone once completed
          </ThemedText>
        </View>

        <View style={styles.formSection}>
          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Select Backup File</ThemedText>
            <TouchableOpacity style={styles.fileButton} onPress={handleSelectFile}>
              <View style={styles.fileButtonContent}>
                <Ionicons name='document-text' size={24} color={selectedFile ? '#4CAF50' : isDark ? '#999999' : '#666666'} />
                <View style={styles.fileButtonText}>
                  <ThemedText style={[styles.fileButtonTitle, selectedFile && styles.fileButtonTitleSelected]}>
                    {selectedFile ? selectedFile.name : 'Choose backup file (.txt)'}
                  </ThemedText>
                  {selectedFile && (
                    <ThemedText style={styles.fileButtonSubtitle}>
                      {Math.round(selectedFile.size / 1024)} KB • {selectedFile.mimeType || 'text/plain'}
                    </ThemedText>
                  )}
                </View>
                <Ionicons name='chevron-forward' size={20} color={isDark ? '#999999' : '#666666'} />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Backup Password</ThemedText>
            {renderPasswordInput()}
            <ThemedText style={styles.helpText}>Enter the password you used when creating this backup</ThemedText>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          {isLoading && (
            <View style={styles.progressContainer}>
              <ThemedText style={styles.progressText}>Restoring wallet...</ThemedText>
            </View>
          )}

          <TouchableOpacity
            style={[styles.restoreButton, (!isValidForm || isLoading) && styles.restoreButtonDisabled]}
            onPress={handleRestore}
            disabled={!isValidForm || isLoading}
          >
            <ThemedText style={[styles.restoreButtonText, (!isValidForm || isLoading) && styles.restoreButtonTextDisabled]}>
              {isLoading ? 'Restoring...' : 'Restore Wallet'}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default RestoreScreen

import React, { useState } from 'react'
import { ScrollView, View } from 'react-native'

import HeaderScreen from '@/components/Header'
import KeyboardAvoiding from '@/components/KeyboardAvoiding'
import ThemedInput from '@/components/UI/ThemedInput'
import ThemedText from '@/components/UI/ThemedText'
import ThemeTouchableOpacity from '@/components/UI/ThemeTouchableOpacity'
import { COLORS } from '@/constants/style'
import useIsContractEVM from '@/hooks/react-query/useIsContractEVM'
import useChainSelected from '@/hooks/useChainSelected'
import useDebounce from '@/hooks/useDebounce'
import useMode from '@/hooks/useMode'
import useTheme from '@/hooks/useTheme'

import { createStyles } from './styles'

interface FormData {
  address: string
  decimal: string
  symbol: string
}

interface FormErrors {
  address?: string
  decimal?: string
  symbol?: string
}

const ImportTokenScreen = () => {
  const { background, text } = useTheme()
  const { isDark } = useMode()
  const { chainId } = useChainSelected()
  const styles = createStyles(isDark)
  const [formData, setFormData] = useState<FormData>({
    address: '',
    decimal: '',
    symbol: '',
  })
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)

  // Debounce address to reduce contract check frequency
  const debouncedAddress = useDebounce(formData.address, 500)

  // Check if address is a valid contract
  const { data: isContract, isLoading: isCheckingContract } = useIsContractEVM(
    debouncedAddress,
    chainId
  )

  const validateField = (field: keyof FormData, value: string): string | undefined => {
    switch (field) {
      case 'address':
        if (!value.trim()) {
          return 'Token address is required'
        }
        if (!value.startsWith('0x')) {
          return 'Address must start with 0x'
        }
        if (value.length !== 42) {
          return 'Invalid address length (must be 42 characters)'
        }
        // Check if it's a valid contract (only if address format is valid)
        if (value.length === 42 && value.startsWith('0x') && isContract === false) {
          return 'Address is not a valid token contract'
        }
        break
      case 'decimal':
        if (!value.trim()) {
          return 'Decimals is required'
        }
        const decimalNum = parseInt(value)
        if (isNaN(decimalNum) || decimalNum < 0 || decimalNum > 18) {
          return 'Decimals must be between 0 and 18'
        }
        break
      case 'symbol':
        if (!value.trim()) {
          return 'Symbol is required'
        }

        if (value.length > 10) {
          return 'Symbol must be at most 10 characters'
        }
        break
    }
    return undefined
  }

  const handleFieldChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Validate field in real-time
    const error = validateField(field, value)
    setFormErrors((prev) => ({ ...prev, [field]: error }))
  }

  const validateForm = (): boolean => {
    const errors: FormErrors = {}
    let isValid = true

    Object.keys(formData).forEach((key) => {
      const field = key as keyof FormData
      const error = validateField(field, formData[field])
      if (error) {
        errors[field] = error
        isValid = false
      }
    })

    setFormErrors(errors)
    return isValid
  }

  const handleImport = async () => {
    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      // TODO: Implement token import logic
      console.log('Importing token:', formData)
      // Add your import logic here
    } catch (error) {
      console.error('Error importing token:', error)
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = formData.address.trim() !== '' && formData.decimal.trim() !== '' && formData.symbol.trim() !== ''

  return (
    <KeyboardAvoiding style={[styles.container, { backgroundColor: background.background }]}>
      <HeaderScreen title="Import Token" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.form}>
          <View>
            <ThemedInput
              label={<ThemedText type="defaultSemiBold">Token Address</ThemedText>}
              placeholder="0x..."
              value={formData.address}
              onChangeText={(value) => handleFieldChange('address', value)}
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}

            />
            {formErrors.address && (
              <ThemedText type="small" style={styles.errorText}>
                {formErrors.address}
              </ThemedText>
            )}
            {isCheckingContract && formData.address.length === 42 && (
              <ThemedText type="small" style={{ color: COLORS.gray, marginTop: 4, marginLeft: 4 }}>
                Checking contract...
              </ThemedText>
            )}
          </View>

          <View>
            <ThemedInput
              label={<ThemedText type="defaultSemiBold">Decimals</ThemedText>}
              placeholder="18"
              value={formData.decimal}
              onChangeText={(value) => handleFieldChange('decimal', value)}
              keyboardType="numeric"
              inputMode="numeric"
              maxLength={2}
              style={styles.input}
            />
            {formErrors.decimal && (
              <ThemedText type="small" style={styles.errorText}>
                {formErrors.decimal}
              </ThemedText>
            )}
          </View>

          <View>
            <ThemedInput
              label={<ThemedText type="defaultSemiBold">Symbol</ThemedText>}
              placeholder="TOKEN"
              value={formData.symbol}
              onChangeText={(value) => handleFieldChange('symbol', value)}
              autoCapitalize="characters"
              autoCorrect={false}
              maxLength={10}
              style={styles.input}
            />
            {formErrors.symbol && (
              <ThemedText type="small" style={styles.errorText}>
                {formErrors.symbol}
              </ThemedText>
            )}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <ThemeTouchableOpacity
            type="default"
            onPress={handleImport}
            disabled={!isFormValid}
            loading={loading}
            style={styles.button}
          >
            <ThemedText type="defaultSemiBold" style={styles.buttonText}>
              Import Token
            </ThemedText>
          </ThemeTouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoBox}>
            <ThemedText type="small" style={{ color: text.colorPlaceholder }}>
              ⚠️ Only import tokens from trusted sources. Importing malicious tokens may result in loss of funds.
            </ThemedText>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoiding>
  )
}

export default ImportTokenScreen

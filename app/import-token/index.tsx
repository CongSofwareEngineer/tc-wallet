import { Feather } from '@expo/vector-icons'
import * as Clipboard from 'expo-clipboard'
import { router } from 'expo-router'
import React, { useEffect, useMemo, useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'

import HeaderScreen from '@/components/Header'
import ThemedInput from '@/components/UI/ThemedInput'
import ThemedText from '@/components/UI/ThemedText'
import ThemeTouchableOpacity from '@/components/UI/ThemeTouchableOpacity'
import { COLORS } from '@/constants/style'
import useChainSelected from '@/hooks/useChainSelected'
import useDebounce from '@/hooks/useDebounce'
import useMode from '@/hooks/useMode'
import useTheme from '@/hooks/useTheme'
import useWallets from '@/hooks/useWallets'

import KeyboardAvoiding from '@/components/KeyboardAvoiding'
import { KEY_STORAGE } from '@/constants/storage'
import useBalanceToken from '@/hooks/react-query/useBalanceToken'
import useInfoToken from '@/hooks/react-query/useInfoToken'
import { Token } from '@/services/moralis/type'
import { lowercase, sleep } from '@/utils/functions'
import { getDataLocal, saveDataLocal } from '@/utils/storage'
import { getStyles } from './styles'

interface FormData {
  address: string
  decimal: string
  symbol: string
  name: string
}

interface FormErrors {
  address?: string
  decimal?: string
  symbol?: string
  name?: string
}

const ImportTokenScreen = () => {
  const { isDark } = useMode()
  const { text, colorIcon } = useTheme()
  const { chainId } = useChainSelected()
  const { wallet } = useWallets()
  const styles = getStyles(isDark)

  const [formData, setFormData] = useState<FormData>({
    address: '',
    decimal: '',
    symbol: '',
    name: '',
  })
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)

  // Debounce address to reduce contract check frequency
  const debouncedAddress = useDebounce(formData.address, 500)
  const { data: infoToken, isLoading: isLoadingInfoToken } = useInfoToken(debouncedAddress, chainId)
  const { data: balanceToken, refetch: refetchBalanceToken } = useBalanceToken(true)

  const isFormValid = useMemo(() => {
    const errorForm = formData.address.trim() !== '' &&
      formData.decimal.trim() !== '' &&
      formData.symbol.trim() !== '' &&
      !formErrors.address &&
      !formErrors.decimal &&
      !formErrors.symbol &&
      balanceToken?.find((token) => lowercase(token.token_address) === lowercase(formData.address))

    return errorForm
  }, [formData, formErrors, balanceToken])


  useEffect(() => {
    if (infoToken?.decimals && infoToken?.symbol && infoToken?.name) {
      setFormData((prev) => ({
        ...prev,
        decimal: infoToken.decimals!.toString(),
        symbol: infoToken.symbol!,
        name: infoToken.name!
      }))
    }
  }, [infoToken])


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
        if (value.length === 42 && value.startsWith('0x') && infoToken?.noToken) {
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
      case 'name':
        // Name is optional, but if provided, validate length
        if (value.length > 50) {
          return 'Name must be at most 50 characters'
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

    // Only validate required fields
    const requiredFields: (keyof FormData)[] = ['address', 'decimal', 'symbol']
    requiredFields.forEach((field) => {
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
    const listTokenImportLocal = getDataLocal(KEY_STORAGE.ListTokenImportLocal)
    const token: Partial<Token> = {
      is_imported: true,
      verified_contract: false,
      decimals: Number(formData.decimal!),
      symbol: formData.symbol,
      name: formData.name,
      token_address: formData.address,
      usd_value: 0,
      usd_price: 0
    }
    if (listTokenImportLocal?.[chainId] && Array.isArray(listTokenImportLocal?.[chainId])) {
      listTokenImportLocal?.[chainId].push(token)
      saveDataLocal(KEY_STORAGE.ListTokenImportLocal, listTokenImportLocal)
    } else {
      saveDataLocal(KEY_STORAGE.ListTokenImportLocal, {
        ...listTokenImportLocal,
        [chainId]: [token],
      })
    }
    await sleep(200)
    await refetchBalanceToken()

    setLoading(true)
    try {
      // TODO: Implement token import logic
      console.log('Importing token:', formData)
      // Add your import logic here
      router.back()
    } catch (error) {
      console.error('Error importing token:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePaste = async () => {
    const clipText = await Clipboard.getStringAsync()
    if (!clipText) {
      const clipUrl = await Clipboard.getUrlAsync()
      if (clipUrl) {
        handleFieldChange('address', clipUrl)
      }
    } else {
      handleFieldChange('address', clipText)

    }
  }




  return (
    <KeyboardAvoiding style={styles.container}>
      <HeaderScreen title='Import Token' />

      <ScrollView style={styles.content}>
        {/* Token Address Input */}
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: text.color }]}>Token Address</Text>
          <View style={[styles.inputWrapper, { paddingBottom: 6 }]}>
            <ThemedInput
              noBorder
              multiline
              numberOfLines={2}
              style={[styles.input, { height: 'auto' }]}
              placeholder='Enter token contract address'
              value={formData.address}
              onChangeText={(value) => handleFieldChange('address', value)}
              autoCapitalize='none'
              autoCorrect={false}
            />
            <TouchableOpacity style={styles.pasteButton} onPress={handlePaste}>
              <Feather name='clipboard' size={20} color={colorIcon.colorDefault} />
            </TouchableOpacity>
          </View>
          {formErrors.address && (
            <ThemedText type='small' style={{ color: COLORS.red, marginTop: 4, marginLeft: 4 }}>
              {formErrors.address}
            </ThemedText>
          )}
          {isLoadingInfoToken && formData.address.length === 42 && (
            <ThemedText type='small' style={{ color: COLORS.gray, marginTop: 4, marginLeft: 4 }}>
              Checking contract...
            </ThemedText>
          )}
        </View>

        {/* Token Symbol Input */}
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: text.color }]}>Token Symbol</Text>
          <ThemedInput
            // noBorder
            style={[styles.input, { flex: 1 }]}
            placeholder='Enter token symbol'
            value={formData.symbol}
            onChangeText={(value) => handleFieldChange('symbol', value)}
            autoCapitalize='characters'
            autoCorrect={false}
            maxLength={10}
          />
          {formErrors.symbol && (
            <ThemedText type='small' style={{ color: COLORS.red, marginTop: 4, marginLeft: 4 }}>
              {formErrors.symbol}
            </ThemedText>
          )}
        </View>

        {/* Token Name Input */}
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: text.color }]}>Token Name</Text>
          <ThemedInput
            // noBorder
            style={styles.input}
            placeholder='Enter token name'
            value={formData.name}
            onChangeText={(value) => handleFieldChange('name', value)}
            maxLength={50}
          />
          {formErrors.name && (
            <ThemedText type='small' style={{ color: COLORS.red, marginTop: 4, marginLeft: 4 }}>
              {formErrors.name}
            </ThemedText>
          )}
        </View>

        {/* Token Decimals Input */}
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: text.color }]}>Token Decimals</Text>
          <ThemedInput
            // noBorder
            style={styles.input}
            placeholder='Enter token decimals'
            value={formData.decimal}
            onChangeText={(value) => handleFieldChange('decimal', value)}
            keyboardType='numeric'
            inputMode='numeric'
            maxLength={2}
          />
          {formErrors.decimal && (
            <ThemedText type='small' style={{ color: COLORS.red, marginTop: 4, marginLeft: 4 }}>
              {formErrors.decimal}
            </ThemedText>
          )}
        </View>

      </ScrollView>

      {/* Import Button */}
      <View style={styles.bottomContainer}>
        <ThemeTouchableOpacity style={styles.importButton} onPress={handleImport} disabled={!isFormValid || loading}>
          <Text style={styles.importButtonText}>{loading ? 'Importing...' : 'Import Token'}</Text>
        </ThemeTouchableOpacity>
      </View>
    </KeyboardAvoiding>
  )
}

export default ImportTokenScreen

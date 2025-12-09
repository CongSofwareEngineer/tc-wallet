import { Feather } from '@expo/vector-icons'
import * as Clipboard from 'expo-clipboard'
import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { erc20Abi } from 'viem'

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
import EVMServices from '@/services/EVM'
import { isAddress } from '@/utils/nvm'

import useInfoToken from '@/hooks/react-query/useInfoToken'
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
        if (value.length === 42 && value.startsWith('0x') && !infoToken?.noToken) {
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
    if (clipText && isAddress(clipText) && wallet) {
      const client = EVMServices.getClient(chainId)
      const [decimals, symbol, name, balanceOf, totalSupply] = await client.multicall({
        contracts: [
          {
            address: clipText as `0x${string}`,
            abi: erc20Abi,
            functionName: 'decimals',
            args: [],
          },
          {
            address: clipText as `0x${string}`,
            abi: erc20Abi,
            functionName: 'symbol',
            args: [],
          },
          {
            address: clipText as `0x${string}`,
            abi: erc20Abi,
            functionName: 'name',
            args: [],
          },
          {
            address: clipText as `0x${string}`,
            abi: erc20Abi,
            functionName: 'balanceOf',
            args: [wallet.address as `0x${string}`],
          },
          {
            address: clipText as `0x${string}`,
            abi: erc20Abi,
            functionName: 'totalSupply',
            args: [],
          },
        ],
      })
      console.log({ decimals, symbol, name, balanceOf, totalSupply })

      // Update form data with fetched values
      if (decimals && decimals.status === 'success') {
        handleFieldChange('decimal', (decimals.result as number).toString())
      }
      if (symbol && symbol.status === 'success') {
        handleFieldChange('symbol', symbol.result as string)
      }
      if (name && name.status === 'success') {
        handleFieldChange('name', name.result as string)
      }

      handleFieldChange('address', clipText)
    }
  }

  const isFormValid =
    formData.address.trim() !== '' &&
    formData.decimal.trim() !== '' &&
    formData.symbol.trim() !== '' &&
    !formErrors.address &&
    !formErrors.decimal &&
    !formErrors.symbol

  return (
    <View style={styles.container}>
      <HeaderScreen title='Import Token' />

      <ScrollView style={styles.content}>
        {/* Token Address Input */}
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: text.color }]}>Token Address</Text>
          <View style={styles.inputWrapper}>
            <ThemedInput
              noBorder
              style={styles.input}
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
            noBorder
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
            noBorder
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
            noBorder
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
    </View>
  )
}

export default ImportTokenScreen

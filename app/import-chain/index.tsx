import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { ScrollView, View } from 'react-native'

import HeaderScreen from '@/components/Header'
import ThemedInput from '@/components/UI/ThemedInput'
import ThemedText from '@/components/UI/ThemedText'
import ThemeTouchableOpacity from '@/components/UI/ThemeTouchableOpacity'
import { PADDING_DEFAULT } from '@/constants/style'
import useChains from '@/hooks/useChains'

import KeyboardAvoiding from '@/components/KeyboardAvoiding'
import useChainList from '@/hooks/react-query/useChainList'
import useAlert from '@/hooks/useAlert'
import useLanguage from '@/hooks/useLanguage'
import { cloneDeep } from '@/utils/functions'
import styles from './styles'
interface FormData {
  networkName?: string
  rpcUrl?: string
  chainId?: string
  symbol?: string
  blockExplorerUrl?: string
}

interface FormDataError extends FormData { }

const ImportChainScreen = () => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { showAlert } = useAlert()
  const { chainList: chainListLocal, addNetwork } = useChains()
  const { data: chainListAPI, isLoading: isLoadingChainList } = useChainList()
  const { translate } = useLanguage()

  const [formData, setFormData] = useState<FormData>({})
  const [formDataError, setFormDataError] = useState<FormDataError>({})

  const handleCreateNetwork = () => {
    try {
      setIsLoading(true)

      // Validate required fields
      if (!formData.networkName || !formData.rpcUrl || !formData.chainId || !formData.symbol) {
        console.error('Missing required fields')
        return
      }

      // Construct the new network object
      const newNetwork = {
        id: Number(formData.chainId),
        name: formData.networkName,
        nativeCurrency: {
          name: formData.symbol,
          symbol: formData.symbol,
          decimals: 18,
        },
        rpcUrls: {
          default: {
            http: [formData.rpcUrl],
          },
          public: {
            http: [formData.rpcUrl],
          },
        },
        blockExplorers: formData.blockExplorerUrl
          ? {
            default: {
              name: 'Explorer',
              url: formData.blockExplorerUrl,
            },
          }
          : undefined,
        iconChain: '', // Default empty icon
        isCustom: true, // Mark as custom network
      }

      // Add the network using the hook
      addNetwork(newNetwork)

      console.log('Chain created successfully:', newNetwork)
      router.back()
    } catch (error) {
      console.error('Error creating chain:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const onChangeFormData = (key: string, value: string) => {
    let data = cloneDeep(formData) || {}
    const error = cloneDeep(formDataError) || {}

    if (key === 'chainId') {
      const chain = chainListAPI?.find((chain) => chain.id.toString() === value)
      const isExitChain = chainListLocal?.some((chain) => chain.id.toString() === value)
      if (isExitChain) {
        error.chainId = translate('importChain.error.chainExists')
      } else {
        error.chainId = ''
      }

      if (chain) {
        data = {
          networkName: chain.name,
          rpcUrl: chain.rpcUrls?.default?.http?.[0],
          symbol: chain.nativeCurrency?.symbol,
          blockExplorerUrl: chain.blockExplorers?.default?.url || '',
          [key]: value,
        }
      } else {
        data[key] = value
      }
    } else {
      error[key as keyof FormDataError] = ''
      data[key as keyof FormData] = value
    }
    setFormData(data)
    setFormDataError(error)
  }

  return (
    <KeyboardAvoiding>
      <View style={styles.container}>
        {/* Header */}
        <HeaderScreen title={translate('importChain.title')} />

        {/* Content */}
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* Chain ID */}
            <View style={styles.fieldContainer}>
              <ThemedText style={styles.label}>{translate('importChain.chainId')}</ThemedText>
              <View style={styles.inputContainer}>
                <ThemedInput
                  showError
                  error={formDataError?.chainId}
                  disabled={isLoadingChainList}
                  style={styles.input}
                  value={formData?.chainId}
                  keyboardType='numeric'
                  inputMode='numeric'
                  onChangeText={(text) => onChangeFormData('chainId', text)}
                />
              </View>
            </View>

            {/* Network Name */}
            <View style={styles.fieldContainer}>
              <ThemedText style={styles.label}>{translate('importChain.networkName')}</ThemedText>
              <View style={styles.inputContainer}>
                <ThemedInput
                  showError
                  error={formDataError?.networkName}
                  disabled={isLoadingChainList}
                  style={styles.input}
                  value={formData?.networkName}
                  onChangeText={(text) => onChangeFormData('networkName', text)}
                  placeholder={translate('importChain.placeholder.networkName')}
                />
              </View>
            </View>

            {/* Failover RPC URL */}
            <View style={styles.fieldContainer}>
              <ThemedText style={styles.label}>{translate('importChain.rpcUrl')}</ThemedText>
              <View style={styles.inputContainer}>
                <ThemedInput
                  showError
                  error={formDataError?.rpcUrl}
                  disabled={isLoadingChainList}
                  style={styles.input}
                  value={formData?.rpcUrl}
                  onChangeText={(text) => onChangeFormData('rpcUrl', text)}
                  placeholder={translate('importChain.placeholder.rpcUrl')}
                />
              </View>
            </View>

            {/* Symbol */}
            <View style={styles.fieldContainer}>
              <ThemedText style={styles.label}>{translate('importChain.symbol')}</ThemedText>
              <View style={styles.inputContainer}>
                <ThemedInput
                  showError
                  error={formDataError?.symbol}
                  disabled={isLoadingChainList}
                  style={styles.input}
                  value={formData?.symbol}
                  onChangeText={(text) => onChangeFormData('symbol', text)}
                  placeholder={translate('importChain.placeholder.symbol')}
                />
              </View>
            </View>

            {/* Block Explorer URL */}
            <View style={styles.fieldContainer}>
              <ThemedText style={styles.label}>{translate('importChain.blockExplorer')}</ThemedText>
              <View style={styles.inputContainer}>
                <ThemedInput
                  showError
                  error={formDataError?.blockExplorerUrl}
                  disabled={isLoadingChainList}
                  inputMode='url'
                  style={styles.input}
                  value={formData?.blockExplorerUrl}
                  onChangeText={(text) => setFormData({ ...formData, blockExplorerUrl: text })}
                  placeholder={translate('importChain.placeholder.blockExplorer')}
                />
              </View>
            </View>
          </View>

          {/* Save Button */}
        </ScrollView>
        <View style={{ padding: PADDING_DEFAULT.Padding16 }}>
          <ThemeTouchableOpacity disabled={isLoadingChainList} loading={isLoading} style={styles.saveButton} onPress={handleCreateNetwork}>
            <ThemedText style={styles.saveButtonText}>{translate('importChain.save')}</ThemedText>
          </ThemeTouchableOpacity>
        </View>
      </View>
    </KeyboardAvoiding>
  )
}

export default ImportChainScreen

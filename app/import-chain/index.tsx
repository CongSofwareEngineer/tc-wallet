import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { KeyboardAvoidingView, ScrollView, View } from 'react-native'

import HeaderScreen from '@/components/Header'
import ThemedInput from '@/components/UI/ThemedInput'
import ThemedText from '@/components/UI/ThemedText'
import ThemeTouchableOpacity from '@/components/UI/ThemeTouchableOpacity'
import { IsIos } from '@/constants/app'
import { PADDING_DEFAULT } from '@/constants/style'
import useChains from '@/hooks/useChains'

import useChainList from '@/hooks/react-query/useChainList'
import { SafeAreaView } from 'react-native-safe-area-context'
import styles from './styles'

const ImportChainScreen = () => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { chainList, addNetwork } = useChains()
  const { data: chainListData, isLoading: isLoadingChainList } = useChainList()


  const [formData, setFormData] = useState({
    networkName: '',
    rpcUrl: '',
    chainId: '',
    symbol: '',
    blockExplorerUrl: '',
  })

  useEffect(() => {
    if (formData?.chainId) {
      const chain = chainListData?.find((chain) => chain.id.toString() === formData.chainId.toString())
      if (chain) {
        setFormData({
          ...formData,
          networkName: chain.name,
          rpcUrl: chain.rpcUrls?.default?.http?.[0],
          symbol: chain.nativeCurrency?.symbol,
          blockExplorerUrl: chain.blockExplorers?.default?.url || '',
        })
      }
    }
  }, [formData?.chainId, chainListData])

  useEffect(() => {
    const isExist = chainList.find((chain) => chain.id.toString() === formData.chainId.toString())
    if (isExist) {
      Alert.alert('Chain already exists')
    }
  }, [chainList, formData])


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



  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView style={{ flex: 1 }} contentContainerStyle={{ flex: 1 }} behavior={IsIos ? 'padding' : 'height'}>
        <View style={styles.container}>
          {/* Header */}
          <HeaderScreen title='Chain Details' />

          {/* Content */}
          <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.content}>

              {/* Chain ID */}
              <View style={styles.fieldContainer}>
                <ThemedText style={styles.label}>Chain ID</ThemedText>
                <View style={styles.inputContainer}>
                  <ThemedInput
                    disabled={!isLoadingChainList}
                    style={styles.input}
                    value={Number(formData.chainId).toString()}
                    keyboardType='numeric'
                    inputMode='numeric'
                  />
                </View>
              </View>

              {/* Network Name */}
              <View style={styles.fieldContainer}>
                <ThemedText style={styles.label}>Network Name</ThemedText>
                <View style={styles.inputContainer}>
                  <ThemedInput
                    disabled={!isLoadingChainList}
                    style={styles.input}
                    value={formData.networkName}
                    onChangeText={(text) => setFormData({ ...formData, networkName: text })}
                    placeholder='Enter network name'
                  />
                </View>
              </View>

              {/* Failover RPC URL */}
              <View style={styles.fieldContainer}>
                <ThemedText style={styles.label}>Failover RPC URL</ThemedText>
                <View style={styles.inputContainer}>
                  <ThemedInput
                    disabled={!isLoadingChainList}
                    style={styles.input}
                    value={formData.rpcUrl}
                    onChangeText={(text) => setFormData({ ...formData, rpcUrl: text })}
                    placeholder='Enter RPC URL'
                  />
                </View>
              </View>


              {/* Symbol */}
              <View style={styles.fieldContainer}>
                <ThemedText style={styles.label}>Symbol</ThemedText>
                <View style={styles.inputContainer}>
                  <ThemedInput
                    disabled={!isLoadingChainList}
                    style={styles.input}
                    value={formData.symbol}
                    onChangeText={(text) => setFormData({ ...formData, symbol: text })}
                    placeholder='Enter symbol'
                  />
                </View>
              </View>

              {/* Block Explorer URL */}
              <View style={styles.fieldContainer}>
                <ThemedText style={styles.label}>Block Explorer URL</ThemedText>
                <View style={styles.inputContainer}>
                  <ThemedInput
                    disabled={!isLoadingChainList}
                    inputMode='url'
                    style={styles.input}
                    value={formData.blockExplorerUrl}
                    onChangeText={(text) => setFormData({ ...formData, blockExplorerUrl: text })}
                    placeholder='Enter block explorer URL'
                  />
                </View>
              </View>
            </View>

            {/* Save Button */}
          </ScrollView>
          <View style={{ padding: PADDING_DEFAULT.Padding16 }}>
            <ThemeTouchableOpacity disabled={isLoadingChainList} loading={isLoading} style={styles.saveButton} onPress={handleCreateNetwork}>
              <ThemedText style={styles.saveButtonText}>Save</ThemedText>
            </ThemeTouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default ImportChainScreen

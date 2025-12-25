import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useMemo, useState } from 'react'
import { KeyboardAvoidingView, ScrollView, View } from 'react-native'

import HeaderScreen from '@/components/Header'
import ThemedInput from '@/components/UI/ThemedInput'
import ThemedText from '@/components/UI/ThemedText'
import ThemeTouchableOpacity from '@/components/UI/ThemeTouchableOpacity'
import { IsIos } from '@/constants/app'
import { PADDING_DEFAULT } from '@/constants/style'
import useChains from '@/hooks/useChains'

import { Network } from '@/types/web3'
import { SafeAreaView } from 'react-native-safe-area-context'
import styles from './styles'

const ChainDetailScreen = () => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { chainList, updateNetworks, addNetwork } = useChains()
  const { chainId: chainCurrentId } = useLocalSearchParams<{ chainId: string }>()

  const chainCurrent = useMemo(() => {
    return chainList.find((chain) => chain.id.toString() === chainCurrentId.toString())
  }, [chainList, chainCurrentId])

  const [formData, setFormData] = useState({
    networkName: chainCurrent?.name,
    rpcUrl: chainCurrent?.rpcUrls?.default?.http?.[0],
    chainId: chainCurrent?.id,
    symbol: chainCurrent?.nativeCurrency?.symbol,
    blockExplorerUrl: chainCurrent?.blockExplorers?.default?.url,
  })


  const handleSave = () => {
    try {
      setIsLoading(true)

      if (!chainCurrent) {

        return
      }

      // Construct the updated network object
      const updatedNetwork: Network = {
        ...chainCurrent,
        name: formData.networkName!,
        rpcUrls: {
          ...chainCurrent.rpcUrls,
          default: {
            ...chainCurrent.rpcUrls?.default,
            http: [formData.rpcUrl!],
          },
        },
        nativeCurrency: {
          ...chainCurrent.nativeCurrency,
          symbol: formData.symbol!,
        },
        blockExplorers: {
          ...chainCurrent.blockExplorers,
          default: {
            ...chainCurrent.blockExplorers?.default,
            name: chainCurrent.blockExplorers?.default?.name || 'Explorer',
            url: formData.blockExplorerUrl!,
          },
        },
      }

      // Update the network using the hook
      updateNetworks(updatedNetwork)

      router.back()
    } catch (error) {
      console.error('Error updating chain:', error)
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
                    disabled
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
            <ThemeTouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <ThemedText style={styles.saveButtonText}>Save</ThemedText>
            </ThemeTouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default ChainDetailScreen

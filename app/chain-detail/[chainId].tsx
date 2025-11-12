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
import useMode from '@/hooks/useMode'
import useTheme from '@/hooks/useTheme'

import { SafeAreaView } from 'react-native-safe-area-context'
import styles from './styles'

const ChainDetailScreen = () => {
  const router = useRouter()
  const { mode } = useMode()
  const { text } = useTheme()
  const { chainList } = useChains()
  const { chainId: chainCurrentId } = useLocalSearchParams<{ chainId: string }>()

  const chainCurrent = useMemo(() => {
    return chainList.find((chain) => chain.id.toString() === chainCurrentId.toString())
  }, [chainList, chainCurrentId])

  const [formData, setFormData] = useState({
    networkName: chainCurrent?.name || 'Linea Mainnet',
    rpcUrl: chainCurrent?.rpcUrls?.default?.http?.[0] || 'linea-mainnet.infura.io',
    chainId: chainCurrent?.id || '59144',
    symbol: chainCurrent?.nativeCurrency?.symbol || 'ETH',
    blockExplorerUrl: chainCurrent?.blockExplorers?.default?.url || 'https://lineascan.build',
  })

  const handleSave = () => {
    // Save logic here
    console.log('Saving chain details:', formData)
    router.back()
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

              {/* Chain ID */}
              <View style={styles.fieldContainer}>
                <ThemedText style={styles.label}>Chain ID</ThemedText>
                <View style={styles.inputContainer}>
                  <ThemedInput
                    style={styles.input}
                    value={Number(formData.chainId).toString()}
                    onChangeText={(text) => setFormData({ ...formData, chainId: text })}
                    placeholder='Enter chain ID'
                    keyboardType='numeric'
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

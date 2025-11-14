import HeaderScreen from '@/components/Header'
import ThemedText from '@/components/UI/ThemedText'
import ThemeTouchableOpacity from '@/components/UI/ThemeTouchableOpacity'
import { COLORS } from '@/constants/style'
import useMode from '@/hooks/useMode'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useState } from 'react'
import { ScrollView, TextInput, TouchableOpacity, View } from 'react-native'
import createStyles from './styles'

const tokensMock = [
  { symbol: 'BSC-USD', name: 'Binance USD', logo: '💎', chainId: 56 },
  { symbol: 'USDT', name: 'Tether', logo: '💵', chainId: 1 },
  { symbol: 'ETH', name: 'Ethereum', logo: '⟠', chainId: 1 },
]

const chainsMock = [
  { id: 56, name: 'BNB Chain', iconChain: '◆', symbol: 'BSC' },
  { id: 1, name: 'Ethereum', iconChain: '⟠', symbol: 'ETH' },
]

const ExchangeScreen = () => {
  const { isDark } = useMode()
  const styles = createStyles(isDark)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _router = useRouter()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { address: _address } = useLocalSearchParams()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [inputToken, _setInputToken] = useState(tokensMock[0])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [inputChain, _setInputChain] = useState(chainsMock[0])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [outputToken, _setOutputToken] = useState<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [outputChain, _setOutputChain] = useState(chainsMock[0])
  const [inputAmount, setInputAmount] = useState('')
  const [outputAmount, setOutputAmount] = useState('')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [spendable, _setSpendable] = useState('0')

  const handleMaximum = () => {
    setInputAmount(spendable)
  }

  const handleConfirm = () => {
    // Handle confirm transfer logic
  }

  return (
    <View style={styles.container}>
      <HeaderScreen title={`Exchange ${inputChain.symbol}-USD`} />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Account Info */}
        <View style={styles.accountSection}>
          <View>
            <ThemedText style={styles.accountLabel}>From: Main 4d7c</ThemedText>
            <ThemedText style={styles.accountAddress}>0x9f27...4d7c</ThemedText>
          </View>
          <View style={styles.balanceSection}>
            <ThemedText style={styles.balanceLabel}>
              Spendable: {spendable} {inputChain.symbol}-USD
            </ThemedText>
            <TouchableOpacity onPress={handleMaximum}>
              <ThemedText style={styles.maximumBtn}>Maximum</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* From Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionLabel}>From</ThemedText>
            <TouchableOpacity style={styles.chainSelector} onPress={() => { }}>
              <ThemedText style={styles.chainIcon}>{inputChain.iconChain}</ThemedText>
              <ThemedText style={styles.chainName}>{inputChain.name}</ThemedText>
              <ThemedText style={styles.chevron}>›</ThemedText>
            </TouchableOpacity>
          </View>

          <View style={styles.inputRow}>
            <TouchableOpacity style={styles.tokenSelector} onPress={() => { }}>
              <ThemedText style={styles.tokenIcon}>{inputToken.logo}</ThemedText>
              <ThemedText style={styles.tokenSymbol}>{inputToken.symbol}</ThemedText>
            </TouchableOpacity>
            <TextInput
              style={[styles.amountInput, { color: isDark ? COLORS.white : COLORS.black }]}
              placeholder='Amount'
              placeholderTextColor={isDark ? COLORS.gray : COLORS.gray2}
              keyboardType='numeric'
              value={inputAmount}
              onChangeText={setInputAmount}
            />
          </View>
        </View>

        {/* Arrow Separator */}
        <View style={styles.arrowContainer}>
          <ThemedText style={styles.arrowIcon}>⬇</ThemedText>
        </View>

        {/* To Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionLabel}>To</ThemedText>
            <TouchableOpacity style={styles.chainSelector} onPress={() => { }}>
              <ThemedText style={styles.chainIcon}>{outputChain.iconChain}</ThemedText>
              <ThemedText style={styles.chainName}>{outputChain.name}</ThemedText>
              <ThemedText style={styles.chevron}>›</ThemedText>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.selectCoinButton} onPress={() => { }}>
            {outputToken ? (
              <View style={styles.inputRow}>
                <View style={styles.tokenSelector}>
                  <ThemedText style={styles.tokenIcon}>{outputToken.logo}</ThemedText>
                  <ThemedText style={styles.tokenSymbol}>{outputToken.symbol}</ThemedText>
                </View>
                <TextInput
                  style={[styles.amountInput, { color: isDark ? COLORS.white : COLORS.black }]}
                  placeholder='Amount'
                  placeholderTextColor={isDark ? COLORS.gray : COLORS.gray2}
                  keyboardType='numeric'
                  value={outputAmount}
                  onChangeText={setOutputAmount}
                  editable={false}
                />
              </View>
            ) : (
              <View style={styles.selectCoinContent}>
                <ThemedText style={styles.selectCoinText}>Select a coin</ThemedText>
                <ThemedText style={styles.chevron}>›</ThemedText>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Confirm Button */}
        <ThemeTouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <ThemedText style={styles.confirmButtonText}>Confirm transfer</ThemedText>
        </ThemeTouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>EMPOWERED BY</ThemedText>
          <ThemedText style={styles.footerBrand}>deBridge</ThemedText>
        </View>

        {/* Terms */}
        <View style={styles.termsContainer}>
          <ThemedText style={styles.termsText}>By tapping Confirm transfer, you agree to deSwap&apos;s </ThemedText>
          <ThemedText style={styles.termsLink}>Terms of Use</ThemedText>
          <ThemedText style={styles.termsText}> and </ThemedText>
          <ThemedText style={styles.termsLink}>Privacy Policy</ThemedText>
        </View>
      </ScrollView>
    </View>
  )
}

export default ExchangeScreen

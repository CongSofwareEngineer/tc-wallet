import AntDesign from '@expo/vector-icons/AntDesign'
import Ionicons from '@expo/vector-icons/Ionicons'
import Big from 'bignumber.js'
import { Image } from 'expo-image'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useMemo, useRef, useState } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity, View } from 'react-native'
import { encodeFunctionData, erc20Abi } from 'viem'

import HeaderScreen from '@/components/Header'
import ThemedText from '@/components/UI/ThemedText'
import ThemeTouchableOpacity from '@/components/UI/ThemeTouchableOpacity'
import { PADDING_DEFAULT } from '@/constants/style'
import useBalanceToken from '@/hooks/react-query/useBalanceToken'
import useChains from '@/hooks/useChains'
import useMode from '@/hooks/useMode'
import useSheet from '@/hooks/useSheet'
import useTheme from '@/hooks/useTheme'
import useWallets from '@/hooks/useWallets'
import { Token } from '@/services/moralis/type'
import { ellipsisText, getRadomColor } from '@/utils/functions'
import WalletEvmUtil from '@/utils/walletEvm'

import { createStyles } from './styles'

const SendTokenScreen = () => {
  const router = useRouter()
  const { address: initialAddress } = useLocalSearchParams<{ address?: string }>()
  const { isDark } = useMode()
  const { text } = useTheme()
  const styles = createStyles(isDark)
  const { chainCurrent } = useChains()
  const { wallet, wallets, indexWalletActive } = useWallets()
  const { data: tokens } = useBalanceToken(true)
  const { openSheet, closeSheet } = useSheet()

  const [toAddress, setToAddress] = useState<string>((initialAddress as string) || '')
  const [selectedToken, setSelectedToken] = useState<Token | null>(tokens?.[0] || null)
  const [amountToken, setAmountToken] = useState<string>('')
  const [amountUsd, setAmountUsd] = useState<string>('')
  const [activeAmountField, setActiveAmountField] = useState<'token' | 'usd'>('token')
  const [isSending, setIsSending] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)
  const [txError, setTxError] = useState<string | null>(null)

  const tokenUsdPrice = useMemo(() => (selectedToken?.usd_price ? Number(selectedToken.usd_price) : 0), [selectedToken])
  const balanceFormatted = useMemo(() => Number(selectedToken?.balance_formatted || 0), [selectedToken])

  const inputRef = useRef<TextInput>(null)

  const handleSelectToken = () => {
    openSheet({
      isOpen: true,
      gestureEnabled: true,
      closeOnTouchBackdrop: true,
      content: (
        <View>
          <ThemedText type='subtitle' style={{ marginBottom: 12 }}>
            Chọn token
          </ThemedText>
          <ScrollView style={{ maxHeight: 400 }}>
            {(tokens || []).map((t) => (
              <TouchableOpacity
                key={t.token_address}
                style={styles.tokenItem}
                onPress={() => {
                  setSelectedToken(t)
                  // auto convert amount between fields
                  if (activeAmountField === 'usd' && amountUsd) {
                    const val = Big(amountUsd || 0)
                      .dividedBy(tokenUsdPrice || 1)
                      .toFixed()
                    setAmountToken(val)
                  } else if (activeAmountField === 'token' && amountToken) {
                    const val = Big(amountToken || 0)
                      .multipliedBy(tokenUsdPrice || 0)
                      .toFixed()
                    setAmountUsd(val)
                  }
                  closeSheet()
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  {t.logo || t.thumbnail ? (
                    <Image source={{ uri: t.logo || t.thumbnail }} style={{ width: 28, height: 28, borderRadius: 14 }} />
                  ) : (
                    <AntDesign name='database' size={24} color={text.color} />
                  )}
                  <View style={{ flex: 1 }}>
                    <ThemedText>{t.symbol}</ThemedText>
                    <ThemedText style={{ color: '#9AA0A6' }}>
                      {Big(t.balance_formatted || 0)
                        .decimalPlaces(6, Big.ROUND_DOWN)
                        .toFormat()}
                    </ThemedText>
                  </View>
                  <ThemedText>{t.name}</ThemedText>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      ),
    })
  }

  const handlePickFromMyAccounts = () => {
    openSheet({
      isOpen: true,
      gestureEnabled: true,
      closeOnTouchBackdrop: true,
      content: (
        <View>
          <ThemedText type='subtitle' style={{ marginBottom: 12 }}>
            Chọn địa chỉ từ ví của tôi
          </ThemedText>
          <ScrollView style={{ maxHeight: 420 }}>
            {(wallets || []).map((w) => (
              <TouchableOpacity
                key={w.address}
                style={styles.tokenItem}
                onPress={() => {
                  setToAddress(w.address)
                  closeSheet()
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View style={[styles.avatar, { width: 28, height: 28, borderRadius: 14 }]} />
                  <View style={{ flex: 1 }}>
                    <ThemedText>{w.name || 'Account'}</ThemedText>
                    <ThemedText style={{ color: '#9AA0A6' }}>{ellipsisText(w.address, 6, 6)}</ThemedText>
                  </View>
                  {w.isDefault && <ThemedText style={{ color: '#4CAF50' }}>Default</ThemedText>}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      ),
    })
  }

  // Removed custom keypad handler

  const handleSend = async () => {
    try {
      setTxHash(null)
      setTxError(null)
      if (!wallet || !selectedToken || !toAddress || !amountToken) return

      const decimals = selectedToken.decimals || 18
      const amountStr = Big(amountToken.replace(/,/g, '.')).multipliedBy(Big(10).pow(decimals)).decimalPlaces(0, Big.ROUND_DOWN).toFixed(0)
      const isNative = !!selectedToken.native_token

      const rawBase = {
        from: wallet.address as any,
        chainId: (chainCurrent?.id as any) ?? 1,
        isTracking: true,
        callbackBefore: () => setIsSending(true),
        callbackPending: () => setIsSending(true),
        callbackSuccess: (hash?: any) => {
          setIsSending(false)
          setTxHash((hash as string) || null)
        },
        callbackError: (err?: any) => {
          setIsSending(false)
          setTxError((err?.message as string) || String(err))
        },
      }

      if (isNative) {
        await WalletEvmUtil.sendTransaction(
          {
            ...rawBase,
            to: toAddress as any,
            value: BigInt(amountStr),
          } as any,
          wallet.privateKey as any
        )
      } else {
        const data = encodeFunctionData({ abi: erc20Abi, functionName: 'transfer', args: [toAddress as any, BigInt(amountStr)] })
        await WalletEvmUtil.sendTransaction(
          {
            ...rawBase,
            to: selectedToken.token_address as any,
            data: data as any,
            value: 0n,
          } as any,
          wallet.privateKey as any
        )
      }
    } catch (err: any) {
      setIsSending(false)
      setTxError(err?.message || String(err))
    }
  }

  const feeInfo = useMemo(() => {
    // Placeholder fee values; can be wired to EVMServices later
    // Show native token fee and USD approx
    const nativeSymbol = chainCurrent?.nativeCurrency?.symbol || 'ETH'
    const gasFeeNative = '0.00021' // Example
    const gasFeeUsd = selectedToken?.usd_price ? Big(gasFeeNative).multipliedBy(selectedToken.usd_price).toFixed(4) : '—'
    return { nativeSymbol, gasFeeNative, gasFeeUsd }
  }, [chainCurrent, selectedToken])

  return (
    <View style={styles.container}>
      <HeaderScreen title='Send Token' />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: PADDING_DEFAULT.Padding16, gap: 16 }} keyboardShouldPersistTaps='handled'>
          {/* From wallet */}
          <View style={styles.card}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <ThemedText style={{ color: '#9AA0A6' }}>From</ThemedText>
              <ThemeTouchableOpacity
                style={{ paddingHorizontal: 12, paddingVertical: 6, opacity: isSending ? 0.7 : 1 }}
                disabled={!toAddress || !selectedToken || !amountToken || isSending}
                onPress={handleSend}
              >
                <ThemedText>{isSending ? 'Sending…' : 'Send'}</ThemedText>
              </ThemeTouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              {wallet?.avatar ? (
                <Image source={{ uri: wallet?.avatar }} style={{ width: 32, height: 32, borderRadius: 16 }} />
              ) : (
                <View style={[styles.avatar, { backgroundColor: getRadomColor(wallet?.address) }]} />
              )}

              <View style={{ flex: 1 }}>
                <ThemedText>{wallet?.name || `Account ${indexWalletActive + 1}`}</ThemedText>
                <ThemedText style={{ color: '#9AA0A6' }}>{ellipsisText(wallet?.address || '', 6, 6)}</ThemedText>
              </View>
              {chainCurrent?.iconChain ? (
                <Image source={{ uri: chainCurrent.iconChain }} style={{ width: 32, height: 32, borderRadius: 16 }} />
              ) : null}
            </View>
          </View>

          {/* To Address */}
          <View style={styles.card}>
            <ThemedText style={{ marginBottom: 6, color: '#9AA0A6' }}>To</ThemedText>
            <View style={styles.inputRow}>
              <TextInput
                ref={inputRef}
                value={toAddress}
                onChangeText={setToAddress}
                placeholder='Recipient address'
                placeholderTextColor={'#8E8E93'}
                style={styles.input}
                autoCapitalize='none'
                autoCorrect={false}
              />
              <TouchableOpacity onPress={() => router.push('/connect-dapp')} style={styles.iconButton}>
                <AntDesign name='scan' size={18} color={'#FFFFFF'} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handlePickFromMyAccounts} style={styles.iconButton}>
                <AntDesign name='user' size={18} color={'#FFFFFF'} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Token selector */}
          <TouchableOpacity style={styles.card} onPress={handleSelectToken}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                {selectedToken?.logo || selectedToken?.thumbnail ? (
                  <Image source={{ uri: selectedToken?.logo || selectedToken?.thumbnail }} style={{ width: 28, height: 28, borderRadius: 14 }} />
                ) : (
                  <Ionicons name='logo-usd' size={22} color={text.color} />
                )}
                <View>
                  <ThemedText>{selectedToken?.symbol || 'Select Token'}</ThemedText>
                  {!!selectedToken && (
                    <ThemedText style={{ color: '#9AA0A6' }}>Balance: {Big(balanceFormatted).decimalPlaces(6, Big.ROUND_DOWN).toFormat()}</ThemedText>
                  )}
                </View>
              </View>
              <AntDesign name='down' size={16} color={'#9AA0A6'} />
            </View>
          </TouchableOpacity>

          {/* Amount inputs */}
          <View style={styles.card}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <ThemedText>Amount</ThemedText>
              <TouchableOpacity
                onPress={() => {
                  setAmountToken(Big(balanceFormatted).toFixed())
                  setAmountUsd(tokenUsdPrice ? Big(balanceFormatted).multipliedBy(tokenUsdPrice).toFixed() : '0')
                }}
              >
                <ThemedText style={{ color: '#007AFF' }}>MAX</ThemedText>
              </TouchableOpacity>
            </View>

            <View style={{ gap: 10, marginTop: 12 }}>
              <View style={styles.inputRow}>
                <ThemedText style={styles.inputPrefix}>{selectedToken?.symbol || 'TOKEN'}</ThemedText>
                <TextInput
                  value={amountToken}
                  onFocus={() => setActiveAmountField('token')}
                  onChangeText={(t) => setAmountToken(t.replace(/[^0-9,]/g, ''))}
                  placeholder='0'
                  placeholderTextColor={'#8E8E93'}
                  style={styles.input}
                  keyboardType='numeric'
                  inputMode='numeric'
                />
              </View>
              <View style={styles.inputRow}>
                <ThemedText style={styles.inputPrefix}>USD</ThemedText>
                <TextInput
                  value={amountUsd}
                  onFocus={() => setActiveAmountField('usd')}
                  onChangeText={(t) => setAmountUsd(t.replace(/[^0-9,]/g, ''))}
                  placeholder='0'
                  placeholderTextColor={'#8E8E93'}
                  style={styles.input}
                  keyboardType='numeric'
                  inputMode='numeric'
                />
              </View>
            </View>
          </View>
          {/* Fee */}
          <View style={styles.card}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <ThemedText>Network fee</ThemedText>
              <ThemedText>
                {feeInfo.gasFeeNative} {feeInfo.nativeSymbol}
                {feeInfo.gasFeeUsd !== '—' ? ` (~$${feeInfo.gasFeeUsd})` : ''}
              </ThemedText>
            </View>
          </View>

          {/* Removed custom keypad as requested */}

          {/* Send button moved to From row */}

          {/* Tx result */}
          {!!txHash && (
            <View style={[styles.card, { marginTop: 8 }]}>
              <ThemedText type='subtitle'>Transaction Hash</ThemedText>
              <ThemedText selectable style={{ marginTop: 6 }}>
                {txHash}
              </ThemedText>
            </View>
          )}
          {!!txError && (
            <View style={[styles.card, { marginTop: 8 }]}>
              <ThemedText type='subtitle' style={{ color: '#FF5252' }}>
                Error
              </ThemedText>
              <ThemedText selectable style={{ marginTop: 6 }}>
                {txError}
              </ThemedText>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}

export default SendTokenScreen

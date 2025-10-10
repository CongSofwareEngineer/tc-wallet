import AntDesign from '@expo/vector-icons/AntDesign'
import Ionicons from '@expo/vector-icons/Ionicons'
import Big from 'bignumber.js'
import { Image } from 'expo-image'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useMemo, useRef, useState } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity, View } from 'react-native'

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
import { ellipsisText } from '@/utils/functions'

import { createStyles } from './styles'

const SendTokenScreen = () => {
  const router = useRouter()
  const { address: initialAddress } = useLocalSearchParams<{ address?: string }>()
  const { isDark } = useMode()
  const { text } = useTheme()
  const styles = createStyles(isDark)
  const { chainCurrent } = useChains()
  const { wallet, wallets } = useWallets()
  const { data: tokens } = useBalanceToken(true)
  const { openSheet, closeSheet } = useSheet()

  const [toAddress, setToAddress] = useState<string>((initialAddress as string) || '')
  const [selectedToken, setSelectedToken] = useState<Token | null>(tokens?.[0] || null)
  const [amountToken, setAmountToken] = useState<string>('')
  const [amountUsd, setAmountUsd] = useState<string>('')
  const [activeAmountField, setActiveAmountField] = useState<'token' | 'usd'>('token')

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

  const applyKey = (key: string) => {
    const target = activeAmountField === 'token' ? amountToken : amountUsd
    // Only allow digits and comma separator
    if (key === 'back') {
      const next = target.slice(0, -1)
      if (activeAmountField === 'token') {
        setAmountToken(next)
      } else {
        setAmountUsd(next)
      }
      return
    }
    if (key === 'clear') {
      if (activeAmountField === 'token') {
        setAmountToken('')
      } else {
        setAmountUsd('')
      }
      return
    }
    if (!/^[0-9,]$/.test(key)) return

    const next = `${target}${key}`
    // normalize comma to dot for internal calc
    const normalized = next.replace(/,/g, '.')
    if (activeAmountField === 'token') {
      setAmountToken(next)
      const usd = tokenUsdPrice
        ? Big(normalized || 0)
          .multipliedBy(tokenUsdPrice)
          .toFixed()
        : '0'
      setAmountUsd(usd)
    } else {
      setAmountUsd(next)
      const token = tokenUsdPrice
        ? Big(normalized || 0)
          .dividedBy(tokenUsdPrice)
          .toFixed()
        : '0'
      setAmountToken(token)
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
            <ThemedText style={{ marginBottom: 6, color: '#9AA0A6' }}>From</ThemedText>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={styles.avatar} />
              <View style={{ flex: 1 }}>
                <ThemedText>{wallet?.name || 'My Wallet'}</ThemedText>
                <ThemedText style={{ color: '#9AA0A6' }}>{ellipsisText(wallet?.address || '', 6, 6)}</ThemedText>
              </View>
              {chainCurrent?.iconChain ? (
                <Image source={{ uri: chainCurrent.iconChain }} style={{ width: 24, height: 24, borderRadius: 12 }} />
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

          {/* Custom keypad */}
          <View style={styles.keypad}>
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', ',', '0', 'back'].map((k) => (
              <TouchableOpacity key={k} style={styles.key} onPress={() => applyKey(k)}>
                {k === 'back' ? <AntDesign name='arrow-left' size={18} color={'#FFFFFF'} /> : <ThemedText style={styles.keyText}>{k}</ThemedText>}
              </TouchableOpacity>
            ))}
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

          {/* Send button */}
          <ThemeTouchableOpacity style={{ marginTop: 4 }} disabled={!toAddress || !selectedToken || !amountToken}>
            <ThemedText>Send</ThemedText>
          </ThemeTouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}

export default SendTokenScreen

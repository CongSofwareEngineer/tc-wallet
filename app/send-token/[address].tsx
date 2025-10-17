import AntDesign from '@expo/vector-icons/AntDesign'
import Ionicons from '@expo/vector-icons/Ionicons'
import { default as Big, default as BigNumber } from 'bignumber.js'
import { Image } from 'expo-image'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useMemo, useState } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, View } from 'react-native'
import { encodeFunctionData, erc20Abi } from 'viem'

import HeaderScreen from '@/components/Header'
import QrScan from '@/components/QrScan'
import ThemedInput from '@/components/UI/ThemedInput'
import ThemedText from '@/components/UI/ThemedText'
import { COLORS } from '@/constants/style'
import useBalanceToken from '@/hooks/react-query/useBalanceToken'
import useTokenPrice from '@/hooks/react-query/useTokenPrice'
import useChains from '@/hooks/useChains'
import useMode from '@/hooks/useMode'
import useSheet from '@/hooks/useSheet'
import useTheme from '@/hooks/useTheme'
import useWallets from '@/hooks/useWallets'
import { Token } from '@/services/moralis/type'
import { cloneDeep, ellipsisText, getRadomColor } from '@/utils/functions'
import { isAddress, isTokenNative } from '@/utils/nvm'
import { height } from '@/utils/systems'
import WalletEvmUtil from '@/utils/walletEvm'

import { createStyles } from './styles'

type FormSendToken = {
  toAddress: string
  amountToken: string
  amountUsd?: string
}

const SendTokenScreen = () => {
  const router = useRouter()
  const { address: addressToken } = useLocalSearchParams<{ address?: string }>()
  const { isDark } = useMode()
  const { text, colorIcon } = useTheme()
  const styles = createStyles(isDark)
  const { chainCurrent } = useChains()
  const { wallet, wallets, indexWalletActive } = useWallets()
  const { data: tokens } = useBalanceToken(true)
  const { openSheet, closeSheet } = useSheet()
  const [form, setForm] = useState<FormSendToken>({
    toAddress: '',
    amountToken: '',
    amountUsd: '',
  })

  const [formError, setFormError] = useState<FormSendToken>({
    toAddress: '',
    amountToken: '',
    amountUsd: '',
  })

  const [selectedToken, setSelectedToken] = useState<Token | null>(tokens?.[0] || null)
  const [isSending, setIsSending] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)
  const [txError, setTxError] = useState<string | null>(null)

  const { data: tokenPrice, isLoading: loadingTokenPrice } = useTokenPrice(
    isTokenNative(selectedToken?.token_address) ? selectedToken?.symbol : selectedToken?.token_address || ''
  )

  useEffect(() => {
    if (addressToken && tokens) {
      const tokenFind = tokens.find((t) => t.token_address.toLowerCase() === addressToken.toLowerCase())
      if (tokenFind) {
        setSelectedToken(tokenFind)
      }
    }
  }, [tokens, addressToken])

  const handleSelectToken = () => {
    openSheet({
      isOpen: true,
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
                  closeSheet()
                }}
              >
                {t.logo || t.thumbnail ? (
                  <Image source={{ uri: t.logo || t.thumbnail }} style={styles.tokenIcon} />
                ) : (
                  <View style={[styles.tokenIcon, { alignItems: 'center', justifyContent: 'center' }]}>
                    <AntDesign name='database' size={20} color={text.color} />
                  </View>
                )}
                <View style={styles.tokenItemContent}>
                  <ThemedText style={styles.tokenItemSymbol}>{t.symbol}</ThemedText>
                  <ThemedText style={styles.tokenItemBalance}>
                    {Big(t.balance_formatted || 0)
                      .decimalPlaces(6, Big.ROUND_DOWN)
                      .toFormat()}
                  </ThemedText>
                </View>
                <ThemedText style={styles.tokenItemName}>{t.name}</ThemedText>
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
                  // setToAddress(w.address)
                  closeSheet()
                }}
              >
                <View style={[styles.tokenIcon, { backgroundColor: getRadomColor(w?.address) }]} />
                <View style={styles.tokenItemContent}>
                  <ThemedText style={styles.tokenItemSymbol}>{w.name || 'Account'}</ThemedText>
                  <ThemedText style={styles.tokenItemBalance}>{ellipsisText(w.address, 6, 6)}</ThemedText>
                </View>
                {w.isDefault && <ThemedText style={{ color: '#10B981', fontWeight: '600' }}>Default</ThemedText>}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      ),
    })
  }

  const handleScanAddress = () => {
    openSheet({
      containerContentStyle: {
        height: height(70),
      },
      content: (
        <QrScan
          type='address'
          onScanned={(e) => {
            onChangeForm({ toAddress: e })
          }}
        />
      ),
    })
  }

  // Removed custom keypad handler

  const handleSend = async () => {
    try {
      setTxHash(null)
      setTxError(null)
      if (!wallet || !selectedToken || !form?.toAddress || !form.amountToken) return

      const decimals = selectedToken.decimals || 18
      const amountStr = Big(form.amountToken.replace(/,/g, '.')).multipliedBy(Big(10).pow(decimals)).decimalPlaces(0, Big.ROUND_DOWN).toFixed(0)
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
            to: form?.toAddress,
            value: BigInt(amountStr),
          } as any,
          wallet.privateKey as any
        )
      } else {
        const data = encodeFunctionData({ abi: erc20Abi, functionName: 'transfer', args: [form?.toAddress as any, BigInt(amountStr)] })
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

  const handleMax = () => {
    const amountToken = selectedToken?.balance_formatted || '0'
    const amountToUSD = BigNumber(amountToken)
      .multipliedBy(tokenPrice || 0)
      .decimalPlaces(6)
      .toFixed()
    setForm({
      ...form,
      amountToken,
      amountUsd: amountToUSD,
    })
  }

  const onChangeForm = (param: Partial<FormSendToken>) => {
    const formClone = cloneDeep(form) as FormSendToken
    const formErrorClone = cloneDeep(formError) as FormSendToken

    if (typeof param.amountToken !== 'undefined') {
      formClone.amountToken = param.amountToken.replace(/,/g, '.')
      if (tokenPrice && BigNumber(tokenPrice).isGreaterThan(0) && param.amountToken && BigNumber(param.amountToken).isGreaterThan(0)) {
        const amountUsd = BigNumber(param.amountToken || '0')
          .multipliedBy(tokenPrice)
          .decimalPlaces(6)
          .toFixed()
        formClone.amountUsd = amountUsd
      } else {
        formClone.amountUsd = ''
      }
    }

    if (typeof param.amountUsd !== 'undefined') {
      formClone.amountUsd = param.amountUsd.replace(/,/g, '.')
      if (tokenPrice && BigNumber(tokenPrice).isGreaterThan(0) && param.amountUsd && BigNumber(param.amountUsd).isGreaterThan(0)) {
        const amountToken = BigNumber(param.amountUsd || '0')
          .dividedBy(tokenPrice)
          .decimalPlaces(6)
          .toFixed()
        formClone.amountToken = amountToken
      } else {
        formClone.amountToken = ''
      }
    }

    if (typeof param.toAddress !== 'undefined') {
      formClone.toAddress = param.toAddress
      if (!isAddress(param.toAddress)) {
        formErrorClone.toAddress = 'Địa chỉ không hợp lệ'
      } else {
        formErrorClone.toAddress = ''
      }
    }

    setForm(formClone)
    setFormError(formErrorClone)
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
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps='handled'>
          {/* From Wallet Section */}
          <View style={styles.card}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <ThemedText style={styles.sectionLabel}>From</ThemedText>
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  (loadingTokenPrice || !form?.toAddress || !selectedToken || !form?.amountToken || isSending) && styles.sendButtonDisabled,
                ]}
                disabled={loadingTokenPrice || !form?.toAddress || !selectedToken || !form?.amountToken || isSending}
                onPress={handleSend}
              >
                <ThemedText
                  style={[
                    styles.sendButtonText,
                    (loadingTokenPrice || !form?.toAddress || !selectedToken || !form?.amountToken || isSending) && styles.sendButtonTextDisabled,
                  ]}
                >
                  {isSending ? 'Sending…' : 'Send'}
                </ThemedText>
              </TouchableOpacity>
            </View>

            <View style={styles.walletRow}>
              {wallet?.avatar ? (
                <Image source={{ uri: wallet?.avatar }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, { backgroundColor: getRadomColor(wallet?.address) }]} />
              )}

              <View style={styles.walletInfo}>
                <ThemedText style={styles.walletName}>{wallet?.name || `Account ${indexWalletActive + 1}`}</ThemedText>
                <ThemedText style={styles.walletAddress}>{ellipsisText(wallet?.address || '', 6, 6)}</ThemedText>
              </View>

              {chainCurrent?.iconChain && <Image source={{ uri: chainCurrent.iconChain }} style={styles.chainIcon} />}
            </View>
          </View>

          {/* To Address Section */}
          <View style={styles.card}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <ThemedText style={styles.sectionLabel}>To</ThemedText>
              <View style={styles.inputActions}>
                <TouchableOpacity
                  onPress={handleScanAddress}
                  style={[styles.iconButton, styles.iconButtonActive, { backgroundColor: colorIcon.colorDefault }]}
                >
                  <AntDesign name='scan' size={18} color={'#FFFFFF'} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handlePickFromMyAccounts}
                  style={[styles.iconButton, styles.iconButtonActive, { backgroundColor: colorIcon.colorDefault }]}
                >
                  <AntDesign name='user' size={18} color={'#FFFFFF'} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.inputContainer}>
              <ThemedInput
                noBorder={true}
                style={styles.input}
                disabled={isSending || loadingTokenPrice}
                placeholder='Recipient address'
                autoCapitalize='none'
                autoCorrect={false}
                onChangeText={(text: string) => {
                  onChangeForm({ toAddress: text })
                }}
              />
            </View>
            <ThemedText type='small' style={{ color: COLORS.red, marginBottom: 5, marginTop: 5 }}>
              {formError?.toAddress}
            </ThemedText>
          </View>

          {/* Token Selection */}
          <View style={styles.card}>
            <ThemedText style={styles.sectionLabel}>Token</ThemedText>
            <TouchableOpacity style={styles.tokenSelector} onPress={handleSelectToken}>
              <View style={styles.tokenInfo}>
                {selectedToken?.logo || selectedToken?.thumbnail ? (
                  <Image source={{ uri: selectedToken?.logo || selectedToken?.thumbnail }} style={styles.tokenIcon} />
                ) : (
                  <View style={[styles.tokenIcon, { alignItems: 'center', justifyContent: 'center' }]}>
                    <Ionicons name='logo-usd' size={20} color={text.color} />
                  </View>
                )}
                <View style={styles.tokenDetails}>
                  <ThemedText style={styles.tokenSymbol}>{selectedToken?.symbol || 'Select Token'}</ThemedText>
                  {!!selectedToken && (
                    <ThemedText style={styles.tokenBalance}>
                      Balance:{' '}
                      {BigNumber(selectedToken?.balance_formatted || 0)
                        .decimalPlaces(6, Big.ROUND_DOWN)
                        .toFormat()}
                    </ThemedText>
                  )}
                </View>
              </View>
              <AntDesign name='down' size={16} color={isDark ? '#9CA3AF' : '#6B7280'} />
            </TouchableOpacity>
          </View>

          {/* Amount Section */}
          <View style={styles.card}>
            <ThemedText style={styles.sectionLabel}>Amount</ThemedText>
            <View style={styles.amountCard}>
              <View style={[styles.amountHeader, { marginBottom: 8 }]}>
                <ThemedText style={styles.amountLabel}>{selectedToken?.symbol || 'TOKEN'}</ThemedText>
                <TouchableOpacity onPress={handleMax}>
                  <ThemedText>MAX</ThemedText>
                </TouchableOpacity>
              </View>

              <ThemedInput
                disabled={isSending || loadingTokenPrice}
                keyboardType='numeric'
                inputMode='numeric'
                style={[styles.input, { fontWeight: '700' }]}
                placeholder='0.00'
                value={form.amountToken}
                onChangeText={(text: string) => {
                  onChangeForm({ amountToken: text.toString() })
                }}
              />
              <ThemedText type='small' style={{ color: COLORS.red, marginBottom: 5, marginTop: 5, opacity: formError?.amountToken ? 1 : 0 }}>
                {formError?.amountToken || 'non'}
              </ThemedText>

              {BigNumber(tokenPrice || 0).isGreaterThan(0) && (
                <View>
                  <ThemedInput
                    disabled={isSending || loadingTokenPrice}
                    keyboardType='numeric'
                    inputMode='numeric'
                    style={[styles.input, { fontSize: 16 }]}
                    placeholder='$0.00'
                    value={form.amountUsd}
                    onChangeText={(text: string) => {
                      onChangeForm({ amountUsd: text.toString() })
                    }}
                  />
                  <ThemedText type='small' style={{ color: COLORS.red, marginBottom: 5, marginTop: 5, opacity: formError?.amountUsd ? 1 : 0 }}>
                    {formError?.amountUsd || 'non'}
                  </ThemedText>
                </View>
              )}
            </View>
          </View>

          {/* Network Fee */}
          <View style={styles.feeCard}>
            <View style={styles.feeRow}>
              <ThemedText style={styles.feeLabel}>Network Fee</ThemedText>
              <ThemedText style={styles.feeValue}>
                {feeInfo.gasFeeNative} {feeInfo.nativeSymbol}
                {feeInfo.gasFeeUsd !== '—' ? ` (~$${feeInfo.gasFeeUsd})` : ''}
              </ThemedText>
            </View>
          </View>

          {/* Transaction Result */}
          {!!txHash && (
            <View style={styles.resultCard}>
              <ThemedText style={[styles.resultTitle, { color: isDark ? '#10B981' : '#047857' }]}>Transaction Successful</ThemedText>
              <ThemedText selectable style={[styles.resultText, { color: isDark ? '#047857' : '#065F46' }]}>
                {txHash}
              </ThemedText>
            </View>
          )}

          {!!txError && (
            <View style={styles.errorCard}>
              <ThemedText style={[styles.resultTitle, { color: isDark ? '#EF4444' : '#DC2626' }]}>Transaction Failed</ThemedText>
              <ThemedText selectable style={[styles.resultText, { color: isDark ? '#DC2626' : '#7F1D1D' }]}>
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

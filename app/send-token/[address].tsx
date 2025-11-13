import AntDesign from '@expo/vector-icons/AntDesign'
import BigNumber from 'bignumber.js'
import { Image } from 'expo-image'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useMemo, useState } from 'react'
import { Platform, ScrollView, TouchableOpacity, View } from 'react-native'
import { encodeFunctionData, erc20Abi } from 'viem'

import HeaderScreen from '@/components/Header'
import KeyboardAvoiding from '@/components/KeyboardAvoiding'
import MyImage from '@/components/MyImage'
import QrScan from '@/components/QrScan'
import ThemedText from '@/components/UI/ThemedText'
import { images } from '@/configs/images'
import { COLORS } from '@/constants/style'
import useBalanceNative from '@/hooks/react-query/useBalanceNative'
import useBalanceToken from '@/hooks/react-query/useBalanceToken'
import useEstimateGas from '@/hooks/react-query/useEastimse'
import useTokenPrice from '@/hooks/react-query/useTokenPrice'
import useChains from '@/hooks/useChains'
import useErrorWeb3 from '@/hooks/useErrorWeb3'
import useMode from '@/hooks/useMode'
import useSheet from '@/hooks/useSheet'
import useTheme from '@/hooks/useTheme'
import useWallets from '@/hooks/useWallets'
import { Token } from '@/services/moralis/type'
import { RawTransactionEVM } from '@/types/web3'
import { cloneDeep, convertBalanceToWei, copyToClipboard, ellipsisText, getRadomColor } from '@/utils/functions'
import { isAddress, isTokenNative } from '@/utils/nvm'
import { height } from '@/utils/systems'
import WalletEvmUtil from '@/utils/walletEvm'

import { IsIos } from '@/constants/app'
import InputEnter from './Component/InputEnter'
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
  const { getError } = useErrorWeb3()
  const { wallet, wallets, indexWalletActive } = useWallets()
  const { data: tokens, refetch: refetchBalanceTokens } = useBalanceToken()
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

  const isNativeToken = useMemo(() => {
    return isTokenNative(selectedToken?.token_address)
  }, [selectedToken])

  const rawTransaction = useMemo(() => {
    if (selectedToken && wallet) {
      if (isTokenNative(selectedToken?.token_address)) {
        const raw: RawTransactionEVM = {
          from: wallet?.address as `0x${string}`,
          to: wallet.address as `0x${string}`,
          data: '0x',
        }
        return raw
      } else {
        const decode = encodeFunctionData({
          abi: erc20Abi,
          functionName: 'transfer',
          args: [wallet.address as `0x${string}`, BigInt(selectedToken.balance)],
        })
        const raw: RawTransactionEVM = {
          from: wallet?.address as `0x${string}`,
          to: selectedToken.token_address as `0x${string}`,
          data: decode,
          value: 0n,
        }
        return raw
      }
    }
    return null
  }, [selectedToken, wallet])

  const { data: estimatedGas, isLoading: loadingEstimatedGas, refetch: refetchEstimatedGas } = useEstimateGas(rawTransaction)
  const { data: tokenPrice, isLoading: loadingTokenPrice } = useTokenPrice(isNativeToken ? selectedToken?.symbol : selectedToken?.token_address)
  const { data: balanceNative } = useBalanceNative(!isNativeToken)

  const isErrorForm = useMemo(() => {
    if (loadingEstimatedGas) {
      return true
    }
    if (formError.toAddress || formError.amountToken || formError.amountUsd) {
      return true
    }
    if (estimatedGas?.error) {
      return true
    }

    if (isTokenNative(selectedToken?.token_address) && estimatedGas?.totalFee) {
      if (BigNumber(selectedToken?.balance_formatted || 0).isLessThanOrEqualTo(estimatedGas?.totalFee || 0)) {
        return true
      }
    } else {
      if (balanceNative && estimatedGas?.totalFee) {
        if (BigNumber(balanceNative).isLessThanOrEqualTo(estimatedGas?.totalFee || 0)) {
          return true
        }
      }
    }

    return false
  }, [estimatedGas, loadingEstimatedGas, formError, balanceNative, selectedToken])

  useEffect(() => {
    if (addressToken && tokens) {
      const tokenFind = tokens.find((t) => t.token_address.toLowerCase() === addressToken.toLowerCase())
      if (tokenFind) {
        setSelectedToken(tokenFind)
      }
    }
  }, [tokens, addressToken])

  const handlePickFromMyAccounts = () => {
    openSheet({
      isOpen: true,
      content: (
        <View>
          <ThemedText type='subtitle' style={{ marginBottom: 12 }}>
            Chọn địa chỉ từ ví của tôi
          </ThemedText>

          <ScrollView style={{ maxHeight: 420 }}>
            {(wallets || []).map((w, index) => (
              <TouchableOpacity
                key={w.address + index}
                style={styles.tokenItem}
                onPress={() => {
                  onChangeForm({ toAddress: w.address })
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

  const handleSend = async () => {
    try {
      setTxHash(null)
      setTxError(null)
      if (!wallet || !selectedToken || !form?.toAddress || !form.amountToken) return

      const decimalsToken = selectedToken.decimals || 18
      const tokenAddress = selectedToken.token_address
      const amountStr = convertBalanceToWei(form.amountToken, decimalsToken)

      const rawBase: RawTransactionEVM = {
        from: wallet.address as any,
        to: form?.toAddress as any,
        chainId: (chainCurrent?.id as any) ?? 1,
        gas: BigInt(estimatedGas?.estimatedGas || 0),
        isTracking: true,
        callbackBefore: () => setIsSending(true),
        callbackSuccess: (hash?: any) => {
          setIsSending(false)
          setTxHash((hash as string) || null)
          refetchBalanceTokens()
          refetchEstimatedGas()
        },
        callbackError: (err?: any) => {
          setIsSending(false)
          setTxError((err?.message as string) || String(err))
        },
      }

      if (isNativeToken) {
        rawBase.value = BigInt(amountStr)
      } else {
        const data = encodeFunctionData({ abi: erc20Abi, functionName: 'transfer', args: [form?.toAddress as any, BigInt(amountStr)] })
        rawBase.data = data
        rawBase.to = tokenAddress as `0x${string}`
      }

      await WalletEvmUtil.sendTransaction(rawBase, wallet.privateKey as any)
      onChangeForm({ amountToken: '', amountUsd: '' })
    } catch (err: any) {
      setIsSending(false)
      setTxError(err?.message || String(err))
    }
  }

  const handleMax = () => {
    const amountToken = BigNumber(selectedToken?.balance_formatted || '0')
      .minus(estimatedGas?.totalFee || '0')
      .decimalPlaces(10, BigNumber.ROUND_DOWN)
      .toFixed()

    if (BigNumber(amountToken).gt(0)) {
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
  }

  const calculateToUSD = (value?: string, tokenPrice?: string, decimal = 6) => {
    if (tokenPrice) {
      const amountUsd = BigNumber(value || '0')
        .multipliedBy(tokenPrice)
        .decimalPlaces(6)
        .toFixed()
      return amountUsd
    }
    return '0'
  }

  const onChangeForm = (param: Partial<FormSendToken>) => {
    const formClone = cloneDeep(form) as FormSendToken
    const formErrorClone = cloneDeep(formError) as FormSendToken

    const maxBalance = selectedToken?.balance_formatted || '0'
    const maxBalanceByUSD = BigNumber(maxBalance)
      .multipliedBy(tokenPrice || 0)
      .toFixed()

    if (typeof param.amountToken !== 'undefined') {
      formErrorClone.amountToken = formErrorClone.amountUsd = ''
      formClone.amountToken = param.amountToken.replace(/,/g, '.')
      if (tokenPrice && BigNumber(tokenPrice).isGreaterThan(0) && param.amountToken && BigNumber(param.amountToken).isGreaterThan(0)) {
        const amountUsd = BigNumber(param.amountToken || '0')
          .multipliedBy(tokenPrice)
          .decimalPlaces(6)
          .toFixed()
        formClone.amountUsd = amountUsd
      }
      if (BigNumber(formClone.amountToken || 0).isGreaterThan(maxBalance || 0)) {
        formErrorClone.amountToken = 'Số dư không đủ'
      }
    }

    if (typeof param.amountUsd !== 'undefined') {
      formErrorClone.amountToken = formErrorClone.amountUsd = ''

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
      if (BigNumber(formClone.amountUsd || 0).isGreaterThan(maxBalanceByUSD || 0)) {
        formErrorClone.amountUsd = 'Số dư không đủ'
      }
    }

    if (typeof param.toAddress !== 'undefined') {
      formErrorClone.toAddress = ''
      formClone.toAddress = param.toAddress
      if (!isAddress(param.toAddress)) {
        formErrorClone.toAddress = 'Địa chỉ không hợp lệ'
      }
    }

    setForm(formClone)
    setFormError(formErrorClone)
  }

  return (
    <KeyboardAvoiding>
      <HeaderScreen title='Send Token' />
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps='handled'
        automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
        bounces={false}
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
      >
        {/* From Wallet Section */}
        <View style={styles.card}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <ThemedText style={styles.sectionLabel}>FROM</ThemedText>
            <TouchableOpacity
              style={[
                styles.sendButton,
                (loadingTokenPrice || !form?.toAddress || !selectedToken || !form?.amountToken || isSending) && styles.sendButtonDisabled,
              ]}
              disabled={isErrorForm}
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

          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            {wallet?.avatar ? (
              <Image source={{ uri: wallet?.avatar }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, { backgroundColor: getRadomColor(wallet?.address) }]} />
            )}

            <View style={{ flex: 1, marginLeft: 12 }}>
              <ThemedText style={styles.walletName}>{wallet?.name || `Account ${indexWalletActive + 1}`}</ThemedText>
              <ThemedText type='small' style={styles.walletAddress}>
                {ellipsisText(wallet?.address || '', 6, 6)}
              </ThemedText>
            </View>

            {chainCurrent?.iconChain && <Image source={{ uri: chainCurrent.iconChain }} style={styles.chainIcon} />}
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: 8,
              borderTopWidth: 1,
              borderTopColor: isDark ? '#374151' : '#E5E7EB',
            }}
          >
            <View>
              <ThemedText type='small' style={{ opacity: 0.6, marginBottom: 4 }}>
                Balance
              </ThemedText>
              <ThemedText style={{ fontWeight: '600' }}>
                {BigNumber(selectedToken?.balance_formatted || 0)
                  .decimalPlaces(8, BigNumber.ROUND_DOWN)
                  .toFormat()}{' '}
                {selectedToken?.symbol || ''}
              </ThemedText>
            </View>
            <TouchableOpacity
              onPress={handleMax}
              disabled={isSending || loadingTokenPrice}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 4,
                backgroundColor: colorIcon.colorDefault,
                borderRadius: 8,
                opacity: isSending || loadingTokenPrice ? 0.5 : 1,
              }}
            >
              <ThemedText style={{ color: '#FFFFFF', fontWeight: '600', fontSize: 14 }}>MAX</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* To Address Section */}
        {/* <View style={styles.card}> */}
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <ThemedText style={styles.sectionLabel}>To</ThemedText>
            <View style={styles.inputActions}>
              <TouchableOpacity
                onPress={handleScanAddress}
                style={[styles.iconButton, styles.iconButtonActive, { backgroundColor: colorIcon.colorDefault }]}
              >
                <AntDesign name='scan' size={14} color={'#FFFFFF'} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handlePickFromMyAccounts}
                style={[styles.iconButton, styles.iconButtonActive, { backgroundColor: colorIcon.colorDefault }]}
              >
                <AntDesign name='user' size={14} color={'#FFFFFF'} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={[styles.inputContainer]}>
            <InputEnter
              disabled={isSending || loadingTokenPrice}
              placeholder='Recipient address'
              autoCapitalize='none'
              value={form.toAddress}
              onChangeText={(text: string) => {
                onChangeForm({ toAddress: text })
              }}
            />
          </View>
          <ThemedText type='small' style={{ color: COLORS.red, marginTop: 5 }}>
            {formError?.toAddress}
          </ThemedText>
        </View>
        <View>
          <View style={[styles.inputContainer]}>
            <InputEnter
              rightIcon={<ThemedText style={styles.amountLabel}>{selectedToken?.symbol || 'TOKEN'}</ThemedText>}
              leftIcon={<MyImage src={selectedToken?.logo || selectedToken?.thumbnail} style={{ width: 30, height: 30 }} />}
              styleContentInput={{ paddingHorizontal: 0 }}
              disabled={isSending || loadingTokenPrice}
              keyboardType='numeric'
              // inputMode='numeric'
              style={[{ fontSize: 20, fontWeight: '700' }]}
              placeholder='0.00'
              value={form.amountToken}
              onChangeText={(text: string) => {
                onChangeForm({ amountToken: text.toString() })
              }}
            />
          </View>
          <ThemedText type='small' style={{ color: COLORS.red, marginBottom: 5, marginTop: 5, opacity: formError?.amountToken ? 1 : 0 }}>
            {formError?.amountToken || 'non'}
          </ThemedText>
        </View>
        {BigNumber(tokenPrice || 0).isGreaterThan(0) && (
          <View>
            <View style={[styles.inputContainer]}>
              <InputEnter
                rightIcon={<ThemedText style={styles.amountLabel}>{'USD'}</ThemedText>}
                leftIcon={<MyImage src={images.tokens.usdIcon} style={{ width: 30, height: 30 }} />}
                styleContentInput={{ paddingHorizontal: 0 }}
                disabled={isSending || loadingTokenPrice}
                keyboardType='numeric'
                // inputMode='numeric'
                style={[{ fontSize: 20, fontWeight: '700' }]}
                placeholder='$0.00'
                value={form.amountUsd}
                onChangeText={(text: string) => {
                  onChangeForm({ amountUsd: text.toString() })
                }}
              />
            </View>
            <ThemedText type='small' style={{ color: COLORS.red, marginBottom: 5, marginTop: 5, opacity: formError?.amountUsd ? 1 : 0 }}>
              {formError?.amountUsd || 'non'}
            </ThemedText>
          </View>
        )}

        {/* Network Fee */}
        <View style={styles.feeCard}>
          <View style={styles.feeRow}>
            <ThemedText style={styles.feeLabel}>Fee</ThemedText>
            <ThemedText style={styles.feeValue}>
              {loadingEstimatedGas && 'Calculating...'}
              {estimatedGas?.totalFee && BigNumber(estimatedGas.totalFee).toFixed(8)}
              {estimatedGas?.error && getError(estimatedGas.error)} {!loadingEstimatedGas && chainCurrent?.nativeCurrency.symbol}
              {/* {feeInfo.nativeSymbol} */}
              {/* {feeInfo.gasFeeUsd !== '—' ? ` (~$${feeInfo.gasFeeUsd})` : ''} */}
            </ThemedText>
          </View>
        </View>

        {/* Transaction Result */}
        {!!txHash && (
          <View style={styles.resultCard}>
            <ThemedText style={[styles.resultTitle, { color: isDark ? '#10B981' : '#047857' }]}>Transaction Successful</ThemedText>
            <ThemedText allowFontScaling={false} selectable style={[styles.resultText, { color: isDark ? '#10B981' : '#065F46' }]}>
              {txHash}{' '}
              <TouchableOpacity onPress={() => copyToClipboard(txHash)}>
                <AntDesign style={{ position: 'relative', top: 4 }} name='copy' size={16} color={isDark ? '#10B981' : '#065F46'} />
              </TouchableOpacity>
              {!IsIos && <View style={{ width: '100%' }} />}
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
    </KeyboardAvoiding>
  )
}

export default SendTokenScreen

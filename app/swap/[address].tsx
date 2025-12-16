import AntDesign from '@expo/vector-icons/AntDesign'
import BigNumber from 'bignumber.js'
import { useLocalSearchParams } from 'expo-router'
import React, { useEffect, useMemo, useState } from 'react'
import { Platform, ScrollView, TouchableOpacity, View } from 'react-native'
import { zeroAddress } from 'viem'

import HeaderScreen from '@/components/Header'
import KeyboardAvoiding from '@/components/KeyboardAvoiding'
import MyImage from '@/components/MyImage'
import ThemedInput from '@/components/UI/ThemedInput'
import ThemedText from '@/components/UI/ThemedText'
import { COLORS, PADDING_DEFAULT } from '@/constants/style'
import useBalanceNative from '@/hooks/react-query/useBalanceNative'
import useBalanceToken from '@/hooks/react-query/useBalanceToken'
import useTokenPrice from '@/hooks/react-query/useTokenPrice'
import useChains from '@/hooks/useChains'
import useErrorWeb3 from '@/hooks/useErrorWeb3'
import useLanguage from '@/hooks/useLanguage'
import useMode from '@/hooks/useMode'
import useSheet from '@/hooks/useSheet'
import useTheme from '@/hooks/useTheme'
import useWallets from '@/hooks/useWallets'
import { Token } from '@/services/moralis/type'
import { Network, RawTransactionEVM } from '@/types/web3'
import { cloneDeep, convertWeiToBalance, copyToClipboard } from '@/utils/functions'
import { isTokenNative } from '@/utils/nvm'

import ItemChain from '@/components/ItemChain'
import MyLoading from '@/components/MyLoading'
import SelectToken from '@/components/SelectToken'
import ThemeTouchableOpacity from '@/components/UI/ThemeTouchableOpacity'
import { IsIos } from '@/constants/app'
import { LIST_TOKEN_DEFAULT } from '@/constants/debridge'
import useGetRawDeBridge from '@/hooks/react-query/useGetRawDeBridge'
import useListTokenByChainDeBridge from '@/hooks/react-query/useListTokenByChainDeBridge'
import { height } from '@/utils/systems'
import WalletEvmUtil from '@/utils/walletEvm'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import SelectTokenOut from './Component/SelectTokenOut'
import createStyles from './styles'

type SwapForm = {
  inputAmount: string
  outputAmount: string
  inputAmountUsd: string
  outputAmountUsd: string
}

type SwapFormError = {
  inputAmount: string
  outputAmount: string
  errorBalance?: string
}

const SwapScreen = () => {
  const { address: addressToken } = useLocalSearchParams<{ address?: string }>()
  const { isDark } = useMode()
  const { text } = useTheme()
  const styles = createStyles(isDark)
  const { chainCurrent, chainList } = useChains()
  const { wallet } = useWallets()
  const { getError } = useErrorWeb3()
  const { translate } = useLanguage()
  const { data: tokens } = useBalanceToken()
  const { openSheet, closeSheet } = useSheet()

  const [form, setForm] = useState<SwapForm>({
    inputAmount: '',
    outputAmount: '',
    inputAmountUsd: '',
    outputAmountUsd: '',
  })

  const [formError, setFormError] = useState<SwapFormError>({
    inputAmount: '',
    outputAmount: '',
    errorBalance: '',
  })

  const [inputToken, setInputToken] = useState<Token | undefined>(tokens?.[0] || undefined)
  const [outputToken, setOutputToken] = useState<Token | undefined>(tokens?.[1] || undefined)
  const [outputChain, setOutputChain] = useState<Network | undefined>(chainCurrent || undefined)
  const [isSwapping, setIsSwapping] = useState(false)
  const [slippage] = useState(1)
  const [txHash, setTxHash] = useState<string | null>(null)
  const [txError, setTxError] = useState<string | null>(null)

  const isInputNativeToken = useMemo(() => {
    return isTokenNative(inputToken?.token_address, chainCurrent?.id)
  }, [inputToken, chainCurrent])

  const isOutputNativeToken = useMemo(() => {
    return isTokenNative(outputToken?.token_address, chainCurrent?.id)
  }, [outputToken, chainCurrent])

  const chainSupportSwap = useMemo(() => {
    return chainList?.filter((chain) => {
      if (LIST_TOKEN_DEFAULT[chain.id]) {
        return true
      }
      return false
    })
  }, [chainList])

  const { data: balanceNative, isLoading: loadingBalanceNative } = useBalanceNative()
  const { data: listTokenByChain, isLoading: loadingListTokenByChain } = useListTokenByChainDeBridge(outputChain?.id)
  const { data: inputTokenPrice } = useTokenPrice(isInputNativeToken ? inputToken?.symbol : inputToken?.token_address)
  const { data: outputTokenPrice } = useTokenPrice(isOutputNativeToken ? outputToken?.symbol : outputToken?.token_address)
  const { data: rawTransactionDeBridge, isLoading: loadingRawTransactionDeBridge, error: errorRawTransactionDeBridge, isFetching: isFetchingRawTransactionDeBridge } = useGetRawDeBridge({
    amountIn: form.inputAmount,
    slippage: slippage,
    tokenIn: inputToken,
    tokenOut: outputToken,
    chainIdOut: outputChain?.id,
  })

  const totalFee = useMemo(() => {
    if (rawTransactionDeBridge?.estimatedTransactionFee?.total) {
      return convertWeiToBalance(rawTransactionDeBridge?.estimatedTransactionFee?.total)
    }
    return '0'
  }, [rawTransactionDeBridge])

  const maxBalanceSwap = useMemo(() => {
    if (isInputNativeToken) {
      return BigNumber(balanceNative || 0).minus(totalFee).toFixed()
    }
    return inputToken?.balance_formatted || '0'
  }, [balanceNative, totalFee, inputToken, isInputNativeToken])



  // Calculate exchange rate
  const exchangeRate = useMemo(() => {
    if (inputTokenPrice && outputTokenPrice && BigNumber(inputTokenPrice).isGreaterThan(0) && BigNumber(outputTokenPrice).isGreaterThan(0)) {
      return BigNumber(inputTokenPrice).dividedBy(outputTokenPrice).toFixed(6)
    }
    return '0'
  }, [inputTokenPrice, outputTokenPrice])

  // Initialize tokens from params
  useEffect(() => {
    if (addressToken && tokens) {
      const tokenFind = tokens.find((t) => t.token_address.toLowerCase() === addressToken.toLowerCase())
      if (tokenFind) {
        setInputToken(tokenFind)
      }
    }
  }, [tokens, addressToken])


  useEffect(() => {
    if (listTokenByChain) {
      const tokenOut = listTokenByChain.find((t) => (t.token_address || zeroAddress) === zeroAddress)
      if (tokenOut) {
        setOutputToken(tokenOut)
      }
    }
  }, [listTokenByChain])


  // Update error balance state
  useEffect(() => {
    let errorBalance = ''
    if (isInputNativeToken && rawTransactionDeBridge?.estimatedTransactionFee?.total) {
      const totalNeeded = BigNumber(form.inputAmount || 0).plus(rawTransactionDeBridge?.estimatedTransactionFee?.total)
      if (BigNumber(inputToken?.balance_formatted || 0).isLessThan(totalNeeded)) {
        errorBalance = translate('errorWeb3.insufficientBalanceForGas')
      }
    } else if (maxBalanceSwap && rawTransactionDeBridge?.estimatedTransactionFee?.total) {
      if (BigNumber(maxBalanceSwap).isLessThan(totalFee)) {
        errorBalance = translate('errorWeb3.insufficientNativeBalanceForGas')
      }
    }

    if (errorBalance !== formError.errorBalance) {
      setFormError((prev) => ({ ...prev, errorBalance }))
    }
  }, [totalFee, maxBalanceSwap, form.inputAmount, inputToken, isInputNativeToken, balanceNative])


  const handleSelectInputToken = () => {
    openSheet({
      content: (
        <SelectToken
          data={tokens}
          onPress={(token) => {
            setInputToken(token)
            setForm({ ...form, inputAmount: '', inputAmountUsd: '' })
            closeSheet()
          }}
        />
      ),
    })
  }

  const handleSelectOutputToken = () => {
    openSheet({
      content: (
        <SelectTokenOut
          token={outputToken}
          onPress={(token) => {
            setOutputToken(token)
            setForm({ ...form, outputAmount: '', outputAmountUsd: '' })
            closeSheet()
          }}
          chainId={outputChain?.id}
        />
      ),
    })
  }

  const handleSelectOutputChain = () => {
    openSheet({
      content: (
        <View>
          <ThemedText type='subtitle' style={{ marginBottom: 12 }}>
            {translate('swap.selectOutputChain')}
          </ThemedText>
          <ScrollView style={{ maxHeight: height(70) }}>
            {chainSupportSwap?.map((chain, index) => (
              <ItemChain
                noEdit
                key={chain.id.toString() + index}
                item={chain}
                onPress={() => {
                  setOutputChain(chain)
                  closeSheet()
                }}
              />
            ))}
          </ScrollView>
        </View>
      ),
    })
  }

  const handleSwapDirection = () => {
    // Swap input and output tokens
    const tempToken = inputToken
    setInputToken(outputToken)
    setOutputToken(tempToken)

    // Swap amounts
    setForm({
      inputAmount: form.outputAmount,
      outputAmount: form.inputAmount,
      inputAmountUsd: form.outputAmountUsd,
      outputAmountUsd: form.inputAmountUsd,
    })
  }

  const handleMaxInput = () => {
    if (!inputToken) return

    const maxAmount = BigNumber(maxBalanceSwap)
      .decimalPlaces(6, BigNumber.ROUND_DOWN)
      .toFixed()

    const amountUsd = BigNumber(maxAmount)
      .multipliedBy(inputTokenPrice || 0)
      .decimalPlaces(6)
      .toFixed()

    setForm({
      ...form,
      inputAmount: maxAmount,
      inputAmountUsd: amountUsd,
    })

    // Calculate output amount based on exchange rate
    if (exchangeRate && BigNumber(exchangeRate).isGreaterThan(0)) {
      const outputAmt = BigNumber(maxAmount).multipliedBy(exchangeRate).decimalPlaces(6).toFixed()
      const outputUsd = BigNumber(outputAmt)
        .multipliedBy(outputTokenPrice || 0)
        .decimalPlaces(6)
        .toFixed()

      setForm((prev) => ({
        ...prev,
        outputAmount: outputAmt,
        outputAmountUsd: outputUsd,
      }))
    }
  }

  const onChangeInputAmount = (value: string) => {
    const formClone = cloneDeep(form)
    const formErrorClone = cloneDeep(formError)

    formClone.inputAmount = value.replace(/,/g, '.')
    formErrorClone.inputAmount = ''

    // Calculate USD value
    if (inputTokenPrice && BigNumber(inputTokenPrice).isGreaterThan(0) && value && BigNumber(value).isGreaterThan(0)) {
      formClone.inputAmountUsd = BigNumber(value).multipliedBy(inputTokenPrice).decimalPlaces(6).toFixed()
    } else {
      formClone.inputAmountUsd = ''
    }

    // Validate balance - check against maxBalanceSwap which accounts for gas fees
    if (inputToken && BigNumber(value || 0).isGreaterThan(maxBalanceSwap || 0)) {
      formErrorClone.inputAmount = translate('errorWeb3.insufficientBalance')
    }

    // Calculate output amount based on exchange rate
    if (exchangeRate && BigNumber(exchangeRate).isGreaterThan(0) && value && BigNumber(value).isGreaterThan(0)) {
      formClone.outputAmount = BigNumber(value).multipliedBy(exchangeRate).decimalPlaces(6).toFixed()

      if (outputTokenPrice && BigNumber(outputTokenPrice).isGreaterThan(0)) {
        formClone.outputAmountUsd = BigNumber(formClone.outputAmount).multipliedBy(outputTokenPrice).decimalPlaces(6).toFixed()
      }
    } else {
      formClone.outputAmount = ''
      formClone.outputAmountUsd = ''
    }

    setForm(formClone)
    setFormError(formErrorClone)
  }

  const handleSwap = async () => {
    try {
      setTxHash(null)
      setTxError(null)

      const rawBase: RawTransactionEVM = {
        ...rawTransactionDeBridge?.tx,
        from: wallet?.address as `0x${string}`,
        value: BigInt(rawTransactionDeBridge?.tx.value || '0'),
        data: rawTransactionDeBridge?.tx.data || '0x',
        isTracking: true,
        callbackBefore: () => setIsSwapping(true),
        callbackSuccess: (hash?: any) => {
          setIsSwapping(false)
          setTxHash((hash as string) || null)
        },
        callbackError: (err?: any) => {
          setIsSwapping(false)
          setTxError((err?.message as string) || String(err))
        },
      }

      await WalletEvmUtil.sendTransaction(rawBase, wallet?.privateKey as any)

      // Reset form after successful swap
      setForm({
        inputAmount: '',
        outputAmount: '',
        inputAmountUsd: '',
        outputAmountUsd: '',
      })
    } catch (err: any) {
      setIsSwapping(false)
      setTxError(err?.message || String(err))
    }
  }



  const isFormValid = useMemo(() => {
    if (formError.inputAmount || formError.errorBalance) return false

    if (isInputNativeToken && totalFee) {
      if (BigNumber(inputToken?.balance_formatted || 0).isLessThanOrEqualTo(BigNumber(form.inputAmount || 0).plus(totalFee || 0))) {
        return false
      }
    } else {
      if (maxBalanceSwap && totalFee) {
        if (BigNumber(maxBalanceSwap).isLessThanOrEqualTo(totalFee || 0)) {
          return false
        }
      }
    }

    return inputToken && outputToken && form.inputAmount && BigNumber(form.inputAmount).isGreaterThan(0) && !formError.inputAmount && !isSwapping
  }, [inputToken, outputToken, form.inputAmount, formError, isSwapping, totalFee, isInputNativeToken, balanceNative])


  return (
    <KeyboardAvoiding>
      <HeaderScreen title={translate('swap.title')} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps='handled'
        automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
        bounces={false}
        style={{ flex: 1, padding: PADDING_DEFAULT.Padding16 }}
      >
        {/* Input Token Section */}
        <View style={styles.card}>
          <View style={{ flexDirection: 'row', marginBottom: 12, alignItems: 'center', justifyContent: 'space-between' }}>
            <ThemedText style={styles.sectionLabel}>{translate('common.from')}</ThemedText>

            {inputToken && (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <ThemedText style={styles.balanceText}>
                  {translate('common.balance')}:{' '}
                  {BigNumber(inputToken.balance_formatted || 0)
                    .decimalPlaces(6, BigNumber.ROUND_DOWN)
                    .toFormat()}
                </ThemedText>
                <TouchableOpacity style={styles.maxButton} onPress={handleMaxInput} disabled={isSwapping || !inputToken}>
                  <ThemedText style={styles.maxButtonText}>{translate('common.max')}</ThemedText>
                </TouchableOpacity>
              </View>
            )}
          </View>
          <View style={styles.topRow}>
            {/* Chain Selector (Read-only/Current) */}
            <TouchableOpacity style={styles.chainSelectorSmall} disabled={true}>
              {chainCurrent?.iconChain && <MyImage src={chainCurrent.iconChain} style={styles.chainIcon} />}
            </TouchableOpacity>

            {/* Token Selector */}
            <TouchableOpacity style={styles.tokenSelector} onPress={handleSelectInputToken} disabled={isSwapping}>
              {inputToken ? (
                <>
                  <MyImage src={inputToken.logo || inputToken.thumbnail} style={styles.tokenIcon} />
                  <ThemedText style={styles.tokenSymbol}>{inputToken.symbol}</ThemedText>
                </>
              ) : (
                <ThemedText style={styles.tokenSymbol}>{translate('swap.selectToken')}</ThemedText>
              )}
              <AntDesign name='down' size={12} color={text.color} />
            </TouchableOpacity>
          </View>

          {/* Input Amount */}
          <View style={styles.inputArea}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <ThemedInput
                placeholder='0.0'
                keyboardType='numeric'
                value={form.inputAmount}
                onChangeText={onChangeInputAmount}
                disabled={isSwapping || !inputToken}
                style={{ fontSize: 28, fontWeight: '700', paddingLeft: 0, paddingRight: 0 }}
                noBorder
                styleContentInput={{ paddingVertical: 0, paddingHorizontal: 0 }}
              />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <ThemedText style={styles.usdValue}>
                {form.inputAmountUsd && BigNumber(form.inputAmountUsd).isGreaterThan(0)
                  ? `≈ $${BigNumber(form.inputAmountUsd).decimalPlaces(4, BigNumber.ROUND_DOWN).toFormat()}`
                  : ''}
              </ThemedText>
            </View>
            {formError.inputAmount && (
              <ThemedText type='small' style={{ color: COLORS.red, marginTop: 5 }}>
                {formError.inputAmount}
              </ThemedText>
            )}
          </View>
        </View>

        {/* Swap Direction Button */}
        <View style={styles.swapDirectionContainer}>
          <TouchableOpacity style={styles.swapDirectionButton} onPress={handleSwapDirection} disabled={isSwapping}>
            <MaterialCommunityIcons name='swap-vertical' size={30} color={COLORS.whiteLight} />
          </TouchableOpacity>
        </View>

        {/* Output Token Section */}
        <View style={styles.card}>
          <ThemedText style={[styles.sectionLabel, { marginBottom: 12 }]}>{translate('common.to')}</ThemedText>
          <View style={styles.topRow}>
            {/* Output Chain Selector */}
            <TouchableOpacity style={styles.chainSelectorSmall} onPress={handleSelectOutputChain} disabled={isSwapping}>
              {outputChain?.iconChain && <MyImage src={outputChain.iconChain} style={styles.chainIcon} />}
              <ThemedText numberOfLines={1} type='small' style={{ marginLeft: 4 }}>
                {outputChain?.name}
              </ThemedText>
              <AntDesign name='down' size={12} color={text.color} style={{ marginLeft: 4 }} />
            </TouchableOpacity>

            {/* Token Selector */}
            <TouchableOpacity disabled={isSwapping || loadingListTokenByChain || loadingBalanceNative} style={styles.tokenSelector} onPress={handleSelectOutputToken} >
              {outputToken ? (
                <>
                  {
                    loadingListTokenByChain ? (
                      <View style={{ flex: 1 }}>
                        <MyLoading size={24} />
                      </View>
                    ) : (
                      <>
                        <MyImage src={outputToken.logo || outputToken.thumbnail} style={styles.tokenIcon} />
                        <ThemedText style={styles.tokenSymbol}>{outputToken.symbol}</ThemedText>
                      </>
                    )
                  }

                </>
              ) : (
                <ThemedText style={styles.tokenSymbol}>Select</ThemedText>
              )}
              <AntDesign name='down' size={12} color={text.color} />
            </TouchableOpacity>
          </View>

          {/* Output Amount */}
          <View style={styles.inputArea}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <ThemedInput
                placeholder='0.0'
                value={form.outputAmount}
                editable={false}
                disabled
                noBorder
                style={{ fontSize: 28, fontWeight: '700', paddingLeft: 0, paddingRight: 0 }}
                styleContentInput={{ paddingVertical: 0, paddingHorizontal: 0 }}
              />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <ThemedText style={styles.usdValue}>
                {form.outputAmountUsd && BigNumber(form.outputAmountUsd).isGreaterThan(0) ? `≈ $${BigNumber(form.outputAmountUsd).toFormat(2)}` : ''}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Swap Details */}
        {form.inputAmount && form.outputAmount && (
          <View style={styles.detailsCard}>
            <ThemedText type='defaultSemiBold' style={{ marginBottom: 12 }}>
              {translate('swap.swapDetails')}
            </ThemedText>

            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>{translate('swap.exchangeRate')}</ThemedText>
              <ThemedText style={styles.detailValue}>
                1 {inputToken?.symbol} ≈ {exchangeRate} {outputToken?.symbol}
              </ThemedText>
            </View>

            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>{translate('swap.priceImpact')}</ThemedText>
              <ThemedText style={[styles.detailValue, { color: COLORS.green600 }]}>{'<0.01%'}</ThemedText>
            </View>

            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>{translate('swap.minimumReceived')}</ThemedText>
              <ThemedText style={styles.detailValue}>
                {BigNumber(form.outputAmount).multipliedBy(0.995).decimalPlaces(6).toFixed()} {outputToken?.symbol}
              </ThemedText>
            </View>

            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>{translate('swap.networkFee')}</ThemedText>
              <ThemedText style={styles.detailValue}>
                {formError?.errorBalance ? (
                  <ThemedText style={{ color: COLORS.red, fontSize: 12 }}>{formError.errorBalance}</ThemedText>
                ) : (
                  <>
                    {totalFee && BigNumber(totalFee).toFixed(8)} {chainCurrent?.nativeCurrency?.symbol}
                  </>
                )}
              </ThemedText>
            </View>
          </View>
        )}

        {/* Swap Button */}
        <ThemeTouchableOpacity
          style={[styles.swapButton, !isFormValid && styles.swapButtonDisabled, { marginBottom: PADDING_DEFAULT.Padding16 }]}
          onPress={handleSwap}
          disabled={!isFormValid}
          loading={isSwapping || loadingRawTransactionDeBridge || isFetchingRawTransactionDeBridge}
        >
          <ThemedText style={[styles.swapButtonText, !isFormValid && styles.swapButtonTextDisabled]}>
            {isSwapping ? translate('swap.swapping') : translate('swap.swapButton')}
          </ThemedText>
        </ThemeTouchableOpacity>

        {/* Transaction Result */}
        {!!txHash && (
          <View style={styles.resultCard}>
            <ThemedText style={[styles.resultTitle, { color: isDark ? COLORS.green400 : COLORS.green700 }]}>{translate('swap.transactionSuccessful')}</ThemedText>
            <ThemedText allowFontScaling={false} selectable style={[styles.resultText, { color: isDark ? COLORS.green400 : COLORS.green800 }]}>
              {txHash}{' '}
              <TouchableOpacity onPress={() => copyToClipboard(txHash)}>
                <Ionicons name='copy-outline' size={16} color={isDark ? COLORS.green400 : COLORS.green800} />
              </TouchableOpacity>
              {!IsIos && <View style={{ width: '100%' }} />}
            </ThemedText>
          </View>
        )}

        {!!txError && (
          <View style={styles.errorCard}>
            <ThemedText style={[styles.resultTitle, { color: isDark ? COLORS.red400 : COLORS.red600 }]}>{translate('swap.transactionFailed')}</ThemedText>
            <ThemedText selectable style={[styles.resultText, { color: isDark ? COLORS.red600 : COLORS.red900 }]}>
              {getError(txError)}
            </ThemedText>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoiding>
  )
}

export default SwapScreen

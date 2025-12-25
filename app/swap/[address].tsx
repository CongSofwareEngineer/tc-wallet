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
import { cloneDeep, convertBalanceToWei, convertWeiToBalance, copyToClipboard, numberWithCommas, uppercase } from '@/utils/functions'
import { isTokenNative } from '@/utils/nvm'

import ItemChain from '@/components/ItemChain'
import MyLoading from '@/components/MyLoading'
import SelectToken from '@/components/SelectToken'
import ThemeTouchableOpacity from '@/components/UI/ThemeTouchableOpacity'
import { IsIos } from '@/constants/app'
import { LIST_TOKEN_DEFAULT } from '@/constants/debridge'
import { ERROR_TYPE } from '@/constants/erros'
import useGetRawDeBridge from '@/hooks/react-query/useGetRawDeBridge'
import useListTokenByChainDeBridge from '@/hooks/react-query/useListTokenByChainDeBridge'
import useDebounce from '@/hooks/useDebounce'
import EVMServices from '@/services/EVM'
import { height, width } from '@/utils/systems'
import WalletEvmUtil from '@/utils/walletEvm'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import SelectTokenOut from './Component/SelectTokenOut'
import createStyles from './styles'



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


  const [formError, setFormError] = useState<SwapFormError>({
    inputAmount: '',
    outputAmount: '',
    errorBalance: '',
  })

  const [inputToken, setInputToken] = useState<Token | undefined>(tokens?.[0] || undefined)
  const [outputToken, setOutputToken] = useState<Token | undefined>(undefined)
  const [outputChain, setOutputChain] = useState<Network | undefined>(chainCurrent || undefined)
  const [isSwapping, setIsSwapping] = useState(false)
  const [amountInputState, setAmountInputState] = useState('')
  const [slippage] = useState(1)
  const [txHash, setTxHash] = useState<string | null>(null)
  const [txError, setTxError] = useState<string | null>(null)

  const amountInput = useDebounce(amountInputState, 1000)

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
    amountIn: amountInput,
    slippage: slippage,
    tokenIn: inputToken,
    tokenOut: outputToken,
    chainIdOut: outputChain?.id,
  })


  const totalFee = useMemo(() => {
    if (rawTransactionDeBridge?.estimatedTransactionFee?.total) {
      const fee = convertWeiToBalance(rawTransactionDeBridge?.estimatedTransactionFee?.total)
      return BigNumber(fee).multipliedBy(1.5).decimalPlaces(18).toFixed()
    }
    return '0'
  }, [rawTransactionDeBridge])


  const maxBalanceSwap = useMemo(() => {
    if (isInputNativeToken) {
      const total = BigNumber(convertWeiToBalance(balanceNative || 0)).minus(totalFee)
      if (total.lte('0')) {
        return '0'
      }
      return total.decimalPlaces(7, BigNumber.ROUND_DOWN).toFixed()
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

  const amountOutput = useMemo(() => {
    if (outputToken && rawTransactionDeBridge?.amountOut) {
      return BigNumber(convertWeiToBalance(rawTransactionDeBridge.amountOut, outputToken.decimals)).decimalPlaces(6, BigNumber.ROUND_DOWN).toFixed()
    }
    return '0'
  }, [rawTransactionDeBridge, outputToken])

  const inputAmountUsd = useMemo(() => {
    if (!amountInputState || !inputTokenPrice || BigNumber(inputTokenPrice).isZero()) {
      return '0'
    }
    return BigNumber(amountInputState).multipliedBy(inputTokenPrice).toFixed(4)
  }, [amountInputState, inputTokenPrice])

  const outputAmountUsd = useMemo(() => {
    if (!amountOutput || !outputTokenPrice || BigNumber(outputTokenPrice).isZero()) {
      return '0'
    }
    return BigNumber(amountOutput).multipliedBy(outputTokenPrice).toFixed(4)
  }, [amountOutput, outputTokenPrice])


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
    setOutputToken(undefined)
    if (listTokenByChain?.length > 0) {
      const tokenOut = listTokenByChain.find((t) => (t.token_address || zeroAddress) === zeroAddress)
      if (tokenOut) {
        setOutputToken(tokenOut)
      }
    }
  }, [listTokenByChain, outputChain])

  useEffect(() => {
    if (errorRawTransactionDeBridge?.message) {
      setTxError(errorRawTransactionDeBridge?.message)
    }
  }, [errorRawTransactionDeBridge])


  // Update error balance state
  useEffect(() => {
    let errorBalance = ''
    if (isInputNativeToken) {
      if (totalFee) {
        const totalNeeded = BigNumber(amountInputState || 0).plus(totalFee)
        if (BigNumber(inputToken?.balance_formatted || 0).isLessThanOrEqualTo(totalNeeded)) {
          errorBalance = ERROR_TYPE.InsufficientFunds
        }
      }
    } else {
      if (BigNumber(convertWeiToBalance(balanceNative || 0)).isLessThan(totalFee)) {
        errorBalance = ERROR_TYPE.InsufficientFunds
      }
    }
    if (errorBalance !== formError.errorBalance) {
      setFormError((prev) => ({ ...prev, errorBalance }))
    }
  }, [totalFee, maxBalanceSwap, amountInputState, inputToken, isInputNativeToken, balanceNative])


  const handleSelectInputToken = () => {
    openSheet({
      content: (
        <SelectToken
          showAddress
          data={tokens}
          onPress={(token) => {
            setInputToken(token)
            setAmountInputState('')
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
        <View  >
          <ThemedText type='subtitle' style={{ marginBottom: 12 }}>
            {translate('swap.selectOutputChain')}
          </ThemedText>
          <ScrollView style={{ maxHeight: height(70) }}>
            {chainSupportSwap?.map((chain, index) => (
              <ItemChain
                noEdit
                chainId={outputChain?.id}
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
    const tempToken = inputToken
    setInputToken(outputToken)
    setOutputToken(tempToken)
    setAmountInputState(amountOutput)
  }

  const handleMaxInput = () => {
    if (!inputToken) return

    const maxAmount = BigNumber(maxBalanceSwap)
      .decimalPlaces(7, BigNumber.ROUND_DOWN)
      .toFixed()

    setAmountInputState(maxAmount)
  }

  const onChangeInputAmount = (value: string) => {
    const formErrorClone = cloneDeep(formError)
    setAmountInputState(value)
    formErrorClone.inputAmount = ''

    // Validate balance - check against maxBalanceSwap which accounts for gas fees
    if (inputToken && BigNumber(value || 0).isGreaterThan(maxBalanceSwap || 0)) {
      formErrorClone.inputAmount = ERROR_TYPE.InsufficientBalance
    }

    setFormError(formErrorClone)
  }

  const handleSwap = async () => {
    try {
      setTxHash(null)
      setTxError(null)

      const rawSwap: RawTransactionEVM = {
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
      if (!isInputNativeToken) {
        const isApprove = await EVMServices.checkIsApprove(outputChain?.id!, outputToken?.token_address!, rawTransactionDeBridge?.tx?.to!, convertBalanceToWei(amountInput, inputToken?.decimals))
        if (!isApprove) {
          const rawApprove: RawTransactionEVM = EVMServices.createApproveTransaction(outputToken?.token_address!, rawTransactionDeBridge?.tx?.to!, convertBalanceToWei(amountInput, inputToken?.decimals))
          rawApprove.isTracking = true
          await WalletEvmUtil.sendTransaction(rawApprove, wallet?.privateKey as any)
        }
      }
      await WalletEvmUtil.sendTransaction(rawSwap, wallet?.privateKey as any)


      // Reset form after successful swap
      setAmountInputState('')
    } catch (err: any) {
      setIsSwapping(false)
      setTxError(err?.message || String(err))
    }
  }



  const isFormValid = useMemo(() => {
    if (amountInput || formError.inputAmount || formError.errorBalance) return false

    if (isInputNativeToken && totalFee) {
      if (BigNumber(inputToken?.balance_formatted || 0).isLessThanOrEqualTo(BigNumber(amountInputState || 0).plus(totalFee || 0))) {
        return false
      }
    } else {
      if (maxBalanceSwap && totalFee) {
        if (BigNumber(maxBalanceSwap).isLessThanOrEqualTo(totalFee || 0)) {
          return false
        }
      }
    }

    return inputToken && outputToken && amountInput && BigNumber(amountInput).isGreaterThan(0) && !formError.inputAmount && !isSwapping
  }, [inputToken, outputToken, amountInput, formError, isSwapping, totalFee, isInputNativeToken, balanceNative])


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
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12, alignItems: 'center', justifyContent: 'space-between' }}>
            <View  >
              <ThemedText style={styles.sectionLabel}>{translate('common.from')}</ThemedText>
            </View>

            {inputToken && (
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'flex-end' }}>
                <ThemedText numberOfLines={1} style={[styles.balanceText]}>
                  {translate('common.balance')}:{' '}
                  {BigNumber(inputToken.balance_formatted || 0)
                    .decimalPlaces(7, BigNumber.ROUND_DOWN)
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
                  <ThemedText style={styles.tokenSymbol}>{uppercase(inputToken.symbol)}</ThemedText>
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
                value={amountInputState}
                onChangeText={onChangeInputAmount}
                disabled={isSwapping || !inputToken}
                style={{ fontSize: width(7), fontWeight: '700', paddingLeft: 0, paddingRight: 0 }}
                noBorder
                styleContentInput={{ paddingVertical: 0, paddingHorizontal: 0 }}
              />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
              <ThemedText >
                ${BigNumber(inputAmountUsd).decimalPlaces(4).toFormat()}
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
              {
                !outputToken ? (
                  <View style={{ flex: 1 }}>
                    <MyLoading size={24} />
                  </View>
                ) : (
                  <>
                    <MyImage src={outputToken.logo || outputToken.thumbnail} style={styles.tokenIcon} />
                    <ThemedText style={styles.tokenSymbol}>{uppercase(outputToken.symbol)}</ThemedText>
                  </>
                )
              }
              <AntDesign name='down' size={12} color={text.color} />
            </TouchableOpacity>
          </View>

          {/* Output Amount */}
          <View style={styles.inputArea}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <ThemedInput
                placeholder='0.0'
                value={numberWithCommas(amountOutput || '0')}
                editable={false}
                disabled
                noBorder
                style={{ fontSize: width(7), fontWeight: '700', paddingLeft: 0, paddingRight: 0 }}
                styleContentInput={{ paddingVertical: 0, paddingHorizontal: 0 }}
              />

            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
              <ThemedText style={styles.usdValue}>
                ${BigNumber(outputAmountUsd).decimalPlaces(4).toFormat()}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Swap Details */}
        {amountInputState && amountOutput && rawTransactionDeBridge && !loadingRawTransactionDeBridge && (
          <View style={styles.detailsCard}>
            <ThemedText type='defaultSemiBold' style={{ marginBottom: 12 }}>
              {translate('swap.swapDetails')}
            </ThemedText>

            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>{translate('swap.exchangeRate')}</ThemedText>
              <ThemedText style={styles.detailValue}>
                1 {inputToken?.symbol} ≈ {BigNumber(exchangeRate).toFormat()} {outputToken?.symbol}
              </ThemedText>
            </View>

            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>{translate('swap.priceImpact')}</ThemedText>
              <ThemedText style={[styles.detailValue, { color: COLORS.green600 }]}>{'<0.01%'}</ThemedText>
            </View>

            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>{translate('swap.minimumReceived')}</ThemedText>
              <ThemedText style={styles.detailValue}>
                {BigNumber(convertWeiToBalance(rawTransactionDeBridge?.minAmountOut, outputToken?.decimals)).decimalPlaces(6).toFormat()} {outputToken?.symbol}
              </ThemedText>
            </View>

            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>{translate('swap.networkFee')}</ThemedText>
              <ThemedText style={styles.detailValue}>
                {formError?.errorBalance ? (
                  <ThemedText style={{ color: COLORS.red, fontSize: 12 }}>{getError(formError.errorBalance)}</ThemedText>
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
                <Ionicons name='copy-outline' style={{ position: 'relative', top: width(1.3) }} size={16} color={isDark ? COLORS.green400 : COLORS.green800} />
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

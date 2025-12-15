import AntDesign from '@expo/vector-icons/AntDesign'
import BigNumber from 'bignumber.js'
import { useLocalSearchParams } from 'expo-router'
import React, { useEffect, useMemo, useState } from 'react'
import { Platform, ScrollView, TouchableOpacity, View } from 'react-native'
import { encodeFunctionData, erc20Abi } from 'viem'

import HeaderScreen from '@/components/Header'
import KeyboardAvoiding from '@/components/KeyboardAvoiding'
import MyImage from '@/components/MyImage'
import ThemedInput from '@/components/UI/ThemedInput'
import ThemedText from '@/components/UI/ThemedText'
import { COLORS, PADDING_DEFAULT } from '@/constants/style'
import useBalanceNative from '@/hooks/react-query/useBalanceNative'
import useBalanceToken from '@/hooks/react-query/useBalanceToken'
import useEstimateGas from '@/hooks/react-query/useEstimate'; // Note: Original file has typo 'useEastimse'
import useTokenPrice from '@/hooks/react-query/useTokenPrice'
import useChains from '@/hooks/useChains'
import useErrorWeb3 from '@/hooks/useErrorWeb3'
import useMode from '@/hooks/useMode'
import useSheet from '@/hooks/useSheet'
import useTheme from '@/hooks/useTheme'
import useWallets from '@/hooks/useWallets'
import { Token } from '@/services/moralis/type'
import { Network, RawTransactionEVM } from '@/types/web3'
import { cloneDeep, convertBalanceToWei } from '@/utils/functions'
import { isTokenNative } from '@/utils/nvm'

import ItemChain from '@/components/ItemChain'
import SelectToken from '@/components/SelectToken'
import ThemeTouchableOpacity from '@/components/UI/ThemeTouchableOpacity'
import { LIST_TOKEN_DEFAULT } from '@/constants/debridge'
import useGetRawDeBridge from '@/hooks/react-query/useGetRawDeBridge'
import { height } from '@/utils/systems'
import { MaterialCommunityIcons } from '@expo/vector-icons'
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
  const [slippage, setSlippage] = useState(0.75)

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

  const rawTransaction = useMemo(() => {
    if (inputToken && wallet && form.inputAmount) {
      // Mock raw transaction for gas estimation
      // In a real swap, this would call the DEX aggregator API to get the transaction data
      const amountStr = convertBalanceToWei(form.inputAmount, inputToken.decimals)

      const raw: RawTransactionEVM = {
        from: wallet?.address as `0x${string}`,
        to: wallet.address as `0x${string}`, // Self-transfer as placeholder/mock
        data: '0x',
        value: 0n,
      }

      if (isInputNativeToken) {
        raw.value = BigInt(amountStr || 0)
      } else {
        const decode = encodeFunctionData({
          abi: erc20Abi,
          functionName: 'transfer',
          args: [wallet.address as `0x${string}`, BigInt(amountStr || 0)],
        })
        raw.data = decode
        raw.to = inputToken.token_address as `0x${string}`
      }
      return raw
    }
    return null
  }, [inputToken, wallet, form.inputAmount, isInputNativeToken])

  const { data: balanceNative } = useBalanceNative()
  const { data: estimatedGas, isLoading: loadingEstimatedGas } = useEstimateGas(rawTransaction)
  const { data: inputTokenPrice } = useTokenPrice(isInputNativeToken ? inputToken?.symbol : inputToken?.token_address)
  const { data: outputTokenPrice } = useTokenPrice(isOutputNativeToken ? outputToken?.symbol : outputToken?.token_address)
  const { data: rawTransactionDeBridge, isLoading: loadingRawTransactionDeBridge, error: errorRawTransactionDeBridge } = useGetRawDeBridge({
    amountIn: form.inputAmount,
    slippage: slippage,
    tokenIn: inputToken,
    tokenOut: outputToken,
    chainIdOut: outputChain?.id,
  })
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


  // Update error balance state
  useEffect(() => {
    let errorBalance = ''
    if (isInputNativeToken && estimatedGas?.totalFee) {
      const totalNeeded = BigNumber(form.inputAmount || 0).plus(estimatedGas.totalFee)
      if (BigNumber(inputToken?.balance_formatted || 0).isLessThan(totalNeeded)) {
        errorBalance = 'Insufficient balance for amount + gas'
      }
    } else if (balanceNative && estimatedGas?.totalFee) {
      if (BigNumber(balanceNative).isLessThan(estimatedGas.totalFee)) {
        errorBalance = 'Insufficient native balance for gas'
      }
    }

    if (errorBalance !== formError.errorBalance) {
      setFormError((prev) => ({ ...prev, errorBalance }))
    }
  }, [estimatedGas, form.inputAmount, inputToken, isInputNativeToken, balanceNative])


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
            Select Output Chain
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

    const maxAmount = BigNumber(inputToken.balance_formatted || '0')
      .minus(isInputNativeToken ? estimatedGas?.totalFee || 0 : 0)
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

    // Validate balance
    if (inputToken && BigNumber(value || 0).isGreaterThan(inputToken.balance_formatted || 0)) {
      formErrorClone.inputAmount = 'Insufficient balance'
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
    // TODO: Implement actual swap logic with DEX integration
    setIsSwapping(true)
    setTimeout(() => {
      setIsSwapping(false)
      // Reset form after swap
      setForm({
        inputAmount: '',
        outputAmount: '',
        inputAmountUsd: '',
        outputAmountUsd: '',
      })
    }, 2000)
  }



  const isFormValid = useMemo(() => {
    if (loadingEstimatedGas) return false
    if (formError.inputAmount || formError.errorBalance) return false

    if (isInputNativeToken && estimatedGas?.totalFee) {
      if (BigNumber(inputToken?.balance_formatted || 0).isLessThanOrEqualTo(BigNumber(form.inputAmount || 0).plus(estimatedGas?.totalFee || 0))) {
        return false
      }
    } else {
      if (balanceNative && estimatedGas?.totalFee) {
        if (BigNumber(balanceNative).isLessThanOrEqualTo(estimatedGas?.totalFee || 0)) {
          return false
        }
      }
    }

    return inputToken && outputToken && form.inputAmount && BigNumber(form.inputAmount).isGreaterThan(0) && !formError.inputAmount && !isSwapping
  }, [inputToken, outputToken, form.inputAmount, formError, isSwapping, loadingEstimatedGas, estimatedGas, isInputNativeToken, balanceNative])


  return (
    <KeyboardAvoiding>
      <HeaderScreen title='Swap' />
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
            <ThemedText style={styles.sectionLabel}>From</ThemedText>

            {inputToken && (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <ThemedText style={styles.balanceText}>
                  Balance:{' '}
                  {BigNumber(inputToken.balance_formatted || 0)
                    .decimalPlaces(6, BigNumber.ROUND_DOWN)
                    .toFormat()}
                </ThemedText>
                <TouchableOpacity style={styles.maxButton} onPress={handleMaxInput} disabled={isSwapping || !inputToken}>
                  <ThemedText style={styles.maxButtonText}>MAX</ThemedText>
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
                <ThemedText style={styles.tokenSymbol}>Select</ThemedText>
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
          <ThemedText style={[styles.sectionLabel, { marginBottom: 12 }]}>To</ThemedText>
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
            <TouchableOpacity style={styles.tokenSelector} onPress={handleSelectOutputToken} disabled={isSwapping}>
              {outputToken ? (
                <>
                  <MyImage src={outputToken.logo || outputToken.thumbnail} style={styles.tokenIcon} />
                  <ThemedText style={styles.tokenSymbol}>{outputToken.symbol}</ThemedText>
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
                disabled={true}
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
              Swap Details
            </ThemedText>

            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Exchange Rate</ThemedText>
              <ThemedText style={styles.detailValue}>
                1 {inputToken?.symbol} ≈ {exchangeRate} {outputToken?.symbol}
              </ThemedText>
            </View>

            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Price Impact</ThemedText>
              <ThemedText style={[styles.detailValue, { color: COLORS.green600 }]}>{'<0.01%'}</ThemedText>
            </View>

            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Minimum Received</ThemedText>
              <ThemedText style={styles.detailValue}>
                {BigNumber(form.outputAmount).multipliedBy(0.995).decimalPlaces(6).toFixed()} {outputToken?.symbol}
              </ThemedText>
            </View>

            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Network Fee</ThemedText>
              <ThemedText style={styles.detailValue}>
                {loadingEstimatedGas ? (
                  'Calculating...'
                ) : formError?.errorBalance ? (
                  <ThemedText style={{ color: COLORS.red, fontSize: 12 }}>{formError.errorBalance}</ThemedText>
                ) : (
                  <>
                    {estimatedGas?.totalFee && BigNumber(estimatedGas.totalFee).toFixed(8)} {chainCurrent?.nativeCurrency?.symbol}
                    {estimatedGas?.error && <ThemedText style={{ color: COLORS.red, fontSize: 12 }}> {getError(estimatedGas.error)}</ThemedText>}
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
        >
          <ThemedText style={[styles.swapButtonText, !isFormValid && styles.swapButtonTextDisabled]}>
            {isSwapping ? 'Swapping...' : 'Swap'}
          </ThemedText>
        </ThemeTouchableOpacity>
      </ScrollView>
    </KeyboardAvoiding>
  )
}

export default SwapScreen

import AntDesign from '@expo/vector-icons/AntDesign'
import { Image } from 'expo-image'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useMemo, useState } from 'react'
import { Platform, ScrollView, TouchableOpacity, View } from 'react-native'
import { encodeFunctionData, erc1155Abi, erc721Abi } from 'viem'

import HeaderScreen from '@/components/Header'
import KeyboardAvoiding from '@/components/KeyboardAvoiding'
import QrScan from '@/components/QrScan'
import ThemedText from '@/components/UI/ThemedText'
import { COLORS } from '@/constants/style'
import useEstimateGas from '@/hooks/react-query/useEastimse'
import useChains from '@/hooks/useChains'
import useErrorWeb3 from '@/hooks/useErrorWeb3'
import useMode from '@/hooks/useMode'
import useSheet from '@/hooks/useSheet'
import useTheme from '@/hooks/useTheme'
import useWallets from '@/hooks/useWallets'
import { RawTransactionEVM } from '@/types/web3'
import { copyToClipboard, ellipsisText, getRadomColor } from '@/utils/functions'
import { isAddress } from '@/utils/nvm'
import { width } from '@/utils/systems'
import WalletEvmUtil from '@/utils/walletEvm'

import { IsIos } from '@/constants/app'
import useNFTDetail from '@/hooks/react-query/useNFTDetail'
import BigNumber from 'bignumber.js'
import ImageMain from '../nft-detail/ImageMain'
import InputEnter from '../send-token/Component/InputEnter'
import { createStyles } from './styles'



type FormSendNFT = {
  toAddress: string
  amount: string // For ERC-1155
}

type FormErrorSendNFT = {
  errorBalance: string
  amount: string
} & FormSendNFT

const SendNFTScreen = () => {
  const router = useRouter()
  const { param } = useLocalSearchParams<{ param: string[] }>()
  const [nftAddress, nftId] = param

  const { isDark } = useMode()
  const { text, colorIcon } = useTheme()
  const styles = createStyles(isDark)
  const { chainCurrent } = useChains()
  const { getError } = useErrorWeb3()
  const { wallet, wallets, indexWalletActive } = useWallets()
  const { openSheet, closeSheet } = useSheet()
  const { data: nftData, isLoading } = useNFTDetail(nftAddress, nftId)
  const metadata = nftData?.normalized_metadata

  const [form, setForm] = useState<FormSendNFT>({
    toAddress: '',
    amount: '1', // Default amount for ERC-1155
  })

  const [formError, setFormError] = useState<FormErrorSendNFT>({
    errorBalance: '',
    toAddress: '',
    amount: '',
  })

  const [isSending, setIsSending] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)
  const [txError, setTxError] = useState<string | null>(null)

  const isERC1155 = useMemo(() => {
    return nftData?.contract_type === 'ERC1155'
  }, [nftData?.contract_type])

  const rawTransaction = useMemo(() => {
    if (nftAddress && nftId && wallet && wallet.address) {
      try {
        let data: `0x${string}`

        if (isERC1155) {
          // ERC-1155: safeTransferFrom(from, to, id, amount, data)
          data = encodeFunctionData({
            abi: erc1155Abi,
            functionName: 'safeTransferFrom',
            args: [
              wallet.address as `0x${string}`,
              wallet.address as `0x${string}`,
              BigInt(nftId),
              BigInt(nftData?.amount || '1'),
              '0x' as `0x${string}`, // Empty data
            ],
          })
        } else {
          // ERC-721: safeTransferFrom(from, to, tokenId)
          data = encodeFunctionData({
            abi: erc721Abi,
            functionName: 'transferFrom',
            args: [wallet.address as `0x${string}`, wallet.address as `0x${string}`, BigInt(nftId)],
          })
        }

        const raw: RawTransactionEVM = {
          from: wallet?.address as `0x${string}`,
          to: nftAddress as `0x${string}`,
          data: data,
          value: 0n,
        }
        return raw
      } catch (error) {
        console.error('Error encoding function data:', error)
        return null
      }
    }
    return null
  }, [nftAddress, nftId, wallet, form.toAddress, form.amount, isERC1155])

  const { data: estimatedGas, isLoading: loadingEstimatedGas, refetch: refetchEstimatedGas } = useEstimateGas(rawTransaction)
  console.log({ isERC1155, estimatedGas, rawTransaction, nftData });

  const isErrorForm = useMemo(() => {
    if (loadingEstimatedGas) {
      return true
    }
    if (formError.toAddress) {
      return true
    }
    if (isERC1155 && formError.amount) {
      return true
    }
    if (estimatedGas?.error) {
      return true
    }
    return false
  }, [estimatedGas, loadingEstimatedGas, formError, isERC1155])

  const handlePickFromMyAccounts = () => {
    openSheet({
      isOpen: true,
      content: (
        <View>
          <ThemedText type='subtitle' style={{ marginBottom: 12 }}>
            Chọn địa chỉ từ ví của tôi
          </ThemedText>

          <ScrollView style={{ maxHeight: 420 }}>
            {[...wallets].map((w, index) => (
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
        height: width(100) + 200,
      },
      position: 'center',
      content: (
        <QrScan
          type='address'
          onScanned={(e) => {
            onChangeForm({ toAddress: e as string })
          }}
        />
      ),
    })
  }

  const handleSend = async () => {
    try {
      setTxHash(null)
      setTxError(null)
      if (!wallet || !nftAddress || !nftId || !form?.toAddress) return

      let data: `0x${string}`

      if (isERC1155) {
        // ERC-1155: safeTransferFrom(from, to, id, amount, data)
        data = encodeFunctionData({
          abi: erc1155Abi,
          functionName: 'safeTransferFrom',
          args: [
            wallet.address as `0x${string}`,
            form.toAddress as `0x${string}`,
            BigInt(nftId),
            BigInt(form.amount || '1'),
            '0x' as `0x${string}`, // Empty data
          ],
        })
      } else {
        // ERC-721: safeTransferFrom(from, to, tokenId)
        data = encodeFunctionData({
          abi: erc721Abi,
          functionName: 'safeTransferFrom',
          args: [wallet.address as `0x${string}`, form.toAddress as `0x${string}`, BigInt(nftId)],
        })
      }

      const rawBase: RawTransactionEVM = {
        from: wallet.address as any,
        to: nftAddress as any,
        data: data,
        chainId: (chainCurrent?.id as any) ?? 1,
        isTracking: true,
        callbackBefore: () => setIsSending(true),
        callbackSuccess: (hash?: any) => {
          setIsSending(false)
          setTxHash((hash || null) as string)
          refetchEstimatedGas()
        },
        callbackError: (err?: any) => {
          setIsSending(false)
          setTxError(getError(err))
        },
      }

      await WalletEvmUtil.sendTransaction(rawBase, wallet.privateKey as any)
      onChangeForm({ toAddress: '', amount: '1' })
    } catch (err: any) {
      setIsSending(false)
      setTxError(getError(err))
    }
  }

  const onChangeForm = (param: Partial<FormSendNFT>) => {
    const formClone = { ...form }
    const formErrorClone = { ...formError }

    if (typeof param.toAddress !== 'undefined') {
      formErrorClone.toAddress = ''
      formClone.toAddress = param.toAddress
      if (!isAddress(param.toAddress)) {
        formErrorClone.toAddress = 'Địa chỉ không hợp lệ'
      }
    }

    if (typeof param.amount !== 'undefined') {
      formErrorClone.amount = ''
      formClone.amount = param.amount.replace(/[^0-9]/g, '') // Only allow numbers

      if (isERC1155 && formClone.amount) {
        const amountNum = parseInt(formClone.amount)
        const availableNum = parseInt(nftData?.amount || '1')

        if (amountNum > availableNum) {
          formErrorClone.amount = `Số lượng tối đa: ${availableNum}`
        }
        if (amountNum <= 0) {
          formErrorClone.amount = 'Số lượng phải lớn hơn 0'
        }
      }
    }

    setForm(formClone)
    setFormError(formErrorClone)
  }

  return (
    <KeyboardAvoiding>
      <HeaderScreen title='Send NFT' />
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps='handled'
        automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
        bounces={false}
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
      >
        {/* NFT Preview Card */}
        <View style={styles.card}>

          <View style={styles.nftPreviewContainer}>
            <View style={styles.nftImage}>
              <ImageMain nft={nftData} />
            </View>
            <View style={styles.nftDetails}>
              <ThemedText numberOfLines={1} style={styles.nftName}>{metadata?.name}</ThemedText>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <ThemedText style={styles.nftType}>{nftData?.contract_type}</ThemedText>
                <ThemedText style={[styles.nftType, { color: COLORS.green }]}>x{nftData?.amount}</ThemedText>
              </View>
              <ThemedText style={styles.nftTokenId}>Token ID: {nftData?.token_id}</ThemedText>
              <ThemedText style={styles.nftContract} numberOfLines={1}>
                {ellipsisText(nftData?.token_address || '', 8, 8)}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* From Wallet Section */}
        <View style={styles.card}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <ThemedText style={styles.sectionLabel}>FROM</ThemedText>
            <TouchableOpacity
              style={[styles.sendButton, (!form?.toAddress || isSending || isErrorForm) && styles.sendButtonDisabled]}
              disabled={isErrorForm}
              onPress={handleSend}
            >
              <ThemedText style={[styles.sendButtonText, (!form?.toAddress || isSending || isErrorForm) && styles.sendButtonTextDisabled]}>
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
        </View>

        {/* To Address Section */}
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <ThemedText style={styles.sectionLabel}>TO</ThemedText>
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
              disabled={isSending}
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

        {/* Amount Section - Only for ERC-1155 */}
        {isERC1155 && (
          <View>
            <ThemedText style={styles.sectionLabel}>Amount</ThemedText>
            <View style={[styles.inputContainer]}>
              <InputEnter
                disabled={isSending}
                placeholder='1'
                keyboardType='numeric'
                value={form.amount}
                onChangeText={(text: string) => {
                  onChangeForm({ amount: text })
                }}
              />
            </View>
            {formError?.amount ? (
              <ThemedText type='small' style={{ color: COLORS.red, marginTop: 5 }}>
                {formError.amount}
              </ThemedText>
            ) : (
              <ThemedText type='small' style={{ color: isDark ? '#9CA3AF' : '#6B7280', marginTop: 5 }}>
                Available: {nftData?.amount}
              </ThemedText>
            )}
          </View>
        )}

        {/* Network Fee */}
        <View style={styles.feeCard}>
          <View style={styles.feeRow}>
            <ThemedText style={styles.feeLabel}>Network Fee</ThemedText>
            <ThemedText style={styles.feeValue}>
              {loadingEstimatedGas && 'Calculating...'}

              {formError?.errorBalance ? (
                `${formError?.errorBalance} ${chainCurrent?.nativeCurrency.symbol}`
              ) : (
                <>
                  {estimatedGas?.totalFee && `${BigNumber(estimatedGas.totalFee).toFixed(8)} `}
                  {estimatedGas?.error && getError(estimatedGas.error)} {!loadingEstimatedGas && chainCurrent?.nativeCurrency.symbol}
                </>
              )}
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

export default SendNFTScreen

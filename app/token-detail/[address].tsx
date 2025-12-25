import AntDesign from '@expo/vector-icons/AntDesign'
import Feather from '@expo/vector-icons/Feather'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import BigNumber from 'bignumber.js'
import { Image } from 'expo-image'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useMemo } from 'react'
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { zeroAddress } from 'viem'

import HeaderScreen from '@/components/Header'
import { IsAndroid } from '@/constants/app'
import { COLORS, PADDING_DEFAULT } from '@/constants/style'
import useBalanceToken from '@/hooks/react-query/useBalanceToken'
import useChains from '@/hooks/useChains'
import useLanguage from '@/hooks/useLanguage'
import useSheet from '@/hooks/useSheet'
import useTheme from '@/hooks/useTheme'
import { copyToClipboard, ellipsisText } from '@/utils/functions'
import { isTokenNative } from '@/utils/nvm'
import { Ionicons } from '@expo/vector-icons'

const TokenDetailScreen = () => {
  const { address } = useLocalSearchParams<{ address: string }>()
  const { data: listTokens } = useBalanceToken(true)
  const { text } = useTheme()
  const { translate } = useLanguage()
  const router = useRouter()
  const { openSheet } = useSheet()

  const tokenCurrent = useMemo(() => {
    return listTokens?.find((i) => i.token_address.toLowerCase() === address.toLowerCase()) || listTokens?.[0]
  }, [listTokens, address])

  const priceChange = tokenCurrent?.usd_price_24hr_percent_change || 0
  const priceChangeColor = priceChange >= 0 ? '#00D09C' : '#FF4D4D'

  const handleCopy = async () => {
    const tokenAddress = isTokenNative(tokenCurrent.token_address) ? zeroAddress : tokenCurrent.token_address

    copyToClipboard(tokenAddress, true)
  }

  const { chainCurrent } = useChains()

  const handleOpenExplorer = async () => {
    const tokenAddress = isTokenNative(tokenCurrent.token_address) ? zeroAddress : tokenCurrent.token_address
    const explorerUrl = `${chainCurrent?.blockExplorers?.default.url}/address/${tokenAddress}`

    await Linking.openURL(explorerUrl)
  }

  const handleSend = () => {
    router.dismiss()
    router.push(`/send-token/${tokenCurrent.token_address}`)
  }

  const handleReceive = () => {
    router.dismiss()
    router.push(`/qr-info-address`)
  }

  const handleSwap = () => {
    router.dismiss()
    router.push(`/swap/${tokenCurrent.token_address}`)
  }

  if (!tokenCurrent) {
    return <></>
  }

  return (
    <View style={[styles.container, !IsAndroid && { flex: 1 }]}>
      <HeaderScreen title={translate('tokenDetail.title')} />
      <View
        style={{
          padding: PADDING_DEFAULT.Padding16,
        }}
      >
        {/* Token Image & Name */}
        <View style={[styles.header, { marginTop: 16 }]}>
          <Image source={{ uri: tokenCurrent?.logo }} style={styles.tokenImage} />
          <View style={{ marginLeft: 16 }}>
            <Text style={styles.tokenName}>{tokenCurrent.name}</Text>
            <View style={styles.verifiedRow}>
              <Text style={styles.tokenSymbol}>{tokenCurrent.symbol}</Text>
              {tokenCurrent.verified_contract && (
                <View style={styles.verifiedBadge}>
                  <AntDesign name='check-circle' size={14} color='#00D09C' />
                  <Text style={styles.verifiedText}>{translate('tokenDetail.verified')}</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Token Address with Copy */}
        <View style={styles.addressContainer}>
          <Feather name='hash' size={18} color='#aaa' style={styles.infoIcon} />
          <View style={styles.addressInner}>
            <Text style={styles.addressText}>
              {ellipsisText(isTokenNative(tokenCurrent.token_address) ? zeroAddress : tokenCurrent.token_address, 8, 12)}
            </Text>
            <TouchableOpacity onPress={handleCopy} style={styles.copyButton}>
              <Ionicons name='copy-outline' size={16} color={COLORS.green600} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Balance & Value */}
        <View style={styles.infoRow}>
          <Feather name='dollar-sign' size={18} color='#aaa' style={styles.infoIcon} />
          <Text style={styles.balanceText}>
            {BigNumber(tokenCurrent.balance_formatted || '0')
              .decimalPlaces(8, BigNumber.ROUND_DOWN)
              .toFormat()}{' '}
            {tokenCurrent.symbol}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Feather name='credit-card' size={18} color='#aaa' style={styles.infoIcon} />
          <Text style={styles.usdValueText}>${tokenCurrent.usd_value.toFixed(2)}</Text>
        </View>

        {/* Price & Change */}
        <View style={styles.infoRow}>
          <Feather name='trending-up' size={18} color='#aaa' style={styles.infoIcon} />
          <Text style={styles.priceText}>${BigNumber(tokenCurrent.usd_price).decimalPlaces(2).toFormat()}</Text>
          <Text style={[styles.priceChangeText, { color: priceChangeColor, marginLeft: 8 }]}>
            {priceChange >= 0 ? '+' : ''}
            {priceChange.toFixed(2)}%
          </Text>
        </View>

        {/* Extra Info */}
        <View style={styles.extraInfoColumn}>
          <View style={styles.extraInfoItem}>
            <View style={styles.extraInfoRow}>
              <Feather name='hash' size={15} color='#aaa' style={styles.infoIcon} />
              <Text style={styles.extraInfoLabel}>{translate('tokenDetail.decimals')}</Text>
            </View>
            <Text style={styles.extraInfoValue}>{tokenCurrent.decimals}</Text>
          </View>

          {tokenCurrent.security_score !== undefined && (
            <View style={styles.extraInfoItem}>
              <View style={styles.extraInfoRow}>
                <AntDesign name='safety' size={15} color='#aaa' style={styles.infoIcon} />
                <Text style={styles.extraInfoLabel}>{translate('tokenDetail.securityScore')}</Text>
              </View>
              <Text style={styles.extraInfoValue}>{tokenCurrent.security_score || 0}</Text>
            </View>
          )}

          <View style={styles.extraInfoItem}>
            <View style={styles.extraInfoRow}>
              <MaterialIcons name='all-inclusive' size={15} color='#aaa' style={styles.infoIcon} />
              <Text style={styles.extraInfoLabel}>{translate('tokenDetail.totalSupply')}</Text>
            </View>
            {tokenCurrent.total_supply_formatted ? (
              <Text style={styles.extraInfoValue}>{BigNumber(tokenCurrent.total_supply_formatted).toFormat()}</Text>
            ) : (
              <Text style={styles.extraInfoValue}>
                <MaterialIcons name='all-inclusive' size={16} color={text.color} style={styles.infoIcon} />
              </Text>
            )}
          </View>
        </View>

        {/* Action Buttons - Circular with Icon */}
        <View style={styles.buttonRow}>
          <TouchableOpacity onPress={handleSend} style={styles.circleButton}>
            <Feather name='send' size={20} color={COLORS.green600} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleReceive} style={styles.circleButton}>
            <Feather name='download' size={20} color={COLORS.green600} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSwap} style={styles.circleButton}>
            <MaterialIcons name='swap-horiz' size={22} color={COLORS.green600} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.circleButton} onPress={handleOpenExplorer}>
            <Feather name='external-link' size={20} color={COLORS.green600} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  addressInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoIcon: {
    marginRight: 4,
  },
  container: {
    // flex: 1,
    backgroundColor: '#181A20',
    paddingTop: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  tokenImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#222',
  },
  tokenName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  tokenSymbol: {
    fontSize: 16,
    color: '#aaa',
    marginTop: 2,
  },
  balanceSection: {
    marginBottom: 12,
  },
  balanceText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
  },
  usdValueText: {
    fontSize: 16,
    color: '#aaa',
    marginTop: 2,
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  priceText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '500',
  },
  priceChangeText: {
    fontSize: 16,
    marginLeft: 10,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    gap: 24,
  },
  circleButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  addressText: {
    color: '#aaa',
    fontSize: 13,
    flex: 1,
  },
  copyButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a2',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  verifiedText: {
    color: '#00D09C',
    fontSize: 12,
    marginLeft: 3,
    fontWeight: '600',
  },
  extraInfoColumn: {
    gap: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  extraInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  extraInfoItem: {
    gap: 4,
  },
  extraInfoLabel: {
    color: '#aaa',
    fontSize: 13,
  },
  extraInfoValue: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 24,
  },
})

export default TokenDetailScreen

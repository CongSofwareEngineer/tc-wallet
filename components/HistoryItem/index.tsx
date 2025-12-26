import MyImage from '@/components/MyImage'
import ThemedText from '@/components/UI/ThemedText'
import { COLORS } from '@/constants/style'
import useMode from '@/hooks/useMode'
import useWallets from '@/hooks/useWallets'
import { History } from '@/services/moralis/type'
import { detectUrlImage, ellipsisText, uppercase } from '@/utils/functions'
import { Feather } from '@expo/vector-icons'
import moment from 'moment'
import React, { useMemo } from 'react'
import { View } from 'react-native'
import { getStyles } from './styles'

type Props = {
  item: History
}

const HistoryItem = ({ item }: Props) => {
  const { wallet } = useWallets()
  const { mode, isDark } = useMode()
  const styles = useMemo(() => getStyles(mode, isDark), [mode, isDark])

  const nftTransfers = item.nft_transfers || []
  const erc20Transfers = item.erc20_transfers || []
  const nativeTransfers = item.native_transfers || []

  const isNFT = nftTransfers.length > 0
  const isERC20 = erc20Transfers.length > 0
  const isNative = nativeTransfers.length > 0

  const data = useMemo(() => {
    const types: string[] = []
    if (isNFT) types.push('NFT')
    if (isERC20) types.push('Token')
    if (isNative) types.push('Native')

    // Determine primary transfer for image and direction
    let primaryImage: string | null = null
    let primaryDirection: 'incoming' | 'outgoing' = 'outgoing'
    let summaryTitle = ''
    let valueSummary = ''

    if (isNFT) {
      const nft = nftTransfers[0]
      let image = nft.collection_logo
      try {
        if (nft.normalized_metadata) {
          const metadata = typeof nft.normalized_metadata === 'string' ? JSON.parse(nft.normalized_metadata) : nft.normalized_metadata
          image = metadata?.image || metadata?.image_url || image
        }
      } catch (error) { }
      primaryImage = detectUrlImage(image)
      primaryDirection = nft.direction
      summaryTitle = nft.token_name || 'NFT Transfer'
      valueSummary = `${nft.amount} ${uppercase(nft.token_symbol)}`
    } else if (isERC20) {
      const token = erc20Transfers[0]
      primaryImage = token.token_logo
      primaryDirection = token.to_address.toLowerCase() === wallet?.address?.toLowerCase() ? 'incoming' : 'outgoing'
      summaryTitle = token.token_name || 'Token Transfer'
      valueSummary = `${token.value_formatted} ${uppercase(token.token_symbol)}`
    } else if (isNative) {
      const native = nativeTransfers[0]
      primaryImage = native.token_logo
      primaryDirection = native.direction
      summaryTitle = 'Native Transfer'
      valueSummary = `${native.value_formatted} ${uppercase(native.token_symbol)}`
    }

    // Adjust title and value if mixed
    if (types.length > 1) {
      summaryTitle = types.join(' & ') + ' Transfer'
      // If mixed, valueSummary can just show primary or a "Multiple" indicator
      // To keep it clean, we'll keep the primary value but the title indicates more
      if (types.length > 1) {
        const extraCount = (nftTransfers.length + erc20Transfers.length + nativeTransfers.length) - 1
        if (extraCount > 0) {
          valueSummary += ` (+${extraCount})`
        }
      }
    }

    return {
      title: summaryTitle || item.summary || item.method_label || 'Transaction',
      subtitle: ellipsisText(item.hash, 6, 6),
      value: valueSummary,
      image: primaryImage,
      direction: primaryDirection,
    }
  }, [item, isNFT, isERC20, isNative, wallet?.address, nftTransfers, erc20Transfers, nativeTransfers])

  const isIncoming = data.direction === 'incoming'

  return (
    <View style={styles.historyItem}>
      <View style={styles.iconContainer}>
        {data.image ? (
          <MyImage
            src={data.image}
            style={isNFT ? styles.nftImage : { width: 32, height: 32, borderRadius: 16 }}
            contentFit={isNFT ? 'cover' : 'contain'}
          />
        ) : (
          <Feather name={isIncoming ? 'arrow-down-left' : 'arrow-up-right'} size={24} color={isIncoming ? COLORS.green400 : COLORS.red400} />
        )}
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.titleContainer}>
          <ThemedText style={styles.title} numberOfLines={1}>
            {data.title}
          </ThemedText>
          <ThemedText style={[styles.value, { color: isIncoming ? COLORS.green400 : COLORS.red400 }]}>
            {isIncoming ? '+' : '-'}
            {data.value}
          </ThemedText>
        </View>

        <View style={styles.subInfoContainer}>
          <ThemedText style={styles.subtitle}>{moment(item.block_timestamp).format('DD MMM YYYY, HH:mm')}</ThemedText>
          <View style={styles.statusContainer}>
            <Feather name={isIncoming ? 'arrow-down-left' : 'arrow-up-right'} size={12} color={isIncoming ? COLORS.green400 : COLORS.red400} />
            <ThemedText style={[styles.statusText, { color: isIncoming ? COLORS.green400 : COLORS.red400 }]}>{isIncoming ? 'In' : 'Out'}</ThemedText>
          </View>
        </View>
      </View>
    </View>
  )
}

export default HistoryItem

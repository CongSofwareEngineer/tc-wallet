import { MaterialIcons } from '@expo/vector-icons'
import BigNumber from 'bignumber.js'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import React from 'react'
import { Animated, TouchableOpacity, View } from 'react-native'

import ThemedText from '@/components/UI/ThemedText'
import useBalanceToken from '@/hooks/react-query/useBalanceToken'
import useTheme from '@/hooks/useTheme'
import { Token } from '@/services/moralis/type'

import { styles } from '../../styles'
import AnimateFlatList from '../AnimateFlatList'

type Props = {
  scrollY: Animated.Value
  headerHeight: number
}

const Tokens = ({ scrollY, headerHeight }: Props) => {
  const { text } = useTheme()
  const router = useRouter()

  const { data, isLoading, refetch, isRefetching } = useBalanceToken()
  console.log({ data })

  const renderCryptoItem = ({ item }: { item: Token }) => (
    <TouchableOpacity
      onPress={() => {
        router.push(`/token-detail/${item.token_address}`)
      }}
      style={styles.cryptoItem}
    >
      <View style={[styles.cryptoIcon]}>
        {item.logo || item.thumbnail ? (
          <Image source={{ uri: item.logo || item.thumbnail }} style={{ width: 36, height: 36 }} />
        ) : (
          // item.symbol
          <MaterialIcons name='token' size={40} color={text.color} />
          // <AntDesign name='tik-tok' size={40} color='#FFFFFF' />
        )}
      </View>

      <View style={styles.cryptoInfo}>
        <ThemedText style={[styles.cryptoName]} numberOfLines={1} ellipsizeMode='tail'>
          {item.name}
        </ThemedText>
        <ThemedText style={styles.cryptoBalance}>
          {BigNumber(item.balance_formatted).decimalPlaces(6, BigNumber.ROUND_DOWN).toFormat()} {item.symbol}
        </ThemedText>
      </View>

      <View style={{ alignItems: 'flex-end' }}>
        <ThemedText style={styles.cryptoBalance}>{BigNumber(item.usd_value).decimalPlaces(4, BigNumber.ROUND_DOWN).toFormat()}$</ThemedText>
        <ThemedText style={[styles.cryptoChange, { color: item.usd_price_24hr_percent_change >= 0 ? '#00D09C' : '#FF4D4D' }]}>
          {item.usd_price_24hr_percent_change >= 0 ? '+' : ''}
          {item.usd_price_24hr_percent_change.toFixed(2)}%
        </ThemedText>
      </View>
    </TouchableOpacity>
  )

  return (
    <AnimateFlatList
      data={data}
      loading={isLoading}
      renderItem={({ item }) => renderCryptoItem({ item })}
      scrollY={scrollY}
      headerHeight={headerHeight}
      isRefetching={isRefetching}
      refetch={refetch}
    />
  )
}

export default Tokens

import { AntDesign, MaterialIcons } from '@expo/vector-icons'
import BigNumber from 'bignumber.js'
import { useRouter } from 'expo-router'
import React, { useRef } from 'react'
import { Animated, TouchableOpacity, View } from 'react-native'
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable'

import MyLoading from '@/components/MyLoading'
import ThemedText from '@/components/UI/ThemedText'
import useBalanceToken from '@/hooks/react-query/useBalanceToken'
import useTheme from '@/hooks/useTheme'
import { Token } from '@/services/moralis/type'

import MyImage from '@/components/MyImage'
import { styles } from '../../styles'
import AnimateFlatList from '../AnimateFlatList'

type Props = {
  scrollY: Animated.Value
  headerHeight: number
}

const Tokens = ({ scrollY, headerHeight }: Props) => {
  const { text, colorIcon } = useTheme()
  const router = useRouter()
  const currentSwipeable = useRef(false)

  const { data, isLoading, refetch, isRefetching } = useBalanceToken()

  const renderHeaderList = () => {
    if (isLoading) {
      return (
        <View style={{ padding: 20, alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <MyLoading />
          <ThemedText>Loading...</ThemedText>
        </View>
      )
    } else {
      return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: 16,
              paddingBottom: 8,
              alignContent: 'center',
              alignItems: 'center',
            }}
          >
            <ThemedText>Tokens ({data?.length})</ThemedText>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              paddingHorizontal: 16,
              paddingBottom: 8,
              alignContent: 'center',
              alignItems: 'center',
            }}
          >
            <TouchableOpacity onPress={() => router.push(`/filter-data/tokens`)} style={{ padding: 6 }}>
              <AntDesign name='filter' size={20} color={text.color} />
            </TouchableOpacity>
          </View>
        </View>
      )
    }
  }

  const renderCryptoItem = ({ item }: { item: Token }) => (
    <Swipeable
      onSwipeableOpenStartDrag={() => {
        currentSwipeable.current = true
      }}
      onSwipeableCloseStartDrag={() => {
        currentSwipeable.current = true
      }}
      renderRightActions={() => (
        <View>
          <ThemedText>hajazdsfhgjfad</ThemedText>
        </View>
      )}
    >
      <TouchableOpacity
        onPress={() => {
          if (currentSwipeable.current) {
            currentSwipeable.current = false
          } else {
            console.log({ item })

            router.push(`/token-detail/${item.token_address}`)
          }
        }}
        style={styles.cryptoItem}
      >
        <View style={[styles.cryptoIcon]}>
          {item.logo || item.thumbnail ? (
            <MyImage src={item.logo || item.thumbnail} style={{ width: 36, height: 36, borderRadius: 18 }} />
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
    </Swipeable>
  )

  return (
    <AnimateFlatList
      key='token-list'
      data={data}
      loading={isLoading}
      renderItem={({ item }) => renderCryptoItem({ item })}
      scrollY={scrollY}
      headerHeight={headerHeight}
      isRefetching={isRefetching}
      refetch={refetch}
      listFooterComponent={
        <TouchableOpacity
          style={{
            height: 64,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            marginTop: 16,

            paddingHorizontal: 16,
            backgroundColor: 'transparent',
            borderRadius: 12,
            // borderWidth: 1,
            // borderColor: '#333',
            borderStyle: 'dashed',
          }}
          onPress={() => router.push('/token-import')}
        >
          <AntDesign name='plus-circle' size={24} color={colorIcon.colorDefault} />
          <ThemedText style={{ fontSize: 16, color: colorIcon.colorDefault, fontWeight: '600' }}>Import Custom Token</ThemedText>
        </TouchableOpacity>
      }
      listHeaderComponent={renderHeaderList()}
    />
  )
}

export default Tokens

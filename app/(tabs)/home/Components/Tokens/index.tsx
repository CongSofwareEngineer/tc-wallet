import { AntDesign } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React from 'react'
import { Animated, TouchableOpacity, View } from 'react-native'

import MyLoading from '@/components/MyLoading'
import ThemedText from '@/components/UI/ThemedText'
import useBalanceToken from '@/hooks/react-query/useBalanceToken'
import useTheme from '@/hooks/useTheme'
import { Token } from '@/services/moralis/type'

import ItemToken from '@/components/ItemToken'
import AnimateFlatList from '../AnimateFlatList'

type Props = {
  scrollY: Animated.Value
  headerHeight: number
}

const Tokens = ({ scrollY, headerHeight }: Props) => {
  const { text, colorIcon } = useTheme()
  const router = useRouter()

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

  const renderCryptoItem = ({ item }: { item: Token }) => {
    return <ItemToken showAddress item={item} onClick={() => router.push(`/token-detail/${item.token_address}`)} />
  }

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
          onPress={() => router.push('/import-token')}
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

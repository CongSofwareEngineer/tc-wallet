import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useRef, useState } from 'react'
import { Animated, Dimensions, TouchableOpacity, View } from 'react-native'
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable'

import MyImage from '@/components/MyImage'
import MyLoading from '@/components/MyLoading'
import ThemedText from '@/components/UI/ThemedText'
import { GAP_DEFAULT } from '@/constants/style'
import useListNFTs from '@/hooks/react-query/useListNFTs'
import useTheme from '@/hooks/useTheme'
import { detectUrlImage } from '@/utils/functions'

import { styles } from '../../styles'
import AnimateFlatList from '../AnimateFlatList'

interface NFTAttribute {
  trait_type: string
  value: string
}

interface NFTMetadata {
  name: string
  description: string
  image: string
  attributes: NFTAttribute[]
}

type NFTType = {
  amount: string
  token_id: string
  token_address: string
  contract_type: string
  owner_of: string
  metadata: string
  name: string
  symbol: string | null
  normalized_metadata: NFTMetadata
  collection_logo: string | null
}

type Props = {
  scrollY: Animated.Value
  headerHeight: number
}

const windowWidth = Dimensions.get('window').width
const ITEM_MARGIN = 8
const GRID_PADDING = 16

const Nfts = ({ scrollY, headerHeight }: Props) => {
  const { text } = useTheme()
  const router = useRouter()
  const currentSwipeable = useRef(false)
  const [isGridView, setIsGridView] = useState(false) // true = grid view (2 items), false = list view (1 item)

  const { data: nfts, isLoading, refetch, isRefetching } = useListNFTs()

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
              gap: GAP_DEFAULT.Gap8,
            }}
          >
            <ThemedText>NFTs ({nfts?.length})</ThemedText>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              paddingHorizontal: 16,
              paddingBottom: 8,
              alignContent: 'center',
              alignItems: 'center',
              gap: GAP_DEFAULT.Gap8,
            }}
          >
            <TouchableOpacity
              onPress={() => setIsGridView(false)}
              style={{
                opacity: isGridView ? 0.5 : 1,
              }}
            >
              <Ionicons name='list' size={32} color={text.color} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIsGridView(true)}
              style={{
                opacity: isGridView ? 1 : 0.5,
              }}
            >
              <Ionicons name='grid' size={24} color={text.color} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push(`/filter-data/nfts`)} style={{ padding: 6 }}>
              <AntDesign name='filter' size={20} color={text.color} />
            </TouchableOpacity>
          </View>
        </View>
      )
    }
  }

  const renderNFTItem = ({ item }: { item: NFTType }) => {
    const metadata = item.normalized_metadata

    return (
      <Swipeable
        onSwipeableOpenStartDrag={() => {
          currentSwipeable.current = true
        }}
        onSwipeableCloseStartDrag={() => {
          currentSwipeable.current = true
        }}
      // renderRightActions={() => (
      //   <View>
      //     <ThemedText>Actions</ThemedText>
      //   </View>
      // )}
      >
        <TouchableOpacity
          onPress={() => {
            if (currentSwipeable.current) {
              currentSwipeable.current = false
            } else {
              router.push(`/nft-detail/${item.token_address}/${item.token_id}`)
            }
          }}
          style={styles.cryptoItem}
        >
          <View style={[styles.cryptoIcon]}>
            {metadata?.image ? (
              <MyImage src={detectUrlImage(metadata.image)} style={{ width: 36, height: 36, borderRadius: 8 }} />
            ) : (
              <MaterialIcons name='image' size={40} color={text.color} />
            )}
          </View>

          <View style={styles.cryptoInfo}>
            <ThemedText style={[styles.cryptoName]} numberOfLines={1} ellipsizeMode='tail'>
              {metadata?.name || item.name}
            </ThemedText>
            <ThemedText style={styles.cryptoBalance}>
              {item.contract_type} #{item.token_id}
            </ThemedText>
          </View>

          <View style={{ alignItems: 'flex-end' }}>
            <ThemedText style={styles.cryptoBalance}>Qty: {item.amount}</ThemedText>
          </View>
        </TouchableOpacity>
      </Swipeable>
    )
  }

  const renderGridItem = ({ item }: { item: NFTType }) => {
    const metadata = item.normalized_metadata
    const itemWidth = (windowWidth - GRID_PADDING * 2 - ITEM_MARGIN) / 2

    return (
      <TouchableOpacity
        onPress={() => router.push(`/nft-detail/${item.token_address}/${item.token_id}`)}
        style={{
          width: itemWidth,
          margin: ITEM_MARGIN / 2,
          borderRadius: 12,
          backgroundColor: '#2A2A2A',
          padding: 12,
        }}
      >
        <View style={{ width: '100%', aspectRatio: 1, marginBottom: 8 }}>
          {metadata?.image ? (
            <MyImage src={detectUrlImage(metadata.image)} style={{ width: '100%', height: '100%', borderRadius: 8 }} />
          ) : (
            <View
              style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1A1A1A', borderRadius: 8 }}
            >
              <MaterialIcons name='image' size={40} color={text.color} />
            </View>
          )}
        </View>

        <View>
          <ThemedText style={[styles.cryptoName]} numberOfLines={1} ellipsizeMode='tail'>
            {metadata?.name || item.name}
          </ThemedText>
          <ThemedText style={styles.cryptoBalance}>
            {item.contract_type} #{item.token_id}
          </ThemedText>
          <ThemedText style={styles.cryptoBalance}>Qty: {item.amount}</ThemedText>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <AnimateFlatList
      key={isGridView ? 'grid-nft' : 'list-nft'}
      data={nfts || []}
      loading={isLoading}
      renderItem={isGridView ? renderGridItem : renderNFTItem}
      scrollY={scrollY}
      headerHeight={headerHeight}
      isRefetching={isRefetching}
      refetch={refetch}
      numColumns={isGridView ? 2 : 1}
      listHeaderComponent={renderHeaderList()}
    />
  )
}

export default Nfts

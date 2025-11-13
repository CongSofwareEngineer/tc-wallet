import { MaterialIcons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useRef, useState } from 'react'
import { Dimensions, FlatList, TouchableOpacity, View } from 'react-native'
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable'

import MyImage from '@/components/MyImage'
import ThemedText from '@/components/UI/ThemedText'
import { GAP_DEFAULT } from '@/constants/style'
import useListNFTs from '@/hooks/react-query/useListNFTs'
import useTheme from '@/hooks/useTheme'
import { NFT } from '@/services/moralis/type'
import { detectUrlImage } from '@/utils/functions'

const windowWidth = Dimensions.get('window').width
const ITEM_MARGIN = 8
const GRID_PADDING = 16

const Nfts = () => {
  const { text } = useTheme()
  const router = useRouter()
  const currentSwipeable = useRef(false)
  const [isGridView, setIsGridView] = useState(false) // true = grid view (2 items), false = list view (1 item)

  const { address } = useLocalSearchParams<{ address: string }>()

  const { data: nfts } = useListNFTs(address ? [address] : [])

  const renderNFTItem = ({ item }: { item: NFT }) => {
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
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 15,
            paddingHorizontal: 15,
            marginVertical: 5,
            backgroundColor: '#1A1A1A',
            borderRadius: 12,
            gap: GAP_DEFAULT.Gap12,
          }}
        >
          <View>
            {metadata?.image ? (
              <MyImage src={detectUrlImage(metadata.image)} style={{ width: 50, height: 50, borderRadius: 8 }} />
            ) : (
              <MaterialIcons name='image' size={40} color={text.color} />
            )}
          </View>

          <View style={{ flex: 1 }}>
            <ThemedText numberOfLines={1} ellipsizeMode='tail'>
              {metadata?.name || item.name}
            </ThemedText>
            <ThemedText>{item.contract_type}</ThemedText>
          </View>

          <View style={{ alignItems: 'flex-end' }}>
            <ThemedText>Qty: {item.amount}</ThemedText>
          </View>
        </TouchableOpacity>
      </Swipeable>
    )
  }

  const renderGridItem = ({ item }: { item: NFT }) => {
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
          <ThemedText numberOfLines={1} ellipsizeMode='tail'>
            {metadata?.name || item.name}
          </ThemedText>
          <ThemedText>
            {item.contract_type} #{item.token_id}
          </ThemedText>
          <ThemedText>Qty: {item.amount}</ThemedText>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <FlatList
      key={isGridView ? 'grid-nft' : 'list-nft'}
      data={nfts || []}
      renderItem={isGridView ? renderGridItem : renderNFTItem}
      numColumns={isGridView ? 2 : 1}
    />
  )
}

export default Nfts

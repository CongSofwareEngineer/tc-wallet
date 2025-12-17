import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useRef, useState } from 'react'
import { Animated, Dimensions, TouchableOpacity, View } from 'react-native'
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable'

import MyImage from '@/components/MyImage'
import MyLoading from '@/components/MyLoading'
import ThemedText from '@/components/UI/ThemedText'
import { GAP_DEFAULT } from '@/constants/style'
import useLanguage from '@/hooks/useLanguage'
import useTheme from '@/hooks/useTheme'
import { detectUrlImage } from '@/utils/functions'

import useCollections from '@/hooks/react-query/useCollections'
import { Collection } from '@/services/moralis/type'
import { styles } from '../../styles'
import AnimateFlatList from '../AnimateFlatList'

type Props = {
  scrollY: Animated.Value
  headerHeight: number
}

const windowWidth = Dimensions.get('window').width
const ITEM_MARGIN = 8
const GRID_PADDING = 16

const Collections = ({ scrollY, headerHeight }: Props) => {
  const { text } = useTheme()
  const { translate } = useLanguage()
  const router = useRouter()
  const currentSwipeable = useRef(false)
  const [isGridView, setIsGridView] = useState(false) // true = grid view (2 items), false = list view (1 item)

  const { data: collections, isLoading, refetch, isRefetching } = useCollections()

  const renderHeaderList = () => {
    if (isLoading) {
      return (
        <View style={{ padding: 20, alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <MyLoading />
          <ThemedText>{translate('common.loading')}</ThemedText>
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
            <ThemedText>{translate('home.collections.title')} ({collections?.length})</ThemedText>
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

  const renderCollectionsItem = ({ item, index }: { item: Collection; index: number }) => {
    return (
      <Swipeable
        key={`${index}-GridItem`}
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
              router.push(`/nft-list/${item.token_address}`)
            }
          }}
          style={styles.cryptoItem}
        >
          <View style={[styles.cryptoIcon]}>
            {item.collection_logo ? (
              <MyImage src={detectUrlImage(item.collection_logo)} style={{ width: 45, maxWidth: 45, maxHeight: 45, height: 45, borderRadius: 8 }} />
            ) : (
              <MaterialIcons name='image' size={40} color={text.color} />
            )}
          </View>

          <View style={styles.cryptoInfo}>
            <ThemedText style={[styles.cryptoName]} numberOfLines={1} ellipsizeMode='tail'>
              {item.name}
            </ThemedText>
            {/* <ThemedText style={styles.cryptoBalance}>
              {item.contract_type} #{item.token_id}
            </ThemedText> */}
          </View>
        </TouchableOpacity>
      </Swipeable>
    )
  }

  const renderGridItem = ({ item, index }: { item: Collection; index: number }) => {
    const itemWidth = (windowWidth - GRID_PADDING * 2 - ITEM_MARGIN) / 2

    return (
      <TouchableOpacity
        key={`${index}-GridItem`}
        onPress={() => router.push(`/nft-list/${item.token_address}`)}
        style={{
          width: itemWidth,
          margin: ITEM_MARGIN / 2,
          borderRadius: 12,
          backgroundColor: '#2A2A2A',
          padding: 12,
        }}
      >
        <View style={{ width: '100%', aspectRatio: 1, marginBottom: 8 }}>
          {item.collection_logo ? (
            <MyImage
              src={detectUrlImage(item.collection_logo)}
              style={{ width: '100%', height: '100%', maxWidth: '100%', maxHeight: '100%', borderRadius: 8 }}
            />
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
            {item.name}
          </ThemedText>
          <ThemedText style={styles.cryptoBalance}>{item.contract_type}</ThemedText>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <AnimateFlatList
      key={isGridView ? 'grid-nft' : 'list-nft'}
      data={collections || []}
      loading={isLoading}
      renderItem={isGridView ? renderGridItem : renderCollectionsItem}
      scrollY={scrollY}
      headerHeight={headerHeight}
      isRefetching={isRefetching}
      refetch={refetch}
      numColumns={isGridView ? 2 : 1}
      listHeaderComponent={renderHeaderList()}
    />
  )
}

export default Collections

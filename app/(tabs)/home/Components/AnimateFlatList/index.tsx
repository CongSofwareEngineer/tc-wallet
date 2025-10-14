import React from 'react'
import { Animated, RefreshControl, View } from 'react-native'

import MyLoading from '@/components/MyLoading'
import ThemedText from '@/components/UI/ThemedText'
export type Props<T> = {
  data: T[]
  loading?: boolean
  renderItem: ({ item }: { item: T }) => React.JSX.Element
  scrollY: Animated.Value
  headerHeight: number
  isRefetching: boolean
  refetch: () => void
}

function AnimateFlatList<T>({ data, loading, renderItem, scrollY, headerHeight, isRefetching, refetch }: Props<T>) {
  return (
    <Animated.FlatList
      ListHeaderComponent={
        loading ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 40 }}>
            <MyLoading size={48} />
            <ThemedText style={{ color: '#999999', marginTop: 12 }}>Loading tokens…</ThemedText>
          </View>
        ) : null
      }
      data={data as any}
      renderItem={renderItem}
      // keyExtractor={(item, index) => item.token_address + index.toFixed()}
      style={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
      onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
      scrollEventThrottle={16}
      contentContainerStyle={{ paddingTop: headerHeight - 10, paddingBottom: 100 }}
      refreshControl={<RefreshControl refreshing={!!isRefetching} onRefresh={refetch} tintColor='#FFFFFF' colors={['#007AFF']} />}
    />
  )
}

export default AnimateFlatList

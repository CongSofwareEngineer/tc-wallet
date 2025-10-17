import React, { useEffect } from 'react'
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
  listFooterComponent?: React.JSX.Element
  listHeaderComponent?: React.JSX.Element
  numColumns?: number
  contentContainerStyle?: any
}

function AnimateFlatList<T>({
  listFooterComponent,
  data,
  loading,
  renderItem,
  scrollY,
  headerHeight,
  isRefetching,
  refetch,
  numColumns,
  contentContainerStyle: customContainerStyle,
  listHeaderComponent,
}: Props<T>) {
  const flatListRef = React.useRef<Animated.FlatList<T>>(null)
  useEffect(() => {
    // Reset scroll position when key changes (switching tabs or view modes)
    if (flatListRef.current) {
      scrollY.setValue(0)
      flatListRef.current.scrollToOffset({ offset: 0, animated: false })
    }
  }, [scrollY])

  return (
    <Animated.FlatList
      ref={flatListRef}
      data={data as any}
      renderItem={renderItem}
      // keyExtractor={(item, index) => item.token_address + index.toFixed()}
      style={{ flex: 1, width: '100%' }}
      showsVerticalScrollIndicator={false}
      onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
      scrollEventThrottle={16}
      numColumns={numColumns}
      contentContainerStyle={[
        {
          paddingTop: headerHeight - 10,
          paddingBottom: 100,
        },
        customContainerStyle,
      ]}
      refreshControl={<RefreshControl refreshing={!!isRefetching} onRefresh={refetch} tintColor='#FFFFFF' colors={['#007AFF']} />}
      ListHeaderComponent={
        listHeaderComponent ||
        (loading ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 40 }}>
            <MyLoading size={48} />
            <ThemedText style={{ color: '#999999', marginTop: 12 }}>Loading tokens…</ThemedText>
          </View>
        ) : null)
      }
      ListFooterComponent={listFooterComponent || <></>}
    />
  )
}

export default AnimateFlatList

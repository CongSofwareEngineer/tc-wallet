import HistoryItem from '@/components/HistoryItem'
import MyLoading from '@/components/MyLoading'
import useHistoryTx from '@/hooks/react-query/useHistoryTx'
import React from 'react'
import { FlatList, View } from 'react-native'
import { styles } from './styles'

const HistoryScreen = () => {
  const { data: historyTx, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useHistoryTx()

  const listData = historyTx?.pages.flatMap((page) => page.result) || []

  if (isLoading) {
    return <MyLoading />
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={listData}
        keyExtractor={(item) => item.hash}
        renderItem={({ item }) => <HistoryItem item={item} />}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={isFetchingNextPage ? <MyLoading /> : null}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

export default HistoryScreen


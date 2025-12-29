import HistoryItem from '@/components/HistoryItem'
import MyLoading from '@/components/MyLoading'
import ThemedText from '@/components/UI/ThemedText'
import ThemeTouchableOpacity from '@/components/UI/ThemeTouchableOpacity'
import { PADDING_DEFAULT } from '@/constants/style'
import useHistoryTx from '@/hooks/react-query/useHistoryTx'
import useMode from '@/hooks/useMode'
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'
import React, { useMemo, useState } from 'react'
import { FlatList, RefreshControl, View } from 'react-native'
import { getStyles } from './styles'

const HistoryScreen = () => {
  const { mode, isDark } = useMode()
  const styles = useMemo(() => getStyles(mode, isDark), [mode, isDark])

  const [filterType, setFilterType] = useState<'all' | 'token' | 'nft'>('all')
  const [filterDirection, setFilterDirection] = useState<'all' | 'in' | 'out'>('all')

  const { data: listData, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch, isRefetching } = useHistoryTx({
    filterType,
    filterDirection
  })
  console.log({ listData });


  const renderLoading = () => {
    return <View style={{ flex: 1, paddingVertical: PADDING_DEFAULT.Padding10, justifyContent: 'center', alignItems: 'center' }}>
      <MyLoading />
    </View>
  }

  const renderFilters = () => {
    return (
      <View style={styles.filterContainer}>
        <View style={styles.filterRow}>
          {[
            { id: 'all', label: 'All', icon: 'list' },
            { id: 'in', label: 'Incoming', icon: 'arrow-down-left' },
            { id: 'out', label: 'Outgoing', icon: 'arrow-up-right' },
          ].map((dir) => (
            <ThemeTouchableOpacity
              key={dir.id}
              onPress={() => setFilterDirection(dir.id as any)}
              style={[styles.filterButton, filterDirection === dir.id && styles.filterButtonActive]}
            >
              <Feather
                name={dir.icon as any}
                size={14}
                color={filterDirection === dir.id ? '#fff' : isDark ? '#8a8e90' : '#4c4e4e'}
              />
              <ThemedText style={[styles.filterText, filterDirection === dir.id && styles.filterTextActive]}>
                {dir.label}
              </ThemedText>
            </ThemeTouchableOpacity>
          ))}
        </View>
        <View style={styles.filterRow}>
          {[
            { id: 'all', label: 'All Assets', icon: 'wallet-outline' },
            { id: 'token', label: 'Tokens', icon: 'coin' },
            { id: 'nft', label: 'NFTs', icon: 'image-outline' },
          ].map((type) => (
            <ThemeTouchableOpacity
              key={type.id}
              onPress={() => setFilterType(type.id as any)}
              style={[styles.filterButton, filterType === type.id && styles.filterButtonActive]}
            >
              <MaterialCommunityIcons
                name={type.icon as any}
                size={16}
                color={filterType === type.id ? '#fff' : isDark ? '#8a8e90' : '#4c4e4e'}
              />
              <ThemedText style={[styles.filterText, filterType === type.id && styles.filterTextActive]}>
                {type.label}
              </ThemedText>
            </ThemeTouchableOpacity>
          ))}
        </View>
      </View>
    )
  }

  if (isLoading) {
    return renderLoading()
  }

  return (
    <View style={styles.container}>
      {renderFilters()}
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
        ListFooterComponent={isFetchingNextPage ? renderLoading() : null}
        ListEmptyComponent={isLoading ? renderLoading() : null}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      />
    </View>
  )
}

export default HistoryScreen





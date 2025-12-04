import { AntDesign, Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useMemo, useState } from 'react'
import { ActivityIndicator, FlatList, TextInput, TouchableOpacity, View } from 'react-native'

import HeaderScreen from '@/components/Header'
import ThemedText from '@/components/UI/ThemedText'
import useListNFTs from '@/hooks/react-query/useListNFTs'
import useMode from '@/hooks/useMode'

import MyImage from '@/components/MyImage'
import useTheme from '@/hooks/useTheme'
import { detectUrlImage } from '@/utils/functions'
import createStyles from './styles'

type ViewMode = 'grid' | 'list'
type FilterType = 'all' | 'image' | 'video' | 'audio'

const NFTListScreen = () => {
  const { address } = useLocalSearchParams<{ address: string }>()
  const { isDark } = useMode()
  const { text } = useTheme()
  const styles = createStyles(isDark)
  const router = useRouter()

  const { data: nfts, isLoading } = useListNFTs(address ? [address] : [])

  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [filter, setFilter] = useState<FilterType>('all')

  // Filter and search NFTs
  const filteredNFTs = useMemo(() => {
    if (!nfts) return []

    let filtered = [...nfts]

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(
        (nft) =>
          nft.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          nft.token_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          nft.contract_type?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply filter
    if (filter !== 'all') {
      filtered = filtered.filter((nft) => {
        const metadata = nft.normalized_metadata
        if (filter === 'image') return metadata?.image
        if (filter === 'video') return metadata?.animation_url?.includes('video')
        if (filter === 'audio') return metadata?.animation_url?.includes('audio')
        return true
      })
    }

    return filtered
  }, [nfts, searchQuery, filter])

  const renderGridItem = ({ item }: any) => (
    <TouchableOpacity style={styles.gridItem}>
      <MyImage
        src={item.normalized_metadata?.image || item.normalized_metadata?.image_url || item.metadata?.image}
        style={styles.nftImage}
        contentFit='contain'
      />
      <View style={styles.nftInfo}>
        <ThemedText style={styles.nftName} numberOfLines={1}>
          {item.name || `#${item.token_id}`}
        </ThemedText>
        <ThemedText style={styles.nftCollection} numberOfLines={1}>
          {item.contract_type || 'NFT'}
        </ThemedText>
        <View style={styles.nftDetails}>
          <ThemedText style={styles.nftId}>#{item.token_id?.slice(0, 8)}...</ThemedText>
          {item.symbol && <ThemedText style={styles.nftChain}>{item.symbol}</ThemedText>}
        </View>
      </View>
    </TouchableOpacity>
  )

  const renderListItem = ({ item }: any) => {
    const urlImage = item.normalized_metadata?.image || item.normalized_metadata?.image_url || item.metadata?.image
    return (
      <TouchableOpacity
        onPress={() => {
          router.replace(`/nft-detail/${item.token_address}/${item.token_id}`)
        }}
        style={styles.listItem}
      >
        <MyImage src={detectUrlImage(urlImage)} style={styles.listNftImage} contentFit='contain' />
        <View style={styles.listNftInfo}>
          <View style={styles.listNftTop}>
            <ThemedText style={styles.nftName} numberOfLines={1}>
              {item.name || `#${item.token_id}`}
            </ThemedText>
            <ThemedText style={styles.nftCollection} numberOfLines={1}>
              {item.contract_type || 'NFT'}
            </ThemedText>
            {/* <View style={styles.badge}>
            <ThemedText style={styles.badgeText}>{item.symbol || 'NFT'}</ThemedText>
          </View> */}
          </View>
          <View style={styles.listNftBottom}>
            <ThemedText style={styles.nftId}>Token ID: {item.token_id} </ThemedText>
            {item.amount && <ThemedText style={styles.nftChain}>x{item.amount}</ThemedText>}
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name='images-outline' size={64} color={isDark ? '#4B5563' : '#9CA3AF'} />
      <ThemedText style={styles.emptyText}>No NFTs found</ThemedText>
      {searchQuery && <ThemedText style={styles.emptySubtext}>Try adjusting your search or filters</ThemedText>}
    </View>
  )

  return (
    <View style={[styles.container]}>
      <HeaderScreen title='List NFTs' />

      {/* Search and Filter Header */}
      <View style={styles.header}>
        {/* Search Input */}
        <View style={styles.searchContainer}>
          <Ionicons name='search' size={20} color={isDark ? '#9CA3AF' : '#6B7280'} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder='Search NFTs...'
            placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
              <Ionicons name='close-circle' size={20} color={isDark ? '#6B7280' : '#9CA3AF'} />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter and View Toggle */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <ThemedText type='subtitle' style={styles.countText}>
            {filteredNFTs.length} {filteredNFTs.length === 1 ? 'NFT' : 'NFTs'}
          </ThemedText>
          <View style={[{ flex: 1, position: 'relative', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 12 }]}>
            {/* View Toggle */}
            <View style={styles.viewToggleContainer}>
              <TouchableOpacity
                style={[styles.viewToggleButton, viewMode === 'grid' && styles.viewToggleButtonActive]}
                onPress={() => setViewMode('grid')}
              >
                <Ionicons name='grid' size={18} color={viewMode === 'grid' ? (isDark ? '#F9FAFB' : '#111827') : isDark ? '#9CA3AF' : '#6B7280'} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.viewToggleButton, viewMode === 'list' && styles.viewToggleButtonActive]}
                onPress={() => setViewMode('list')}
              >
                <Ionicons name='list' size={18} color={viewMode === 'list' ? (isDark ? '#F9FAFB' : '#111827') : isDark ? '#9CA3AF' : '#6B7280'} />
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity style={[]} onPress={() => setViewMode('grid')}>
                <AntDesign name='filter' size={20} color={text.color} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Count */}
      </View>

      {/* NFT List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' color={isDark ? '#60A5FA' : '#3B82F6'} />
          <ThemedText style={styles.emptyText}>Loading NFTs...</ThemedText>
        </View>
      ) : (
        <FlatList
          data={filteredNFTs}
          renderItem={viewMode === 'grid' ? renderGridItem : renderListItem}
          keyExtractor={(item, index) => `${item.token_address}-${item.token_id}-${index}`}
          numColumns={viewMode === 'grid' ? 2 : 1}
          key={viewMode} // Force re-render when switching view modes
          contentContainerStyle={[styles.contentContainer, viewMode === 'grid' && styles.gridContainer]}
          ListEmptyComponent={renderEmpty}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  )
}

export default NFTListScreen

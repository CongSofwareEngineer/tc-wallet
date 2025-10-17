import { Feather, MaterialIcons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { useLocalSearchParams } from 'expo-router'
import React from 'react'
import { Linking, ScrollView, View } from 'react-native'

import ErrorBoundary from '@/components/ErrorBoundary'
import HeaderScreen from '@/components/Header'
import ThemedText from '@/components/UI/ThemedText'
import ThemeTouchableOpacity from '@/components/UI/ThemeTouchableOpacity'
import useNFTDetail from '@/hooks/react-query/useNFTDetail'
import useChains from '@/hooks/useChains'
import useTheme from '@/hooks/useTheme'
import { copyToClipboard, ellipsisText } from '@/utils/functions'

import ImageMain from './ImageMain'
import { styles } from './styles'
import Traits from './Traits'

const NFTDetailScreen = () => {
  const { param } = useLocalSearchParams<{ param: string[] }>()
  const [addressNFT, tokenId] = param
  const { text } = useTheme()
  const { chainCurrent } = useChains()

  const { data: nft, isLoading } = useNFTDetail(addressNFT, tokenId)
  const metadata = nft?.normalized_metadata

  const handleOpenExplorer = () => {
    const explorer = chainCurrent?.blockExplorers?.default?.url
    if (!explorer) return
    const explorerUrl = `${explorer}/address/${addressNFT}`
    Linking.openURL(explorerUrl)
  }

  if (isLoading || !nft) {
    return (
      <View style={styles.container}>
        <HeaderScreen title='NFT Detail' />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ThemedText>Loading...</ThemedText>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <HeaderScreen title='NFT Detail' />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          {/* {metadata?.image ? (
            <MyImage src={detectUrlImage(metadata.image)} style={styles.image} contentFit='cover' />
          ) : (
            <View style={[styles.image, { backgroundColor: '#1A1A1A', alignItems: 'center', justifyContent: 'center' }]}>
              <MaterialIcons name='image' size={48} color={text.color} />
            </View>
          )} */}
          <ImageMain nft={nft} />
        </View>

        <View style={styles.actions}>
          <ThemeTouchableOpacity style={styles.actionButton} type='default' onPress={() => { }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1, justifyContent: 'center' }}>
              <Feather name='send' size={20} color='white' />
              <ThemedText style={[styles.actionText, { color: 'white' }]}>Send NFT</ThemedText>
            </View>
          </ThemeTouchableOpacity>
          <ThemeTouchableOpacity style={styles.actionButton} type='outline' onPress={handleOpenExplorer}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1, justifyContent: 'center' }}>
              <MaterialIcons name='open-in-new' size={20} color={text.color} />
              <ThemedText style={styles.actionText}>View on Explorer</ThemedText>
            </View>
          </ThemeTouchableOpacity>
        </View>

        <View style={styles.contentContainer}>
          {/* Basic Info */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>{metadata?.name || nft.name}</ThemedText>
            <View style={styles.row}>
              <View style={styles.labelContainer}>
                <MaterialIcons name='account-balance-wallet' size={18} color={text.color} />
                <ThemedText style={styles.label}>Contract Address</ThemedText>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <ThemeTouchableOpacity onPress={handleOpenExplorer} type='text'>
                  <ThemedText style={[styles.value, { color: '#00875A' }]}>{ellipsisText(addressNFT, 4, 5)}</ThemedText>
                </ThemeTouchableOpacity>
                <ThemeTouchableOpacity onPress={() => copyToClipboard(addressNFT)} type='text'>
                  <MaterialIcons name='content-copy' size={18} color='#00875A' />
                </ThemeTouchableOpacity>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.labelContainer}>
                <MaterialIcons name='tag' size={18} color={text.color} />
                <ThemedText style={styles.label}>Token ID</ThemedText>
              </View>
              <ThemedText style={styles.value}>#{nft.token_id}</ThemedText>
            </View>
            <View style={styles.row}>
              <View style={styles.labelContainer}>
                <MaterialIcons name='category' size={18} color={text.color} />
                <ThemedText style={styles.label}>Contract Type</ThemedText>
              </View>
              <ThemedText style={styles.value}>{nft.contract_type}</ThemedText>
            </View>
            <View style={styles.row}>
              <View style={styles.labelContainer}>
                <MaterialIcons name='format-list-numbered' size={18} color={text.color} />
                <ThemedText style={styles.label}>Amount</ThemedText>
              </View>
              <ThemedText style={styles.value}>{nft.amount}</ThemedText>
            </View>

            {nft.rarity_rank && (
              <View style={styles.row}>
                <View style={styles.labelContainer}>
                  <MaterialIcons name='star' size={18} color={text.color} />
                  <ThemedText style={styles.label}>Rarity Rank</ThemedText>
                </View>
                <ThemedText style={styles.value}>
                  #{nft.rarity_rank} ({nft.rarity_label})
                </ThemedText>
              </View>
            )}
          </View>

          {/* Description */}
          {metadata?.description && (
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Description</ThemedText>
              <ThemedText style={styles.description}>{metadata.description}</ThemedText>
            </View>
          )}

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Attributes</ThemedText>

            <View style={styles.attributeGrid}>
              <ErrorBoundary>
                <Traits nft={nft} />
              </ErrorBoundary>
            </View>
          </View>

          {/* Collection Info */}
          {(nft.collection_logo || nft.collection_category) && (
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Collection</ThemedText>
              {nft.collection_category && (
                <View style={styles.row}>
                  <ThemedText style={styles.label}>Category</ThemedText>
                  <ThemedText style={styles.value}>{nft.collection_category}</ThemedText>
                </View>
              )}
              {nft.collection_logo && (
                <View style={styles.row}>
                  <Image source={{ uri: nft.collection_logo }} style={{ width: 40, height: 40, borderRadius: 20 }} />
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  )
}

export default NFTDetailScreen

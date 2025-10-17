import { AntDesign, Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { FlatList, TouchableOpacity, View } from 'react-native'

import HeaderScreen from '@/components/Header'
import ThemedText from '@/components/UI/ThemedText'
import ThemeTouchableOpacity from '@/components/UI/ThemeTouchableOpacity'
import useChains from '@/hooks/useChains'
import useChainSelected from '@/hooks/useChainSelected'
import { ChainId, Network } from '@/types/web3'

import { styles } from './styles'

type NetworkType = 'Popular' | 'Custom'

const SelectChainScreen = () => {
  const [activeTab, setActiveTab] = useState<NetworkType>('Popular')
  const router = useRouter()
  const { setChainId } = useChainSelected()
  const { chainsDefault, chainsCustom, chainCurrent } = useChains()

  const handleChangeChain = (chainId: ChainId) => {
    setChainId(chainId)
    router.back()
  }

  const renderNetworkItem = ({ item }: { item: Network }) => (
    <TouchableOpacity style={[styles.networkItem, chainCurrent?.id === item.id && styles.selectedNetworkItem]}>
      <View style={styles.networkInfo}>
        <View style={{ flex: 1 }}>
          <TouchableOpacity style={[{ flexDirection: 'row', alignItems: 'center' }]} onPress={() => handleChangeChain(item.id)}>
            <View style={[styles.networkIcon]}>
              {item?.iconChain ? (
                <Image source={{ uri: item.iconChain }} style={{ width: 30, height: 30, borderRadius: 15 }} />
              ) : (
                <ThemedText style={styles.networkIconText}>{item.name}</ThemedText>
              )}
            </View>
            <ThemedText style={styles.networkName}>{item.name}</ThemedText>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }} />
      </View>

      <TouchableOpacity onPress={() => router.push(`/chain-detail/${item.id}`)} style={styles.menuButton}>
        <AntDesign name='ellipsis' size={24} color='#FFFFFF' />
      </TouchableOpacity>
    </TouchableOpacity>
  )

  if (!chainCurrent) {
    return <></>
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <HeaderScreen
        title='Networks'
        rightSide={
          <ThemeTouchableOpacity type='text' onPress={() => router.push('/chain-detail/new')} style={styles.headerAddButton}>
            <Ionicons name='add' size={24} color='#FFFFFF' />
          </ThemeTouchableOpacity>
        }
      />

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity style={[styles.tabButton, activeTab === 'Popular' && styles.activeTab]} onPress={() => setActiveTab('Popular')}>
          <ThemedText style={[styles.tabText, activeTab === 'Popular' && styles.activeTabText]}>Popular</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.tabButton, activeTab === 'Custom' && styles.activeTab]} onPress={() => setActiveTab('Custom')}>
          <ThemedText style={[styles.tabText, activeTab === 'Custom' && styles.activeTabText]}>Custom</ThemedText>
        </TouchableOpacity>
      </View>

      {/* Network List */}
      <FlatList
        // data={activeTab === 'Popular' ? popularNetworks : []}
        data={activeTab === 'Popular' ? chainsDefault : chainsCustom}
        renderItem={renderNetworkItem}
        keyExtractor={(item, index) => item.name + item.id.toString() + index.toString()}
        style={styles.networkList}
        showsVerticalScrollIndicator={false}
      />

      {/* Additional Networks Section */}
      {/* {activeTab === 'Popular' && (
        <View style={styles.additionalSection}>
          <ThemedText style={styles.sectionTitle}>Additional networks</ThemedText>
          <FlatList data={CHAIN_DEFAULT} renderItem={renderNetworkItem} keyExtractor={(item) => item.id} showsVerticalScrollIndicator={false} />
        </View>
      )} */}
    </View>
  )
}

export default SelectChainScreen

import AntDesign from '@expo/vector-icons/AntDesign'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import React, { useMemo, useState } from 'react'
import { FlatList, TouchableOpacity, View } from 'react-native'

import HeaderScreen from '@/components/Header'
import ThemedText from '@/components/UI/ThemedText'
import { CHAIN_DEFAULT } from '@/constants/chain'
import useChainSelected from '@/hooks/useChainSelected'
import { ChainId, Network } from '@/types/web3'

import { styles } from './styles'

type NetworkType = 'Popular' | 'Custom'

const SelectChainScreen = () => {
  const [activeTab, setActiveTab] = useState<NetworkType>('Popular')
  const router = useRouter()
  const { chainId, setChainId } = useChainSelected()

  const chainSelected = useMemo(() => {
    const chainCurrent = CHAIN_DEFAULT.find((c) => c.id === Number(chainId))
    return chainCurrent
  }, [chainId])

  const handleChangeChain = (chainId: ChainId) => {
    setChainId(chainId)
    router.back()
  }

  const renderNetworkItem = ({ item }: { item: Network }) => (
    <TouchableOpacity
      style={[styles.networkItem, chainSelected?.id === item.id && styles.selectedNetworkItem]}
      onPress={() => handleChangeChain(item.id)}
    >
      <View style={styles.networkInfo}>
        <View style={[styles.networkIcon]}>
          {item?.iconChain ? (
            <Image source={{ uri: item.iconChain }} style={{ width: 30, height: 30, borderRadius: 15 }} />
          ) : (
            <ThemedText style={styles.networkIconText}>{item.name}</ThemedText>
          )}
        </View>
        <ThemedText style={styles.networkName}>{item.name}</ThemedText>
      </View>

      <TouchableOpacity style={styles.menuButton}>
        <AntDesign name='ellipsis' size={20} color='#FFFFFF' />
      </TouchableOpacity>
    </TouchableOpacity>
  )

  if (!chainSelected) {
    return <></>
  }
  console.log({ chainSelected })

  return (
    <View style={styles.container}>
      {/* Header */}
      <HeaderScreen title='Networks' />

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
        data={CHAIN_DEFAULT}
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

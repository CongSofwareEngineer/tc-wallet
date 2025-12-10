import ThemedInput from '@/components/UI/ThemedInput'
import { AntDesign, Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { FlatList, TouchableOpacity, View } from 'react-native'

import HeaderScreen from '@/components/Header'
import ThemedText from '@/components/UI/ThemedText'
import ThemeTouchableOpacity from '@/components/UI/ThemeTouchableOpacity'
import useChains from '@/hooks/useChains'
import useChainSelected from '@/hooks/useChainSelected'
import { ChainId, Network } from '@/types/web3'

import MyImage from '@/components/MyImage'
import useTheme from '@/hooks/useTheme'
import { styles } from './styles'

const SelectChainScreen = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()
  const { text } = useTheme()
  const { setChainId } = useChainSelected()
  const { chainsDefault, chainsCustom, chainCurrent } = useChains()

  const handleChangeChain = (chainId: ChainId) => {
    setChainId(chainId)
    router.back()
  }

  const renderNetworkItem = ({ item }: { item: Network }) => (
    <TouchableOpacity
      style={[styles.networkItem, chainCurrent?.id === item.id && styles.selectedNetworkItem]}
      onPress={() => handleChangeChain(item.id)}
    >
      <View style={styles.networkIconWrap}>
        {item?.iconChain ? (
          <MyImage src={item.iconChain} style={styles.networkIcon} />
        ) : (
          <ThemedText style={styles.networkIconText}>{item.name[0]}</ThemedText>
        )}
      </View>
      <View style={styles.networkInfo}>
        <ThemedText numberOfLines={1} style={styles.networkName}>
          {item.name}
        </ThemedText>
      </View>
      <TouchableOpacity onPress={() => router.push(`/chain-detail/${item.id}`)} style={styles.menuButton}>
        <AntDesign name='edit' size={20} color={text.color} />
      </TouchableOpacity>
    </TouchableOpacity>
  )

  if (!chainCurrent) {
    return <></>
  }

  // Filter chains by search
  const chainsList = [...chainsDefault, ...chainsCustom].filter(
    (chain) => chain.name.toLowerCase().includes(searchQuery.toLowerCase()) || chain.id.toString().includes(searchQuery.toLowerCase())
  )

  return (
    <View style={styles.container}>
      <HeaderScreen
        title='Select Chain'
        rightSide={
          <ThemeTouchableOpacity type='text' onPress={() => router.push('/import-chain')} style={styles.headerAddButton}>
            <Ionicons name='add' size={24} color='#FFFFFF' />
          </ThemeTouchableOpacity>
        }
      />

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <ThemedInput
          leftIcon={<Ionicons name='search' size={20} color={'#8a8e90ff'} style={styles.searchIcon} />}
          rightIcon={searchQuery.length > 0 ? <Ionicons name='close-circle' size={20} color={'#8a8e90ff'} /> : undefined}
          onPressRightIcon={() => setSearchQuery('')}
          style={styles.searchInput}
          placeholder='Search chain name or chain ID...'
          placeholderTextColor={'#8a8e90ff'}
          value={searchQuery}
          onChangeText={setSearchQuery}
          noBorder
        />
      </View>

      {/* Chain List */}
      <FlatList
        data={chainsList}
        renderItem={renderNetworkItem}
        keyExtractor={(item, index) => item.name + item.id.toString() + index.toString()}
        style={styles.networkList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  )
}

export default SelectChainScreen

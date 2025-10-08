import AntDesign from '@expo/vector-icons/AntDesign'
import Feather from '@expo/vector-icons/Feather'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import React, { useEffect, useRef, useState } from 'react'
import { Animated, TouchableOpacity, View } from 'react-native'

import ThemedText from '@/components/UI/ThemedText'
import { CHAIN_DEFAULT } from '@/constants/chain'
import { GAP_DEFAULT } from '@/constants/style'
import useChainSelected from '@/hooks/useChainSelected'
import useSheet from '@/hooks/useSheet'
import useWallets from '@/hooks/useWallets'
import { copyToClipboard, ellipsisText } from '@/utils/functions'

import { styles } from './styles'

type CryptoAsset = {
  id: string
  name: string
  symbol: string
  balance: string
  value: string
  change: number
  color: string
}

const mockCryptoData: CryptoAsset[] = []

for (let i = 0; i <= 60; i++) {
  mockCryptoData.push({
    id: i.toString(),
    name: `Crypto ${i}`,
    symbol: `C${i}`,
    balance: (Math.random() * 10).toFixed(4),
    value: `$${(Math.random() * 1000).toFixed(2)}`,
    change: parseFloat((Math.random() * 10 - 5).toFixed(2)), // Random change between -5% and +5%
    color: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // Random color
  })
}

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState('Tokens')
  const [activeNetwork, setActiveNetwork] = useState('All Networks')
  const [isHeaderHidden, setIsHeaderHidden] = useState(false)
  const [isShowHeader, setIsShowHeader] = useState(true)
  const router = useRouter()
  const { openSheet, closeSheet } = useSheet()
  const { chainId } = useChainSelected()
  const { wallet } = useWallets()
  const scrollY = useRef(new Animated.Value(0)).current

  // Callback when header is fully hidden
  const onHeaderFullyHidden = () => {
    setIsShowHeader(false)
    console.log('Header is fully hidden!')
    // Add your callback logic here
  }

  // Callback when header is visible again
  const onHeaderVisible = () => {
    setIsShowHeader(true)
    console.log('Header is visible again!')
    // Add your callback logic here
  }

  // Listen to scroll changes and detect when header is hidden
  useEffect(() => {
    const listener = scrollY.addListener(({ value }) => {
      const wasHidden = isHeaderHidden
      const isNowHidden = value >= 100 // Header fully hidden when scroll >= 100

      if (!wasHidden && isNowHidden) {
        setIsHeaderHidden(true)
        onHeaderFullyHidden()
      } else if (wasHidden && !isNowHidden) {
        setIsHeaderHidden(false)
        onHeaderVisible()
      }
    })

    return () => {
      scrollY.removeListener(listener)
    }
  }, [scrollY, isHeaderHidden])
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  })
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -50],
    extrapolate: 'clamp',
  })

  // Animation for moving tabs and content up to replace header
  const contentTranslateY = scrollY.interpolate({
    inputRange: [0, 360],
    outputRange: [0, -180], // Move up less for smoother effect
    extrapolate: 'clamp',
  })

  const renderCryptoItem = ({ item }: { item: CryptoAsset }) => (
    <TouchableOpacity style={styles.cryptoItem}>
      <View style={[styles.cryptoIcon, { backgroundColor: item.color }]}>
        <ThemedText style={styles.cryptoName}>{item.symbol[0]}</ThemedText>
      </View>

      <View style={styles.cryptoInfo}>
        <ThemedText style={styles.cryptoName}>{item.name}</ThemedText>
        <ThemedText style={styles.cryptoBalance}>
          {item.balance} {item.symbol}
        </ThemedText>
      </View>

      <View style={{ alignItems: 'flex-end' }}>
        <ThemedText style={styles.cryptoBalance}>{item.value}</ThemedText>
        <ThemedText style={[styles.cryptoChange, { color: item.change >= 0 ? '#00D09C' : '#FF4D4D' }]}>
          {item.change >= 0 ? '+' : ''}
          {item.change.toFixed(2)}%
        </ThemedText>
      </View>
    </TouchableOpacity>
  )

  const renderChainSelected = () => {
    const chainCurrent = CHAIN_DEFAULT.find((c) => c.id === Number(chainId))

    return (
      chainCurrent && (
        <TouchableOpacity onPress={() => router.push('/select-chain')} style={styles.networkFilter}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: GAP_DEFAULT.Gap8 }}>
            {chainCurrent?.iconChain && <Image source={{ uri: chainCurrent?.iconChain }} style={{ width: 24, height: 24, borderRadius: 12 }} />}
            <ThemedText style={styles.networkFilterText}>{chainCurrent?.name}</ThemedText>
          </View>
          <AntDesign name='down' size={16} color='#FFFFFF' />
        </TouchableOpacity>
      )
    )
  }

  return (
    <View style={[styles.container]}>
      <Animated.View style={[{ opacity: headerOpacity, transform: [{ translateY: headerTranslateY }] }]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ width: 150 }}>
            <TouchableOpacity onPress={() => router.push('/wallet')} style={styles.addressContainer}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: GAP_DEFAULT.Gap4 }}>
                <ThemedText style={styles.addressText}>{ellipsisText(wallet?.address, 4, 5)}</ThemedText>
                <AntDesign name='down' size={14} color='#FFFFFF' />
              </View>
            </TouchableOpacity>
          </View>

          <View style={[styles.headerIcons, { flex: 1, justifyContent: 'flex-end' }]}>
            <TouchableOpacity onPress={() => router.push('/connect-dapp')} style={styles.iconButton}>
              <AntDesign name='scan' size={24} color='#FFFFFF' />
            </TouchableOpacity>
          </View>
        </View>

        {/* Balance Section */}
        <View style={styles.balanceSection}>
          <ThemedText style={styles.balanceAmount}>$1,234.56</ThemedText>
          {/* <Options /> */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
            <TouchableOpacity onPress={() => copyToClipboard('sdffsdf')} style={styles.buyButton}>
              <Feather name='send' size={20} color='#FFFFFF' />
              <ThemedText style={{ color: '#FFFFFF', fontWeight: '600', marginLeft: 8 }}>Send</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buyButton}>
              <Ionicons name='add' size={20} color='#FFFFFF' />
              <ThemedText style={{ color: '#FFFFFF', fontWeight: '600', marginLeft: 8 }}>Receive</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      <Animated.View id={`isShowHeader_${isShowHeader}`} style={[{ flex: 1, transform: [{ translateY: contentTranslateY }] }]}>
        {/* Navigation Tabs */}
        <View style={styles.tabsContainer}>
          {['Tokens', 'NFTs'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabButton, activeTab === tab && styles.activeTab]}
              onPress={() => {
                // Alert.alert('Tab pressed', `You pressed the ${tab} tab.`)
                copyToClipboard('sdffsdf')
              }}
            >
              <ThemedText style={[styles.tabText, activeTab === tab && { color: '#007AFF' }]}>{tab}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Network Filter */}
        {renderChainSelected()}

        {/* Crypto List */}
        <Animated.FlatList
          onContentSizeChange={() => {
            console.log('Content size changed')
          }}
          id={`FlatList_${isShowHeader}`}
          data={mockCryptoData}
          renderItem={renderCryptoItem}
          keyExtractor={(item) => item.id}
          style={{ flex: 1, paddingHorizontal: 20 }}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      </Animated.View>
    </View>
  )
}

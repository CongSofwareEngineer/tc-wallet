import AntDesign from '@expo/vector-icons/AntDesign'
import Feather from '@expo/vector-icons/Feather'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { FlatList, TouchableOpacity, View } from 'react-native'

import ThemedText from '@/components/UI/ThemedText'
import { CHAIN_DEFAULT } from '@/constants/chain'
import { GAP_DEFAULT } from '@/constants/style'
import useChainSelected from '@/hooks/useChainSelected'
import useSheet from '@/hooks/useSheet'
import useWallets from '@/hooks/useWallets'
import { ellipsisText } from '@/utils/functions'

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

const mockCryptoData: CryptoAsset[] = [
  {
    id: '1',
    name: 'Bitcoin',
    symbol: 'BTC',
    balance: '0.00123',
    value: '$89.45',
    change: 2.34,
    color: '#F7931A',
  },
  {
    id: '2',
    name: 'Ethereum',
    symbol: 'ETH',
    balance: '0.456',
    value: '$1,234.56',
    change: -1.23,
    color: '#627EEA',
  },
  {
    id: '3',
    name: 'Binance Coin',
    symbol: 'BNB',
    balance: '2.5',
    value: '$678.90',
    change: 0.89,
    color: '#F3BA2F',
  },
]

for (let i = 4; i <= 20; i++) {
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
  const router = useRouter()
  const { openSheet, closeSheet } = useSheet()
  const { chainId } = useChainSelected()
  const { wallet } = useWallets()

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
    console.log({ chainCurrent })

    return (
      chainCurrent && (
        <TouchableOpacity onPress={() => router.push('/select-chain')} style={styles.networkFilter}>
          <ThemedText style={styles.networkFilterText}>{chainCurrent?.name}</ThemedText>
          <AntDesign name='down' size={16} color='#FFFFFF' />
        </TouchableOpacity>
      )
    )
  }

  return (
    <View style={styles.container}>
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
          {/* <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name='notifications-none' size={24} color='#FFFFFF' />
          </TouchableOpacity> */}
          {/* <TouchableOpacity style={styles.iconButton}>
            <Ionicons name='settings-outline' size={24} color='#FFFFFF' />
          </TouchableOpacity> */}
        </View>
      </View>

      {/* Balance Section */}
      <View style={styles.balanceSection}>
        <ThemedText style={styles.balanceAmount}>$1,234.56</ThemedText>
        {/* <Options /> */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
          <TouchableOpacity style={styles.buyButton}>
            <Feather name='send' size={20} color='#FFFFFF' />
            <ThemedText style={{ color: '#FFFFFF', fontWeight: '600', marginLeft: 8 }}>Send</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buyButton}>
            <Ionicons name='add' size={20} color='#FFFFFF' />
            <ThemedText style={{ color: '#FFFFFF', fontWeight: '600', marginLeft: 8 }}>Receive</ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Navigation Tabs */}
      <View style={styles.tabsContainer}>
        {['Tokens', 'NFTs'].map((tab) => (
          <TouchableOpacity key={tab} style={[styles.tabButton, activeTab === tab && styles.activeTab]} onPress={() => setActiveTab(tab)}>
            <ThemedText style={[styles.tabText, activeTab === tab && { color: '#007AFF' }]}>{tab}</ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      {/* Network Filter */}
      {renderChainSelected()}

      {/* Crypto List */}
      <FlatList
        data={mockCryptoData}
        renderItem={renderCryptoItem}
        keyExtractor={(item) => item.id}
        style={styles.cryptoList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

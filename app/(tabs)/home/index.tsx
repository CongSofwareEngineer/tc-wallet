import AntDesign from '@expo/vector-icons/AntDesign'
import Feather from '@expo/vector-icons/Feather'
import Ionicons from '@expo/vector-icons/Ionicons'
import Big from 'bignumber.js'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import React, { useRef, useState } from 'react'
import { Animated, TouchableOpacity, View } from 'react-native'

import ThemedText from '@/components/UI/ThemedText'
import { GAP_DEFAULT, PADDING_DEFAULT } from '@/constants/style'
import useBalanceToken from '@/hooks/react-query/useBalanceToken'
import useChains from '@/hooks/useChains'
import useTheme from '@/hooks/useTheme'
import useWallets from '@/hooks/useWallets'
import { ellipsisText } from '@/utils/functions'

import Tokens from './Components/Tokens'
import { styles } from './styles'

// Token list is typed via services/moralis/type Token

const HEIGHT_HEADER_SCROLL = 200

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState('Tokens')
  const router = useRouter()
  const { chainCurrent } = useChains()
  const { wallet } = useWallets()
  const { text } = useTheme()
  const { totalUSD } = useBalanceToken()
  const scrollY = useRef(new Animated.Value(0)).current
  const [headerHeight, setHeaderHeight] = useState(HEIGHT_HEADER_SCROLL)

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, (headerHeight < HEIGHT_HEADER_SCROLL ? HEIGHT_HEADER_SCROLL : headerHeight) - 150],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  })
  // HEADER_SCROLL for animation bounds

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, (headerHeight < HEIGHT_HEADER_SCROLL ? HEIGHT_HEADER_SCROLL : headerHeight) - 150],
    // outputRange: [0, Platform.OS === 'android' ? -HEIGHT_HEADER_SCROLL * 2 : -HEIGHT_HEADER_SCROLL],
    outputRange: [0, -((headerHeight < HEIGHT_HEADER_SCROLL ? HEIGHT_HEADER_SCROLL : headerHeight) - 150)],
    extrapolate: 'clamp',
  })

  // Content translateY removed as header is now absolute

  const renderChainSelected = () => {
    return (
      <View style={[styles.networkFilter, { position: 'relative' }]}>
        <TouchableOpacity onPress={() => router.push('/select-chain')}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: GAP_DEFAULT.Gap8 }}>
            {chainCurrent?.iconChain && <Image source={{ uri: chainCurrent?.iconChain }} style={{ width: 30, height: 30, borderRadius: 15 }} />}
            <ThemedText style={styles.networkFilterText}>{chainCurrent?.name}</ThemedText>
            <AntDesign name='down' size={16} color='#FFFFFF' />
          </View>
        </TouchableOpacity>
        <View style={{ position: 'relative' }}>
          <TouchableOpacity
            onPress={() => router.push(`/filter-data/${activeTab.toLowerCase()}`)}
            style={{ padding: 6 }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <AntDesign name='filter' size={18} color={text.color} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <View style={[styles.container]}>
      <Animated.View
        style={[
          { transform: [{ translateY: headerTranslateY }] },
          { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, padding: PADDING_DEFAULT.Padding16, paddingBottom: 0 },
        ]}
        onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
      >
        <Animated.View style={{ opacity: headerOpacity }}>
          {/* Header */}
          <View style={[styles.header]}>
            <View style={{ width: 150 }}>
              <TouchableOpacity onPress={() => router.push('/wallet')} style={styles.addressContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: GAP_DEFAULT.Gap4 }}>
                  <ThemedText style={styles.addressText}>{wallet?.name || ellipsisText(wallet?.address, 4, 5)}</ThemedText>
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
          <View style={[styles.balanceSection, { paddingTop: 16 }]}>
            <ThemedText type='title' style={[styles.balanceAmount]}>
              $
              {Big(totalUSD || 0)
                .decimalPlaces(6, Big.ROUND_DOWN)
                .toFormat()}
            </ThemedText>
            {/* <Options /> */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20, marginTop: 12 }}>
              <TouchableOpacity onPress={() => router.push(`/send-token/${wallet?.address}`)} style={styles.buyButton}>
                <Feather name='send' size={20} color='#FFFFFF' />
                <ThemedText style={{ color: '#FFFFFF', fontWeight: '600', marginLeft: 8 }}>Send</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/qr-info-address')} style={styles.buyButton}>
                <Ionicons name='add' size={20} color='#FFFFFF' />
                <ThemedText style={{ color: '#FFFFFF', fontWeight: '600', marginLeft: 8 }}>Receive</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* Network Filter + Tabs inside header */}
        <View>
          <View style={[styles.tabsContainer, { backgroundColor: '#0A0A0A' }]}>
            {['Tokens', 'NFTs'].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tabButton, activeTab === tab && styles.activeTab]}
                onPress={() => {
                  setActiveTab(tab)
                }}
              >
                <ThemedText style={[styles.tabText, activeTab === tab && { color: '#007AFF' }]}>{tab}</ThemedText>
              </TouchableOpacity>
            ))}
          </View>
          <View style={[{ backgroundColor: '#0A0A0A', height: 12, width: '100%' }]} />

          {renderChainSelected()}
        </View>
      </Animated.View>

      <View style={[{ flex: 1 }]}>
        <Tokens headerHeight={headerHeight} scrollY={scrollY} />
      </View>
    </View>
  )
}

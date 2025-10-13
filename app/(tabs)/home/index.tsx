import AntDesign from '@expo/vector-icons/AntDesign'
import Feather from '@expo/vector-icons/Feather'
import Ionicons from '@expo/vector-icons/Ionicons'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import Big from 'bignumber.js'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import React, { useMemo, useRef, useState } from 'react'
import { Animated, Platform, RefreshControl, TouchableOpacity, View } from 'react-native'

import MyLoading from '@/components/MyLoading'
import ThemedText from '@/components/UI/ThemedText'
import { GAP_DEFAULT, PADDING_DEFAULT } from '@/constants/style'
import useBalanceToken from '@/hooks/react-query/useBalanceToken'
import useChains from '@/hooks/useChains'
import useTheme from '@/hooks/useTheme'
import useWallets from '@/hooks/useWallets'
import { Token } from '@/services/moralis/type'
import { ellipsisText } from '@/utils/functions'

import { styles } from './styles'

// Token list is typed via services/moralis/type Token

const HEIGHT_HEADER_SCROLL = 200

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState('Tokens')
  // const [isHeaderHidden, setIsHeaderHidden] = useState(false)
  const router = useRouter()
  const { chainCurrent } = useChains()
  const { wallet } = useWallets()
  const { background } = useTheme()
  const { data: listTokens, isLoading: loadingListTokens, totalUSD, refetch, isRefetching } = useBalanceToken()
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const [hideSpam, setHideSpam] = useState(false)
  const [hideLowUSD, setHideLowUSD] = useState(false)

  const scrollY = useRef(new Animated.Value(0)).current
  const [headerHeight, setHeaderHeight] = useState(HEIGHT_HEADER_SCROLL)

  // // Callback when header is fully hidden
  // const onHeaderFullyHidden = () => {
  //   setIsShowHeader(false)
  //   // Add your callback logic here
  // }

  // // Callback when header is visible again
  // const onHeaderVisible = () => {
  //   setIsShowHeader(true)
  //   // Add your callback logic here
  // }

  // // Listen to scroll changes and detect when header is hidden
  // useEffect(() => {
  //   const listener = scrollY.addListener(({ value }) => {
  //     const wasHidden = isHeaderHidden
  //     const isNowHidden = value >= 100 // Header fully hidden when scroll >= 100

  //     if (!wasHidden && isNowHidden) {
  //       setIsHeaderHidden(true)
  //       onHeaderFullyHidden()
  //     } else if (wasHidden && !isNowHidden) {
  //       setIsHeaderHidden(false)
  //       onHeaderVisible()
  //     }
  //   })

  //   return () => {
  //     scrollY.removeListener(listener)
  //   }
  // }, [scrollY, isHeaderHidden])

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEIGHT_HEADER_SCROLL],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  })
  // HEADER_SCROLL for animation bounds

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, HEIGHT_HEADER_SCROLL],
    outputRange: [0, Platform.OS === 'android' ? -HEIGHT_HEADER_SCROLL * 2 : -HEIGHT_HEADER_SCROLL],
    extrapolate: 'clamp',
  })

  // Content translateY removed as header is now absolute

  const renderCryptoItem = ({ item }: { item: Token }) => (
    <TouchableOpacity style={styles.cryptoItem}>
      <View style={[styles.cryptoIcon]}>
        {item.logo || item.thumbnail ? (
          <Image source={{ uri: item.logo || item.thumbnail }} style={{ width: 36, height: 36 }} />
        ) : (
          // item.symbol
          <MaterialIcons name='token' size={40} color='black' />
          // <AntDesign name='tik-tok' size={40} color='#FFFFFF' />
        )}
      </View>

      <View style={styles.cryptoInfo}>
        <ThemedText style={[styles.cryptoName]} numberOfLines={1} ellipsizeMode='tail'>
          {item.name}
        </ThemedText>
        <ThemedText style={styles.cryptoBalance}>
          {Big(item.balance_formatted).decimalPlaces(6, Big.ROUND_DOWN).toFormat()} {item.symbol}
        </ThemedText>
      </View>

      <View style={{ alignItems: 'flex-end' }}>
        <ThemedText style={styles.cryptoBalance}>{Big(item.usd_value).decimalPlaces(4, Big.ROUND_DOWN).toFormat()}$</ThemedText>
        <ThemedText style={[styles.cryptoChange, { color: item.usd_price_24hr_percent_change >= 0 ? '#00D09C' : '#FF4D4D' }]}>
          {item.usd_price_24hr_percent_change >= 0 ? '+' : ''}
          {item.usd_price_24hr_percent_change.toFixed(2)}%
        </ThemedText>
      </View>
    </TouchableOpacity>
  )

  const filterActive = useMemo(() => hideSpam || hideLowUSD, [hideSpam, hideLowUSD])
  const displayTokens = useMemo(() => {
    let arr = listTokens || []
    if (hideSpam) arr = arr.filter((t) => !t.possible_spam)
    if (hideLowUSD) arr = arr.filter((t) => t.usd_value > 0.01)
    return arr
  }, [listTokens, hideSpam, hideLowUSD])

  console.log({ displayTokens })

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
            onPress={() => setShowFilterDropdown((v) => !v)}
            style={{ padding: 6 }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <AntDesign name='filter' size={18} color={filterActive ? '#007AFF' : '#FFFFFF'} />
          </TouchableOpacity>
          {showFilterDropdown && (
            <View
              style={{
                position: 'absolute',
                top: 36,
                right: 0,
                backgroundColor: '#1A1A1A',
                borderRadius: 8,
                paddingVertical: 8,
                paddingHorizontal: 10,
                borderWidth: 1,
                borderColor: '#333333',
                minWidth: 180,
                shadowColor: '#000',
                shadowOpacity: 0.3,
                shadowRadius: 6,
                shadowOffset: { width: 0, height: 2 },
                elevation: 6,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setHideSpam((v) => !v)
                }}
                style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8 }}
              >
                <View
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 4,
                    borderWidth: 1,
                    borderColor: hideSpam ? '#007AFF' : '#555555',
                    backgroundColor: hideSpam ? '#007AFF' : 'transparent',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {hideSpam && <AntDesign name='check' size={12} color='#FFFFFF' />}
                </View>
                <ThemedText style={{ marginLeft: 8, color: '#FFFFFF' }}>Hide spam tokens</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setHideLowUSD((v) => !v)
                }}
                style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8 }}
              >
                <View
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 4,
                    borderWidth: 1,
                    borderColor: hideLowUSD ? '#007AFF' : '#555555',
                    backgroundColor: hideLowUSD ? '#007AFF' : 'transparent',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {hideLowUSD && <AntDesign name='check' size={12} color='#FFFFFF' />}
                </View>
                <ThemedText style={{ marginLeft: 8, color: '#FFFFFF' }}>USD value &gt; 0.01</ThemedText>
              </TouchableOpacity>
            </View>
          )}
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
          <View style={styles.balanceSection}>
            <ThemedText style={styles.balanceAmount}>${Big(totalUSD).decimalPlaces(6, Big.ROUND_DOWN).toFormat()}</ThemedText>
            {/* <Options /> */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
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
          <View style={[styles.tabsContainer, { backgroundColor: background.background }]}>
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
          {renderChainSelected()}
          <View style={[{ backgroundColor: background.background, height: 12, width: '100%' }]} />
        </View>
      </Animated.View>

      <View style={[{ flex: 1 }]}>
        {/* Crypto List */}
        {loadingListTokens ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 40 }}>
            <MyLoading size={48} />
            <ThemedText style={{ color: '#999999', marginTop: 12 }}>Loading tokens…</ThemedText>
          </View>
        ) : (
          <Animated.FlatList
            data={
              activeTab === 'Tokens'
                ? [...displayTokens, ...displayTokens, ...displayTokens, ...displayTokens, ...displayTokens, ...displayTokens]
                : []
            }
            renderItem={renderCryptoItem}
            keyExtractor={(item, index) => item.token_address + index.toFixed()}
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
            scrollEventThrottle={16}
            contentContainerStyle={{ paddingTop: headerHeight - 10, paddingBottom: 100 }}
            refreshControl={<RefreshControl refreshing={!!isRefetching} onRefresh={refetch} tintColor='#FFFFFF' colors={['#007AFF']} />}
          />
        )}
      </View>
    </View>
  )
}

import Feather from '@expo/vector-icons/Feather'
import Big from 'bignumber.js'
import { useRouter } from 'expo-router'
import React, { useRef, useState } from 'react'
import { Animated, View } from 'react-native'

import ThemedText from '@/components/UI/ThemedText'
import ThemeTouchableOpacity from '@/components/UI/ThemeTouchableOpacity'
import { COLORS, PADDING_DEFAULT } from '@/constants/style'
import useBalanceToken from '@/hooks/react-query/useBalanceToken'
import useWallets from '@/hooks/useWallets'

import useChainList from '@/hooks/react-query/useChainList'
import useTheme from '@/hooks/useTheme'
import { width } from '@/utils/systems'
import Collections from './Components/Collections'
import HeaderHome from './Components/Header'
import Tokens from './Components/Tokens'
import { styles } from './styles'

// Token list is typed via services/moralis/type Token

const HEIGHT_HEADER_SCROLL = 200

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState('Tokens')
  const router = useRouter()
  const { background } = useTheme()
  const { wallet } = useWallets()
  const { totalUSD } = useBalanceToken()
  const scrollY = useRef(new Animated.Value(0)).current

  const [headerHeight, setHeaderHeight] = useState(HEIGHT_HEADER_SCROLL)

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, (headerHeight < HEIGHT_HEADER_SCROLL ? HEIGHT_HEADER_SCROLL : headerHeight) - 60],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  })
  // HEADER_SCROLL for animation bounds

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, (headerHeight < HEIGHT_HEADER_SCROLL ? HEIGHT_HEADER_SCROLL : headerHeight) - 60],
    // outputRange: [0, Platform.OS === 'android' ? -HEIGHT_HEADER_SCROLL * 2 : -HEIGHT_HEADER_SCROLL],
    outputRange: [0, -((headerHeight < HEIGHT_HEADER_SCROLL ? HEIGHT_HEADER_SCROLL : headerHeight) - 60)],
    extrapolate: 'clamp',
  })

  const { data: chainList } = useChainList()
  console.log({ chainList });



  return (
    <View style={[styles.container]}>
      <Animated.View
        style={[
          { transform: [{ translateY: headerTranslateY }] },
          { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1, padding: PADDING_DEFAULT.Padding16, paddingBottom: 0 },
        ]}
        onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
      >
        <Animated.View style={{ opacity: headerOpacity }}>
          {/* Header */}
          <HeaderHome />

          {/* Balance Section */}
          <View style={[styles.balanceSection, { paddingTop: 16 }]}>
            <ThemedText type='title' style={[styles.balanceAmount, { fontSize: width(8), lineHeight: width(10) }]}>
              $
              {Big(totalUSD || 0)
                .decimalPlaces(4, Big.ROUND_DOWN)
                .toFormat()}
            </ThemedText>
            {/* <Options /> */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20, marginTop: 6 }}>
              <ThemeTouchableOpacity onPress={() => router.push(`/send-token/${wallet?.address}`)} style={styles.buyButton}>
                <Feather name='send' size={20} color='#FFFFFF' />
                <ThemedText style={{ color: '#FFFFFF', fontWeight: '600', marginLeft: 8 }}>Send</ThemedText>
              </ThemeTouchableOpacity>
              <ThemeTouchableOpacity onPress={() => router.push('/qr-info-address')} style={styles.buyButton}>
                <Feather name='download' size={20} color='#FFFFFF' />
                <ThemedText style={{ color: '#FFFFFF', fontWeight: '600', marginLeft: 8 }}>Receive</ThemedText>
              </ThemeTouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* Network Filter + Tabs inside header */}
        <View>
          <View style={[styles.tabsContainer, { backgroundColor: background.background }]}>
            {['Tokens', 'Collections'].map((tab) => (
              <ThemeTouchableOpacity
                type='text'
                key={tab}
                style={[styles.tabButton, activeTab === tab && styles.activeTab]}
                onPress={() => {
                  setActiveTab(tab)
                }}
              >
                <ThemedText type='subtitle' style={[styles.tabText, activeTab === tab && { color: COLORS.green600 }]}>
                  {tab}
                </ThemedText>
              </ThemeTouchableOpacity>
            ))}
          </View>
          <View style={[{ backgroundColor: background.background, height: 12, width: '100%' }]} />

          {/* {renderChainSelected()} */}
        </View>
      </Animated.View>

      {/* <WebView source={{ uri: 'https://reactnative.dev/' }} style={{ flex: 1 }} /> */}

      <View style={[{ flex: 1 }]}>
        {activeTab === 'Tokens' ? (
          <Tokens headerHeight={headerHeight} scrollY={scrollY} />
        ) : (
          <Collections headerHeight={headerHeight} scrollY={scrollY} />
        )}
      </View>
    </View>
  )
}

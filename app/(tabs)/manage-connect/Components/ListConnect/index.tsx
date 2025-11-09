import AntDesign from '@expo/vector-icons/AntDesign'
import Ionicons from '@expo/vector-icons/Ionicons'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { Image } from 'expo-image'
import React, { useMemo } from 'react'
import { FlatList, TouchableOpacity, View } from 'react-native'
import { useDispatch } from 'react-redux'

import ThemedText from '@/components/UI/ThemedText'
import ThemeTouchableOpacity from '@/components/UI/ThemeTouchableOpacity'
import useMode from '@/hooks/useMode'
import { useAppSelector } from '@/redux/hooks'
import { setSessions } from '@/redux/slices/sessionsSlice'
import { Session } from '@/types/walletConnect'
import { cloneDeep, ellipsisText, lowercase } from '@/utils/functions'
import WalletKit from '@/utils/walletKit'

import styles from './styles'

const ListConnect = () => {
  const sessions = useAppSelector((state) => state.sessions)
  const dispatch = useDispatch()
  const wallets = useAppSelector((state) => state.wallet)
  const { mode, isDark } = useMode()

  const sessionsSorted = useMemo(() => {
    if (!sessions) return []
    return Object.values(sessions).sort((a, b) => (b.expiry || 0) - (a.expiry || 0))
  }, [sessions])

  const handleDisconnect = (item: Session) => {
    const data = cloneDeep(sessions)
    delete data[item.topic]
    dispatch(setSessions({ ...data }))
    WalletKit.disconnectSession(item.topic)
  }

  const handleDisconnectAll = () => {
    if (!sessions) return
    Object.values(sessions).forEach((session) => {
      WalletKit.disconnectSession(session.topic)
    })
    dispatch(setSessions({}))
  }

  const isVerifiedDomain = (url: string) => {
    // Add your domain verification logic here
    // const verifiedDomains = ['uniswap.org', 'app.uniswap.org', 'metamask.io', 'opensea.io']
    // return verifiedDomains.some((domain) => url.includes(domain))
    return true
  }

  const renderItem = ({ item }: { item: Session }) => {
    const addressConnected = item.namespaces?.eip155?.accounts?.[0].split(':')[2] || ''
    const wallet = wallets.wallets.find((w) => lowercase(addressConnected)?.includes(lowercase(w.address)!))
    const isVerified = isVerifiedDomain(item.peer?.metadata?.url || '')

    return (
      <View style={[styles.sessionCard, styles[`sessionCard${mode}`]]}>
        {/* Header */}
        <View style={styles.sessionHeader}>
          <View style={styles.sessionInfo}>
            {item?.peer?.metadata?.icons?.[0] && <Image style={styles.dappIcon} source={{ uri: item.peer.metadata.icons[0] }} contentFit='cover' />}
            <View style={styles.sessionMeta}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                <ThemedText style={styles.dappName}>{item?.peer?.metadata?.name || 'Unknown DApp'}</ThemedText>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  {isVerified && (
                    <View style={styles.verifiedBadge}>
                      <MaterialIcons name='verified' size={12} color='#FFFFFF' />
                      <ThemedText style={styles.verifiedText}>Verified</ThemedText>
                    </View>
                  )}
                  <TouchableOpacity style={styles.disconnectButton} onPress={() => handleDisconnect(item)}>
                    <AntDesign name='disconnect' size={18} color='#FFFFFF' />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.urlContainer}>
                <ThemedText style={styles.dappUrl}>{item.peer?.metadata?.url || 'Unknown URL'}</ThemedText>
              </View>
            </View>
          </View>
        </View>

        {/* Connection Details */}
        <View style={styles.connectionDetails}>
          {/* Wallet Info */}
          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Ionicons name='wallet-outline' size={20} color={isDark ? '#999999' : '#666666'} />
            </View>
            <View style={styles.detailText}>
              <ThemedText style={styles.detailLabel}>Connected Wallet</ThemedText>
              <ThemedText style={styles.detailValue}>
                {wallet?.name ? `${wallet.name} (${ellipsisText(wallet.address, 6, 8)})` : ellipsisText(addressConnected, 6, 8)}
              </ThemedText>
            </View>
          </View>
        </View>
      </View>
    )
  }

  if (!sessionsSorted.length) {
    return (
      <View style={styles.emptyState}>
        <View style={styles.emptyIcon}>
          <AntDesign name='disconnect' size={64} color={isDark ? '#333333' : '#CCCCCC'} />
        </View>
        <ThemedText style={styles.emptyTitle}>No Active Connections</ThemedText>
        <ThemedText style={styles.emptyDescription}>
          Connect to DApps to see them here. Your wallet connections will be displayed with detailed information about connected networks and
          permissions.
        </ThemedText>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={sessionsSorted}
        renderItem={renderItem}
        keyExtractor={(item) => item.topic}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 100 }}
      />

      {sessionsSorted.length > 0 && (
        <ThemeTouchableOpacity style={styles.disconnectAllButton} onPress={handleDisconnectAll}>
          <ThemedText style={styles.disconnectAllText}>Disconnect All</ThemedText>
        </ThemeTouchableOpacity>
      )}
    </View>
  )
}

export default ListConnect

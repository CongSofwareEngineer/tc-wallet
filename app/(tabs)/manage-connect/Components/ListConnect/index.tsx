import { Image } from 'expo-image'
import React, { useMemo } from 'react'
import { FlatList, View } from 'react-native'
import { useDispatch } from 'react-redux'

import ThemedText from '@/components/UI/ThemedText'
import ThemeTouchableOpacity from '@/components/UI/ThemeTouchableOpacity'
import { useAppSelector } from '@/redux/hooks'
import { setSessions } from '@/redux/slices/sessionsSlice'
import { Session } from '@/types/walletConnect'
import { cloneDeep, ellipsisText, lowercase } from '@/utils/functions'
import WalletKit from '@/utils/walletKit'

const ListConnect = () => {
  const sessions = useAppSelector((state) => state.sessions)
  const dispatch = useDispatch()
  const wallets = useAppSelector((state) => state.wallet)

  console.log({ sessions })

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

  const renderItem = (item: Session) => {
    const addressConnected = item.namespaces?.eip155?.accounts?.[0]

    const wallet = wallets.wallets.find((w) => lowercase(addressConnected)?.includes(lowercase(w.address)!))

    return (
      <View key={item.topic} style={{ padding: 12, borderColor: '#ccc', borderWidth: 1, gap: 10, borderRadius: 12, marginBottom: 30 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, justifyContent: 'space-between' }}>
          {item.peer.metadata?.icons && item.peer.metadata?.icons[0] && (
            <Image style={{ width: 30, height: 30, borderRadius: 25 }} source={{ uri: item.peer.metadata?.icons[0] }} />
          )}
          <ThemeTouchableOpacity onPress={() => handleDisconnect(item)}>
            <ThemedText>Xóa kết nối</ThemedText>
          </ThemeTouchableOpacity>
        </View>
        <ThemedText
          style={{
            fontSize: 20,
          }}
        >
          {item.peer.metadata.name}
        </ThemedText>
        <ThemedText>{item.peer.metadata.url}</ThemedText>
        <ThemedText>{`Address ${wallet?.name ? `(${wallet?.name})` : ''} :`}</ThemedText>
        <ThemedText>{ellipsisText(wallet?.address, 6, 8)}</ThemedText>
      </View>
    )
  }

  return (
    <FlatList
      style={{ gap: 30 }}
      keyExtractor={(item) => item.topic}
      contentContainerStyle={{ paddingBottom: 40 }}
      data={sessionsSorted}
      renderItem={({ item }) => renderItem(item)}
    />
  )
  // return <View>{sessions && Object.values(sessions).map((item) => renderItem(item))}</View>
}

export default ListConnect

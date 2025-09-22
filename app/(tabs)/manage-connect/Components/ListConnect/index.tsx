import { Image } from 'expo-image'
import React from 'react'
import { FlatList, View } from 'react-native'

import ThemedText from '@/components/UI/ThemedText'
import ThemeTouchableOpacity from '@/components/UI/ThemeTouchableOpacity'
import { Session } from '@/types/walletConnect'
import { cloneDeep } from '@/utils/functions'
import { sessionsZustand } from '@/zustand/sessions'

const ListConnect = () => {
  const { sessions, setSessions } = sessionsZustand((state) => state)
  console.log({ sessions, setSessions })

  const handleDisconnect = (item: Session) => {
    const data = cloneDeep(sessions)
    delete data[item.topic]
    setSessions({ ...data })
    // WalletKit.disconnectSession(item.topic)
  }

  const renderItem = (item: Session) => {
    return (
      <View key={item.topic} style={{ padding: 12, borderColor: '#ccc', borderWidth: 1, gap: 10, borderRadius: 12 }}>
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
        <ThemedText
          style={{
            fontSize: 20,
          }}
        >
          {item.peer.metadata.url}
        </ThemedText>
        <ThemedText
          style={{
            fontSize: 20,
          }}
        >
          {item.peer.metadata.description}
        </ThemedText>
      </View>
    )
  }

  return (
    <FlatList
      style={{ gap: 30 }}
      keyExtractor={(item) => item.topic}
      contentContainerStyle={{ paddingBottom: 40 }}
      data={sessions ? Object.values(sessions) : []}
      renderItem={({ item }) => renderItem(item)}
    />
  )
  // return <View>{sessions && Object.values(sessions).map((item) => renderItem(item))}</View>
}

export default ListConnect

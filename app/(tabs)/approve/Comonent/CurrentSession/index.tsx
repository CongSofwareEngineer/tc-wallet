import { Image } from 'expo-image'
import React, { useMemo } from 'react'
import { View } from 'react-native'
import { isAddress } from 'viem'

import ThemedText from '@/components/UI/ThemedText'
import { RequestWC } from '@/redux/slices/requestWC'
import { Session } from '@/types/walletConnect'
import { ellipsisText } from '@/utils/functions'

const CurrentSession = ({ session, params }: { session: Session; params: RequestWC }) => {
  const address = useMemo(() => {
    let address = params?.params?.request.params[0]
    if (isAddress(address)) {
      return address
    }
    return params?.params?.request.params[1]
  }, [params])
  return (
    <View style={{ padding: 12, borderColor: '#ccc', borderWidth: 1, gap: 10, borderRadius: 12, marginBottom: 30 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, justifyContent: 'space-between' }}>
        {session.peer.metadata?.icons && session.peer.metadata?.icons[0] && (
          <Image style={{ width: 30, height: 30, borderRadius: 25 }} source={{ uri: session.peer.metadata?.icons[0] }} />
        )}
        <ThemedText>Address: {ellipsisText(address, 5, 6)}</ThemedText>
      </View>
      <ThemedText
        style={{
          fontSize: 20,
        }}
      >
        {session.peer.metadata.name}
      </ThemedText>
      <ThemedText>{session.peer.metadata.url}</ThemedText>
    </View>
  )
}

export default CurrentSession

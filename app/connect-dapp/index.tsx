import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import ThemedInput from '@/components/UI/ThemedInput'
import ThemedText from '@/components/UI/ThemedText'
import useWallets from '@/hooks/useWallets'
import WalletKit, { TypeWalletKit } from '@/utils/walletKit'

const ConnectDApp = () => {
  const router = useRouter()
  const { wallet } = useWallets()
  const [uri, setUri] = useState('')

  useEffect(() => {
    let walletKit: TypeWalletKit
    const initData = async () => {
      walletKit = await WalletKit.init()

      walletKit.on('session_proposal', (e) => {
        console.log('session_proposal', e)

        const { id, params } = e
      })
    }
    initData()

    return () => {
      if (walletKit) {
        walletKit?.off('session_proposal', () => { })
      }
    }
  }, [])

  const handleConnect = async () => {
    const walletKit = await WalletKit.init()
    walletKit.core.pairing.pair({ uri })
  }

  return (
    <View>
      <TouchableOpacity onPress={() => router.back()}>
        <ThemedText>back</ThemedText>
      </TouchableOpacity>
      <Text>ConnectDApp</Text>
      <ThemedInput value={uri} onChangeText={setUri} />
      <TouchableOpacity onPress={handleConnect}>
        <ThemedText>Connect</ThemedText>
      </TouchableOpacity>
    </View>
  )
}

export default ConnectDApp

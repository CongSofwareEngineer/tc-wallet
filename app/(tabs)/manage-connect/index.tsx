import AntDesign from '@expo/vector-icons/AntDesign'
import React, { useEffect, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'

import ThemedInput from '@/components/UI/ThemedInput'
import ThemedText from '@/components/UI/ThemedText'
import ThemeTouchableOpacity from '@/components/UI/ThemeTouchableOpacity'
import useWallets from '@/hooks/useWallets'
import WalletKit, { TypeWalletKit } from '@/utils/walletKit'

import ListConnect from './Components/ListConnect'
import styles from './styles'

const ManageConnectScreen = () => {
  const [uri, setUri] = useState('')
  const { wallet } = useWallets()

  useEffect(() => {
    let walletKit: TypeWalletKit
    const initData = async () => {
      console.log('initData')

      walletKit = await WalletKit.init()

      walletKit.on('session_proposal', (e) => {
        const { id, params } = e
        const nameSpaces = WalletKit.formatNameSpaceBySessions(params as any, wallet?.address || '')
        WalletKit.onSessionProposal(id, params, nameSpaces)
        setUri('')
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
    walletKit.pair({ uri })
  }

  const handleDisconnectAll = async () => {
    WalletKit.sessionDeleteAll()
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={[styles.container]}>
        <View style={[styles.containerHeader]}>
          <ThemedText>Quản lý kết nối</ThemedText>
          <TouchableOpacity>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <ThemedText>Thêm kết nối</ThemedText>
              <AntDesign name='camera' size={20} color={'white'} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <ThemedInput value={uri} onChangeText={setUri} />
      <ThemeTouchableOpacity onPress={handleConnect}>
        <ThemedText>Connect</ThemedText>
      </ThemeTouchableOpacity>

      <ThemeTouchableOpacity onPress={handleConnect}>
        <ThemedText>Connect</ThemedText>
      </ThemeTouchableOpacity>
      <ThemeTouchableOpacity onPress={handleDisconnectAll}>
        <ThemedText>disconnefct all</ThemedText>
      </ThemeTouchableOpacity>
      <ListConnect />
    </View>
  )
}

export default ManageConnectScreen

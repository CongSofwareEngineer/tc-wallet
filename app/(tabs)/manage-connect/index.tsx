import AntDesign from '@expo/vector-icons/AntDesign'
import React from 'react'
import { FlatList, TouchableOpacity, View } from 'react-native'

import ThemedText from '@/components/UI/ThemedText'
import useWallets from '@/hooks/useWallets'
import { Wallet } from '@/types/wallet'

import styles from './styles'

const ManageConnectScreen = () => {
  const { wallets } = useWallets()
  console.log({ wallets })

  const renderConnect = (item: Wallet) => {
    return (
      <View key={item.address}>
        <ThemedText
          style={{
            fontSize: 20,
          }}
        >
          {item.address}
        </ThemedText>
      </View>
    )
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
      <FlatList
        keyExtractor={(item) => item.address}
        contentContainerStyle={{ paddingBottom: 40 }}
        data={wallets}
        renderItem={({ item }) => renderConnect(item)}
      />
    </View>
  )
}

export default ManageConnectScreen

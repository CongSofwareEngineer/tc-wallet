import { useRouter } from 'expo-router'
import React, { useCallback, useState } from 'react'
import { FlatList, TouchableOpacity, View } from 'react-native'

import ModalWarning from '@/components/ModalWarning'
import ThemedText from '@/components/UI/ThemedText'
import useModal from '@/hooks/useModal'
import { useAppSelector } from '@/redux/hooks'
import ClientServices from '@/services/Client'
import { ChainInfo } from '@/types/web3'

const HomeScreen = () => {
  const router = useRouter()
  const { openModal } = useModal()
  const modals = useAppSelector((state) => state.modals)

  const [listChains, setListChains] = useState<ChainInfo[]>([])
  const [refreshing, setRefreshing] = useState(false)

  const handleCreateWallet = async () => {
    openModal({
      content: (
        <View>
          <ThemedText>Modal from Home</ThemedText>
        </View>
      ),
    })
  }

  const fetchChains = useCallback(async () => {
    const chains = await ClientServices.getAllChains()
    if (Array.isArray(chains)) setListChains(chains)
  }, [])

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true)
      await fetchChains()
    } finally {
      setRefreshing(false)
    }
  }, [fetchChains])

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ThemedText type='subtitle'>Tạo mới hoặc import</ThemedText>

      <ThemedText>HomeScreen</ThemedText>
      <TouchableOpacity onPress={handleCreateWallet}>
        <ThemedText>Press modal</ThemedText>
      </TouchableOpacity>
      <TouchableOpacity onPress={fetchChains}>
        <ThemedText>Fetch on chains</ThemedText>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/create-wallet')}>
        <ThemedText>to create </ThemedText>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/approve')}>
        <ThemedText>Approce </ThemedText>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/connect-account')}>
        <ThemedText>Approce account</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          openModal({
            content: <ModalWarning />,
          })
        }}
      >
        <ThemedText>Modal warning</ThemedText>
      </TouchableOpacity>

      {listChains.length > 0 && (
        <FlatList
          data={listChains.slice(0, 5)}
          refreshing={refreshing}
          onRefresh={onRefresh}
          keyExtractor={(item) => String(item.chainId)}
          contentContainerStyle={{ paddingBottom: 40 }}
          ListEmptyComponent={<ThemedText>Không có dữ liệu</ThemedText>}
          renderItem={({ item }) => (
            <View key={item.chainId} style={{ margin: 10, padding: 10, borderWidth: 1 }}>
              <ThemedText>
                {item.name} - {item.chainId}
              </ThemedText>
              {Array.isArray(item.rpc) && item.rpc.length > 0 && item.rpc.map((r, i) => <ThemedText key={`rpc-${i}`}>RPC: {r.url}</ThemedText>)}
              {/* <ThemedText>RPC: {chain?.rpc}</ThemedText> */}
            </View>
          )}
        />
      )}
    </View>
  )
}

export default HomeScreen

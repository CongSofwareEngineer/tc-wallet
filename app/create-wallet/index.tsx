import { useRouter } from 'expo-router'
import React from 'react'
import { TouchableOpacity, View } from 'react-native'

import ThemedText from '@/components/UI/ThemedText'
import useWallets from '@/hooks/useWallets'
import AllWalletUtils from '@/utils/allWallet'
import { cloneDeep } from '@/utils/functions'

const CreateWalletScreen = () => {
  const router = useRouter()
  const { setWallets, wallets } = useWallets()

  const handleCreateWallet = async () => {
    console.log('handleCreateWallet')

    const arrWallet = cloneDeep(wallets)
    arrWallet.forEach((_, index) => {
      delete arrWallet[index].isDefault
      delete arrWallet[index].name
    })
    const wallet = await AllWalletUtils.createWallet(wallets.length, 0)
    arrWallet.push(wallet)
    setWallets(arrWallet)
    router.replace('/home')
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ThemedText type='subtitle'>Tạo mới hoặc import</ThemedText>

      <TouchableOpacity onPress={handleCreateWallet}>
        <ThemedText>Create Wallet</ThemedText>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.replace('/home')}>
        <ThemedText>to create</ThemedText>
      </TouchableOpacity>
    </View>
  )
}

export default CreateWalletScreen

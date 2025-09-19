import { useRouter } from 'expo-router'
import React from 'react'
import { TouchableOpacity, View } from 'react-native'

import ThemedText from '@/components/UI/ThemedText'
import useWallets from '@/hooks/useWallets'
import { Wallet } from '@/types/wallet'
import { cloneDeep } from '@/utils/functions'
import WalletEvmUtil from '@/utils/walletEvm'

const CreateWalletScreen = () => {
  const router = useRouter()
  const { setWallets, wallets } = useWallets()

  const handleCreateWallet = async () => {
    const arrWallet = cloneDeep(wallets)
    arrWallet.forEach((_, index) => {
      delete arrWallet[index].isDefault
      delete arrWallet[index].name
    })
    const walletNew = await WalletEvmUtil.createWallet(wallets.length, 0)

    const wallet: Wallet = {
      address: walletNew.address,
      type: walletNew.type,
      indexMnemonic: walletNew.indexMnemonic,
      privateKey: walletNew.privateKey,
      indexAccountMnemonic: walletNew.accountIndex,
      isDefault: true,
    }
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

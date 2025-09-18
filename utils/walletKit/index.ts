import { WalletKit } from '@reown/walletkit'
import { WalletKit as TypeWalletKit } from '@reown/walletkit/dist/types/client'
import { Core } from '@walletconnect/core'

let walletKit: TypeWalletKit

export const getWallet = async () => {
  if (walletKit) return walletKit
  const core = new Core({
    projectId: process.env.PROJECT_ID,
  })

  walletKit = await WalletKit.init({
    core, // <- pass the shared `core` instance
    metadata: {
      name: 'Demo React Native Wallet',
      description: 'Demo RN Wallet to interface with Dapps',
      url: 'www.walletconnect.com',
      icons: ['https://your_wallet_icon.png'],
      redirect: {
        native: 'yourwalletscheme://',
      },
    },
  })

  return walletKit
}

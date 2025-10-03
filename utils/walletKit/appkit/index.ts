import { WalletKit as WalletKitCore } from '@reown/walletkit'
import { WalletKit as TypeWallet } from '@reown/walletkit/dist/types/client'
import { Core } from '@walletconnect/core'

export type TypeWalletKit = TypeWallet

class AppKit {
  private static instance: TypeWalletKit | null = null

  static async init(): Promise<TypeWalletKit> {
    if (AppKit.instance) return AppKit.instance

    const core = new Core({
      projectId: '40c7fbd30534a24b3a0c2c92a757a76b',
    })

    AppKit.instance = await WalletKitCore.init({
      core,
      metadata: {
        name: 'Demo React Native Wallet',
        description: 'Demo RN Wallet to interface with Dapps',
        url: 'www.walletconnect.com',
        icons: ['https://your_wallet_icon.png'],
        redirect: { native: 'yourwalletscheme://' },
      },
    })

    try {
      // @ts-ignore internal emitter; lift listener cap
      AppKit.instance.core.relayer.events.setMaxListeners?.(50)
      AppKit.instance.events.setMaxListeners?.(50)
    } catch { }

    return AppKit.instance
  }

  static getInstance(): TypeWalletKit | null {
    return AppKit.instance
  }

  static reset(): void {
    AppKit.instance = null
  }
}

export default AppKit

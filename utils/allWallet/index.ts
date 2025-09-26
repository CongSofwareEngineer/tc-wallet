import { Hex } from 'viem'

import { Wallet } from '@/types/wallet'

import { encodeData } from '../crypto'
import PassPhase from '../passPhare'
import WalletEvmUtil from '../walletEvm'
import WalletSolana from '../walletSolana'

const AllWalletUtils = {
  createWallet: async (accountIndex: number = 0, indexMnemonic = 0): Promise<Wallet> => {
    const mnemonic = await PassPhase.getMnemonic(indexMnemonic)
    const { privateKey } = PassPhase.deriveAccountFromMnemonic(mnemonic, accountIndex)

    const [address, privateKeyEncode, addressSolana] = await Promise.all([
      WalletEvmUtil.createWallet(privateKey),
      encodeData(privateKey),
      WalletSolana.createWallet(privateKey),
    ])

    return {
      address,
      // addressSolana: addressSolana as any,
      privateKey: privateKeyEncode as Hex,
      indexMnemonic,
      indexAccountMnemonic: accountIndex,
      isDefault: true,
    }
  },
  createWalletFromPrivateKey: async (privateKey: Hex): Promise<Wallet> => {
    const [address, privateKeyEncode] = await Promise.all([WalletEvmUtil.createWallet(privateKey), encodeData(privateKey)])

    return {
      address,
      privateKey: privateKeyEncode as Hex,
      indexMnemonic: -1,
      indexAccountMnemonic: -1,
      isDefault: true,
    }
  },
  createWalletFromPassPhrase: async (passPhrase: string, accountIndex: number = 0): Promise<Wallet> => {
    const { privateKey } = PassPhase.deriveAccountFromMnemonic(passPhrase, accountIndex)
    const [address, privateKeyEncode] = await Promise.all([WalletEvmUtil.createWallet(privateKey), encodeData(privateKey)])

    return {
      address,
      privateKey: privateKeyEncode as Hex,
      indexMnemonic: -1,
      indexAccountMnemonic: accountIndex,
      isDefault: true,
    }
  },
}

export default AllWalletUtils

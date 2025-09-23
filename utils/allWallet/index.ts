import { Hex } from 'viem'

import { Wallet } from '@/types/wallet'

import { encodeData } from '../crypto'
import PassPhare from '../passPhare'
import WalletEvmUtil from '../walletEvm'
import WalletSolana from '../walletSolana'

const AllWalletUtils = {
  createWallet: async (accountIndex: number = 0, indexMnemonic = 0): Promise<Wallet> => {
    const mnemonic = await PassPhare.getMnemonic(indexMnemonic)
    const { privateKey } = PassPhare.deriveAccountFromMnemonic(mnemonic, accountIndex)

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
}

export default AllWalletUtils

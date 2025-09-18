import 'react-native-get-random-values';
import { Address, Hex, toHex } from 'viem';

import { KEY_STORAGE } from "@/constants/storage";
import { WalletType } from "@/types/wallet";
import {
  english,
  generateMnemonic,
  mnemonicToAccount,
  type HDAccount
} from 'viem/accounts';
import { getSecureData, saveSecureData } from "../secureStorage";

type DerivedAccount = {
  account: HDAccount
  path: string
  accountIndex: number
}

const WalletEvmUtil = {

  deriveAccountFromMnemonic: (
    mnemonic: string,
    accountIndex: number = 0,
  ): DerivedAccount => {
    const path: `m/44'/60'/${string}` = `m/44'/60'/${accountIndex}'/0/0`
    const account = mnemonicToAccount(mnemonic, { path })
    return { account, path, accountIndex }
  },
  getMnemonic: async (): Promise<string> => {
    const mnemonicLocal = await getSecureData(KEY_STORAGE.Mnemonic) || ''
    if (mnemonicLocal) return mnemonicLocal
    const mnemonic = generateMnemonic(english, 128)
    saveSecureData(KEY_STORAGE.Mnemonic, mnemonic)
    return mnemonic
  },

  createWallet: async (accountIndex: number = 0): Promise<{
    mnemonic: string
    address: Address
    accountIndex: number,
    privateKey: Hex
    type: WalletType
  }> => {
    const mnemonic = await WalletEvmUtil.getMnemonic()

    const { account } = WalletEvmUtil.deriveAccountFromMnemonic(
      mnemonic,
      accountIndex,
    )

    const privateKey = toHex(account.getHdKey().privateKey!)
    const address = account.address
    return { mnemonic, address, accountIndex, privateKey, type: 'evm' }
  },

}

export default WalletEvmUtil;